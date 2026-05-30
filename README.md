# UrbanNode

City-maintenance reporting app. Residents submit issues, workers triage and resolve them.

Stack: **React + Vite** on the client, **Express + PostgreSQL** on the server, **Drizzle ORM** for the schema, **express-session + connect-pg-simple** for auth.

---

## Getting started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up Postgres on Neon (free, no install)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a project — name it `urbannode`
3. From the Neon dashboard, copy the "Connection string"
4. Create a `.env` file at the repo root (copy from `.env.example`)
5. Paste the Neon connection string as `DATABASE_URL=...`
6. Generate a session secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Paste it as `SESSION_SECRET=...` in `.env`

### 3. Create the tables

```bash
pnpm db:push
```

This reads `server/schema.ts` and creates the matching tables in Neon. Re-run any time you change the schema.

### 4. Seed demo data

```bash
pnpm db:seed
```

Creates two accounts and a few sample reports so the app isn't empty:
- **Resident** — `jane@example.com` / `password123`
- **Worker** — `ahmad.ali@city.gov.my` / `password123`

### 5. Start the dev servers

```bash
pnpm dev
```

This runs the Vite client (`http://localhost:5173`) and the Express API (`http://localhost:3001`) together. The client proxies `/api/*` to the API.

---

## Viewing the database

Easiest: open your project in Neon's web dashboard.

- **Tables** tab — spreadsheet view of each table
- **SQL Editor** tab — run any query

Useful queries:
```sql
SELECT id, email, full_name, role FROM users;
SELECT ref, severity, status, created_at FROM reports ORDER BY created_at DESC;
```

---

## Project layout

```
server/
  index.ts          Express app entry — session middleware, routers
  db.ts             Postgres pool + Drizzle client
  schema.ts         All table definitions (single source of truth)
  middleware.ts     requireAuth / requireWorker / requireResident
  seed.ts           Demo data script (pnpm db:seed)
  routes/
    auth.ts         POST /api/auth/{signup,signin,signout}
    me.ts           GET/PATCH /api/me
    reports.ts      GET/POST /api/reports, GET/PATCH /api/reports/:id
    notifications.ts  GET /api/notifications, POST /api/notifications/mark-all-read
    gamification.ts GET /api/gamification

src/
  components/       Layout shells, UI primitives, icons
  pages/            Route components (resident + worker shells)
  App.tsx           Routes
```

---

## Useful scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Run client + server together |
| `pnpm build` | Type-check and build the client for production |
| `pnpm lint` | ESLint on src + server |
| `pnpm db:push` | Sync schema.ts to the database |
| `pnpm db:seed` | Insert demo users + reports |

---

## What's next

- **F4** — wire the SignUp / SignIn forms to call the real backend endpoints
- Real screen content (R3–R9 and W1–W8 owners replace the route stubs in `src/pages/resident/` and `src/pages/worker/`)
