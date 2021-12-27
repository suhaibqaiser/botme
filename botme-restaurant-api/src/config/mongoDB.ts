const mongoose = require("mongoose");
const mongoDBConnection = process.env.MONGODB_CONNECTION || 'mongodb+srv://mongoUser:1t3jWnpoC0imAM4d@cluster0.tipo5.mongodb.net?retryWrites=true&w=majority';
const conf = require('config');

const connectionOptions = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 50,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
};

function initDbConnection() {
    mongoose.connect(mongoDBConnection, connectionOptions);
    mongoose.set('useCreateIndex', true);
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB Connection Error>> : "));
    db.once("open", function () {
        console.log("Connected to MongoDB Server");
    });
    return db;
}

const foodDB = mongoose.connection.useDb(conf.get('foodDB'));
const dictionaryDB = mongoose.connection.useDb(conf.get('dictionaryDB'));

async function init() {
    await initDbConnection();
}

export { init, foodDB, dictionaryDB };