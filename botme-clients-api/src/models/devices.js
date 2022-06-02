
const mongoose = require('mongoose');

const mongodb = require('../utils/mongodb');

var Schema = mongoose.Schema;
const deviceSchema = new Schema(
  {
    deviceId: {type: String, maxlength: 256, required: true},
    deviceLabel: {type: String, maxlength: 256, required: true},
    deviceName: {type: String, maxlength: 256, required: true},
    deviceType: {type: String, maxlength: 256, required: true},
    deviceDescription: {type: String, maxlength: 800, required: true},
    deviceActive: {type: Boolean, required: true}
  }
);
// }, {
//   versionKey: false
// });
module.exports = mongodb.clientsDB.model('devices', deviceSchema);