import { restResponse } from "../../../utils/response";
import { createCategory, deleteCategory, findCategory, getCategory, updateCategory } from "./service";
import { randomUUID } from "crypto";


export async function addCategory(category: any, restaurantId: any) {
    let response = new restResponse()
    if (!category || !restaurantId) {
        response.payload = "category and restaurantId is required"
        response.status = "error"
        return response;
    }
    category.categoryId = randomUUID()
    category.restaurantId = restaurantId

    let result = await createCategory(category)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "category not found"
        response.status = "error"
        return response
    }
}

export async function searchCategory(filter:any) {
    let response = new restResponse()

    if (filter.categoryName == "" || filter.restaurantId == ""){
        response.payload = "categoryName and restaurantId required"
        response.status = "error"
        return response
    }
    filter.categoryName = { $regex: filter.categoryName,$options:"i" }
    // filter.categoryActive = true
    console.log(filter)
    let result = await findCategory(filter)

    if (result.length != 0) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "category not found"
        response.status = "error"
        return response
    }
}

export async function getAllCategory(restaurantId: any) {
    let response = new restResponse()

    let result = await getCategory(restaurantId)
    if (result.length != 0) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "category not found"
        response.status = "error"
        return response
    }
}


export async function editCategory(category: any, restaurantId: any) {
    let response = new restResponse()
    if (!category || !restaurantId) {
        response.payload = "category and restaurantId is required"
        response.status = "error"
        return response;
    }
    category.restaurantId = restaurantId

    let result = await updateCategory(category)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "category not found"
        response.status = "error"
        return response
    }
}


export async function removeCategory(categoryId: any, restaurantId: any) {
    let response = new restResponse()
    if (!categoryId || !restaurantId) {
        response.payload = "categoryId and restaurantId is required"
        response.status = "error"
        return response;
    }

    let result = await deleteCategory(categoryId, restaurantId)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "category not found"
        response.status = "error"
        return response
    }
}
