

# 🔗 URL Shortener API

A performant, scalable URL shortener backend built with Node.js, Drizzle ORM, and Docker. Designed with a modular architecture following the controller-service-model pattern for clear separation of concerns.

---

## 🛠 Tech Stack

* **Runtime:** Node.js
* **Package Manager:** `pnpm` (Workspace / Monorepo setup)
* **ORM:** [Drizzle ORM](https://orm.drizzle.team/) (`drizzle.config.js`)
* **Containerization:** Docker & Docker Compose
* **Validation:** Custom validation schemas / middleware

---

## 📂 Project Structure

```text
.
├── db/                   # Database connection, schemas, and migrations (Drizzle)
├── middlewares/          # Express/Node middlewares (Auth, error handlers, rate limiting)
├── models/               # Data models and type definitions
├── routes/               # API route definitions
├── services/             # Core business logic (URL generation, analytics logic, etc.)
├── utils/                # Helper functions and utilities (hash generators, logger)
├── validations/          # Request payload and parameter validation logic
├── docker-compose.yml    # Docker services config (Database, App)
├── drizzle.config.js     # Drizzle ORM configuration
├── index.js              # Application entry point
├── package.json          # Dependencies and script definitions
├── pnpm-lock.yaml        # PNPM lockfile
└── pnpm-workspace.yaml   # PNPM workspace configuration

```



* **GET** `/:shortCode`
* **Response:** Redirects (`302`) to the original long URL.
