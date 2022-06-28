
const Response = require("../models/response");
const deviceService = require("../services/deviceServices");
const crypto = require('crypto');
const sessionController = require("./sessionController");
const { v4: uuidv4 } = require('uuid');


// Display All Devices
async function getDeviceList(req, res) {
  let response = new Response();
  let devices = await deviceService.getDeviceList(req.query.restaurantId);

  if (devices) {
    response.payload = devices;
    response.status = "success";
    return res.status(200).send(response);
  } else {
    response.payload = "No device found";
    response.status = "error";
    return res.status(404).send(response);
  }
}

// Display specific device details
async function getDeviceDetails(req, res) {
  let response = new Response();

  if (!req.query.deviceId) {
    response.status = "danger";
    response.message= "Device id is required."
    return res.json(response);
  }

  let device = await deviceService.getDeviceById(req.query.deviceId);

  if (device) {
    response.payload = device;
    response.status = "success";
    response.message= "Your Device Id verified!"
    return res.json(response);
  } else {
    response.payload = "Device not found";
    response.status = "danger";
    response.message= "Opps! invalid device id."
    return res.json(response);
  }
}

// Create new device
async function addDevice(req, res) {
  let response = new Response();

  if (!req.body.deviceLabel || !req.body.deviceName || !req.body.deviceType || !req.body.deviceDescription || !req.body.restaurantId) {
    response.payload = {
      message: 'deviceLabel,deviceName,deviceType and deviceDescription is required'
    };
    return res.status(400).send(response);
  }

  if (await deviceService.checkDeviceExists(req.body.deviceLabel,req.body.restaurantId)) {
    response.payload = {
      message: 'Device already exists'
    };
    return res.status(400).send(response);
  }

//   if(!['robot','web'].includes(req.body.deviceType.toLowerCase())){
//     response.payload = 'Invalid device type. Please enter the correct one.'
//     response.status = "error"
//     return res.send(response)
// }

  let device = req.body
  device.deviceId = uuidv4()

  console.log("device==>",device)

  let newDevice = await deviceService.addDevice(device);

  if (newDevice) {
    response.payload = newDevice;
    response.status = "success";
    return res.status(200).send(response);
  }

  response.payload = "Error in saving device";
  response.status = "error";
  return res.status(404).send(response);

}

// Update device
async function updateDevice(req, res) {
  let response = new Response();

  if (!req.query.deviceId) {
    response.payload = {
      message: 'deviceId is required'
    };
    return res.status(400).send(response);
  }

  let device = req.body
  let updatedDevice = await deviceService.updateDevice(req.query.deviceId, device);

  if (updatedDevice) {
    response.payload = updatedDevice;
    response.status = "success";
    return res.status(200).send(response);
  } else {
    response.payload = "Error in updating device, make sure the deviceId is correct.";
    response.status = "error";
    return res.status(400).send(response);
  }
}

// Delete device
async function deleteDevice(req, res) {
  let response = new Response();

  if (!req.query.deviceId) {
    response.payload = {
      message: 'deviceId is required'
    };
    return res.status(400).send(response);
  }

  if (await deviceService.deleteDevice(req.query.deviceId)) {
    response.payload = {
      "message": "Device deleted successfully"
    };
    response.status = "success";
    return res.status(200).send(response);
  } else {
    response.payload = "Error in deleting device, make sure the deviceLabel is correct.";
    response.status = "error";
    return res.status(400).send(response);
  }
}

module.exports = {
  getDeviceList,
  getDeviceDetails,
  addDevice,
  updateDevice,
  deleteDevice
};
