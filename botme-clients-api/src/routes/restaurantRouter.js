var express = require('express');
var router = express.Router();
var resturantController = require('../controllers/restaurantController');

router.get('/tables', resturantController.getTables);

module.exports = router;