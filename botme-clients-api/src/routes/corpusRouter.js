var express = require('express');
var router = express.Router();
var corpusController = require('../controllers/corpusController');

router.get('/list', corpusController.corpus_list);
router.post('/add', corpusController.corpus_create);

module.exports = router;