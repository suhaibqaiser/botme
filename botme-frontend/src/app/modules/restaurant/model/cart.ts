export interface Cart {
    cartId: string
    cartProduct: [{
        productId: string,
        addons: [string],
        drink: [string],
        topping: [string],
    }]
}