const axios = require('axios');

let cachedToken = null;
let tokenExpiry = 0;

const getSpotifyToken = async () => {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET is missing from environment variables');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`,
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
    const status = err.response?.status || 500;
    const detail = err.response?.data || err.message;
    console.error('Spotify search error:', JSON.stringify(detail));
    res.status(status).json({ message: 'Spotify search failed', error: detail });
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
    const detail = err.response?.data || err.message;
    res.status(500).json({ message: 'Failed to get track', error: detail });
  }
};

// GET /api/spotify/featured
const getFeaturedTracks = async (req, res) => {
  try {
    const token = await getSpotifyToken();
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
    const detail = err.response?.data || err.message;
    res.status(500).json({ message: 'Failed to get featured tracks', error: detail });
  }
};

module.exports = { searchSpotify, getSpotifyTrack, getFeaturedTracks };
