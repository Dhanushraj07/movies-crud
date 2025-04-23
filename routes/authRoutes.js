const express = require('express');
const { signup, login, forgotPassword, resetPassword ,updatePassword,protect,getMe} = require('../controllers/authController');
const { userDetails } = require('../controllers/movies.controller');
const router = express.Router();

router.post('/register',signup);
router.post('/login', login);
router.get('/userdetails',userDetails);
router.post('/forgotPassword',forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword',protect, updatePassword);
router.get('/me', protect, getMe);

 module.exports = router;