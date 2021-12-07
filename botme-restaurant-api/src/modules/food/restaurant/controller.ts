import {
    getAreas,
    getAreaTables
} from "./service"
import {restResponse} from "../../../utils/response"


export async function areaTable(areaId: string) {
    let response = new restResponse()

    if (!areaId) {
        response.status = "error"
        response.payload = 'areaId is required';
        return response
    }

    let result = await getAreaTables(areaId)
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

export async function getAreaList() {
    let response = new restResponse()

    let result = await getAreas()
    if (result.length != 0) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Area not found"
        response.status = "error"
        return response
    }
}
