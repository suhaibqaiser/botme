"use strict";
exports.__esModule = true;
exports.Reservation = void 0;
var ts_mongoose_1 = require("ts-mongoose");
var ReservationSchema = ts_mongoose_1.createSchema({
    customer: ts_mongoose_1.Type.objectId({ ref: "Customer" }),
    table: ts_mongoose_1.Type.objectId({ ref: "Table" }),
    reservationId: ts_mongoose_1.Type.string({ maxlength: 256, required: true, unique: true }),
    reservationSeats: ts_mongoose_1.Type.number({ required: true }),
    reservationDatetime: ts_mongoose_1.Type.date({ required: true }),
    reservationType: ts_mongoose_1.Type.string({ "enum": ['Walk-in', 'Booking'], required: true }),
    reservationSource: ts_mongoose_1.Type.string({ "enum": ['On-Premises', 'Phone', 'Website', 'App'], required: true }),
    reservationMeta: {
        customerArrival: ts_mongoose_1.Type.date(),
        customerWaiting: ts_mongoose_1.Type.number(),
        customerSeated: ts_mongoose_1.Type.date(),
        customerDeparture: ts_mongoose_1.Type.date()
    }
}, { timestamps: { createdAt: true } });
exports.Reservation = ts_mongoose_1.typedModel('Reservation', ReservationSchema);
