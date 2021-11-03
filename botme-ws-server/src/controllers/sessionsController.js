const session = require('../services/sessionService');
let response = {
    status: "",
    payload: ""
}

async function getSession(clientToken) {
    let s = await session.getSession(clientToken)
    if (s) {
        response.status = "success"
        response.payload = s
        return response
    } else {
        response.status = "error"
        response.payload = 'Error: client session not found'
        return response
    }
}

module.exports = ({getSession})