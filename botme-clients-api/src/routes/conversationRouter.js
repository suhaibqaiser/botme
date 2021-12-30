var express = require('express');
var router = express.Router();
var conversationController = require('../controllers/conversationController');

router.get('/list', conversationController.getConversations);

router.post('/addConversation', conversationController.addConversation);

router.post('/addConversationLog', conversationController.addConversationLog);

router.post('/updateConversationLog', conversationController.updateConversationLog);

router.post('/endConversation', conversationController.endConversation);

router.get('/getConversationId', conversationController.getConversationId);


module.exports = router;