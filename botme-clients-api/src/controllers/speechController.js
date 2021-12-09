const Response = require("../models/response")
const speechService = require('../services/speechService')

async function getTTS(req, res) {
    let response = new Response()
    if (!req.query.hash) {
        response.payload = "TTS hash is required"
        response.status = "error"
        return res.status(200).send(response)
    }

    let resp = await speechService.getTTS(req.query.hash);
    if (resp) {
        response.payload = resp
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Speech hash not found"
        response.status = "error"
        return res.status(200).send(response)
    }
}


async function addTTS(req, res) {
    let response = new Response()
    if (!req.body.tts) {
        response.payload = "Object tts is required"
        response.status = "error"
        return res.status(200).send(response)
    }

    let resp = await speechService.addTTS(req.body.tts);

    if (resp) {
        response.payload = resp
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Speech hash is required"
        response.status = "error"
        return res.status(200).send(response)
    }
}

module.exports = ({ getTTS, addTTS })