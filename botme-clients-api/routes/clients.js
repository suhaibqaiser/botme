var express = require('express');
var router = express.Router();
var client_controller = require('../controllers/clientsController');

// PUT request for registering Client.
router.put('/client/register', client_controller.client_register);

// DELETE request to delete Client.
//router.delete('/client/remove', client_controller.client_remove);

// POST request to update Client.
router.post('/client/update', client_controller.client_update);

// POST request to report alive Client.
router.post('/client/heartbeat', client_controller.client_heartbeat);

// GET request for all Clients list.
router.get('/client/list', client_controller.client_list);

// GET request for all Clients count.
//router.get('/client/count', client_controller.client_count);

// GET request for one Client.
router.get('/client/detail', client_controller.client_detail);

// POST request for Client auth.
router.post('/client/auth', client_controller.client_auth);

// POST request for the client to send commands
router.post('/client/command', client_controller.client_command);

module.exports = router;