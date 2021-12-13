const Session = require("../models/session")
// const Conversation = require("../models/nlp/conversation")
const { v4: uuidv4 } = require('uuid')
var ObjectId = require('mongoose').Types.ObjectId;

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

async function addConversationLog(convId) {

    try {
        let session = await Session.findOneAndUpdate(
            { "conversations.conversationId": convId },
            {
                $push: {
                    "conversations.$.conversationLog": {
                        timeStamp: Date(),
                    }
                }
            }, { new: true }
        )

        let conversation = session.conversations[session.conversations.length - 1]
        let conversationLogs = conversation.conversationLog
        let conversationLogId = conversationLogs[conversationLogs.length - 1]._id
        console.log(conversationLogId)

        if (!conversationLogId) {
            return undefined
        }
        return conversationLogId
    } catch (err) {
        console.log(err);
        return undefined
    }
}


async function updateConversationLog(conversationLogId, param, value) {

    try {
        let session = await Session.findOne(
            { "conversations.conversationLog._id": ObjectId(conversationLogId) }
        )

        let conversations = session.conversations
        let inner, outer
        conversations.forEach((conversation) => {
            let conversationLog = conversation.conversationLog
            outer = conversation.conversationId
            conversationLog.forEach((cl) => {
                if (cl._id == conversationLogId) {
                    cl[param] = JSON.stringify(value)
                    inner = cl
                }
            })
        })

        console.log(inner)

        let uSession = await Session.updateOne({ "conversations.conversationLog._id": ObjectId(conversationLogId) },
            {
                $set: {
                    "sessionUpdated": Date(),
                    "conversations.$[outer].conversationLog.$[inner]": inner
                }
            }, {
            arrayFilters: [
                { "outer.conversationId": outer },
                { "inner._id": inner._id }
            ]
        })

        if (!uSession) {
            return undefined
        }
        return uSession
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
        return conversation.conversations[conversation.conversations - 1].conversationId
    } else {
        return await addConversation(sessionId)
    }
}

module.exports = ({ getConversation, addConversation, addConversationLog, endConversation, getConversationId, updateConversationLog })
