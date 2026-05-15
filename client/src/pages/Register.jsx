import React, { useState } from 'react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to auth API
    console.log({ name, email, password });
  };

  return (
    <div className="min-h-screen bg-spotify-black flex items-center justify-center">
      <div className="bg-spotify-dark p-8 rounded-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-spotify-card text-white placeholder-spotify-light focus:outline-none focus:ring-2 focus:ring-spotify-green"
          />
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
            Sign Up
          </button>
        </form>
        <p className="text-spotify-light text-center mt-4 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-white underline">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
