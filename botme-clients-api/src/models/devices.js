const mongoose = require('mongoose');

const mongodb = require('../utils/mongodb');

const Schema = mongoose.Schema;
const deviceSchema = new Schema(
    {
        label: {type: String, maxlength: 256, required: true},
        name: {type: String, maxlength: 256, required: true},
        debug: {type: Boolean, required: true},
        isVoiceEnabled: {type: Boolean, required: true},
        voiceTime: {type: Number, required: true},
        active: {type: Boolean, required: true},
        description: {type: String, maxlength: 256, required: true},
        email: {type: String, maxlength: 256, required: true},
        emailVerified: {type: Boolean, required: true},
        state: {type: String, maxlength: 256, required: true}, // active, deleted, disabled
        verificationToken: {type: String, maxlength: 256, required: true}
    }, {
        versionKey: false
    });

module.exports = mongodb.clientsDB.model('devices', deviceSchema);
