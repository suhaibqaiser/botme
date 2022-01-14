const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.get('/list', userController.getUsers);
router.get('/byusername', userController.getUserByUsername);
router.get('/byid', userController.getUserById);
router.put('/add', userController.addUser);
router.post('/update', userController.updateUser);

module.exports = router;
