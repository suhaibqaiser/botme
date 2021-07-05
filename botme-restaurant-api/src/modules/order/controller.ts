import {restResponse} from "../../utils/response";
import {createOrder, getOrder, updateOrder} from "./service";
import {randomUUID} from "crypto";

export async function findOrder(filter: any) {
    let response = new restResponse()

    interface queryFilters {
        customer: any | undefined;
        reservation: any | undefined;
        orderId: any | undefined;
        orderType: any | undefined;
        orderStatus: any | undefined;
    }

    let queryParams: queryFilters = {
        customer: undefined,
        reservation: undefined,
        orderId: undefined,
        orderType: undefined,
        orderStatus: undefined,
    }

    if (filter.customer) {
        queryParams.customer = filter.customer
    } else {
        delete queryParams.customer
    }
    if (filter.reservation) {
        queryParams.reservation = filter.reservation
    } else {
        delete queryParams.reservation
    }
    if (filter.orderId) {
        queryParams.orderId = filter.orderId
    } else {
        delete queryParams.orderId
    }
    if (filter.type) {
        queryParams.orderType = filter.type
    } else {
        delete queryParams.orderType
    }
    if (filter.status) {
        queryParams.orderStatus = filter.status
    } else {
        delete queryParams.orderStatus
    }


    console.log(queryParams)
    let result = await getOrder(queryParams)
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

    order.orderId = randomUUID()

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