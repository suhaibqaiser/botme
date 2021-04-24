const Session = require("../models/session")
const Conversation = require("../models/conversation")

async function getConversation(sessionId) {

    let session = await Session.findOne({sessionId: sessionId})

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

module.exports = ({getConversation})