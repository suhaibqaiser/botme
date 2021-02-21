var mongoose = require('mongoose');
var Session = require('../models/session');

var mongoDB = process.env.MONGODB_CONNECTION || 'mongodb+srv://mongoUser:1t3jWnpoC0imAM4d@cluster0.tipo5.mongodb.net/clients?retryWrites=true&w=majority';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function getSession(authToken, callback) {
    try {
        Session.findOne({ clientToken: authToken }, function (err, session) {
            if (err) console.log(err);

            return callback(session);
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = ({ getSession });