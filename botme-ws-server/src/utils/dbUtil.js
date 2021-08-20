const mongoose = require("mongoose");
const config = require('../config');
const mongoDBConnection = process.env.MONGODB_CONNECTION || config.connectionString

const clientOption = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 50,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
};

function initDbConnection() {
    mongoose.connect(mongoDBConnection, clientOption);
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB Connection Error>> : "));
    db.once("open", function () {
        console.log("Connected to MongoDB Server");
        }); 
    return db;
}

module.exports = {
    initDbConnection
};