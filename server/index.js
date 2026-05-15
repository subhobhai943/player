const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (to be added)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/songs', require('./routes/songs'));
// app.use('/api/albums', require('./routes/albums'));
// app.use('/api/playlists', require('./routes/playlists'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🎵 Spotify Clone API is running!' });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
