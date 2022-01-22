import { Order, Cart } from "./model";

export async function createOrder(order: any) {
    return Order.create(order)
}

export async function updateOrder(order: any, restaurantId: string) {
    return Order.findOneAndUpdate({ orderId: order.orderId, restaurantId: restaurantId }, order)
}

export async function getOrder(queryParams: any) {
    let order: any[] = []
    try {
        order = await Order.find(queryParams)
    } catch (e) {
        console.log(e)
    }
    return order
}

export async function getOrderById(filter: string) {
    return Order.findOne(filter)
}

// CART //

export async function getCart(filter: string) {
    return Cart.find(filter)
}

export async function getCartById(filter: string) {
    return Cart.findOne(filter)
}

export async function createCart(cart: any) {
    return Cart.create(cart)
}

export async function updateCart(cart: any, filter: string) {
    return Cart.findOneAndUpdate(filter, cart)
}
