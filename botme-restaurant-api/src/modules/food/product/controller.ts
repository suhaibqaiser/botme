import {restResponse} from "../../../utils/response";
import {createProduct, getProduct, updateProduct} from "./service";
import {randomUUID} from "crypto";

export async function addProduct(products: [any]) {
    let response = new restResponse()
    if (products.length < 0) {
        response.payload = "product is required"
        response.status = "error"
        return response;
    }
    console.log(products)

    let result

    for (const product of products) {
        const index = products.indexOf(product);
        product.productId = randomUUID()
        product.productActive = true
        if (product.productVariant === '') {
            delete product.productVariant
        }
        if (product.productAddon === '') {
            delete product.productAddon
        }
        if (product.productImage === '') {
            delete product.productImage
        }

        result = await createProduct(product)
    }

    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "product not found"
        response.status = "error"
        return response
    }
}

export async function findProduct(filter: any) {
    let response = new restResponse()

    interface queryFilters {
        productId: any | undefined;
        productName: any | undefined;
        productPrice: any | undefined;
        category: any | undefined;
        productActive: boolean;
    }

    let queryParams: queryFilters = {
        productId: undefined,
        productName: undefined,
        productPrice: undefined,
        category: undefined,
        productActive: true
    }

    if (filter.searchText) {
        queryParams.productName = {'$regex': filter.searchText, '$options': 'i'}
    } else {
        delete queryParams.productName
    }
    if (filter.priceMin && filter.priceMax) {
        queryParams.productPrice = {$lte: Number(filter.priceMax), $gte: Number(filter.priceMin)}
    } else {
        delete queryParams.productPrice
    }
    if (filter.category) {
        queryParams.category = filter.category
    } else {
        delete queryParams.category
    }
    if (filter.productId) {
        queryParams.productId = filter.productId
    } else {
        delete queryParams.productId
    }

    let result = await getProduct(queryParams)
    if (result.length != 0) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "product not found"
        response.status = "error"
        return response
    }
}

export async function editProduct(product: any) {
    let response = new restResponse()
    if (!product) {
        response.payload = "product is required"
        response.status = "error"
        return response;
    }
    console.log(product)
    let result = await updateProduct(product)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "product not found"
        response.status = "error"
        return response
    }
}