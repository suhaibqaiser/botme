var express = require('express');
var router = express.Router();
var client_controller = require('../controllers/clientsController');

// PUT request for registering Client.
router.put('/register', client_controller.client_register);

// DELETE request to delete Client.
//router.delete('/remove', client_controller.client_remove);

// POST request to update Client.
router.post('/update', client_controller.client_update);

// POST request to report alive Client.
router.post('/heartbeat', client_controller.client_heartbeat);

// GET request for all Clients list.
router.get('/list', client_controller.client_list);

// GET request for all Clients count.
//router.get('/client/count', client_controller.client_count);

// GET request for one Client.
router.get('/detail', client_controller.client_detail);

// POST request for Client auth.
router.post('/auth', client_controller.client_auth);

// POST request for the client to send commands
router.post('/command', client_controller.client_command);

module.exports = router;