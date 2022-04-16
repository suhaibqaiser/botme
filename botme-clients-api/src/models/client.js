var mongoose = require('mongoose');
const mongodb = require('../utils/mongodb');
var Schema = mongoose.Schema;

var ClientsSchema = new Schema(
    {
        clientDeviceId: {type: String, minlength: 3, maxlength: 256, required: true, unique: true},
        clientID: {type: String, minlength: 3, maxlength: 256, required: true},
        clientName: {type: String, minlength: 3, maxlength: 256, required: true},
        clientSecret: {type: String, minlength: 3, maxlength: 256, required: true},
        clientDebug: {type: Boolean},
        clientVoiceEnabled: {type: Boolean},
        clientVoiceTimeout: {type: Number, required: true},
        clientCreated: {type: Date, required: true},
        clientUpdated: {type: Date},
        clientActive: {type: Boolean, required: true},
        clientComment: {type: String},
        restaurantId: {type: String, maxlength: 256, required: true},
        clientEmail: {type: String, maxlength: 256, required: true},
        clientSecretHint: {type: String, minlength: 3, maxlength: 256, required: true},
    }
);

//Export model
module.exports = mongodb.clientsDB.model('Clients', ClientsSchema);
