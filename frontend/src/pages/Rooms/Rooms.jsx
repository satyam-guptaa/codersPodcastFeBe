import React, { useState } from "react";
import styles from "./Rooms.module.css";
import RoomCard from "../../components/RoomCard/RoomCard";
import AddRoomModal from "../../components/AddRoomModal/AddRoomModal";

const Rooms = () => {
	const [showModal, setShowModal] = useState(false);

	const rooms = [
		{
			id: 1,
			topic: "Which framework is best?",
			speakers: [
				{
					id: 1,
					name: "Jhone Doe",
					avatar: "/images/monkey-avatar.png",
				},
				{
					id: 2,
					name: "Heelo Jack",
					avatar: "/images/monkey-avatar.png",
				},
			],
			totalPeople: 40,
		},
		{
			id: 2,
			topic: "Which framework is best?",
			speakers: [
				{
					id: 1,
					name: "Jhone Doe",
					avatar: "/images/monkey-avatar.png",
				},
				{
					id: 2,
					name: "Heelo Jack",
					avatar: "/images/monkey-avatar.png",
				},
			],
			totalPeople: 40,
		},
		{
			id: 3,
			topic: "Which framework is best?",
			speakers: [
				{
					id: 1,
					name: "Jhone Doe",
					avatar: "/images/monkey-avatar.png",
				},
				{
					id: 2,
					name: "Heelo Jack",
					avatar: "/images/monkey-avatar.png",
				},
			],
			totalPeople: 40,
		},
		{
			id: 4,
			topic: "Which framework is best?",
			speakers: [
				{
					id: 1,
					name: "Jhone Doe",
					avatar: "/images/monkey-avatar.png",
				},
				{
					id: 2,
					name: "Heelo Jack",
					avatar: "/images/monkey-avatar.png",
				},
			],
			totalPeople: 40,
		},
		{
			id: 5,
			topic: "Which framework is best?",
			speakers: [
				{
					id: 1,
					name: "Jhone Doe",
					avatar: "/images/monkey-avatar.png",
				},
				{
					id: 2,
					name: "Heelo Jack",
					avatar: "/images/monkey-avatar.png",
				},
			],
			totalPeople: 40,
		},
		{
			id: 6,
			topic: "Which framework is best?",
			speakers: [
				{
					id: 1,
					name: "Jhone Doe",
					avatar: "/images/monkey-avatar.png",
				},
				{
					id: 2,
					name: "Heelo Jack",
					avatar: "/images/monkey-avatar.png",
				},
			],
			totalPeople: 40,
		},
	];

	return (
		<>
			<div className='container'>
				<div className={styles.roomsHeader}>
					<div className={styles.left}>
						<span className={styles.heading}>All voice rooms</span>
						<div className={styles.searchBox}>
							<img src='/images/search-icon.png' alt='search' />
							<input className={styles.searchInput} type='text' />
						</div>
					</div>
					<div className={styles.right}>
						<button
							onClick={() => {
								setShowModal(true);
							}}
							className={styles.startRoomButton}
						>
							<img
								src='/images/add-room-icon.png'
								alt='add room'
							/>
							<span className={styles.startRoomText}>
								Start a room
							</span>
						</button>
					</div>
				</div>
				<div className={styles.roomList}>
					{rooms.map((room) => {
						return <RoomCard key={room.id} room={room} />;
					})}
				</div>
			</div>
			{showModal && <AddRoomModal onClose={() => setShowModal(false)} />}
		</>
	);
};

export default Rooms;
