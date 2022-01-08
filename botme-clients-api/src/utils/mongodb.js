const conf = require('config')
const mongoose = require('mongoose');

console.log(process.env.NODE_ENV)
console.log(conf.get('clientsDB'))

//Set up mongoose connection
const mongoDBConnection = process.env.MONGODB_CONNECTION || 'mongodb+srv://mongoUser:1t3jWnpoC0imAM4d@cluster0.tipo5.mongodb.net?retryWrites=true&w=majority';

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

const clientsDB = mongoose.connection.useDb(conf.get('clientsDB'), connectionOptions);
const foodDB = mongoose.connection.useDb(conf.get('foodDB'), connectionOptions);
const nluDB = mongoose.connection.useDb(conf.get('nluDB'), connectionOptions);

async function init() {
    await initDbConnection();
}

module.exports = ({ init, foodDB, clientsDB, nluDB })