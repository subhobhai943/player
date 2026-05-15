import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axiosInstance';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.user, data.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-spotify-black flex items-center justify-center">
      <div className="bg-spotify-dark p-10 rounded-xl w-full max-w-sm shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-2">🎵 Player</h1>
        <p className="text-spotify-light text-center text-sm mb-8">Log in to continue listening</p>
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-md px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-spotify-light mb-1 block">Email address</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3 rounded-md bg-spotify-card text-white placeholder-spotify-light focus:outline-none focus:ring-2 focus:ring-spotify-green"
            />
          </div>
          <div>
            <label className="text-xs text-spotify-light mb-1 block">Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full px-4 py-3 rounded-md bg-spotify-card text-white placeholder-spotify-light focus:outline-none focus:ring-2 focus:ring-spotify-green"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-full bg-spotify-green text-black font-bold hover:scale-105 transition-transform disabled:opacity-60 mt-2"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p className="text-spotify-light text-center mt-6 text-sm">
          Don't have an account?{' '}
          <a href="/register" className="text-white font-semibold hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
