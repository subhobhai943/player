import api from './axiosInstance';

export const normalizeItunesSong = (s) => ({
  _id: `itunes-${s.itunesId}`,
  title: s.title,
  artist: s.artist,
  album: { title: s.album },
  coverUrl: s.coverUrl,
  audioUrl: s.audioUrl,
  duration: s.duration,
  genre: s.genre,
  year: s.year,
  externalUrl: s.itunesUrl,
});

export const fetchFeaturedSongs = async (lang = 'hindi', limit = 20) => {
  const { data } = await api.get('/jiosaavn/featured', { params: { lang, limit } });
  return (data.songs || []).map(normalizeItunesSong);
};

export const searchItunesSongs = async (q, limit = 20) => {
  const { data } = await api.get('/jiosaavn/search', { params: { q, limit } });
  return (data.songs || []).map(normalizeItunesSong);
};

// Fetch songs by genre/category query term
export const fetchByGenre = async (term, limit = 20) => {
  const { data } = await api.get('/jiosaavn/search', { params: { q: term, limit } });
  return (data.songs || []).map(normalizeItunesSong);
};
