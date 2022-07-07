const mongoose = require('mongoose');
const mongodb = require('../utils/mongodb');
const Schema = mongoose.Schema;
const UserSchema = new Schema(
        {
                userId: { type: String, maxlength: 256, required: true, unique: true },
                userName: { type: String, maxlength: 256, required: true, unique: true },
                userSecret: { type: String, maxlength: 256, required: true },
                userFullName: String,
                userEmail: { type: String },
                userToken: String,
                userCreated: { type: Date, required: true },
                userUpdated: { type: Date },
                userActive: { type: Boolean, required: true },
                userComment: { type: String },
                restaurantId: { type: String },
                userRole: {type: String},
                notificationType: {type: String},
                notificationState: {type: Boolean},
        }
);

module.exports = mongodb.clientsDB.model('User', UserSchema);

