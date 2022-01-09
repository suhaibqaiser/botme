const mongoose = require('mongoose');
const mongodb = require('../utils/mongodb');
const Schema = mongoose.Schema;

let SessionSchema = new Schema(
    {
        clientID: { type: String, maxlength: 256, required: true },
        clientToken: { type: String, maxlength: 256, required: true, unique: true, index: true },
        sessionId: { type: String, maxlength: 256, required: true, index: true },
        sessionCreated: { type: Date, required: true },
        sessionUpdated: { type: Date },
        sessionActive: { type: Boolean, required: true, index: true },
        conversations: [{
            conversationId: { type: String, index: true, sparse: true },
            conversationStart: Date,
            conversationEnd: Date,
            conversationActive: Boolean,
            conversationRating: Number,
            conversationLog: [{
                query: String,
                response: String,
                timeStamp: Date,
                socketInput: String,
                socketOutput: String,
            }]
        }]
    }
);

module.exports = mongodb.clientsDB.model('Session', SessionSchema);