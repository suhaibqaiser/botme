"use strict";
exports.__esModule = true;
exports.Table = void 0;
var ts_mongoose_1 = require("ts-mongoose");
var TableSchema = ts_mongoose_1.createSchema({
    tableId: ts_mongoose_1.Type.string({ maxlength: 256, required: true, unique: true }),
    tableSeats: ts_mongoose_1.Type.number({ required: true, sparse: true }),
    tableOccupied: ts_mongoose_1.Type.boolean({ required: true }),
    area: ts_mongoose_1.Type.objectId({ ref: "Area" })
}, { timestamps: { createdAt: true } });
exports.Table = ts_mongoose_1.typedModel('Table', TableSchema);
