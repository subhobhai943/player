# 🎵 Player

> A full-stack **Spotify / Apple Music**-style web application built with React.js, Node.js, Express, and MongoDB.

![License](https://img.shields.io/badge/license-Custom%20Copyright-red)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20Node%20%7C%20MongoDB-1DB954)
![Status](https://img.shields.io/badge/status-Active-brightgreen)

---

## ✨ Features

- 🔐 User registration & login with **JWT authentication**
- 🎧 **Real audio playback** — seek bar, volume, play/pause
- 🔀 **Shuffle** — randomizes queue, restores on toggle
- 🔁 **Repeat modes** — None / Repeat All / Repeat One
- ⌨️ **Keyboard shortcuts** — Space, arrow keys, M to mute
- 📱 **Mobile responsive** — mini player on small screens
- 🖥️ **OS media controls** — lock screen & headphone buttons via Media Session API
- ❤️ **Like songs** — persisted to MongoDB per user
- ☁️ **Song upload** — audio + cover image via **Cloudinary**
- 💿 **Albums & Playlists** — full CRUD APIs
- 🔍 **Search** — by title, artist, or genre
- 🌱 **Seed script** — pre-loads demo songs so UI works instantly
- 🍃 **MongoDB Compass-friendly** — inspect all collections visually

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), Tailwind CSS, React Router v6, Zustand |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (JSON Web Tokens), bcryptjs |
| Storage | Cloudinary (audio + cover images) |
| State | Zustand with `persist` middleware |
| HTTP | Axios with request/response interceptors |

---

## 📁 Project Structure

```
player/
├── client/                    # React frontend (Vite)
│   └── src/
│       ├── api/               # Axios instance with JWT + 401 handler
│       ├── components/        # Layout, Sidebar, Navbar, PlayerBar, MiniPlayer
│       │                        SongCard, SongRow, ProtectedRoute
│       ├── hooks/             # useAuth, useLike, useKeyboardControls,
│       │                        useMediaSession
│       ├── pages/             # Home, Search, Library, LikedSongs,
│       │                        AlbumPage, PlaylistPage, UploadSong,
│       │                        Login, Register, Profile
│       └── store/             # authStore (persist), playerStore
│
├── server/                    # Express backend
│   ├── config/                # Cloudinary setup
│   ├── controllers/           # auth, songs, albums, playlists
│   ├── middleware/            # JWT protect, multer upload
│   ├── models/                # User, Song, Album, Playlist
│   ├── routes/                # /api/auth /api/songs /api/albums /api/playlists
│   └── scripts/               # seed.js
│
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js >= 18
- MongoDB running locally (or MongoDB Atlas URI)
- [MongoDB Compass](https://www.mongodb.com/products/compass) (optional, for visual DB inspection)
- [Cloudinary](https://cloudinary.com) account (free tier is enough)

### 1. Clone the repository

```bash
git clone https://github.com/subhobhai943/player.git
cd player
```

### 2. Backend setup

```bash
cd server
npm install
cp ../.env.example .env
# Fill in .env values (see below)
npm run dev
```

### 3. Frontend setup

```bash
cd ../client
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### 4. Seed demo songs

```bash
cd server
npm run seed
```

Inserts 2 demo albums and 4 playable songs so the UI works immediately without uploading anything.

---

## ⚙️ Environment Variables

Create `server/.env` based on `.env.example`:

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

---

## 🗄️ MongoDB Collections

Connect MongoDB Compass to `mongodb://localhost:27017/player` to inspect:

| Collection | Key Fields |
|---|---|
| `users` | name, email, password (hashed), likedSongs[], playlists[], isPremium |
| `songs` | title, artist, audioUrl, coverUrl, duration, genre, plays, album ref |
| `albums` | title, artist, coverUrl, songs[], year, genre |
| `playlists` | name, owner ref, songs[], isPublic, description |

---

## 📡 API Reference

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Create account |
| POST | `/login` | ❌ | Login, returns JWT |
| GET | `/me` | ✅ | Get current user |

### Songs — `/api/songs`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ❌ | All songs |
| GET | `/search?q=` | ❌ | Search songs |
| GET | `/:id` | ❌ | Get song (increments plays) |
| POST | `/upload` | ✅ | Upload song + cover to Cloudinary |
| PATCH | `/:id/like` | ✅ | Toggle like |
| GET | `/liked/me` | ✅ | Get user's liked songs |

### Albums — `/api/albums`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ❌ | All albums |
| GET | `/:id` | ❌ | Album with songs |
| POST | `/` | ✅ | Create album |

### Playlists — `/api/playlists`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/me` | ✅ | User's playlists |
| GET | `/:id` | ❌ | Playlist with songs |
| POST | `/` | ✅ | Create playlist |
| PATCH | `/:id/add-song` | ✅ | Add song to playlist |

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `→` | Next song |
| `←` | Previous song (or restart if >3s in) |
| `↑` | Volume +10% |
| `↓` | Volume −10% |
| `M` | Mute / Unmute |

> Shortcuts are disabled when focus is inside an input field.

---

## 📱 Mobile Support

- Sidebar is hidden on small screens
- A **mini player** appears at the bottom with play/pause and next controls
- Seek bar and volume are available in the full desktop player bar

---

## 👤 Authors

| Role | GitHub |
|---|---|
| **Original Author & Owner** | [@hillaryns](https://github.com/hillaryns) |
| **Maintainer** | [@subhobhai943](https://github.com/subhobhai943) |

---

## 📄 License

This project is protected under a **Custom Copyright License**.
See the [LICENSE](./LICENSE) file for full terms.

© 2026 [hillaryns](https://github.com/hillaryns) — All rights reserved.
Maintained by [subhobhai943](https://github.com/subhobhai943).
