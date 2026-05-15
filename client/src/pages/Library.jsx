import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import usePlaylistStore from '../store/playlistStore';
import useLikeStore from '../store/likeStore';
import { Music, Plus, Heart, Trash2, X, ListMusic } from 'lucide-react';

const CreateModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="glass border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">Create playlist</h2>
          <button onClick={onClose} className="text-spotify-light hover:text-white transition">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            type="text"
            placeholder="My Playlist #1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-500 focus:border-spotify-green/60 focus:bg-white/15 transition-all text-sm mb-4"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 rounded-full bg-spotify-green text-black font-bold text-sm hover:bg-[#1ed760] disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

const Library = () => {
  const navigate = useNavigate();
  const { playlists, createPlaylist, deletePlaylist } = usePlaylistStore();
  const { getLikedList } = useLikeStore();
  const [showModal, setShowModal] = useState(false);
  const likedCount = getLikedList().length;

  return (
    <Layout>
      {showModal && (
        <CreateModal
          onClose={() => setShowModal(false)}
          onCreate={createPlaylist}
        />
      )}

      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Your Library</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-spotify-green text-black font-bold text-sm hover:bg-[#1ed760] active:scale-95 shadow-lg shadow-spotify-green/20 transition-all"
          >
            <Plus size={16} />
            New playlist
          </button>
        </div>

        {/* Liked Songs pinned card */}
        <div
          onClick={() => navigate('/liked')}
          className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-900/60 to-purple-900/40 border border-white/5 mb-4 cursor-pointer hover:bg-white/5 active:scale-[0.99] transition-all group"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg">
            <Heart size={24} className="text-white" fill="white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold truncate">Liked Songs</p>
            <p className="text-spotify-light text-xs mt-0.5">Playlist · {likedCount} song{likedCount !== 1 ? 's' : ''}</p>
          </div>
          <span className="text-spotify-light text-xs group-hover:text-white transition-colors">▶</span>
        </div>

        {/* User playlists */}
        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <ListMusic size={36} className="text-spotify-light" />
            </div>
            <h2 className="text-white text-lg font-bold mb-1">No playlists yet</h2>
            <p className="text-spotify-light text-sm mb-6">Create a playlist to organise your music</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 rounded-full bg-white text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all"
            >
              Create playlist
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 active:scale-[0.99] transition-all group cursor-pointer"
                onClick={() => navigate(`/playlists/${pl.id}`)}
              >
                <div className="w-14 h-14 rounded-xl bg-[#282828] flex items-center justify-center shrink-0">
                  {pl.songs[0]?.coverUrl
                    ? <img src={pl.songs[0].coverUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                    : <Music size={24} className="text-spotify-light" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{pl.name}</p>
                  <p className="text-spotify-light text-xs mt-0.5">Playlist · {pl.songs.length} song{pl.songs.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deletePlaylist(pl.id); }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-spotify-light hover:text-red-400 transition-all active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Library;
