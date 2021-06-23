const session = require("../controllers/sessionsController");
const Request = require("../models/request");
const Response = require("../models/response");
const commService = require("../services/communicationService");
const conversationController = require("../controllers/conversationController")

async function processCommunication(payload) {
    let response = new Response();

    if (!payload) {
        response.status = "error";
        response.message = "Error: Cannot process empty request";
        return response
    }
    let request = new Request(payload);

    if (!request.message_text) {
        response.status = "error";
        response.message = "Error: Request not properly formatted";
        return response
    }

    if (!request.authToken) {
        response.status = "error";
        response.message = "Error: Authentication token not found";
        return response
    }

    let sessionStatus = await session.validateSession(request.authToken);
    if (
        sessionStatus.status === "success" &&
        sessionStatus.payload === true
    ) {
        let reply = await processConversation(request.message_text, request.authToken);
        response.message = reply.payload;
        response.status = reply.status;
    } else {
        response.message = sessionStatus.payload;
        response.status = sessionStatus.status;
    }
    return response;
}

async function processConversation(message, clientToken) {
    let response = {
        status: "",
        payload: ""
    };

    let communication = await processMessage(message)
    if (communication.status === 'error') {
        response.status = communication.status
    } else {
        response.status = communication.status
        response.payload = communication.payload
    }

    let conversationId = await conversationController.getConversationId(clientToken)
    console.log(communication.intent)
    if (communication.intent === 'conversation.end') {
        conversationController.addConversationLog(conversationId, message, communication.payload)
        conversationController.endConversation(conversationId,0)
    } else {
        conversationController.addConversationLog(conversationId, message, communication.payload)
    }
    return response
}

async function processMessage(text) {
    let response = {
        status: "",
        payload: ""
    };

    let message = await commService.process(text);
    if (message) {
        response.payload = message.payload;
        //response.intent = message.intent;
        response.status = message.status;
    } else {
        response.status = "error";
        response.payload = "Error: There is an error in communication api";
    }
    return response;
}

module.exports = {processCommunication};
