import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, PlusSquare, Heart } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: Search, label: 'Search', to: '/search' },
  { icon: Library, label: 'Your Library', to: '/library' },
];

const Sidebar = () => {
  return (
    <aside className="w-60 bg-black flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="px-6 py-6">
        <span className="text-white font-bold text-2xl tracking-tight">
          🎵 Player
        </span>
      </div>

      {/* Main nav */}
      <nav className="px-3 space-y-1">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                isActive
                  ? 'text-white'
                  : 'text-spotify-light hover:text-white'
              }`
            }
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[#282828] my-4 mx-3" />

      {/* Library actions */}
      <div className="px-3 space-y-1">
        <button className="flex items-center gap-4 px-3 py-2 rounded-md text-sm font-semibold text-spotify-light hover:text-white w-full transition-colors">
          <PlusSquare size={22} />
          Create Playlist
        </button>
        <NavLink
          to="/liked"
          className={({ isActive }) =>
            `flex items-center gap-4 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
              isActive ? 'text-white' : 'text-spotify-light hover:text-white'
            }`
          }
        >
          <Heart size={22} />
          Liked Songs
        </NavLink>
      </div>

      {/* Playlist list placeholder */}
      <div className="border-t border-[#282828] my-4 mx-3" />
      <div className="px-6 flex-1 overflow-y-auto">
        <p className="text-xs text-spotify-light uppercase tracking-widest mb-3">Playlists</p>
        <p className="text-sm text-[#535353]">No playlists yet.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
