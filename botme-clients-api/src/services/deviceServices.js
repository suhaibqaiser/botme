
const Device = require('../models/devices');

async function getDeviceList() {
  return Device.find();
}

async function getDeviceById(deviceLabel) {
  return Device.findOne({
    deviceLabel: deviceLabel
  }, {
    _id: 0,
    __v: 0
  });
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

async function updateDevice(deviceLabel, device) {
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

module.exports = {
  getDeviceList,
  getDeviceById,
  checkDeviceExists,
  addDevice,
  updateDevice,
  deleteDevice
};