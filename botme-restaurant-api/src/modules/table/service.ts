import {Table} from "./model";

export async function getAllTables() {
    return Table.find({}, {_id: 0, __v: 0}).populate("area", {"tables": 0, _id: 0});
}

export async function getTable(queryParams: any) {
    return Table.find(queryParams, { __v: 0}).populate("area", {"tables": 0, _id: 0});
}

export async function updateTable(table: any) {
    return Table.findOneAndUpdate({"tableId": table.tableId}, table, {returnOriginal: true});
}

export async function createTable(table: any) {
    return Table.create(table)
}