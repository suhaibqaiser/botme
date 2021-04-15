var express = require('express');
var router = express.Router();
var nlpController = require('../controllers/nlpController');

router.post('/communicate', nlpController.communicate);

router.get('/train', nlpController.train);

module.exports = router;