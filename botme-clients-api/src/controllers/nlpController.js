const Response = require("../models/response")
const nlpService = require('../services/nlpService')


async function getCorpusList(req, res) {
    let response = new Response()

    let resp = await nlpService.getCorpusList();

    if (resp.length != 0) {
        response.payload = resp
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Corpus not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

async function getCorpusById(req, res) {
    let response = new Response()
    if (!req.query.corpusId) {
        response.payload = "corpusId is required"
        response.status = "error"
        return res.status(400).send(response)
    }

    let resp = await nlpService.getCorpusById(req.query.corpusId);
    if (resp) {
        response.payload = resp
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Corpus not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}


async function addCorpus(req, res) {
    let response = new Response()
    if (!req.body.corpus) {
        response.payload = "Object Corpus is required"
        response.status = "error"
        return res.status(400).send(response)
    }

    let corpus = req.body.corpus
    corpus.created = Date()
    corpus.active = true

    let resp = await nlpService.addCorpus(corpus);

    if (resp && resp.name != "MongoError") {
        response.payload = resp
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Error in adding Corpus"
        response.status = "error"
        return res.status(404).send(response)
    }
}


async function updateCorpus(req, res) {
    let response = new Response()
    if (!req.body.corpus) {
        response.payload = "Object Corpus is required";
        return res.status(400).send(response);
    }
    let corpus = req.body.corpus
    corpus.updated = Date()
    let resp = await nlpService.updateCorpus(corpus);
    if (resp) {
        response.payload = resp
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Corpus not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

module.exports = ({ getCorpusList, getCorpusById, addCorpus, updateCorpus })