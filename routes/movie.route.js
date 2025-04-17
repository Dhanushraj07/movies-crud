const express = require('express');
const router = express.Router();
const { movieIndex, movieCreate, movieUpdate, movieDelete, movieCount } = require('../controllers/movies.controller');
router.get('/count', movieCount);
router.get('/', movieIndex);

router.post('/', movieCreate);

router.put('/:id', movieUpdate);

router.delete('/:id', movieDelete);

module.exports = router;