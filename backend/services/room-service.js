const RoomModel = require('../models/room-model');

class RoomService {
	async create(payload) {
		const { topic, roomType, ownerId } = payload;
		//owner id is by default a speaker as he is creating the room
		const room = await RoomModel.create({
			topic,
			roomType,
			ownerId,
			speaker: [ownerId],
		});
		return room;
	}
}

module.exports = new RoomService();
