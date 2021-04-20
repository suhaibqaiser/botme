const Session = require('../models/session');
const {v4: uuidv4} = require('uuid');

async function addConversation(clientToken) {
    try {
        let uniqueConversationId = uuidv4()
        await Session.updateOne(
            {"clientToken": clientToken},
            {
                $push: {
                    "conversations": {
                        conversationId: uniqueConversationId,
                        conversationStart: Date(),
                        conversationActive: true
                    }
                }
            }
        )
        return uniqueConversationId;
    } catch (err) {
        console.log(err);
        return 400
    }
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
                    "conversations.$.conversationActive": false,
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

async function getConversationId(clientToken) {
    let conversation = await Session.findOne({
        "clientToken": clientToken,
        "conversations.conversationActive": true
    }, {"conversations.conversationId.$": 1});
    if (conversation) {
        return conversation.conversations[0].conversationId
    } else {
        return null
    }
}

module.exports = ({addConversation, addConversationLog, endConversation, getConversationId});