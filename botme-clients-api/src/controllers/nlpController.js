//let nlplib = require('../utils/nlp/nlp')
//let nlplib = require('../utils/nlp/nlpv3')
const Response = require("../models/response")
const nlpService = require('../services/nlpService')

exports.communicate = async function (req, res) {
    let response = new Response()
    let resp = await nlpService.process('demo', req.body.message);
    if (resp) {
        response.payload = resp[0].text;
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Error in NLP"
        response.status = "error"
        return res.status(404).send(response)
    }
};

exports.train = function (req, res) {
    nlplib.train()
    let success = 'Training complete'
    res.status(200).send(success)
}