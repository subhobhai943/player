import { useRef, useEffect, useCallback } from 'react';
import usePlayerStore from '../store/playerStore';

/**
 * Invisible singleton component that owns the <audio> element.
 * Must be mounted ONCE at the app root so audio works on all screen sizes.
 */
const AudioEngine = () => {
  const audioRef = useRef(null);
  const {
    currentSong, isPlaying, volume, setProgress, nextSong,
  } = usePlayerStore();

  // Play / pause
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [isPlaying, currentSong]);

  // New song -> reset
  useEffect(() => {
    if (audioRef.current) audioRef.current.currentTime = 0;
  }, [currentSong?._id]);

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) setProgress(audioRef.current.currentTime);
  }, [setProgress]);

  // Expose audioRef so player bars can read duration & seek
  useEffect(() => {
    window.__audioRef = audioRef;
  }, []);

  if (!currentSong) return null;

  return (
    <audio
      ref={audioRef}
      src={currentSong.audioUrl}
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={(e) => {
        usePlayerStore.getState().setDuration?.(e.target.duration);
        window.__audioDuration = e.target.duration;
      }}
      onEnded={nextSong}
      preload="metadata"
    />
  );
};

export default AudioEngine;
