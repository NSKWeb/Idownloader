# Setup

## Prerequisites

- Node.js 20+
- Docker + Docker Compose

## 1) Infrastructure (Postgres + Redis)

```bash
cd NBrowser
docker compose up -d
```

Default ports:
- Postgres: `5432`
- Redis: `6379`

## 2) Environment variables

### Backend

Copy:

```bash
cp backend/.env.example backend/.env
```

### Web

Copy:

```bash
cp web/.env.local.example web/.env.local
```

## 3) Install dependencies

From `NBrowser/`:

```bash
npm install
```

## 4) Database

```bash
npm run db:migrate
npm run db:generate
```

## 5) Run

### Backend

```bash
npm run dev:backend
```

### Web

```bash
npm run dev:web
```

### Desktop

```bash
npm run dev:desktop
```

## 6) Test

```bash
npm test
```
