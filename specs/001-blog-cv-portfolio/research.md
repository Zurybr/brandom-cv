# Research: Blog & CV Portfolio Landing Page

**Date**: 2026-06-09

## 1. MDX Content Strategy

**Decision**: Use `next-mdx-remote/rsc` with `gray-matter` for blog posts.

**Rationale**:
- `next-mdx-remote/rsc` compiles MDX at build time in Server Components,
  compatible with `output: 'export'`.
- `gray-matter` parses YAML frontmatter from MDX files — lightweight,
  well-maintained, no schema overhead.
- Alternatives considered:
  - **Velite**: Type-safe schemas, excellent DX, but adds a build pipeline
    and extra config. Justified if the project grows to many content types,
    but overkill for the initial scope (YAGNI — Principle V).
  - **@next/mdx**: Official but requires MDX files as importable modules,
    no frontmatter support without extra tooling.
  - **Contentlayer**: Unmaintained, explicitly avoided.

**Implementation notes**:
- Blog posts stored as `posts/*.mdx` with YAML frontmatter.
- A `lib/posts.ts` module reads all MDX files at build time using
  `fs.readFileSync` and `gray-matter`, returns typed post objects.
- `next-mdx-remote/rsc`'s `compileMDX` renders the body in `[slug]/page.tsx`.
- `generateStaticParams` enumerates all slugs for static export.

## 2. CV Data Storage

**Decision**: Use JSON files in `src/content/` for all CV data.

**Rationale**:
- JSON is natively importable in TypeScript with full type inference.
- No parser dependency needed (unlike YAML).
- Each entity gets its own file: `profile.json`, `experience.json`,
  `education.json`, `skills.json`, `projects.json`, `social-links.json`.
- A `lib/data.ts` module exports typed accessor functions.
- Honors Principle II (Content as Data) — data is decoupled from components.

## 3. Static Export Configuration

**Decision**: Use `output: 'export'` with `images: { unoptimized: true }`.

**Rationale**:
- Full static generation meets Principle III (Performance and SEO) and
  Principle V (Simplicity).
- `unoptimized: true` for images because the default loader needs a server.
  The owner will pre-optimize images (WebP) before committing.
  `next/image` still provides lazy loading and layout shift prevention.
- No middleware, no API routes, no server actions — all unsupported with
  static export and unnecessary for this project.

**Limitations accepted**:
- No dynamic image optimization at request time.
- No ISR — full rebuild needed to update content (acceptable for a personal
  site with infrequent updates).

## 4. Tailwind CSS v4 Setup

**Decision**: Use Tailwind CSS v4 with `@tailwindcss/postcss`.

**Rationale**:
- Tailwind v4 eliminates the need for `tailwind.config.js` — configuration
  lives in CSS via `@theme` directives.
- Automatic content detection (no `content` array).
- PostCSS plugin: `@tailwindcss/postcss`.
- Minimal setup aligns with Principle V (Simplicity).

## 5. SEO Implementation

**Decision**: Use Next.js built-in Metadata API + `sitemap.ts` + `robots.ts`.

**Rationale**:
- Next.js App Router provides `export const metadata` for static meta tags
  and `generateMetadata()` for dynamic (per-blog-post) meta tags.
- Both `app/sitemap.ts` and `app/robots.ts` generate static files during
  build — fully compatible with `output: 'export'`.
- Open Graph tags set via the Metadata API's `openGraph` property.
- No third-party SEO library needed (YAGNI).

## 6. Navigation and 404

**Decision**: Use `app/not-found.tsx` for custom 404; shared header/footer
layout components.

**Rationale**:
- Next.js App Router supports `not-found.tsx` with static export.
- Header component renders on all pages via the root `layout.tsx`.
- Mobile menu implemented as a client component with React state toggle
  (minimal client-side JS, progressive enhancement).

## 7. Component Architecture

**Decision**: Each landing page section is a standalone component in
`src/components/sections/`. Shared UI primitives in `src/components/ui/`.

**Rationale**:
- Honors Principle I (Component-First UI) — each section accepts typed props
  and renders independently.
- Shared primitives (`SectionHeading`, `Card`, `Badge`, `IconLink`) ensure
  visual consistency without duplicating markup.
- Section components receive data via props from the page, which reads from
  `lib/data.ts` — clean separation of data fetching and rendering.

## 8. Type Safety

**Decision**: Define all entity types in `src/types/index.ts`. Content accessors
in `lib/data.ts` and `lib/posts.ts` return typed objects.

**Rationale**:
- TypeScript strict mode catches data shape mismatches at build time.
- Single source of truth for entity shapes — components import types, not
  raw data.
- Validates content files at build time rather than at runtime in production.
