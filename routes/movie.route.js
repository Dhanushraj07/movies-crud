const express = require('express');
const router = express.Router();
const { movieIndex, movieCreate, movieUpdate, movieDelete, movieCount, movieShow } = require('../controllers/movies.controller');
const { protect,restrictTo } = require('../controllers/authController');
//router.get('/count', movieCount);
router.get('/', protect,movieIndex);
router.get('/show',protect,movieShow);
router.post('/', movieCreate);

router.put('/:id', movieUpdate);

router.delete('/:id',protect,restrictTo('admin'), movieDelete);

module.exports = router;