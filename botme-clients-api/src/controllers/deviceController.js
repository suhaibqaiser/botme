const Response = require("../models/response");
const deviceService = require("../services/deviceServices");
const {v4: uuidv4} = require('uuid');
const {accountStateList} = require('../utils/helper.js')
const {addDevice} = require('../utils/helperMethods.js')

// Display All Devices
async function getDeviceList(req, res) {
    try {
        let response = new Response();
        let devices = await deviceService.getDeviceList();

        if (devices) {
            response.payload = devices;
            response.status = "success";
            return res.json(response);
        }

        response.message = "No device found";
        response.status = "danger";
        return res.json(response);

    } catch (e) {
        response.status = "danger";
        response.message = 'Exception: Failed to get device.'
        response.payload = e
        return res.json(response);
    }
}

// Display specific device details
async function getDeviceDetails(req, res) {
    try {
        let response = new Response();

        if (!req.query.label) {
            response.status = "danger";
            response.message = "Device id is required."
            return res.json(response);
        }

        let device = await deviceService.getDeviceById(req.query.label);

        if (device) {
            response.payload = device;
            response.status = "success";
            response.message = "Your Device Id verified!"
            return res.json(response);
        }

        response.message = "No devices are added yet.";
        response.status = "danger";
        return res.json(response);

    } catch (e) {
        response.status = "danger";
        response.message = 'Exception: Failed to get device.'
        response.payload = e
        return res.json(response);
    }
}

// Create new device
async function addDevice(req, res) {
    try {
        const response = await addDevice(req.body)
        return res.json(response);

    } catch (e) {
        response.status = "danger";
        response.message = 'Exception: Failed to add device.'
        response.payload = e
        return res.json(response);
    }
}

// Update device
async function updateDevice(req, res) {
    try {
        let response = new Response();

        const device = JSON.parse(JSON.stringify(req.body))

        if (!req.query.label) {
            response.message = "Device label is required.";
            response.status = "danger";
            return res.json(response);
        }


        if (!accountStateList.includes(device.state)) {
            response.status = "danger";
            response.message = "Device state is invalid."
            return res.json(response);
        }


        if (await deviceService.checkDeviceExists('email', device.email)) {
            response.status = "danger";
            response.message = "Device already exists with this email."
            return res.json(response);
        }

        const updatedDevice = await deviceService.updateDevice(req.query.label, device);

        if (updatedDevice) {
            response.payload = updatedDevice;
            response.status = "success";
            response.message = "Device updated successfully.";
            return res.json(response);
        }

        response.message = "Failed to update device.";
        response.status = "danger";
        return res.json(response);

    } catch (e) {
        response.status = "danger";
        response.message = 'Exception: Failed to update device.'
        response.payload = e
        return res.json(response);
    }
}

// Delete device
async function deleteDevice(req, res) {
    try {
        let response = new Response();

        if (!req.query.label) {
            response.message = "Device label is required.";
            response.status = "danger";
            return res.json(response);
        }

        const device = await deviceService.deleteDevice(req.query.label)

        if (device) {
            response.payload = device;
            response.status = "success";
            response.message = "Device deleted successfully.";
            return res.json(response);
        }

        response.message = "Failed to deleted device.";
        response.status = "danger";
        return res.json(response);

    } catch (e) {
        response.status = "danger";
        response.message = 'Exception: Failed to delete device.'
        response.payload = e
        return res.json(response);
    }
}

module.exports = {
    getDeviceList,
    getDeviceDetails,
    addDevice,
    updateDevice,
    deleteDevice
};
