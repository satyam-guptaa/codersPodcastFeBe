import React, { useState } from 'react';
import styles from './AddRoomModal.module.css';
import TextInput from '../shared/TextInput/TextInput';
import { useNavigate } from 'react-router-dom';
import { createRoom as create } from '../../http';

function AddRoomModal({ onClose }) {
	const navigate = useNavigate();
	const [roomType, setRoomType] = useState('open');
	const [topic, setTopic] = useState('');

	const createRoom = async () => {
		//server call
		try {
			if (!topic) return;
			const { data } = await create({ topic, roomType });
			navigate(`/room/${data.id}`);
		} catch (err) {
			console.log(err.message);
		}
	};

	return (
		<div className={styles.modalMask}>
			<div className={styles.modalBody}>
				<button
					className={styles.closeButton}
					onClick={onClose}
				>
					<img
						src='/images/close.png'
						alt=''
					/>
				</button>
				<div className={styles.modalHeader}>
					<h3 className={styles.heading}>
						Enter the topic to be discussed
					</h3>
					<TextInput
						fullwidth='true'
						value={topic}
						onChange={(e) => {
							setTopic(e.target.value);
						}}
					/>
					<h2>Room type</h2>
					<div className={styles.roomTypes}>
						<div
							onClick={() => {
								setRoomType('open');
							}}
							className={`${styles.typeBox} ${
								roomType === 'open' ? styles.active : ''
							}`}
						>
							<img
								src='/images/globe.png'
								alt='globe'
							/>
							<span>Open</span>
						</div>
						<div
							onClick={() => {
								setRoomType('social');
							}}
							className={`${styles.typeBox} ${
								roomType === 'social' ? styles.active : ''
							}`}
						>
							<img
								src='/images/social.png'
								alt='social'
							/>
							<span>Social</span>
						</div>
						<div
							onClick={() => {
								setRoomType('closed');
							}}
							className={`${styles.typeBox} ${
								roomType === 'closed' ? styles.active : ''
							}`}
						>
							<img
								src='/images/lock.png'
								alt='lock'
							/>
							<span>Closed</span>
						</div>
					</div>
				</div>
				<div className={styles.modalFooter}>
					<h2>Start a room, open to everyone</h2>
					<button
						className={styles.goButton}
						onClick={createRoom}
					>
						<img
							src='/images/celebration.png'
							alt='hurray'
						/>
						<span>Let's Go</span>
					</button>
				</div>
			</div>
		</div>
	);
}
export default AddRoomModal;
