var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EntitySchema = new Schema(
    {
        name: { type: String, unique: true },
        options: { type: Object },
        regex: { type: Array }
    }
);

module.exports = mongoose.model('Entity', EntitySchema);

