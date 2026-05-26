# AiMath Landing Page Implementation

## Overview

Complete redesign of the landing page (`app/(public)/page.tsx`) with a focus on **demonstrating product value immediately** through interactive visual calculators and clear information hierarchy.

## Component Structure

### Files Created:

- **Main Page**: `apps/web/src/app/(public)/page.tsx` — RSC orchestrator
- **Landing Components** (all in `apps/web/src/components/landing/`):
  - `TopNav.tsx` — Fixed sticky header with language switcher (🇬🇧 EN, 🇷🇺 RU, 🇰🇬 KG)
  - `HeroSection.tsx` — Hero with headline, CTAs, and SVG animation
  - `LiveDemoStrip.tsx` — Container for interactive calculator widgets
  - `HowItWorks.tsx` — Three-step explainer with icons and connectors
  - `SocialProof.tsx` — Animated count-up stats (XP, students, languages)
  - `LanguageBanner.tsx` — Prominent locale switcher with flag icons
  - `FinalCTA.tsx` — Centered final call-to-action section
  - `LandingFooter.tsx` — Multi-column footer with calculator links

- **Calculator Demo Widgets** (RSC imports client components):
  - `calculators/FractionDemoWidget.tsx` — Pizza-slice visual (3-6 denominator)
  - `calculators/NegativeDemoWidget.tsx` — Number-line visual (-5 to 5)
  - `calculators/MultiplicationDemoWidget.tsx` — Area-grid visual (1×1 to 8×8)

## Design Decisions

### Colour Palette

- **Primary**: Indigo (`indigo-600`) — confidence, mathematical, aligns with existing brand
- **Accent**: Warm amber/orange (`amber-300`, `orange-500`) — energy, growth, success
- **Supporting**:
  - Soft backgrounds: `indigo-50`, `amber-50`, `slate-100`
  - Text: `slate-900` (headings), `slate-600` (body), `white` (on dark)

### Typography & Hierarchy

- **Headlines**: Bold, 3xl–5xl on desktop, clear breathing room
- **Body**: 16px base with loose line-height for readability
- **Font Family**: Inherits from existing Geist/Inter stack (friendly, modern, not childish)

### Layout & Spacing

- Max-width: 6xl (1152px) for main content
- Mobile-first: Full-width on 380px, two-column on 768px+, three-column on lg
- Generous padding (py-16 to py-24 sections) creates a premium feel
- Soft rounded corners (rounded-lg to rounded-2xl) + subtle shadows

### Motion & Accessibility

- All animations respect `prefers-reduced-motion` (CSS classes: `motion-safe:animate-*`)
- Focus states: `focus-visible:ring-2 focus-visible:ring-indigo-500` on all interactive elements
- Semantic HTML: `<header>`, `<main>`, `<section>`, `<footer>`
- ARIA: Calculator demos use `role="status" aria-live="polite"` (ready for stats narration)
- No colour-only information (icons + text, flags + language names)

### Key Product Moments

1. **Hero Section**
   - Uses headline "See math, understand it" (one of three proposals, user-selected)
   - Subheading emphasizes free, public access, multi-language support
   - Two CTAs: primary (Register) and secondary (Try calculator)
   - SVG animation on desktop (pizza, number line, area grid mockups)

2. **Live Demo Strip** ⭐ _Most Critical Section_
   - **Three fully interactive calculators**: Fractions, Negative Numbers, Multiplication
   - User input → immediate visual update (no signup, no auth gates)
   - Stub implementations: `FractionDemoWidget`, `NegativeDemoWidget`, `MultiplicationDemoWidget`
   - Can be replaced with real calculator imports later by swapping imports in `LiveDemoStrip.tsx`
   - Props interface: `problem={undefined}` (free-play mode)

3. **How It Works**
   - Three steps: Explore → Practice → Level Up
   - Visual connectors between cards (desktop only)
   - Step numbering (1, 2, 3) for clarity

4. **Social Proof**
   - Animated count-up stats using `useInView` + `framer-motion`
   - Targets: 50,000+ XP, 2,500+ students, 3 languages
   - Fires on scroll into view (once)

5. **Language Banner**
   - Full-width indigo gradient background (not just a nav selector)
   - Three large cards with flags (🇬🇧, 🇷🇺, 🇰🇬) and descriptions
   - Interactive switch buttons
   - Signals strong localization commitment to Kyrgyz/Russian audiences

6. **Footer**
   - Three-column layout: Brand + tagline, Learn links (4 calculators), Account links
   - Bottom: Copyright + "Made for Kyrgyzstan & CIS"
   - Reinforces regional focus

