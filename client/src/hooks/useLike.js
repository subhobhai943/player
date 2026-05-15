import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import useAuthStore from '../store/authStore';
import useLikeStore from '../store/likeStore';

/**
 * Works for both iTunes songs (itunes-xxx) and DB songs.
 * iTunes songs: stored in localStorage via likeStore.
 * DB songs: synced with backend.
 */
const useLike = (songId, song = null) => {
  const { isAuthenticated } = useAuthStore();
  const { isLiked, toggleItunes } = useLikeStore();

  const isItunes = songId?.startsWith('itunes-');

  // For DB songs, track liked state locally and check backend on mount
  const [dbLiked, setDbLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch initial DB like status
  useEffect(() => {
    if (!isItunes && isAuthenticated && songId) {
      api.get(`/songs/${songId}/liked`)
        .then(({ data }) => setDbLiked(!!data.liked))
        .catch(() => {});
    }
  }, [songId, isAuthenticated, isItunes]);

  const liked = isItunes ? isLiked(songId) : dbLiked;

  const toggleLike = async () => {
    if (!isAuthenticated) return;
    if (isItunes) {
      // Use the song object passed in, or build minimal one from store
      const songObj = song || { _id: songId };
      toggleItunes(songObj);
      return;
    }
    // DB song - call backend
    const prev = dbLiked;
    setDbLiked(!prev);
    setLoading(true);
    try {
      const { data } = await api.patch(`/songs/${songId}/like`);
      setDbLiked(data.liked);
    } catch {
      setDbLiked(prev);
    } finally {
      setLoading(false);
    }
  };

  return { liked, toggleLike, loading };
};

export default useLike;
