import React, { useState } from 'react';
import Layout from '../components/Layout';
import SongRow from '../components/SongRow';
import { searchItunesSongs } from '../api/musicApi';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);

    if (!val.trim()) {
      setResults([]);
      return;
    }

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
      <h1 className="text-3xl font-bold text-white mb-6">Search</h1>
      <input
        type="text"
        placeholder="Artists, songs, or albums"
        value={query}
        onChange={handleSearch}
        className="w-full max-w-md px-5 py-3 rounded-full bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-spotify-green text-sm font-medium mb-8"
      />

      {loading && <p className="text-spotify-light">Searching...</p>}

      {results.length > 0 && !loading && (
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Results</h2>
          <div className="space-y-1">
            {results.map((song, i) => (
              <SongRow
                key={song._id}
                song={song}
                index={i}
                queue={results}
              />
            ))}
          </div>
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <p className="text-spotify-light">No results for "{query}"</p>
      )}
    </Layout>
  );
};

export default Search;
