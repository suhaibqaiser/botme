const dbUtil = require('../utils/dbUtil');

async function newConversation(clientToken) {
    console.log(await dbUtil.addConversation(clientToken))
}

async function addConversationLog(conversationId, query, response) {
    console.log(await dbUtil.addConversationLog(conversationId, query, response))
}

async function endConversation(conversationId, rating) {
    console.log(await dbUtil.endConversation(conversationId, rating))
}

//newConversation('VY7oV9S4EsT+59Gf4suCvsDQ5B1KCl6AUJH7/jA9BaQ=');
//addConversationLog('56a01f07-2297-408c-82e0-1940aac8511f','where is terminal 10', 'Terminal 10 is on the right 50 steps away');
//endConversation('56a01f07-2297-408c-82e0-1940aac8511f', 4);

//module.exports({newConversation, addConversationLog, endConversation})