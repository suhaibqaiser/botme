import {createSchema, Type, typedModel} from 'ts-mongoose';
import {foodDB} from "../../config/mongoDB";

const OrderSchema = createSchema(
    {
        customer: Type.objectId({ref: "Customer"}),
        table: Type.objectId({ref: "Table"}),
        reservation: Type.objectId({ref: "Reservation"}),
        orderId: Type.string({maxlength: 256, required: true, unique: true}),
        orderType: Type.string({enum: ['Dine-in', 'Pick-up'], required: true}),
        orderItems: [
            {
                product: Type.objectId({ref: "Product"}),
                quantity: Type.number({required: true, default: 1})
            }
        ],
        orderStatus: Type.string({
            enum: ['Start', 'Processing', 'Completed'],
            required: true
        }),
        orderRemarks: Type.string()
    },
    {timestamps: {createdAt: true}}
);

export const Order = foodDB.model('Order', OrderSchema);