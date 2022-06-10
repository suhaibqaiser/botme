import {Order, Cart} from "./model";
import { Customer } from "../customer/model";

export async function getCustomerId(name:any) {
    return Customer.find({customerName: { $regex: name, $options:"i"}})
}

export async function createOrder(order: any) {
    return Order.create(order)
}

export async function updateOrder(order: any, restaurantId: string) {
    return Order.findOneAndUpdate({orderLabel: order.orderLabel, restaurantId: restaurantId}, order)
}

export async function getOrder(queryParams: any) {
    let order: any[] = []
    try {
        order = await Order.find(queryParams).sort({orderTimestamp: -1})
    } catch (e) {
        console.log(e)
    }
    return order
}

export async function queryOrder(queryParams: any) {
    let order: any[] = [] 
    try {
        order = await Order.find(queryParams).sort({orderTimestamp: -1})
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
    return Cart.insertMany(cart)
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

export async function deleteOrderByOrderLabel(filter: string, orderStatus: any = '') {
    return Order.findOneAndDelete(filter)
}

export async function deleteCartByOrderLabel(filter: string, orderStatus: any = '') {
    return Cart.deleteMany(filter)
}
