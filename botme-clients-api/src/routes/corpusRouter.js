let express = require('express');
let router = express.Router();
let corpusController = require('../controllers/corpusController');

router.get('/list', corpusController.corpus_list);
router.get('/detail', corpusController.corpus_detail);
router.post('/update', corpusController.corpus_update);
router.put('/add', corpusController.corpus_create);

module.exports = router;