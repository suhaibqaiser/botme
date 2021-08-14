import { Product } from "./model";

export async function createProduct(product: any) {
    return Product.create(product)
}

export async function getProduct(queryParams: any) {
    console.log(queryParams);

    return Product.find(queryParams, { __v: 0, _id: 0, "productOptions._id": 0 })
}

export async function updateProduct(product: any) {
    return Product.findOneAndUpdate({ productId: product.productId }, product)
}

export async function getMaxLabelValue() {
    return Product.find({}).sort({ productLabel: -1 }).limit(1)
}
