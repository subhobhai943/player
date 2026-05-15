import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axiosInstance';

const UploadSong = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [duration, setDuration] = useState('');
  const [albumTitle, setAlbumTitle] = useState('');
  const [audio, setAudio] = useState(null);
  const [cover, setCover] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('artist', artist);
      formData.append('genre', genre);
      formData.append('duration', duration);
      formData.append('albumTitle', albumTitle);
      if (audio) formData.append('audio', audio);
      if (cover) formData.append('cover', cover);

      await api.post('/songs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('Song uploaded successfully!');
      setTitle('');
      setArtist('');
      setGenre('');
      setDuration('');
      setAlbumTitle('');
      setAudio(null);
      setCover(null);
      e.target.reset();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-white mb-6">Upload Song</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl bg-spotify-dark rounded-xl p-6 space-y-4">
        {message && <p className="text-sm text-white bg-white/10 rounded-md px-4 py-3">{message}</p>}

        <div className="grid md:grid-cols-2 gap-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Song title"
            className="px-4 py-3 rounded-md bg-spotify-card text-white placeholder-spotify-light focus:outline-none focus:ring-2 focus:ring-spotify-green" />
          <input value={artist} onChange={(e) => setArtist(e.target.value)} required placeholder="Artist name"
            className="px-4 py-3 rounded-md bg-spotify-card text-white placeholder-spotify-light focus:outline-none focus:ring-2 focus:ring-spotify-green" />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre"
            className="px-4 py-3 rounded-md bg-spotify-card text-white placeholder-spotify-light focus:outline-none focus:ring-2 focus:ring-spotify-green" />
          <input value={duration} onChange={(e) => setDuration(e.target.value)} required type="number" min="1" placeholder="Duration (seconds)"
            className="px-4 py-3 rounded-md bg-spotify-card text-white placeholder-spotify-light focus:outline-none focus:ring-2 focus:ring-spotify-green" />
          <input value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} placeholder="Album title (optional)"
            className="px-4 py-3 rounded-md bg-spotify-card text-white placeholder-spotify-light focus:outline-none focus:ring-2 focus:ring-spotify-green" />
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-white text-sm">
          <label className="bg-spotify-card rounded-md px-4 py-3 cursor-pointer">
            <span className="block mb-2 text-spotify-light">Audio file</span>
            <input type="file" accept="audio/*" required onChange={(e) => setAudio(e.target.files[0])} className="block w-full" />
          </label>
          <label className="bg-spotify-card rounded-md px-4 py-3 cursor-pointer">
            <span className="block mb-2 text-spotify-light">Cover image</span>
            <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files[0])} className="block w-full" />
          </label>
        </div>

        <button type="submit" disabled={loading}
          className="px-6 py-3 rounded-full bg-spotify-green text-black font-bold hover:scale-105 transition-transform disabled:opacity-60">
          {loading ? 'Uploading...' : 'Upload Song'}
        </button>
      </form>
    </Layout>
  );
};

export default UploadSong;
