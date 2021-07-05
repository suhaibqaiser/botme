const restaurantService = require('../services/restaurantService')
const Response = require("../models/response")

async function getAllTable(req, res) {
    let response = new Response()

    let tables = await restaurantService.getAllTables()
    if (tables) {
        response.payload = tables
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Tables not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

async function getAreaTable(req, res) {
    let response = new Response()
    if (!req.body.areaId) {
        response.payload = {message: 'areaId is required'};
        return res.status(400).send(response);
    }

    let tables = await restaurantService.getAreaTables(req.body.areaId)
    if (tables) {
        response.payload = tables
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Tables not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

async function getAllUnoccupiedTables(req, res) {
    let response = new Response()

    let tables = await restaurantService.getAllUnoccupiedTables()
    if (tables) {
        response.payload = tables
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Tables not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}


async function getAllUnoccupiedTablesBySeats(req, res) {
    let response = new Response()
    if (!req.body.seats) {
        response.payload = {message: 'seats is required'};
        return res.status(400).send(response);
    }

    let tables = await restaurantService.getAllUnoccupiedTablesBySeats(req.body.seats)
    if (tables) {
        response.payload = tables
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Tables not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

async function updateTable(req, res) {
    let response = new Response()
    if (!req.body.tableId) {
        response.payload = {message: 'tableId is required'};
        return res.status(400).send(response);
    }

    let tables = await restaurantService.updateTable(req.body.table)
    if (tables) {
        response.payload = tables
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Tables not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

module.exports = ({getAllTable, getAreaTable, getAllUnoccupiedTables, getAllUnoccupiedTablesBySeats, updateTable})