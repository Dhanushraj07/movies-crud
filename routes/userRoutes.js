const express = require('express');
const {updatePassword,getMe, updateUser, deleteUser} = require('../controllers/userController');
const { protect } = require('../controllers/authController');
const { userDetails } = require('../controllers/movies.controller');
const router = express.Router();

router.get('/userdetails',userDetails);
router.patch('/updatePassword',protect, updatePassword);
router.get('/me', protect, getMe);
router.patch('/updateMe',protect,updateUser);
router.delete('/deleteMe',protect,deleteUser);

 module.exports = router;