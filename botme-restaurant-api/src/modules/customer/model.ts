import {createSchema, Type, typedModel} from 'ts-mongoose';
import {foodDB} from "../../config/mongoDB";

const CustomerSchema = createSchema(
    {
        customerId: Type.string({maxlength: 256, required: true, unique: true}),
        customerName: Type.string(),
        customerEmail: Type.string({
            maxlength: 256, trim: true, index: {
                unique: true,
                partialFilterExpression: {email: {$type: "string"}}
            }
        }),
        customerPhone: Type.string({maxlength: 256, unique: true}),
        customerActive: Type.boolean({required: true})
    },
    {timestamps: {createdAt: true}}
);

export const Customer = foodDB.model('Customer', CustomerSchema);