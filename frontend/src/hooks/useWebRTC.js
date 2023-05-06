import { useRef, useEffect, useCallback } from 'react';
import { useStateWithCallback } from './useStateWithCallback';
import socketInit from '../socket';
import { ACTIONS } from '../action';
import freeice from 'freeice';

export const useWebRTC = (roomId, user) => {
	const [clients, setClients] = useStateWithCallback([]);
	//to store the reference of each audio user for future manupulations, to mute, to lower the volume etc.
	const audioElements = useRef({});
	//storing all the peerconnection
	const connections = useRef({});
	//storing local stream
	const localMediaStream = useRef(null);
	//ref to store socket
	const socket = useRef(null);

	useEffect(() => {
		socket.current = socketInit();
	}, []);

	const provideRef = (instance, userId) => {
		audioElements.current[userId] = instance;
	};

	//when user start sharing their media we need to add new clients with extra checks
	const addNewClient = useCallback(
		(newClient, cb) => {
			const lookingFor = clients.find(
				(client) => client.id === newClient.id
			);
			if (lookingFor === undefined) {
				setClients(
					(existingClients) => [...existingClients, newClient],
					cb
				);
			}
		},
		[clients, setClients]
	);

	//Capture the media of users, mic. Also to store the present client to the room.
	useEffect(() => {
		//capture started
		const startCapture = async () => {
			localMediaStream.current =
				await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
		};
		//after capture start, add current user to the client list
		//after storing the user cb function will run making local volume 0 to not hear ourself and mention the src of the audio
		startCapture().then(() => {
			addNewClient(user, () => {
				const localElement = audioElements.current[user.id];
				if (localElement) {
					localElement.volume = 0;
					localElement.srcObject = localMediaStream.current;
				}
				//we will use socket io to connect the users, which will behave as a medium to send the offer to other client
				//socket emit JOIN
				socket.current.emit(ACTIONS.JOIN, { roomId, user });
			});
		});

		return () => {
			//on leaving the room
			localMediaStream.current
				.getTracks()
				.forEach((track) => track.stop());

			socket.current.emit(ACTIONS.LEAVE, { roomId });
		};
	}, []);

	useEffect(() => {
		const handleNewPeer = async ({
			peerId,
			createOffer,
			user: remoteUser,
		}) => {
			//if already connected then give warning prevent connecting further
			if (peerId in connections.current) {
				return console.warn(
					`You are already connected with ${peerId} as ${user.name}`
				);
			}
			//to let know the public ip of our computer we need freeice and then connection created
			connections.current[peerId] = new RTCPeerConnection({
				iceServers: freeice(),
			});
			//handle new ice candidtate
			connections.current[peerId].onicecandidate = (event) => {
				socket.current.emit(ACTIONS.RELAY_ICE, {
					peerId,
					icecandidate: event.candidate,
				});
			};
			//handle on track on this connection
			connections.current[peerId].ontrack = ({
				streams: [remoteStream],
			}) => {
				addNewClient(remoteUser, () => {
					//if audio player is already there
					if (audioElements.current[remoteUser.id]) {
						audioElements.current[remoteUser.id].srcObject =
							remoteStream;
					} else {
						//to keep check even if there is some delay
						let settled = false;
						const interval = setInterval(() => {
							if (audioElements.current[remoteUser.id]) {
								audioElements.current[remoteUser.id].srcObject =
									remoteStream;
								settled = true;
							}
							if (settled) {
								clearInterval(interval);
							}
						}, 1000);
					}
				});
			};
			//Add local track to remote connections, connecting our media to other clients
			localMediaStream.current.getTracks().forEach((track) => {
				connections.current[peerId].addTrack(
					track,
					localMediaStream.current
				);
			});
			//create offer
			if (createOffer) {
				const offer = await connections.current[peerId].createOffer();
				//send offer to other clients, session discription
				await connections.current[peerId].setLocalDescription(offer);
				socket.current.emit(ACTIONS.RELAY_SDP, {
					peerId,
					sessionDescription: offer,
				});
			}
		};
		socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);
		//cleanup
		return () => {
			socket.current.off(ACTIONS.ADD_PEER);
		};
	}, []);
	//HANDLE ICECANDIDATE
	useEffect(() => {
		socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
			if (icecandidate) {
				connections.current[peerId].addIceCandidate(icecandidate);
			}
		});

		return () => {
			socket.current.off(ACTIONS.ICE_CANDIDATE);
		};
	}, []);
	//HANDLE SDP
	useEffect(() => {
		const handleRemoteSdp = async ({
			peerId,
			sessionDescription: remoteSessionDescription,
		}) => {
			connections.current[peerId].setRemoteDescription(
				new RTCSessionDescription(remoteSessionDescription)
			);
			//if session desc is type of offer then create answer
			if (remoteSessionDescription.type === 'offer') {
				const connection = connections.current[peerId];
				const answer = await connection.createAnswer();
				connection.setLocalDescription(answer);
				socket.current.emit(ACTIONS.RELAY_SDP, {
					peerId,
					sessionDescription: answer,
				});
			}
		};

		socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);

		return () => {
			socket.current.off(ACTIONS.SESSION_DESCRIPTION);
		};
	}, []);

	//HANDLE REMOVE PEER
	useEffect(() => {
		const handleRemovePeer = async ({ peerId, userId }) => {
			if (connections.current[peerId]) {
				connections.current[peerId].close();
				console.log('ran');
			}
			delete connections.current[peerId];
			delete audioElements.current[peerId];
			setClients((list) => list.filter((client) => client.id !== userId));
		};
		socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

		return () => {
			socket.current.off(ACTIONS.REMOVE_PEER);
		};
	}, []);
	return { clients, provideRef };
};
