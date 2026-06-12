const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware configuration
app.use(cors());
app.use(express.json());

// Serve Static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes under '/api'
app.use('/api', apiRouter);

// Fallback for SPA routing or non-existent static assets
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start listening
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` Navaratna Server active on http://localhost:${PORT}`);
  console.log(` Serving static files from: ${path.join(__dirname, 'public')}`);
  console.log(` API Router mounted at: http://localhost:${PORT}/api`);
  console.log(`===================================================`);
});
