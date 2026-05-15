const mongoose = require('mongoose');
require('dotenv').config();
const Song = require('../models/Song');
const Album = require('../models/Album');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Song.deleteMany();
    await Album.deleteMany();

    const album1 = await Album.create({
      title: 'Midnight Drive',
      artist: 'Neon Waves',
      year: 2025,
      genre: 'Synthwave',
      coverUrl: 'https://placehold.co/400x400/1f2937/ffffff?text=Midnight+Drive',
      songs: [],
    });

    const album2 = await Album.create({
      title: 'Lo-Fi Coding',
      artist: 'Code Beats',
      year: 2026,
      genre: 'Lo-Fi',
      coverUrl: 'https://placehold.co/400x400/111827/ffffff?text=Lo-Fi+Coding',
      songs: [],
    });

    const songs = await Song.insertMany([
      {
        title: 'Night Runner',
        artist: 'Neon Waves',
        album: album1._id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverUrl: album1.coverUrl,
        duration: 234,
        genre: 'Synthwave',
      },
      {
        title: 'Electric Sky',
        artist: 'Neon Waves',
        album: album1._id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        coverUrl: album1.coverUrl,
        duration: 211,
        genre: 'Synthwave',
      },
      {
        title: 'Bug Free Dreams',
        artist: 'Code Beats',
        album: album2._id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        coverUrl: album2.coverUrl,
        duration: 189,
        genre: 'Lo-Fi',
      },
      {
        title: 'Console Coffee',
        artist: 'Code Beats',
        album: album2._id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        coverUrl: album2.coverUrl,
        duration: 197,
        genre: 'Lo-Fi',
      },
    ]);

    album1.songs = songs.filter((s) => s.artist === 'Neon Waves').map((s) => s._id);
    album2.songs = songs.filter((s) => s.artist === 'Code Beats').map((s) => s._id);

    await album1.save();
    await album2.save();

    console.log('✅ Seed data inserted successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
