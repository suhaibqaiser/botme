const conversationService = require("../services/conversationService")
const Response = require("../models/response")

async function getConversations(req, res) {
    let response = new Response()

    if (!req.query.sessionId) {
        response.payload = { message: 'sessionId is required' };
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

async function addConversation(req, res) {
    let response = new Response()

    if (!req.body.sessionId) {
        response.payload = { message: 'sessionId is required' };
        return res.status(400).send(response);
    }

    let conversationId = await conversationService.addConversation(req.body.sessionId)

    if (conversationId) {
        response.payload = { "conversationId": conversationId }
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Session or conversations not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

async function addConversationLog(req, res) {
    let response = new Response()

    if (!req.body.conversationId) {
        response.payload = { message: 'conversationId is required' };
        return res.status(400).send(response);
    }

    let conversationLogId = await conversationService.addConversationLog(req.body.conversationId)

    if (conversationLogId) {
        response.payload = { "conversationLogId": conversationLogId }
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Session or conversations not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}


async function updateConversationLog(req, res) {
    let response = new Response()

    if (!req.body.conversationLogId) {
        response.payload = { message: 'conversationLogId is required' };
        return res.status(400).send(response);
    }

    let session = await conversationService.updateConversationLog(req.body.conversationLogId, req.body.param, req.body.value)

    if (session) {
        response.payload = session
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Session or conversations not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

async function endConversation(req, res) {
    let response = new Response()

    if (!req.body.conversationId) {
        response.payload = { message: 'conversationId is required' };
        return res.status(400).send(response);
    }

    let session = await conversationService.endConversation(req.body.conversationId, req.body.rating)

    if (session) {
        response.payload = session
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Session or conversations not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}


async function getConversationId(req, res) {
    let response = new Response()

    if (!req.query.sessionId) {
        response.payload = { message: 'sessionId is required' };
        return res.status(400).send(response);
    }

    let conversationId = await conversationService.getConversationId(req.query.sessionId)

    if (conversationId) {
        response.payload = { "conversationId": conversationId }
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Session or conversations not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

module.exports = ({ getConversations, getConversationId, addConversation, addConversationLog, endConversation, updateConversationLog })