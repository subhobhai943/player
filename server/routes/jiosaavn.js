const express = require('express');
const router = express.Router();
const {
  searchJioSaavn,
  getJioSaavnSong,
  getFeaturedTracks,
  getJioSaavnAlbum,
} = require('../controllers/jiosaavnController');

// GET /api/jiosaavn/search?q=arijit+singh&limit=20
router.get('/search', searchJioSaavn);

// GET /api/jiosaavn/featured?lang=hindi&limit=20
router.get('/featured', getFeaturedTracks);

// GET /api/jiosaavn/song/:id
router.get('/song/:id', getJioSaavnSong);

// GET /api/jiosaavn/album/:id
router.get('/album/:id', getJioSaavnAlbum);

module.exports = router;
