import { createSchema, Type, typedModel } from 'ts-mongoose';
import { foodDB } from "../../../config/mongoDB";

const ReservationSchema = createSchema(
    {
        customerId: Type.string({ maxlength: 256, required: true }),
        tableId: Type.string({ maxlength: 256, required: true }),
        reservationId: Type.string({ maxlength: 256, required: true, unique: true }),
        reservationLabel: Type.number({ unique: true }),
        reservationSeats: Type.number({ required: true }),
        reservationDatetime: Type.date({ required: true }),
        reservationType: Type.string({ enum: ['Walk-in', 'Booking'], required: true }),
        reservationSource: Type.string({ enum: ['On-Premises', 'Phone', 'Website', 'App', 'Sofia'], required: true }),
        reservationMeta: {
            customerArrival: Type.date(),
            customerWaiting: Type.number(),
            customerSeated: Type.date(),
            customerDeparture: Type.date()
        }
    },
    { timestamps: { createdAt: true } }
);

const tempReservationSchema = createSchema(
    {
        restaurantId: Type.string({ maxlength: 256, required: true }),
        customerName: Type.string({ maxlength: 256, required: true }),
        reservationLabel: Type.number({ unique: true }),
        reservationSeats: Type.number({ required: true }),
        reservationDate: Type.string({ required: true }),
        reservationTime: Type.string({ required: true }),
        reservationId: Type.string({ required: true })
    },
    { timestamps: { createdAt: true } }
);

export const Reservation = foodDB.model('Reservation', tempReservationSchema);
