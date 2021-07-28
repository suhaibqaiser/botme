import {Product} from "./model";

export async function createProduct(product: any) {
    return Product.create(product)
}

export async function getProduct(queryParams: any) {
    return Product.find(queryParams)
}

export async function updateProduct(product:any) {
    return Product.findOneAndUpdate({productId: product.productId}, product)
}