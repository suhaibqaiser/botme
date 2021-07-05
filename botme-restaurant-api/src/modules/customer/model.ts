import {createSchema, Type, typedModel} from 'ts-mongoose';

const CustomerSchema = createSchema(
    {
        customerId: Type.string({maxlength: 256, required: true, unique: true}),
        customerName: Type.string({maxlength: 256, required: true}),
        customerEmail: Type.string({maxlength: 256, unique: true}),
        customerPhone: Type.string({maxlength: 256, unique: true}),
        customerActive: Type.boolean({required: true})
    },
    {timestamps: {createdAt: true}}
);

export const Customer = typedModel('Customer', CustomerSchema);