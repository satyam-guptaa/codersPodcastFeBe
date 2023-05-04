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
		//to connect the single client with all the available client
		clients.forEach((clientId) => {
			io.to(clientId).emit(ACTIONS.ADD_PEER, {});
		});
		//to join ourself to the clients list
		socket.emit(ACTIONS.ADD_PEER, {});
		//join the room
		socket.join(roomId);
	});
});

server.listen(PORT, () => console.log(`Listen on ${PORT}`));
