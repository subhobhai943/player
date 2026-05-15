# 🚀 Deployment Guide (Free Tier)

This guide walks you through deploying the **Player** app completely free using:

| Service | What it hosts | Free tier |
|---|---|---|
| [Vercel](https://vercel.com) | React frontend (client) | ✅ Always free, no credit card |
| [Railway](https://railway.app) | Node.js backend (server) | ✅ No credit card, no cold starts |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | MongoDB database | ✅ 512MB free cluster |
| [Cloudinary](https://cloudinary.com) | Audio + image uploads | ✅ 25GB free storage |

> ✅ **Why Railway?** Railway requires **no credit card** to sign up. You get $5 free trial credit for 30 days, then $1/month in ongoing free credits — a small Express app uses well under $1/month so it runs **effectively free forever** with no cold starts.

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

> This is required so Railway's servers can connect to Atlas from any IP.

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
   mongodb+srv://playeruser:yourpassword@cluster0.xxxxx.mongodb.net/player?retryWrites=true&w=majority&appName=Cluster0
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

## PART 3 — Railway (Backend / Server) ⭐ Recommended

> Railway requires **no credit card**. Sign up with GitHub and deploy instantly.

### Step 1 — Create a Railway account

1. Go to [https://railway.app](https://railway.app)
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway to access your GitHub account

### Step 2 — Create a new project

1. On the Railway dashboard click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and click the **`player`** repository
4. Railway will detect it as a Node.js app automatically

### Step 3 — Configure the service

After the repo is connected:

1. Click on the service card that was created
2. Go to the **"Settings"** tab
3. Set the following:

| Setting | Value |
|---|---|
| **Root Directory** | `server` |
| **Build Command** | `npm install` |
| **Start Command** | `node index.js` |
| **Watch Paths** | `server/**` |

4. Go to **"Networking"** tab → click **"Generate Domain"** to get a public URL

### Step 4 — Add environment variables

1. Click the **"Variables"** tab
2. Click **"Raw Editor"** and paste all variables at once:

```
PORT=5000
MONGO_URI=mongodb+srv://playeruser:yourpassword@cluster0.xxxxx.mongodb.net/player?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=mySuperSecretKey123!@#
JWT_EXPIRES_IN=7d
CLIENT_URL=*
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> Replace each value with your real credentials. Update `CLIENT_URL` to your Vercel URL after Part 4.

3. Click **"Update Variables"** — Railway redeploys automatically

### Step 5 — Get your backend URL

1. Go to **"Settings"** → **"Networking"** → **"Public Networking"**
2. Your backend URL looks like:
   ```
   https://player-server-production.up.railway.app
   ```
3. ✅ **Save this URL** — you’ll need it for Vercel

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
| `VITE_API_URL` | your Railway backend URL (e.g. `https://player-server-production.up.railway.app`) |

> ⚠️ No trailing slash at the end of the URL.

### Step 5 — Deploy

1. Click **"Deploy"**
2. Wait for the build to finish (1–2 minutes)
3. Your frontend is live at:
   ```
   https://player-xxxx.vercel.app
   ```

### Step 6 — Update CORS on Railway

1. Go back to Railway → your service → **"Variables"** tab
2. Update `CLIENT_URL` to your actual Vercel URL:
   ```
   https://player-xxxx.vercel.app
   ```
3. Click **"Update Variables"** — Railway redeploys automatically

---

## PART 5 — Verify Everything Works

Test in this order:

1. ✅ Open your Vercel URL in a browser
2. ✅ Click **Sign Up** and create an account
3. ✅ You should be redirected to the Home page
4. ✅ Go to `/upload` and upload a test MP3 + cover image
5. ✅ Go to Home — your song should appear and play
6. ✅ Test search, like, and profile pages
7. ✅ Connect MongoDB Compass to your Atlas URI — you should see `users` and `songs` collections in the `player` database

---

## PART 6 — Custom Domain (Optional)

If you have a custom domain (e.g. from Namecheap or GoDaddy):

**Frontend (Vercel):**
1. Go to Vercel project → **"Settings"** → **"Domains"**
2. Add your domain (e.g. `player.hillaryns.com`)
3. Add the DNS records shown by Vercel at your domain registrar
4. Vercel handles HTTPS automatically

**Backend (Railway):**
1. Go to Railway service → **"Settings"** → **"Networking"**
2. Add a custom domain like `api.hillaryns.com`
3. Add the CNAME record to your DNS registrar

---

## 🔁 Re-deploying After Code Changes

Every time you push to the `main` branch:

- **Vercel** automatically rebuilds the frontend ✅
- **Railway** automatically rebuilds the backend ✅

No manual steps needed after the initial setup.

---

## ❓ Troubleshooting

| Problem | Fix |
|---|---|
| CORS error in browser | Make sure `CLIENT_URL` on Railway matches your exact Vercel URL (no trailing slash) |
| Login fails | Double check `JWT_SECRET` is set in Railway Variables tab |
| Upload fails | Verify all 3 Cloudinary env vars are correct in Railway Variables tab |
| MongoDB connection error | Check IP whitelist on Atlas is set to `0.0.0.0/0` |
| Blank page on Vercel | Make sure Root Directory is set to `client`, not the repo root |
| Songs not loading | Run `npm run seed` locally with Atlas `MONGO_URI` in `server/.env` |
| Railway build fails | Check Root Directory is `server` and Start Command is `node index.js` |
| `VITE_API_URL` not working | No trailing `/` at the end of the Railway URL |
| Railway domain not showing | Go to Settings → Networking → click "Generate Domain" |

---

## 📌 Summary of Deployment URLs

After completing all parts, you’ll have:

```
Frontend:   https://your-app.vercel.app
Backend:    https://player-server-production.up.railway.app
Database:   MongoDB Atlas (cloud)
Storage:    Cloudinary (cloud)
```

---

© 2026 [hillaryns](https://github.com/hillaryns) — All rights reserved.  
Maintained by [subhobhai943](https://github.com/subhobhai943).
