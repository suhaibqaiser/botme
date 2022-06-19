import { restResponse } from "../../../utils/response";
import { createProduct, getProduct, updateProduct, getMaxLabelValue, getProductByTag , getProductByTagWithoutAttribute, getProductByTime, getProductByServingTime } from "./service";
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
    let addonTags = searchParameters.addon
    let ingredientTags = searchParameters.ingredient
    let attributes = searchParameters.attributes

    let productList: any[] = []
    let drinkList: any[] = []
    let addonList: any[] = []
    let ingredientList: any[] = []

    for (const productTag of productTags) {
        let products = await getProductByTag(productTag, persons, restaurantId, attributes)
        products.forEach((product: any) => {
            if (!productList.includes(product.productId)) { productList.push(product.productId) }
        });
    }

    if (productList.length > 0) {
        for (const drinkTag of drinkTags) {
            let products = await getProductByTagWithoutAttribute(drinkTag, persons, restaurantId)
            products.forEach((product: any) => {
                if (!drinkList.includes(product.productId)) { drinkList.push(product.productId) }
            });
        }
        for (const addonTag of addonTags) {
            let addons = await getProductByTagWithoutAttribute(addonTag, persons, restaurantId)
            addons.forEach((addon:any) => {
                if (!addonList.includes(addon.productId)) { addonList.push(addon.productId)}
            });
        }
        for (const ingredientTag of ingredientTags) {
            let ingredients = await getProductByTagWithoutAttribute(ingredientTag,persons,restaurantId)
            ingredients.forEach((ingredient:any) => {
                if (!ingredientList.includes(ingredient.productId)) {ingredientList.push(ingredient.productId)}
            });
        }
    }

    let itemList = {
        products: productList,
        drinks: drinkList,
        addons: addonList,
        ingredient: ingredientList

    }
    console.log("item list==>",itemList)
    let result = itemList
    if (result.products.length != 0 || result.drinks.length !=0 || result.addons.length !=0 || result.ingredient.length !=0) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "product not found"
        response.status = "error"
        return response
    }

}
export async function suggestProductByTime(searchParameters: any, restaurantId: any) {
    let response = new restResponse()
    if (!searchParameters || !restaurantId) {
        response.payload = "searchParameters and restaurantId is required"
        response.status = "error"
        return response;
    }
    let tag = searchParameters.tags

    let productList: any[] = []
    let drinkList: any[] = []
    let addonList: any[] = []
    let ingredientList: any[] = []

    for (const Tag of tag) {
        let products = await getProductByTime(Tag,restaurantId)
        products.forEach((product: any) => {
            if (!productList.includes(product.productId)) { productList.push(product.productId) }
        });
    }

    let itemList = {
        products: productList,
        drinks: drinkList,
        addons: addonList,
        ingredient: ingredientList
    }

    console.log("item list==>",itemList)
    let result = itemList
    if (result.products.length != 0 || result.drinks.length !=0 || result.addons.length !=0 || result.ingredient.length !=0) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "product not found"
        response.status = "error"
        return response
    }   
}
export async function suggestProductByServingTime(searchParameters: any, restaurantId: any) {
    let response = new restResponse()
    if (!searchParameters || !restaurantId) {
        response.payload = "searchParameters and restaurantId is required"
        response.status = "error"
        return response;
    }
    let tag = searchParameters.tags

    let productList: any[] = []
    let drinkList: any[] = []
    let addonList: any[] = []
    let ingredientList: any[] = []

    let products = await getProductByServingTime(tag,restaurantId)
    products.forEach((product: any) => {
        if (!productList.includes(product.productId)) { productList.push(product.productId) }
    });
    

    let itemList = {
        products: productList,
        drinks: drinkList,
        addons: addonList,
        ingredient: ingredientList
    }

    console.log("item list==>",itemList)
    let result = itemList
    if (result.products.length != 0 || result.drinks.length !=0 || result.addons.length !=0 || result.ingredient.length !=0) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "product not found"
        response.status = "error"
        return response
    }   
}