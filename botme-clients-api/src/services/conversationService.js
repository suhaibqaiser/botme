const Session = require("../models/session")
const Conversation = require("../models/nlp/conversation")

async function getConversation(sessionId) {

    let session = await Session.findOne({ sessionId: sessionId })

    if (!session) {
        return null
    }

    let conversations = session.conversations
    let conversationArray = []

    for (let c in conversations) {
        let returnConversation = {
            conversationId: conversations[c].conversationId,
            conversationStart: conversations[c].conversationStart,
            conversationEnd: conversations[c].conversationEnd,
            conversationActive: conversations[c].conversationActive,
            conversationRating: conversations[c].conversationRating,
            conversationLog: []
        }
        for (let l in conversations[c].conversationLog) {
            let conversationLog = {
                query: '',
                response: '',
                timeStamp: ''
            }
            conversationLog.response = conversations[c].conversationLog[l].response
            conversationLog.query = conversations[c].conversationLog[l].query
            conversationLog.timeStamp = conversations[c].conversationLog[l].timeStamp
            returnConversation.conversationLog.push(conversationLog)
        }
        conversationArray.push(returnConversation)
    }
    return conversationArray
}

async function addConversation(sessionId) {
    try {
        let uniqueConversationId = uuidv4()
        let session = await Session.updateOne(
            { "sessionId": sessionId },
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
        if (!session) {
            return undefined
        }
        return uniqueConversationId;
    } catch (err) {
        console.log(err);
        return undefined
    }
}

async function addConversationLog(conversationId, query, response) {

    try {
        let session = await Session.updateOne(
            { "conversations.conversationId": conversationId },
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

        if (!session) {
            return undefined
        }
        return session
    } catch (err) {
        console.log(err);
        return undefined
    }
}

async function endConversation(conversationId, rating) {
    try {
        let session = await Session.updateOne(
            { "conversations.conversationId": conversationId },
            {
                $set: {
                    "conversations.$.conversationEnd": Date(),
                    "conversations.$.conversationActive": false,
                    "conversations.$.conversationRating": rating
                }
            }
        )
        if (!session) {
            return undefined
        }
        return session
    } catch (err) {
        console.log(err);
        return undefined
    }
}

async function getConversationId(sessionId) {
    let conversation = await Session.findOne({
        "sessionId": sessionId,
        "conversations.conversationActive": true
    }, { "conversations.conversationId.$": 1 });
    if (conversation) {
        return conversation.conversations[0].conversationId
    } else {
        return null
    }
}

module.exports = ({ getConversation, addConversation, addConversationLog, endConversation, getConversationId })