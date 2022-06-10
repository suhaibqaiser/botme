const {accountStateList} = require("./helper");
const deviceService = require("../services/deviceServices");
const {v4: uuidv4} = require("uuid");
const Response = require("../models/response");

/**
 * adding the device
 * @param body
 * @returns {*}
 */
addDevice = async (body = {}) => {
    let response = new Response();
    let device = JSON.parse(JSON.stringify(body))

    if (!accountStateList.includes(device.state)) {
        response.status = "danger";
        response.message = "Device state is invalid."
        return response
    }

    if (!device.name || !device.restaurantId || !device.email) {
        response.status = "danger";
        response.message = "Device validation failed."
        return response
    }

    if (await deviceService.checkDeviceExists('label', device.label)) {
        response.status = "danger";
        response.message = "Device already exists with this label."
        return response
    }

    if (await deviceService.checkDeviceExists('email', device.email)) {
        response.status = "danger";
        response.message = "Device already exists with this email."
        return response
    }

    device.label = uuidv4()
    device.verificationToken = uuidv4()
    const newDevice = await deviceService.addDevice(device);

    if (newDevice) {
        response.payload = newDevice;
        response.message = "Device successfully added."
        response.status = "success";
        return response
    }

    response.message = "Error in saving device."
    response.status = "danger";
    return response
}

module.exports = ({
    addDevice
})
