import React from 'react';
import { Play, Pause } from 'lucide-react';
import usePlayerStore from '../store/playerStore';

const SongRow = ({ song, index, queue = [] }) => {
  const { playSong, pauseSong, resumeSong, setQueue, currentSong, isPlaying } = usePlayerStore();
  const isActive = currentSong?._id === song._id;

  const formatTime = (s) => {
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
      className={`group grid grid-cols-[16px_4fr_2fr_1fr] gap-4 items-center px-4 py-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors ${
        isActive ? 'text-spotify-green' : 'text-spotify-light'
      }`}
    >
      <span className="text-sm">
        {isActive && isPlaying
          ? <Pause size={14} className="text-spotify-green" />
          : <span className="group-hover:hidden">{index + 1}</span>}
        <Play size={14} className="hidden group-hover:block" />
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
      <p className="text-sm truncate">{song.album?.title || '—'}</p>
      <p className="text-sm text-right">{formatTime(song.duration)}</p>
    </div>
  );
};

export default SongRow;
