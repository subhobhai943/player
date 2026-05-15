import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, User, Search } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 glass sticky top-0 z-20 border-b border-white/5">
      {/* Nav arrows */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 hover:scale-110 active:scale-95 transition-all duration-150"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => navigate(1)}
          className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 hover:scale-110 active:scale-95 transition-all duration-150"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile search */}
        <button
          onClick={() => navigate('/search')}
          className="flex sm:hidden items-center gap-2 bg-white/10 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 active:scale-95 transition-all"
          aria-label="Search"
        >
          <Search size={15} />
          <span>Search</span>
        </button>

        {isAuthenticated ? (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 glass border border-white/10 rounded-full px-3 py-1.5 hover:border-spotify-green/50 hover:shadow-lg hover:shadow-spotify-green/10 active:scale-95 transition-all duration-200"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
              {user?.name?.[0]?.toUpperCase() || <User size={12} />}
            </div>
            <span className="text-sm text-white font-semibold">{user?.name || 'Profile'}</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate('/register')}
              className="text-sm font-semibold text-spotify-light hover:text-white transition-colors"
            >
              Sign up
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-bold bg-spotify-green text-black px-5 py-2 rounded-full hover:bg-[#1ed760] hover:scale-105 active:scale-95 shadow-lg shadow-spotify-green/20 transition-all"
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
