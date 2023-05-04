import { useState, useRef, useEffect, useCallback } from 'react';
import { useStateWithCallback } from './useStateWithCallback';
import socketInit from '../socket';
import { ACTIONS } from '../action';

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
	}, []);

	return { clients, provideRef };
};
