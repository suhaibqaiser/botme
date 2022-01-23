import {restResponse} from "../../../utils/response";
import {
    createCart,
    createOrder, deleteCart,
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

    // filter customerId & restaurantId
    let orderResult: any = await getOrderById(filter)
    orderResult = JSON.parse(JSON.stringify(orderResult))

    if (!orderResult) {
        response.payload = {message: 'Order not found against restaurantId=' + filter.restaurantId + ' --- customerId=' + filter.customerId}
        response.status = "error"
        return response
    }

    // filter orderId &  restaurantId
    delete filter.customerId
    filter.orderId = orderResult.orderId

    let result = await getCart(filter)
    if (result) {
        response.payload = {
            order: orderResult.orderId,
            cart: result
        }
        response.status = "success"
        return response
    } else {
        response.payload = "Cart not found against restaurantId=" + filter.cartLabel + ' --- =' + filter.cartID
        response.status = "error"
        return response
    }
}

export async function findCartById(filter: any, restaurantId: any) {
    let response = new restResponse()
    filter.restaurantId = restaurantId

    // filter orderId & restaurantId & cartId

    let result = await getCartById(filter)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Cart not found against restaurantId=" + filter.cartLabel + ' --- =' + filter.cartLabel
        response.status = "error"
        return response
    }
}

export async function addCart(obj: any, filter: any) {
    try {
        let response = new restResponse()
        if (!obj || !filter.restaurantId) {
            response.payload = "cart and restaurantId is required"
            response.status = "error"
            return response;
        }

        let cartObj = obj.cart
        let orderObj = obj.order
        let tempFilter = JSON.parse(JSON.stringify(filter))
        cartObj.cartId = randomUUID()
        // checking is order exists

        // filter customerId & restaurantId & orderId
        let isOrderExists: any = await getOrderById(tempFilter)
        if (isOrderExists) {
            // once order created just save cart only
            cartObj.orderId = isOrderExists.orderId
            let cartResult = await createCart(cartObj)
            response.payload = {cart: cartResult, order: isOrderExists.orderId}
            response.status = "success"
            return response
        }


        // when creating first time order and cart
        orderObj.orderId = randomUUID()
        let orderResult = await createOrder(orderObj)
        if (orderResult) {
            orderResult = JSON.parse(JSON.stringify(orderResult))
            cartObj.orderId = orderResult.orderId
            let cartResult = await createCart(cartObj)
            if (cartResult) {
                cartResult = JSON.parse(JSON.stringify(cartResult))
                response.payload = {order: orderResult, cart: cartResult}
                response.status = "success"
                return response
            } else {
                response.payload = "Failed to save cart!"
                response.status = "error"
                return response
            }
        } else {
            response.payload = "Failed to save order!"
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

    // filter restaurantId & cartId & orderId

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

export async function deleteCartById(filter: any) {
    let response = new restResponse()

    // filter restaurantId & cartId & orderId
    try {
        let result = await deleteCart(filter)
        if (result) {
            response.payload = result
            response.status = "success"
            return response
        } else {
            response.payload = "cart not found"
            response.status = "error"
            return response
        }
    }catch (e) {
        console.log(e)
    }
}
