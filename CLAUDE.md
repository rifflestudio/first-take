# First Take — Claude Code Context

## What is First Take?

**First Take** is a Riffle IP / live event concept. It's a music event experience where the idea is to capture music in its rawest, most instinctive form — the first take is always the most honest one. The name captures Riffle's core philosophy: human expression before technical obedience, play before perfection.

This mini app is built for the First Take event in Bangalore (April 2026). It's a companion experience for attendees.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- `next-themes` for dark/light mode
- Framer Motion for animations
- Vercel Analytics

## Local Development

```bash
npm install
npm run dev
```

Build: `npm run build`

## Brand & Design System

### Core Identity

- **Company:** Riffle (riffle.studio)
- **Tone:** Artistic, human, anti-sterile. Poetic and direct. Philosophy-forward.
- **Brand colour:** `#d0ff54` (lime/yellow-green) — used for primary CTAs, highlights
- **Dark background:** `#151516` / `#1a1a1c`
- **Light background:** `#f4f3f1` / `#eceae4`
- **Default theme:** Dark

### Typography

Riffle uses the **205TF Milling Triplex** font family exclusively — a custom editorial typeface in multiple "stroke widths":

| Variable | Font File | Use |
|---|---|---|
| `--font-triplex-1mm` | `205TF-Milling-Triplex1mm.woff2` | UI labels, captions |
| `--font-triplex-2mm` | `205TF-Milling-Triplex2mm.woff2` | Body copy, headings |
| `--font-triplex-3mm` | `205TF-Milling-Triplex3mm.woff2` | Large display, countdown |
| `--font-triplex-5mm` | `205TF-Milling-Triplex4,5mm.woff2` | Hero display |

Fonts live in `public/fonts/205TF_8920/`.

Typical heading: `font-family: var(--font-triplex-2mm); font-weight: 400; letter-spacing: 0.02em`
Typical label: `text-[11px] font-semibold uppercase tracking-[0.35em]` (using 1mm or 2mm)

### CSS Design Tokens (globals.css)

```css
/* Light mode defaults */
--surface: #f4f3f1;
--surface-muted: #eceae4;
--surface-panel: #fffdfa;
--surface-card: #ffffff;
--text-primary: #131316;
--text-muted: #6f6f78;
--brand: #d0ff54;          /* THE accent colour */
--accent-deep: #0b0b0b;
--border-soft: rgba(13,13,13,0.08);
--border-strong: rgba(13,13,13,0.18);

/* Dark mode */
--surface: #151516;
--surface-muted: #1a1a1c;
--surface-panel: #1f1f22;
--surface-card: #252528;
--text-primary: #f3f3f3;
--text-muted: #9b9dac;
--brand: #d0ff54;          /* same in dark */
```

### Tailwind Utility Classes (defined in globals.css @layer utilities)

- `bg-surface`, `bg-surface-soft`, `bg-panel`, `bg-card`
- `text-primary`, `text-muted`
- `bg-brand`, `text-brand`
- `border-soft`, `border-strong`
- `shadow-card`, `shadow-button`, `shadow-record`

### Button Style

```tsx
// Primary CTA — dark on brand yellow
<a className="inline-flex items-center justify-center rounded-full border-transparent px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] shadow-button transition hover:translate-y-0.5"
   style={{ backgroundColor: "#d0ff54", color: "#000000" }}>
  action
</a>

// Dark CTA (light mode)
style={{ backgroundColor: "rgba(21, 21, 22, 0.80)", color: "#ffffff" }}
```

### Custom Cursor

The marketing site uses a square (non-circle) custom cursor. The cursor turns brand yellow (`#d0ff54`) on hover over clickable elements. Use `data-cursor-dark` attribute on elements that need the dark cursor variant.

```css
.cursor-main { width: 16px; height: 16px; border-radius: 0; }
.cursor-trail { width: 12px; height: 12px; border-radius: 0; }
```

### Animations & Interactions

- Manifesto text: lines fade in at low opacity (20% dark / 80% light) — the one "in view" (closest to viewport center) gets full opacity
- Vinyl record: slow CSS spin (`animation: spin-slow 20s linear infinite`)
- Buttons: `hover:translate-y-0.5 active:translate-y-0.5` (subtle press down)
- Scroll: smooth, scrollbars hidden

## Key Manifesto Lines (Riffle Brand Voice)

> "before we learned to speak, we had music."
> "human expression cannot survive technical obedience."
> "the only path back to musical freedom is through play."
> "we exist to restore that freedom."
> "an infinite playground where music returns to what it's always been: the most human form of expression."

Use this voice for any First Take copy. Raw, lowercase, poetic.

## File Structure

```
app/
  layout.tsx          — Root layout, fonts, theme, metadata
  page.tsx            — Main page
  globals.css         — Design tokens, font-faces, utilities
  components/         — UI components
public/
  fonts/205TF_8920/   — Milling Triplex font files (1mm, 2mm, 3mm, 4.5mm)
  logo-monogram.svg   — Riffle monogram logo
  riffle-full-logo.svg — Full wordmark
```

## Component Patterns (from rifflestudio/studio-web)

The studio web app (`san-francisco`) has a full component library in `components/ui/`:
- `Button` — multiple variants (default/primary/secondary/outline/ghost/destructive/glass/link), sizes (sm/default/lg/xl/icon)
- `FloatingButton` — FAB for primary actions
- `PillButton` — toggles, tabs
- `IconButton` — icon-only buttons
- `GlassPanel` — glassmorphism floating panels (`bg-glass-bg border border-glass-border backdrop-blur-xl`)
- `Surface` — base surface with elevation levels

## Coding Rules

- Keep tone aligned with brand voice: artistic, human, anti-sterile
- Prefer `??` over `||` only when left operand can be null/undefined
- Dark mode is the default theme
- All button CTAs use `rounded-full` (pill shape)
- Typography: never use system fonts — always Milling Triplex
- Scrollbars: hidden (`scrollbar-width: none`)
- Custom cursor: keep square (no border-radius)
- Letter spacing on uppercase labels: `tracking-[0.35em]`

## Known Notes

- Fonts are licensed (205TF) — do not expose or redistribute
- The `brand & product context/` folder in this repo contains the Riffle marketing site and studio web app for reference — do not modify those
- Next.js may warn about `viewport` in metadata export — this is a known minor issue
