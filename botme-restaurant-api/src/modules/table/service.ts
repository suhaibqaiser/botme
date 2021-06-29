import {Table} from "./model";

export async function getAllTables() {
    return Table.find({}, {_id: 0, __v: 0}).populate("area", {"tables": 0, _id: 0});
}

export async function getAllUnoccupiedTables() {
    return Table.find({"tableOccupied": false}, {_id: 0, __v: 0}).populate("area", {"tables": 0, _id: 0});
}

export async function getAllUnoccupiedTablesBySeats(seats: number) {
    let upperVal = seats + 1
    return Table.find({"tableOccupied": false, "tableSeats": {$gte: seats, $lte: upperVal}}, {
        _id: 0,
        __v: 0
    }).populate("area", {"tables": 0, _id: 0});
}

export async function updateTable(table: any) {
    return Table.findOneAndUpdate({"tableId": table.tableId}, table, {returnOriginal: true});
}

export async function addTable(table: any) {
    return Table.create(table)
}