import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import SongCard from '../components/SongCard';
import useAuthStore from '../store/authStore';
import { fetchFeaturedSongs } from '../api/musicApi';

const SkeletonCard = () => (
  <div className="rounded-2xl p-3 bg-[#181818] animate-pulse">
    <div className="shimmer aspect-square rounded-xl mb-3" />
    <div className="shimmer h-3.5 rounded w-3/4 mb-2" />
    <div className="shimmer h-3 rounded w-1/2" />
  </div>
);

const Home = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const featured = await fetchFeaturedSongs('hindi', 20);
        setSongs(featured);
      } catch (e) {
        console.error('Failed to load featured songs', e);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Layout>
      {/* Greeting */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {getGreeting()}
          {isAuthenticated && user?.name ? (
            <span className="gradient-text">, {user.name}</span>
          ) : ''}
        </h1>
      </div>

      {/* Trending now */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-spotify-green inline-block" />
          Trending now
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : songs.slice(0, 5).map((song, i) => (
                <div key={song._id} className="animate-scale-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <SongCard song={song} queue={songs} />
                </div>
              ))}
        </div>
      </section>

      {/* Recently added */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-indigo-400 inline-block" />
          Recently added
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            : songs.map((song, i) => (
                <div key={song._id} className="animate-scale-in" style={{ animationDelay: `${i * 40}ms` }}>
                  <SongCard song={song} queue={songs} />
                </div>
              ))}
        </div>

        {!loading && songs.length === 0 && (
          <p className="text-spotify-light">No songs available yet. Try again in a moment.</p>
        )}
      </section>
    </Layout>
  );
};

export default Home;
