const express = require('express');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Routes — only task operations (auth handled by auth-service on port 5001)
app.use('/tasks', taskRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'task-service', port: PORT });
});

// Start server
app.listen(PORT, () => {
  console.log(`Task Service running on port ${PORT}`);
});
