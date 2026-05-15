import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../api/axiosInstance';
import useAuthStore from '../store/authStore';
import { LogOut, Music, ListMusic } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [likedCount, setLikedCount] = useState(0);
  const [playlistCount, setPlaylistCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [likedRes, playlistsRes] = await Promise.all([
          api.get('/songs/liked/me'),
          api.get('/playlists/me'),
        ]);
        setLikedCount(likedRes.data.length);
        setPlaylistCount(playlistsRes.data.length);
      } catch {}
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <Layout>
      {/* Profile header */}
      <div className="bg-gradient-to-b from-indigo-600/60 to-spotify-black -mx-6 -mt-6 px-6 pt-10 pb-8 mb-8 flex items-end gap-6">
        <div className="w-36 h-36 rounded-full bg-indigo-500 flex items-center justify-center text-5xl font-extrabold text-white shadow-2xl shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-xs uppercase text-white font-semibold mb-2">Profile</p>
          <h1 className="text-5xl font-extrabold text-white mb-2">{user?.name || 'User'}</h1>
          <p className="text-spotify-light text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10 max-w-lg">
        <div className="bg-spotify-card rounded-lg p-5">
          <Music size={24} className="text-spotify-green mb-2" />
          <p className="text-2xl font-bold text-white">{likedCount}</p>
          <p className="text-spotify-light text-xs">Liked Songs</p>
        </div>
        <div className="bg-spotify-card rounded-lg p-5">
          <ListMusic size={24} className="text-spotify-green mb-2" />
          <p className="text-2xl font-bold text-white">{playlistCount}</p>
          <p className="text-spotify-light text-xs">Playlists</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/liked')}
          className="px-6 py-2 rounded-full bg-spotify-green text-black font-bold text-sm hover:scale-105 transition-transform"
        >
          Liked Songs
        </button>
        <button
          onClick={() => navigate('/upload')}
          className="px-6 py-2 rounded-full bg-white text-black font-bold text-sm hover:scale-105 transition-transform"
        >
          Upload Song
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-2 rounded-full bg-spotify-card text-white font-bold text-sm hover:bg-[#383838] transition"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </Layout>
  );
};

export default Profile;
