const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const coinRoutes = require('./routes/coins');
const rootRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/coins', coinRoutes);
app.use('/', rootRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
