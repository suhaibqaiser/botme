const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CustomerSchema = new Schema(
    {
        customerId: {type: String, maxlength: 256, required: true, unique: true},
        customerName: {type: String, maxlength: 256, required: true},
        customerEmail: {type: String, maxlength: 256, unique: true},
        customerPhone: {type: String, maxlength: 256, unique: true},
        customerActive: {type: Boolean, required: true},
            customerStatus: {

            }
    }
);

module.exports = mongoose.model('Customer', CustomerSchema);