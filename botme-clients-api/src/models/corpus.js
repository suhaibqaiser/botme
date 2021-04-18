let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CorpusSchema = new Schema(
    {
        name: {type: String},
        locale: {type: String},
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