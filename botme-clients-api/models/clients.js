var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClientsSchema = new Schema(
  {
    clientDeviceId: { type: String, maxlength: 256, required: true },
    clientID: { type: String, maxlength: 256, required: true },
    clientSecret: { type: String, maxlength: 256, required: true },
    clientCreated: { type: Date, required: true },
    clientUpdated: { type: Date },
    clientActive: { type: Boolean, required: true },
    clientComment: { type: String }
  }
);

// Virtual for client's URL
ClientsSchema
  .virtual('url')
  .get(function () {
    return '/client/' + this._id;
  });

//Export model
module.exports = mongoose.model('Clients', ClientsSchema);

