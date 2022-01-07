import { createSchema, Type, typedModel } from 'ts-mongoose';
import { foodDB } from "../../../config/mongoDB";

const CategorySchema = createSchema(
    {
        restaurantId: Type.string({ maxlength: 256, required: true }),
        categoryId: Type.string({ maxlength: 256, required: true, unique: true }),
        categoryName: Type.string({ maxlength: 256, required: true, unique: true }),
        categoryActive: Type.boolean({ required: true })
    },
    { timestamps: { createdAt: true } }
);

export const Category = foodDB.model('Category', CategorySchema);