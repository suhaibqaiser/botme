const userService = require('../services/userService')
const Response = require("../models/response")
const { v4: uuidv4 } = require('uuid')

async function getUsers(req, res) {
    let response = new Response()
    let users

    if (req.query.restaurantId) {
        users = await userService.getUsersByRestaurantId(req.query.restaurantId)
    } else {
        users = await userService.getUsers()
    }

    if (users.length > 0) {
        response.payload = users
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Users not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

async function getUserByUsername(req, res) {
    let response = new Response()

    if (!req.query.username) {
        response.payload = "Username is required"
        response.status = "error"
        return res.status(400).send(response)
    }

    let users = await userService.getUserByUsername(req.query.username)

    if (users) {
        response.payload = users
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "User not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

async function getUserById(req, res) {
    let response = new Response()

    if (!req.query.userId) {
        response.payload = "UserId is required"
        response.status = "error"
        return res.status(400).send(response)
    }

    let users = await userService.getUserByUserId(req.query.userId)

    if (users) {
        response.payload = users
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "User not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

async function addUser(req, res) {
    let response = new Response()

    if (!req.body.user) {
        response.payload = "User object is required"
        response.status = "error"
        return res.status(400).send(response)
    }

    let user = req.body.user
    user.userId = uuidv4()
    user.userCreated = new Date()

    let users = await userService.addUser(user)

    if (users) {
        response.payload = users
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "User adding failed"
        response.status = "error"
        return res.status(404).send(response)
    }
}

async function updateUser(req, res) {
    let response = new Response()

    if (!req.body.user) {
        response.payload = "User object is required"
        response.status = "error"
        return res.status(400).send(response)
    }

    let user = req.body.user

    let users = await userService.updateUser(user)

    if (users) {
        response.payload = users
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "User update failed"
        response.status = "error"
        return res.status(404).send(response)
    }
}



module.exports = ({ getUsers, getUserByUsername, addUser, updateUser, getUserById })
