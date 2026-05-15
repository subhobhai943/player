const Song = require('../models/Song');

// GET /api/songs
const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().populate('album', 'title').sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/songs/:id
const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('album');
    if (!song) return res.status(404).json({ message: 'Song not found' });
    // Increment play count
    song.plays += 1;
    await song.save();
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/songs/search?q=query
const searchSongs = async (req, res) => {
  try {
    const q = req.query.q || '';
    const songs = await Song.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { artist: { $regex: q, $options: 'i' } },
        { genre: { $regex: q, $options: 'i' } },
      ],
    }).populate('album', 'title').limit(20);
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllSongs, getSongById, searchSongs };
