const express = require('express');
const router = express.Router();
const { getAllSongs, getSongById, searchSongs } = require('../controllers/songController');
const { protect } = require('../middleware/auth');

router.get('/', getAllSongs);
router.get('/search', searchSongs);
router.get('/:id', getSongById);

module.exports = router;
