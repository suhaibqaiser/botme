import {restResponse} from "../../utils/response";
import {createCategory, deleteCategory, getCategory, updateCategory} from "./service";


export async function addCategory(category: any) {
    let response = new restResponse()
    if (!category) {
        response.payload = "category is required"
        response.status = "error"
        return response;
    }

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

export async function getAllCategory() {
    let response = new restResponse()

    let result = await getCategory()
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


export async function editCategory(category: any) {
    let response = new restResponse()
    if (!category) {
        response.payload = "category is required"
        response.status = "error"
        return response;
    }

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


export async function removeCategory(categoryId: any) {
    let response = new restResponse()
    if (!categoryId) {
        response.payload = "categoryId is required"
        response.status = "error"
        return response;
    }

    let result = await deleteCategory(categoryId)
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