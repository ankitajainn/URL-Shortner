# URL Shortner

A full-stack URL shortening app. Users sign up, log in, and turn long URLs into short, shareable codes. Every account gets a personal dashboard listing all the links they've created, with one-click copy and delete.

**Live app:** https://url-shortner-ruddy-two.vercel.app/

## How it works

- Sign up / log in with email + password (password hashed with a per-user salt, not stored in plaintext).
- On login, the backend returns a JWT that the frontend keeps in `localStorage` and sends as a `Bearer` token on every authenticated request.
- Paste a long URL (optionally with a custom short code) and get back a short code, generated with `nanoid` if you don't supply your own.
- Visiting `<backend-url>/<shortCode>` looks up the target URL and redirects to it — no login required for that part.
- The dashboard lists every short code you've created and lets you delete any of them.

## Tech stack

**Backend** (`/backend`)
- Node.js + Express 5
- PostgreSQL via [Drizzle ORM](https://orm.drizzle.team/)
- `jsonwebtoken` for auth tokens, Node's built-in `crypto` (HMAC-SHA256 + salt) for password hashing
- `zod` for request validation
- `nanoid` for short code generation
- Package manager: pnpm

**Frontend** (`/frontend`)
- React 18 + Vite
- Plain `fetch`-based API client (no external HTTP library)
- Auth state persisted in `localStorage`

## Project structure

```
URL-Shortner/
├── backend/
│   ├── index.js                    # Express app entry point
│   ├── db/index.js                 # Drizzle + Postgres connection
│   ├── drizzle.config.js           # Drizzle Kit config
│   ├── docker-compose.yml          # Local Postgres for development
│   ├── models/
│   │   ├── user.model.js           # users table schema
│   │   └── url.model.js            # urls table schema
│   ├── routes/
│   │   ├── user.routes.js          # /user/signup, /user/login
│   │   └── url.routes.js           # /shorten, /codes, /:shortCode, /:id
│   ├── middlewares/
│   │   └── auth.middleware.js      # JWT parsing + route protection
│   ├── services/
│   │   └── user.service.js         # getUserByEmail
│   ├── utils/
│   │   ├── hash.js                 # password hashing (HMAC + salt)
│   │   └── token.js                # JWT sign/verify
│   └── validations/                # zod schemas
└── frontend/
    └── src/
        ├── main.jsx
        ├── App.jsx                 # switches between AuthScreen / Dashboard
        ├── api.js                  # fetch wrapper for the backend API
        └── components/
            ├── AuthScreen.jsx      # login/signup form
            └── Dashboard.jsx       # create, list, copy, delete links
```

## API reference

All routes are relative to the backend base URL.

| Method | Route            | Auth required | Description                                   |
|--------|-------------------|:--------------:|------------------------------------------------|
| POST   | `/user/signup`    | No             | Create an account                              |
| POST   | `/user/login`     | No             | Log in, returns a JWT                          |
| POST   | `/shorten`        | Yes            | Create a short URL (`{ url, code? }`)           |
| GET    | `/codes`          | Yes            | List the logged-in user's short URLs           |
| GET    | `/:shortCode`     | No             | Redirect to the original URL                    |
| DELETE | `/:id`            | Yes            | Delete a short URL owned by the logged-in user  |

Authenticated requests send `Authorization: Bearer <token>`.

## Running locally

### Backend

```bash
cd backend
pnpm install

# start a local Postgres (or point DATABASE_URL at your own instance)
docker compose up -d

# create a .env file with:
# DATABASE_URL=postgres://postgres:admin@localhost:5432/postgres
# JWT_SECRET=<any-secret-string>
# PORT=8000

pnpm db:push     # push the schema to the database
pnpm dev         # start the server with --watch
```

### Frontend

```bash
cd frontend
npm install

# create a .env file with:
# VITE_API_BASE_URL=http://localhost:8000

npm run dev
```

## Deployment

- **Frontend:** deployed on Vercel — https://url-shortner-ruddy-two.vercel.app/
- **Backend:** deployed on Render, backed by a hosted Postgres instance (Neon/Render Postgres)

## Notes

- The `authenticationMiddleware` runs globally and attaches `req.user` when a valid token is present, but only routes wrapped in `ensureAuthenticated` actually reject unauthenticated requests — so redirects (`GET /:shortCode`) stay public.
- Short codes are unique per URL row; passing your own `code` in `/shorten` lets you pick a custom slug instead of the auto-generated one.
