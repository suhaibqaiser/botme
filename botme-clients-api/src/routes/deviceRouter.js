
const express = require('express');

const router = express.Router();

const device_controller = require('../controllers/deviceController'); // GET request for all Device list.


router.get('/list', device_controller.getDeviceList); // GET request for one Device.

router.get('/detail', device_controller.getDeviceDetails); // PUT request for registering Device.

router.put('/register', device_controller.addDevice); // POST request to update device.

router.post('/update', device_controller.updateDevice); // DELETE request to delete Device.

router.delete('/remove', device_controller.deleteDevice);
module.exports = router;