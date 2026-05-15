const express = require('express');
const router = express.Router();
const { searchSpotify, getSpotifyTrack, getFeaturedTracks } = require('../controllers/spotifyController');

router.get('/search', searchSpotify);
router.get('/featured', getFeaturedTracks);
router.get('/track/:id', getSpotifyTrack);

module.exports = router;
