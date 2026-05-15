import React from 'react';
import { Play, Pause, SkipForward } from 'lucide-react';
import usePlayerStore from '../store/playerStore';

const MiniPlayer = () => {
  const { currentSong, isPlaying, pauseSong, resumeSong, nextSong } = usePlayerStore();

  if (!currentSong) return null;

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/10 px-3 py-2.5 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <img
            src={currentSong.coverUrl || 'https://placehold.co/40x40/181818/ffffff?text=♪'}
            alt={currentSong.title}
            className={`w-11 h-11 rounded-xl object-cover shadow-md transition-all ${
              isPlaying ? 'ring-2 ring-spotify-green/60' : ''
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

        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">{currentSong.title}</p>
          <p className="text-spotify-light text-xs truncate">{currentSong.artist}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => (isPlaying ? pauseSong() : resumeSong())}
            className="w-9 h-9 rounded-full bg-spotify-green flex items-center justify-center shadow-lg shadow-spotify-green/30 hover:bg-[#1ed760] active:scale-90 transition-all"
          >
            {isPlaying
              ? <Pause size={16} className="text-black" />
              : <Play  size={16} className="text-black ml-0.5" />}
          </button>
          <button onClick={nextSong} className="text-spotify-light hover:text-white active:scale-90 transition-all">
            <SkipForward size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
