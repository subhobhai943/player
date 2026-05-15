import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import SongRow from '../components/SongRow';
import api from '../api/axiosInstance';

const AlbumPage = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const { data } = await api.get(`/albums/${id}`);
        setAlbum(data);
      } catch {
        setAlbum(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  if (loading) {
    return <Layout><p className="text-spotify-light">Loading album...</p></Layout>;
  }

  if (!album) {
    return <Layout><p className="text-spotify-light">Album not found.</p></Layout>;
  }

  return (
    <Layout>
      <div className="bg-gradient-to-b from-emerald-600/60 to-spotify-black -mx-6 -mt-6 px-6 pt-10 pb-8 mb-8 flex items-end gap-6">
        <img
          src={album.coverUrl || 'https://placehold.co/240x240/282828/ffffff?text=Album'}
          alt={album.title}
          className="w-52 h-52 rounded-md object-cover shadow-2xl"
        />
        <div>
          <p className="text-xs uppercase text-white font-semibold mb-2">Album</p>
          <h1 className="text-5xl font-extrabold text-white mb-3">{album.title}</h1>
          <p className="text-sm text-white/90">{album.artist} • {album.year || 'Unknown year'} • {album.songs?.length || 0} songs</p>
        </div>
      </div>

      <div className="space-y-1">
        {album.songs?.map((song, i) => (
          <SongRow key={song._id} song={song} index={i} queue={album.songs} />
        ))}
      </div>
    </Layout>
  );
};

export default AlbumPage;
