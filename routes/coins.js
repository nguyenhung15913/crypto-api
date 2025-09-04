const express = require('express');
const router = express.Router();
const { getCoins } = require('../controllers/coinsController');

// GET /api/coins
router.get('/', getCoins);

module.exports = router;
