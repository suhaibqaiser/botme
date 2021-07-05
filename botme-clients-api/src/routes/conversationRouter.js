var express = require('express');
var router = express.Router();
var conversationController = require('../controllers/conversationController');

router.get('/list', conversationController.getConversations);

module.exports = router;