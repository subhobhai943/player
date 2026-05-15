import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, User, Search } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-transparent">
      {/* Navigation arrows */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="p-1 rounded-full bg-black/40 text-white hover:bg-black/70 transition"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => navigate(1)}
          className="p-1 rounded-full bg-black/40 text-white hover:bg-black/70 transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Search (mobile) + Auth buttons */}
      <div className="flex items-center gap-3">
        {/* Mobile search button – hidden on >= sm because sidebar already has Search */}
        <button
          onClick={() => navigate('/search')}
          className="flex sm:hidden items-center gap-2 bg-white/10 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 transition"
          aria-label="Search"
        >
          <Search size={16} />
          <span>Search</span>
        </button>

        {isAuthenticated ? (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 bg-black rounded-full px-3 py-1.5 hover:bg-[#282828] transition"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">
              {user?.name?.[0]?.toUpperCase() || <User size={12} />}
            </div>
            <span className="text-sm text-white font-semibold">{user?.name || 'Profile'}</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate('/register')}
              className="text-sm font-semibold text-spotify-light hover:text-white transition"
            >
              Sign up
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-bold bg-white text-black px-5 py-2 rounded-full hover:scale-105 transition-transform"
            >
              Log in
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
