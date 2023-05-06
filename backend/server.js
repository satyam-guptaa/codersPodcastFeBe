require('dotenv').config();
const express = require('express');
const router = require('./routes');
const PORT = process.env.PORT || 5500;
const Dbconnect = require('./database');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const server = require('http').createServer(app);
const ACTIONS = require('./action');
const io = require('socket.io')(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});

app.use(cookieParser());
const corsOption = {
	credentials: true,
	origin: ['http://localhost:3000'],
};
app.use(cors(corsOption));
app.use('/storage', express.static('storage'));

Dbconnect();
app.use(express.json({ limit: '8mb' }));
app.use(router);

app.get('/', (req, res) => {
	res.send('Hello from express!');
});

//Sockets
//to track which socket id is connected to which user
const socketUserMapping = {};

io.on('connection', (socket) => {
	console.log('new connection', socket.id);

	socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
		socketUserMapping[socket.id] = user;
		//getting all the clients in a particular roon or connecting first time
		//new Map
		const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
		//to connect the single client with all the available client, telling client to join me
		//no need to create offer I will create it just join me with my id and my user details
		clients.forEach((clientId) => {
			io.to(clientId).emit(ACTIONS.ADD_PEER, {
				peerId: socket.id,
				createOffer: false,
				user,
			});
			//to join ourself with each of the client already present and creating offer to each of them, emitting event to ourself creating offer to each client available in the room
			socket.emit(ACTIONS.ADD_PEER, {
				peerId: clientId,
				createOffer: true,
				user: socketUserMapping[clientId],
			});
		});
		//join the room
		socket.join(roomId);
	});
	//Handle relay ice
	socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
		io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
			peerId: socket.id,
			icecandidate,
		});
	});
	//handle relay sdp(session description)
	socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
		io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
			peerId: socket.id,
			sessionDescription,
		});
	});
	//leaving the room handle
	const leaveRoom = ({ roomId }) => {
		const { rooms } = socket;
		Array.from(rooms).forEach((roomId) => {
			const clients = Array.from(
				io.sockets.adapter.rooms.get(roomId) || []
			);
			console.log('rannn');
			//to each client
			clients.forEach((clientId) => {
				io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
					peerId: socket.id,
					userId: socketUserMapping[socket.id]?.id,
				});
				//to ourself
				socket.emit(ACTIONS.REMOVE_PEER, {
					peerId: clientId,
					userId: socketUserMapping[clientId]?.id,
				});
			});
			socket.leave(roomId);
		});
		delete socketUserMapping[socket.id];
	};
	socket.on(ACTIONS.LEAVE, leaveRoom);
	//when we directly close browser
	socket.on('disconnecting', leaveRoom);
	//handle remove peer
});

server.listen(PORT, () => console.log(`Listen on ${PORT}`));
