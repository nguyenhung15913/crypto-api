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

module.exports = { getCoins };
