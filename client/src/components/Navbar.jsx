import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
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
        {isAuthenticated ? (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 glass border border-white/10 rounded-full px-2 py-1 hover:border-spotify-green/50 hover:shadow-lg hover:shadow-spotify-green/10 active:scale-95 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-md">
              {user?.name?.[0]?.toUpperCase() || <User size={14} />}
            </div>
            <span className="text-sm text-white font-semibold pr-1 hidden sm:block">{user?.name || 'Profile'}</span>
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
