const mongoose = require('mongoose');
const mongodb = require('../utils/mongodb');

const Schema = mongoose.Schema;
const ClientsSchema = new Schema(
    {
        label: {type: String, minlength: 3, maxlength: 256, required: true},
        clientID: {type: String, minlength: 3, maxlength: 256, required: true},
        clientType: {type: String, minlength: 3, maxlength: 256, required: true}, // device, customer, user
        clientSecret: {type: String, minlength: 3, maxlength: 256, required: true},
        restaurantId: {type: String, maxlength: 256, required: true},
        secretHint: {type: String, maxlength: 256, required: true}
    }, {
        versionKey: false
    });


//Export model
module.exports = mongodb.clientsDB.model('Clients', ClientsSchema);
