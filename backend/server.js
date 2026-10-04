require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Basic Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Healtify Lifestyle Companion API',
    timestamp: new Date().toISOString()
  });
});

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/score', require('./routes/score'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/insights', require('./routes/insights'));

const path = require('path');
const fs = require('fs');

// Serve Frontend static assets if build exists
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  console.log(`📦 Serving frontend static build from ${frontendDist}`);
  app.use(express.static(frontendDist));
  app.get('/{*splat}', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ success: false, message: 'API route not found' });
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Internal Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌿 Healtify Server running on port ${PORT}`));
