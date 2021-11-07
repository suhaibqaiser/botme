const clientService = require("../services/clientService")
const Response = require("../models/response")
const {v4: uuidv4} = require('uuid');
const crypto = require('crypto');
const sessionController = require("./sessionController");

// Display list of all Clients.
async function getClientList(req, res) {
    let response = new Response()
    let clients = await clientService.getClientList()
    if (clients) {
        response.payload = clients
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "No clients found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

// Display details for a specific Client.
async function getClientDetail(req, res) {
    let response = new Response()

    if (!req.query.clientID) {
        response.payload = {message: 'clientID is required'};
        return res.status(400).send(response);
    }
    let client = await clientService.getClientDetail(req.query.clientID)
    if (client) {
        response.payload = client
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Client not found"
        response.status = "error"
        return res.status(404).send(response)
    }
}

// Create new client
async function addClient(req, res) {
    let response = new Response()

    if (!req.body.clientDeviceId) {
        response.payload = {message: 'clientDeviceId is required'};
        return res.status(400).send(response);
    }

    if (await clientService.checkClientExists(req.body.clientDeviceId)) {
        response.payload = {message: 'Client Device already exists'};
        return res.status(400).send(response);
    }

    let clientID = uuidv4();
    let hash = crypto.createHash('sha256');
    let clientSecret = hash.update(req.body.clientDeviceId).digest('hex');

    let client = {
        clientDeviceId: req.body.clientDeviceId,
        clientID: clientID,
        clientSecret: clientSecret,
        clientName: req.body.clientName,
        clientCreated: Date(),
        clientUpdated: null,
        clientActive: req.body.clientActive,
        clientComment: req.body.clientComment
    }

    let newClient = await clientService.addClient(client)

    if (newClient) {
        response.payload = newClient
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Error in saving client"
        response.status = "error"
        return res.status(404).send(response)
    }
}

// Authenticate client and provide token at successful authentication
async function authorizeClient(req, res) {
    let response = new Response()

    if (!req.body.clientID || !req.body.clientSecret) {
        response.payload = {message: 'clientID or clientSecret is required'};
        return res.status(400).send(response);
    }


    let client = await clientService.getClientDetail(req.body.clientID, req.body.clientDeviceId, req.body.clientSecret)

    if (client) {
        let hash = crypto.createHash('sha256');
        let clientToken = hash.update(Date()).digest('base64');

        let session = {
            clientID: req.body.clientID,
            clientToken: clientToken
        }

        let newSession = await sessionController.createSession(session)
        if (newSession) {
            response.payload = {
                "clientToken": newSession.clientToken,
                'clientName': client.clientName,
                'clientDeviceId': client.clientDeviceId,
                'clientID': client.clientID,
                'isLoggedIn': true
            }
            response.status = "success"
            return res.status(200).send(response)
        } else {
            response.payload = "Error in creating session"
            response.status = "error"
            return res.status(400).send(response)
        }
    } else {
        response.payload = "deviceID or clientID or clientSecret is incorrect or client is not active"
        response.status = "error"
        return res.status(400).send(response)
    }
}

// Update client
async function updateClient(req, res) {
    let response = new Response()

    if (!req.body.clientID) {
        response.payload = {message: 'clientID is required'};
        return res.status(400).send(response);
    }

    let client = {
        clientDeviceId: req.body.clientDeviceId,
        clientSecret: req.body.clientSecret,
        clientName: req.body.clientName,
        clientUpdated: Date(),
        clientActive: req.body.clientActive,
        clientComment: req.body.clientComment
    }

    let updatedClient = await clientService.updateClient(req.body.clientID, client)
    if (updatedClient) {
        response.payload = updatedClient
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Error in updating client, make sure the clientId is correct."
        response.status = "error"
        return res.status(400).send(response)
    }
}

async function deleteClient(req, res) {
    let response = new Response()

    if (!req.query.clientID) {
        response.payload = {message: 'clientID is required'};
        return res.status(400).send(response);
    }

    if (await clientService.deleteClient(req.query.clientID)) {
        response.payload = {"message": "Client deleted successfully"}
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Error in deleting client, make sure the clientId is correct."
        response.status = "error"
        return res.status(400).send(response)
    }
}

// Client heartbeat to keep alive
async function heartbeatClient(req, res) {
    let response = new Response()

    if (!req.body.clientToken) {
        response.payload = {message: 'clientToken is required'};
        return res.status(400).send(response);
    }
    let session = await sessionController.getSessionByToken(req.body.clientToken)

    if (session) {
        session.sessionUpdated = Date()
        session.sessionActive = true;
        if (await sessionController.updateSession(session.clientToken, session)) {

            response.payload = {"message": "Client updated successfully"}
            response.status = "success"
            return res.status(200).send(response)
        } else {
            response.payload = "Error in updating client, make sure the clientToken is correct."
            response.status = "error"
            return res.status(400).send(response)
        }
    } else {
        response.payload = "clientSecret is incorrect or session is invalid"
        response.status = "error"
        return res.status(400).send(response)
    }
}

// exports.client_command = async function (req, res) {
//     if (!req.body.clientID) {
//         failure.payload = {message: 'clientID not found'};
//         return res.status(404).send(failure);
//     }
//
//     let queueResponse = await queue.queueMessage(req.body.clientID, req.body.command);
//
//     if (queueResponse.status == 200) {
//         success.payload = 'Message queued successfully: ' + queueResponse.message;
//         res.status(200).send(success);
//     } else {
//         failure.payload = queueResponse.message;
//         res.status(403).send(failure);
//     }
// }

module.exports = ({
    getClientList,
    getClientDetail,
    addClient,
    authorizeClient,
    updateClient,
    deleteClient,
    heartbeatClient
})
