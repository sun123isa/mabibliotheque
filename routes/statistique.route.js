const express = require('express');

const router = express.Router();

const {
  getStatistiques
} = require('../controllers/statistique.controller');

router.get('/', getStatistiques);

module.exports = router;