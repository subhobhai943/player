const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
    audioUrl: { type: String, required: true },
    coverUrl: { type: String, default: '' },
    duration: { type: Number, required: true }, // in seconds
    genre: { type: String, default: 'Unknown' },
    plays: { type: Number, default: 0 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Song', songSchema);
