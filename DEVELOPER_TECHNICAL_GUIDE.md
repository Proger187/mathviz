# AiMath (MathViz) — Developer Technical Guide

> This document is the single source of truth for any developer joining the project.
> It describes the current state of the codebase: what is built, how it works, and what remains to be done.

---

## Table of Contents

1. [What Is This App?](#1-what-is-this-app)
2. [Tech Stack at a Glance](#2-tech-stack-at-a-glance)
3. [Repository Structure](#3-repository-structure)
4. [Getting Started](#4-getting-started)
5. [Frontend — `apps/web`](#5-frontend--appsweb)
   - [Routing](#routing)
   - [Feature Module Pattern](#feature-module-pattern)
   - [Visual Calculator System](#visual-calculator-system)
   - [Quiz System](#quiz-system)
   - [State Management](#state-management)
   - [Authentication Flow (Frontend)](#authentication-flow-frontend)
   - [Internationalisation (i18n)](#internationalisation-i18n)
   - [Accessibility](#accessibility)
6. [Backend — `apps/api`](#6-backend--appsapi)
   - [Entry Point & Middleware Stack](#entry-point--middleware-stack)
   - [Database Schema](#database-schema)
   - [API Endpoints](#api-endpoints)
   - [Authentication Flow (Backend)](#authentication-flow-backend)
   - [Gamification Logic](#gamification-logic)
   - [Error Handling](#error-handling)
   - [Security Measures](#security-measures)
7. [Shared Package — `packages/shared`](#7-shared-package--packagesshared)
8. [Code Standards & Conventions](#8-code-standards--conventions)
9. [Testing](#9-testing)
10. [Environment Variables](#10-environment-variables)
11. [Current Implementation Status](#11-current-implementation-status)

---

## 1. What Is This App?

**AiMath** (codebase name: `mathviz`) is a web-based math learning platform for students aged 8–16, with a primary focus on Kyrgyzstan and the CIS region. It solves the problem of inaccessible quality math education in rural areas by providing animated, step-by-step visual explanations of core arithmetic concepts and a gamified quiz engine.

**Core ideas:**

- Any visitor can freely explore visual calculators — no account required.
- Registered users earn XP, level up, maintain streaks, and appear on leaderboards.
- The entire UI is available in three languages: Kyrgyz (`kg`), Russian (`ru`), and English (`en`).
- The app covers the national Kyrgyz school curriculum and prepares students for the ORT exam.

---

## 2. Tech Stack at a Glance

| Layer                | Technology                                             | Why                                                                                          |
| -------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Frontend framework   | **Next.js 15** (App Router)                            | SSR for SEO pages, RSC for data-heavy pages, CSR for interactive widgets                     |
| Language             | **TypeScript 5** (strict mode everywhere)              | Type safety across the full stack                                                            |
| Styling              | **Tailwind CSS 3**                                     | Utility-first, consistent design tokens                                                      |
| Animation            | **Framer Motion** + custom SVG                         | Page/component transitions via Framer Motion; visual calculators use hand-drawn animated SVG |
| Client state         | **Zustand**                                            | Minimal global state (auth session, quiz session)                                            |
| Server data fetching | **SWR**                                                | Automatic revalidation, error handling, cache                                                |
| Backend framework    | **Express 5**                                          | Lightweight, modular REST API                                                                |
| ORM                  | **Drizzle ORM**                                        | TypeScript-first, zero runtime overhead, PostgreSQL                                          |
| Database             | **PostgreSQL 16** (Neon serverless)                    | Relational data with UUID primary keys                                                       |
| Auth                 | **JWT** (access + refresh tokens)                      | Custom implementation, no vendor lock-in                                                     |
| Validation           | **Zod** (shared between frontend and backend)          | Single source of truth for all schemas                                                       |
| Testing              | **Vitest** + **React Testing Library** + **Supertest** | Fast, ESM-native                                                                             |
| Monorepo             | **pnpm workspaces** + **Turborepo**                    | Shared types/schemas without duplication                                                     |
| Linting / Formatting | **ESLint** (flat config) + **Prettier**                | Enforced pre-commit via Husky + lint-staged                                                  |

---

## 3. Repository Structure

```
mathviz/                          ← pnpm monorepo root
├── apps/
│   ├── web/                      ← Next.js 15 frontend (port 3000)
│   └── api/                      ← Express 5 backend (port 3001)
├── packages/
│   └── shared/                   ← Zod schemas, TS types, constants (imported by both apps)
├── turbo.json                    ← Turborepo pipeline config
├── pnpm-workspace.yaml
└── package.json
```

The `shared` package is the backbone of type safety. Zod schemas and TypeScript interfaces defined there are never duplicated — both `web` and `api` import from `@mathviz/shared`.

---

## 4. Getting Started

```bash
# Install dependencies
pnpm install

# Run everything in dev mode (both frontend and backend)
pnpm dev

# Or run individually
pnpm --filter web dev        # frontend on :3000
pnpm --filter api dev        # backend on :3001

# Type check all packages
pnpm typecheck

# Run all tests
pnpm test

# Lint
pnpm lint

# Database commands (run from apps/api)
pnpm --filter api db:generate   # generate migration from schema changes
pnpm --filter api db:migrate    # apply pending migrations to the database
pnpm --filter api db:studio     # open Drizzle Studio in browser
```

> Copy `apps/api/.env.example` to `apps/api/.env` and fill in the values before running anything. The app **will crash at startup** if any required env variable is missing — this is intentional (fail-fast).

---

## 5. Frontend — `apps/web`

### Routing

Next.js **App Router** is used throughout. Route groups (folders in parentheses) share a layout without adding to the URL.

```
src/app/
├── (public)/                     ← No auth required
│   ├── page.tsx                  → / (Landing page)
│   └── calculators/[mode]/
│       └── page.tsx              → /calculators/fractions, /calculators/negative, etc.
├── (auth)/                       ← Guest-only (redirects to /dashboard if already logged in)
│   ├── login/page.tsx            → /login
│   └── register/page.tsx        → /register
└── (protected)/                  ← Requires auth (redirects to /login if not)
    ├── dashboard/page.tsx        → /dashboard
    ├── quiz/[mode]/page.tsx      → /quiz/fractions, /quiz/negative, etc.
    └── leaderboard/page.tsx     → /leaderboard
```

Route protection is **client-side** via two hooks:

- `useProtectedRoute()` — called in the `(protected)` layout. Redirects to `/login` if not authenticated.
- `useGuestRoute()` — called in the `(auth)` layout. Redirects to `/dashboard` if already authenticated.
- Both hooks do nothing while auth state is loading to prevent flash-of-redirect.

---

### Feature Module Pattern

All feature code lives in `src/features/`. Every feature follows this exact structure:

```
features/fractions/
├── components/          ← React components used only by this feature
│   ├── FractionCalculator.tsx
│   └── PizzaSlice.tsx
├── hooks/               ← Hooks used only by this feature
│   └── useFractionAnimation.ts
├── types.ts             ← TypeScript types local to this feature
├── utils.ts             ← Pure math functions (testable, no side effects)
├── utils.test.ts
└── index.ts             ← Public API — the ONLY file external code may import from
```

**Critical rule:** Code outside a feature may only import from that feature's `index.ts`. Importing directly into subdirectories (e.g. `@/features/fractions/components/PizzaSlice`) is forbidden and caught by ESLint.

Current features: `auth`, `calculators`, `fractions`, `negative`, `multiplication`, `division`, `quiz`.

---

### Visual Calculator System

This is the core of the app. Each calculator is a self-contained animated SVG widget that teaches a math concept visually.

#### `CalculatorShell` — Shared Frame

Every calculator renders inside `CalculatorShell` (`features/calculators/components/`), which provides:

- **Step navigation** — `‹` / `›` buttons to go back and forward through animation steps.
- **Text-summary toggle** — reveals a screen-reader-friendly prose description of the current step.
- **Narration region** — `<div role="status" aria-live="polite">` announces each step to screen readers.
- **Reduced motion support** — reads `prefers-reduced-motion` and skips animations if set.

#### `useStepController` Hook

All four calculators share the same step state machine:

```typescript
const { steps, currentStep, canGoBack, canGoForward, goBack, goForward, reset } =
  useStepController(steps)
```

`steps` is an `AnimationStep[]` array. Each step has an `id`, a `narrativeKey` (i18n key), and `narrativeParams` for string interpolation. The hook automatically resets to step 0 when the `steps` array changes (i.e. when the user enters new input).

#### Calculator Props Contract

All calculators accept the same props interface:

```typescript
interface CalculatorProps {
  problem?: FractionProblem | NegativeProblem | MultiplicationProblem | DivisionProblem
  onAnswer?: (isCorrect: boolean) => void
  hideResult?: boolean
  onReveal?: () => void
}
```

- **`problem` is `undefined`** → free-play mode. User controls all inputs.
- **`problem` is provided** → quiz mode. Inputs are pre-populated, result is hidden, `onAnswer` fires on submission.

#### Mode Registry

All modes are declared in `src/config/modes.ts`:

```typescript
export const MODE_REGISTRY = {
  fractions:      { id: 'fractions',      icon: '🍕', component: () => import(...) },
  negative:       { id: 'negative',       icon: '↔️',  component: () => import(...) },
  multiplication: { id: 'multiplication', icon: '⊞',  component: () => import(...) },
  division:       { id: 'division',       icon: '➗', component: () => import(...) },
}
```

Dynamic `import()` means each calculator is **code-split** — only loaded when that mode is visited. Adding a new mode requires only adding an entry here and creating a `features/<mode>/` directory.

#### The Four Calculators

| Mode             | Visual       | Key Concept                                                                                   | SVG Component                                                           |
| ---------------- | ------------ | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `fractions`      | Pizza slices | Fraction addition/subtraction with unlike denominators. Finds LCD, converts, adds, simplifies | `PizzaSlice.tsx` — full circle divided into `denominator` sectors       |
| `negative`       | Number line  | Integer addition/subtraction. Pointer jumps left or right along the line                      | `NumberLine.tsx` — horizontal SVG axis with animated pointer            |
| `multiplication` | Area grid    | Multiplication as rectangular area filled row by row                                          | `AreaGrid.tsx` — SVG grid filled progressively                          |
| `division`       | Fair share   | Division as equal distribution of items into groups                                           | `FairShareVisual.tsx` — items distributed one-per-step into group boxes |

---

### Quiz System

The quiz engine lives in `features/quiz/`. A quiz session is a sequence of 5–10 problems for a given mode.

**Problem generators** (`features/quiz/utils/`):

- One generator file per mode: `fractionProblems.ts`, `negativeProblems.ts`, `multiplicationProblems.ts`, `divisionProblems.ts`.
- All follow the same signature:
  ```typescript
  function generateProblem(difficulty: Difficulty, seed: number): [Problem, number]
  ```
- They use a **linear congruential generator** — deterministic given the same seed. This makes them fully testable and reproducible.
- `difficulty` controls numeric ranges: `easy` | `medium` | `hard`.

**Quiz UI components** (`features/quiz/components/`):

- `QuizSession.tsx` — orchestrates the full quiz flow.
- `QuizQuestion.tsx` — renders the current question.
- `QuizProgress.tsx` — progress bar showing current question / total.
- `QuizResults.tsx` — final score screen with XP earned and any new badges.
- `QuizTimer.tsx` — WCAG-compliant countdown timer with `aria-live="assertive"` announcements.
- `AnswerChoices.tsx` — multiple choice options (4 choices).
- `ProblemVisual.tsx` — renders the calculator widget in quiz mode (result hidden).

> ⚠️ **The quiz API integration is not yet wired.** The UI components exist and the API endpoints exist, but the frontend does not yet call the backend to start/submit/complete a quiz session. This is the main piece of remaining work — see [Section 11](#11-current-implementation-status).

---

### State Management

**Zustand** manages the two global client states.

#### `store/auth.store.ts`

```typescript
{
  user: SafeUser | null,
  accessToken: string | null,
  isAuthenticated: boolean,
  isLoading: boolean
}
// Actions: signIn(user, accessToken), signOut(), setLoading(bool)
```

The access token is stored in **memory only** (via `lib/token.ts`) — never in `localStorage`. This prevents XSS token theft.

#### `store/quiz-session.store.ts`

Tracks the active quiz session: session ID from the API, current question index, answers submitted so far, and total XP accumulated.

#### SWR Data Hooks

All server data beyond auth is fetched with SWR. These hooks live in `src/hooks/`:

| Hook             | Endpoint                       | Used In                |
| ---------------- | ------------------------------ | ---------------------- |
| `useAuth`        | `GET /api/v1/users/me`         | Header, dashboard      |
| `useBadges`      | `GET /api/v1/users/me/badges`  | Dashboard              |
| `useDashboard`   | `GET /api/v1/users/me`         | Dashboard stats        |
| `useQuizHistory` | `GET /api/v1/users/me/history` | Dashboard history list |
| `useLeaderboard` | `GET /api/v1/leaderboard`      | Leaderboard page       |

All SWR fetchers call `apiFetch()` from `lib/api-client.ts`, which automatically injects the `Authorization: Bearer <token>` header.

---

### Authentication Flow (Frontend)

**Login:**

1. `LoginForm` validates with `LoginSchema` (Zod) before sending.
2. `POST /api/v1/auth/login` → receives `{ user, tokens: { accessToken, refreshToken } }`.
3. `useAuthStore.signIn(user, accessToken)` stores both in memory.
4. Browser stores `refreshToken` as an HttpOnly cookie (set by the API response).
5. `router.replace('/dashboard')`.

**Register:**

1. `RegisterForm` validates with `RegisterSchema`.
2. `POST /api/v1/auth/register` → on success, auto-login is performed immediately.
3. Same flow as login from step 3 onwards.

**Token Refresh (planned):**
The SWR `onError` handler is intended to detect `AUTH_TOKEN_EXPIRED`, call `POST /api/v1/auth/refresh`, and retry the original request. This interceptor is **not yet implemented**.

---

### Internationalisation (i18n)

The i18n system is custom-built — no external library. It is a React context with zero dependencies beyond the locale JSON files.

**Files:**

```
src/i18n/
├── I18nProvider.tsx       ← React context, locale state, localStorage sync
├── getTranslation.ts      ← Pure function: dot-path lookup + interpolation + fallback
├── useTranslation.ts      ← Hook returning { t, locale, setLocale }
├── types.ts               ← TranslationDict, TranslateParams, Locale type
├── index.ts               ← Loads and re-exports all locale dicts
├── en.json                ← English (canonical, always the fallback)
├── ru.json                ← Russian
└── kg.json                ← Kyrgyz
```

**How `t()` works:**

1. Splits the key on `.` and traverses the nested dict (e.g. `quiz.correct` → `dict.quiz.correct`).
2. If key is missing in the selected locale, falls back to `en.json`.
3. If still missing, returns the raw key string and logs a `console.warn` in development.
4. Replaces `{placeholder}` tokens with values from the `params` argument.

**Locale detection order:**

1. Value stored in `localStorage`.
2. Browser language mapped: `ky`/`ky-KG` → `kg`, `ru`/`ru-RU` → `ru`, anything else → `en`.
3. Default: `en`.

**Rule:** Zero hardcoded user-facing strings in any React component. Everything goes through `t()`. This applies to button labels, `aria-label`s, error messages, quiz feedback, and empty states.

---

### Accessibility

- All interactive buttons have `focus-visible:ring-2 focus-visible:ring-indigo-500` Tailwind classes.
- `CalculatorShell` narration: `<div role="status" aria-live="polite">` — announces step text on every step change.
- `QuizTimer`: `<div aria-live="assertive" aria-atomic="true">` announces time every 10 seconds and "Time's up!" on expiry. The visual bar uses `role="progressbar"` with `aria-valuenow / aria-valuemin / aria-valuemax`.
- `LanguageSwitcher`: each button has `aria-pressed={locale === activeLocale}`.
- `useReducedMotion()`: reads `prefers-reduced-motion` media query and disables Framer Motion animations when set.
- All calculators have a text-summary mode that describes each step in plain text for screen readers.

---

## 6. Backend — `apps/api`

The backend is an **Express 5** REST API on **Node.js 20**, serving the frontend exclusively under the `/api/v1` prefix. It runs on port `3001` in development.

### Entry Point & Middleware Stack

`src/index.ts` sets up the Express app and mounts all routers. The middleware stack in order:

| Middleware                                                 | Purpose                                                                  |
| ---------------------------------------------------------- | ------------------------------------------------------------------------ |
| `helmet()`                                                 | Sets all standard secure HTTP headers (CSP, HSTS, X-Frame-Options, etc.) |
| `cors({ origin: env.FRONTEND_ORIGIN, credentials: true })` | Restricts cross-origin requests; allows cookie transmission              |
| `cookieParser()`                                           | Parses the `refreshToken` HttpOnly cookie                                |
| `express.json()`                                           | Parses JSON request bodies                                               |
| `morgan('dev')`                                            | HTTP request logging (skipped in `test` mode)                            |
| `errorHandler`                                             | Global error handler — always last                                       |

The app instance is a **named export** from `index.ts` so Supertest can import it in tests without opening a network port.

---

### Database Schema

All tables use UUIDs generated by PostgreSQL (`gen_random_uuid()`). Managed with **Drizzle ORM**.

#### `users`

| Column           | Type                 | Notes                                  |
| ---------------- | -------------------- | -------------------------------------- |
| `id`             | uuid PK              |                                        |
| `email`          | text UNIQUE NOT NULL | Login credential                       |
| `password_hash`  | text NOT NULL        | bcrypt hash, never returned to client  |
| `username`       | text UNIQUE NOT NULL | Display name                           |
| `xp`             | integer DEFAULT 0    | Cumulative experience points           |
| `level`          | integer DEFAULT 1    | Stored (not derived) for fast queries  |
| `streak`         | integer DEFAULT 0    | Consecutive days with a completed quiz |
| `last_quiz_date` | date                 | Used to compute streak deltas          |
| `created_at`     | timestamptz          |                                        |

#### `refresh_tokens`

| Column       | Type                        | Notes                                                |
| ------------ | --------------------------- | ---------------------------------------------------- |
| `id`         | uuid PK                     |                                                      |
| `user_id`    | uuid FK → users(id) CASCADE |                                                      |
| `token_hash` | text NOT NULL               | SHA-256 hash of the raw token — not the token itself |
| `expires_at` | timestamptz NOT NULL        | 7-day TTL                                            |

#### `quiz_sessions`

| Column            | Type                 | Notes                                                         |
| ----------------- | -------------------- | ------------------------------------------------------------- |
| `id`              | uuid PK              |                                                               |
| `user_id`         | uuid FK → users(id)  |                                                               |
| `mode`            | text NOT NULL        | `'fractions' \| 'negative' \| 'multiplication' \| 'division'` |
| `difficulty`      | text NOT NULL        | `'easy' \| 'medium' \| 'hard'`                                |
| `score`           | integer NOT NULL     | Total XP earned in the session                                |
| `total_questions` | integer NOT NULL     |                                                               |
| `correct_answers` | integer NOT NULL     |                                                               |
| `completed_at`    | timestamptz NOT NULL |                                                               |

#### `quiz_answers`

| Column           | Type                           | Notes                  |
| ---------------- | ------------------------------ | ---------------------- |
| `id`             | uuid PK                        |                        |
| `session_id`     | uuid FK → quiz_sessions(id)    |                        |
| `question_index` | integer NOT NULL               |                        |
| `is_correct`     | boolean NOT NULL               |                        |
| `used_hint`      | boolean NOT NULL DEFAULT false |                        |
| `time_taken_ms`  | integer NOT NULL               | Milliseconds to answer |

#### `badges`

| Column        | Type          | Notes                                  |
| ------------- | ------------- | -------------------------------------- |
| `id`          | text PK       | Slug e.g. `'first_quiz'`, `'streak_7'` |
| `name`        | text NOT NULL |                                        |
| `description` | text NOT NULL |                                        |
| `icon`        | text NOT NULL | Emoji or icon identifier               |

#### `user_badges`

| Column       | Type                 | Notes                      |
| ------------ | -------------------- | -------------------------- |
| `user_id`    | uuid FK → users(id)  | Composite PK with badge_id |
| `badge_id`   | text FK → badges(id) |                            |
| `awarded_at` | timestamptz NOT NULL |                            |

---

### API Endpoints

All routes are prefixed `/api/v1`.

#### Auth — `/api/v1/auth`

| Method | Path        | Auth            | Description                                               |
| ------ | ----------- | --------------- | --------------------------------------------------------- |
| POST   | `/register` | —               | Create account; returns SafeUser                          |
| POST   | `/login`    | —               | Returns `{ user, tokens: { accessToken, refreshToken } }` |
| POST   | `/refresh`  | HttpOnly cookie | Rotates refresh token; returns new pair                   |
| POST   | `/logout`   | Bearer          | Deletes all refresh tokens for the user                   |

#### Users — `/api/v1/users`

| Method | Path          | Auth   | Description                               |
| ------ | ------------- | ------ | ----------------------------------------- |
| GET    | `/me`         | Bearer | Own profile (SafeUser — no password hash) |
| GET    | `/me/badges`  | Bearer | All earned badges                         |
| GET    | `/me/history` | Bearer | Last 10 quiz sessions                     |

#### Quiz — `/api/v1/quiz` ⚠️ Not yet implemented

| Method | Path                   | Auth   | Description                              |
| ------ | ---------------------- | ------ | ---------------------------------------- |
| POST   | `/start`               | Bearer | Creates quiz session, returns problems   |
| POST   | `/:sessionId/answer`   | Bearer | Submit one answer, returns feedback + XP |
| POST   | `/:sessionId/complete` | Bearer | Finalise session, triggers gamification  |

#### Leaderboard — `/api/v1/leaderboard`

| Method | Path | Auth | Description                  |
| ------ | ---- | ---- | ---------------------------- |
| GET    | `/`  | —    | Weekly top-10 by XP (public) |

#### Health

| Method | Path      | Description                                                 |
| ------ | --------- | ----------------------------------------------------------- |
| GET    | `/health` | Returns `{ status: 'ok', env }` — use for uptime monitoring |

---

### Authentication Flow (Backend)

**Registration (`POST /auth/register`):**

1. Request validated against `RegisterSchema` (email, username, password).
2. Email and username uniqueness checked separately — returns distinct error codes (`AUTH_EMAIL_TAKEN` / `AUTH_USERNAME_TAKEN`).
3. Password hashed with bcrypt (`BCRYPT_ROUNDS` iterations, default 12).
4. User row inserted; `SafeUser` (no `password_hash`) returned.

**Login (`POST /auth/login`):**

1. Validated against `LoginSchema`.
2. Looks up by email. Returns identical error `AUTH_INVALID_CREDENTIALS` for "user not found" and "wrong password" — prevents email enumeration attacks.
3. Signs an **access token** (JWT, 15 min) and **refresh token** (JWT, 7 days).
4. The raw refresh token is **SHA-256 hashed** before storage — a database breach exposes nothing usable.
5. Refresh token is also set as an `HttpOnly; SameSite=Strict` cookie.

**Token Rotation (`POST /auth/refresh`):**

1. Reads `refreshToken` from the HttpOnly cookie.
2. Verifies JWT signature; looks up hash in `refresh_tokens`; checks expiry.
3. **Deletes the old token** (one-time use).
4. Issues a fresh access + refresh pair, stores new hash.

**Logout (`POST /auth/logout`):**

1. Requires valid Bearer access token.
2. Deletes **all** `refresh_tokens` rows for the user (logs out all devices).
3. Clears the `refreshToken` cookie.

---

### Gamification Logic

All gamification logic lives in `modules/gamification/`.

#### XP Formula — `gamification.utils.ts`

```
xp = base_xp × correctness_multiplier + speed_bonus

base_xp:
  correct without hint  → 10
  correct with hint     → 5
  wrong                 → 0

speed_bonus (time_taken / time_limit):
  ≤ 25%  → +5 XP
  ≤ 50%  → +3 XP
  ≤ 75%  → +1 XP
  > 75%  → +0 XP
```

#### Level Thresholds

```
Level 1 (Novice):     0 XP
Level 2 (Apprentice): 100 XP
Level 3 (Scholar):    300 XP
Level 4 (Master):     700 XP
Level 5 (Champion):   1500 XP

threshold(n) = 100 × n^1.5
```

#### Streak Logic — `updateStreak(lastQuizDate, now)`

Returns one of three signals:

- `0` — same day as last quiz, no change.
- `1` — next consecutive day, increment streak.
- `-1` — gap of more than one day, reset streak to 1.

#### Applying Quiz Completion — `applyQuizCompletion(userId, xpEarned, completedAt)`

Reads current user state, computes new XP / level / streak in a single transaction, writes all three back atomically.

#### Badge Awarding — `checkAndAwardBadges(userId, context)`

Evaluates badge eligibility rules against the current user state (XP milestones, streak milestones, quiz count thresholds) and inserts into `user_badges` with `ON CONFLICT DO NOTHING` — fully idempotent.

Current badge definitions (seed data in `db/seed.ts`):

- `first_quiz` — Completed your first quiz.
- `streak_7` — 7-day streak.
- `perfect_fractions` — 100% on a fractions quiz.
- `xp_100`, `xp_500`, `xp_1000` — XP milestones.

---

### Error Handling

All errors are typed via `ApiErrorCode` from `@mathviz/shared`. The frontend maps these codes to translated UI messages.

| Code                       | HTTP | Meaning                            |
| -------------------------- | ---- | ---------------------------------- |
| `AUTH_EMAIL_TAKEN`         | 409  | Email already registered           |
| `AUTH_USERNAME_TAKEN`      | 409  | Username already taken             |
| `AUTH_INVALID_CREDENTIALS` | 401  | Wrong email or password            |
| `AUTH_TOKEN_EXPIRED`       | 401  | Access token expired               |
| `AUTH_TOKEN_INVALID`       | 401  | Malformed or unverifiable token    |
| `QUIZ_SESSION_NOT_FOUND`   | 404  | Session ID does not exist          |
| `QUIZ_ALREADY_COMPLETED`   | 409  | Session already finalised          |
| `VALIDATION_ERROR`         | 422  | Request body failed Zod validation |
| `NOT_FOUND`                | 404  | Route does not exist               |
| `INTERNAL_ERROR`           | 500  | Unexpected server error            |

The global `errorHandler` middleware handles three types:

- `AppError` instances → maps to the HTTP status from `STATUS_MAP`.
- `ZodError` instances → 422 with the issues array.
- Unknown errors → 500 with opaque message; full stack logged only in non-production.

---

### Security Measures

- **Helmet** sets all standard secure HTTP headers.
- **bcrypt** (cost factor 12) for password storage.
- **SHA-256 refresh token hashing** — raw token never persisted.
- **Email enumeration prevention** — identical error for missing user and wrong password.
- **CORS** locked to `FRONTEND_ORIGIN`; credentials only allowed from that origin.
- **Rate limiting** on auth endpoints: 5 requests / 15 min per IP.
- **Zod validation** on all request bodies before they reach business logic.
- **HttpOnly + SameSite=Strict** cookie for refresh tokens — not accessible to JavaScript.
- **Email masking in logs** — any string containing an email is replaced with `[email]` before writing to logs.
- **`pnpm audit`** runs in CI on every push.

---

## 7. Shared Package — `packages/shared`

Imported by both `apps/web` and `apps/api` as `@mathviz/shared`. Contains everything that must be consistent across the stack.

```
packages/shared/src/
├── schemas/
│   ├── auth.ts          ← RegisterSchema, LoginSchema, RefreshTokenSchema
│   ├── quiz.ts          ← StartQuizSchema, SubmitAnswerSchema
│   └── errors.ts        ← ApiErrorCode union type
├── constants/
│   ├── modes.ts         ← MODES registry, ModeId type
│   ├── difficulty.ts    ← DIFFICULTY constant, Difficulty type
│   ├── locales.ts       ← LOCALES array, Locale type, DEFAULT_LOCALE
│   └── xp.ts           ← BASE_XP, CORRECTNESS_MULTIPLIER, SPEED_BONUS_THRESHOLDS, levelThreshold()
└── types/
    └── calculator.ts    ← CalculatorMode, AnimationStep, CalculatorProps interfaces
```

**Key rule:** TypeScript types that cross the API boundary are always inferred from Zod schemas with `z.infer<typeof Schema>`. Never hand-write a type that duplicates a schema.

---

## 8. Code Standards & Conventions

### Naming

| Thing                    | Convention                                 | Example                         |
| ------------------------ | ------------------------------------------ | ------------------------------- |
| React component          | PascalCase                                 | `FractionCalculator`            |
| Hook                     | camelCase, `use` prefix                    | `useFractionAnimation`          |
| Zustand store            | camelCase, `use` prefix                    | `useAuthStore`                  |
| Zod schema               | PascalCase + `Schema` suffix               | `StartQuizSchema`               |
| API router               | camelCase + `Router` suffix                | `quizRouter`                    |
| Database table (Drizzle) | camelCase                                  | `quizSessions`                  |
| Module-level constant    | SCREAMING_SNAKE_CASE                       | `MAX_QUIZ_QUESTIONS`            |
| Boolean prop/variable    | Prefixed with `is`, `has`, `can`, `should` | `isAuthenticated`, `hideResult` |

No abbreviations except: `id`, `url`, `jwt`, `xp`, `px`, `gcd`, `lcm`.

### TypeScript Rules

- `any` is **forbidden** — use `unknown` with a type guard or `never` for exhaustive switches.
- Explicit return types on all **exported** functions.
- `enum` is **banned** — use `as const` objects + union types.
- `noUncheckedIndexedAccess` is on — `arr[0]` returns `T | undefined`, always check first.

### React Rules

- Default to **React Server Components**. Add `'use client'` only when the component needs `useState`, `useEffect`, browser APIs, Framer Motion, or event handlers.
- Always **destructure props** in the function signature — never `props.x` inside the body.
- **No inline `style` objects** on HTML elements — use Tailwind utilities or direct SVG attributes for dynamic geometry.
- Never use array index as a React key on a reorderable list.
- No `useEffect` + `fetch` — use **SWR** for data fetching.

### Backend Rules

- **Routers are thin** — validate input, call one service function, return result. No business logic in routers.
- **Services never touch `req` or `res`** — receive typed arguments, return typed data, throw `AppError`.
- All async route handlers pass errors to `next(err)` — never respond with a 500 directly.
- All database queries go through Drizzle. No raw SQL except in migration files.
- Use `db.transaction()` for any operation requiring multiple atomic writes.

### Commit Format (Conventional Commits)

```
<type>(<scope>): <short description>

Types: feat, fix, docs, style, refactor, test, chore, perf
Scopes: fractions, auth, quiz, db, gamification, i18n, ...

Examples:
feat(fractions): add LCD step animation to pizza calculator
fix(auth): correct refresh token rotation race condition
test(negative): add edge cases for minimum integer range
```

### Pre-commit Hooks (Husky + lint-staged)

On every commit, the following run automatically:

1. `tsc --noEmit` across all workspaces.
2. `eslint` on staged `.ts` and `.tsx` files.
3. `prettier --write` on staged files.

A commit that fails any of these is **rejected**.

---

## 9. Testing

### Frontend Tests — Vitest + React Testing Library

**101 tests, all passing.**

| File                                             | Tests | Coverage                                                                                                              |
| ------------------------------------------------ | ----- | --------------------------------------------------------------------------------------------------------------------- |
| `i18n/getTranslation.test.ts`                    | 8     | Nested key lookup, dot-path, interpolation, English fallback, missing key → echo key, dev warning                     |
| `i18n/I18nProvider.test.tsx`                     | 8     | Default locale, `setLocale`, button click, localStorage persistence, outside-provider error, browser locale detection |
| `features/auth/LoginForm.test.tsx`               | 3     | Renders fields, submits correct payload, shows translated error                                                       |
| `features/auth/RegisterForm.test.tsx`            | 3     | Renders fields, submits + auto-login, shows `AUTH_EMAIL_TAKEN` error                                                  |
| `components/layout/LanguageSwitcher.test.tsx`    | 3     | Renders EN/RU/КЫР, `aria-pressed` on active, click updates state                                                      |
| `features/fractions/FractionCalculator.test.tsx` | 6     | SVG renders, calculate button, reveal button (quiz mode), `onAnswer` callback, result hidden in quiz mode             |
| `features/fractions/utils.test.ts`               | ✓     | Fraction math: addFractions, subtractFractions, lcm, toMixed                                                          |
| `features/negative/utils.test.ts`                | ✓     | Number line math utilities                                                                                            |
| `features/multiplication/utils.test.ts`          | ✓     | Grid geometry, cell sizing, partial products                                                                          |
| `features/division/utils.test.ts`                | ✓     | Fair-share distribution                                                                                               |

Framer Motion is mocked in all component tests — animated wrappers are replaced with plain DOM elements.

### Backend Tests — Vitest + Supertest

**40 tests, all passing.**

| File                         | Tests | Coverage                                                                                         |
| ---------------------------- | ----- | ------------------------------------------------------------------------------------------------ |
| `auth.router.test.ts`        | 8     | Register (success + duplicate email), login (success + wrong password), refresh rotation, logout |
| `users.router.test.ts`       | 6     | GET /me, /me/badges, /me/history — 401 (no token) and 200 (valid Bearer)                         |
| `leaderboard.router.test.ts` | 3     | 200 with array, empty array, no auth required                                                    |
| `gamification.utils.test.ts` | 23    | All branches of computeXp, levelFromXp, didLevelUp, updateStreak                                 |

Service functions are mocked with `vi.mock(...)` — tests exercise router + middleware in isolation without a database connection.

### Coverage Targets

- 100% line coverage on `packages/shared/src/`.
- 100% line coverage on all math utils in `features/*/utils.ts`.
- 80% line coverage on `apps/api/src/modules/`.

---

## 10. Environment Variables

All variables are validated at startup via Zod (`apps/api/src/config/env.ts`). The process exits immediately if any required variable is missing or malformed.

### Backend (`apps/api/.env`)

| Variable             | Type                                | Description                                      |
| -------------------- | ----------------------------------- | ------------------------------------------------ |
| `NODE_ENV`           | `development \| test \| production` | Default: `development`                           |
| `PORT`               | number                              | Default: `3001`                                  |
| `DATABASE_URL`       | URL string                          | PostgreSQL connection string (Neon serverless)   |
| `JWT_ACCESS_SECRET`  | string ≥32 chars                    | Signs 15-minute access tokens                    |
| `JWT_REFRESH_SECRET` | string ≥32 chars                    | Signs 7-day refresh tokens                       |
| `BCRYPT_ROUNDS`      | number 10–14                        | Default: `12`                                    |
| `FRONTEND_ORIGIN`    | URL string                          | Allowed CORS origin e.g. `http://localhost:3000` |

### Frontend (`apps/web/.env.local`)

| Variable              | Description                              |
| --------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend URL e.g. `http://localhost:3001` |

---

## 11. Current Implementation Status

### ✅ Complete and Working

**Shared package:**

- Zod schemas for auth and quiz.
- API error codes, mode constants, difficulty constants, locale constants.
- XP/level formula constants and `levelThreshold()` function.
- Calculator TypeScript types.

**Backend:**

- Full project scaffolding (pnpm monorepo, Turborepo, ESLint, Prettier, Husky).
- All 6 database tables defined in Drizzle schema.
- Environment variable validation.
- Library layer: `AppError`, `jwt`, `bcrypt`, `logger` with email masking.
- All middleware: `authenticate`, `validate`, `rateLimiter`, `errorHandler`.
- Full auth module: register, login, refresh token rotation, logout.
- Users module: `/me`, `/me/badges`, `/me/history`.
- Leaderboard module: public weekly top-10.
- Gamification: XP formula, level thresholds, streak logic, DB service, badge awarding.
- Full test suite (40 tests).
- Security hardening: Helmet, CORS, rate limiting, token hashing, email masking.

**Frontend:**

- Next.js 15 App Router, TypeScript strict, Tailwind, Vitest.
- Full design system: `Button`, `Input`, `Card`, `Badge`, `Modal`, `Spinner`.
- Layout components: `Header`, `Footer`, `LanguageSwitcher`.
- Custom i18n system with full locale files for `en`, `ru`, `kg`.
- Auth Zustand store, API client, route protection hooks.
- Login and Register forms with translated error messages.
- All 4 visual calculators: Fractions (pizza SVG), Negative Numbers (number line SVG), Multiplication (area grid SVG), Division (fair-share SVG).
- Quiz problem generators (seeded deterministic) for all 4 modes × 3 difficulty levels.
- `QuizTimer` with WCAG-compliant `aria-live` announcements.
- Dashboard page (renders with placeholder data until quiz API is wired).
- Leaderboard page.
- Landing page with embedded live calculator demos.
- Full test suite (101 tests).

---

### ❌ Not Yet Implemented — Remaining Work

| Item                                   | Priority            | Details                                                                                                                                                     |
| -------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Quiz API endpoints**                 | 🔴 High             | `POST /quiz/start`, `POST /quiz/:id/answer`, `POST /quiz/:id/complete` — router and service wiring needed. The data model and gamification logic are ready. |
| **Quiz frontend ↔ API integration**    | 🔴 High             | Wire `QuizSession.tsx` to the API. Start session on mount, submit answers, complete session, show final XP and badge results.                               |
| **Token refresh interceptor**          | 🟡 Medium           | SWR `onError` handler that detects `AUTH_TOKEN_EXPIRED`, calls `/auth/refresh`, and retries the failed request transparently.                               |
| **Database migration execution**       | 🟡 Medium           | Schema is defined. Run `pnpm --filter api db:generate` and `db:migrate` against a real database to create the tables.                                       |
| **Badge seed data**                    | 🟡 Medium           | `db/seed.ts` exists but has not been run against the database.                                                                                              |
| **Level-up / badge unlock animations** | 🟢 Low              | Data model supports it. Celebration animation components not yet built.                                                                                     |
| **Sound effects**                      | 🟢 Low              | `quiz-session.store.ts` has a `soundEnabled` flag but no audio is implemented.                                                                              |
| **Google OAuth**                       | 🟢 Low              | Scaffolded in design but not implemented.                                                                                                                   |
| **Dashboard data population**          | Blocked by quiz API | Dashboard renders but shows placeholder data until quiz sessions can be written to the DB.                                                                  |

---

_Last updated: May 2026. Generated from full codebase analysis._
