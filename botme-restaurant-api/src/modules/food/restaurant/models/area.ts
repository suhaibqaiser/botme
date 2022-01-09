import { createSchema, Type, typedModel } from 'ts-mongoose';
import { foodDB } from "../../../../config/mongoDB";
const AreaSchema = createSchema(
    {
        restaurantId: Type.string({ maxlength: 256, required: true }),
        areaId: Type.string({ maxlength: 256, required: true, unique: true }),
        areaName: Type.string({ maxlength: 256, required: true, unique: true }),
        areaActive: Type.boolean({ required: true }),
        restaurant: Type.objectId({ ref: "Restaurant" })
    },
    { timestamps: { createdAt: true } }
);

export const Area = foodDB.model('Area', AreaSchema);
