import { useEffect } from 'react';
import usePlayerStore from '../store/playerStore';

/**
 * Wires the browser Media Session API.
 * Enables OS-level media controls (lock screen, headphone buttons, etc.)
 */
const useMediaSession = () => {
  const { currentSong, isPlaying, nextSong, prevSong, pauseSong, resumeSong } = usePlayerStore();

  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentSong) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title,
      artist: currentSong.artist,
      album: currentSong.album?.title || '',
      artwork: currentSong.coverUrl
        ? [{ src: currentSong.coverUrl, sizes: '512x512', type: 'image/jpeg' }]
        : [],
    });

    navigator.mediaSession.setActionHandler('play', resumeSong);
    navigator.mediaSession.setActionHandler('pause', pauseSong);
    navigator.mediaSession.setActionHandler('nexttrack', nextSong);
    navigator.mediaSession.setActionHandler('previoustrack', prevSong);

    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [currentSong, isPlaying]);
};

export default useMediaSession;
