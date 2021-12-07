var express = require('express');
var router = express.Router();
var conversationController = require('../controllers/conversationController');

router.get('/list', conversationController.getConversations);

router.post('/addConversations', conversationController.addConversations);

router.post('/addConversationLog', conversationController.addConversationLog);

router.post('/endConversation', conversationController.endConversation);

router.get('/getConversationId', conversationController.getConversationId);


module.exports = router;