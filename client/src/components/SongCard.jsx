import React from 'react';
import { Play } from 'lucide-react';
import usePlayerStore from '../store/playerStore';

const SongCard = ({ song, queue = [] }) => {
  const { playSong, setQueue, currentSong, isPlaying, pauseSong } = usePlayerStore();
  const isActive = currentSong?._id === song._id;

  const handlePlay = () => {
    if (isActive && isPlaying) {
      pauseSong();
    } else {
      setQueue(queue.length ? queue : [song]);
      playSong(song);
    }
  };

  return (
    <div
      className={`group relative bg-spotify-card hover:bg-[#383838] rounded-lg p-4 cursor-pointer transition-colors ${
        isActive ? 'ring-1 ring-spotify-green' : ''
      }`}
      onClick={handlePlay}
    >
      {/* Cover */}
      <div className="relative mb-4">
        <img
          src={song.coverUrl || 'https://placehold.co/200x200/282828/ffffff?text=♪'}
          alt={song.title}
          className="w-full aspect-square object-cover rounded-md shadow-lg"
        />
        <button
          className={`absolute bottom-2 right-2 w-10 h-10 rounded-full bg-spotify-green flex items-center justify-center shadow-lg transition-all ${
            isActive && isPlaying
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
          }`}
        >
          <Play size={18} className="text-black ml-0.5" fill="black" />
        </button>
      </div>

      {/* Info */}
      <p className="text-white font-semibold text-sm truncate">{song.title}</p>
      <p className="text-spotify-light text-xs truncate mt-1">{song.artist}</p>
    </div>
  );
};

export default SongCard;
