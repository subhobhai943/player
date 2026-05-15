import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Heart, Shuffle, Repeat, Repeat1
} from 'lucide-react';
import usePlayerStore from '../store/playerStore';
import useLike from '../hooks/useLike';
import useKeyboardControls from '../hooks/useKeyboardControls';
import useMediaSession from '../hooks/useMediaSession';

const PlayerBar = () => {
  const {
    currentSong, isPlaying, volume, progress,
    pauseSong, resumeSong, setVolume, setProgress,
    nextSong, prevSong, isShuffle, repeatMode,
    toggleShuffle, cycleRepeat,
  } = usePlayerStore();

  const audioRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const { liked, toggleLike } = useLike(currentSong?._id);

  // Global keyboard shortcuts
  useKeyboardControls();
  // OS media session (lock screen / headphone controls)
  useMediaSession();

  // Sync play/pause state with audio element
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [isPlaying, currentSong]);

  // Seek-to-0 when song changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setDuration(0);
    }
  }, [currentSong?._id]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) setProgress(audioRef.current.currentTime);
  }, []);

  const handleSeek = (e) => {
    const val = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setProgress(val);
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;

  return (
    <footer className="h-20 bg-[#181818] border-t border-[#282828] flex items-center px-4 shrink-0 z-50">
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={(e) => setDuration(e.target.duration)}
          onEnded={nextSong}
          preload="metadata"
        />
      )}

      {/* Left: Song info */}
      <div className="flex items-center gap-3 w-[30%] min-w-0">
        {currentSong ? (
          <>
            <img
              src={currentSong.coverUrl || 'https://placehold.co/56x56/282828/ffffff?text=♪'}
              alt={currentSong.title}
              className="w-14 h-14 rounded object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{currentSong.title}</p>
              <p className="text-spotify-light text-xs truncate">{currentSong.artist}</p>
            </div>
            <button
              onClick={toggleLike}
              title="Like song"
              className={`ml-2 shrink-0 transition-colors ${
                liked ? 'text-spotify-green' : 'text-spotify-light hover:text-white'
              }`}
            >
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            </button>
          </>
        ) : (
          <p className="text-[#535353] text-sm hidden sm:block">Nothing playing</p>
        )}
      </div>

      {/* Center: Controls + Seek */}
      <div className="flex flex-col items-center gap-1 flex-1 px-4">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            title="Shuffle (S)"
            className={`transition-colors hidden sm:block ${
              isShuffle ? 'text-spotify-green' : 'text-spotify-light hover:text-white'
            }`}
          >
            <Shuffle size={18} />
          </button>

          {/* Prev */}
          <button
            onClick={prevSong}
            title="Previous (←)"
            className="text-white hover:scale-110 transition"
          >
            <SkipBack size={22} />
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => (isPlaying ? pauseSong() : resumeSong())}
            title="Play/Pause (Space)"
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-105 transition shrink-0"
          >
            {isPlaying
              ? <Pause size={18} className="text-black" />
              : <Play size={18} className="text-black ml-0.5" />}
          </button>

          {/* Next */}
          <button
            onClick={nextSong}
            title="Next (→)"
            className="text-white hover:scale-110 transition"
          >
            <SkipForward size={22} />
          </button>

          {/* Repeat */}
          <button
            onClick={cycleRepeat}
            title={`Repeat: ${repeatMode}`}
            className={`transition-colors hidden sm:block ${
              repeatMode !== 'none' ? 'text-spotify-green' : 'text-spotify-light hover:text-white'
            }`}
          >
            <RepeatIcon size={18} />
          </button>
        </div>

        {/* Seek bar */}
        <div className="flex items-center gap-2 w-full max-w-md">
          <span className="text-xs text-spotify-light w-8 text-right tabular-nums">{formatTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.5}
            value={progress}
            onChange={handleSeek}
            className="flex-1 h-1 accent-spotify-green cursor-pointer"
          />
          <span className="text-xs text-spotify-light w-8 tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="hidden sm:flex items-center gap-2 w-[30%] justify-end">
        <button
          onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
          title="Mute (M)"
          className="text-spotify-light hover:text-white transition"
        >
          {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24 h-1 accent-spotify-green cursor-pointer"
        />
      </div>
    </footer>
  );
};

export default PlayerBar;
