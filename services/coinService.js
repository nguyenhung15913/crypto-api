const axios = require('axios');
require('dotenv').config();


// If you use .env, load it like this:
// require('dotenv').config();

const fetchCoins = async () => {
  const response = await axios.get(
    'https://api.coingecko.com/api/v3/coins/markets',
    {
      params: {
        vs_currency: 'usd',
        per_page: 10
      },
      headers: {
        'x-cg-demo-api-key': process.env.CG_API_KEY || 'CG-oJrCbrwsfJKjECK6snEuPz3k'
      }
    }
  );
  return response.data;
};

module.exports = { fetchCoins };
