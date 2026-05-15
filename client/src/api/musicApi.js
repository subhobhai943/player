import api from './axiosInstance';

// Map iTunes/JioSaavn track -> internal Song shape the player expects
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
  const { data } = await api.get('/jiosaavn/featured', {
    params: { lang, limit },
  });
  return (data.songs || []).map(normalizeItunesSong);
};

export const searchItunesSongs = async (q, limit = 20) => {
  const { data } = await api.get('/jiosaavn/search', {
    params: { q, limit },
  });
  return (data.songs || []).map(normalizeItunesSong);
};
