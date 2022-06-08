
const express = require('express');

const router = express.Router();

const device_controller = require('../controllers/deviceController'); // GET request for all Device list.


router.get('/list', device_controller.getDeviceList); // GET all Devices details.

router.get('/detail', device_controller.getDeviceDetails); // Get device detail on deviceId.

router.put('/register', device_controller.addDevice); // ADD new device.

router.post('/update', device_controller.updateDevice);  // UPDATE device detail

router.delete('/remove', device_controller.deleteDevice); // DELETE request to delete Device.
module.exports = router;