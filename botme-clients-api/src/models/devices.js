const mongoose = require('mongoose');

const mongodb = require('../utils/mongodb');

const Schema = mongoose.Schema;
const deviceSchema = new Schema(
    {
        deviceLabel: {type: String, maxlength: 256, required: true},
        deviceName: {type: String, maxlength: 256, required: true},
        deviceDebug: {type: Boolean, required: true},
        deviceIsVoiceEnabled: {type: Boolean, required: true},
        deviceVoiceTime: {type: Number, required: true},
        deviceActive: {type: Boolean, required: true},
        deviceDescription: {type: String, maxlength: 256, required: true},
        deviceEmail: {type: String, maxlength: 256, required: true},
        deviceState: {type: String, maxlength: 256, required: true}, // active, deleted, disabled
        deviceVerificationToken: {type: String, maxlength: 256, required: true},
        deviceRestaurantId: {type: String, maxlength: 256, required: true},
    }, {
        versionKey: false
    });

module.exports = mongodb.clientsDB.model('devices', deviceSchema);
