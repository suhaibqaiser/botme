export interface Cart {
    restaurantId: string;
    cartId: string
    cartProduct: [{
        productId: string,
        productSerialNo: string;
        productCategory: string;
        productFlavor: string;
        productProportion: string;
        productToppings: [string];
        productOptions: [[string]];
        productRate: {
            standard: number;
            small: number;
            medium: number;
            large: number;
        };
        productQuantity: number;
        productNotes: string; // customization Instructions
    }];
    cartDiscount: number;
    cartTotal: number;
}