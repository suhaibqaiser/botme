const session = require("../controllers/sessionsController");
const Request = require("../models/request");
const Response = require("../models/response");
const commService = require("../services/communicationService");
const commandService = require("../services/commandService");
const answeringService = require('../services/answeringService');
const conversationController = require("../controllers/conversationController")
const communicationService = require('../services/communicationService')

// Main entry point for processing communication
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
        console.log('request =>', request.sectionId, request.pageId)
        let reply = await processConversation(request, request.authToken);
        response.message = reply.payload;
        response.status = reply.status;
    } else {
        response.message = sessionStatus.payload;
        response.status = sessionStatus.status;
    }
    return response;
}


async function processConversation(request, clientToken) {
    let response = {
        status: "",
        payload: ""
    };

    let communication = await processMessage(request)
    if (communication.status === 'error') {
        response.status = communication.status
    } else {
        response.status = communication.status
        response.payload = communication.payload
    }

    let conversationId = await conversationController.getConversationId(clientToken)
    console.log(communication.intent)
    if (communication.intent === 'conversation.end') {
        conversationController.addConversationLog(conversationId, request.message_text, communication.payload)
        conversationController.endConversation(conversationId, 0)
    } else {
        conversationController.addConversationLog(conversationId, request.message_text, communication.payload)
    }
    return response
}

async function processMessage(request) {
    let response = {
        status: "",
        payload: ""
    };
    let textToSpeech = await communicationService.getSpeechToText(request.message_text)
    console.log('textToSpeech =>', textToSpeech)
    console.log('pageId =>',request.pageId)
    console.log('sectionId =>',request.sectionId)
    let message = await answeringService.generateAnswer(textToSpeech, request.pageId, request.sectionId);
    if (message) {
        response.payload = message;
        //response.intent = message.intent;
        response.status = "success";
    } else {
        response.status = "error";
        response.payload = "Error: There is an error in communication api";
    }
    return response;
}

module.exports = {processCommunication, processMessage};
