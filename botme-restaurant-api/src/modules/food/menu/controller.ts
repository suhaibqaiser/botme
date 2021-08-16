import {restResponse} from "../../../utils/response";
import {randomUUID} from "crypto";
import {createMenu, getMenu, getMaxLabelValue, updateMenu, getAllMenus} from "../menu/service";
import {getTable} from "../table/service";


export async function addMenu(menu: any) {
    let response = new restResponse()
    if (!menu) {
        response.payload = "menu is required"
        response.status = "error"
        return response;
    }

    let val = await getMaxLabelValue()
    menu.menuLabel = val ? (val.menuLabel + 1) : 1
    menu.menuID = randomUUID()

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

export async function updateOneMenu(table: any) {
    let response = new restResponse()
    if (!table) {
        response.payload = "table is required"
        response.status = "error"
        return response;
    }

    let result = await updateMenu(table)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Tables not found"
        response.status = "error"
        return response
    }
}

export async function findMenu(filter: any) {
    let response = new restResponse()

    interface queryFilters {
        menuId: any | undefined;
        menuName: boolean | undefined;
    }

    let queryParams: queryFilters = {
        menuId: undefined,
        menuName: undefined,
    }

    if (filter.menuId) {
        queryParams.menuId = filter.menuId
    } else {
        delete queryParams.menuId
    }

    if (filter.menuName) {
        queryParams.menuName = filter.menuName
    } else {
        delete queryParams.menuName
    }


    let result = await getTable(queryParams)
    if (result.length != 0) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "table not found"
        response.status = "error"
        return response
    }
}

export async function getAllMenu() {
    let response = new restResponse()

    let result = await getAllMenus()
    if (result.length != 0) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Tables not found"
        response.status = "error"
        return response
    }
}
