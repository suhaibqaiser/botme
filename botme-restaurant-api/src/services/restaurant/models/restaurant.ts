import {createSchema, Type, typedModel} from 'ts-mongoose';

const RestaurantSchema = createSchema(
    {
        restaurantId: Type.string({maxlength: 256, required: true, unique: true}),
        restaurantName: Type.string({maxlength: 256, required: true, unique: true}),
        restaurantActive: Type.boolean({required: true}),
    },
    {timestamps: {createdAt: true}}
);

export const Restaurant = typedModel('Restaurant', RestaurantSchema);