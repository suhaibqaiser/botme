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
        response.payload ='Error: client session not found'
        return response
    }
}

async function validateSession(clientToken) {
    let s = await getSession(clientToken)
    if (s.status === 'success') {
        if (s.payload.sessionActive === true) {
            response.status = "success"
            response.payload = true
        } else {
            response.status = "error"
            response.payload = false
        }
    } else {
        response = s
    }
    return response
}

module.exports = ({getSession, validateSession})