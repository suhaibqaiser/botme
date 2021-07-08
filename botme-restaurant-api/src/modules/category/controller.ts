import {restResponse} from "../../utils/response";
import {createCategory, getCategory} from "./service";


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