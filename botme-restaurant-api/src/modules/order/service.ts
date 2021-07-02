import {Order} from "./model";

export async function createOrder(order: any) {
    return Order.create(order)
}

export async function updateOrder(order: any) {
    return Order.findOneAndUpdate({orderId: order.orderId},order)
}

export async function getOrder(queryParams: any){
    let order: any[] = []
    try {
        order = await Order.find(queryParams)
    } catch (e) {
        console.log(e)
    }
    return order
}