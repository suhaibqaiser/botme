const express = require('express');
const router = express.Router();
const client_controller = require('../controllers/clientController');

// PUT request for registering Client.
router.put('/register', client_controller.addClient);

// GET request for all Clients list.
router.get('/list', client_controller.getClientList);

// GET request for one Client.
router.get('/detail', client_controller.getClientDetail);

// POST request for Client auth.
router.post('/auth', client_controller.authorizeClient);

// DELETE request to delete Client.
router.delete('/remove', client_controller.deleteClient);

// POST request to update Client.
router.post('/update', client_controller.updateClient);

// POST request to report Client as alive.
router.post('/heartbeat', client_controller.heartbeatClient);

// get request to verify customer account
router.get('/verifyAccount',client_controller.verifyCustomerAccount)

// // POST request for the client to send commands
// router.post('/command', client_controller.client_command);
//
// GET request for all Clients count.
//router.get('/client/count', client_controller.client_count);
//

module.exports = router;
