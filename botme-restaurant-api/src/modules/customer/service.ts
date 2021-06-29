import {Customer} from "./model";

export async function addCustomer(customer: any) {
    return Customer.create(customer)
}

export async function updateOneCustomer(customer: any) {
    return Customer.findOneAndUpdate({customerId: customer.customerId}, customer)
}

export async function getCustomerById(customerId: string) {
    return Customer.findOne({customerId: customerId})
}

export async function getCustomerByPhone(customerPhone: string) {
    return Customer.findOne({customerPhone: customerPhone})
}