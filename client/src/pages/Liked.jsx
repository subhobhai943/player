import React from 'react';
import Layout from '../components/Layout';
import SongRow from '../components/SongRow';
import useLikeStore from '../store/likeStore';
import useAuthStore from '../store/authStore';
import { Heart } from 'lucide-react';

const Liked = () => {
  const { isAuthenticated } = useAuthStore();
  const { getLikedList } = useLikeStore();
  const songs = getLikedList();

  return (
    <Layout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-end gap-6 mb-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-transparent">
          <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-900/50 shrink-0">
            <Heart size={48} className="text-white" fill="white" />
          </div>
          <div>
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Playlist</p>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Liked Songs</h1>
            <p className="text-spotify-light text-sm mt-2">{songs.length} song{songs.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="text-center py-16">
            <Heart size={48} className="text-spotify-light mx-auto mb-4" />
            <p className="text-white font-semibold text-lg">Log in to see your liked songs</p>
          </div>
        ) : songs.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={48} className="text-spotify-light mx-auto mb-4" />
            <p className="text-white font-semibold text-lg">Songs you like will appear here</p>
            <p className="text-spotify-light text-sm mt-2">Tap the heart on any song to save it</p>
          </div>
        ) : (
          <div className="space-y-1">
            {songs.map((song, i) => (
              <div key={song._id} className="animate-fade-in" style={{ animationDelay: `${i * 25}ms` }}>
                <SongRow song={song} index={i} queue={songs} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Liked;
