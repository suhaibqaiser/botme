import { createSchema, Type } from 'ts-mongoose';
import { foodDB } from "../../../config/mongoDB";

const ProductSchema = createSchema(
    {
        restaurantId: Type.string({ maxlength: 256, required: true }),
        productId: Type.string({ maxlength: 256, required: true, unique: true }),
        productLabel: Type.number({ unique: true }),
        productName: Type.string({ maxlength: 256, required: true }),
        productType: Type.string({ maxlength: 256, required: true }),
        productUOM: Type.string(),
        productCategory: Type.string(),
        productSerialNo: Type.string(),
        productBarcode: Type.string(),
        productRating: Type.number(),
        productDesc: Type.string({ maxlength: 4000 }),
        productIngredients: [Type.string()],
        productRate: {
            standard: Type.number(),
            small: Type.number(),
            large: Type.number(),
            medium: Type.number()
        },
        productFlavor: [Type.string()],
        productProportion: [Type.string()],
        productToppings: [Type.string()],
        productAddons: [Type.string()],
        productNutrition: {
            calories: Type.string(),
            fats: Type.string(),
            proteins: Type.string()
        },
        productOptions: [[]],
        productHistory: Type.string(),
        productImage: [Type.string()],
        productTags: [Type.string()],
        productAttributes: {
            halal: Type.boolean(),
            vegan: Type.boolean(),
            vegetarian: Type.boolean(),
            glutenFree: Type.boolean(),

        },
        offeringTime: [Type.string()],
        productVariant: [Type.string()],
        productActive: Type.boolean({ required: true }),
        productServing: Type.number(),
    },
    {
        timestamps: { createdAt: true },
        strictQuery: true
    }
);

export const Product = foodDB.model('Product', ProductSchema);
