import React from 'react';
import Layout from '../components/Layout';
import { Music } from 'lucide-react';

const Library = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold text-white mb-6">Your Library</h1>
      <div className="flex flex-col items-center justify-center mt-20 text-center">
        <Music size={64} className="text-spotify-light mb-4" />
        <h2 className="text-white text-xl font-bold mb-2">Create your first playlist</h2>
        <p className="text-spotify-light text-sm mb-6">It's easy, we'll help you</p>
        <button className="px-6 py-3 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform text-sm">
          Create playlist
        </button>
      </div>
    </Layout>
  );
};

export default Library;
