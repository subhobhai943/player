import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Heart, Upload } from 'lucide-react';
import useAuthStore from '../store/authStore';

const navItems = [
  { icon: Home,    label: 'Home',        to: '/' },
  { icon: Search,  label: 'Search',      to: '/search' },
  { icon: Library, label: 'Your Library',to: '/library' },
];

const Sidebar = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <aside className="w-60 bg-gradient-to-b from-[#0d0d0d] to-[#121212] flex flex-col h-full shrink-0 border-r border-white/5">
      {/* Logo */}
      <div className="px-6 py-7 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-spotify-green flex items-center justify-center shadow-lg shadow-spotify-green/30">
          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <rect x="4"  y="5"  width="3" height="14" rx="1.5"/>
            <rect x="10" y="2"  width="3" height="20" rx="1.5"/>
            <rect x="16" y="7"  width="3" height="10" rx="1.5"/>
          </svg>
        </div>
        <span className="text-white font-bold text-xl tracking-tight gradient-text">Player</span>
      </div>

      <nav className="px-3 space-y-1">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-spotify-light hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`transition-transform duration-200 ${isActive ? 'scale-110 text-spotify-green' : 'group-hover:scale-105'}`}>
                  <Icon size={20} />
                </span>
                {label}
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-spotify-green"/>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/5 my-4 mx-3" />

      <div className="px-3 space-y-1">
        {isAuthenticated && (
          <NavLink
            to="/liked"
            className={({ isActive }) =>
              `group flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive ? 'bg-white/10 text-white' : 'text-spotify-light hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-pink-400' : 'group-hover:text-pink-400 transition-colors'}>
                  <Heart size={20} fill={isActive ? 'currentColor' : 'none'} />
                </span>
                Liked Songs
              </>
            )}
          </NavLink>
        )}
        {isAuthenticated && (
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `group flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive ? 'bg-white/10 text-white' : 'text-spotify-light hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-blue-400' : 'group-hover:text-blue-400 transition-colors'}><Upload size={20} /></span>
                Upload Song
              </>
            )}
          </NavLink>
        )}
      </div>

      <div className="border-t border-white/5 my-4 mx-3" />
      <div className="px-6 flex-1 overflow-y-auto">
        <p className="text-[10px] text-spotify-light uppercase tracking-widest mb-3 font-bold">Playlists</p>
        <p className="text-sm text-[#535353]">No playlists yet.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
