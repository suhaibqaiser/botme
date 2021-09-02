import {restResponse} from "../../../utils/response";
import {createProduct, getProduct, updateProduct, getMaxLabelValue} from "./service";
import {randomUUID} from "crypto";

export async function addProduct(product: any) {
    let response = new restResponse()
    if (!product) {
        response.payload = "product is required"
        response.status = "error"
        return response;
    }
    let result

    let val = await getMaxLabelValue()
    product.productLabel = val ? ( val.productLabel + 1) : 1

    product.productId = randomUUID()
    product.productActive = true

    result = await createProduct(product)

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
    console.log('filter =>',filter)
    let response = new restResponse()

    interface queryFilters {
        productId: any | undefined;
        productName: any | undefined;
        productPrice: any | undefined;
        productType: any | undefined;
        productCategory: any | undefined;
        //productActive: boolean;
    }

    let queryParams: queryFilters = {
        productId: undefined,
        productName: undefined,
        productPrice: undefined,
        productType: undefined,
        productCategory: undefined,
        //productActive: true
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
    if (filter.productCategory) {
        queryParams.productCategory = filter.productCategory
    } else {
        delete queryParams.productCategory
    }
    if (filter.productType) {
        queryParams.productType = filter.productType
    } else {
        delete queryParams.productType
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
