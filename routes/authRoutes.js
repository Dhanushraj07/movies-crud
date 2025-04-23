const express = require('express');
const { signup, login, forgotPassword, resetPassword } = require('../controllers/authController');
const { userDetails } = require('../controllers/movies.controller');
const router = express.Router();

router.post('/register',signup);
router.post('/login', login);

router.post('/forgotPassword',forgotPassword);
router.patch('/resetPassword/:token', resetPassword);


 module.exports = router;