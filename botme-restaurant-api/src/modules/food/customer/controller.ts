import {restResponse} from "../../../utils/response";
import {addCustomer, getAllCustomers, getCustomer, updateOneCustomer} from "./service";
import {randomUUID} from "crypto";
import {getMaxLabelValue} from "../../food/customer/service";

export async function findCustomer(filter: any) {
    let response = new restResponse()

    interface queryFilters {
        customerName: any | undefined;
        customerEmail: any | undefined;
        customerPhone: any | undefined;
        customerId: any | undefined;
    }

    let queryParams: queryFilters = {
        customerName: undefined,
        customerEmail: undefined,
        customerPhone: undefined,
        customerId: undefined
    }

    if (filter.name) {
        queryParams.customerName = {'$regex': filter.name, '$options': 'i'}
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

    console.log(queryParams)
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

export async function createCustomer(customer: any) {
    let response = new restResponse()
    if (!customer) {
        response.payload = "customer is required"
        response.status = "error"
        return response;
    }
    customer.customerId = randomUUID()
    customer.customerActive = true

    let val = await getMaxLabelValue()
    if (val.length > 0) {
        customer.customerLabel = val[0].customerLabel + 1
    } else {
        customer.customerLabel = 1
    }

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

export async function updateCustomer(customer: any) {
    let response = new restResponse()
    if (!customer) {
        response.payload = "customer is required"
        response.status = "error"
        return response;
    }

    let result = await updateOneCustomer(customer)
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

export async function getAllCustomer() {
    let response = new restResponse()

    let result = await getAllCustomers()
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
