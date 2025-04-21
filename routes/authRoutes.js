const express = require('express');
const { signup, login } = require('../controllers/authController');
const { userDetails } = require('../controllers/movies.controller');
const router = express.Router();

router.post('/register',signup);
router.post('/login', login);
router.get('/userdetails',userDetails);


 module.exports = router;