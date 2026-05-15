# Local Testing Guide (`localtest.md`)

Follow these steps to run the **Player** app completely on your local machine for development or testing.

---

## 1. Clone the repository

```bash
git clone https://github.com/subhobhai943/player.git
cd player
```

This creates a `player/` folder with separate `client/` (frontend) and `server/` (backend) directories.[cite:1]

---

## 2. Prepare environment variables

1. Copy the example environment file into the `server` folder:

   ```bash
   cd server
   cp ../.env.example .env
   ```

2. Open `server/.env` in your editor and fill in the values:

   - `PORT=5000` (or any free port)
   - `MONGO_URI=mongodb://localhost:27017/player`
   - `JWT_SECRET` a long random string
   - `JWT_EXPIRES_IN=7d`
   - `CLIENT_URL=http://localhost:5173`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` from your Cloudinary dashboard.[cite:2]

> MongoDB must be running locally (or use a MongoDB Atlas URI) for the backend to start.[cite:2]

---

## 3. Install dependencies

From the repo root, install backend and frontend dependencies.

### Backend (server)

```bash
cd server
npm install
```

### Frontend (client)

```bash
cd ../client
npm install
```

This downloads all Node dependencies for both the Express API and the React/Vite app.[cite:2]

---

## 4. Run the development servers

You must run **backend** and **frontend** in parallel in separate terminals.

### 4.1 Start the backend API

From `player/server`:

```bash
cd server   # if you are not already here
npm run dev
```

- The API will listen on `http://localhost:5000` by default.[cite:2]

### 4.2 Start the frontend

Open a second terminal, then from the project root:

```bash
cd client
npm run dev
```

- Vite will start the React app on `http://localhost:5173`.
- Open the printed URL in your browser to view the app.[cite:2]

---

## 5. Seed demo data (optional but recommended)

To quickly get playable songs and albums in your local DB:

```bash
cd server      # from project root: cd server
npm run seed
```

This inserts demo albums and songs into MongoDB so the UI is fully usable without manual uploads.[cite:2]

---

## 6. Verify everything is working

Once both servers are running:

1. Visit `http://localhost:5173` in your browser.
2. Register a test user account.
3. Login and try:
   - Playing a demo song.
   - Liking/unliking songs.
   - Creating a playlist.
   - Exploring albums and search.

If these work, your local setup is successful.[cite:2]

---

## 7. Common issues

- **Blank UI or network errors in browser**  
  Check that `npm run dev` is running in both `server` and `client` terminals.

- **`ECONNREFUSED` or `Failed to connect to MongoDB`**  
  Ensure MongoDB is running locally and that `MONGO_URI` in `.env` is correct.

- **Cloudinary upload failures**  
  Verify Cloudinary credentials in `.env` and make sure the account is active.[cite:2]

If you still face issues, open a GitHub issue on the repo with logs and environment details.
