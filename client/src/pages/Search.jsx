import React, { useState } from 'react';
import Layout from '../components/Layout';
import SongRow from '../components/SongRow';
import { searchItunesSongs } from '../api/musicApi';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const tracks = await searchItunesSongs(val, 25);
      setResults(tracks);
    } catch (err) {
      console.error('Search failed', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">Search</h1>

        {/* Search input */}
        <div className="relative max-w-lg mb-8">
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Artists, songs, or albums"
            value={query}
            onChange={handleSearch}
            className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-[#242424] border border-white/8 text-white placeholder-gray-500 focus:border-spotify-green/50 focus:bg-[#2a2a2a] transition-all duration-200 text-sm font-medium"
          />
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl animate-pulse">
                <div className="shimmer w-10 h-10 rounded-lg shrink-0" />
                <div className="flex-1">
                  <div className="shimmer h-3.5 rounded w-2/5 mb-2" />
                  <div className="shimmer h-3 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && !loading && (
          <div className="animate-fade-in">
            <h2 className="text-sm font-bold text-spotify-light uppercase tracking-widest mb-3">Results</h2>
            <div className="space-y-1">
              {results.map((song, i) => (
                <div key={song._id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                  <SongRow song={song} index={i} queue={results} />
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <p className="text-spotify-light">No results for "{query}"</p>
        )}
      </div>
    </Layout>
  );
};

export default Search;
