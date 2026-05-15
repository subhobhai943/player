const axios = require('axios');

let cachedToken = null;
let tokenExpiry = 0;

// Get Spotify access token using Client Credentials flow
const getSpotifyToken = async () => {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      auth: {
        username: process.env.SPOTIFY_CLIENT_ID,
        password: process.env.SPOTIFY_CLIENT_SECRET,
      },
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
  return cachedToken;
};

// GET /api/spotify/search?q=query
const searchSpotify = async (req, res) => {
  try {
    const { q, type = 'track', limit = 20 } = req.query;
    if (!q) return res.status(400).json({ message: 'Query parameter q is required' });

    const token = await getSpotifyToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { q, type, limit, market: 'IN' },
    });

    const tracks = response.data.tracks.items.map((track) => ({
      spotifyId: track.id,
      title: track.name,
      artist: track.artists.map((a) => a.name).join(', '),
      album: track.album.name,
      coverUrl: track.album.images[0]?.url || null,
      previewUrl: track.preview_url,
      duration: Math.floor(track.duration_ms / 1000),
      spotifyUrl: track.external_urls.spotify,
    }));

    res.json({ tracks });
  } catch (err) {
    console.error('Spotify search error:', err.message);
    res.status(500).json({ message: 'Spotify search failed', error: err.message });
  }
};

// GET /api/spotify/track/:id
const getSpotifyTrack = async (req, res) => {
  try {
    const token = await getSpotifyToken();
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${req.params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { market: 'IN' },
    });

    const track = response.data;
    res.json({
      spotifyId: track.id,
      title: track.name,
      artist: track.artists.map((a) => a.name).join(', '),
      album: track.album.name,
      coverUrl: track.album.images[0]?.url || null,
      previewUrl: track.preview_url,
      duration: Math.floor(track.duration_ms / 1000),
      spotifyUrl: track.external_urls.spotify,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get track', error: err.message });
  }
};

// GET /api/spotify/featured
const getFeaturedTracks = async (req, res) => {
  try {
    const token = await getSpotifyToken();
    // Get trending tracks using a popular search
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: 'year:2024-2025', type: 'track', limit: 20, market: 'IN' },
    });

    const tracks = response.data.tracks.items.map((track) => ({
      spotifyId: track.id,
      title: track.name,
      artist: track.artists.map((a) => a.name).join(', '),
      album: track.album.name,
      coverUrl: track.album.images[0]?.url || null,
      previewUrl: track.preview_url,
      duration: Math.floor(track.duration_ms / 1000),
      spotifyUrl: track.external_urls.spotify,
    }));

    res.json({ tracks });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get featured tracks', error: err.message });
  }
};

module.exports = { searchSpotify, getSpotifyTrack, getFeaturedTracks };
