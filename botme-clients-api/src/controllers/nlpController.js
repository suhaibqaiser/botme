const nlplib = require('../utils/nlp/nlp')

exports.communicate = async function (req, res) {
    retResponse = { message: "", status: "" }
    response = await nlplib.process(req.body.message);
    retResponse.message = response.answer;

    if (response.intent.includes('query') && response.entities.length === 1) {
        retResponse.status = "success"
    }
    else {
        retResponse.status = "error"
    }

    res.status(200).send(retResponse)
};

exports.train = function (req, res) {
    nlplib.train()
    success = 'Training complete'
    res.status(200).send(success)
}