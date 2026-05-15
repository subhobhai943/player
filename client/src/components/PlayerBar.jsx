import React, { useRef, useEffect, useState } from 'react';
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Shuffle, Repeat
} from 'lucide-react';
import { Heart } from 'lucide-react';
import usePlayerStore from '../store/playerStore';
import useLike from '../hooks/useLike';

const PlayerBar = () => {
  const {
    currentSong, isPlaying, volume, progress,
    pauseSong, resumeSong, setVolume,
    setProgress, nextSong, prevSong,
  } = usePlayerStore();

  const audioRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const { liked, toggleLike } = useLike(currentSong?._id);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) setProgress(audioRef.current.currentTime);
  };

  const handleSeek = (e) => {
    const val = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setProgress(val);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <footer className="h-20 bg-spotify-dark border-t border-[#282828] flex items-center px-4 shrink-0">
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={(e) => setDuration(e.target.duration)}
          onEnded={nextSong}
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
              className={`ml-2 shrink-0 transition-colors ${
                liked ? 'text-spotify-green' : 'text-spotify-light hover:text-white'
              }`}
            >
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            </button>
          </>
        ) : (
          <p className="text-spotify-light text-sm">No song playing</p>
        )}
      </div>

      {/* Center: Controls + Seek */}
      <div className="flex flex-col items-center gap-1 flex-1">
        <div className="flex items-center gap-5">
          <button className="text-spotify-light hover:text-white transition"><Shuffle size={18} /></button>
          <button onClick={prevSong} className="text-white hover:scale-110 transition"><SkipBack size={22} /></button>
          <button
            onClick={() => (isPlaying ? pauseSong() : resumeSong())}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-105 transition"
          >
            {isPlaying
              ? <Pause size={18} className="text-black" />
              : <Play size={18} className="text-black ml-0.5" />}
          </button>
          <button onClick={nextSong} className="text-white hover:scale-110 transition"><SkipForward size={22} /></button>
          <button className="text-spotify-light hover:text-white transition"><Repeat size={18} /></button>
        </div>
        <div className="flex items-center gap-2 w-full max-w-md">
          <span className="text-xs text-spotify-light w-8 text-right">{formatTime(progress)}</span>
          <input
            type="range" min={0} max={duration || 0} step={0.5}
            value={progress}
            onChange={handleSeek}
            className="flex-1 h-1 accent-spotify-green cursor-pointer"
          />
          <span className="text-xs text-spotify-light w-8">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="flex items-center gap-2 w-[30%] justify-end">
        <button
          onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
          className="text-spotify-light hover:text-white transition"
        >
          {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input
          type="range" min={0} max={1} step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24 h-1 accent-spotify-green cursor-pointer"
        />
      </div>
    </footer>
  );
};

export default PlayerBar;
