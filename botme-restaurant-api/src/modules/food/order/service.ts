import {Order, Cart} from "./model";

export async function createOrder(order: any) {
    return Order.create(order)
}

export async function updateOrder(order: any, restaurantId: string) {
    return Order.findOneAndUpdate({orderId: order.orderId, restaurantId: restaurantId}, order)
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

export async function deleteCart(filter: string) {
    return Cart.findOneAndDelete(filter)
}

export async function updateCartStatus(filter: string) {
    return Cart.updateMany(filter, {$set: {status: true}})
}

export async function updateCustomerId(filter: string, customerId: any) {
    return Order.updateOne(filter, {$set: {customerId: customerId}})
}

export async function updateOrderType(filter: string, orderType: any) {
    return Order.updateOne(filter, {$set: {orderType: orderType}})
}

export async function updateOrderStatusDB(filter: string, orderStatus: any = '') {
    return Order.updateOne(filter, {$set: {orderStatus: orderStatus}})
}
