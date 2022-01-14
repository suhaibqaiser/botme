const mongoose = require('mongoose');
const mongodb = require('../utils/mongodb');
const Schema = mongoose.Schema;
const TextToSpeech = new Schema(
    {
        hash: { type: String, required: true, unique: true },
        text: String,
        buffer: String
    }
);

module.exports = mongodb.clientsDB.model('TextToSpeech', TextToSpeech);