## Internationalization

### i18n Keys Added

All keys in `landing.*` namespace:

- Hero: `heroTitle`, `heroSubheading`, `heroDescription`, `heroPrimaryCta`, `heroSecondaryCta`, `trustLine`
- Demo: `demoCaption`, `demoTitle`, `demoFractions`, `demoNegative`, `demoMultiplication`
- How: `howTitle`, `howStep{1,2,3}Title`, `howStep{1,2,3}Description`
- Proof: `proofTitle`, `proofSubtitle`, `proofXpLabel`, `proofStudentsLabel`, `proofLanguagesLabel`
- Language: `languageBannerTitle`, `languageBannerSubtitle`, `languageSwitchButton`
- CTA: `finalCtaTitle`, `finalCtaDescription`, `finalCtaButton`
- Footer: `footerTagline`, `footerLearnTitle`, `footerFractions`, `footerNegative`, `footerMultiplication`, `footerDivision`, `footerAccountTitle`, `footerCopyright`

### Files Updated

- `apps/web/src/i18n/en.json` — All keys provided

### Sync to ru.json & kg.json

(User responsibility) Copy the landing section, translate to Russian and Kyrgyz.

## Component Interface

### TopNav

- **Client Component**: Uses `useTranslation()` for dynamic language switching
- **Languages**: Hardcoded array (en, ru, kg) with flag emojis
- **Sticky**: `sticky top-0 z-50`

### HeroSection, HowItWorks, FinalCTA, LandingFooter

- **RSC**: No hooks, static content through i18n
- **Pattern**: `t()` helper from static import

### LiveDemoStrip

- **RSC**: Imports three client calculator components
- **Extensible**: Easy to swap real calculators for demo stubs

### FractionDemoWidget, NegativeDemoWidget, MultiplicationDemoWidget

- **Client Components**: `'use client'`
- **Props**: None currently (self-contained); ready to accept `CalculatorProps` interface
- **State**: Internal `useState` for inputs and animation state

### SocialProof

- **Client Component**: Uses `useInView` from `framer-motion` and `useEffect`
- **CountUpStat**: Sub-component with animated counting

### LanguageBanner, TopNav

- **Client Components**: Event handlers for locale switching

## Testing Checklist

- [ ] Page loads without console errors
- [ ] Language switcher (top nav + banner) updates locale in real-time
- [ ] All calculator widgets accept user input and update visuals
- [ ] Hero CTAs link to `/register` and `/calculators/fractions`
- [ ] Social proof stats animate on scroll (first time only)
- [ ] Footer links point to correct calculator and auth routes
- [ ] Mobile layout (380px): Full-width, stacked sections
- [ ] Tablet (768px): Two-column where specified
- [ ] Desktop (1440px): Three-column demo strip, side-by-side hero
- [ ] Focus states visible on all buttons and inputs
- [ ] Animations respect `prefers-reduced-motion`
- [ ] No hardcoded English strings (all through i18n)

## Next Steps (For User)

1. **Confirm look & feel** — Run `pnpm dev` and verify design matches direction
2. **Integrate real calculators** — Replace demo widgets:
   ```tsx
   // In LiveDemoStrip.tsx
   import FractionCalculator from '@/features/fractions/components/FractionCalculator'
   import NegativeCalculator from '@/features/negative/components/NegativeNumberCalculator'
   import MultiplicationCalculator from '@/features/multiplication/components/MultiplicationCalculator'
   // Then use in JSX with problem={undefined}
   ```
3. **Translate i18n keys** — Copy `landing.*` section to `ru.json` and `kg.json`
4. **Update stats numbers** — Replace 50000, 2500 in `SocialProof.tsx` with real data
5. **Review with user flows** — Send `AiMath_UserFlows.md` so I can verify links and redirects

## Edge Cases Handled

- **Responsive images/visuals**: SVG scales flexibly
- **Reduced motion**: All Framer Motion and CSS animations check `prefers-reduced-motion`
- **Missing translations**: Falls back to `en` (via `getTranslation` helper)
- **Input validation**: Calculator widgets clamp inputs to reasonable ranges
- **Touch targets**: Buttons 44px+ minimum height for mobile UX

---

**Design Rationale Summary**: The landing page leads with a **live demonstration** of core value (the calculators). Rather than tell users what AiMath does, it shows them in 30 seconds. The three-step explainer, social proof, and language banner build trust and signal regional focus. The colour scheme (indigo + warm amber) is energetic and mathematical without being harsh. Spacing is generous to feel premium and reduce cognitive load on a first visit.
