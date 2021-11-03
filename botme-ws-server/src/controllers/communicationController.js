const Request = require("../models/request");
const Response = require("../models/response");
const answeringService = require('../services/answeringService');
const conversationController = require("../controllers/conversationController")


// Main entry point for processing communication
async function processMessage(sessionId, conversationId, payload) {
    let response = new Response();

    if (!payload) {
        response.status = "error";
        response.message = "Error: Cannot process empty request";
        return response
    }

    let request = new Request(payload);

    if (!request.text) {
        response.status = "error";
        response.message = "Error: Request not properly formatted";
        return response
    }

    let message = await answeringService.generateAnswer(request.text, request.pageId, request.sectionId);
    if (message === undefined) {
        response.status = "error";
        response.payload = "Error: There is an error in communication api";
        return
    }
    
    (!conversationId) ? message.conversationId = await conversationController.getConversationId(sessionId) : message.conversationId = conversationId
    conversationController.addConversationLog(message.conversationId, request.text, message.text)

    response.message = message;
    response.status = "success";

    return response;
}


module.exports = { processMessage };
