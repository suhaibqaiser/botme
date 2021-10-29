let Client = require('../models/client');

async function getClientList() {
    return Client.find({}, {_id: 0, __v: 0});
}

async function getClientDetail(clientID, clientDeviceId, clientSecret) {
    return Client.findOne({
        clientID: clientID,
        clientDeviceId: clientDeviceId,
        clientSecret: clientSecret,
        clientActive: true
    }, {
        _id: 0,
        __v: 0
    })
}

async function addClient(client) {
    let newClient = new Client(client)
    return await newClient.save()
}

async function checkClientExists(clientDeviceId) {
    return Client.exists({clientDeviceId: clientDeviceId})
}

async function updateClient(clientID, client) {
    return Client.findOneAndUpdate({clientID: clientID}, client, {
        "projection": {"_id": 0, "__v": 0},
        "new": true
    })
}

async function deleteClient(clientID) {
    return Client.findOneAndDelete({clientID: clientID})
}

module.exports = ({getClientList, getClientDetail, addClient, checkClientExists, updateClient, deleteClient})
