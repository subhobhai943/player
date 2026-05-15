# 🚀 Deployment Guide (Free Tier)

This guide walks you through deploying the **Player** app completely free using:

| Service | What it hosts | Free tier |
|---|---|---|
| [Vercel](https://vercel.com) | React frontend (client) | ✅ Always free |
| [Render](https://render.com) | Node.js backend (server) | ✅ Free (sleeps after 15min idle) |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | MongoDB database | ✅ 512MB free cluster |
| [Cloudinary](https://cloudinary.com) | Audio + image uploads | ✅ 25GB free storage |

> ⚠️ On Render's free plan, the server **sleeps after 15 minutes of inactivity**. The first request after sleep takes ~30 seconds. Upgrade to a paid plan ($7/mo) to avoid this.

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

> This is required so Render's servers can connect to Atlas.

### Step 4 — Get your connection string

1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string — it looks like:
   ```
   mongodb+srv://playeruser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add your database name before the `?`:
   ```
   mongodb+srv://playeruser:yourpassword@cluster0.xxxxx.mongodb.net/player?retryWrites=true&w=majority
   ```
7. **Save this string** — you'll need it for Render

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

**Save all three** — you'll need them for Render.

---

## PART 3 — Render (Backend / Server)

### Step 1 — Create a Render account

1. Go to [https://render.com](https://render.com)
2. Click **"Get Started"** → sign up with GitHub
3. Authorize Render to access your GitHub

### Step 2 — Create a new Web Service

1. On the Render dashboard click **"New +"** → **"Web Service"**
2. Connect your GitHub account if not already done
3. Find and select the **`player`** repository
4. Click **"Connect"**

### Step 3 — Configure the service

Fill in the settings:

| Setting | Value |
|---|---|
| **Name** | `player-server` |
| **Region** | Singapore (closest to India) |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node index.js` |
| **Instance Type** | `Free` |

### Step 4 — Add environment variables

Scroll down to the **"Environment Variables"** section and add each one:

| Key | Value |
|---|---|
| `PORT` | `5000` |
| `MONGO_URI` | your MongoDB Atlas connection string |
| `JWT_SECRET` | any long random string (e.g. `mySuperSecretKey123!@#`) |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | your Vercel URL (add after deploying frontend — see Part 4 Step 5) |
| `CLOUDINARY_CLOUD_NAME` | your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | your Cloudinary API secret |

> ⚠️ You can update `CLIENT_URL` after the frontend is deployed. For now set it to `*` as a placeholder.

### Step 5 — Deploy

1. Click **"Create Web Service"**
2. Render will install dependencies and start the server
3. Wait for the status to show **"Live"** (usually 2–3 minutes)
4. Copy your backend URL — it looks like:
   ```
   https://player-server.onrender.com
   ```
5. **Save this URL** — you'll need it for Vercel

### Step 6 — Seed the database

After the server is live, run the seed script locally pointing at Atlas:

```bash
cd server
# Temporarily set MONGO_URI in your local .env to the Atlas connection string
npm run seed
```

Or wait — the app works without seed data, users can upload songs directly.

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

Vercel will auto-detect it as a monorepo. Configure:

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
| `VITE_API_URL` | your Render backend URL (e.g. `https://player-server.onrender.com`) |

### Step 5 — Fix API proxy for production

The Vite proxy only works in development. For production, update `client/src/api/axiosInstance.js` so it uses your Render URL in production:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
  withCredentials: true,
});
```

Commit and push this change before deploying.

### Step 6 — Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (1–2 minutes)
3. Your frontend is live at:
   ```
   https://player-xxxx.vercel.app
   ```

### Step 7 — Update CORS on Render

1. Go back to your Render service dashboard
2. Go to **"Environment"** tab
3. Update `CLIENT_URL` to your actual Vercel URL:
   ```
   https://player-xxxx.vercel.app
   ```
4. Click **"Save Changes"** — Render will restart the server automatically

---

## PART 5 — Verify Everything Works

Test in this order:

1. ✅ Open your Vercel URL in a browser
2. ✅ Click **Sign Up** and create an account
3. ✅ You should be redirected to the Home page
4. ✅ Go to `/upload` and upload a test MP3 + cover image
5. ✅ Go to Home — your song should appear and play
6. ✅ Test search, like, and profile pages

---

## PART 6 — Custom Domain (Optional)

If you have a custom domain (e.g. from Namecheap or GoDaddy):

1. Go to Vercel project → **"Settings"** → **"Domains"**
2. Add your domain (e.g. `player.hillaryns.com`)
3. Add the DNS records shown by Vercel to your domain registrar
4. Vercel handles HTTPS automatically

---

## 🔁 Re-deploying After Code Changes

Every time you push to the `main` branch:

- **Vercel** automatically rebuilds the frontend ✅
- **Render** automatically rebuilds the backend ✅

No manual steps needed after initial setup.

---

## ❓ Troubleshooting

| Problem | Fix |
|---|---|
| Backend returns 502/503 | Render free tier is sleeping — wait 30 seconds and retry |
| CORS error in browser | Make sure `CLIENT_URL` on Render matches your exact Vercel URL (no trailing slash) |
| Login fails | Double check `JWT_SECRET` is set on Render |
| Upload fails | Verify all 3 Cloudinary env vars are set correctly on Render |
| MongoDB connection error | Check IP whitelist on Atlas is set to `0.0.0.0/0` |
| Blank page on Vercel | Make sure Root Directory is set to `client`, not the repo root |
| Songs not loading | Run `npm run seed` locally with Atlas `MONGO_URI` in your `.env` |

---

## 📌 Summary of Deployment URLs

After completing all parts, you'll have:

```
Frontend:   https://your-app.vercel.app
Backend:    https://player-server.onrender.com
Database:   MongoDB Atlas (cloud)
Storage:    Cloudinary (cloud)
```

---

© 2026 [hillaryns](https://github.com/hillaryns) — All rights reserved.  
Maintained by [subhobhai943](https://github.com/subhobhai943).
