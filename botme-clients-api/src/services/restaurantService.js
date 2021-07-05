const Restaurant = require('../models/restaurant/restaurant')
const Area = require('../models/restaurant/area')
const Table = require('../models/restaurant/table')

async function getRestaurant(restaurantId) {
    return Restaurant.findOne({restaurantId: restaurantId}, {_id: 0, __v: 0});
}

function updateRestaurant(restaurant) {
    Restaurant.findOneAndUpdate({restaurantId: restaurant.restaurantId}, restaurant)
}

async function getAreas() {
    return Area.find({}, {_id: 0, __v: 0});
}

async function getAreaTables(areaId) {
    return Area.find({areaId: areaId}, {_id: 0, __v: 0}).populate("tables");
}

async function getAllTables() {
    return Table.find({}, {_id: 0, __v: 0}).populate("area");
}

async function getAllUnoccupiedTables() {
    return Table.find({"tableOccupied": false}, {_id: 0, __v: 0}).populate("area");
}

async function getAllUnoccupiedTablesBySeats(seats) {
    let upperVal = seats+1
    return Table.find({"tableOccupied": false, "tableSeats": {$gte: seats, $lte:upperVal}}, {_id: 0, __v: 0}).populate("area");
}

async function updateTable(table) {
    return Table.findOneAndUpdate({"tableId": table.tableId}, table);
}

module.exports = ({
    getRestaurant,
    updateRestaurant,
    getAreas,
    getAreaTables,
    getAllTables,
    getAllUnoccupiedTables,
    getAllUnoccupiedTablesBySeats,
    updateTable
})