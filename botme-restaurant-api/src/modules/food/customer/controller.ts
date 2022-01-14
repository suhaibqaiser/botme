import { restResponse } from "../../../utils/response";
import { addCustomer, getAllCustomers, getCustomer, updateOneCustomer, getAddressByCustomer } from "./service";
import { randomUUID } from "crypto";
import { getMaxLabelValue } from "../../food/customer/service";

export async function findCustomer(filter: any, restaurantId: any) {
    let response = new restResponse()

    if (!restaurantId) {
        response.payload = "restaurantId is required"
        response.status = "error"
        return response;
    }
    interface queryFilters {
        customerName: any | undefined;
        customerEmail: any | undefined;
        customerPhone: any | undefined;
        customerId: any | undefined;
        restaurantId: any | undefined
    }

    let queryParams: queryFilters = {
        customerName: undefined,
        customerEmail: undefined,
        customerPhone: undefined,
        customerId: undefined,
        restaurantId: undefined
    }

    if (filter.name) {
        queryParams.customerName = { '$regex': filter.name, '$options': 'i' }
    } else {
        delete queryParams.customerName
    }
    if (filter.email) {
        queryParams.customerEmail = filter.email
    } else {
        delete queryParams.customerEmail
    }
    if (filter.customerId) {
        queryParams.customerId = filter.customerId
    } else {
        delete queryParams.customerId
    }
    if (filter.phone) {
        queryParams.customerPhone = filter.phone
    } else {
        delete queryParams.customerPhone
    }
    if (filter.restaurantId) {
        queryParams.restaurantId = filter.restaurantId
    } else {
        delete queryParams.restaurantId
    }

    let result = await getCustomer(queryParams)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "customer not found"
        response.status = "error"
        return response
    }
}

export async function createCustomer(customer: any, restaurantId: any) {
    let response = new restResponse()
    if (!customer || !restaurantId) {
        response.payload = "customer and restaurantId is required"
        response.status = "error"
        return response;
    }
    customer.customerId = randomUUID()
    customer.customerActive = true
    customer.restaurantId = restaurantId

    let val = await getMaxLabelValue()
    customer.customerLabel = val ? (val.customerLabel + 1) : 1

    let result = await addCustomer(customer)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Customer not found"
        response.status = "error"
        return response
    }
}

export async function updateCustomer(customer: any, restaurantId: any) {
    let response = new restResponse()
    if (!customer || !restaurantId) {
        response.payload = "customer and restaurantId is required"
        response.status = "error"
        return response;
    }

    let result = await updateOneCustomer(customer, restaurantId)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Customer not found"
        response.status = "error"
        return response
    }
}

export async function getAllCustomer(restaurantId: any) {
    let response = new restResponse()

    let result = await getAllCustomers(restaurantId)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Customer not found"
        response.status = "error"
        return response
    }
}

export async function getAddressByCustomerId(customerId: string, restaurantId: any) {
    let response = new restResponse()

    let result = await getAddressByCustomer(customerId, restaurantId)
    if (result.length > 0) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Address not found"
        response.status = "error"
        return response
    }
}

