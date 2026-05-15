import { create } from 'zustand';

const usePlayerStore = create((set, get) => ({
  currentSong: null,
  queue: [],
  originalQueue: [], // backup for shuffle toggle
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  isShuffle: false,
  repeatMode: 'none', // 'none' | 'all' | 'one'

  playSong: (song) => set({ currentSong: song, isPlaying: true, progress: 0 }),
  pauseSong: () => set({ isPlaying: false }),
  resumeSong: () => set({ isPlaying: true }),
  setVolume: (vol) => set({ volume: Math.max(0, Math.min(1, vol)) }),
  setProgress: (prog) => set({ progress: prog }),

  setQueue: (songs) =>
    set({ queue: songs, originalQueue: songs }),

  toggleShuffle: () => {
    const { isShuffle, queue, originalQueue, currentSong } = get();
    if (!isShuffle) {
      // Shuffle: put current song first, shuffle the rest
      const rest = queue.filter((s) => s._id !== currentSong?._id);
      const shuffled = rest.sort(() => Math.random() - 0.5);
      set({ isShuffle: true, queue: currentSong ? [currentSong, ...shuffled] : shuffled });
    } else {
      // Restore original order
      set({ isShuffle: false, queue: originalQueue });
    }
  },

  cycleRepeat: () => {
    const { repeatMode } = get();
    const next = repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none';
    set({ repeatMode: next });
  },

  nextSong: () => {
    const { queue, currentSong, repeatMode, isShuffle } = get();
    if (!currentSong || queue.length === 0) return;

    if (repeatMode === 'one') {
      set({ progress: 0, isPlaying: true });
      return;
    }

    const idx = queue.findIndex((s) => s._id === currentSong._id);
    const isLast = idx === queue.length - 1;

    if (isLast && repeatMode === 'all') {
      set({ currentSong: queue[0], isPlaying: true, progress: 0 });
    } else if (!isLast) {
      set({ currentSong: queue[idx + 1], isPlaying: true, progress: 0 });
    } else {
      set({ isPlaying: false });
    }
  },

  prevSong: () => {
    const { queue, currentSong, progress } = get();
    if (!currentSong) return;

    // If >3s into song, restart instead of going back
    if (progress > 3) {
      set({ progress: 0 });
      return;
    }

    const idx = queue.findIndex((s) => s._id === currentSong._id);
    if (idx > 0) {
      set({ currentSong: queue[idx - 1], isPlaying: true, progress: 0 });
    }
  },
}));

export default usePlayerStore;
