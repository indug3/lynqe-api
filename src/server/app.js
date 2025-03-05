// server/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const routes = require('./routes');
const { errorHandler } = require('./middleware/error.middleware');

// Initialize express app
const app = express();

// Apply middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // Enable CORS
app.use(express.json()); // Parse JSON requests
app.use(morgan('dev')); // Request logging

// API routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Supabase webhook endpoint for auth events
app.post('/webhooks/auth', express.json(), (req, res) => {
  const event = req.body;
  
  // Verify webhook secret if configured
  const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
  if (webhookSecret && req.headers['x-webhook-secret'] !== webhookSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Handle different auth events
  switch(event.type) {
    case 'user.created':
      // Handle new user creation
      console.log('New user created:', event.user.id);
      break;
    case 'user.deleted':
      // Handle user deletion
      console.log('User deleted:', event.user.id);
      break;
    // Add other event types as needed
  }
  
  res.status(200).json({ received: true });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;