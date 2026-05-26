# Calculator Page UX Improvements — Guest Discovery

## Research: How Other Platforms Handle Unauthenticated Users

### What We Found

**Leading educational platforms all use a consistent pattern for guests: Show available options prominently so users know what they can explore without forcing signup.**

#### Khan Academy

- Shows course topics in a sidebar or grid
- User can browse different subjects (Math, Science, History, etc.)
- No signup wall until user tries to track progress
- Clear indication that content is free to explore

#### Duolingo

- Shows language options upfront
- User picks their language and starts immediately
- Explore 5-10 lessons free before seeing signup prompt
- Each lesson shows progress toward next milestone

#### Codecademy

- Displays course catalog
- User can preview lessons, see curriculum
- No forced signup to browse
- Shows "Sign up to save progress" prominently

#### Brilliant.org

- Displays interactive courses/lessons
- Browse daily challenges and courses freely
- Signup encouraged after exploration, not forced

#### Course Comparison

| Platform      | Guest Discovery       | Signup Friction                |
| ------------- | --------------------- | ------------------------------ |
| Khan Academy  | Topic/subject grid    | Low (only when tracking)       |
| Duolingo      | Language selector     | Low (after 5-10 lessons)       |
| Codecademy    | Course browser        | Low (optional progress save)   |
| Brilliant.org | Course/lesson display | Medium (for full features)     |
| Coursera      | Course search/browse  | Medium (audit vs. certificate) |

### Common Pattern

✅ **Show what's available first**
✅ **Let users explore freely**
✅ **Signup is optional until they want to track/compete**
✅ **Navigation to alternatives is always visible**

---

## Implementation: Mode Selector for AiMath

### What We Built

**New Component:** `ModeSelector.tsx`

- Shows all 4 calculator modes (Fractions, Negative Numbers, Multiplication, Division)
- **Visual treatment:**
  - Icon + mode name + one-line description for each
  - Active mode highlighted with indigo border + background
  - Hover states for inactive modes
  - Responsive: 1 column on mobile, 2 on tablet, 4 on desktop

**Placement:** Top of calculator page, before the calculator itself

**Flow for Guest:**

```
1. Click "Start Learning Free" on landing
   ↓
2. Lands on /calculators/fractions
   ↓
3. Sees Mode Selector with all 4 options
   ↓
4. Can explore any mode (Fractions, Negative, Multiplication, Division)
   ↓
5. See enhanced signup CTA at bottom: "Ready to earn XP and compete?"
   ↓
6. Sign up to unlock quizzes, streaks, leaderboard
```

### Visual Design

```
┌─────────────────────────────────────────────────┐
│ CALCULATORS                                     │
├─────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐ │
│ │ 🍕      │ │ 📊      │ │ 🔢      │ │ ÷   │ │
│ │ Fractions│ │ Number   │ │Multiplication│ │ Division
│ │ Add/      │ │ Line     │ │ Multiply │ │ Share
│ │ subtract  │ │ Jump left│ │ by grid  │ │ equally
│ │           │ │ and right│ │          │ │
│ └──────────┘ └──────────┘ └──────────┘ └──────┘ │
│  (active)   (clickable)   (clickable)   (clickable)
└─────────────────────────────────────────────────┘
│ CALCULATOR                                      │
├─────────────────────────────────────────────────┤
│ [Interactive fractions calculator here]        │
│                                                 │
└─────────────────────────────────────────────────┘
│ SIGNUP CTA                                      │
├─────────────────────────────────────────────────┤
│ Ready to earn XP and climb the leaderboard?   │
│ Create a free account to unlock quizzes, earn  │
│ XP, build streaks, and compete with students. │
│                              [Create account →]
└─────────────────────────────────────────────────┘
```

---

## Files Changed

1. **Created:** `apps/web/src/components/calculators/ModeSelector.tsx`
   - New component showing all 4 modes
   - Active mode highlighting
   - Responsive grid layout

2. **Updated:** `apps/web/src/app/(public)/calculators/[mode]/page.tsx`
   - Imported and placed ModeSelector at top
   - Enhanced signup CTA with benefits messaging
   - Better copy: "Ready to earn XP and compete?" vs. generic signup prompt

---

## User Experience Impact

### Before

- Guest on `/calculators/fractions` sees only fractions calculator
- No way to discover other modes without going back to landing page
- No clear path to signup with value prop
- Feels isolated, not part of a platform

### After

- Guest immediately sees all 4 modes available to explore
- Can click any mode to switch instantly
- Clear messaging about what signup unlocks (XP, streaks, leaderboard, competition)
- Follows familiar UX patterns from Khan Academy, Duolingo, Codecademy
- Better discoverability = higher exploration = higher signup intent

---

## Benefits Alignment with Research

✅ **Show available options upfront** — ModeSelector displays all 4 calculators
✅ **No forced signup until user wants to track** — Can explore freely, quiz link redirects to login
✅ **Clear benefits in signup CTA** — "Earn XP, build streaks, compete"
✅ **Navigation always visible** — Mode selector stays at top of every calculator page
✅ **Follows industry patterns** — Same approach as Khan Academy, Duolingo, Codecademy

---

## Next Steps

1. **Test locally:** Run `pnpm dev`, visit `/calculators/fractions` as guest
2. **Verify behavior:**
   - Click each mode in selector → should switch calculator
   - Current mode should be highlighted
   - Signup CTA should be compelling
3. **Translation:** Copy mode-related i18n keys to `ru.json` and `kg.json`
   - `modes.{modeId}.label`
   - `modes.{modeId}.shortHint`
   - `nav.sectionCalculators` (header label)

---

## A/B Testing Ideas (Future)

- **CTA variations:** "Create free account" vs. "Start earning XP" vs. "Join 5,000+ students"
- **Placement:** Mode selector at top vs. after calculator vs. both
- **Signup incentive:** XP reward for signing up (e.g. "+100 XP for creating account")
- **Unlock messaging:** "Unlock quizzes to earn XP" vs. "Track your progress"

---

_Implemented based on research of Khan Academy, Duolingo, Codecademy, Brilliant.org, and Coursera guest UX patterns._
