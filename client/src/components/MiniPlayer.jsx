import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Heart } from 'lucide-react';
import usePlayerStore from '../store/playerStore';
import useLike from '../hooks/useLike';

const MiniPlayer = () => {
  const {
    currentSong, isPlaying, pauseSong, resumeSong,
    nextSong, prevSong, progress, setProgress,
  } = usePlayerStore();
  const { liked, toggleLike } = useLike(currentSong?._id);
  const [duration, setDuration] = useState(0);

  // Poll duration from global audio ref
  useEffect(() => {
    const id = setInterval(() => {
      if (window.__audioRef?.current?.duration)
        setDuration(window.__audioRef.current.duration);
    }, 500);
    return () => clearInterval(id);
  }, [currentSong?._id]);

  const handleSeek = (e) => {
    const val = Number(e.target.value);
    if (window.__audioRef?.current) window.__audioRef.current.currentTime = val;
    setProgress(val);
  };

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  if (!currentSong) return null;

  return (
    <div
      className="sm:hidden fixed z-40 left-2 right-2 glass border border-white/10 rounded-2xl shadow-2xl animate-slide-up"
      style={{ bottom: '60px' }}
    >
      {/* Seek bar at top of card */}
      <div className="px-3 pt-2">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.5}
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 accent-spotify-green cursor-pointer"
          style={{
            background: `linear-gradient(to right, #1DB954 ${pct}%, #535353 ${pct}%)`,
          }}
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Cover */}
        <div className="relative shrink-0">
          <img
            src={currentSong.coverUrl || 'https://placehold.co/44x44/181818/ffffff?text=♪'}
            alt={currentSong.title}
            className={`w-11 h-11 rounded-xl object-cover shadow-md transition-all ${
              isPlaying ? 'ring-2 ring-spotify-green/70' : ''
            }`}
          />
          {isPlaying && (
            <div className="absolute -bottom-0.5 -right-0.5 flex items-end gap-0.5 bg-[#121212] rounded p-0.5">
              <span className="eq-bar animate-bar-1" style={{height:'8px'}} />
              <span className="eq-bar animate-bar-2" style={{height:'6px'}} />
              <span className="eq-bar animate-bar-3" style={{height:'8px'}} />
            </div>
          )}
        </div>

        {/* Title + artist */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">{currentSong.title}</p>
          <p className="text-spotify-light text-xs truncate">{currentSong.artist}</p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); toggleLike(); }}
            className={`p-1.5 transition-all active:scale-90 ${
              liked ? 'text-pink-400' : 'text-spotify-light'
            }`}
          >
            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
          </button>

          <button onClick={prevSong} className="p-1.5 text-white active:scale-90 transition">
            <SkipBack size={18} />
          </button>

          <button
            onClick={() => (isPlaying ? pauseSong() : resumeSong())}
            className="w-9 h-9 rounded-full bg-spotify-green flex items-center justify-center shadow-lg shadow-spotify-green/30 hover:bg-[#1ed760] active:scale-90 transition-all"
          >
            {isPlaying
              ? <Pause size={16} className="text-black" />
              : <Play  size={16} className="text-black ml-0.5" />}
          </button>

          <button onClick={nextSong} className="p-1.5 text-white active:scale-90 transition">
            <SkipForward size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
