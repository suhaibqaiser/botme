import { restResponse } from "../../../utils/response";
import { createCart, createOrder, getCart, getCartById, getOrder, updateCart, updateOrder } from "./service";
import { randomUUID } from "crypto";

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

    filter.restaurantId = query.restaurantId
    filter.cartId = query.cartId

    let result = await getCart(filter)
    if (result.length != 0) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Cart not found"
        response.status = "error"
        return response
    }
}

export async function findCartById(filter: any, restaurantId: any) {
    let response = new restResponse()
    filter.restaurantId = restaurantId
    let result = await getCartById(filter)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Cart not found"
        response.status = "error"
        return response
    }
}

export async function addCart(obj: any, restaurantId: any) {
    let response = new restResponse()
    if (!obj || !restaurantId) {
        response.payload = "cart and restaurantId is required"
        response.status = "error"
        return response;
    }

    console.log(obj)
    let cartObj = obj.cart
    let orderObj =  obj.order
    cartObj.cartId = randomUUID()
    console.log('cartObj => ',cartObj)
    let cartResult = await createCart(obj)
    if (cartResult) {

        cartResult = JSON.parse(JSON.stringify(cartResult))
        console.log('cartResult => ',cartResult)
        orderObj.orderId =  randomUUID()
        orderObj.cartId =  cartResult.cartId

        let orderResult = await createOrder(orderObj)
        if(orderResult) {
            orderResult = JSON.parse(JSON.stringify(orderResult))
            response.payload.order = orderResult
            response.payload.cart = cartResult
            response.status = "success"
            return response
        }
    } else {
        response.payload = "cart not found"
        response.status = "error"
        return response
    }
}

export async function editCart(cart: any, restaurantId: any) {
    let response = new restResponse()
    if (!cart || !restaurantId) {
        response.payload = "cart and restaurantId is required"
        response.status = "error"
        return response;
    }

    let result = await updateCart(cart, restaurantId)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "cart not found"
        response.status = "error"
        return response
    }
}
