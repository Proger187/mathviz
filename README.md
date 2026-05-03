# MathViz

Interactive math learning platform with animated visual calculators and a gamified quiz system.

## Monorepo Structure

```
mathviz/
├── apps/
│   ├── web/        # Next.js 15 frontend (App Router, Tailwind CSS, Framer Motion)
│   └── api/        # Express 5 backend (Drizzle ORM, PostgreSQL, JWT auth)
├── packages/
│   └── shared/     # @mathviz/shared — Zod schemas, TypeScript types, constants
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Prerequisites

| Tool       | Minimum Version          |
| ---------- | ------------------------ |
| Node.js    | 20                       |
| pnpm       | 10                       |
| PostgreSQL | 16 (for API development) |

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example apps/api/.env
# Edit apps/api/.env with your DATABASE_URL and JWT secrets
```

### 3. Run the development servers

```bash
pnpm dev
```

This starts both the Next.js dev server (`http://localhost:3000`) and the Express API server (`http://localhost:3001`) simultaneously via Turborepo.

## Available Scripts

| Command          | Description                                |
| ---------------- | ------------------------------------------ |
| `pnpm dev`       | Start all dev servers in parallel          |
| `pnpm build`     | Build all apps and packages for production |
| `pnpm typecheck` | Run `tsc --noEmit` across all workspaces   |
| `pnpm lint`      | Run ESLint across all workspaces           |
| `pnpm test`      | Run Vitest across all workspaces           |
| `pnpm format`    | Format all files with Prettier             |

## Workspace Descriptions

### `apps/web`

Next.js 15 frontend using the App Router. Tailwind CSS for styling, Framer Motion for animations, Zustand for client state, SWR for server data fetching. Supports three locales: Kyrgyz (`kg`), Russian (`ru`), English (`en`).

### `apps/api`

Express 5 REST API. Drizzle ORM over PostgreSQL 16. JWT access + refresh token auth, Zod request validation, structured error handling. All endpoints under `/api/v1`.

### `packages/shared`

Internal package (`@mathviz/shared`) imported by both apps. Contains Zod schemas, TypeScript interfaces, error code constants, mode/difficulty/locale constants, and shared utilities. This is the single source of truth for data contracts.

## Database Setup

```bash
# Generate migration files from schema
pnpm --filter api db:generate

# Apply migrations to the database
pnpm --filter api db:migrate

# Open Drizzle Studio (browser-based DB viewer)
pnpm --filter api db:studio
```

## Testing

Tests are colocated with source files and use Vitest across all workspaces.

```bash
# Run all tests
pnpm test

# Run tests for a specific workspace
pnpm --filter @mathviz/shared test
pnpm --filter api test
pnpm --filter web test
```

**Test coverage summary:**
- `packages/shared` — 19 tests (schemas, constants, error codes)
- `apps/api` — 40 tests (auth, users, leaderboard routers; gamification utils)
- `apps/web` — 101 tests (i18n, auth forms, calculators, language switcher)
