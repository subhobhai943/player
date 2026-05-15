import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import SongRow from '../components/SongRow';
import api from '../api/axiosInstance';
import useLikeStore from '../store/likeStore';
import { Heart } from 'lucide-react';

const LikedSongs = () => {
  const [dbSongs, setDbSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getLikedList } = useLikeStore();

  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const { data } = await api.get('/songs/liked/me');
        setDbSongs(Array.isArray(data) ? data : []);
      } catch {
        setDbSongs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLiked();
  }, []);

  // Merge iTunes (localStorage) + DB songs, deduplicate by _id
  const itunesSongs = getLikedList();
  const dbIds = new Set(dbSongs.map((s) => s._id));
  const merged = [
    ...itunesSongs.filter((s) => !dbIds.has(s._id)),
    ...dbSongs,
  ];

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
            <p className="text-spotify-light text-sm mt-2">
              {loading ? 'Loading...' : `${merged.length} song${merged.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
                <div className="shimmer w-10 h-10 rounded-lg shrink-0" />
                <div className="flex-1">
                  <div className="shimmer h-3.5 rounded w-2/5 mb-2" />
                  <div className="shimmer h-3 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : merged.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={48} className="text-spotify-light mx-auto mb-4" />
            <p className="text-white font-semibold text-lg">Songs you like will appear here</p>
            <p className="text-spotify-light text-sm mt-2">Tap the ♥ on any song to save it</p>
          </div>
        ) : (
          <div className="space-y-1">
            {merged.map((song, i) => (
              <div key={song._id} className="animate-fade-in" style={{ animationDelay: `${i * 25}ms` }}>
                <SongRow song={song} index={i} queue={merged} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LikedSongs;
