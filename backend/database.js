const mongoose = require('mongoose');
function DbConnect() {
    const DB_URL = process.env.DB_URL;
    mongoose.set('strictQuery', false);
    // Database connection
    mongoose.connect(DB_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('DB connected...');
    });
}

module.exports = DbConnect;