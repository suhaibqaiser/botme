const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AreaSchema = new Schema(
    {
        areaId: {type: String, maxlength: 256, required: true, unique: true},
        areaName: {type: String, maxlength: 256, required: true, unique: true},
        areaActive: {type: Boolean, required: true},
        restaurant : {type: Schema.Types.ObjectId, ref: "Restaurant"},
        tables : [{type: Schema.Types.ObjectId, ref: "Table"}]
    }
);

module.exports = mongoose.model('Area', AreaSchema);