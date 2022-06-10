const Device = require('../models/devices');

async function getDeviceList() {
    return Device.find();
}

async function getDeviceById(deviceId) {
    return Device.findOne({label: label}, {_id: 0, __v: 0});
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

async function updateDevice(label, device = {}) {
    return Device.findOneAndUpdate({
        label: label
    }, device, {
        "projection": {
            "_id": 0,
            "__v": 0
        },
        "new": true
    });
}

async function deleteDevice(label) {
    return Device.findOneAndDelete({
        label: label
    });
}

module.exports = {
    getDeviceList,
    getDeviceById,
    checkDeviceExists,
    addDevice,
    updateDevice,
    deleteDevice
};
