# Implementation Plan: Blog & CV Portfolio Landing Page

**Branch**: `001-blog-cv-portfolio` | **Date**: 2026-06-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-blog-cv-portfolio/spec.md`

## Summary

Build a personal portfolio website with a landing page that serves as an
interactive CV and a blog section for articles. The landing page presents the
owner's professional profile (hero, about, experience, education, skills,
projects, contact). The blog section lists and renders MDX posts. The entire
site is statically generated using Next.js App Router with Tailwind CSS for
styling and file-based content (MDX + JSON) for all data.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) on Node.js 20+

**Primary Dependencies**: Next.js 15 (App Router, static export), Tailwind CSS
v4, MDX (via next-mdx-remote/rsc), gray-matter for frontmatter parsing

**Storage**: File-based — MDX files for blog posts, JSON files for CV data
(profile, experience, education, skills, projects, social links)

**Testing**: Vitest for unit/component tests (only if requested)

**Target Platform**: Static web — deployed to Vercel, Netlify, or GitHub Pages

**Project Type**: Static website (web-app with `output: 'export'`)

**Performance Goals**: Lighthouse Performance 90+, SEO 95+, first contentful
paint under 2s on 4G

**Constraints**: Fully static — no server runtime, no API routes, no
middleware. Images served unoptimized with pre-compressed assets.

**Scale/Scope**: Single-user portfolio, ~5–20 blog posts, ~5–10 pages total

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First UI | PASS | All sections built as reusable components with props |
| II. Content as Data | PASS | All content in MDX/JSON files, zero hardcoded content |
| III. Performance and SEO | PASS | Static export, meta tags, sitemap, robots.txt, optimized images |
| IV. Responsive and Accessible | PASS | Mobile-first Tailwind, semantic HTML, WCAG 2.1 AA target |
| V. Simplicity (YAGNI) | PASS | No CMS, no auth, no DB, no API routes, minimal deps |

**Result**: All gates PASS. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-blog-cv-portfolio/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── routes.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── not-found.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── layout/
│   │   ├── header.tsx
│   │   └── footer.tsx
│   ├── sections/
│   │   ├── hero.tsx
│   │   ├── about.tsx
│   │   ├── experience.tsx
│   │   ├── education.tsx
│   │   ├── skills.tsx
│   │   ├── projects.tsx
│   │   └── contact.tsx
│   ├── blog/
│   │   ├── post-card.tsx
│   │   └── post-list.tsx
│   └── ui/
│       ├── section-heading.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       └── icon-link.tsx
├── content/
│   ├── profile.json
│   ├── experience.json
│   ├── education.json
│   ├── skills.json
│   ├── projects.json
│   └── social-links.json
├── lib/
│   ├── posts.ts
│   └── data.ts
└── types/
    └── index.ts

posts/
├── hello-world.mdx
└── ...

public/
├── images/
│   ├── avatar.webp
│   └── projects/
│       └── ...

next.config.ts
tailwind.config.ts (if needed, else CSS-based config)
tsconfig.json
package.json
```

**Structure Decision**: Single frontend project. No backend needed — all data
is file-based and loaded at build time through Server Components. Content
files (`content/*.json`, `posts/*.mdx`) are separate from components to honor
the Content as Data principle.

## Complexity Tracking

> No violations — table left empty.
