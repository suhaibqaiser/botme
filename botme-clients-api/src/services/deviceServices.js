const Device = require('../models/devices');
const {clientStateObj} = require("../utils/helper");

async function getDeviceList() {
    return Device.find();
}

async function getDeviceById(deviceLabel) {
    return Device.findOne({deviceLabel: deviceLabel}, {_id: 0, __v: 0});
}

async function checkDeviceExists(key = '', value) {
    return Device.exists({
        key: value
    });
}

async function addDevice(device = {}) {
    let newDevice = new Device(device);
    return await newDevice.save();
}

async function updateDevice(deviceLabel, device = {}) {
    return Device.findOneAndUpdate({
        deviceLabel: deviceLabel
    }, device, {
        "projection": {
            "_id": 0,
            "__v": 0
        },
        "new": true
    });
}

async function deleteDevice(deviceLabel) {
    return Device.findOneAndDelete({
        deviceLabel: deviceLabel
    });
}

async function verifyDeviceAccount(filter) {
    return Device.updateOne(filter, {
        $set: {
            deviceVerificationToken: true,
            deviceState: clientStateObj.active,
            deviceActive: true
        }
    })
}

module.exports = {
    getDeviceList,
    getDeviceById,
    checkDeviceExists,
    addDevice,
    updateDevice,
    deleteDevice,
    verifyDeviceAccount
};
