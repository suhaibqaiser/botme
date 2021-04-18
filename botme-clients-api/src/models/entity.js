var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EntitySchema = new Schema(
    {
        name: { type: String, unique: true },
        options: { type: Object }
    }
);

module.exports = mongoose.model('Entity', EntitySchema);

