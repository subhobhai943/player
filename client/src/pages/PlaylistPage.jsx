import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SongRow from '../components/SongRow';
import usePlaylistStore from '../store/playlistStore';
import { searchItunesSongs, fetchFeaturedSongs } from '../api/musicApi';
import { Music, Plus, Search, X, Trash2, ArrowLeft } from 'lucide-react';

// ─── Add Songs Modal ────────────────────────────────────────────────────────
const AddSongsModal = ({ playlistId, existingIds, onClose }) => {
  const { addSongToPlaylist } = usePlaylistStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(new Set(existingIds));

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const tracks = await searchItunesSongs(val, 20);
      setResults(tracks);
    } catch { setResults([]); }
    finally { setLoading(false); }
  };

  const handleAdd = (song) => {
    addSongToPlaylist(playlistId, song);
    setAdded((prev) => new Set([...prev, song._id]));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="glass border border-white/10 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] flex flex-col shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <h2 className="text-white font-bold text-lg">Add songs</h2>
          <button onClick={onClose} className="text-spotify-light hover:text-white transition p-1">
            <X size={20} />
          </button>
        </div>

        {/* Search input */}
        <div className="relative px-5 pb-3 shrink-0">
          <Search size={16} className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            autoFocus
            type="text"
            placeholder="Search songs..."
            value={query}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-500 focus:border-spotify-green/50 transition-all text-sm"
          />
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1 px-3 pb-4">
          {loading && (
            <div className="space-y-2 pt-2">
              {Array.from({length: 5}).map((_,i) => (
                <div key={i} className="flex items-center gap-3 px-2 py-2 animate-pulse">
                  <div className="shimmer w-10 h-10 rounded-lg shrink-0" />
                  <div className="flex-1"><div className="shimmer h-3.5 rounded w-2/5 mb-1.5" /><div className="shimmer h-3 rounded w-1/4" /></div>
                </div>
              ))}
            </div>
          )}
          {!loading && results.map((song) => (
            <div key={song._id} className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition group">
              <img src={song.coverUrl || 'https://placehold.co/40x40/282828/fff?text=♪'}
                alt={song.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{song.title}</p>
                <p className="text-spotify-light text-xs truncate">{song.artist}</p>
              </div>
              <button
                onClick={() => handleAdd(song)}
                disabled={added.has(song._id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-90 ${
                  added.has(song._id)
                    ? 'bg-white/10 text-spotify-light cursor-default'
                    : 'bg-spotify-green text-black hover:bg-[#1ed760]'
                }`}
              >
                {added.has(song._id) ? 'Added' : '+ Add'}
              </button>
            </div>
          ))}
          {!loading && !query && (
            <p className="text-center text-spotify-light text-sm py-6">Search for a song to add</p>
          )}
          {!loading && query && results.length === 0 && (
            <p className="text-center text-spotify-light text-sm py-6">No results for "{query}"</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Playlist Page ───────────────────────────────────────────────────────────
const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playlists, removeSongFromPlaylist } = usePlaylistStore();
  const [showAddModal, setShowAddModal] = useState(false);

  const playlist = playlists.find((p) => p.id === id);

  if (!playlist) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center mt-24 text-center animate-fade-in">
          <Music size={56} className="text-spotify-light mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Playlist not found</h2>
          <p className="text-spotify-light text-sm mb-6">This playlist may have been deleted.</p>
          <button onClick={() => navigate('/library')}
            className="px-5 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:scale-105 transition-transform">
            Go to Library
          </button>
        </div>
      </Layout>
    );
  }

  const coverSrc = playlist.songs[0]?.coverUrl
    || 'https://placehold.co/240x240/282828/ffffff?text=♪';

  return (
    <Layout>
      {showAddModal && (
        <AddSongsModal
          playlistId={id}
          existingIds={playlist.songs.map((s) => s._id)}
          onClose={() => setShowAddModal(false)}
        />
      )}

      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-end gap-5 mb-8 p-5 rounded-2xl bg-gradient-to-br from-cyan-900/50 via-teal-900/30 to-transparent">
          <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 shadow-2xl">
            {playlist.songs[0]?.coverUrl
              ? <img src={coverSrc} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-[#282828] flex items-center justify-center"><Music size={36} className="text-spotify-light" /></div>}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Playlist</p>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white truncate">{playlist.name}</h1>
            <p className="text-spotify-light text-sm mt-1">{playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Add songs button */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-spotify-green text-black font-bold text-sm hover:bg-[#1ed760] active:scale-95 shadow-lg shadow-spotify-green/20 transition-all"
          >
            <Plus size={16} />
            Add songs
          </button>
        </div>

        {/* Songs list */}
        {playlist.songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Music size={48} className="text-spotify-light mb-4" />
            <p className="text-white font-semibold">This playlist is empty</p>
            <p className="text-spotify-light text-sm mt-1">Add songs using the button above</p>
          </div>
        ) : (
          <div className="space-y-1">
            {playlist.songs.map((song, i) => (
              <div key={song._id} className="group flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${i * 25}ms` }}>
                <div className="flex-1 min-w-0">
                  <SongRow song={song} index={i} queue={playlist.songs} />
                </div>
                <button
                  onClick={() => removeSongFromPlaylist(id, song._id)}
                  className="shrink-0 p-2 opacity-0 group-hover:opacity-100 text-spotify-light hover:text-red-400 active:scale-90 transition-all"
                  title="Remove"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PlaylistPage;
