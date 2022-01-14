const userService = require('../services/userService')
const Response = require("../models/response")
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const jwtKey = 'superSecretJWTKey'
const minutesToAdd = 300;


async function userLogin(req, res) {
    let currentDate = new Date();
    let response = new Response()

    let futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);
    console.log(currentDate, futureDate)

    if (!req.body.username || !req.body.password) {
        response.payload = { message: 'Both username and password are required' };
        return res.status(400).send(response);
    }
    let userObject = {
        username: req.body.username,
        password: req.body.password,
    }
    let user = await userService.getUserByUsername(userObject.username)

    if (user) {
        if (user.userSecret === userObject.password && user.userActive === true) {
            let payload = {
                subject: user.userId,
                expiresAt: futureDate
            }
            let token = jwt.sign(payload, jwtKey)
            user.userToken = token
            userService.updateUser(user)
            response.payload = {
                loginToken: token,
                userId: user.userId,
                userFullName: user.userFullName
            }
            response.status = "success"
            return res.status(200).send(response)
        } else {
            response.payload = "Username or password incorrect"
            response.status = "error"
            return res.status(200).send(response)
        }
    } else {
        response.payload = "User not found"
        response.status = "error"
        return res.status(200).send(response)
    }
}

function verifyToken(req, res, next) {
    let currentDate = new Date();
    if (!req.headers.authorization) return res.status(401).send('Unauthorized')
    let token = req.headers.authorization.split(' ')[1]

    if (token === 'null') return res.status(401).send('Unauthorized')

    if (!jwt.decode(token)) return res.status(401).send('Unauthorized. Invalid JWT Token')
    let payload = jwt.verify(token, jwtKey)
    if (!payload) return res.status(401).send('Unauthorized')
    if (new Date(payload.expiresAt) < currentDate) return res.status(401).send('Unauthorized. Session Expired')
    return res.status(200).send()
}

module.exports = ({ userLogin, verifyToken })
