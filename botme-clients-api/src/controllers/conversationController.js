const conversationService = require("../services/conversationService")
const Response = require("../models/response")

async function getConversations(req, res) {
    let response = new Response()

    if (!req.query.sessionId) {
        response.payload = {message: 'sessionId is required'};
        return res.status(400).send(response);
    }

    let conversations = await conversationService.getConversation(req.query.sessionId)

    if (conversations) {
        response.payload = conversations
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Session or conversations not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

module.exports = ({getConversations})