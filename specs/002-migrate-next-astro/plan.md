# Implementation Plan: Migrate from Next.js to Astro

**Branch**: `002-migrate-next-astro` | **Date**: 2026-06-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-migrate-next-astro/spec.md`

## Summary

Migrate the existing blog/CV portfolio site from Next.js 15 (App Router, static export) to Astro 5 with Content Collections. The site remains a statically generated personal portfolio with the same pages, components, styling (Tailwind CSS v4), and content structure. Key changes: React components become Astro components, MDX rendering moves from `next-mdx-remote` to Astro Content Collections, and the data layer simplifies from custom loaders to direct imports + Zod-validated collections.

## Technical Context

**Language/Version**: TypeScript 5 (strict mode)

**Primary Dependencies**: Astro 5, @astrojs/mdx, @astrojs/sitemap, @tailwindcss/vite, Tailwind CSS 4, Zod (bundled with Astro)

**Storage**: File-based — JSON for CV data, MDX for blog posts (no database)

**Testing**: Visual validation via quickstart.md scenarios; Vitest available for unit tests if needed

**Target Platform**: Static hosting (GitHub Pages at zurybr.github.io, or Vercel/Netlify)

**Project Type**: Static web site (personal portfolio/blog)

**Performance Goals**: Lighthouse Performance 95+, SEO 95+; zero client-side JS on content pages

**Constraints**: Fully static output — no server runtime; all pages pre-rendered at build time

**Scale/Scope**: Single-user portfolio; ~10 pages total (home, blog index, blog posts, 404); ~26 source files to migrate

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Gate (Phase 0)

| Principle                              | Status | Notes                                                |
| -------------------------------------- | ------ | ---------------------------------------------------- |
| I. Component-First UI                  | PASS   | Astro components are reusable, accept props, no hardcoded content |
| II. Content as Data                    | PASS   | Content Collections + JSON imports; content decoupled from components |
| III. Performance and SEO               | PASS   | Astro's zero-JS output exceeds Next.js static export; sitemap integration available |
| IV. Responsive and Accessible Design   | PASS   | Unchanged — same Tailwind classes, same breakpoints |
| V. Simplicity (YAGNI)                  | PASS   | Astro is simpler than Next.js for static sites; fewer dependencies |

**Technology Stack violation**: Constitution lists "Next.js (App Router)" — requires amendment to "Astro". This is the explicit purpose of this feature.

**Development Workflow**: All 5 workflow rules remain satisfied:
- Local preview via `astro dev` (replaces `next dev`)
- Content changes reflected via HMR
- Component library page can be maintained
- Conventional commits unchanged
- Zero-warning builds enforced

**Verdict**: GATE PASSED — no blocking violations. Constitution amendment for Technology Stack is part of the migration scope.

### Post-Design Gate (Phase 1)

| Principle                              | Status | Notes                                                |
| -------------------------------------- | ------ | ---------------------------------------------------- |
| I. Component-First UI                  | PASS   | 11 Astro components organized in ui/, layout/, sections/, blog/ |
| II. Content as Data                    | PASS   | 6 JSON files + Content Collection for MDX; no hardcoded content |
| III. Performance and SEO               | PASS   | Static output, sitemap integration, meta tags in layout |
| IV. Responsive and Accessible Design   | PASS   | Same breakpoints and WCAG considerations             |
| V. Simplicity (YAGNI)                  | PASS   | Direct JSON imports (no data layer), no React runtime, no unnecessary deps |

**Verdict**: GATE PASSED — design complies with all principles.

## Project Structure

### Documentation (this feature)

```text
specs/002-migrate-next-astro/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 — technology decisions
├── data-model.md        # Phase 1 — entities and data loading
├── quickstart.md        # Phase 1 — validation scenarios
├── contracts/
│   └── routes.md        # Phase 1 — route contracts
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 (created by /speckit.tasks)
```

### Source Code (repository root)

```text
astro.config.mjs            # Astro configuration (replaces next.config.ts)
tsconfig.json               # TypeScript config (updated for Astro)
package.json                # Updated dependencies
postcss.config.mjs          # DELETED (Tailwind via Vite plugin now)
.prettierrc                 # Updated with prettier-plugin-astro

public/
├── robots.txt              # Static robots file (replaces robots.ts)
├── images/
│   ├── avatar.webp         # Profile avatar (unchanged)
│   └── projects/           # Project screenshots (unchanged, empty)

src/
├── content.config.ts       # NEW: Content Collections schema (blog posts)
├── content/
│   ├── profile.json        # CV data (unchanged)
│   ├── experience.json     # (unchanged)
│   ├── education.json      # (unchanged)
│   ├── skills.json         # (unchanged)
│   ├── projects.json       # (unchanged)
│   ├── social-links.json   # (unchanged)
│   └── blog/               # NEW: Blog post MDX files (moved from /posts)
│       └── hello-world.mdx
├── types/
│   └── index.ts            # Type definitions (unchanged)
├── lib/
│   └── utils.ts            # NEW: readingTime helper (extracted from posts.ts)
├── styles/
│   └── global.css          # Global styles (moved from src/app/globals.css)
├── layouts/
│   └── Layout.astro        # Root layout (replaces src/app/layout.tsx)
├── components/
│   ├── ui/
│   │   ├── badge.astro     # Badge pill (from badge.tsx)
│   │   ├── card.astro      # Card container (from card.tsx)
│   │   ├── icon-link.astro # Icon link (from icon-link.tsx)
│   │   └── section-heading.astro  # Section title (from section-heading.tsx)
│   ├── layout/
│   │   ├── header.astro    # Navigation bar (from header.tsx, inline script for mobile menu)
│   │   └── footer.astro    # Footer (from footer.tsx)
│   ├── sections/
│   │   ├── hero.astro      # Hero section (from hero.tsx)
│   │   ├── about.astro     # About section (from about.tsx)
│   │   ├── experience.astro # Experience timeline (from experience.tsx)
│   │   ├── education.astro # Education cards (from education.tsx)
│   │   ├── skills.astro    # Skills badges (from skills.tsx)
│   │   ├── projects.astro  # Project cards (from projects.tsx)
│   │   └── contact.astro   # Contact links (from contact.tsx)
│   └── blog/
│       ├── post-card.astro # Post preview card (from post-card.tsx)
│       └── post-list.astro # Post grid (from post-list.tsx)
└── pages/
    ├── index.astro         # Homepage (from src/app/page.tsx)
    ├── 404.astro           # Not found page (from src/app/not-found.tsx)
    └── blog/
        ├── index.astro     # Blog listing (from src/app/blog/page.tsx)
        └── [slug].astro    # Blog post detail (from src/app/blog/[slug]/page.tsx)

# DELETED files:
#   next.config.ts
#   next-env.d.ts
#   src/app/ (entire directory)
#   src/lib/data.ts
#   src/lib/posts.ts
#   posts/ (content moved to src/content/blog/)
#   public/next.svg, vercel.svg (Next.js default assets)
```

**Structure Decision**: Single-project Astro site. All source code lives under `src/` following Astro conventions: `pages/` for routing, `layouts/` for shared page shells, `components/` for reusable UI, `content/` for data and collections, `styles/` for global CSS.

## Complexity Tracking

| Violation                  | Why Needed                                      | Simpler Alternative Rejected Because        |
| -------------------------- | ----------------------------------------------- | ------------------------------------------ |
| Constitution amendment required | Framework change from Next.js to Astro     | Cannot use Astro without updating the documented stack |

No other violations — the migration simplifies the codebase (removes React runtime, removes gray-matter, removes next-mdx-remote, removes custom data access layer).
