"use strict";
exports.__esModule = true;
exports.Area = void 0;
var ts_mongoose_1 = require("ts-mongoose");
var AreaSchema = ts_mongoose_1.createSchema({
    areaId: ts_mongoose_1.Type.string({ maxlength: 256, required: true, unique: true }),
    areaName: ts_mongoose_1.Type.string({ maxlength: 256, required: true, unique: true }),
    areaActive: ts_mongoose_1.Type.boolean({ required: true }),
    restaurant: ts_mongoose_1.Type.objectId({ ref: "Restaurant" }),
    tables: [ts_mongoose_1.Type.objectId({ ref: "Table" })]
}, { timestamps: { createdAt: true } });
exports.Area = ts_mongoose_1.typedModel('Area', AreaSchema);
