import { Address, Customer } from "./model";

export async function addCustomer(customer: any) {
    return Customer.create(customer)
}

export async function updateOneCustomer(customer: any) {
    return Customer.findOneAndUpdate({ customerId: customer.customerId, restaurantId: customer.restaurantId }, customer)
}

export async function getCustomer(queryParams: any) {
    return Customer.findOne(queryParams)
}

export async function getCustomerByPhone(customerPhone: string, restaurantId: string) {
    return Customer.findOne({ customerPhone: customerPhone, restaurantId: restaurantId })
}

export async function getAllCustomers(restaurantId: string) {
    return Customer.find({ restaurantId: restaurantId })
}

export async function getAddressByCustomer(customerId: string, restaurantId: string) {
    return Address.find({ customerId: customerId, restaurantId: restaurantId })
}

export async function createAddress(address: any) {
    return Address.create(address)
}

export async function updateAddress(address: any) {
    return Address.findOneAndUpdate({ addressId: address.addressId }, address)
}

export async function getMaxLabelValue() {
    return Customer.findOne({}).sort({ customerLabel: -1 })
}
