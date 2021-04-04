var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SessionsSchema = new Schema(
  {
    clientID: { type: String, maxlength: 256, required: true },
    clientToken: { type: String, maxlength: 256, required: true },
    sessionCreated: { type: Date, required: true },
    sessionUpdated: { type: Date },
    sessionActive: { type: Boolean, required: true },
  }
);

module.exports = mongoose.model('Sessions', SessionsSchema);