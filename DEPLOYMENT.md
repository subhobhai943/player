# 🚀 Deployment Guide (Free Tier)

This guide walks you through deploying the **Player** app completely free using:

| Service | What it hosts | Free tier |
|---|---|---|
| [Vercel](https://vercel.com) | React frontend (client) | ✅ Always free, no credit card |
| [Google Cloud Run](https://cloud.google.com/run) | Node.js backend (server) | ✅ 2 million requests/month free forever |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | MongoDB database | ✅ 512MB free cluster |
| [Cloudinary](https://cloudinary.com) | Audio + image uploads | ✅ 25GB free storage |

> ✅ **Why Google Cloud Run?** Google Cloud Run's **Always Free** tier includes 2 million requests/month, 360,000 GB-seconds of memory, and 180,000 vCPU-seconds — permanently free, no expiry. It requires a Google account (no credit card needed to stay within free limits if you set a spending cap of $0).

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
3. ✅ **Save this string** — needed in Part 3

---

## PART 2 — Cloudinary (File Storage)

1. Go to [https://cloudinary.com](https://cloudinary.com) → **"Sign Up For Free"**
2. From your Dashboard copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. ✅ **Save all three** — needed in Part 3

---

## PART 3 — Google Cloud Run (Backend / Server) ⭐

> Google Cloud Run is a **serverless** container platform. You package your app in Docker, push it to Google, and it runs on demand. The free tier covers well over any personal project's traffic.

### Step 1 — Set up Google Cloud

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Sign in with your **Google account**
3. Create a new project:
   - Click the project dropdown at the top → **"New Project"**
   - Name it `player-app` → click **"Create"**
4. Make sure this project is selected in the top dropdown

### Step 2 — Set a $0 spending cap (important!)

To make sure you are never charged:

1. In the left sidebar go to **"Billing"**
2. Click **"Budgets & alerts"** → **"Create Budget"**
3. Set amount to `$0` and enable email alerts at 100%
4. This ensures you get an email if you ever approach the free tier limit

### Step 3 — Enable required APIs

1. Go to [https://console.cloud.google.com/apis/library](https://console.cloud.google.com/apis/library)
2. Search for and **Enable** each of these:
   - **Cloud Run API**
   - **Cloud Build API**
   - **Artifact Registry API**

### Step 4 — Install Google Cloud CLI

Download and install from: [https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)

Then run:
```bash
gcloud init
# Sign in with your Google account when prompted
# Select your 'player-app' project
```

### Step 5 — Add a Dockerfile to the server

Create `server/Dockerfile` with this content:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8080
ENV PORT=8080
CMD ["node", "index.js"]
```

> ⚠️ Cloud Run uses port **8080** by default. The `PORT` env var is set to `8080` here and your Express app already reads from `process.env.PORT`.

Also create `server/.dockerignore`:
```
node_modules
.env
*.log
```

### Step 6 — Deploy to Cloud Run

From your terminal, inside the `server/` folder:

```bash
cd server

gcloud run deploy player-server \
  --source . \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080
```

- `--source .` tells Cloud Build to build the Docker image automatically
- `--region asia-south1` is Mumbai — closest to India
- `--allow-unauthenticated` makes it publicly accessible

This takes 3–5 minutes on first deploy. You’ll see a URL at the end:
```
Service URL: https://player-server-xxxxxxxxxx-el.a.run.app
```

✅ **Save this URL** — you’ll need it for Vercel.

### Step 7 — Set environment variables on Cloud Run

1. Go to [https://console.cloud.google.com/run](https://console.cloud.google.com/run)
2. Click on **`player-server`**
3. Click **"Edit & Deploy New Revision"**
4. Scroll to **"Variables & Secrets"** → **"Environment variables"**
5. Add each variable:

| Key | Value |
|---|---|
| `PORT` | `8080` |
| `MONGO_URI` | your MongoDB Atlas connection string |
| `JWT_SECRET` | any long random string (e.g. `mySuperSecretKey123!@#`) |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | your Vercel URL — update after Part 4 (use `*` for now) |
| `CLOUDINARY_CLOUD_NAME` | your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | your Cloudinary API secret |

6. Click **"Deploy"** — takes ~2 minutes

### Step 8 — Seed the database (optional)

```bash
cd server
# Make sure server/.env has your Atlas MONGO_URI
npm run seed
```

---

## PART 4 — Vercel (Frontend)

### Step 1 — Create a Vercel account

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"** → **"Continue with GitHub"**

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
| `VITE_API_URL` | your Cloud Run URL (e.g. `https://player-server-xxxxxxxxxx-el.a.run.app`) |

> ⚠️ No trailing slash.

### Step 5 — Deploy

1. Click **"Deploy"** — wait 1–2 minutes
2. Your frontend is live at:
   ```
   https://player-xxxx.vercel.app
   ```

### Step 6 — Update CORS on Cloud Run

1. Go to Cloud Run → `player-server` → **"Edit & Deploy New Revision"**
2. Update `CLIENT_URL` env var to your Vercel URL:
   ```
   https://player-xxxx.vercel.app
   ```
3. Click **"Deploy"**

---

## PART 5 — Verify Everything Works

1. ✅ Open your Vercel URL in a browser
2. ✅ Click **Sign Up** and create an account
3. ✅ Go to `/upload` and upload a test MP3 + cover image
4. ✅ Go to Home — your song should appear and play
5. ✅ Test search, like, and profile pages
6. ✅ Connect MongoDB Compass to your Atlas URI — check `users` and `songs` collections

---

## PART 6 — Re-deploying After Code Changes

**Frontend (Vercel):** Auto-redeploys on every `git push` to `main`. ✅

**Backend (Cloud Run):** Run this from the `server/` folder:

```bash
cd server
gcloud run deploy player-server --source . --region asia-south1 --platform managed --allow-unauthenticated --port 8080
```

Or set up **Cloud Build trigger** to auto-deploy on push:
1. Go to [https://console.cloud.google.com/cloud-build/triggers](https://console.cloud.google.com/cloud-build/triggers)
2. Click **"Create Trigger"** → connect GitHub → select `player` repo
3. Set branch to `main`, build config to `Dockerfile` in `server/`

---

## PART 7 — Custom Domain (Optional)

**Frontend (Vercel):**
1. Vercel project → **"Settings"** → **"Domains"** → add your domain
2. Add DNS records at your registrar

**Backend (Cloud Run):**
1. Cloud Run → `player-server` → **"Manage Custom Domains"**
2. Add `api.hillaryns.com` and verify domain ownership
3. Add the DNS records shown to your registrar

---

## ❓ Troubleshooting

| Problem | Fix |
|---|---|
| CORS error | Make sure `CLIENT_URL` on Cloud Run matches your exact Vercel URL (no trailing slash) |
| Login fails | Check `JWT_SECRET` is set in Cloud Run env vars |
| Upload fails | Verify all 3 Cloudinary env vars in Cloud Run env vars |
| MongoDB error | Check Atlas IP whitelist is `0.0.0.0/0` |
| Blank page on Vercel | Root Directory must be `client`, not repo root |
| Cloud Run deploy fails | Make sure `server/Dockerfile` exists and Cloud Build API is enabled |
| `gcloud` not found | Re-run `gcloud init` after installing Google Cloud CLI |
| `VITE_API_URL` not working | No trailing `/` at the end of Cloud Run URL |
| Port error on Cloud Run | Make sure `PORT=8080` in env vars and Dockerfile `EXPOSE 8080` |

---

## 📌 Summary of Deployment URLs

```
Frontend:   https://your-app.vercel.app
Backend:    https://player-server-xxxxxxxxxx-el.a.run.app
Database:   MongoDB Atlas (cloud)
Storage:    Cloudinary (cloud)
```

---

© 2026 [hillaryns](https://github.com/hillaryns) — All rights reserved.  
Maintained by [subhobhai943](https://github.com/subhobhai943).
