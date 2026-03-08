# CLAUDE.md — Realtor Content Calendar

## Project Overview

A client-side Next.js application that generates social media content calendars for real estate agents. Users complete an onboarding wizard with their profile info, then get a full month of pre-written, customizable posts they can drag-and-drop, edit, and export. No backend, no auth, no database — all data lives in browser localStorage.

## Tech Stack

- **Framework:** Next.js 14 (App Router) with static export (`output: 'export'`)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3.4 with CSS variables, shadcn/ui (New York style)
- **Drag & Drop:** @dnd-kit (core + sortable)
- **Exports:** jsPDF + jspdf-autotable (PDF), file-saver (downloads)
- **Icons:** Lucide React
- **Path alias:** `@/*` → `./src/*`

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Static build (output to .next/)
npm run lint     # ESLint with next/core-web-vitals + next/typescript
npm run start    # Serve production build
```

There are no tests configured in this project.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main app (state management hub)
│   ├── layout.tsx            # Root layout with metadata & fonts
│   └── globals.css           # Tailwind + CSS variable theme
├── components/
│   ├── calendar/
│   │   ├── CalendarGrid.tsx  # Month grid with drag-drop
│   │   ├── DayCell.tsx       # Single day cell (draggable post chip)
│   │   └── PostDetail.tsx    # Right sidebar post editor
│   ├── export/ExportMenu.tsx # PDF/CSV/ICS export dropdown
│   ├── generator/GenerateButton.tsx  # One-click month generation
│   ├── landing/LandingPage.tsx       # Hero page
│   ├── onboarding/OnboardingWizard.tsx  # 5-step setup wizard
│   ├── settings/CustomizePanel.tsx      # Profile settings sidebar
│   └── ui/                   # shadcn/ui primitives (badge, button, input, textarea)
├── data/
│   ├── hashtags.json         # Platform-specific hashtag pools
│   ├── posting-times.json    # Best posting times per platform
│   └── templates/            # 214+ post templates
│       ├── listings.json     # ~55 listing templates
│       ├── educational.json  # ~55 educational templates
│       ├── branding.json     # ~52 personal branding templates
│       └── engagement.json   # ~52 engagement templates
├── lib/
│   ├── calendar-generator.ts # Core generation logic (loadTemplates, generateMonth)
│   ├── template-engine.ts    # Placeholder filling, hashtag selection
│   ├── export-utils.ts       # PDF, CSV, ICS export functions
│   ├── storage.ts            # localStorage wrapper (rc_agent_profile, rc_calendar_state)
│   └── utils.ts              # cn() helper (clsx + tailwind-merge)
└── types/
    └── index.ts              # All TypeScript type definitions
```

## Architecture & Data Flow

### State Management

All state lives in `src/app/page.tsx` via React `useState`/`useCallback`. No external state library. Key state:
- `profile: AgentProfile` — user name, brokerage, city, platforms, cadence, colors, hashtags
- `calendarState: CalendarState` — year, month, and array of `CalendarPost` objects

### Data Persistence

localStorage with two keys:
- `rc_agent_profile` — serialized AgentProfile
- `rc_calendar_state` — serialized CalendarState

### User Flow

1. **Landing Page** → 2. **Onboarding Wizard** (5 steps: name, city, cadence, platforms, confirm) → 3. **Calendar View** (generate, edit, drag-drop, export)

### Content Generation Pipeline

1. `loadTemplates()` — dynamically imports all template JSON files
2. `generateMonth(year, month, profile)` — picks posting days based on cadence, distributes categories (30% listing, 30% educational, 20% branding, 20% engagement)
3. `fillTemplate(template, profile)` — replaces `{name}`, `{city}`, `{brokerage}` placeholders
4. `getHashtagsForPost()` — selects platform-appropriate hashtags

## Key Conventions

### Content Categories (with associated colors)

| Category      | CSS Variable     | Color   |
|---------------|------------------|---------|
| listing       | `--listing`      | Green   |
| educational   | `--educational`  | Blue    |
| branding      | `--branding`     | Orange  |
| engagement    | `--engagement`   | Purple  |

### Post Cadence Options

- `3x-mwf` — Mon/Wed/Fri
- `3x-tts` — Tue/Thu/Sat
- `4x` — Mon/Tue/Thu/Fri
- `5x` — Mon–Fri

### Platforms

`instagram`, `facebook`, `linkedin`, `tiktok`

### Component Patterns

- shadcn/ui components in `src/components/ui/` use CVA (class-variance-authority) for variants
- Class names composed with `cn()` from `src/lib/utils.ts`
- All components are client-side (`"use client"` where needed)
- Radix UI primitives underpin shadcn/ui components

### Template Data Format

Each template in `src/data/templates/*.json` has:
```json
{
  "id": "unique-id",
  "category": "listing|educational|branding|engagement",
  "title": "Short title",
  "caption": "Post text with {name}, {city}, {brokerage} placeholders",
  "platforms": ["instagram", "facebook"],
  "visual_suggestion": "Description of recommended image/video"
}
```

## Important Notes

- **No backend/API routes** — fully static client-side app
- **No environment variables** — no `.env` file needed
- **No tests** — no testing framework configured
- **No auth** — anonymous usage, all data in localStorage
- **Static export** — `next.config.mjs` sets `output: 'export'` and `images.unoptimized: true`
- **Print support** — CSS includes `@media print` rules in `globals.css`
