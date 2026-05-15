const express = require('express');
const router = express.Router();
const {
  getAllSongs,
  getSongById,
  searchSongs,
  uploadSong,
  likeSong,
  getLikedSongs,
} = require('../controllers/songController');
const { protect } = require('../middleware/auth');
const { uploadSongAssets } = require('../middleware/upload');

router.get('/', getAllSongs);
router.get('/search', searchSongs);
router.get('/liked/me', protect, getLikedSongs);
router.get('/:id', getSongById);
router.post(
  '/upload',
  protect,
  uploadSongAssets.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  uploadSong
);
router.patch('/:id/like', protect, likeSong);

module.exports = router;
