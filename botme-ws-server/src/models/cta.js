const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CtaSchema = new Schema(
    {
        productId: {type: String, maxlength: 256, unique: true},
        ctaCommandId: {type: String, maxlength: 256, unique: true},
        productName: {type: String, maxlength: 256, required: true}, 
        responseMessage: {type: String, maxlength: 256, required: true},
        intentName: {type: String, maxlength: 256, required: true},
        productCategory: {type: String, maxlength: 256}
    }
)
module.exports = mongoose.model('Cta', CtaSchema);