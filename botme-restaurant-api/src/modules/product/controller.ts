import {restResponse} from "../../utils/response";
import {createProduct} from "./service";

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