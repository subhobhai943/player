import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import SongCard from '../components/SongCard';
import useAuthStore from '../store/authStore';
import { fetchFeaturedSongs } from '../api/musicApi';

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
      <h1 className="text-3xl font-bold text-white mb-6">
        {getGreeting()}{isAuthenticated && user?.name ? `, ${user.name}` : ''}
      </h1>

      {loading ? (
        <p className="text-spotify-light">Loading songs...</p>
      ) : songs.length === 0 ? (
        <p className="text-spotify-light">
          No songs available yet. Try again in a moment.
        </p>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Trending now</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {songs.slice(0, 5).map((song) => (
                <SongCard key={song._id} song={song} queue={songs} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Recently added</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {songs.map((song) => (
                <SongCard key={song._id} song={song} queue={songs} />
              ))}
            </div>
          </section>
        </>
      )}
    </Layout>
  );
};

export default Home;
