const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const coinRoutes = require('./routes/coins');
const rootRoutes = require('./routes');
const authRoutes = require('./routes/auth'); // new

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from public directory

// Routes
app.use('/api/coins', coinRoutes);
app.use('/api/auth', authRoutes); // ✅ new
app.use('/', rootRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
