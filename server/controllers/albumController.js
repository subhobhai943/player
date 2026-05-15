const Album = require('../models/Album');

const createAlbum = async (req, res) => {
  try {
    const { title, artist, coverUrl, year, genre } = req.body;
    const album = await Album.create({ title, artist, coverUrl, year, genre, songs: [] });
    res.status(201).json(album);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find().populate('songs').sort({ createdAt: -1 });
    res.json(albums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate('songs');
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.json(album);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createAlbum, getAlbums, getAlbumById };
