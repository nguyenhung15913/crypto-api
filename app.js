// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API endpoint to get crypto market data
app.get('/api/coins', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          per_page: 10
        },
        headers: {
          'x-cg-demo-api-key': 'CG-oJrCbrwsfJKjECK6snEuPz3k'
        }
      }
    );

    res.json(response.data); // send data to client
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Crypto API backend 🚀');
});

// Example POST route
app.post('/echo', (req, res) => {
  res.json({ received: req.body });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
