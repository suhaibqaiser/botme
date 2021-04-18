const Corpus = require("../models/corpus")

let success = {
    timestamp: Date(),
    error: false,
    payload: null
};

let failure = {
    timestamp: Date(),
    error: true,
    payload: null
};

exports.corpus_list = function (req, res) {
    Corpus.find({}, function (err, corpus) {
        if (err) {
            failure.payload = err;
            res.status(403).send(failure);
        }

        success.payload = corpus;
        res.status(200).send(success);
    });
};

// Display Client create form on POST.
exports.corpus_create = function (req, res) {
    let corpus = new Corpus(req.body);

    corpus.save(function (err) {
        if (err) {
            failure.payload = { err };
            return res.status(403).send(failure);
        }

        success.payload = { corpus }
        res.status(200).send(success);
    });
}
