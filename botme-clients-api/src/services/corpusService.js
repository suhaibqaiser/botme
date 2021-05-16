const Corpus = require('../models/corpus')

function getCorpusList() {
    return Corpus.find({}, {data: 0, contextData: 0, _id: 0, "__v": 0},)
}

function getCorpusDetail(corpusId) {
    return Corpus.findOne({corpusId: corpusId}, {_id: 0, "__v": 0})
}

function addCorpus(corpus) {
    let corp = new Corpus(corpus)
    return corp.save()
}

module.exports = ({getCorpusDetail, getCorpusList, addCorpus})