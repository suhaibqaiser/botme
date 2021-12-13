const sessionService = require("../services/sessionService")
const { v4: uuidv4 } = require('uuid');
const Response = require("../models/response")

// Rest Controllers
async function getSessionList(req, res) {
    let response = new Response()

    let active = req.query.activeOnly
    let sessions

    if (active === "true") {
        sessions = await sessionService.getActiveSessionList()
    } else if (!active) {
        sessions = await sessionService.getSessionList()
    } else {
        response.payload = "Query string not properly formatted"
        response.status = "error"
        return res.status(400).send(response)
    }

    if (sessions) {
        response.payload = sessions
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Sessions not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

async function getSessionDetails(req, res) {
    let response = new Response()
    if (!req.query.sessionId) {
        response.payload = { message: 'sessionId is required' };
        return res.status(400).send(response);
    }
    let session = await sessionService.getSessionDetails(req.query.sessionId)
    if (session) {
        response.payload = session
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Session not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

// Normal Controllers
async function createSession(session) {
    session.sessionId = uuidv4()
    session.sessionCreated = Date()
    session.sessionUpdated = null
    session.sessionActive = true
    return sessionService.createSession(session)
}

async function getSessionByToken(req, res) {
    let response = new Response()
    if (!req.query.clientToken) {
        response.payload = { message: 'clientToken is required' };
        return res.status(400).send(response);
    }
    let session = await sessionService.getSessionByToken(req.query.clientToken)
    if (session) {
        response.payload = session
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Session not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

async function updateSessionActive(req, res) {
    let response = new Response()
    if (!req.body.sessionId) {
        response.payload = { message: 'sessionId is required' };
        return res.status(400).send(response);
    }
    let session = await sessionService.updateSessionActive(req.body.sessionId)
    if (session) {
        response.payload = session
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Session not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

module.exports = ({ createSession, getSessionByToken, getSessionDetails, updateSessionActive, getSessionList })