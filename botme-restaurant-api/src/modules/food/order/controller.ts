import { restResponse } from "../../../utils/response";
import { createCart, createOrder, getCart, getOrder, updateCart, updateOrder } from "./service";
const { v4: uuidv4 } = require('uuid');

export async function findOrder(filter: any) {
    let response = new restResponse()

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

export async function addOrder(order: any) {
    let response = new restResponse()
    if (!order) {
        response.payload = "order is required"
        response.status = "error"
        return response;
    }

    order.orderId = uuidv4()

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

export async function editOrder(order: any) {
    let response = new restResponse()
    if (!order) {
        response.payload = "order is required"
        response.status = "error"
        return response;
    }

    let result = await updateOrder(order)
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

export async function findCart(filter: any) {
    let response = new restResponse()

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

export async function addCart(cart: any) {
    let response = new restResponse()
    if (!cart) {
        response.payload = "cart is required"
        response.status = "error"
        return response;
    }

    cart.cartId = uuidv4()

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

export async function editCart(cart: any) {
    let response = new restResponse()
    if (!cart) {
        response.payload = "cart is required"
        response.status = "error"
        return response;
    }

    let result = await updateCart(cart)
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
