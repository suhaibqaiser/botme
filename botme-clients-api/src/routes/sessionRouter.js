const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// GET request for all session list.
router.get('/list', sessionController.getSessionList);

// GET request for session detail .
router.get('/detail', sessionController.getSessionDetails);

// GET request for session by token.
router.get('/sessionbytoken', sessionController.getSessionByToken);

module.exports = router;