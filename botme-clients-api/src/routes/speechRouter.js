var express = require('express');
var router = express.Router();
var speechController = require('../controllers/speechController')

router.get('/gettts', speechController.getTTS);

router.post('/addtts', speechController.addTTS);

module.exports = router;