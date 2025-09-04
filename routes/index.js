const express = require('express');
const router = express.Router();

// Root route
router.get('/', (req, res) => {
  res.send('Welcome to the Crypto API backend 🚀');
});

// Example POST route
router.post('/echo', (req, res) => {
  res.json({ received: req.body });
});

module.exports = router;
