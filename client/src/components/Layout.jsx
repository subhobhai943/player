import React from 'react';
import Sidebar from './Sidebar';
import PlayerBar from './PlayerBar';
import Navbar from './Navbar';
import MiniPlayer from './MiniPlayer';
import MobileBottomNav from './MobileBottomNav';
import AudioEngine from './AudioEngine';
import usePlayerStore from '../store/playerStore';

const Layout = ({ children }) => {
  const { currentSong } = usePlayerStore();

  return (
    <div className="h-screen flex flex-col bg-spotify-black overflow-hidden">
      {/* Global audio engine - always mounted */}
      <AudioEngine />

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden sm:block">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main
            className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-spotify-black page-enter"
            style={{ paddingBottom: currentSong ? '7rem' : '4rem' }}
          >
            {children}
          </main>
        </div>
      </div>

      {/* Desktop player bar - always visible on sm+ */}
      <PlayerBar />

      {/* Mobile: mini-player + bottom nav */}
      <MiniPlayer />
      <MobileBottomNav />
    </div>
  );
};

export default Layout;
