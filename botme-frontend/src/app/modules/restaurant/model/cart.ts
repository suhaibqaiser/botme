export interface Cart {
    restaurantId: string;
    cartId: string
    cartLabel: string
    cartProduct: [{
        productId: string,
        productLabel: string; //TODO
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