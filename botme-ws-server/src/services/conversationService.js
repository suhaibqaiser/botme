const mongoose = require('mongoose');
const config = require('../config');
const Session = require('../models/session');
const {v4: uuidv4} = require('uuid');
const mongoDBConnection = process.env.MONGODB_CONNECTION || config.connectionString
try {
    db = mongoose.connect(mongoDBConnection, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
} catch (err) {
    console.log(err)
}

async function addConversation(clientToken) {
    let session;
    try {
        let uniqueConversationId = uuidv4()
        await Session.updateOne(
            {"clientToken": clientToken},
            {
                $push: {
                    "conversations": {
                        conversationId: uniqueConversationId,
                        conversationStart: Date()
                    }
                }
            }
        )
        return uniqueConversationId;
    } catch (err) {
        console.log(err);
        return 400
    }
    // session = await Session.findOne({clientToken: clientToken})
    // let uniqueConversationId = uuidv4()
    // session.conversations.push({
    //     conversationId: uniqueConversationId,
    //     conversationStart: Date()
    // })
    // await session.save();

}

async function addConversationLog(conversationId, query, response) {

    try {
        await Session.updateOne(
            {"conversations.conversationId": conversationId},
            {
                $push: {
                    "conversations.$.conversationLog": {
                        query: query,
                        response: response,
                        timeStamp: Date()
                    }
                }
            }
        )

        return 200
    } catch (err) {
        console.log(err);
        return 400
    }
}

async function endConversation(conversationId, rating) {
    try {
        await Session.updateOne(
            {"conversations.conversationId": conversationId},
            {
                $set: {
                    "conversations.$.conversationEnd": Date(),
                    "conversations.$.conversationRating": rating
                }
            }
        )
        return 200
    } catch (err) {
        console.log(err);
        return 400
    }
}

module.exports = ({addConversation, addConversationLog, endConversation});