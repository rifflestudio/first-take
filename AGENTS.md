# First Take — Agent Guide

This is the **First Take** mini app by Riffle, built for the First Take event in Bangalore (April 2026).

## Project Scope

An event companion experience for attendees of First Take — a live music event IP by Riffle.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- `next-themes` (dark mode default)
- Framer Motion

## Local Development

```bash
npm install
npm run dev   # runs at localhost:3000
npm run build
```

## Repo Conventions

- Keep changes focused on the First Take event app.
- Reuse the existing visual language:
  - Custom 205TF Milling fonts from `public/fonts`
  - Editorial, high-contrast typography
  - Theme-aware light/dark presentation (dark by default)
- If changing copy, keep the voice aligned with brand tone: artistic, human, anti-sterile, lowercase.

## Architecture Notes

- `app/page.tsx` — main page
- `app/layout.tsx` — global metadata, fonts, theming
- `app/globals.css` — design tokens and font-faces
- `app/components/` — reusable UI components
- `public/fonts/` — 205TF Milling Triplex font files (licensed)

## Brand Reference

See `CLAUDE.md` for the full brand and design system documentation.

## Context Folder

`brand & product context/` contains:
- `belo-horizonte-v1/` — Riffle marketing site source — use as design reference
- `rifflestudio-website/san-francisco/` — Riffle studio web app — use for component patterns

Do not modify files inside `brand & product context/`.

## Verification

- Run `npm run build` after code changes.
- If build output shows framework warnings, call them out clearly even if the build succeeds.

## Known Notes

- Next.js may warn about `viewport` in metadata export — known minor issue.
- Fonts are licensed (205TF) — do not expose or redistribute.
