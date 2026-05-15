# 🎵 Player

A full-stack Spotify/Apple Music-like web application built with **React.js**, **Node.js/Express**, and **MongoDB**.

## Stack

- Frontend: React.js (Vite), Tailwind CSS, React Router, Zustand
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose (MongoDB Compass-friendly)
- Auth: JWT
- Storage: Cloudinary for audio and cover image uploads

## Features

- User registration and login
- Spotify-style player layout
- Bottom audio player with play/pause, seek, volume, next/previous
- Song upload with Cloudinary
- Albums and playlists APIs
- Liked songs
- Search songs by title, artist, or genre
- Seed script for demo content

## Local Setup

```bash
git clone https://github.com/subhobhai943/player.git
cd player

# Backend
cd server
npm install
cp ../.env.example .env
npm run dev

# Frontend (new terminal)
cd ../client
npm install
npm run dev
```

## Environment Variables

Create `server/.env` using the root `.env.example` values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/player
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Seed Demo Songs

```bash
cd server
npm run seed
```

This inserts demo albums and playable MP3 URLs so the UI works immediately.
