import {createSchema, Type, typedModel} from 'ts-mongoose';
import {foodDB} from "../../../config/mongoDB";

const OrderSchema = createSchema(
    {
        restaurantId: Type.string({maxlength: 256, required: true}),
        orderLabel: Type.string({maxlength: 256, required: true, unique: true}),
        reservationLabel: Type.string(),
        orderTimestamp: Type.date(), // datetime
        orderType: Type.string(),
        customerId: Type.string(),
        addressId: Type.string(),
        tableId: Type.string(),
        delivery: {
            deliveryDate: Type.date(), // datetime
            deliverFee: Type.number(),
            deliveryNote: Type.string(),
        },
        orderPaymentMethod: Type.string(),
        orderSubTotal: Type.number(),
        orderTip: Type.number(),
        orderDiscount: Type.number(), // discount percent
        orderServiceTax: Type.number(),
        orderSalesTax: Type.number(),
        orderTotal: Type.number(),
        orderStatus: Type.boolean()
    },
    {
        timestamps: {createdAt: true}
    }
)


const CartSchema = createSchema(
    {
        restaurantId: Type.string({maxlength: 256, required: true}),
        cartId: Type.string({maxlength: 256, required: true, unique: true}),
        orderLabel: Type.string({maxlength: 256, required: true}),
        productId: Type.string({maxlength: 256, required: true}),
        productSerialNo: Type.string(),
        productCategory: Type.string(),
        productFlavor: Type.string(),
        productProportion: [{
            productId: Type.string(),
            productQuantity: Type.number()
        }],
        productToppings: [{
            productId: Type.string(),
            productQuantity: Type.number()
        }],
        productOptions: [{
            productId: Type.string(),
            productQuantity: Type.number()
        }],
        productIngredients: [{
            productId: Type.string(),
            productQuantity: Type.number()
        }],
        productRate: {
            standard: Type.number(),
            small: Type.number(),
            medium: Type.number(),
            large: Type.number(),
        },
        productQuantity: Type.number(),
        productNotes: Type.string(), // customization Instructions
        status: Type.boolean(),
        productTotalPrice: Type.number(),
        cartDiscount: Type.number(),
        cartTotal: Type.number(),
    },
    {
        timestamps: {createdAt: true}
    }
);

export const Order = foodDB.model('Order', OrderSchema);
export const Cart = foodDB.model('Cart', CartSchema);
