import { create } from 'zustand';

const usePlayerStore = create((set) => ({
  currentSong: null,
  queue: [],
  isPlaying: false,
  volume: 0.8,
  progress: 0,

  playSong: (song) => set({ currentSong: song, isPlaying: true }),
  pauseSong: () => set({ isPlaying: false }),
  resumeSong: () => set({ isPlaying: true }),
  setVolume: (vol) => set({ volume: vol }),
  setProgress: (prog) => set({ progress: prog }),
  setQueue: (songs) => set({ queue: songs }),
  nextSong: () =>
    set((state) => {
      const idx = state.queue.findIndex((s) => s._id === state.currentSong?._id);
      const next = state.queue[idx + 1];
      return next ? { currentSong: next, isPlaying: true } : {};
    }),
  prevSong: () =>
    set((state) => {
      const idx = state.queue.findIndex((s) => s._id === state.currentSong?._id);
      const prev = state.queue[idx - 1];
      return prev ? { currentSong: prev, isPlaying: true } : {};
    }),
}));

export default usePlayerStore;
