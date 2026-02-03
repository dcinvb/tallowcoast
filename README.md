# Tallow Coast

Landing page and email waitlist for Tallow Coast — natural skin care from grass-fed beef tallow.

## Structure

- **client/** — React (Vite) landing page: header, hero, value block, and waitlist form.
- **server/** — Express API: `POST /api/waitlist` stores emails in a JSON file (with optional env-driven path).

## Run locally

1. **Install dependencies**

   ```bash
   npm install --prefix client
   npm install --prefix server
   ```

2. **Start the API** (terminal 1)

   ```bash
   npm run dev:server
   ```

   Listens on http://localhost:3001 by default.

3. **Start the frontend** (terminal 2)

   ```bash
   npm run dev:client
   ```

   Open http://localhost:5173. The Vite dev server proxies `/api` to the backend, so the waitlist form works without extra config.

## Environment

- **Client** — See [client/.env.example](client/.env.example). Set `VITE_API_URL` in production if the API is on a different origin.
- **Server** — See [server/.env.example](server/.env.example). `PORT` and `CORS_ORIGIN` for deployment.

## Production

**Option A — Single server**

1. Build the client: `npm run build` (builds into `client/dist`).
2. Serve `client/dist` from Express (e.g. `express.static('client/dist')`) and keep the API routes. Run one process with `npm run start` from the server.

**Option B — Separate frontend and backend**

1. Deploy the client (e.g. Vercel, Netlify) with `VITE_API_URL` set to your API base URL.
2. Deploy the server (e.g. Railway, Render) and set `CORS_ORIGIN` to your frontend URL.

Waitlist emails are stored in `server/data/waitlist.json` by default (create `server/data/` if needed). You can switch to a database later by changing the server to read/write from `DATA_FILE` or a DB.
