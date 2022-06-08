
const Device = require('../models/devices');

async function getDeviceList() {
  return Device.find();
}

async function getDeviceById(deviceId) {
  return Device.findOne({ deviceId: deviceId }, { _id: 0,__v: 0});
}

async function checkDeviceExists(deviceLabel) {
  return Device.exists({
    deviceLabel: deviceLabel
  });
}

async function addDevice(devices) {
  let newDevice = new Device(devices);
  return await newDevice.save();
}

async function updateDevice(deviceId, device) {
  return Device.findOneAndUpdate({
    deviceId: deviceId
  }, device, {
    "projection": {
      "_id": 0,
      "__v": 0
    },
    "new": true
  });
}

async function deleteDevice(deviceId) {
  return Device.findOneAndDelete({
    deviceId: deviceId
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