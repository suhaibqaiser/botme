import { restResponse } from "../../../utils/response";
import { createProduct, getProduct, updateProduct, getMaxLabelValue, getProductByTag } from "./service";
import { randomUUID } from "crypto";

export async function addProduct(product: any, restaurantId: any) {
    let response = new restResponse()
    if (!product || !restaurantId) {
        response.payload = "product and restaurantId is required"
        response.status = "error"
        return response;
    }
    let result

    let val = await getMaxLabelValue()
    product.productLabel = val ? (val.productLabel + 1) : 1

    product.productId = randomUUID()
    product.productActive = true
    product.restaurantId = restaurantId

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

export async function findProduct(filter: any, restaurantId: any) {
    let response = new restResponse()
    if (!filter || !restaurantId) {
        response.payload = "product and restaurantId is required"
        response.status = "error"
        return response;
    }


    let productId = (filter && filter.productId) ? filter.productId : ''
    let priceMin = (filter && filter.priceMin) ? filter.priceMin : ''
    let priceMax = (filter && filter.priceMax) ? filter.priceMax : ''
    let ratingMin = (filter && filter.ratingMin) ? filter.ratingMin : ''
    let ratingMax = (filter && filter.ratingMax) ? filter.ratingMax : ''
    let productCategory = (filter && filter.productCategory) ? filter.productCategory : ''
    let productName = (filter && filter.productName) ? filter.productName : ''

    let queryParam: any = {}
    if (restaurantId && restaurantId.length) {
        queryParam.restaurantId = restaurantId
    }

    if (productId && productId.length) {
        queryParam.productId = productId
    }

    if (productCategory && productCategory.length) {
        queryParam.productCategory = productCategory
    }
    if (productName && productName.length) {
        queryParam.productName = { '$regex': productName, '$options': 'i' }
    }

    if (priceMin || priceMax) {
        queryParam = { ...queryParam, 'productRate.standard': { '$gte': Number(priceMin), '$lte': Number(priceMax) } }
    }

    if (ratingMin || ratingMax) {
        queryParam.productRating = { '$gte': Number(ratingMin), '$lte': Number(ratingMax) }
    }


    let result = await getProduct(queryParam, filter.sortByPrice)
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

export async function editProduct(product: any, restaurantId: any) {
    let response = new restResponse()
    if (!product || !restaurantId) {
        response.payload = "product and restaurantId is required"
        response.status = "error"
        return response;
    }
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

export async function suggestProduct(searchParameters: any, restaurantId: any) {
    let response = new restResponse()
    if (!searchParameters || !restaurantId) {
        response.payload = "searchParameters and restaurantId is required"
        response.status = "error"
        return response;
    }
    let persons = searchParameters.persons
    let productTags = searchParameters.tags
    let drinkTags = searchParameters.drinks
    let attributes = searchParameters.attributes

    let productList: any[] = []
    let drinkList: any[] = []

    for (const productTag of productTags) {
        let products = await getProductByTag(productTag, persons, restaurantId, attributes)
        products.forEach((product: any) => {
            if (!productList.includes(product.productId)) { productList.push(product.productId) }
        });
    }

    if (productList.length > 0) {
        let products = await getProductByTag(drinkTags, persons, restaurantId)
        products.forEach((product: any) => {
            if (!drinkList.includes(product.productId)) { drinkList.push(product.productId) }
        });
    }


    let itemList = {
        products: productList,
        drinks: drinkList
    }

    let result = itemList
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