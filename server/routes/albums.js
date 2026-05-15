const express = require('express');
const router = express.Router();
const {
  createAlbum,
  getAlbums,
  getAlbumById,
} = require('../controllers/albumController');
const { protect } = require('../middleware/auth');

router.get('/', getAlbums);
router.get('/:id', getAlbumById);
router.post('/', protect, createAlbum);

module.exports = router;
