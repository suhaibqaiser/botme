let mongoose = require('mongoose');
const mongodb = require('../utils/mongodb');
let Schema = mongoose.Schema;

let CorpusSchema = new Schema(
    {
        corpusId: { type: String, unique: true, index: true },
        created: { type: Date, required: true },
        updated: { type: Date },
        active: { type: Boolean, required: true },
        nlu: {
            intents: [{
                name: String,
                examples: [String]
            }],
            lookups: [{
                name: String,
                examples: [String]
            }],
            synonyms: [{
                name: String,
                examples: [String]
            }],
            regexes: [{
                name: String,
                examples: [String]
            }]
        }
    }
);


const Corpus = mongodb.nluDB.model('Corpus', CorpusSchema)


module.exports = ({ Corpus })