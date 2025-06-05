// server.js

const express = require('express');
const app = express();
const ingestRoutes = require('./routes/ingest');
const { startProcessing } = require('./services/processor');

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/', ingestRoutes);

// Start the background worker
startProcessing();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
