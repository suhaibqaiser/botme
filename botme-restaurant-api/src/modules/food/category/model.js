"use strict";
exports.__esModule = true;
exports.Category = void 0;
var ts_mongoose_1 = require("ts-mongoose");
var CategorySchema = ts_mongoose_1.createSchema({
    categoryId: ts_mongoose_1.Type.string({ maxlength: 256, required: true, unique: true }),
    categoryName: ts_mongoose_1.Type.string({ maxlength: 256, required: true, unique: true }),
    categoryActive: ts_mongoose_1.Type.boolean({ required: true })
}, { timestamps: { createdAt: true } });
exports.Category = ts_mongoose_1.typedModel('Category', CategorySchema);
