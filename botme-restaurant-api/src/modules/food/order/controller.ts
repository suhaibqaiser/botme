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

    order.orderLabel = Math.random().toString(36).slice(2)
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
        response.message = 'Order not found.'
        response.status = "danger"
        return response
    }

    // filter orderLabel &  restaurantId
    delete filter.customerId
    filter.orderLabel = orderResult.orderLabel
    console.log('filter =>', filter)
    let result = await getCart(filter)
    if (result && result.length) {
        response.payload = {
            order: {orderLabel: orderResult.orderLabel, reservationLabel: orderResult.reservationLabel},
            cart: result
        }
        response.status = "success"
        response.message = "Order found."
        return response
    } else {
        response.message = "Cart not found."
        response.status = "danger"
        return response
    }
}

export async function findCartById(filter: any, restaurantId: any) {
    let response = new restResponse()
    filter.restaurantId = restaurantId

    // filter orderLabel & restaurantId & cartId

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
            response.message = "cart and restaurantId is required"
            response.status = "danger"
            return response;
        }

        let cartObj = obj.cart
        let orderObj = obj.order
        let tempFilter = JSON.parse(JSON.stringify(filter))
        cartObj.cartId = randomUUID()
        // checking is order exists

        // filter customerId & restaurantId & orderLabel
        let isOrderExists: any = await getOrderById(tempFilter)
        if (isOrderExists) {
            // once order created just save cart only
            cartObj.orderLabel = isOrderExists.orderLabel
            let cartResult = await createCart(cartObj)
            response.payload = {cart: cartResult, order: isOrderExists.orderLabel}
            response.status = "success"
            response.message = "Item added to cart."
            return response
        }


        // when creating first time order and cart
        orderObj.orderLabel = Math.random().toString(36).slice(2)
        let orderResult = await createOrder(orderObj)
        if (orderResult) {
            orderResult = JSON.parse(JSON.stringify(orderResult))
            cartObj.orderLabel = orderResult.orderLabel
            let cartResult = await createCart(cartObj)
            if (cartResult) {
                cartResult = JSON.parse(JSON.stringify(cartResult))
                response.payload = {order: orderResult, cart: cartResult}
                response.status = "success"
                response.message = 'Your order successfully placed.'
                return response
            } else {
                response.message = "Failed add to cart."
                response.status = "danger"
                return response
            }
        } else {
            response.message = "Failed to place order."
            response.status = "danger"
            return response
        }
    } catch (e) {
        console.log('exception =>', e)
    }
}

export async function editCart(cart: any, filter: any) {
    let response = new restResponse()
    if (!cart || !filter.restaurantId) {
        response.message = "cart and restaurantId is required"
        response.status = "danger"
        return response;
    }

    // filter restaurantId & cartId & orderLabel

    let result = await updateCart(cart, filter)
    if (result) {
        response.payload = {cart: JSON.parse(JSON.stringify(result))}
        response.message = "Cart updated."
        response.status = "success"
        return response
    }
    response.message = "Cart not found."
    response.status = "danger"
    return response

}

export async function deleteCartById(filter: any) {
    let response = new restResponse()

    // filter restaurantId & cartId & orderLabel
    try {
        let result = await deleteCart(filter)
        if (result) {
            response.payload = result
            response.message = "Cart item deleted."
            response.status = "success"
            return response
        }
        response.message = "Cart not found."
        response.status = "error"
        return response

    } catch (e) {
        console.log(e)
    }
}
