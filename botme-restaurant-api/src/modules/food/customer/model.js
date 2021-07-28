"use strict";
exports.__esModule = true;
exports.Customer = void 0;
var ts_mongoose_1 = require("ts-mongoose");
var CustomerSchema = ts_mongoose_1.createSchema({
    customerId: ts_mongoose_1.Type.string({ maxlength: 256, required: true, unique: true }),
    customerName: ts_mongoose_1.Type.string({ maxlength: 256, required: true }),
    customerEmail: ts_mongoose_1.Type.string({ maxlength: 256, unique: true }),
    customerPhone: ts_mongoose_1.Type.string({ maxlength: 256, unique: true }),
    customerActive: ts_mongoose_1.Type.boolean({ required: true })
}, { timestamps: { createdAt: true } });
exports.Customer = ts_mongoose_1.typedModel('Customer', CustomerSchema);
