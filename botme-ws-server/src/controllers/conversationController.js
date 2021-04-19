const convo = require('../services/conversationService');

async function newConversation(clientToken) {
    console.log(await convo.addConversation(clientToken))
}

async function addConversationLog(conversationId, query, response) {
    console.log(await convo.addConversationLog(conversationId, query, response))
}

async function endConversation(conversationId, rating) {
    console.log(await convo.endConversation(conversationId, rating))
}

//newConversation('+g8HdQiQJ7IjBkvjtRt8Ipk6CYN/PZPC4lJHCsfDiMk=');
//addConversationLog('aa55e113-555c-4f94-aee2-5531929ba4a7','where is brazil', 'Im sorry, i dont understand you question');
//endConversation('aa55e113-555c-4f94-aee2-5531929ba4a7', 0);

//module.exports({newConversation, addConversationLog, endConversation})