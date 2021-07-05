const Corpus = require('../models/nlp/corpus')

function getCorpusList() {
    return Corpus.find({}, {data: 0, contextData: 0, "_id": 0, "__v": 0},)
}

function getCorpusDetail(corpusId) {
    return Corpus.findOne({corpusId: corpusId}, {"_id": false, "__v": 0})
}

function addCorpus(corpus) {
    let corp = new Corpus(corpus)
    return corp.save()
}

function updateCorpus(corpus) {
    console.log(corpus)
    let corpusId = corpus.corpusId
    return Corpus.findOneAndUpdate({corpusId: corpusId}, corpus, {
        "new": true
    })

}

module.exports = ({getCorpusDetail, getCorpusList, addCorpus, updateCorpus})