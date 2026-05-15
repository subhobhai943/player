import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import SongRow from '../components/SongRow';
import api from '../api/axiosInstance';

const LikedSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const { data } = await api.get('/songs/liked/me');
        setSongs(data);
      } catch {
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLiked();
  }, []);

  return (
    <Layout>
      <div className="bg-gradient-to-b from-purple-700/70 to-spotify-black -mx-6 -mt-6 px-6 pt-10 pb-8 mb-8">
        <p className="text-xs uppercase text-white font-semibold mb-2">Playlist</p>
        <h1 className="text-5xl font-extrabold text-white mb-3">Liked Songs</h1>
        <p className="text-spotify-light text-sm">Songs you saved to your library.</p>
      </div>

      {loading ? (
        <p className="text-spotify-light">Loading liked songs...</p>
      ) : songs.length === 0 ? (
        <p className="text-spotify-light">You haven't liked any songs yet.</p>
      ) : (
        <div className="space-y-1">
          {songs.map((song, i) => (
            <SongRow key={song._id} song={song} index={i} queue={songs} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default LikedSongs;
