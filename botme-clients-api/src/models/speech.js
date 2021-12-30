const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TextToSpeech = new Schema(
    {
        hash: { type: String, required: true, unique: true },
        text: String,
        buffer: String
    }
);

module.exports = mongoose.model('TextToSpeech', TextToSpeech);