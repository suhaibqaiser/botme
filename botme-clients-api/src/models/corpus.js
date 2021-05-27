let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CorpusSchema = new Schema(
    {
        corpusId: {type: String, unique: true, index: true},
        active: {type: Boolean, required: true},
        comment: {type: String},
        name: {type: String},
        locale: {type: String},
        data: [{
            type: Object, properties: {
                intent: {type: String},
                utterance: [{type: String}],
                answers: [{
                    answer: {type: String},
                    opts: {type: String}
                }]
            }
        }],
        contextData: {type: Object}
    }
);

module.exports = mongoose.model('Corpus', CorpusSchema);