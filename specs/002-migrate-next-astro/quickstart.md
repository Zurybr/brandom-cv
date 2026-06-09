# Quickstart Validation Guide: Migrate Next.js → Astro

**Feature**: `002-migrate-next-astro` | **Date**: 2026-06-09

## Prerequisites

- Node.js 18+ installed
- Existing portfolio site running on Next.js (current state)
- All content files present (`src/content/*.json`, `posts/*.mdx`)

## Setup Commands

```bash
# 1. Install Astro and dependencies
npm install astro @astrojs/mdx @astrojs/sitemap @tailwindcss/vite

# 2. Install dev dependencies
npm install -D eslint-plugin-astro prettier-plugin-astro

# 3. Remove Next.js dependencies
npm uninstall next react react-dom next-mdx-remote gray-matter

# 4. Start dev server
npm run dev
```

## Validation Scenarios

### Scenario 1: Homepage Renders All Sections

**Run**: `npm run dev` → open `http://localhost:4321`

**Verify**:
- [ ] Page loads without errors
- [ ] Hero section shows name ("Brandom Rafael Ledesma Munoz"), title, avatar
- [ ] About section shows summary text
- [ ] Experience section shows 3 work entries with timeline styling
- [ ] Education section shows UPVM card
- [ ] Skills section shows 6 category groups with badges
- [ ] Projects section shows empty state ("Pronto mas proyectos")
- [ ] Contact section shows GitHub, LinkedIn, Email, Globe links
- [ ] Footer shows "2026 Brandom Ledesma" with social icons

### Scenario 2: Blog Listing Works

**Navigate**: `http://localhost:4321/blog`

**Verify**:
- [ ] Page loads with "Blog" heading
- [ ] One post card visible: "Hola Mundo — Mi primer post"
- [ ] Card shows date (9 de junio de 2026), category badge, excerpt, reading time
- [ ] Clicking post title navigates to `/blog/hello-world`

### Scenario 3: Blog Post Detail Renders MDX

**Navigate**: `http://localhost:4321/blog/hello-world`

**Verify**:
- [ ] Post title "Hola Mundo — Mi primer post" renders as h1
- [ ] Date and reading time shown below title
- [ ] MDX content renders: paragraphs, code block, blockquote
- [ ] Code block has dark background and monospace font
- [ ] Blockquote has left border accent
- [ ] "Inicio" and "Blog" nav links work

### Scenario 4: Navigation and 404

**Verify**:
- [ ] Header shows "BL" brand, "Inicio" and "Blog" links
- [ ] Mobile hamburger menu toggles nav on small viewport
- [ ] Clicking "Inicio" → navigates to `/`
- [ ] Clicking "Blog" → navigates to `/blog`
- [ ] Navigate to `/nonexistent` → 404 page with link to home

### Scenario 5: Static Build Succeeds

**Run**: `npm run build`

**Verify**:
- [ ] Build completes with zero errors and zero warnings
- [ ] `dist/` directory is created
- [ ] `dist/index.html` exists (homepage)
- [ ] `dist/blog/index.html` exists (blog listing)
- [ ] `dist/blog/hello-world/index.html` exists (post detail)
- [ ] `dist/404.html` exists
- [ ] `dist/robots.txt` exists
- [ ] `dist/sitemap-index.xml` exists
- [ ] No JavaScript bundles in output for static pages (check no `.js` files except header script)

### Scenario 6: SEO Metadata Present

**Inspect** homepage `<head>`:
- [ ] `<title>` contains "Brandom Ledesma"
- [ ] `<meta name="description">` present
- [ ] Open Graph tags present (`og:title`, `og:description`, `og:url`, `og:type`)

**Inspect** blog post `<head>`:
- [ ] `<title>` contains post title
- [ ] `<meta property="article:published_time">` present
- [ ] `og:type` is "article"

### Scenario 7: Content Collection Validation

**Test**: Create a new MDX file with missing required frontmatter:

```bash
echo '---
title: "Test"
---
Content' > src/content/blog/test.mdx
```

**Verify**:
- [ ] Build fails with a Zod validation error indicating missing required fields

**Cleanup**: Delete the test file after validation.

### Scenario 8: Responsive Design

**Test** at each breakpoint:

- [ ] 320px: Content readable, no horizontal overflow
- [ ] 768px: Blog cards display in 2-column grid
- [ ] 1024px: Projects display in 2-column grid
- [ ] 1440px: Content centered with max-width

## Expected Outcomes

After completing all scenarios:
- All pages render identically to the Next.js version
- Static build produces HTML-only output (no JS bundles for content pages)
- Content Collections validate blog post frontmatter
- Development workflow (dev, build, lint, format) works as expected
