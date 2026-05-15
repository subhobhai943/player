import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../components/Layout';
import SongCard from '../components/SongCard';
import SongRow from '../components/SongRow';
import CategoryPills from '../components/CategoryPills';
import useAuthStore from '../store/authStore';
import { fetchFeaturedSongs, fetchByGenre } from '../api/musicApi';

const CATEGORY_MAP = {
  all:       'hindi',
  hindi:     'top hindi songs',
  bollywood: 'bollywood hits',
  pop:       'pop hits',
  romantic:  'romantic songs',
  party:     'party songs',
  lofi:      'lofi chill',
  rap:       'hindi rap',
  classical: 'classical music',
  english:   'top english songs',
};

const SkeletonCard = () => (
  <div className="rounded-2xl p-3 bg-[#181818] animate-pulse">
    <div className="shimmer aspect-square rounded-xl mb-3" />
    <div className="shimmer h-3.5 rounded w-3/4 mb-2" />
    <div className="shimmer h-3 rounded w-1/2" />
  </div>
);

const SkeletonRow = () => (
  <div className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
    <div className="shimmer w-10 h-10 rounded-lg shrink-0" />
    <div className="flex-1">
      <div className="shimmer h-3.5 rounded w-2/5 mb-2" />
      <div className="shimmer h-3 rounded w-1/4" />
    </div>
  </div>
);

const Home = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const loadSongs = useCallback(async (category) => {
    setLoading(true);
    try {
      const term = CATEGORY_MAP[category] || 'top hindi songs';
      const result = category === 'all'
        ? await fetchFeaturedSongs('hindi', 20)
        : await fetchByGenre(term, 20);
      setSongs(result);
    } catch (e) {
      console.error('Failed to load songs', e);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSongs(activeCategory); }, [activeCategory, loadSongs]);

  const handleCategory = (cat) => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
  };

  return (
    <Layout>
      {/* Greeting */}
      <div className="mb-5 animate-fade-in">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {getGreeting()}
          {isAuthenticated && user?.name
            ? <span className="gradient-text">, {user.name}</span>
            : ''}
        </h1>
      </div>

      {/* Category pills */}
      <CategoryPills active={activeCategory} onChange={handleCategory} />

      {/* Trending now – card grid (first 5 or 6) */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-spotify-green inline-block" />
          {activeCategory === 'all' ? 'Trending now' : `Top ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : songs.slice(0, 6).map((song, i) => (
                <div key={song._id} className="animate-scale-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <SongCard song={song} queue={songs} />
                </div>
              ))}
        </div>
      </section>

      {/* Quick picks – horizontal scroll row */}
      {!loading && songs.length > 6 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-indigo-400 inline-block" />
            Quick picks
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {songs.slice(6, 14).map((song, i) => (
              <div key={song._id} className="shrink-0 w-36 sm:w-44 animate-scale-in" style={{ animationDelay: `${i * 40}ms` }}>
                <SongCard song={song} queue={songs} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All songs list */}
      {!loading && songs.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-pink-400 inline-block" />
            All songs
          </h2>
          <div className="space-y-1">
            {songs.map((song, i) => (
              <div key={song._id} className="animate-fade-in" style={{ animationDelay: `${i * 25}ms` }}>
                <SongRow song={song} index={i} queue={songs} />
              </div>
            ))}
          </div>
        </section>
      )}

      {!loading && songs.length === 0 && (
        <p className="text-spotify-light">No songs found. Try another category.</p>
      )}
    </Layout>
  );
};

export default Home;
