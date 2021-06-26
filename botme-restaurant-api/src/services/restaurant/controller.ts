import {
    addTable,
    getAllTables,
    getAllUnoccupiedTables,
    getAllUnoccupiedTablesBySeats,
    getAreaTables,
    updateTable
} from "./service"
import {restResponse} from "../../utils/response"


export async function getAllTable() {
    let response = new restResponse()

    let result = await getAllTables()
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

export async function getUnoccupiedTables() {
    let response = new restResponse()
    let result = await getAllUnoccupiedTables()
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


export async function getUnoccupiedTablesBySeats(seats: number) {
    let response = new restResponse()
    if (!seats) {
        response.payload = "seats is required"
        response.status = "error"
        return response;
    }

    let result = await getAllUnoccupiedTablesBySeats(seats)
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

export async function updateOneTable(table: any) {
    let response = new restResponse()
    if (!table) {
        response.payload = "table is required"
        response.status = "error"
        return response;
    }

    let result = await updateTable(table)
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

export async function createTable(table: any) {
    let response = new restResponse()
    if (!table) {
        response.payload = "table is required"
        response.status = "error"
        return response;
    }

    let result = await addTable(table)
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