import {createSchema, Type, typedModel} from 'ts-mongoose';
import {dictionaryDB} from "../../../config/mongoDB";

const ProductSchema = createSchema(
    {
        productId: Type.string({maxlength: 256, required: true, unique: true}),
        productName: Type.string({maxlength: 256, required: true, unique: true}),
        productDesc: Type.string({maxlength: 4000}),
        productImage: [Type.string()],
        productAddon: [Type.objectId({ref: "Product"})],
        productVariant: [Type.objectId({ref: "Product"})],
        productPrice: Type.number({required: true}),
        productActive: Type.boolean({required: true}),
        productTags: [Type.string()],
        category: Type.objectId({ref: "Category"})
    },
    {timestamps: {createdAt: true}}
);

export const Product = dictionaryDB.model('Product', ProductSchema);