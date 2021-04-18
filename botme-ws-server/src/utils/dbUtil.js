const mongoose = require('mongoose');
const Session = require('../models/session');
const Conversation = require('../models/conversation');
const config = require('../config');
const {v4: uuidv4} = require('uuid');
const mongoDB = process.env.MONGODB_CONNECTION || config.connectionString
try {
    let db = mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
} catch (err) {
    console.log(err)
}

//db.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function getSession(clientToken) {
    let session;
    try {
        session = await Session.findOne({clientToken: clientToken})
    } catch (err) {
        console.log(err);
    }
    return session
}

async function addConversation(clientToken) {
    let session;
    try {
        session = await Session.findOne({clientToken: clientToken})
    } catch (err) {
        console.log(err);
    }
    let uniqueConversationId = uuidv4()
    session.conversations.push({
        conversationId: uniqueConversationId,
        conversationStart: Date()
    })
    await session.save();
    return uniqueConversationId;
}

async function addConversationLog(conversationId, query, response) {

    try {
        let session = await Session.findOne({"conversations.conversationId": conversationId})

        for (i in session.conversations) {
            if (session.conversations[i].conversationId === conversationId) {
                session.conversations[i].conversationLog.push({
                    query: query,
                    response: response,
                    timeStamp: Date()
                })
            }
        }

        await session.save();
        return 200
    } catch (err) {
        console.log(err);
        return 400
    }

}

async function endConversation(conversationId, rating) {
    try {
        let session = await Session.findOne({"conversations.conversationId": conversationId})

        for (i in session.conversations) {
            if (session.conversations[i].conversationId === conversationId) {
                session.conversations[i].conversationEnd = Date()
                session.conversations[i].conversationRating = rating
            }
        }

    await session.save();
    return 200
    } catch (err) {
        console.log(err);
        return 400
    }
}

module.exports = ({getSession, addConversation, addConversationLog, endConversation});