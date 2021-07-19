"use strict";
exports.__esModule = true;
exports.Restaurant = void 0;
var ts_mongoose_1 = require("ts-mongoose");
var RestaurantSchema = ts_mongoose_1.createSchema({
    restaurantId: ts_mongoose_1.Type.string({ maxlength: 256, required: true, unique: true }),
    restaurantName: ts_mongoose_1.Type.string({ maxlength: 256, required: true, unique: true }),
    restaurantActive: ts_mongoose_1.Type.boolean({ required: true })
}, { timestamps: { createdAt: true } });
exports.Restaurant = ts_mongoose_1.typedModel('Restaurant', RestaurantSchema);
