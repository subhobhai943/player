const axios = require('axios');

const ITUNES_BASE = 'https://itunes.apple.com';

const formatTrack = (track) => ({
  itunesId: track.trackId,
  title: track.trackName || '',
  artist: track.artistName || '',
  album: track.collectionName || '',
  coverUrl: (track.artworkUrl100 || '').replace('100x100', '500x500'),
  audioUrl: track.previewUrl || null,
  duration: track.trackTimeMillis ? Math.floor(track.trackTimeMillis / 1000) : 0,
  year: track.releaseDate ? track.releaseDate.substring(0, 4) : '',
  genre: track.primaryGenreName || '',
  itunesUrl: track.trackViewUrl || '',
});

// GET /api/jiosaavn/search?q=kesariya&limit=20
const searchJioSaavn = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    if (!q) return res.status(400).json({ message: 'Query parameter q is required' });

    const response = await axios.get(`${ITUNES_BASE}/search`, {
      params: { term: q, media: 'music', limit, country: 'IN' },
    });

    const songs = (response.data?.results || []).map(formatTrack);
    res.json({ songs });
  } catch (err) {
    console.error('iTunes search error:', err.message);
    res.status(500).json({ message: 'iTunes search failed', error: err.message });
  }
};

// GET /api/jiosaavn/song/:id
const getJioSaavnSong = async (req, res) => {
  try {
    const response = await axios.get(`${ITUNES_BASE}/lookup`, {
      params: { id: req.params.id, media: 'music' },
    });

    const track = response.data?.results?.[0];
    if (!track) return res.status(404).json({ message: 'Song not found' });

    res.json(formatTrack(track));
  } catch (err) {
    console.error('iTunes lookup error:', err.message);
    res.status(500).json({ message: 'Failed to get song', error: err.message });
  }
};

// GET /api/jiosaavn/featured?lang=hindi&limit=20
const getFeaturedTracks = async (req, res) => {
  try {
    const { lang = 'hindi', limit = 20 } = req.query;
    const response = await axios.get(`${ITUNES_BASE}/search`, {
      params: { term: `top ${lang} songs`, media: 'music', limit, country: 'IN' },
    });

    const songs = (response.data?.results || []).map(formatTrack);
    res.json({ songs });
  } catch (err) {
    console.error('iTunes featured error:', err.message);
    res.status(500).json({ message: 'Failed to get featured tracks', error: err.message });
  }
};

// GET /api/jiosaavn/album/:id
const getJioSaavnAlbum = async (req, res) => {
  try {
    const response = await axios.get(`${ITUNES_BASE}/lookup`, {
      params: { id: req.params.id, entity: 'song' },
    });

    const results = response.data?.results || [];
    const album = results.find((r) => r.wrapperType === 'collection');
    const songs = results.filter((r) => r.wrapperType === 'track').map(formatTrack);

    if (!album) return res.status(404).json({ message: 'Album not found' });

    res.json({
      id: album.collectionId,
      title: album.collectionName,
      artist: album.artistName,
      coverUrl: (album.artworkUrl100 || '').replace('100x100', '500x500'),
      year: album.releaseDate ? album.releaseDate.substring(0, 4) : '',
      genre: album.primaryGenreName || '',
      songs,
    });
  } catch (err) {
    console.error('iTunes album error:', err.message);
    res.status(500).json({ message: 'Failed to get album', error: err.message });
  }
};

module.exports = { searchJioSaavn, getJioSaavnSong, getFeaturedTracks, getJioSaavnAlbum };
