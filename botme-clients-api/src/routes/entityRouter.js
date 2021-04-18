var express = require('express');
var router = express.Router();
var entityController = require('../controllers/entityController');

router.get('/list', entityController.entity_list);
router.post('/add', entityController.entity_create);

module.exports = router;