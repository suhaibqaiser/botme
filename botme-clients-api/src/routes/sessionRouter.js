const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// GET request for all Clients list.
router.get('/list', sessionController.getSessionList);

// GET request for all Clients list.
router.get('/detail', sessionController.getSessionDetails);

module.exports = router;