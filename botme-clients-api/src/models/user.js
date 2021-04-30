const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema(
    {
        userId: {type: String, maxlength: 256, required: true, unique: true},
        userName: {type: String, maxlength: 256, required: true, unique: true},
        userSecret: {type: String, maxlength: 256, required: true},
        userEmail: {type: String},
        userToken: String,
        userCreated: {type: Date, required: true},
        userUpdated: {type: Date},
        userActive: {type: Boolean, required: true},
        userComment: {type: String}
    }
);

module.exports = mongoose.model('User', UserSchema);

