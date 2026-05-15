const axios = require('axios');

const JIOSAAVN_BASE = 'https://saavn.dev/api';

// GET /api/jiosaavn/search?q=query&limit=20
const searchJioSaavn = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    if (!q) return res.status(400).json({ message: 'Query parameter q is required' });

    const response = await axios.get(`${JIOSAAVN_BASE}/search/songs`, {
      params: { query: q, page: 1, limit },
    });

    const songs = (response.data?.data?.results || []).map((song) => ({
      jiosaavnId: song.id,
      title: song.name,
      artist: song.artists?.primary?.map((a) => a.name).join(', ') || 'Unknown',
      album: song.album?.name || '',
      coverUrl: song.image?.find((i) => i.quality === '500x500')?.url
        || song.image?.[song.image.length - 1]?.url
        || null,
      audioUrl: song.downloadUrl?.find((d) => d.quality === '320kbps')?.url
        || song.downloadUrl?.[song.downloadUrl.length - 1]?.url
        || null,
      duration: song.duration || 0,
      year: song.year || '',
      language: song.language || '',
    }));

    res.json({ songs });
  } catch (err) {
    console.error('JioSaavn search error:', err.message);
    res.status(500).json({ message: 'JioSaavn search failed', error: err.message });
  }
};

// GET /api/jiosaavn/song/:id
const getJioSaavnSong = async (req, res) => {
  try {
    const response = await axios.get(`${JIOSAAVN_BASE}/songs/${req.params.id}`);
    const song = response.data?.data?.[0];
    if (!song) return res.status(404).json({ message: 'Song not found' });

    res.json({
      jiosaavnId: song.id,
      title: song.name,
      artist: song.artists?.primary?.map((a) => a.name).join(', ') || 'Unknown',
      album: song.album?.name || '',
      coverUrl: song.image?.find((i) => i.quality === '500x500')?.url
        || song.image?.[song.image.length - 1]?.url
        || null,
      audioUrl: song.downloadUrl?.find((d) => d.quality === '320kbps')?.url
        || song.downloadUrl?.[song.downloadUrl.length - 1]?.url
        || null,
      duration: song.duration || 0,
      year: song.year || '',
      language: song.language || '',
    });
  } catch (err) {
    console.error('JioSaavn get song error:', err.message);
    res.status(500).json({ message: 'Failed to get song', error: err.message });
  }
};

// GET /api/jiosaavn/featured?lang=hindi
const getFeaturedTracks = async (req, res) => {
  try {
    const { lang = 'hindi', limit = 20 } = req.query;
    const response = await axios.get(`${JIOSAAVN_BASE}/search/songs`, {
      params: { query: `top ${lang} songs 2025`, page: 1, limit },
    });

    const songs = (response.data?.data?.results || []).map((song) => ({
      jiosaavnId: song.id,
      title: song.name,
      artist: song.artists?.primary?.map((a) => a.name).join(', ') || 'Unknown',
      album: song.album?.name || '',
      coverUrl: song.image?.find((i) => i.quality === '500x500')?.url
        || song.image?.[song.image.length - 1]?.url
        || null,
      audioUrl: song.downloadUrl?.find((d) => d.quality === '320kbps')?.url
        || song.downloadUrl?.[song.downloadUrl.length - 1]?.url
        || null,
      duration: song.duration || 0,
      year: song.year || '',
      language: song.language || '',
    }));

    res.json({ songs });
  } catch (err) {
    console.error('JioSaavn featured error:', err.message);
    res.status(500).json({ message: 'Failed to get featured tracks', error: err.message });
  }
};

// GET /api/jiosaavn/album/:id
const getJioSaavnAlbum = async (req, res) => {
  try {
    const response = await axios.get(`${JIOSAAVN_BASE}/albums`, {
      params: { id: req.params.id },
    });
    const album = response.data?.data;
    if (!album) return res.status(404).json({ message: 'Album not found' });

    res.json({
      id: album.id,
      title: album.name,
      artist: album.artists?.primary?.map((a) => a.name).join(', ') || 'Unknown',
      coverUrl: album.image?.find((i) => i.quality === '500x500')?.url || null,
      year: album.year || '',
      songs: (album.songs || []).map((song) => ({
        jiosaavnId: song.id,
        title: song.name,
        artist: song.artists?.primary?.map((a) => a.name).join(', ') || 'Unknown',
        audioUrl: song.downloadUrl?.find((d) => d.quality === '320kbps')?.url
          || song.downloadUrl?.[song.downloadUrl.length - 1]?.url
          || null,
        duration: song.duration || 0,
      })),
    });
  } catch (err) {
    console.error('JioSaavn album error:', err.message);
    res.status(500).json({ message: 'Failed to get album', error: err.message });
  }
};

module.exports = { searchJioSaavn, getJioSaavnSong, getFeaturedTracks, getJioSaavnAlbum };
