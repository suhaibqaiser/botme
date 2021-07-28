"use strict";
exports.__esModule = true;
exports.Order = void 0;
var ts_mongoose_1 = require("ts-mongoose");
var OrderSchema = ts_mongoose_1.createSchema({
    customer: ts_mongoose_1.Type.objectId({ ref: "Customer" }),
    table: ts_mongoose_1.Type.objectId({ ref: "Table" }),
    reservation: ts_mongoose_1.Type.objectId({ ref: "Reservation" }),
    orderId: ts_mongoose_1.Type.string({ maxlength: 256, required: true, unique: true }),
    orderType: ts_mongoose_1.Type.string({ "enum": ['Dine-in', 'Pick-up'], required: true }),
    orderItems: [
        {
            product: ts_mongoose_1.Type.objectId({ ref: "Product" }),
            quantity: ts_mongoose_1.Type.number({ required: true, "default": 1 })
        }
    ],
    orderStatus: ts_mongoose_1.Type.string({
        "enum": ['Start', 'Processing', 'Completed'],
        required: true
    }),
    orderRemarks: ts_mongoose_1.Type.string()
}, { timestamps: { createdAt: true } });
exports.Order = ts_mongoose_1.typedModel('Order', OrderSchema);
