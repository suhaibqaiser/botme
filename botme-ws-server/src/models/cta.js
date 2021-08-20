const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CtaSchema = new Schema(
    {
        productId: {type: String, maxlength: 256, required: true, unique: true, index: true},
        ctaCommandId: {type: String, maxlength: 256, required: true, unique: true},
        productName: {type: String, maxlength: 256, required: true}, 
        responseMessage: {type: String, maxlength: 256, required: true},
        intentName: {type: String, maxlength: 256, required: true}
    }
)
module.exports = mongoose.model('Cta', CtaSchema);