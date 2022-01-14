const nlp = require('../models/nlp')

async function getCorpusList() {
    return nlp.Corpus.find({}, {
        "_id": 0,
        "__v": 0
    });
}

async function getCorpusById(corpusId) {
    return nlp.Corpus.findOne({ corpusId: corpusId }, {
        "_id": 0,
        "__v": 0
    });
}

async function getActiveCorpus() {
    return nlp.Corpus.findOne({ active: true }, {
        "_id": 0,
        "__v": 0
    });
}

async function addCorpus(corpus) {
    let resp
    try {
        let cp = new nlp.Corpus(corpus);
        resp = await cp.save();
    }
    catch (err) {
        resp = err
    }
    return resp
}

function updateCorpus(corpus) {
    return nlp.Corpus.findOneAndUpdate({ corpusId: corpus.corpusId }, corpus, {
        "projection": { "_id": 0, "__v": 0 },
        "new": true
    })
}



module.exports = ({ getCorpusById, getCorpusList, addCorpus, updateCorpus, getActiveCorpus })