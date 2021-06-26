const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ReservationSchema = new Schema(
    {
        customer: {type: Schema.Types.ObjectId, ref: "Customer"},
        reservationSeats: {type: Number, required: true},
        reservationDatetime: {type: Date, required: true},
        reservationType: {type: String, required: true}, // (Walk-in, Booking)
        reservationSource: {type: String, required: true}, // (On-Premises, Phone, Website, App, etc...)
        table: {type: Schema.Types.ObjectId, ref: "Table"}
    }
);

module.exports = mongoose.model('Reservation', ReservationSchema);