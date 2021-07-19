"use strict";
exports.__esModule = true;
exports.Product = void 0;
var ts_mongoose_1 = require("ts-mongoose");
var ProductSchema = ts_mongoose_1.createSchema({
    productId: ts_mongoose_1.Type.string({ maxlength: 256, required: true, unique: true }),
    productName: ts_mongoose_1.Type.string({ maxlength: 256, required: true, unique: true }),
    productDesc: ts_mongoose_1.Type.string({ maxlength: 4000 }),
    productImage: [ts_mongoose_1.Type.string()],
    productPrice: ts_mongoose_1.Type.number({ required: true }),
    productActive: ts_mongoose_1.Type.boolean({ required: true }),
    category: ts_mongoose_1.Type.objectId({ ref: "Category" })
}, { timestamps: { createdAt: true } });
exports.Product = ts_mongoose_1.typedModel('Product', ProductSchema);
