const Corpus = require("../models/corpus")
const Response = require("../models/response")
const corpusService = require('../services/corpusService')

async function corpus_list(req, res) {
    let response = new Response()

    let corpus = await corpusService.getCorpusList()

    if (corpus) {
        response.payload = corpus
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Corpus not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

function convertArrayToObject(array, key) {
    let arr = []
    for (let i = 0; i < array.length; i++) {
        arr.push({[key]: array[i]})
    }
    return arr
};

async function corpus_detail(req, res) {
    let response = new Response()

    if (!req.query.corpusId) {
        response.payload = {message: 'corpusId is required'};
        return res.status(400).send(response);
    }
    let corpus = Corpus(await corpusService.getCorpusDetail(req.query.corpusId))

    if (corpus) {
        for (let i = 0; i < corpus.data.length; i++) {
            corpus.data[i].utterances = convertArrayToObject(corpus.data[i].utterances, 'phrase')
        }
        response.payload = {corpus}
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Corpus not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

async function corpus_create(req, res) {
    let response = new Response()

    if (!req.body.corpusId) {
        response.payload = {message: 'corpusId is required'};
        return res.status(400).send(response);
    }
    let corpus = await corpusService.addCorpus(req.body)

    if (corpus) {
        response.payload = {corpus}
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Corpus not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

module.exports = ({corpus_detail, corpus_list, corpus_create})