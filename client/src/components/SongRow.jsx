import React from 'react';
import { Play, Heart } from 'lucide-react';
import usePlayerStore from '../store/playerStore';
import useLike from '../hooks/useLike';

const SongRow = ({ song, index, queue = [] }) => {
  const { playSong, pauseSong, resumeSong, setQueue, currentSong, isPlaying } = usePlayerStore();
  const isActive = currentSong?._id === song._id;
  const { liked, toggleLike } = useLike(song._id, song);

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  const handleClick = () => {
    if (isActive && isPlaying) pauseSong();
    else if (isActive) resumeSong();
    else { setQueue(queue); playSong(song); }
  };

  return (
    <div
      onClick={handleClick}
      className={`group grid grid-cols-[20px_4fr_2fr_auto_1fr] gap-4 items-center px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
        isActive ? 'bg-white/10 text-spotify-green' : 'text-spotify-light hover:bg-white/5 hover:text-white'
      }`}
    >
      <span className="text-sm flex items-center justify-center">
        {isActive && isPlaying ? (
          <div className="flex items-end gap-0.5 h-3.5">
            <span className="eq-bar h-full animate-bar-1" style={{height:'14px'}} />
            <span className="eq-bar animate-bar-2" style={{height:'10px'}} />
            <span className="eq-bar h-full animate-bar-3" style={{height:'14px'}} />
          </div>
        ) : (
          <>
            <span className="group-hover:hidden block">{index + 1}</span>
            <Play size={13} className="hidden group-hover:block" />
          </>
        )}
      </span>

      <div className="flex items-center gap-3 min-w-0">
        <img
          src={song.coverUrl || 'https://placehold.co/40x40/282828/ffffff?text=♪'}
          alt={song.title}
          className={`w-10 h-10 rounded-lg object-cover transition-transform duration-200 ${
            isActive ? 'ring-2 ring-spotify-green' : 'group-hover:scale-105'
          }`}
        />
        <div className="min-w-0">
          <p className={`text-sm font-semibold truncate ${
            isActive ? 'text-spotify-green' : 'text-white'
          }`}>{song.title}</p>
          <p className="text-xs truncate text-spotify-light">{song.artist}</p>
        </div>
      </div>

      <p className="text-sm truncate hidden sm:block text-spotify-light">{song.album?.title || '—'}</p>

      <button
        onClick={(e) => { e.stopPropagation(); toggleLike(); }}
        className={`transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-125 active:scale-90 ${
          liked ? 'text-pink-400 !opacity-100' : 'text-spotify-light'
        }`}
      >
        <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
      </button>

      <p className="text-sm text-right tabular-nums text-spotify-light">{formatTime(song.duration)}</p>
    </div>
  );
};

export default SongRow;
