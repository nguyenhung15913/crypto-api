const { fetchCoins } = require('../services/coinService');

const getCoins = async (req, res) => {
  try {
    const data = await fetchCoins();
    res.json(data);
  } catch (error) {
    console.error('Error fetching coins:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

// Get user's favorite coins (protected)
const getFavoriteCoins = async (req, res) => {
  try {
    // This would typically fetch from a database
    // For now, we'll return a mock response
    res.json({ 
      message: 'Favorites feature coming soon',
      userId: req.user.id,
      favorites: []
    });
  } catch (error) {
    console.error('Error fetching favorite coins:', error.message);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

// Add coin to favorites (protected)
const addToFavorites = async (req, res) => {
  try {
    const { coinId } = req.body;
    
    if (!coinId) {
      return res.status(400).json({ error: 'Coin ID is required' });
    }

    // This would typically save to a database
    // For now, we'll return a mock response
    res.json({ 
      message: 'Coin added to favorites',
      userId: req.user.id,
      coinId: coinId
    });
  } catch (error) {
    console.error('Error adding to favorites:', error.message);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
};

module.exports = { getCoins, getFavoriteCoins, addToFavorites };
