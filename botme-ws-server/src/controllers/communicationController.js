const commService = require("../services/communicationService")

let response = {
    status: "",
    payload: ""
}

async function processCommunication(message) {
    let communication = await commService.process(message)
    if (communication) {
        response.payload=communication.message
        response.status=communication.status
    } else {
        response.status="error"
        response.payload="Error: There is an error in communication api"
    }
    return response
}



module.exports = ({processCommunication})