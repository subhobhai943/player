# 🎵 Spotify Clone

A full-stack Spotify/Apple Music-like web application built with **React.js**, **Node.js/Express**, and **MongoDB**.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), Tailwind CSS, React Router, Zustand |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) — compatible with MongoDB Compass |
| Auth | JWT (JSON Web Tokens) |
| Storage | Cloudinary (audio + images) |

## Project Structure

```
spotify-clone/
├── client/               # React frontend
│   ├── public/
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Route-based pages
│       ├── store/        # Zustand state management
│       ├── hooks/        # Custom React hooks
│       ├── api/          # Axios API service
│       └── assets/       # Icons, images
├── server/               # Express backend
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route definitions
│   ├── controllers/      # Route handler logic
│   ├── middleware/       # Auth + error middleware
│   └── index.js          # Server entry point
├── .gitignore
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas) — connect via MongoDB Compass
- Cloudinary account (for media uploads)

### Installation

```bash
# Clone the repo
git clone https://github.com/subhobhai943/spotify-clone.git
cd spotify-clone

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Environment Variables

Copy `.env.example` to `.env` inside `/server` and fill in your values.

### Run in Development

```bash
# Start backend (from /server)
npm run dev

# Start frontend (from /client)
npm run dev
```

Frontend runs on `http://localhost:5173`  
Backend runs on `http://localhost:5000`
