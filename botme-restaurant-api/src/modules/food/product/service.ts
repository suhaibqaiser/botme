import {Product} from "./model";

export async function createProduct(product: any) {
    return Product.create(product)
}

export async function getProduct(queryParams: any, sort: any) {
    console.log('queryParams => ', queryParams);
    console.log('sort =>', sort)
    if (parseInt(sort)) {
        return Product.find(queryParams, {
            __v: 0,
            _id: 0,
            "productOptions._id": 0
        }).sort({'productRate.standard': parseInt(sort)})
    }
    return Product.find(queryParams, {__v: 0, _id: 0, "productOptions._id": 0})

}

export async function updateProduct(product: any) {
    return Product.findOneAndUpdate({productId: product.productId}, product)
}

export async function getMaxLabelValue() {
    return Product.findOne({}).sort({productLabel: -1})
}
