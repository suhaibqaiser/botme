const Response = require("../models/response")
const nlpService = require('../services/nlpService')
const YAML = require('yaml');


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
    // corpus.corpusId = uuid.v4().toString()
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

async function exportCorpus(req, res) {
    let response = new Response()
    // if (!req.query.corpusId) {
    //     response.payload = "corpusId is required"
    //     response.status = "error"
    //     return res.status(400).send(response)
    // }

    let resp = await nlpService.getCorpusById(req.query.corpusId);
    if (resp) {

        let ymlDoc = {
            "version": "2.0",
            "nlu": []
        }

        resp.nlu.intents.forEach(intent => {
            ymlDoc.nlu.push({
                intent: intent.name,
                examples: intent.examples
            })
        });

        resp.nlu.lookups.forEach(lookup => {
            ymlDoc.nlu.push({
                lookup: lookup.name,
                examples: lookup.examples
            })
        });

        resp.nlu.synonyms.forEach(synonym => {
            ymlDoc.nlu.push({
                synonym: synonym.name,
                examples: synonym.examples
            })
        });

        resp.nlu.regexes.forEach(regex => {
            ymlDoc.nlu.push({
                regex: regex.name,
                examples: regex.examples
            })
        });

        const doc = new YAML.Document();
        doc.contents = ymlDoc;

        response.payload = doc.toString()
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Corpus not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}


async function getMaxCorpusId(req, res) {
    let response = new Response()

    result = await nlpService.getCorpusList();
    let max = 0
    if (result.length > 0) {
        result.forEach(corpus => {
            if (Number(corpus.corpusId) > max) {
                max = Number(corpus.corpusId);
            }
        })
    }

    if (max > 0) {
        response.payload = max
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Corpus not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}


module.exports = ({ getCorpusList, getCorpusById, addCorpus, updateCorpus, exportCorpus, getMaxCorpusId })