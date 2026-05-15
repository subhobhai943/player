import React from 'react';
import { Play, Pause } from 'lucide-react';
import usePlayerStore from '../store/playerStore';
import useLike from '../hooks/useLike';
import { Heart } from 'lucide-react';

const SongRow = ({ song, index, queue = [] }) => {
  const { playSong, pauseSong, resumeSong, setQueue, currentSong, isPlaying } = usePlayerStore();
  const isActive = currentSong?._id === song._id;
  const { liked, toggleLike } = useLike(song._id);

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleClick = () => {
    if (isActive && isPlaying) pauseSong();
    else if (isActive) resumeSong();
    else {
      setQueue(queue);
      playSong(song);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group grid grid-cols-[16px_4fr_2fr_auto_1fr] gap-4 items-center px-4 py-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors ${
        isActive ? 'text-spotify-green' : 'text-spotify-light'
      }`}
    >
      <span className="text-sm flex items-center justify-center">
        {isActive && isPlaying
          ? <Pause size={14} className="text-spotify-green" />
          : <>
              <span className="group-hover:hidden block">{index + 1}</span>
              <Play size={14} className="hidden group-hover:block" />
            </>}
      </span>

      <div className="flex items-center gap-3 min-w-0">
        <img
          src={song.coverUrl || 'https://placehold.co/40x40/282828/ffffff?text=♪'}
          alt={song.title}
          className="w-10 h-10 rounded object-cover"
        />
        <div className="min-w-0">
          <p className={`text-sm font-medium truncate ${isActive ? 'text-spotify-green' : 'text-white'}`}>
            {song.title}
          </p>
          <p className="text-xs truncate">{song.artist}</p>
        </div>
      </div>

      <p className="text-sm truncate hidden sm:block">{song.album?.title || '—'}</p>

      <button
        onClick={(e) => { e.stopPropagation(); toggleLike(); }}
        className={`transition-colors opacity-0 group-hover:opacity-100 ${
          liked ? 'text-spotify-green opacity-100' : 'text-spotify-light hover:text-white'
        }`}
      >
        <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
      </button>

      <p className="text-sm text-right tabular-nums">{formatTime(song.duration)}</p>
    </div>
  );
};

export default SongRow;
