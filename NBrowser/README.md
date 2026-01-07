# Nika Browser (NBrowser) — Phase 1: Foundation & Infrastructure

Monorepo foundation for **desktop (Electron)** + **web (Next.js)** + **backend API (Express)** with **PostgreSQL (Prisma)** and **JWT auth**.

## Monorepo layout

```
NBrowser/
  desktop/   # Electron + React + TS
  web/       # Next.js 15 + React 19 + TS
  backend/   # Express API + Prisma + JWT
  prisma/    # Shared Prisma schema + migrations
```

## Quick start

1. Start infrastructure:

```bash
cd NBrowser
docker compose up -d
```

2. Configure env files:

- `backend/.env.example` → `backend/.env`
- `web/.env.local.example` → `web/.env.local`

3. Install dependencies (choose one workspace-aware package manager):

```bash
cd NBrowser
npm install
```

4. Run Prisma migration + generate client:

```bash
npm run db:migrate
npm run db:generate
```

5. Start backend + web:

```bash
npm run dev:backend
npm run dev:web
```

- Web: http://localhost:3000
- API: http://localhost:4000

6. Start desktop app:

```bash
npm run dev:desktop
```

## Documentation

- [SETUP.md](./SETUP.md)
- [API.md](./API.md)
