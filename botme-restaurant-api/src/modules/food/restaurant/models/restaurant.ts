import {createSchema, Type, typedModel} from 'ts-mongoose';
import {foodDB} from "../../../../config/mongoDB";

const RestaurantSchema = createSchema(
    {
        restaurantId: Type.string({maxlength: 256, required: true, unique: true}),
        restaurantName: Type.string({maxlength: 256, required: true, unique: true}),
        restaurantLabel: Type.string({maxlength: 256, unique: true}),
        restaurantLocation: Type.string({maxlength: 256, unique: true}),
        restaurantActive: Type.boolean({required: true}),
    },
    {timestamps: {createdAt: true}}
);

export const Restaurant = foodDB.model('Restaurant', RestaurantSchema);