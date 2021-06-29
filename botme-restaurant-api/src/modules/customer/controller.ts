import {restResponse} from "../../utils/response";
import {addCustomer, getCustomerById, getCustomerByPhone, updateOneCustomer} from "./service";


export async function getCustomerByID(customerId: string) {
    let response = new restResponse()
    if (!customerId) {
        response.payload = "customerId is required"
        response.status = "error"
        return response;
    }

    let result = await getCustomerById(customerId)
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

export async function getCustomerByPhoneNumber(customerPhone: string) {
    let response = new restResponse()
    if (!customerPhone) {
        response.payload = "customerPhone is required"
        response.status = "error"
        return response;
    }

    let result = await getCustomerByPhone(customerPhone)
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

export async function createCustomer(customer: any) {
    let response = new restResponse()
    if (!customer) {
        response.payload = "customer is required"
        response.status = "error"
        return response;
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