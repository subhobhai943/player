import React from 'react';
import Layout from '../components/Layout';
import SongCard from '../components/SongCard';
import useAuthStore from '../store/authStore';

// Placeholder songs for UI demo until API is connected
const demoSongs = [
  { _id: '1', title: 'Demo Track 1', artist: 'Artist A', duration: 210, coverUrl: '', audioUrl: '' },
  { _id: '2', title: 'Demo Track 2', artist: 'Artist B', duration: 185, coverUrl: '', audioUrl: '' },
  { _id: '3', title: 'Demo Track 3', artist: 'Artist C', duration: 230, coverUrl: '', audioUrl: '' },
  { _id: '4', title: 'Demo Track 4', artist: 'Artist D', duration: 200, coverUrl: '', audioUrl: '' },
];

const Home = () => {
  const { user, isAuthenticated } = useAuthStore();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-white mb-6">
        {getGreeting()}{isAuthenticated && user?.name ? `, ${user.name}` : ''}
      </h1>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Featured</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {demoSongs.map((song) => (
            <SongCard key={song._id} song={song} queue={demoSongs} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">Recently Played</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {demoSongs.slice().reverse().map((song) => (
            <SongCard key={song._id} song={song} queue={demoSongs} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Home;
