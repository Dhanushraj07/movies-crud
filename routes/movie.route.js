const express = require('express');
const router = express.Router();
const { movieIndex, movieCreate, movieUpdate, movieDelete } = require('../controllers/movies.controller');
router.get('/', movieIndex);

router.post('/', movieCreate);

router.put('/:id', movieUpdate);

router.delete('/:id', movieDelete);

module.exports = router;