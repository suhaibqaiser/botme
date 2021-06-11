let nlplib = require('../utils/nlp/nlp')

exports.communicate = async function (req, res) {
    let retResponse = { message: "", intent: ""}
    let response = await nlplib.process(req.body.message);
    retResponse.message = response.answer;
    retResponse.intent = response.intent;
    retResponse.entities = response.entities;

    res.status(200).send(retResponse)
};

exports.train = function (req, res) {
    nlplib.train()
    let success = 'Training complete'
    res.status(200).send(success)
}