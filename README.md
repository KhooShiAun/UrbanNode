# UrbanNode — Smart City Maintenance Tracker

SWE3024 Code Camp | Group 2 | Sunway University

---

## Getting Started

**Step 1 — Clone the repo**

```bash
git clone [repo URL]
cd UrbanNode
```

**Step 2 — Install dependencies**

```bash
pnpm install
```

**Step 3 — Create a `.env` file inside the root folder**

- Copy `.env.example` to `.env`
- Ask the team lead for the `DATABASE_URL` value
- Set `SESSION_SECRET` to any random string
- Leave `GEMINI_API_KEY` blank for now

**Step 4 — Run the project**

```bash
pnpm dev
```

- Client runs at http://localhost:5173
- Server runs at http://localhost:3001

**Step 5 — Sign in with a demo account**

| Role       | Name              | Email              | Password |
| ---------- | ----------------- | ------------------ | -------- |
| Resident 1 | Resident Number 1 | resident1@demo.com | demo1234 |
| Resident 2 | Resident Number 2 | resident2@demo.com | demo1234 |
| Worker 1   | Worker Number 1   | worker1@demo.com   | demo1234 |
| Worker 2   | Worker Number 2   | worker2@demo.com   | demo1234 |

---

## ⚠️ Important Rules

> **DO NOT run `pnpm db:push` or `pnpm db:seed`.**
> These commands wipe the shared database. Team lead only.

> **DO NOT commit your `.env` file.**
> It is already in `.gitignore`. Never paste `DATABASE_URL` into code.

> **DO NOT work directly on `main`.**
> Always create a branch first. Follow the Git workflow guide.

---

## Where to Find Your Screen

Your assigned screen is a placeholder stub. Find your file here:

- City Resident screens → `src/pages/resident/`
- City Worker screens → `src/pages/worker/`

Build your screen inside your assigned file.
