# Portfolio — Brandom Ledesma

Personal portfolio built with [Astro](https://astro.build), Tailwind CSS v4, and Supabase.

## Setup

```bash
npm install
cp .env.example .env
# fill in the variables (see below)
npm run dev
```

Opens at `http://localhost:4321`.

## Environment Variables

Copy `.env.example` to `.env` and fill in the following:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### How to get each value

All values come from your [Supabase](https://supabase.com) project dashboard.

| Variable | Where to find it |
|---|---|
| `SUPABASE_URL` | Dashboard → **Connect** → Project URL |
| `SUPABASE_ANON_KEY` | Dashboard → **Connect** → Publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Dashboard → **Settings → API → Project API keys** → `service_role` |

> **Important:** `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security. Never expose it to the client — only use it in server-side Astro endpoints (`.ts` files inside `src/pages/api/`).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

## Deployment

Pushing to `main` auto-deploys to GitHub Pages via `.github/workflows/deploy.yml`.

- **Live site:** https://zurybr.github.io/brandom-cv/es/
- **Build:** `npm run build` (Astro → `dist/`)
- **Check deploy status:** `gh run list --branch main`
