import React, { useState } from 'react';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './Room.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getRoom } from '../../http';

const Room = () => {
	const { id: roomId } = useParams();
	const user = useSelector((state) => state.auth.user);
	const [room, setRoom] = useState(null);
	const [isMute, setMute] = useState(true);
	const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
	const navigate = useNavigate();

	const handleManualLeave = () => {
		navigate('/rooms');
	};

	const handleMuteClick = (clientId) => {
		//if not your mic then do nothing
		if (clientId !== user.id) return;
		setMute((isMute) => !isMute);
	};

	useEffect(() => {
		handleMute(isMute, user.id);
	}, [isMute]);

	useEffect(() => {
		const fetchRoom = async () => {
			const { data } = await getRoom(roomId);
			setRoom((prevState) => data);
		};
		fetchRoom();
	}, [roomId]);

	return (
		<div>
			<div className='container'>
				<button
					className={styles.goBack}
					onClick={handleManualLeave}
				>
					<img
						src='/images/arrow-left.png'
						alt='left'
					/>
					<span>All voice rooms</span>
				</button>
			</div>
			<div className={styles.clientsWrap}>
				<div className={styles.clientsHeader}>
					<h2 className={styles.clientsTopic}>{room?.topic}</h2>
					<div className={styles.actionButtons}>
						<button className={styles.actionBtn}>
							<img
								src='/images/palm.png'
								alt=''
							/>
						</button>
						<button
							className={styles.actionBtn}
							onClick={handleManualLeave}
						>
							<img
								src='/images/win.png'
								alt=''
							/>
							<span>Leave Quietly</span>
						</button>
					</div>
				</div>
				<div className={styles.clientsList}>
					{clients.map((client) => {
						return (
							<div
								className={styles.client}
								key={client.id}
							>
								<div className={styles.userHead}>
									<audio
										ref={(instance) =>
											provideRef(instance, client.id)
										}
										autoPlay
									></audio>
									<img
										className={styles.userAvatar}
										src={client.avatar}
										alt='avatar'
									/>
									<button
										onClick={() =>
											handleMuteClick(client.id)
										}
										className={styles.micBtn}
									>
										{console.log(
											client.muted,
											'client muted',
											isMute,
											'local state'
										)}
										{client.muted ? (
											<img
												src='/images/mic-mute.png'
												alt='mute mic'
											/>
										) : (
											<img
												src='/images/mic.png'
												alt='mic'
											/>
										)}
									</button>
								</div>
								<h4>{client.name}</h4>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Room;
