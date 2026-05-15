import React, { useEffect, useState } from 'react';
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

  const [duration, setDuration] = useState(0);
  const { liked, toggleLike } = useLike(currentSong?._id);

  useKeyboardControls();
  useMediaSession();

  // Poll duration from global audio ref
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.__audioDuration) setDuration(window.__audioDuration);
    }, 500);
    return () => clearInterval(interval);
  }, [currentSong?._id]);

  const handleSeek = (e) => {
    const val = Number(e.target.value);
    if (window.__audioRef?.current) window.__audioRef.current.currentTime = val;
    setProgress(val);
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;

  // Always render (contains no audio), but hide UI on mobile
  return (
    <footer className="hidden sm:flex h-20 bg-[#181818] border-t border-[#282828] items-center px-4 shrink-0 z-50">
      {/* Left: Song info */}
      <div className="flex items-center gap-3 w-[30%] min-w-0">
        {currentSong ? (
          <>
            <img
              src={currentSong.coverUrl || 'https://placehold.co/56x56/282828/ffffff?text=♪'}
              alt={currentSong.title}
              className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-md"
            />
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{currentSong.title}</p>
              <p className="text-spotify-light text-xs truncate">{currentSong.artist}</p>
            </div>
            <button
              onClick={toggleLike}
              className={`ml-2 shrink-0 transition-colors hover:scale-125 active:scale-90 ${
                liked ? 'text-pink-400' : 'text-spotify-light hover:text-white'
              }`}
            >
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            </button>
          </>
        ) : (
          <p className="text-[#535353] text-sm">Nothing playing</p>
        )}
      </div>

      {/* Center: Controls + Seek */}
      <div className="flex flex-col items-center gap-1 flex-1 px-4">
        <div className="flex items-center gap-5">
          <button onClick={toggleShuffle} className={`transition-colors ${
            isShuffle ? 'text-spotify-green' : 'text-spotify-light hover:text-white'
          }`}><Shuffle size={18} /></button>

          <button onClick={prevSong} className="text-white hover:scale-110 transition">
            <SkipBack size={22} />
          </button>

          <button
            onClick={() => (isPlaying ? pauseSong() : resumeSong())}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg shrink-0"
          >
            {isPlaying
              ? <Pause size={18} className="text-black" />
              : <Play size={18} className="text-black ml-0.5" />}
          </button>

          <button onClick={nextSong} className="text-white hover:scale-110 transition">
            <SkipForward size={22} />
          </button>

          <button onClick={cycleRepeat} className={`transition-colors ${
            repeatMode !== 'none' ? 'text-spotify-green' : 'text-spotify-light hover:text-white'
          }`}><RepeatIcon size={18} /></button>
        </div>

        <div className="flex items-center gap-2 w-full max-w-lg">
          <span className="text-xs text-spotify-light w-8 text-right tabular-nums">{formatTime(progress)}</span>
          <input
            type="range" min={0} max={duration || 0} step={0.5} value={progress}
            onChange={handleSeek}
            className="flex-1 h-1 accent-spotify-green cursor-pointer"
          />
          <span className="text-xs text-spotify-light w-8 tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="flex items-center gap-2 w-[30%] justify-end">
        <button onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
          className="text-spotify-light hover:text-white transition">
          {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input
          type="range" min={0} max={1} step={0.01} value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24 h-1 accent-spotify-green cursor-pointer"
        />
      </div>
    </footer>
  );
};

export default PlayerBar;
