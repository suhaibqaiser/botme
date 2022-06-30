
const Device = require('../models/devices');

async function getDeviceList(restaurantId) {
  return Device.find({restaurantId: restaurantId});
}

async function getDeviceById(deviceId) {
  return Device.findOne({ deviceId: deviceId}, { _id: 0,__v: 0});
}

async function checkDeviceExists(deviceLabel,restaurantId) {
  return Device.exists({
    deviceLabel: deviceLabel,
    restaurantId: restaurantId
  });
}

async function addDevice(devices) {
  let newDevice = new Device(devices);
  return await newDevice.save();
}

async function updateDevice(deviceId, device) {
  console.log("device==>",device)
  return Device.findOneAndUpdate({deviceId: deviceId}, device);
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