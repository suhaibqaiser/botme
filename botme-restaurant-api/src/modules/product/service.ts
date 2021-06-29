import {Product} from "./model";

export async function createProduct(product: any) {
    return Product.create(product)
}