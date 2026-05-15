# 🚀 Deployment Guide (Free Tier)

This guide walks you through deploying the **Player** app completely free using:

| Service | What it hosts | Free tier |
|---|---|---|
| [Vercel](https://vercel.com) | React frontend (client) | ✅ Always free |
| [Koyeb](https://koyeb.com) | Node.js backend (server) | ✅ Always-on, **no cold starts** |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | MongoDB database | ✅ 512MB free cluster |
| [Cloudinary](https://cloudinary.com) | Audio + image uploads | ✅ 25GB free storage |

> ✅ **Why Koyeb instead of Render?** Render's free tier sleeps after 15 minutes of inactivity (30s cold start). Koyeb's free tier is **always-on with zero cold starts** — no credit card required.

> 🟡 **Railway** is listed as an alternative at the end if Koyeb's free tier is unavailable in your region.

---

## PART 1 — MongoDB Atlas (Database)

### Step 1 — Create a free cluster

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click **"Try Free"** → sign up with Google or email
3. Choose **"Free"** (M0 Sandbox) plan
4. Select a cloud provider (any) and region closest to you — **Mumbai (ap-south-1)** is ideal for India
5. Click **"Create Cluster"** — wait ~2 minutes

### Step 2 — Create a database user

1. In the left sidebar click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **Password** authentication
4. Set a username (e.g. `playeruser`) and a strong password
5. Set role to **"Read and write to any database"**
6. Click **"Add User"**

### Step 3 — Allow network access

1. In the left sidebar click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access From Anywhere"** → this sets `0.0.0.0/0`
4. Click **"Confirm"**

> This is required so Koyeb's servers can connect to Atlas from any IP.

### Step 4 — Get your connection string

1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string — it looks like:
   ```
   mongodb+srv://playeruser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add the database name before the `?`:
   ```
   mongodb+srv://playeruser:yourpassword@cluster0.xxxxx.mongodb.net/player?retryWrites=true&w=majority
   ```
7. ✅ **Save this string** — you’ll need it in Part 3

---

## PART 2 — Cloudinary (File Storage)

### Step 1 — Create a free account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Click **"Sign Up For Free"**
3. After signing up, go to your **Dashboard**

### Step 2 — Collect your credentials

On the Cloudinary dashboard, copy these three values:

- **Cloud Name** (e.g. `dxyz12abc`)
- **API Key** (e.g. `123456789012345`)
- **API Secret** (e.g. `abcDEFghiJKL_mno123`)

✅ **Save all three** — you’ll need them in Part 3.

---

## PART 3 — Koyeb (Backend / Server) ⭐ Recommended

> Koyeb offers a permanently free web service with **no sleep, no cold starts, and no credit card required**.

### Step 1 — Create a Koyeb account

1. Go to [https://app.koyeb.com](https://app.koyeb.com)
2. Click **"Sign up"** → **"Continue with GitHub"**
3. Authorize Koyeb to access your GitHub

### Step 2 — Create a new service

1. On the Koyeb dashboard click **"Create Service"**
2. Choose **"GitHub"** as the deployment source
3. Select your **`player`** repository
4. Set **Branch** to `main`

### Step 3 — Configure the service

Fill in the build & run settings:

| Setting | Value |
|---|---|
| **Service name** | `player-server` |
| **Region** | `Singapore` (closest to India) |
| **Branch** | `main` |
| **Root directory** | `server` |
| **Builder** | `Buildpack` (auto-detects Node.js) |
| **Build command** | `npm install` |
| **Run command** | `node index.js` |
| **Instance type** | `Free` |
| **Port** | `5000` |

### Step 4 — Add environment variables

In the **"Environment variables"** section, add each one:

| Key | Value |
|---|---|
| `PORT` | `5000` |
| `MONGO_URI` | your MongoDB Atlas connection string |
| `JWT_SECRET` | any long random string (e.g. `mySuperSecretKey123!@#`) |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | your Vercel URL — set this after Part 4 (use `*` for now) |
| `CLOUDINARY_CLOUD_NAME` | your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | your Cloudinary API secret |

### Step 5 — Deploy

1. Click **"Deploy"**
2. Koyeb will build and start your server (usually 2–4 minutes)
3. Wait for the status dot to turn **green (Healthy)**
4. Copy your backend public URL — it looks like:
   ```
   https://player-server-xxxx.koyeb.app
   ```
5. ✅ **Save this URL** — you’ll need it for Vercel

### Step 6 — Seed the database (optional)

Run this locally with your Atlas URI in `server/.env` to pre-load demo songs:

```bash
cd server
npm run seed
```

You can skip this — the app works fine without seed data. Users can upload songs directly.

---

## PART 4 — Vercel (Frontend)

### Step 1 — Create a Vercel account

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel

### Step 2 — Import the project

1. On the Vercel dashboard click **"Add New..."** → **"Project"**
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

In the **"Environment Variables"** section add:

| Key | Value |
|---|---|
| `VITE_API_URL` | your Koyeb backend URL (e.g. `https://player-server-xxxx.koyeb.app`) |

### Step 5 — Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (1–2 minutes)
3. Your frontend is live at:
   ```
   https://player-xxxx.vercel.app
   ```

### Step 6 — Update CORS on Koyeb

1. Go back to your Koyeb service dashboard
2. Click **"Settings"** → **"Environment variables"**
3. Update `CLIENT_URL` to your actual Vercel URL:
   ```
   https://player-xxxx.vercel.app
   ```
4. Click **"Redeploy"** — takes ~1 minute

---

## PART 5 — Verify Everything Works

Test in this order:

1. ✅ Open your Vercel URL in a browser
2. ✅ Click **Sign Up** and create an account
3. ✅ You should be redirected to the Home page
4. ✅ Go to `/upload` and upload a test MP3 + cover image
5. ✅ Go to Home — your song should appear and play
6. ✅ Test search, like, and profile pages
7. ✅ Check MongoDB Compass → connect to Atlas URI → `player` database should have `users` and `songs` collections

---

## PART 6 — Custom Domain (Optional)

If you have a custom domain (e.g. from Namecheap or GoDaddy):

1. Go to Vercel project → **"Settings"** → **"Domains"**
2. Add your domain (e.g. `player.hillaryns.com`)
3. Add the DNS records shown by Vercel to your domain registrar
4. Vercel handles HTTPS automatically

For the backend custom domain on Koyeb:
1. Go to Koyeb service → **"Settings"** → **"Domains"**
2. Add a subdomain like `api.hillaryns.com`
3. Add the CNAME record to your DNS registrar

---

## 🔁 Re-deploying After Code Changes

Every time you push to the `main` branch:

- **Vercel** automatically rebuilds the frontend ✅
- **Koyeb** automatically rebuilds the backend ✅

No manual steps needed after the initial setup.

---

## 🟡 Alternative Backend: Railway

If Koyeb's free tier is unavailable or full in your region, use **Railway** as a fallback:

1. Go to [https://railway.app](https://railway.app) → Sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select the `player` repository
4. Set **Root Directory** to `server`
5. Railway auto-detects Node.js — set **Start Command** to `node index.js`
6. Add the same 8 environment variables from the Koyeb table above
7. Your backend URL will be:
   ```
   https://player-server-production.up.railway.app
   ```
8. Use this as `VITE_API_URL` on Vercel

> Railway gives **$5/month in free credits** that reset monthly. A small Express + MongoDB app typically uses <$1/month, so it effectively runs free forever.

---

## ❓ Troubleshooting

| Problem | Fix |
|---|---|
| CORS error in browser | Make sure `CLIENT_URL` on Koyeb matches your exact Vercel URL (no trailing slash) |
| Login fails | Double check `JWT_SECRET` is set on Koyeb env vars |
| Upload fails | Verify all 3 Cloudinary env vars are correct on Koyeb |
| MongoDB connection error | Check IP whitelist on Atlas is set to `0.0.0.0/0` |
| Blank page on Vercel | Make sure Root Directory is set to `client`, not the repo root |
| Songs not loading | Run `npm run seed` locally with Atlas `MONGO_URI` in `server/.env` |
| Koyeb build fails | Check that Root Directory is `server` and Run command is `node index.js` |
| `VITE_API_URL` not working | Make sure there is no trailing `/` at the end of the Koyeb URL |

---

## 📌 Summary of Deployment URLs

After completing all parts, you'll have:

```
Frontend:   https://your-app.vercel.app
Backend:    https://player-server-xxxx.koyeb.app
Database:   MongoDB Atlas (cloud)
Storage:    Cloudinary (cloud)
```

---

© 2026 [hillaryns](https://github.com/hillaryns) — All rights reserved.  
Maintained by [subhobhai943](https://github.com/subhobhai943).
