import {restResponse} from "../../../utils/response";
import {getMaxLabelValue} from "../../food/table/service";
import {randomUUID} from "crypto";
import {
    createTable,
    getAllTables,
    getTable,
    updateTable
} from "./service";

export async function findTable(filter: any) {
    let response = new restResponse()

    interface queryFilters {
        tableSeats: any | undefined;
        tableOccupied: boolean | undefined;
        area: any | undefined;
        tableId: any | undefined;
    }

    let queryParams: queryFilters = {
        tableId: undefined,
        tableSeats: undefined,
        tableOccupied: undefined,
        area: undefined
    }

    if (filter.tableId) {
        queryParams.tableId = filter.tableId
    } else {
        delete queryParams.tableId
    }
    if (filter.seats) {
        queryParams.tableSeats = {$gte: Number(filter.seats), $lte: Number(filter.seats) + 1}
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

export async function addTable(table: any) {
    let response = new restResponse()
    if (!table) {
        response.payload = "table is required"
        response.status = "error"
        return response;
    }

    table.tableId = randomUUID()
    let val = await getMaxLabelValue()
    table.tableLabel = val ? ( val.tableLabel + 1) : 1

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
