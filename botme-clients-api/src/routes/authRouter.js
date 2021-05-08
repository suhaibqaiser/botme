const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

// PUT request for registering Client.
router.post('/login', authController.userLogin);
router.get('/verifyToken', authController.verifyToken);

module.exports = router;