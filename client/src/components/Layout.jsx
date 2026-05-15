import React from 'react';
import Sidebar from './Sidebar';
import PlayerBar from './PlayerBar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-spotify-black overflow-hidden">
      {/* Main area: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-[#1f1f1f] to-spotify-black">
            {children}
          </main>
        </div>
      </div>
      {/* Player bar pinned at bottom */}
      <PlayerBar />
    </div>
  );
};

export default Layout;
