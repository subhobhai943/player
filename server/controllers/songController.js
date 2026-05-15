const streamifier = require('streamifier');
const Song = require('../models/Song');
const Album = require('../models/Album');
const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

const uploadToCloudinary = (buffer, folder, resourceType, formatHint) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        format: formatHint,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find()
      .populate('album', 'title coverUrl artist')
      .sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('album');
    if (!song) return res.status(404).json({ message: 'Song not found' });
    song.plays += 1;
    await song.save();
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchSongs = async (req, res) => {
  try {
    const q = req.query.q || '';
    const songs = await Song.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { artist: { $regex: q, $options: 'i' } },
        { genre: { $regex: q, $options: 'i' } },
      ],
    })
      .populate('album', 'title coverUrl')
      .limit(20);

    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploadSong = async (req, res) => {
  try {
    const { title, artist, genre, duration, albumId, albumTitle } = req.body;
    if (!title || !artist || !duration) {
      return res.status(400).json({ message: 'Title, artist, and duration are required' });
    }

    const audioFile = req.files?.audio?.[0];
    const coverFile = req.files?.cover?.[0];

    if (!audioFile) {
      return res.status(400).json({ message: 'Audio file is required' });
    }

    const audioUpload = await uploadToCloudinary(
      audioFile.buffer,
      'player/audio',
      'video',
      'mp3'
    );

    let coverUrl = '';
    if (coverFile) {
      const coverUpload = await uploadToCloudinary(
        coverFile.buffer,
        'player/covers',
        'image'
      );
      coverUrl = coverUpload.secure_url;
    }

    let resolvedAlbumId = albumId || null;
    if (!resolvedAlbumId && albumTitle) {
      let album = await Album.findOne({ title: albumTitle, artist });
      if (!album) {
        album = await Album.create({ title: albumTitle, artist, coverUrl, songs: [] });
      }
      resolvedAlbumId = album._id;
    }

    const song = await Song.create({
      title,
      artist,
      album: resolvedAlbumId,
      audioUrl: audioUpload.secure_url,
      coverUrl,
      duration: Number(duration),
      genre: genre || 'Unknown',
      uploadedBy: req.user._id,
    });

    if (resolvedAlbumId) {
      await Album.findByIdAndUpdate(resolvedAlbumId, { $push: { songs: song._id } });
    }

    const populatedSong = await Song.findById(song._id).populate('album', 'title coverUrl artist');
    res.status(201).json(populatedSong);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const likeSong = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const songId = req.params.id;
    const alreadyLiked = user.likedSongs.some((id) => id.toString() === songId);

    if (alreadyLiked) {
      user.likedSongs = user.likedSongs.filter((id) => id.toString() !== songId);
    } else {
      user.likedSongs.push(songId);
    }

    await user.save();
    res.json({ liked: !alreadyLiked, likedSongs: user.likedSongs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getLikedSongs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'likedSongs',
      populate: { path: 'album', select: 'title coverUrl artist' },
    });
    res.json(user.likedSongs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllSongs,
  getSongById,
  searchSongs,
  uploadSong,
  likeSong,
  getLikedSongs,
};
