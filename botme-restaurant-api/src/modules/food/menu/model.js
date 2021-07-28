"use strict";
exports.__esModule = true;
exports.Menu = void 0;
var ts_mongoose_1 = require("ts-mongoose");
var MenuSchema = ts_mongoose_1.createSchema({
    menuId: ts_mongoose_1.Type.string({ maxlength: 256, required: true, unique: true }),
    menuName: ts_mongoose_1.Type.string({ maxlength: 256, required: true, unique: true }),
    menuDesc: ts_mongoose_1.Type.string({ maxlength: 4000 }),
    menuItems: [{
            category: ts_mongoose_1.Type.objectId({ ref: "Category" }),
            products: [ts_mongoose_1.Type.objectId({ ref: "Product" })]
        }],
    menuActive: ts_mongoose_1.Type.boolean({ required: true })
}, { timestamps: { createdAt: true } });
exports.Menu = ts_mongoose_1.typedModel('Menu', MenuSchema);
