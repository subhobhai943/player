const express = require('express');
const router = express.Router();
const {
  createPlaylist,
  getMyPlaylists,
  getPlaylistById,
  addSongToPlaylist,
} = require('../controllers/playlistController');
const { protect } = require('../middleware/auth');

router.get('/me', protect, getMyPlaylists);
router.get('/:id', getPlaylistById);
router.post('/', protect, createPlaylist);
router.patch('/:id/add-song', protect, addSongToPlaylist);

module.exports = router;
