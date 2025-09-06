const express = require('express');
const router = express.Router();
const { getCoins, getFavoriteCoins, addToFavorites } = require('../controllers/coinsController');
const { authenticateToken } = require('../middleware/auth');

// GET /api/coins (public)
router.get('/', getCoins);

// GET /api/coins/favorites (protected)
router.get('/favorites', authenticateToken, getFavoriteCoins);

// POST /api/coins/favorites (protected)
router.post('/favorites', authenticateToken, addToFavorites);

module.exports = router;
