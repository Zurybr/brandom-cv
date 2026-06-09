# Quickstart: Blog & CV Portfolio Landing Page

**Date**: 2026-06-09

## Prerequisites

- Node.js 20+
- npm or pnpm

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:3000. Verify:

1. Landing page loads with all CV sections (Hero, About, Experience,
   Education, Skills, Projects, Contact)
2. Navigate to `/blog` — blog listing page renders
3. Click a blog post — full MDX content renders correctly
4. Resize browser to 320px width — layout remains readable
5. Click nav links — navigation works on all pages
6. Visit a non-existent URL (e.g. `/no-existe`) — 404 page shows

## Production Build

```bash
npm run build
```

Verify:

1. Build completes with zero errors
2. `out/` directory is generated (static export)
3. Open `out/index.html` in browser — landing page renders correctly
4. Open `out/blog/index.html` — blog listing renders
5. Open `out/blog/[slug]/index.html` — blog post renders
6. `out/sitemap.xml` exists and lists all routes
7. `out/robots.txt` exists

## Content Validation

### Add a new blog post

1. Create `posts/my-new-post.mdx` with frontmatter:

```mdx
---
title: "Mi nuevo artículo"
date: "2026-06-09"
category: "Desarrollo"
excerpt: "Una breve descripción del artículo."
---

Contenido del artículo aquí.
```

2. Run `npm run dev` — verify the post appears in `/blog`
3. Click into the post — verify full content renders

### Update CV data

1. Edit any JSON file in `src/content/` (e.g., add an experience entry)
2. Run `npm run dev` — verify the landing page reflects changes

## Linting and Formatting

```bash
npm run lint
npm run format
```

Both MUST pass with zero errors.
