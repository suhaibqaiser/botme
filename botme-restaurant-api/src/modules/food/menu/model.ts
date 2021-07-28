import {createSchema, Type, typedModel} from 'ts-mongoose';
import {foodDB} from "../../../config/mongoDB";


const MenuSchema = createSchema(
    {
        menuId: Type.string({maxlength: 256, required: true, unique: true}),
        menuName: Type.string({maxlength: 256, required: true, unique: true}),
        menuDesc: Type.string({maxlength: 4000}),
        menuItems: [{
            category: Type.objectId({ref: "Category"}),
            products: [Type.objectId({ref: "Product"})]
        }],
        menuActive: Type.boolean({required: true})
    },
    {timestamps: {createdAt: true}}
);

export const Menu = foodDB.model('Menu', MenuSchema);