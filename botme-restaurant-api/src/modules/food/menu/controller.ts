import { restResponse } from "../../../utils/response";
import { createMenu, getMenu } from "./service";

export async function addMenu(menu: any, restaurantId: any) {
    let response = new restResponse()
    if (!menu || !restaurantId) {
        response.payload = "menu and restaurantId is required"
        response.status = "error"
        return response;
    }
    menu.restaurantId = restaurantId

    let result = await createMenu(menu)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Error in creating menu"
        response.status = "error"
        return response
    }
}


export async function findMenu(menuId: any, restaurantId: any) {
    let response = new restResponse()
    if (!menuId || !restaurantId) {
        response.payload = "menuId and restaurantId is required"
        response.status = "error"
        return response;
    }

    let result = await getMenu(menuId, restaurantId)
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