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

export async function findCart(filter: any, restaurantId: any) {
    let response = new restResponse()

    filter.restaurantId = restaurantId

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

export async function addCart(cart: any, restaurantId: any) {
    let response = new restResponse()
    if (!cart || !restaurantId) {
        response.payload = "cart and restaurantId is required"
        response.status = "error"
        return response;
    }

    cart.cartId = randomUUID()
    cart.restaurantId = restaurantId

    let result = await createCart(cart)
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
