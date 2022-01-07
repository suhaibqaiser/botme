import { Table } from "./model";

export async function getAllTables(restaurantId: string) {
    return Table.find({ restaurantId: restaurantId }, { __v: 0 }).populate("area", { "tables": 0, _id: 0 });
}

export async function getTable(queryParams: any) {
    return Table.find(queryParams, { __v: 0 }).populate("area", { "tables": 0 });
}

export async function updateTable(table: any, restaurantId: string) {
    return Table.findOneAndUpdate({ "tableId": table.tableId, restaurantId: restaurantId }, table, { returnOriginal: true });
}

export async function createTable(table: any) {
    return Table.create(table)
}

export async function getMaxLabelValue() {
    return Table.findOne({}).sort({ tableLabel: -1 })
}
