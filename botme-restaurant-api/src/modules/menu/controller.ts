import {restResponse} from "../../utils/response";
import {createMenu, getMenu} from "./service";

export async function addMenu(menu: any) {
    let response = new restResponse()
    if (!menu) {
        response.payload = "menu is required"
        response.status = "error"
        return response;
    }

    let result = await createMenu(menu)
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


export async function findMenu(menuId: any) {
    let response = new restResponse()
    if (!menuId) {
        response.payload = "menuId is required"
        response.status = "error"
        return response;
    }

    let result = await getMenu(menuId)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "menu not found"
        response.status = "error"
        return response
    }
}