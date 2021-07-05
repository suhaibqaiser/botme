const mongoose = require("mongoose");
const mongoDBConnection = process.env.MONGODB_CONNECTION || 'mongodb+srv://mongoUser:1t3jWnpoC0imAM4d@cluster0.tipo5.mongodb.net/clients?retryWrites=true&w=majority';

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

async function init() {
    await initDbConnection();
};

export {init};