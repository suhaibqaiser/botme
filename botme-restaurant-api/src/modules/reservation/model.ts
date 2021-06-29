import {createSchema, Type, typedModel} from 'ts-mongoose';

const ReservationSchema = createSchema(
    {
        customer: Type.objectId({ref: "Customer"}),
        table: Type.objectId({ref: "Table"}),
        reservationSeats: Type.number({required: true}),
        reservationDatetime: Type.date({required: true}),
        reservationType: Type.string({enum: ['Walk-in', 'Booking'], required: true}),
        reservationSource: Type.string({enum: ['On-Premises', 'Phone', 'Website', 'App'], required: true}),
        reservationMeta: {
                customerArrival: Type.date(),
                customerWaiting: Type.number(),
                customerSeated: Type.date(),
                customerDeparture: Type.date()
        }
    },
    {timestamps: {createdAt: true}}
);

export const Reservation = typedModel('Reservation', ReservationSchema);