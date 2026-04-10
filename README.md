# first take — by riffle

Day-of companion app for **First Take**, a live music event by Riffle. Built for the inaugural event in Bangalore, April 11, 2026.

**Live:** [bangalore-rho.vercel.app](https://bangalore-rho.vercel.app)

---

## what it does

| Route | What |
|---|---|
| `/` | Event home — links to everything |
| `/queue` | Studio hours queue. 30-min sessions, real-time, no-show auto-advances |
| `/teams` | See who's here and what teams are in the room |
| `/join` | Sign up on arrival — name, Instagram, what you make |
| `/admin` | Manage the queue, people, and teams (password protected) |

## stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Supabase (Postgres + real-time subscriptions)
- Vercel

## local dev

```bash
npm install
npm run dev
```

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials.

## database

Run `supabase/schema.sql` in your Supabase SQL editor. Creates three tables: `teams`, `users`, `queue`.

## env vars

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE
NEXT_PUBLIC_ADMIN_PASSWORD
```

---

*riffle · the first take is always the most honest one.*
