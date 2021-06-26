const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ConversationSchema = new Schema(
    {
            conversationId: String,
            conversationStart: Date,
            conversationEnd: Date,
            conversationActive: Boolean,
            conversationRating: Number,
            conversationLog: [{
                query: String,
                response: String,
                timeStamp: Date
            }]
        }
)

module.exports = mongoose.model('Conversation', ConversationSchema);