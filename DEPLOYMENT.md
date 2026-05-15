# 🚀 Deployment Guide (Free Tier)

This guide walks you through deploying the **Player** app completely free using:

| Service | What it hosts | Free tier |
|---|---|---|
| [Vercel](https://vercel.com) | React frontend (client) | ✅ Always free, no card |
| [Render](https://render.com) | Node.js backend (server) | ✅ Free, **no credit card** |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | MongoDB database | ✅ 512MB free cluster, no card |
| [Cloudinary](https://cloudinary.com) | Audio + image uploads | ✅ 25GB free storage, no card |

> ⚠️ **Note on Render free tier:** The server sleeps after **15 minutes of inactivity**. The first request after sleep takes ~30 seconds to wake up. For a personal project this is totally fine — and it requires **zero credit card or billing setup**.

---

## PART 1 — MongoDB Atlas (Database)

### Step 1 — Create a free cluster

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click **"Try Free"** → sign up with Google or email
3. Choose **"Free"** (M0 Sandbox) plan
4. Select a cloud provider and region — **Mumbai (ap-south-1)** is ideal for India
5. Click **"Create Cluster"** — wait ~2 minutes

### Step 2 — Create a database user

1. In the left sidebar click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **Password** authentication
4. Set username (e.g. `playeruser`) and a strong password
5. Set role to **"Read and write to any database"**
6. Click **"Add User"**

### Step 3 — Allow network access

1. In the left sidebar click **"Network Access"**
2. Click **"Add IP Address"** → **"Allow Access From Anywhere"** (`0.0.0.0/0`)
3. Click **"Confirm"**

### Step 4 — Get your connection string

1. Go to **"Database"** → **"Connect"** → **"Connect your application"**
2. Copy and fill in the string:
   ```
   mongodb+srv://playeruser:yourpassword@cluster0.xxxxx.mongodb.net/player?retryWrites=true&w=majority&appName=Cluster0
   ```
3. ✅ **Save this string** — you’ll need it in Part 3

---

## PART 2 — Cloudinary (File Storage)

1. Go to [https://cloudinary.com](https://cloudinary.com) → **"Sign Up For Free"**
2. From your Dashboard copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. ✅ **Save all three** — you’ll need them in Part 3

---

## PART 3 — Render (Backend / Server)

> Render requires **no credit card**. Sign up with GitHub and deploy for free.

### Step 1 — Create a Render account

1. Go to [https://render.com](https://render.com)
2. Click **"Get Started"** → **"Continue with GitHub"**
3. Authorize Render to access your GitHub

### Step 2 — Create a new Web Service

1. On the dashboard click **"New +"** → **"Web Service"**
2. Choose **"Build and deploy from a Git repository"**
3. Find and select the **`player`** repository → click **"Connect"**

### Step 3 — Configure the service

| Setting | Value |
|---|---|
| **Name** | `player-server` |
| **Region** | `Singapore` (closest to India) |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node index.js` |
| **Instance Type** | `Free` |

### Step 4 — Add environment variables

Scroll down to **"Environment Variables"** and add each one:

| Key | Value |
|---|---|
| `PORT` | `5000` |
| `MONGO_URI` | your MongoDB Atlas connection string |
| `JWT_SECRET` | any long random string (e.g. `mySuperSecretKey123!@#`) |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | `*` (update to your Vercel URL after Part 4) |
| `CLOUDINARY_CLOUD_NAME` | your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | your Cloudinary API secret |

### Step 5 — Deploy

1. Click **"Create Web Service"**
2. Render installs dependencies and starts the server (2–3 minutes)
3. Wait for the status badge to show **"Live"**
4. Copy your backend URL — it looks like:
   ```
   https://player-server.onrender.com
   ```
5. ✅ **Save this URL** — you’ll need it for Vercel

### Step 6 — Seed the database (optional)

Run locally with your Atlas URI in `server/.env`:

```bash
cd server
npm run seed
```

You can skip this — the app works without seed data. Users can upload songs directly.

---

## PART 4 — Vercel (Frontend)

### Step 1 — Create a Vercel account

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel

### Step 2 — Import the project

1. Click **"Add New..."** → **"Project"**
2. Find the **`player`** repository and click **"Import"**

### Step 3 — Configure the project

| Setting | Value |
|---|---|
| **Framework Preset** | `Vite` |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Step 4 — Add environment variable

| Key | Value |
|---|---|
| `VITE_API_URL` | your Render backend URL (e.g. `https://player-server.onrender.com`) |

> ⚠️ No trailing slash at the end of the URL.

### Step 5 — Deploy

1. Click **"Deploy"** — wait 1–2 minutes
2. Your frontend is live at:
   ```
   https://player-xxxx.vercel.app
   ```

### Step 6 — Update CORS on Render

1. Go to Render → your `player-server` service → **"Environment"** tab
2. Update `CLIENT_URL` to your actual Vercel URL:
   ```
   https://player-xxxx.vercel.app
   ```
3. Click **"Save Changes"** — Render redeploys automatically

---

## PART 5 — Verify Everything Works

1. ✅ Open your Vercel URL in a browser
2. ✅ Click **Sign Up** and create an account
3. ✅ Go to `/upload` and upload a test MP3 + cover image
4. ✅ Go to Home — your song should appear and play
5. ✅ Test search, like, and profile pages
6. ✅ Connect MongoDB Compass to your Atlas URI — check `users` and `songs` collections in the `player` database

---

## PART 6 — Custom Domain (Optional)

**Frontend (Vercel):**
1. Vercel project → **"Settings"** → **"Domains"** → add your domain (e.g. `player.hillaryns.com`)
2. Add the DNS records shown by Vercel at your domain registrar

**Backend (Render):**
1. Render service → **"Settings"** → **"Custom Domain"**
2. Add `api.hillaryns.com` and add the CNAME record to your DNS registrar

---

## 🔁 Re-deploying After Code Changes

Every time you push to the `main` branch:

- **Vercel** automatically rebuilds the frontend ✅
- **Render** automatically rebuilds the backend ✅

No manual steps needed after the initial setup.

---

## ❓ Troubleshooting

| Problem | Fix |
|---|---|
| Server takes 30s to respond | Render free tier woke from sleep — normal, just wait and retry |
| CORS error in browser | Make sure `CLIENT_URL` on Render matches your exact Vercel URL (no trailing slash) |
| Login fails | Double check `JWT_SECRET` is set in Render Environment tab |
| Upload fails | Verify all 3 Cloudinary env vars are correct in Render |
| MongoDB connection error | Check Atlas IP whitelist is set to `0.0.0.0/0` |
| Blank page on Vercel | Root Directory must be `client`, not the repo root |
| Songs not loading | Run `npm run seed` locally with Atlas `MONGO_URI` in `server/.env` |
| `VITE_API_URL` not working | No trailing `/` at the end of the Render URL |

---

## 📌 Summary of Deployment URLs

```
Frontend:   https://your-app.vercel.app
Backend:    https://player-server.onrender.com
Database:   MongoDB Atlas (cloud)
Storage:    Cloudinary (cloud)
```

---

© 2026 [hillaryns](https://github.com/hillaryns) — All rights reserved.  
Maintained by [subhobhai943](https://github.com/subhobhai943).
