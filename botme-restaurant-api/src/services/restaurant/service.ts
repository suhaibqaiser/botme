import {Area} from './models/area'
import {Table} from './models/table'
import {Restaurant} from "./models/restaurant";

export async function getRestaurant(restaurantId: string) {
    return Restaurant.findOne({restaurantId: restaurantId}, {_id: 0, __v: 0});
}

export function updateRestaurant(restaurant: any) {
    Restaurant.findOneAndUpdate({restaurantId: restaurant.restaurantId}, restaurant)
}

export async function getAreas() {
    return Area.find({}, {_id: 0, __v: 0});
}

export async function getAreaTables(areaId: string) {
    return Area.find({areaId: areaId}, {_id: 0, __v: 0, "tables.area": 0}).populate("tables", {"area": 0, _id: 0});
}

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