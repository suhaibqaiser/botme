import {createSchema, Type, typedModel} from 'ts-mongoose';
import {foodDB} from "../../../config/mongoDB";

const CustomerSchema = createSchema(
    {
        customerId: Type.string({maxlength: 256, required: true, unique: true}),
        customerLabel: Type.number({unique: true}),
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

const AddressSchema = createSchema(
    {
        restaurantId: Type.string({maxlength: 256, required: true}),
        addressId: Type.string({ maxlength: 256, required: true, unique: true }),
        addressLabel: Type.string(),
        customerId: Type.string({maxlength: 256, required: true}),
        addressLine1: Type.string(),
        addressLine2: Type.string(),
        adddressPostalCode: Type.string(),
        addressCity: Type.string(),
        addressState: Type.string(),
        addressCountry: Type.string(),
    }
)

export const Customer = foodDB.model('Customer', CustomerSchema);
export const Address = foodDB.model('Address', AddressSchema);
