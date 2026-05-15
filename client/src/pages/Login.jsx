import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-spotify-black flex items-center justify-center">
      <div className="bg-spotify-dark p-10 rounded-xl w-full max-w-sm shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-8">🎵 Player</h1>
        <h2 className="text-xl font-bold text-white text-center mb-6">Log In</h2>
        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            className="w-full px-4 py-3 rounded-md bg-spotify-card text-white placeholder-spotify-light focus:outline-none focus:ring-2 focus:ring-spotify-green"
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required
            className="w-full px-4 py-3 rounded-md bg-spotify-card text-white placeholder-spotify-light focus:outline-none focus:ring-2 focus:ring-spotify-green"
          />
          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-full bg-spotify-green text-black font-bold hover:scale-105 transition-transform disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p className="text-spotify-light text-center mt-6 text-sm">
          Don't have an account?{' '}
          <a href="/register" className="text-white font-semibold underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
