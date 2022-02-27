import {restResponse} from "../../../utils/response";
import {
    createCart,
    createOrder, deleteCart,
    getCart,
    getCartById,
    getOrder,
    getOrderById,
    updateCart,
    updateOrder,
    updateCartStatus,
    updateOrderType, updateOrderStatusDB
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
        response.status = "danger"
        return response
    }
}

export async function addOrder(order: any, restaurantId: any) {
    let response = new restResponse()
    if (!order || !restaurantId) {
        response.payload = "order and restaurantId is required"
        response.status = "danger"
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
        response.status = "danger"
        return response
    }
}

export async function editOrder(order: any, restaurantId: any) {
    let response = new restResponse()
    if (!order || !restaurantId) {
        response.payload = "order and restaurantId is required"
        response.status = "danger"
        return response;
    }

    let result = await updateOrder(order, restaurantId)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "order not found"
        response.status = "danger"
        return response
    }
}

// CART //

export async function findCart(filter: any) {
    let response = new restResponse()
    try {
        let orderResult: any = await getOrderById(filter)
        orderResult = JSON.parse(JSON.stringify(orderResult))

        if (!orderResult) {
            response.message = 'Order not found.'
            response.status = "danger"
            return response
        }

        // filter orderLabel
        delete filter.orderType
        filter.orderLabel = orderResult.orderLabel
        let result = await getCart(filter)
        if (result && result.length) {
            response.payload = {
                order: orderResult,
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
    } catch (e: any) {
        response.message = e.message
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
        response.status = "danger"
        return response
    }
}


export async function findCartByRestaurantId(filter: any) {
    let response = new restResponse()

    // filter orderLabel & restaurantId & cartId

    let result = await getCart(filter)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Cart not found against restaurantId=" + filter.cartLabel + ' --- =' + filter.cartLabel
        response.status = "danger"
        return response
    }
}

export async function addCart(obj: any, filter: any) {
    let response = new restResponse()
    try {
        if (!obj || !filter.restaurantId) {
            response.message = "cart and restaurantId is required"
            response.status = "danger"
            return response;
        }

        let cartObj = obj.cart
        let orderObj = obj.order
        let tempFilter = JSON.parse(JSON.stringify(filter))


        // checking is order exists
        // filter restaurantId & orderLabel
        let isOrderExists: any = await getOrderById(tempFilter)
        console.log(isOrderExists)
        if (isOrderExists) {
            console.log('yes fond')
            cartObj.forEach((item: any) => {
                item.cartId = (item.cartId && item.cartId.length) ? item.cartId : randomUUID()
                item.orderLabel = isOrderExists.orderLabel
            })

            // once order created just save cart only
            let cartResult = await createCart(cartObj)
            response.payload = {cart: cartResult, order: isOrderExists}
            response.status = "success"
            response.message = "Item added to cart."
            return response
        }


        // when creating first time order and cart
        orderObj.orderLabel = Math.random().toString(36).slice(2)
        let orderResult = await createOrder(orderObj)
        if (orderResult) {
            orderResult = JSON.parse(JSON.stringify(orderResult))
            cartObj.forEach((item: any) => {
                item.cartId = randomUUID()
                item.orderLabel = orderResult.orderLabel
            })

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
    } catch (e: any) {
        response.message = e.message
        response.status = "danger"
        return response
    }
}

export async function editCart(cart: any, filter: any) {
    let response = new restResponse()
    try {
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
    } catch (e: any) {
        response.message = e.message
        response.status = "danger"
        return response
    }

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
        response.status = "danger"
        return response

    } catch (e: any) {
        response.message = e.message
        response.status = "danger"
        return response
    }
}

export async function updateOrderStatus(filter: any) {
    let response = new restResponse()
    try {

        // let cartResult = await JSON.parse(JSON.stringify(getCart(filter)))
        //
        // if (!cartResult && !cartResult.length) {
        //     response.message = 'Cart not found to update.'
        //     response.status = "error"
        //     return response
        // }
        delete filter.restaurantId
        const orderStatus = filter.orderStatus
        delete filter.orderStatus
        // let updatedList = await cartResult.forEach((item: any) => {
        //     filter.cartId = item.cartId
        //     return JSON.parse(JSON.stringify(updateCartStatus(filter)))
        // })
        const orderType = JSON.parse(JSON.stringify(filter.orderType))
        delete filter.orderType

        let orderResult = await updateOrderType(filter, orderType)
        if (!orderResult) {
            response.message = 'Failed to update order type.'
            response.status = "error"
            return response
        }

        let orderStatusResult = await updateOrderStatusDB(filter, orderStatus)
        if (!orderStatusResult) {
            response.message = 'Failed to update order status.'
            response.status = "error"
            return response
        }

        delete filter.orderType

        let result = await updateCartStatus(filter)
        if (result) {
            response.message = 'Cart Status updated.'
            response.status = "success"
            response.payload = JSON.parse(JSON.stringify(result))
            return response
        }
        response.message = 'Failed to update cart status.'
        response.status = "error"
        return response
    } catch (e: any) {
        response.message = e.message
        response.status = "error"
        return response
    }
}
