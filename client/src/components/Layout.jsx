import React from 'react';
import Sidebar from './Sidebar';
import PlayerBar from './PlayerBar';
import Navbar from './Navbar';
import MiniPlayer from './MiniPlayer';

const Layout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-spotify-black overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: hidden on mobile */}
        <div className="hidden sm:block">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-spotify-black pb-24 sm:pb-6 page-enter">
            {children}
          </main>
        </div>
      </div>
      {/* Desktop player bar */}
      <div className="hidden sm:block">
        <PlayerBar />
      </div>
      {/* Mobile mini player */}
      <MiniPlayer />
    </div>
  );
};

export default Layout;
