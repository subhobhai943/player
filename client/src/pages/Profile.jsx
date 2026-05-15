import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import useAuthStore from '../store/authStore';
import useLikeStore from '../store/likeStore';
import usePlaylistStore from '../store/playlistStore';
import { LogOut, Upload, Heart, ListMusic, Github, Globe } from 'lucide-react';

// JSON syntax highlight helper
const J = ({ k, v, type = 'string', last = false }) => (
  <div className="flex flex-wrap gap-x-1 leading-relaxed">
    <span className="text-[#9cdcfe]">"{ k }"</span>
    <span className="text-white">:</span>
    {type === 'string' && <span className="text-[#ce9178]">"{ v }"</span>}
    {type === 'number' && <span className="text-[#b5cea8]">{ v }</span>}
    {type === 'bool'   && <span className="text-[#569cd6]">{ v }</span>}
    {!last && <span className="text-white">,</span>}
  </div>
);

const Profile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { getLikedList } = useLikeStore();
  const { playlists } = usePlaylistStore();

  const likedCount = getLikedList().length;
  const playlistCount = playlists.length;

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <Layout>
      <div className="animate-fade-in min-h-[80vh] flex flex-col items-center justify-center px-4 py-10">

        {/* Avatar + name */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-extrabold text-white shadow-2xl shadow-purple-900/50 mb-4 ring-4 ring-white/10">
            {initials}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user?.name || 'User'}</h1>
          <p className="text-spotify-light text-sm mt-1">Music Listener &amp; Explorer</p>
        </div>

        {/* Business Card JSON */}
        <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10 mb-8">
          {/* Title bar */}
          <div className="bg-[#3c3c3c] px-4 py-2.5 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="flex-1 text-center text-xs text-[#cccccc] font-medium">profile.json</span>
          </div>

          {/* Code body */}
          <div className="bg-[#1e1e1e] px-5 py-5 font-mono text-sm">
            <p className="text-white mb-1">{'{'}</p>
            <div className="pl-4 space-y-0.5">
              <J k="name"     v={user?.name || 'User'} />
              <J k="email"    v={user?.email || 'hidden'} />
              <J k="role"     v="Music Listener" />
              <J k="liked"    v={likedCount}   type="number" />
              <J k="playlists" v={playlistCount} type="number" />
              <J k="premium"  v="false" type="bool" last />
            </div>
            <p className="text-white mt-1">{'}'}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
          <button
            onClick={() => navigate('/liked')}
            className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border border-white/5 hover:border-spotify-green/30 active:scale-95 transition-all"
          >
            <Heart size={22} className="text-pink-400" fill="currentColor" />
            <p className="text-white font-bold text-xl">{likedCount}</p>
            <p className="text-spotify-light text-xs">Liked Songs</p>
          </button>
          <button
            onClick={() => navigate('/library')}
            className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-gradient-to-br from-teal-900/60 to-cyan-900/40 border border-white/5 hover:border-spotify-green/30 active:scale-95 transition-all"
          >
            <ListMusic size={22} className="text-teal-400" />
            <p className="text-white font-bold text-xl">{playlistCount}</p>
            <p className="text-spotify-light text-xs">Playlists</p>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <button
            onClick={() => navigate('/upload')}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-spotify-green text-black font-bold text-sm hover:bg-[#1ed760] active:scale-95 shadow-lg shadow-spotify-green/20 transition-all"
          >
            <Upload size={16} /> Upload a Song
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-white/10 border border-white/10 text-white font-bold text-sm hover:bg-white/15 active:scale-95 transition-all"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>

      </div>
    </Layout>
  );
};

export default Profile;
