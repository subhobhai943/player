import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Local playlist store (no backend needed).
 * Playlists are saved in localStorage.
 */
const usePlaylistStore = create(
  persist(
    (set, get) => ({
      playlists: [], // [{ id, name, createdAt, songs: [] }]

      createPlaylist: (name) => {
        const playlist = {
          id: `pl-${Date.now()}`,
          name: name.trim(),
          createdAt: new Date().toISOString(),
          songs: [],
        };
        set({ playlists: [...get().playlists, playlist] });
        return playlist;
      },

      deletePlaylist: (id) =>
        set({ playlists: get().playlists.filter((p) => p.id !== id) }),

      addSongToPlaylist: (playlistId, song) => {
        set({
          playlists: get().playlists.map((p) =>
            p.id === playlistId && !p.songs.find((s) => s._id === song._id)
              ? { ...p, songs: [...p.songs, song] }
              : p
          ),
        });
      },

      removeSongFromPlaylist: (playlistId, songId) => {
        set({
          playlists: get().playlists.map((p) =>
            p.id === playlistId
              ? { ...p, songs: p.songs.filter((s) => s._id !== songId) }
              : p
          ),
        });
      },
    }),
    { name: 'player-playlists' }
  )
);

export default usePlaylistStore;
