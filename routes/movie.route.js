const express = require('express');
const router = express.Router();
const { movieIndex, movieCreate, movieUpdate, movieDelete, movieCount, movieShow } = require('../controllers/movies.controller');
const { protect } = require('../controllers/authController');
//router.get('/count', movieCount);
router.get('/', protect,movieIndex);
router.get('/show',movieShow);
router.post('/', movieCreate);

router.put('/:id', movieUpdate);

router.delete('/:id', movieDelete);

module.exports = router;