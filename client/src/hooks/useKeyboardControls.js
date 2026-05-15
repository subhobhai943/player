import { useEffect } from 'react';
import usePlayerStore from '../store/playerStore';

/**
 * Global keyboard shortcuts for the music player.
 * Space = play/pause, ArrowRight = next, ArrowLeft = prev,
 * ArrowUp = volume up, ArrowDown = volume down, M = mute
 */
const useKeyboardControls = () => {
  const { isPlaying, pauseSong, resumeSong, nextSong, prevSong, volume, setVolume } = usePlayerStore();

  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      // Don't hijack shortcuts when typing in inputs
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          isPlaying ? pauseSong() : resumeSong();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextSong();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevSong();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case 'KeyM':
          setVolume(volume > 0 ? 0 : 0.8);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isPlaying, volume]);
};

export default useKeyboardControls;
