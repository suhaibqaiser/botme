const conversationService = require('../services/conversationService');

function addConversationLog(conversationId, query, response) {
    conversationService.addConversationLog(conversationId, query, response)
}

function endConversation(conversationId, rating) {
    conversationService.endConversation(conversationId, rating)
}

async function getConversationId(sessionId) {
    let conversationId = await conversationService.getConversationId(sessionId)
    if (!conversationId) {
        conversationId = await conversationService.addConversation(sessionId)
    }

    return conversationId;
}

module.exports = ({ addConversationLog, endConversation, getConversationId })