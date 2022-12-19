require('dotenv').config();
const express = require('express');
const router = require('./routes');
const PORT = process.env.PORT || 5500;
const Dbconnect = require('./database');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
const corsOption = {
    credentials: true,
    origin: ['http://localhost:3000'],
}
app.use(cors(corsOption));
app.use('/storage', express.static('storage'))

Dbconnect();
app.use(express.json({ limit: '8mb' }))
app.use(router);

app.get('/', (req, res) => {
    res.send('Hello from express!')
})

app.listen(PORT, () => console.log(`Listen on ${PORT}`))