const Playlist = require('../models/Playlist');

const createPlaylist = async (req, res) => {
  try {
    const { name, description, coverUrl, isPublic } = req.body;
    const playlist = await Playlist.create({
      name,
      description,
      coverUrl,
      isPublic,
      owner: req.user._id,
      songs: [],
    });
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id })
      .populate('songs')
      .sort({ createdAt: -1 });
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('songs')
      .populate('owner', 'name');
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addSongToPlaylist = async (req, res) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

    if (!playlist.songs.some((id) => id.toString() === songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }

    const populated = await Playlist.findById(playlist._id).populate('songs');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPlaylist,
  getMyPlaylists,
  getPlaylistById,
  addSongToPlaylist,
};
