const nlplib = require('../utils/nlp/nlp')

exports.communicate = async function (req, res) {

    response = await nlplib.process(req.body.message);
    //console.log(response)
    success = response.answer;
    res.status(200).send(success)
};

exports.train = function (req, res) {
    nlplib.train()
    success = 'Training complete'
    res.status(200).send(success)
}