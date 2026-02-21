# Realtor Content Calendar

A full-featured content calendar web app for real estate agents. Generate a month of social media posts from 214 ready-to-use templates, customize them for your market, and export to PDF, CSV, or ICS.

Built with Next.js 14, React 18, Tailwind CSS, and TypeScript. Runs entirely client-side with localStorage persistence — no backend required.

## Features

- **Onboarding wizard** — 5-step setup: name, brokerage, market area, posting cadence, platforms
- **214 post templates** across 4 categories: Listing (30%), Educational (30%), Personal Branding (20%), Engagement (20%)
- **Auto-fill calendar** — generates a balanced month of posts with one click
- **Monthly calendar grid** with color-coded post categories
- **Post editor** — slide-over panel to edit captions, toggle platforms, regenerate from a new template, copy to clipboard
- **Drag-and-drop** post reordering (via @dnd-kit)
- **Export** to PDF (visual calendar + post details), CSV (spreadsheet-ready), and ICS (add to Google Calendar / Outlook)
- **Settings panel** — update profile, cadence, platforms, brand colors, custom hashtags
- **Landing page** for first-time visitors
- **Static export** — builds to a standalone `/out` directory for distribution on Gumroad / Lemon Squeezy

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build (static export to `/out`) |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── app/                  # Next.js app router (layout, page, styles)
├── components/
│   ├── calendar/         # CalendarGrid, DayCell, PostDetail
│   ├── export/           # ExportMenu (PDF, CSV, ICS)
│   ├── generator/        # GenerateButton
│   ├── landing/          # LandingPage
│   ├── onboarding/       # OnboardingWizard
│   ├── settings/         # CustomizePanel
│   └── ui/               # Shared primitives (Button, Badge, Input, etc.)
├── data/
│   ├── templates/        # 214 post templates (JSON, split by category)
│   ├── hashtags.json     # Platform-specific hashtag sets
│   └── posting-times.json
├── lib/
│   ├── calendar-generator.ts  # Month generation logic
│   ├── template-engine.ts     # Placeholder fill + hashtag assembly
│   ├── export-utils.ts        # PDF, CSV, ICS export
│   ├── storage.ts             # localStorage wrapper
│   └── utils.ts               # Tailwind merge helper
└── types/                # TypeScript type definitions
```

## Tech Stack

- [Next.js 14](https://nextjs.org) (App Router, static export)
- [React 18](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com) (accessible primitives)
- [@dnd-kit](https://dndkit.com) (drag-and-drop)
- [jsPDF](https://github.com/parallax/jsPDF) (PDF generation)
- [Vitest](https://vitest.dev) (unit testing)
