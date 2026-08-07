# snip:// — URL shortener frontend

A React (Vite) frontend for your Express + Drizzle URL shortener backend.

## What it does

- Sign up / log in against `/user/signup` and `/user/login`
- Shorten a URL (with an optional custom code) via `POST /shorten`
- List your links via `GET /codes`
- Copy a short link or delete it (`DELETE /:id`)
- Stores the JWT in `localStorage` so you stay logged in across refreshes

## Setup

```bash
pnpm install   # or npm install / yarn
cp .env.example .env
```

`.env` controls which backend the app talks to:

```
VITE_API_BASE_URL=https://url-shortner-la4f.onrender.com
```

Point it at `http://localhost:8000` while developing against a local backend instead.

## Run locally

```bash
pnpm dev
```

Opens at `http://localhost:5173`.

## Build for production

```bash
pnpm build
pnpm preview   # sanity-check the production build locally
```

The build output lands in `dist/`.

## Deploying

Any static host works (Vercel, Netlify, Render static site, GitHub Pages):

1. Set the build command to `pnpm build` (or `npm run build`) and the output directory to `dist`.
2. Set the environment variable `VITE_API_BASE_URL` to your deployed backend
   (`https://url-shortner-la4f.onrender.com`) in the host's dashboard.
3. Deploy.

## Notes on your backend

- Your Render free-tier instance sleeps when idle, so the first request after a
  while can take 20–50 seconds. The app shows a friendly message if a request
  times out or fails to connect rather than a blank error.
- Neon is only used by the backend (via `DATABASE_URL`) — the frontend never
  talks to Postgres directly, so nothing here needs your Neon connection string.
- CORS on the backend currently allows `origin: '*'`, so this frontend can be
  hosted anywhere without extra backend changes.
