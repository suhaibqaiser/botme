import {restResponse} from "../../utils/response";
import {createProduct, getProduct} from "./service";

export async function addProduct(product: any) {
    let response = new restResponse()
    if (!product) {
        response.payload = "product is required"
        response.status = "error"
        return response;
    }

    let result = await createProduct(product)
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
        productName: any | undefined;
        productPrice: any | undefined;
        category: any | undefined;
    }

    let queryParams: queryFilters = {productName: undefined, productPrice: undefined, category: undefined}

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