let express = require('express');
let router = express.Router();
let restaurantController = require('../controllers/restaurantController');

router.get('/tables/', restaurantController.getAllTable);
router.get('/tables/unoccupied', restaurantController.getAllUnoccupiedTables);
router.get('/tables/unoccupiedbyseats', restaurantController.getAllUnoccupiedTablesBySeats);
router.post('/tables/update', restaurantController.updateTable);
router.get('/areas', restaurantController.getAreaTable);

module.exports = router;