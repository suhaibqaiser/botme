import {restResponse} from "../../../utils/response";
import {
    createCart,
    createOrder,
    getCart,
    getCartById,
    getOrder,
    getOrderById,
    updateCart,
    updateOrder
} from "./service";
import {randomUUID} from "crypto";

export async function findOrder(filter: any, restaurantId: any) {
    let response = new restResponse()
    filter.restaurantId = restaurantId

    let result = await getOrder(filter)
    if (result.length != 0) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "order not found"
        response.status = "error"
        return response
    }
}

export async function addOrder(order: any, restaurantId: any) {
    let response = new restResponse()
    if (!order || !restaurantId) {
        response.payload = "order and restaurantId is required"
        response.status = "error"
        return response;
    }

    order.orderId = randomUUID()
    order.restaurantId = restaurantId

    let result = await createOrder(order)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "order not found"
        response.status = "error"
        return response
    }
}

export async function editOrder(order: any, restaurantId: any) {
    let response = new restResponse()
    if (!order || !restaurantId) {
        response.payload = "order and restaurantId is required"
        response.status = "error"
        return response;
    }

    let result = await updateOrder(order, restaurantId)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "order not found"
        response.status = "error"
        return response
    }
}

// CART //

export async function findCart(filter: any, query: any) {
    let response = new restResponse()

    // finding order on the basis of clientID and resturantId
    delete filter.cartId
    let orderResult: any = await getOrderById(filter)
    orderResult = JSON.parse(JSON.stringify(orderResult))

    if (!orderResult) {
        response.payload.message = 'Order not found against restaurantId=' + filter.restaurantId + ' --- clientID=' + filter.clientID
        response.status = "error"
        return response
    }

    // finding cart on the basis of cartId and resturantId
    delete filter.customerId
    filter.cartId = orderResult.cartId

    let result = await getCart(filter)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Cart not found against restaurantId=" + filter.cartId + ' --- =' + filter.cartId
        response.status = "error"
        return response
    }
}

export async function findCartById(filter: any, restaurantId: any) {
    let response = new restResponse()
    filter.restaurantId = restaurantId

    // finding order on the basis of clientID and resturantId
    delete filter.cartId
    let orderResult: any = await getOrderById(filter)
    orderResult = JSON.parse(JSON.stringify(orderResult))

    if (!orderResult) {
        response.payload.message = 'Order not found against restaurantId=' + filter.restaurantId + ' --- clientID=' + filter.clientID
        response.status = "error"
        return response
    }

    // finding cart on the basis of cartId and resturantId
    delete filter.customerId
    filter.cartId = orderResult.cartId

    let result = await getCartById(filter)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Cart not found against restaurantId=" + filter.cartId + ' --- =' + filter.cartId
        response.status = "error"
        return response
    }
}

export async function addCart(obj: any, restaurantId: any) {
    try {
        let response = new restResponse()
        if (!obj || !restaurantId) {
            response.payload = "cart and restaurantId is required"
            response.status = "error"
            return response;
        }

        let cartObj = obj.cart
        let orderObj = obj.order
        cartObj.cartId = randomUUID()

        let cartResult = await createCart(cartObj)
        if (cartResult) {
            cartResult = JSON.parse(JSON.stringify(cartResult))
            console.log('cartResult')
            orderObj.orderId = randomUUID()
            orderObj.cartId = cartResult.cartId
            console.log('orderObj =>', cartResult.cartId)
            let orderResult = await createOrder(orderObj)
            if (orderResult) {
                orderResult = JSON.parse(JSON.stringify(orderResult))
                console.log('orderResult =>', orderResult)
                response.payload = {order: orderResult, cart: cartResult}
                response.status = "success"
                return response
            }
        } else {
            response.payload = "cart not found"
            response.status = "error"
            return response
        }
    } catch (e) {
        console.log('exception =>', e)
    }
}

export async function editCart(cart: any, filter: any) {
    let response = new restResponse()
    if (!cart || !filter.restaurantId) {
        response.payload = "cart and restaurantId is required"
        response.status = "error"
        return response;
    }

    let result = await updateCart(cart, filter)
    if (result) {
        response.payload = {cart: JSON.parse(JSON.stringify(result))}
        response.status = "success"
        return response
    } else {
        response.payload = "cart not found"
        response.status = "error"
        return response
    }
}
