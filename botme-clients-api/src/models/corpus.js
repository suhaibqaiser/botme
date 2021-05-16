let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CorpusSchema = new Schema(
    {
        corpusId: {type: String, unique: true, index: true},
        active: {type: Boolean, required: true},
        comment: String,
        name: String,
        locale: String,
        data: [{
            type: Object, properties: {
                intent: {type: String},
                utterance: [String],
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