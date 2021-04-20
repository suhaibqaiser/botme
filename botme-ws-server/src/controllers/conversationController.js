const conversationService = require('../services/conversationService');

async function newConversation(clientToken) {
    return await conversationService.addConversation(clientToken)
}

function addConversationLog(conversationId, query, response) {
    conversationService.addConversationLog(conversationId, query, response)
}

function endConversation(conversationId, rating) {
    conversationService.endConversation(conversationId, rating)
}

async function getConversationId(clientToken) {
    let conversationId = await conversationService.getConversationId(clientToken)
    if (!conversationId) {
        conversationId = await newConversation(clientToken)
    }
    return conversationId;
}

//newConversation('+g8HdQiQJ7IjBkvjtRt8Ipk6CYN/PZPC4lJHCsfDiMk=');
//addConversationLog('aa55e113-555c-4f94-aee2-5531929ba4a7','where is brazil', 'Im sorry, i dont understand you question');
//endConversation('aa55e113-555c-4f94-aee2-5531929ba4a7', 0);

module.exports = ({newConversation, addConversationLog, endConversation, getConversationId})