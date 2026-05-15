import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import useAuthStore from '../store/authStore';

/**
 * Manages like state for a song.
 * Optimistically toggles, syncs with backend.
 */
const useLike = (songId, initialLiked = false) => {
  const { isAuthenticated } = useAuthStore();
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  const toggleLike = async () => {
    if (!isAuthenticated) return;
    const prev = liked;
    setLiked(!prev); // optimistic
    setLoading(true);
    try {
      const { data } = await api.patch(`/songs/${songId}/like`);
      setLiked(data.liked);
    } catch {
      setLiked(prev); // rollback
    } finally {
      setLoading(false);
    }
  };

  return { liked, toggleLike, loading };
};

export default useLike;
