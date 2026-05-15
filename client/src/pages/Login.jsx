import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to auth API
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen bg-spotify-black flex items-center justify-center">
      <div className="bg-spotify-dark p-8 rounded-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-spotify-card text-white placeholder-spotify-light focus:outline-none focus:ring-2 focus:ring-spotify-green"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-spotify-card text-white placeholder-spotify-light focus:outline-none focus:ring-2 focus:ring-spotify-green"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-spotify-green text-black font-bold hover:scale-105 transition-transform"
          >
            Log In
          </button>
        </form>
        <p className="text-spotify-light text-center mt-4 text-sm">
          Don't have an account?{' '}
          <a href="/register" className="text-white underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
