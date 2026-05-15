import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import SongRow from '../components/SongRow';
import api from '../api/axiosInstance';

const PlaylistPage = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const { data } = await api.get(`/playlists/${id}`);
        setPlaylist(data);
      } catch {
        setPlaylist(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  if (loading) {
    return <Layout><p className="text-spotify-light">Loading playlist...</p></Layout>;
  }

  if (!playlist) {
    return <Layout><p className="text-spotify-light">Playlist not found.</p></Layout>;
  }

  return (
    <Layout>
      <div className="bg-gradient-to-b from-cyan-700/60 to-spotify-black -mx-6 -mt-6 px-6 pt-10 pb-8 mb-8 flex items-end gap-6">
        <img
          src={playlist.coverUrl || 'https://placehold.co/240x240/282828/ffffff?text=Playlist'}
          alt={playlist.name}
          className="w-52 h-52 rounded-md object-cover shadow-2xl"
        />
        <div>
          <p className="text-xs uppercase text-white font-semibold mb-2">Playlist</p>
          <h1 className="text-5xl font-extrabold text-white mb-3">{playlist.name}</h1>
          <p className="text-sm text-white/90">By {playlist.owner?.name || 'Unknown'} • {playlist.songs?.length || 0} songs</p>
        </div>
      </div>

      <div className="space-y-1">
        {playlist.songs?.map((song, i) => (
          <SongRow key={song._id} song={song} index={i} queue={playlist.songs} />
        ))}
      </div>
    </Layout>
  );
};

export default PlaylistPage;
