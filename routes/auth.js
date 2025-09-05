const express = require('express');
const router = express.Router();
const { 
  signup, 
  login, 
  logout, 
  profile, 
  updateProfile,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  requestPasswordReset, 
  updatePassword, 
  verifyEmail 
} = require('../controllers/authController');

// POST /api/auth/signup
router.post('/signup', signup);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/profile (protected)
router.get('/profile', profile);

// POST /api/auth/forgot-password
router.post('/forgot-password', requestPasswordReset);

// POST /api/auth/update-password (protected)
router.post('/update-password', updatePassword);

// GET /api/auth/verify-email
router.get('/verify-email', verifyEmail);

// PUT /api/auth/profile (protected)
router.put('/profile', updateProfile);

// GET /api/auth/favorites (protected)
router.get('/favorites', getFavorites);

// POST /api/auth/favorites (protected)
router.post('/favorites', addToFavorites);

// DELETE /api/auth/favorites/:coinId (protected)
router.delete('/favorites/:coinId', removeFromFavorites);

module.exports = router;
