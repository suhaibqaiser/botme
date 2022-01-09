import { restResponse } from "../../../utils/response";
import { getMaxLabelValue } from "../../food/table/service";
import { randomUUID } from "crypto";
import {
    createTable,
    getAllTables,
    getTable,
    updateTable
} from "./service";

export async function findTable(filter: any, restaurantId: any) {
    let response = new restResponse()

    if (!restaurantId) {
        response.payload = "restaurantId is required"
        response.status = "error"
        return response;
    }

    interface queryFilters {
        tableSeats: any | undefined;
        tableOccupied: boolean | undefined;
        area: any | undefined;
        tableId: any | undefined;
        restaurantId: any | undefined;
    }

    let queryParams: queryFilters = {
        tableId: undefined,
        tableSeats: undefined,
        tableOccupied: undefined,
        area: undefined,
        restaurantId: undefined
    }

    if (filter.tableId) {
        queryParams.tableId = filter.tableId
    } else {
        delete queryParams.tableId
    }
    if (filter.seats) {
        queryParams.tableSeats = { $gte: Number(filter.seats), $lte: Number(filter.seats) + 1 }
    } else {
        delete queryParams.tableSeats
    }
    if (filter.occupied) {
        queryParams.tableOccupied = filter.occupied
    } else {
        delete queryParams.tableOccupied
    }
    if (filter.area) {
        queryParams.area = filter.area
    } else {
        delete queryParams.area
    }
    if (filter.restaurantId) {
        queryParams.restaurantId = filter.restaurantId
    } else {
        delete queryParams.restaurantId
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

export async function getAllTable(restaurantId: any) {
    let response = new restResponse()

    if (!restaurantId) {
        response.payload = "restaurantId is required"
        response.status = "error"
        return response;
    }

    let result = await getAllTables(restaurantId)
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

export async function updateOneTable(table: any, restaurantId: any) {
    let response = new restResponse()
    if (!table || !restaurantId) {
        response.payload = "table and restaurantId is required"
        response.status = "error"
        return response;
    }

    let result = await updateTable(table, restaurantId)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Table not found"
        response.status = "error"
        return response
    }
}

export async function addTable(table: any, restaurantId: any) {
    let response = new restResponse()
    if (!table || !restaurantId) {
        response.payload = "table and restaurantId is required"
        response.status = "error"
        return response;
    }

    table.tableId = randomUUID()
    let val = await getMaxLabelValue()
    table.tableLabel = val ? (val.tableLabel + 1) : 1
    table.restaurantId = restaurantId

    let result = await createTable(table)
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
