var express = require('express');
const router = express.Router();
const email_controller = require('../controllers/emailController')

// place order info summary email endpoints
router.post('/notification', email_controller.orderInfoSummary);