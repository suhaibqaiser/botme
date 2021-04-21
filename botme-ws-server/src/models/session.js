const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SessionsSchema = new Schema(
    {
        clientID: {type: String, maxlength: 256, required: true},
        clientToken: {type: String, maxlength: 256, required: true, unique: true, index: true},
        sessionCreated: {type: Date, required: true},
        sessionUpdated: {type: Date},
        sessionActive: {type: Boolean, required: true},
        conversations: [{
            conversationId: {type: String, index: true, unique: true},
            conversationStart: Date,
            conversationEnd: Date,
            conversationActive: Boolean,
            conversationRating: Number,
            conversationLog: [{
                query: String,
                response: String,
                timeStamp: Date
            }]
        }]
    }
);

module.exports = mongoose.model('Sessions', SessionsSchema);