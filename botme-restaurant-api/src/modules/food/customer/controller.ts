import {restResponse} from "../../../utils/response";
import {addCustomer, getAllCustomers, getCustomer, updateOneCustomer, getAddressByCustomer} from "./service";
import {randomUUID} from "crypto";
import {getMaxLabelValue} from "../../food/customer/service";
import {getOrderById, updateCustomerId} from "../order/service";
import { GetAllSubscription } from "../../notification/order-notification/service";
// import { placeOrderNotification } from "../../notification/place-order-notification/controller";
// import { Subscription } from "../../notification/place-order-notification/model";
// import { sendingPlaceOrderNotification } from "../../../utils/helpers";

export async function findCustomer(filter: any) {
    let response = new restResponse()
    try {
        if (!filter) {
            response.payload = "Order Label is required"
            response.status = "danger"
            return response;
        }

        // const tempFilter = JSON.parse(JSON.stringify(filter))
        // console.log('tempFilter =>', tempFilter)
        // let isOrderExists: any = await JSON.parse(JSON.stringify(getOrderById(tempFilter)))
        // console.log('isOrderExists =>', isOrderExists)
        // if (!isOrderExists) {
        //     response.payload = "Order not found"
        //     response.status = "danger"
        //     return response
        // }

        let result = await getCustomer(filter)
        if (result) {
            response.payload = JSON.parse(JSON.stringify(result))
            response.status = "success"
            response.message = "customer fetched"
            return response
        } else {
            response.message = "customer not found"
            response.status = "danger"
            return response
        }
    } catch (e: any) {
        response.message = e.message
        response.status = "danger"
        return response
    }
}

export async function createCustomer(filter: any, customer: any) {
    let response = new restResponse()
    try {
        console.log("filter ==> ",filter)
        console.log("customer ==>",customer)
        if (!customer || !customer.restaurantId) {
            response.message = "customer and restaurantId is required"
            response.status = "danger"
            return response;
        }
        const clientId = filter.clientID
        delete filter.clientID

        let isOrderExists: any = await JSON.parse(JSON.stringify(getOrderById(filter)))
        if (isOrderExists && isOrderExists.customerId) {
            response.message = 'Customer already exist against this order.'
            response.status = "danger"
            return response
        }

        customer.customerId = randomUUID()
        customer.customerActive = true

        let val = await getMaxLabelValue()
        customer.customerLabel = val ? (val.customerLabel + 1) : 1

        let result = await addCustomer(customer)
        if (result) {
            response.payload = JSON.parse(JSON.stringify(result))

            let orderResult = await updateCustomerId(filter, response.payload.customerId)

            if (orderResult) {
                // await sendingPlaceOrderNotification(clientId,"Dear Customer","Your order has been placed with order id: " + filter.orderLabel + ", Thanks!")
                response.message = 'Your order placed has been successfully'
                response.status = "success"
                return response
            }

            response.message = 'Unable to place your order'
            response.status = "danger"
            return response
        } else {
            response.message = "Unable to place your order"
            response.status = "danger"
            return response
        }
    } catch (e: any) {
        response.message = e.message
        response.status = "danger"
        return response
    }
}

export async function updateCustomer(customer: any, filter: any) {
    console.log("filter ==> ",filter)
    console.log("customer ==>",customer)    
    let response = new restResponse()
    try {
        if (!customer || !filter) {
            response.message = "customer and restaurantId is required"
            response.status = "danger"
            return response;
        }
        let result = await updateOneCustomer(customer)
        if (result) {
            response.payload = JSON.parse(JSON.stringify(result))
            response.message = "Customer updated successfully."
            response.status = "success"
            return response
        } else {
            response.message = "Unable to update your customer"
            response.status = "danger"
            return response
        }
    } catch (e: any) {
        response.message = e.message
        response.status = "danger"
        return response
    }
}

export async function getAllCustomer(restaurantId: any) {
    let response = new restResponse()

    let result = await getAllCustomers(restaurantId)
    if (result) {
        response.payload = result
        response.message = 'Customer List fetched'
        response.status = "success"
        return response
    } else {
        response.message = "Customer not found"
        response.status = "danger"
        return response
    }
}

export async function getAddressByCustomerId(customerId: string, restaurantId: any) {
    let response = new restResponse()

    let result = await getAddressByCustomer(customerId, restaurantId)
    if (result.length > 0) {
        response.payload = result
        response.status = "success"
        response.message = "Address Fetched"
        return response
    } else {
        response.message = "Address not found"
        response.status = "danger"
        return response
    }
}

