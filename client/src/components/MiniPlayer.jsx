import React from 'react';
import { Play, Pause, SkipForward, X } from 'lucide-react';
import usePlayerStore from '../store/playerStore';

/**
 * Mobile bottom mini-player shown when a song is playing.
 * Sits above the mobile nav bar on small screens.
 */
const MiniPlayer = () => {
  const { currentSong, isPlaying, pauseSong, resumeSong, nextSong } = usePlayerStore();

  if (!currentSong) return null;

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#282828] border-t border-[#383838] px-3 py-2">
      <div className="flex items-center gap-3">
        <img
          src={currentSong.coverUrl || 'https://placehold.co/40x40/181818/ffffff?text=♪'}
          alt={currentSong.title}
          className="w-10 h-10 rounded object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">{currentSong.title}</p>
          <p className="text-spotify-light text-xs truncate">{currentSong.artist}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => (isPlaying ? pauseSong() : resumeSong())}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center"
          >
            {isPlaying
              ? <Pause size={16} className="text-black" />
              : <Play size={16} className="text-black ml-0.5" />}
          </button>
          <button onClick={nextSong} className="text-white">
            <SkipForward size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
