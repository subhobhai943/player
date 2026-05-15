/**
 * Global like store using localStorage for iTunes songs.
 * For DB songs (MongoDB _id, not prefixed with 'itunes-'),
 * we still hit the backend but also mirror in localStorage.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useLikeStore = create(
  persist(
    (set, get) => ({
      // Map of songId -> full song object for liked iTunes songs
      likedItunesSongs: {},

      isLiked: (songId) => {
        if (!songId) return false;
        return !!get().likedItunesSongs[songId];
      },

      toggleItunes: (song) => {
        const { likedItunesSongs } = get();
        if (likedItunesSongs[song._id]) {
          const next = { ...likedItunesSongs };
          delete next[song._id];
          set({ likedItunesSongs: next });
          return false;
        } else {
          set({ likedItunesSongs: { ...likedItunesSongs, [song._id]: song } });
          return true;
        }
      },

      getLikedList: () => Object.values(get().likedItunesSongs),
    }),
    { name: 'player-likes' }
  )
);

export default useLikeStore;
