export interface Cart {
    restaurantId: string;
    cartId: string
    cartLabel: number
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
    } | null];
    cartDiscount: number;
    cartTotal: number;
}

export interface cartProduct {
    productId: string,
    productLabel: string,
    productCategory: string,
    productFlavor: string,
    productProportion: string,
    productToppings: [string],
    productOptions: [[string]],
    productRate: {
        standard: number,
        small: number,
        medium: number,
        large: number,
    },
    productQuantity: number,
    productNotes: string
}