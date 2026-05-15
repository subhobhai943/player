import React from 'react';
import { Play, Pause } from 'lucide-react';
import usePlayerStore from '../store/playerStore';
import useLike from '../hooks/useLike';
import useLikeStore from '../store/likeStore';

const SongCard = ({ song, queue = [] }) => {
  const { playSong, pauseSong, resumeSong, setQueue, currentSong, isPlaying } = usePlayerStore();
  const isActive = currentSong?._id === song._id;
  const { liked, toggleLike } = useLike(song._id, song);

  const handlePlay = () => {
    if (isActive && isPlaying) pauseSong();
    else if (isActive) resumeSong();
    else {
      setQueue(queue.length ? queue : [song]);
      playSong(song);
    }
  };

  return (
    <div
      className={`group relative bg-[#181818] hover:bg-[#242424] rounded-2xl p-3 cursor-pointer transition-all duration-300 card-3d ${
        isActive ? 'song-active' : ''
      }`}
      onClick={handlePlay}
    >
      <div className="relative mb-3 overflow-hidden rounded-xl">
        <img
          src={song.coverUrl || 'https://placehold.co/200x200/282828/ffffff?text=♪'}
          alt={song.title}
          className={`w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105 ${
            isActive ? 'brightness-90' : ''
          }`}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 rounded-xl" />
        <button
          className={`absolute bottom-2 right-2 w-10 h-10 rounded-full bg-spotify-green flex items-center justify-center shadow-xl shadow-spotify-green/40 transition-all duration-300 ${
            isActive && isPlaying
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-3 scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100'
          }`}
        >
          {isActive && isPlaying
            ? <Pause size={18} className="text-black" fill="black" />
            : <Play  size={18} className="text-black ml-0.5" fill="black" />}
        </button>
        {isActive && isPlaying && (
          <div className="absolute top-2 left-2 flex items-end gap-0.5 h-4">
            <span className="eq-bar h-full animate-bar-1" />
            <span className="eq-bar h-3   animate-bar-2" />
            <span className="eq-bar h-full animate-bar-3" />
          </div>
        )}
      </div>
      <p className={`font-semibold text-sm truncate transition-colors ${
        isActive ? 'text-spotify-green' : 'text-white'
      }`}>{song.title}</p>
      <p className="text-spotify-light text-xs truncate mt-0.5">{song.artist}</p>
    </div>
  );
};

export default SongCard;
