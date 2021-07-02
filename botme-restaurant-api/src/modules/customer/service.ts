import {Customer} from "./model";

export async function addCustomer(customer: any) {
    return Customer.create(customer)
}

export async function updateOneCustomer(customer: any) {
    return Customer.findOneAndUpdate({customerId: customer.customerId}, customer)
}

export async function getCustomer(queryParams: any) {
    return Customer.findOne(queryParams)
}

export async function getCustomerByPhone(customerPhone: string) {
    return Customer.findOne({customerPhone: customerPhone})
}