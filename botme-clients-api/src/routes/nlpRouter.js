var express = require('express');
var router = express.Router();
var nlpController = require('../controllers/nlpController');

router.get('/corpus', nlpController.getCorpusList);
router.get('/corpusbyid', nlpController.getCorpusById);
router.put('/addCorpus', nlpController.addCorpus);
router.post('/updateCorpus', nlpController.updateCorpus);
router.get('/export', nlpController.exportActiveCorpus);

module.exports = router;