import React from 'react';
import { Play, Pause, SkipForward } from 'lucide-react';
import usePlayerStore from '../store/playerStore';

const MiniPlayer = () => {
  const { currentSong, isPlaying, pauseSong, resumeSong, nextSong } = usePlayerStore();

  if (!currentSong) return null;

  return (
    <div className="sm:hidden fixed z-40 left-2 right-2 glass border border-white/10 rounded-2xl px-3 py-2.5 animate-slide-up shadow-2xl"
      style={{ bottom: '60px' }}>
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

      {/* Progress bar */}
      <div className="mt-2 h-0.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-spotify-green rounded-full transition-all duration-1000"
          style={{ width: '30%' }}
        />
      </div>
    </div>
  );
};

export default MiniPlayer;
