let Client = require('../models/client');
const {clientStateObj} = require("../utils/helper");

async function getClientList() {
    return Client.find({}, {_id: 0, __v: 0});
}

async function getClientDetail(clientID, clientSecret) {
    return Client.findOne({
        clientID: clientID,
        clientSecret: clientSecret,
        clientActive: true
    }, {
        _id: 0,
        __v: 0
    })
}

async function getClientById(clientID) {
    return Client.findOne({
        clientID: clientID
    }, {
        _id: 0,
        __v: 0
    })
}

async function addClient(client) {
    let newClient = new Client(client)
    return await newClient.save()
}

async function checkClientExists(clientEmail) {
    return Client.exists({clientEmail: clientEmail})
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

async function verifyAccount(filter) {
    return Client.updateOne(filter, {
        $set: {
            clientEmailVerified: true,
            clientState: clientStateObj.active,
            clientActive: true
        }
    })
}

module.exports = ({
    getClientList,
    getClientDetail,
    getClientById,
    addClient,
    checkClientExists,
    updateClient,
    deleteClient,
    verifyAccount
})
