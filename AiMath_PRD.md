# AiMath — Product Requirements Document

> Gamified Math Learning Platform for Ages 8–16
> **Version:** 1.0 — Initial Release | **Last Updated:** May 2026 | **Region:** Kyrgyzstan & CIS | **Status:** In Development — Quiz API integration remaining

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [User Roles & Access Model](#2-user-roles--access-model)
3. [Navigation & Layout](#3-navigation--layout)
4. [Complete Page Flows](#4-complete-page-flows)
5. [Visual Calculator System](#5-visual-calculator-system)
6. [Quiz Engine](#6-quiz-engine)
7. [Gamification System](#7-gamification-system)
8. [API Specification](#8-api-specification)
9. [Data Model](#9-data-model)
10. [Accessibility Requirements](#10-accessibility-requirements)
11. [Security Requirements](#11-security-requirements)
12. [Internationalisation (i18n)](#12-internationalisation-i18n)
13. [Remaining Work & Priority](#13-remaining-work--priority)
14. [Tech Stack Reference](#14-tech-stack-reference)

---

## 1. Product Overview

AiMath is a web-based mathematics learning platform that combines animated step-by-step visual explanations with a gamified quiz engine. It is built specifically for students in Kyrgyzstan and the broader CIS region, with the goal of making quality math education accessible in areas where qualified teachers are scarce.

The platform covers the core Kyrgyz national school curriculum and helps students prepare for the ORT (national standardised exam). The entire product is available in three languages: Kyrgyz (`kg`), Russian (`ru`), and English (`en`).

### 1.1 Problem Statement

- Rural areas in Kyrgyzstan and Central Asia lack qualified math teachers.
- Existing online resources are predominantly English-only and not curriculum-aligned.
- Abstract arithmetic is difficult for young learners without visual, hands-on explanations.
- No engaging, gamified platform exists in Kyrgyz or Russian for this age group.

### 1.2 Solution

- Free, public visual calculators — no account needed — that teach concepts through animated SVG.
- A quiz engine that generates problems, tracks answers, and awards XP.
- A full gamification layer: XP, levels, streaks, badges, leaderboards.
- Full localisation in Kyrgyz, Russian, and English.

### 1.3 Core Philosophy

- **Explore freely without signing up.** The visual calculators are always public.
- **Sign up to compete, progress, and be recognised.** The leaderboard and quiz engine require an account.
- **Every interaction should feel rewarding.** Progress is always visible.
- **Accessibility is non-negotiable.** Reduced motion, screen reader support, and keyboard navigation are built in by default.

---

## 2. User Roles & Access Model

AiMath has two user states: **Guest** (unauthenticated) and **Authenticated**. Access is strictly segmented. The navigation sidebar is visible **only** to authenticated users. Guests see a minimal top navigation bar.

> **AI BUILD RULE:** Route protection is client-side via two hooks: `useProtectedRoute()` (in the `(protected)` layout) and `useGuestRoute()` (in the `(auth)` layout). Both hooks must do nothing while auth state is loading — no premature redirects that cause a flash. The sidebar component must check `isAuthenticated` from the Zustand auth store before rendering.

### 2.1 Guest (Unauthenticated)

> **ACCESS RULE:** Guests can never access the quiz engine, dashboard, leaderboard, or any gamification features. If a guest navigates to a protected URL, they are immediately redirected to `/login`. No partial renders.

**A guest CAN access:**

- `/` — Landing page with embedded live calculator demos
- `/calculators/fractions` — Full Fractions visual calculator
- `/calculators/negative` — Full Negative Numbers visual calculator
- `/calculators/multiplication` — Full Multiplication visual calculator
- `/calculators/division` — Full Division visual calculator
- `/login` — Login form
- `/register` — Registration form

**A guest CANNOT access:**

- `/dashboard` — Redirects to `/login`
- `/quiz/*` — Redirects to `/login`
- `/leaderboard` — Redirects to `/login`
- Sidebar navigation — Not rendered at all for guests
- Any XP, badge, streak, or level data — Not returned by any API call for unauthenticated requests

### 2.2 Authenticated User

Once logged in, the user has access to everything a guest has, plus:

- `/dashboard` — Personal stats, XP, level, streak, recent quiz history, earned badges
- `/quiz/[mode]` — Quiz engine for any of the four modes
- `/leaderboard` — Weekly top-10 leaderboard by XP
- Persistent sidebar navigation — visible on all pages once logged in
- XP accumulation, level progression, streaks, and badge unlocks

---

## 3. Navigation & Layout

### 3.1 Guest Layout (No Sidebar)

Guests see a top navigation bar only, containing:

- AiMath logo (links to `/`)
- Language switcher (EN / RU / КЫР) — always visible
- Login button → `/login`
- Register button (highlighted) → `/register`

No sidebar is rendered. No user avatar, no XP display, no streak counter.

### 3.2 Authenticated Layout (With Sidebar)

Once logged in, the layout changes entirely:

- **Left sidebar** — persistent, fixed, visible on all pages
- **Top bar** — shows user avatar, username, XP bar, current level, and streak counter

**Sidebar contents (authenticated only):**

- Dashboard → `/dashboard`
- Visual Calculators (expandable)
  - Fractions → `/calculators/fractions`
  - Negative Numbers → `/calculators/negative`
  - Multiplication → `/calculators/multiplication`
  - Division → `/calculators/division`
- Quiz (expandable)
  - Fractions Quiz → `/quiz/fractions`
  - Negative Numbers Quiz → `/quiz/negative`
  - Multiplication Quiz → `/quiz/multiplication`
  - Division Quiz → `/quiz/division`
- Leaderboard → `/leaderboard`
- Language switcher (at bottom of sidebar)
- Logout button (at very bottom)

> **AI BUILD RULE:** The sidebar must never flash or render for a guest. The auth loading state must be resolved before any conditional sidebar rendering occurs. Use `isLoading` from the auth store as a gate.

---

## 4. Complete Page Flows

### 4.1 Landing Page ( `/` ) — Public

The landing page is the primary acquisition surface. It must be fast, visually compelling, and demonstrate value immediately without requiring an account.

**Sections (in order):**

1. **Hero** — headline, subheadline, two CTAs: "Start Learning Free" (→ `/calculators/fractions`) and "Create Account" (→ `/register`)
2. **Live Demo Strip** — three embedded calculator widgets (Fractions, Negative Numbers, Multiplication) in free-play mode, fully interactive
3. **How It Works** — three-step explainer: Explore → Practice → Level Up
4. **Social Proof** — XP stats, number of students, languages available
5. **Language Banner** — prominent switcher with flag icons
6. **Footer** — links to `/login`, `/register`, language switcher

> **AI BUILD RULE:** The landing page must use React Server Components wherever possible. The embedded calculator demos are the only client components on this page. No auth state is read on the landing page.

---

### 4.2 Register Flow ( `/register` )

**Fields:**

- `username` — min 3 chars, max 20, alphanumeric + underscores only
- `email` — valid email format
- `password` — min 8 chars, at least one number, at least one letter
- `confirmPassword` — must match `password`

**On submit:**

1. Validate with `RegisterSchema` (Zod) client-side before any network call
2. `POST /api/v1/auth/register`
3. On success: auto-login immediately (tokens returned), store in Zustand + HttpOnly cookie, redirect to `/dashboard`
4. On `AUTH_EMAIL_TAKEN`: show translated error on the email field
5. On `AUTH_USERNAME_TAKEN`: show translated error on the username field
6. On `VALIDATION_ERROR`: show Zod error messages per field

> **AI BUILD RULE:** If the user is already authenticated (`isAuthenticated = true` in auth store), visiting `/register` must redirect to `/dashboard` immediately. Use `useGuestRoute()` for this.

---

### 4.3 Login Flow ( `/login` )

**Fields:**

- `email`
- `password`
- "Forgot password?" link — not implemented in v1, link is inactive

**On submit:**

1. Validate with `LoginSchema` (Zod) client-side
2. `POST /api/v1/auth/login`
3. On success: store user + access token in Zustand, refresh token goes into HttpOnly cookie, redirect to `/dashboard`
4. On `AUTH_INVALID_CREDENTIALS`: show a single translated generic error — **never indicate whether email or password was wrong**

> **AI BUILD RULE:** Authenticated users visiting `/login` are redirected to `/dashboard`. Always use a single generic error for wrong credentials — never differentiate "email not found" from "wrong password". This prevents email enumeration.

---

### 4.4 Dashboard ( `/dashboard` ) — Authenticated Only

The dashboard is the home base for logged-in users, showing their progress at a glance.

**Sections:**

| Section             | Content                                                                 |
| ------------------- | ----------------------------------------------------------------------- |
| Welcome header      | "Welcome back, [username]!" with current level badge                    |
| Stats row           | Current Level, Total XP, Active Streak (days), Quizzes Completed        |
| XP Progress Bar     | Visual bar from current XP to next level threshold, shows exact numbers |
| Recent Quiz History | Last 10 sessions: mode icon, date, score, difficulty, XP earned         |
| Earned Badges       | Grid of badge icons; unearned badges greyed-out with lock icon          |
| Quick Start         | Four cards (one per mode) with "Start Quiz" CTA                         |

**Data sources:**

- `GET /api/v1/users/me` → user stats via `useAuth()` SWR hook
- `GET /api/v1/users/me/badges` → earned badges via `useBadges()` SWR hook
- `GET /api/v1/users/me/history` → quiz history via `useQuizHistory()` SWR hook

> **AI BUILD RULE:** Until the quiz API is wired, the dashboard renders with empty-state UI. Once quiz sessions can be written to the DB, all dashboard data populates automatically via the SWR hooks — no changes to the dashboard page are needed.

---

### 4.5 Visual Calculator ( `/calculators/[mode]` ) — Public

Calculator pages are fully public — no authentication required. They operate in free-play mode where the user controls all inputs.

**Layout:**

- Mode selector tabs at the top — clicking switches between the four calculators
- Input area — the user sets the numbers for the problem
- Calculate button — triggers the step-by-step animation
- Step navigation — Back (`‹`) and Forward (`›`) buttons to walk through animation steps
- Text summary toggle — reveals a screen-reader-friendly prose description of the current step
- The animated SVG canvas — the main visual area

**For authenticated users viewing a calculator:**

- A "Take Quiz on This Topic" CTA button appears below the calculator, linking to `/quiz/[mode]`

> **AI BUILD RULE:** All four calculator components must accept a `problem` prop. When `undefined` (free-play mode), all inputs are editable. When provided (quiz mode), inputs are pre-populated and the result is hidden. The `onAnswer` callback fires when the user submits. Never duplicate this logic between modes.

---

### 4.6 Quiz Flow ( `/quiz/[mode]` ) — Authenticated Only

The quiz is the core engagement loop. A session consists of 5–10 problems for a chosen mode and difficulty.

#### Step 1 — Quiz Setup Screen

- User selects difficulty: Easy / Medium / Hard
- Displays: number of questions, XP per correct answer, time limit per question
- "Start Quiz" button → triggers `POST /api/v1/quiz/start`

#### Step 2 — Question Screen (repeated per question)

- Progress bar showing Question X of Y
- Countdown timer — WCAG-compliant, `aria-live="assertive"`, announces every 10 seconds and "Time's up!" on expiry
- The calculator widget in quiz mode — problem pre-populated, result hidden
- Four multiple-choice answer options (2×2 grid on desktop, vertical list on mobile)
- Hint button — uses a hint (reduces XP for this question from 10 to 5)
- On answer selection: immediately `POST /api/v1/quiz/:sessionId/answer`
- Flash correct (green) or incorrect (red) feedback, reveal the correct answer
- After 1.5 seconds, auto-advance to next question

#### Step 3 — Results Screen

- `POST /api/v1/quiz/:sessionId/complete` called automatically
- Shows: score (X/Y correct), total XP earned, time taken, accuracy percentage
- Shows any newly unlocked badges with celebration animation
- Shows level-up animation if the user crossed a level threshold
- Two CTAs: "Play Again" (same mode + difficulty) and "Go to Dashboard"

> **AI BUILD RULE:** The quiz session store (`quiz-session.store.ts`) must track: `sessionId` from the API, `currentQuestionIndex`, all submitted answers, total XP accumulated, and hint usage per question. This store is cleared when the user navigates away from the quiz.

> **EDGE CASE:** Timer expiry counts as a wrong answer. When the timer reaches 0, `POST /api/v1/quiz/:sessionId/answer` must be called automatically with `is_correct: false` and `time_taken_ms` equal to the time limit. The quiz then auto-advances.

---

### 4.7 Leaderboard ( `/leaderboard` ) — Authenticated Only

Shows the weekly top-10 users by XP earned in the current week.

**Layout:**

- Header row: Rank, Username, Level, Weekly XP
- Top 3 rows are visually highlighted (gold, silver, bronze styling)
- The currently logged-in user's row is highlighted even if they are not in the top 10
- Refreshes via SWR every 60 seconds automatically

> **AI BUILD RULE:** `GET /api/v1/leaderboard` is a public endpoint but the page `/leaderboard` requires authentication. The redirect to `/login` happens before the API call is made. The leaderboard response does NOT include user emails — only `username`, `level`, and `weeklyXp`.

---

## 5. Visual Calculator System

The four calculators are the pedagogical core of the product. Each one animates a mathematical concept in a way a child can follow without prior knowledge.

### 5.1 Shared Architecture

All calculators share:

- `CalculatorShell` wrapper — provides step navigation, text-summary toggle, and narration region
- `useStepController` hook — manages step state machine, resets to step 0 on input change
- `AnimationStep[]` type — each step has `id`, `narrativeKey` (i18n key), and `narrativeParams`
- Narration region — `<div role="status" aria-live="polite">` announces each step to screen readers
- Reduced motion support — reads `prefers-reduced-motion` and skips animations when set

### 5.2 The Four Modes

| Mode             | Visual       | SVG Component         | Key Pedagogical Steps                                                                                                                  |
| ---------------- | ------------ | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `fractions`      | Pizza slices | `PizzaSlice.tsx`      | Show both fractions as pizzas → find LCD → convert both → animate addition/subtraction → simplify result → show mixed number if needed |
| `negative`       | Number line  | `NumberLine.tsx`      | Place starting number on line → animate pointer jumping left (subtract) or right (add) by the operand → highlight final position       |
| `multiplication` | Area grid    | `AreaGrid.tsx`        | Draw empty grid → fill cells row by row → highlight partial products → show total area = product                                       |
| `division`       | Fair share   | `FairShareVisual.tsx` | Show N items → distribute one item per step into M groups → show remainder if any → state the quotient                                 |

### 5.3 Calculator Props Contract

> **AI BUILD RULE:** All four calculators must implement exactly the same props interface. This is what allows the quiz engine to embed any calculator without mode-specific code.

```typescript
interface CalculatorProps {
  problem?: FractionProblem | NegativeProblem | MultiplicationProblem | DivisionProblem
  onAnswer?: (isCorrect: boolean) => void
  hideResult?: boolean
  onReveal?: () => void
}
```

- `problem` is `undefined` → free-play mode, all inputs editable by user
- `problem` is provided → quiz mode, inputs pre-populated, result hidden
- `onAnswer` — called when user submits answer in quiz mode
- `hideResult` — hides the final result display when `true`

---

## 6. Quiz Engine

### 6.1 Problem Generation

Problems are generated client-side using deterministic seeded generators. One generator per mode, all following the same signature:

```typescript
function generateProblem(difficulty: Difficulty, seed: number): [Problem, number]
```

- Uses a linear congruential generator — same seed always produces the same problem
- Difficulty controls numeric ranges: `easy` | `medium` | `hard`

| Mode             | Easy                               | Medium                         | Hard                                          |
| ---------------- | ---------------------------------- | ------------------------------ | --------------------------------------------- |
| Fractions        | Denominators 2–6, same denominator | Unlike denominators, small LCD | Unlike denominators, large LCD, mixed numbers |
| Negative Numbers | −10 to +10 range                   | −50 to +50 range               | −100 to +100 range                            |
| Multiplication   | 1–10 × 1–10                        | 1–20 × 1–20                    | 1–50 × 1–50                                   |
| Division         | Exact division, 1–50 ÷ 1–10        | With remainders, 1–100 ÷ 1–10  | With remainders, 1–500 ÷ 1–20                 |

### 6.2 Answer Choices

- Always 4 choices — one correct, three plausible distractors
- Distractors are generated by the problem generator (common mistakes, not random numbers)
- Choices shuffled deterministically using the problem seed
- Displayed as a 2×2 grid on desktop, vertical list on mobile

### 6.3 Scoring & XP

| Condition          | Base XP | Speed Bonus                          |
| ------------------ | ------- | ------------------------------------ |
| Correct, no hint   | 10 XP   | +5 if answered in ≤25% of time limit |
| Correct, with hint | 5 XP    | +3 if answered in ≤50% of time limit |
| Wrong              | 0 XP    | No bonus                             |
| Timer expired      | 0 XP    | No bonus                             |

### 6.4 Time Limits Per Question

| Difficulty | Time Limit |
| ---------- | ---------- |
| Easy       | 60 seconds |
| Medium     | 45 seconds |
| Hard       | 30 seconds |

### 6.5 Session Size

| Difficulty | Questions |
| ---------- | --------- |
| Easy       | 5         |
| Medium     | 7         |
| Hard       | 10        |

---

## 7. Gamification System

### 7.1 XP & Levels

| Level | Title      | XP Required |
| ----- | ---------- | ----------- |
| 1     | Novice     | 0 XP        |
| 2     | Apprentice | 100 XP      |
| 3     | Scholar    | 300 XP      |
| 4     | Master     | 700 XP      |
| 5     | Champion   | 1500 XP     |

**Formula:** `threshold(n) = 100 × n^1.5`

> **AI BUILD RULE:** Level is stored in the DB, not derived at query time. This allows fast leaderboard queries. Level must be recomputed and stored after every quiz session completion via `applyQuizCompletion()`.

### 7.2 Streaks

- A streak increments when the user completes at least one quiz on consecutive calendar days
- If the user skips a day, the streak resets to 1 (not 0) on the next quiz
- Completing multiple quizzes in one day does not increment the streak further
- Streak is displayed in the top bar and the dashboard

**`updateStreak(lastQuizDate, now)` returns one of three values:**

| Return | Meaning                        | Action                |
| ------ | ------------------------------ | --------------------- |
| `0`    | Same calendar day as last quiz | No change             |
| `+1`   | Next consecutive calendar day  | Increment streak by 1 |
| `-1`   | Gap of 2 or more days          | Reset streak to 1     |

### 7.3 Badges

| Badge ID            | Name          | Award Condition                                 |
| ------------------- | ------------- | ----------------------------------------------- |
| `first_quiz`        | First Steps   | Complete your first quiz of any mode            |
| `streak_7`          | Week Warrior  | Maintain a 7-day consecutive quiz streak        |
| `perfect_fractions` | Pizza Master  | Score 100% on a fractions quiz (any difficulty) |
| `xp_100`            | Century Club  | Accumulate 100 total XP                         |
| `xp_500`            | High Achiever | Accumulate 500 total XP                         |
| `xp_1000`           | XP Legend     | Accumulate 1000 total XP                        |

> **AI BUILD RULE:** Badge awarding is idempotent via `ON CONFLICT DO NOTHING` on the `user_badges` insert. `checkAndAwardBadges()` is always safe to call multiple times — it will never create duplicate badge records.

---

## 8. API Specification

All endpoints are prefixed `/api/v1`. All request/response bodies are JSON. Authenticated endpoints require `Authorization: Bearer <accessToken>`.

### 8.1 Auth Endpoints

| Method | Path             | Auth            | Description                                                |
| ------ | ---------------- | --------------- | ---------------------------------------------------------- |
| `POST` | `/auth/register` | —               | Create account. Returns `SafeUser`. Auto-login on success. |
| `POST` | `/auth/login`    | —               | Returns `{ user, tokens: { accessToken, refreshToken } }`  |
| `POST` | `/auth/refresh`  | HttpOnly cookie | Rotates refresh token. Returns new access + refresh pair.  |
| `POST` | `/auth/logout`   | Bearer          | Deletes all refresh tokens for user. Clears cookie.        |

### 8.2 User Endpoints

| Method | Path                | Auth   | Description                                               |
| ------ | ------------------- | ------ | --------------------------------------------------------- |
| `GET`  | `/users/me`         | Bearer | Own profile (`SafeUser` — `password_hash` never returned) |
| `GET`  | `/users/me/badges`  | Bearer | All earned badges for the current user                    |
| `GET`  | `/users/me/history` | Bearer | Last 10 quiz sessions for the current user                |

### 8.3 Quiz Endpoints — ⚠️ High Priority, Remaining Work

> **STATUS:** These three endpoints are the main remaining implementation task. The data model and gamification logic are complete. Only the router and service wiring are needed.

| Method | Path                        | Auth   | Description                                                                                                                           |
| ------ | --------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/quiz/start`               | Bearer | Body: `{ mode, difficulty }`. Returns: `{ sessionId, problems[] }`                                                                    |
| `POST` | `/quiz/:sessionId/answer`   | Bearer | Body: `{ questionIndex, selectedAnswer, timeTakenMs, usedHint }`. Returns: `{ isCorrect, correctAnswer, xpEarned }`                   |
| `POST` | `/quiz/:sessionId/complete` | Bearer | Finalises session. Triggers XP update, level check, streak, badge awarding. Returns: `{ totalXp, newBadges[], didLevelUp, newLevel }` |

### 8.4 Leaderboard Endpoint

| Method | Path           | Auth | Description                                                                   |
| ------ | -------------- | ---- | ----------------------------------------------------------------------------- |
| `GET`  | `/leaderboard` | —    | Public. Weekly top-10 by XP. Returns: `[{ rank, username, level, weeklyXp }]` |

### 8.5 Error Codes

| Code                       | HTTP | Meaning & Frontend Action                                              |
| -------------------------- | ---- | ---------------------------------------------------------------------- |
| `AUTH_EMAIL_TAKEN`         | 409  | Email already registered — show error on email field                   |
| `AUTH_USERNAME_TAKEN`      | 409  | Username already taken — show error on username field                  |
| `AUTH_INVALID_CREDENTIALS` | 401  | Wrong email or password — show single generic error, never distinguish |
| `AUTH_TOKEN_EXPIRED`       | 401  | Access token expired — trigger refresh flow, retry original request    |
| `AUTH_TOKEN_INVALID`       | 401  | Malformed token — clear auth state, redirect to `/login`               |
| `QUIZ_SESSION_NOT_FOUND`   | 404  | Session ID does not exist                                              |
| `QUIZ_ALREADY_COMPLETED`   | 409  | Session already finalised — ignore, show results                       |
| `VALIDATION_ERROR`         | 422  | Request body failed Zod validation — show per-field errors             |
| `NOT_FOUND`                | 404  | Route does not exist                                                   |
| `INTERNAL_ERROR`           | 500  | Unexpected server error — show generic error toast                     |

---

## 9. Data Model

All tables use UUID primary keys generated by PostgreSQL (`gen_random_uuid()`). Managed with Drizzle ORM. All foreign keys use `CASCADE` on delete.

### `users`

| Column           | Type                   | Notes                                             |
| ---------------- | ---------------------- | ------------------------------------------------- |
| `id`             | `uuid PK`              | `gen_random_uuid()` default                       |
| `email`          | `text UNIQUE NOT NULL` | Login credential — never returned to client       |
| `password_hash`  | `text NOT NULL`        | bcrypt hash — **NEVER returned to client**        |
| `username`       | `text UNIQUE NOT NULL` | Display name — safe to return                     |
| `xp`             | `integer DEFAULT 0`    | Cumulative experience points                      |
| `level`          | `integer DEFAULT 1`    | Stored (not derived) for fast leaderboard queries |
| `streak`         | `integer DEFAULT 0`    | Consecutive days with a completed quiz            |
| `last_quiz_date` | `date`                 | Used to compute streak deltas — nullable          |
| `created_at`     | `timestamptz`          | Set at insert, never modified                     |

### `refresh_tokens`

| Column       | Type                   | Notes                                                |
| ------------ | ---------------------- | ---------------------------------------------------- |
| `id`         | `uuid PK`              |                                                      |
| `user_id`    | `uuid FK → users(id)`  | CASCADE on delete                                    |
| `token_hash` | `text NOT NULL`        | SHA-256 hash of the raw token — not the token itself |
| `expires_at` | `timestamptz NOT NULL` | 7-day TTL                                            |

### `quiz_sessions`

| Column            | Type                   | Notes                                                         |
| ----------------- | ---------------------- | ------------------------------------------------------------- |
| `id`              | `uuid PK`              |                                                               |
| `user_id`         | `uuid FK → users(id)`  | CASCADE on delete                                             |
| `mode`            | `text NOT NULL`        | `'fractions' \| 'negative' \| 'multiplication' \| 'division'` |
| `difficulty`      | `text NOT NULL`        | `'easy' \| 'medium' \| 'hard'`                                |
| `score`           | `integer NOT NULL`     | Total XP earned in this session                               |
| `total_questions` | `integer NOT NULL`     | Number of questions in session                                |
| `correct_answers` | `integer NOT NULL`     | Number answered correctly                                     |
| `completed_at`    | `timestamptz NOT NULL` | Set when `POST /quiz/:id/complete` is called                  |

### `quiz_answers`

| Column           | Type                             | Notes                  |
| ---------------- | -------------------------------- | ---------------------- |
| `id`             | `uuid PK`                        |                        |
| `session_id`     | `uuid FK → quiz_sessions(id)`    |                        |
| `question_index` | `integer NOT NULL`               |                        |
| `is_correct`     | `boolean NOT NULL`               |                        |
| `used_hint`      | `boolean NOT NULL DEFAULT false` |                        |
| `time_taken_ms`  | `integer NOT NULL`               | Milliseconds to answer |

### `badges`

| Column        | Type            | Notes                                  |
| ------------- | --------------- | -------------------------------------- |
| `id`          | `text PK`       | Slug e.g. `'first_quiz'`, `'streak_7'` |
| `name`        | `text NOT NULL` |                                        |
| `description` | `text NOT NULL` |                                        |
| `icon`        | `text NOT NULL` | Emoji or icon identifier               |

### `user_badges`

| Column       | Type                   | Notes                        |
| ------------ | ---------------------- | ---------------------------- |
| `user_id`    | `uuid FK → users(id)`  | Composite PK with `badge_id` |
| `badge_id`   | `text FK → badges(id)` |                              |
| `awarded_at` | `timestamptz NOT NULL` |                              |

---

## 10. Accessibility Requirements

> **REQUIREMENT:** Accessibility is non-negotiable. Every interactive component must meet WCAG 2.1 AA. The following rules are enforced — not aspirational.

- All interactive buttons have `focus-visible:ring-2 focus-visible:ring-indigo-500` Tailwind classes
- `CalculatorShell` narration: `<div role="status" aria-live="polite">` announces current step text on every step change
- `QuizTimer`: `<div aria-live="assertive" aria-atomic="true">` announces time every 10 seconds and "Time's up!" on expiry
- `QuizTimer` progress bar: `role="progressbar"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`
- `LanguageSwitcher`: each language button has `aria-pressed={locale === activeLocale}`
- `useReducedMotion()`: reads `prefers-reduced-motion`, disables Framer Motion animations when set
- All calculators have a text-summary mode that describes each step in plain text for screen readers
- No colour-only information — all status indicators have text or icon accompaniment
- Tab order must be logical with no keyboard traps

---

## 11. Security Requirements

- **Helmet** — all standard secure HTTP headers (CSP, HSTS, X-Frame-Options)
- **bcrypt cost factor 12** — password hashing
- **SHA-256 refresh token hashing** — raw token never persisted to DB
- **Email enumeration prevention** — identical error for "email not found" and "wrong password"
- **CORS** locked to `FRONTEND_ORIGIN` — credentials only from that origin
- **Rate limiting** on auth endpoints: 5 requests / 15 min per IP
- **Zod validation** on all request bodies before they reach business logic
- **HttpOnly + SameSite=Strict** cookie for refresh tokens — not accessible via JavaScript
- **Email masking in logs** — any string containing an email replaced with `[email]` before writing
- **Access token in memory only** — never in `localStorage` or `sessionStorage`
- **`pnpm audit`** runs in CI on every push

---

## 12. Internationalisation (i18n)

The i18n system is custom-built — no external library. Three locale files: `en.json` (canonical, always the fallback), `ru.json`, `kg.json`.

> **AI BUILD RULE:** Zero hardcoded user-facing strings in any React component. Everything goes through `t()`. This applies to button labels, `aria-label`s, error messages, quiz feedback, empty states, and all toast notifications.

### 12.1 How `t()` Works

1. Splits the key on `.` and traverses the nested dict (e.g. `quiz.correct` → `dict.quiz.correct`)
2. If key is missing in the selected locale, falls back to `en.json`
3. If still missing, returns the raw key string and logs `console.warn` in development
4. Replaces `{placeholder}` tokens with values from the `params` argument

### 12.2 Locale Detection Order

1. Value stored in `localStorage`
2. Browser language mapping: `ky` / `ky-KG` → `kg`, `ru` / `ru-RU` → `ru`, anything else → `en`
3. Default: `en`

---

## 13. Remaining Work & Priority

| Item                                                       | Priority   | Details                                                                                                       |
| ---------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| Quiz API endpoints (`POST /start`, `/answer`, `/complete`) | 🔴 HIGH    | Router and service wiring. Data model and gamification logic already complete.                                |
| Quiz frontend ↔ API integration                            | 🔴 HIGH    | Wire `QuizSession.tsx` to the API. Start on mount, submit answers, complete session, show XP + badge results. |
| Token refresh interceptor                                  | 🟡 MEDIUM  | SWR `onError` handler: detect `AUTH_TOKEN_EXPIRED`, call `/auth/refresh`, retry failed request transparently. |
| Database migration execution                               | 🟡 MEDIUM  | Run `pnpm --filter api db:generate` then `db:migrate` against real DB to create tables.                       |
| Badge seed data                                            | 🟡 MEDIUM  | `db/seed.ts` exists but has not been run against the database.                                                |
| Level-up & badge unlock animations                         | 🟢 LOW     | Celebration animation components. Data model supports it — UI only.                                           |
| Sound effects                                              | 🟢 LOW     | `soundEnabled` flag exists in `quiz-session.store.ts` — no audio implemented yet.                             |
| Google OAuth                                               | 🟢 LOW     | Scaffolded in design but not implemented.                                                                     |
| Dashboard data population                                  | ⛔ BLOCKED | Blocked by Quiz API. Dashboard renders but shows placeholder data until quiz sessions can be written to DB.   |

---

## 14. Tech Stack Reference

| Layer        | Technology                      | Notes                                                            |
| ------------ | ------------------------------- | ---------------------------------------------------------------- |
| Frontend     | Next.js 15 (App Router)         | SSR for SEO, RSC for data pages, CSR for interactive widgets     |
| Language     | TypeScript 5 (strict)           | Type safety across full stack                                    |
| Styling      | Tailwind CSS 3                  | Utility-first, consistent design tokens                          |
| Animation    | Framer Motion + custom SVG      | Page transitions via Framer Motion; calculators use animated SVG |
| Client state | Zustand                         | Auth session store + quiz session store                          |
| Server data  | SWR                             | Automatic revalidation, error handling, cache                    |
| Backend      | Express 5 + Node.js 20          | Lightweight, modular REST API on port 8080                       |
| ORM          | Drizzle ORM                     | TypeScript-first, zero runtime overhead                          |
| Database     | PostgreSQL 16 (Neon)            | Relational with UUID primary keys                                |
| Auth         | JWT (access + refresh)          | Custom, no vendor lock-in. Access: 15 min. Refresh: 7 days.      |
| Validation   | Zod (shared package)            | Single source of truth for all schemas — `@mathviz/shared`       |
| Testing      | Vitest + RTL + Supertest        | 101 frontend tests, 40 backend tests, all passing                |
| Monorepo     | pnpm workspaces + Turborepo     | Shared types/schemas without duplication                         |
| Linting      | ESLint (flat config) + Prettier | Enforced pre-commit via Husky + lint-staged                      |

---

_AiMath PRD v1.0 — May 2026 — Confidential_
