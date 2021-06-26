const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TableSchema = new Schema(
    {
        tableId: {type: String, maxlength: 256, required: true, unique: true},
        tableSeats: {type: Number, required: true},
        tableOccupied: {type: Boolean, required: true},
        area : {type: Schema.Types.ObjectId, ref: "Area"}
    }
);

module.exports = mongoose.model('Table', TableSchema);