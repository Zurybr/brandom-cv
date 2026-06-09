# Research: Migrate from Next.js to Astro

**Feature**: `002-migrate-next-astro` | **Date**: 2026-06-09

## R1: Astro Version and Configuration

**Decision**: Use Astro v5 (latest stable) with static output mode.

**Rationale**: Astro v5 is the current major version with stable Content Collections API (using `src/content.config.ts`), glob loaders, and built-in MDX support. The project requires static generation only — no server-side rendering — which is Astro's default and strongest use case.

**Alternatives considered**:
- Astro v4: Older, different Content Collections API (used `src/content/config.ts`). Migration path exists but v5 is more mature.
- Remix/SvelteKit: Different paradigms, don't align with the zero-JS-by-default goal as naturally.

**Configuration**:
- `output: "static"` (default — no config needed)
- `site: "https://zurybr.github.io"` (required for sitemap)
- Integrations: `@astrojs/mdx`, `@astrojs/sitemap`, `@tailwindcss/vite`

## R2: Content Collections for Blog Posts

**Decision**: Use Astro Content Collections with Zod schemas defined in `src/content.config.ts`. Blog posts stored in `src/content/blog/` as MDX files. Use the `glob` loader.

**Rationale**: Content Collections provide type-safe frontmatter validation, automatic TypeScript types, and a first-class API for querying content. This replaces `gray-matter` + `next-mdx-remote` + custom `posts.ts` with a single, integrated system.

**Migration impact**:
- Move `posts/*.mdx` → `src/content/blog/*.mdx`
- Delete `src/lib/posts.ts` (gray-matter, fs, path imports)
- Delete `gray-matter` and `next-mdx-remote` dependencies
- Frontmatter remains identical — no content file changes needed

**Schema**:
```typescript
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string().optional(),
    excerpt: z.string(),
    readingTime: z.string().optional(),
  }),
});
```

## R3: CV Data as Content Collections vs. JSON Imports

**Decision**: Keep CV data as JSON files but move them into a Content Collection using the `file` loader for `skills.json` and `glob` loader for individual entity files. Alternatively, continue using direct JSON imports (simpler).

**Rationale**: Astro can import JSON files natively. The current `src/content/*.json` files work as-is with `import data from './data.json'`. Using Content Collections for CV data adds schema validation but is not strictly necessary. The simpler approach (direct JSON imports) aligns with the YAGNI principle.

**Chosen approach**: Direct JSON imports for CV data (no collection), Content Collection only for blog posts. This keeps things simple and the JSON files can be migrated to collections later if needed.

**Migration impact**:
- Keep `src/content/*.json` files as-is
- Delete `src/lib/data.ts` access layer — components import JSON directly or receive via props
- Type definitions remain in `src/types/index.ts`

## R4: Component Migration Strategy

**Decision**: Convert all React components (`.tsx`) to Astro components (`.astro`). No React framework integration needed.

**Rationale**: All existing components are server-rendered React components with no client-side interactivity (except `header.tsx`). Astro components provide the same server-rendering model with zero JS output. The header's mobile menu toggle can use an inline `<script>` tag.

**Migration mapping**:
- `.tsx` → `.astro` (all components)
- Props become `Astro.props` with TypeScript `Props` interface
- `className` → `class`
- `{/* comments */}` → `<!-- comments -->`
- `next/image` → `<img>` tag (static site, no optimization server needed) or Astro's `<Image />` component
- `next/link` → `<a>` tag (Astro uses standard HTML)
- `'use client'` header → `<script>` tag with `is:inline` for mobile menu

## R5: Routing and Page Structure

**Decision**: Use Astro's file-based routing in `src/pages/`. Mirrors Next.js App Router structure.

**Rationale**: Astro's `src/pages/` directory works identically to Next.js — file paths map to URLs. Dynamic routes use `[slug].astro` with `getStaticPaths()`.

**Migration mapping**:
- `src/app/layout.tsx` → `src/layouts/Layout.astro`
- `src/app/page.tsx` → `src/pages/index.astro`
- `src/app/blog/page.tsx` → `src/pages/blog/index.astro`
- `src/app/blog/[slug]/page.tsx` → `src/pages/blog/[slug].astro`
- `src/app/not-found.tsx` → `src/pages/404.astro`
- `src/app/robots.ts` → `public/robots.txt` (static file)
- `src/app/sitemap.ts` → handled by `@astrojs/sitemap` integration

## R6: Tailwind CSS Integration

**Decision**: Use `@tailwindcss/vite` plugin (Tailwind CSS v4) via `npx astro add tailwind`.

**Rationale**: The project already uses Tailwind CSS v4 with the `@tailwindcss/postcss` plugin. Astro supports Tailwind v4 natively via the Vite plugin. The `globals.css` with `@import "tailwindcss"` and `@theme inline` block works as-is.

**Migration impact**:
- Replace `postcss.config.mjs` with Vite plugin in `astro.config.mjs`
- Keep `globals.css` (renamed to `src/styles/global.css`) — content unchanged
- All Tailwind classes in components work identically

## R7: SEO and Metadata

**Decision**: Use Astro's `<head>` tag directly in layout components. No special API needed.

**Rationale**: Astro layouts have full control over the `<html>`, `<head>`, and `<body>` tags. Meta tags, Open Graph, and structured data are added directly in the layout's `<head>` section. The `@astrojs/sitemap` integration handles sitemap generation automatically.

**Migration impact**:
- Next.js `Metadata` export → inline `<head>` tags in layouts/pages
- `sitemap.ts` → deleted (handled by `@astrojs/sitemap`)
- `robots.ts` → `public/robots.txt` static file

## R8: Reading Time Computation

**Decision**: Compute reading time at build time using a utility function, stored in the blog post rendering pipeline.

**Rationale**: The current `computeReadingTime()` in `posts.ts` is a simple word-count function. In Astro, this can be done in the page component's frontmatter script when rendering blog posts, or as a helper in a utility file.

**Migration impact**:
- Move `computeReadingTime()` to `src/lib/utils.ts`
- Apply in blog listing and detail pages

## R9: ESLint and Prettier for Astro

**Decision**: Use `eslint-plugin-astro` and `prettier-plugin-astro` for linting and formatting `.astro` files.

**Rationale**: Astro has official ESLint and Prettier plugins. These extend the existing toolchain to understand `.astro` file syntax.

**Migration impact**:
- Add `eslint-plugin-astro` to devDependencies
- Add `prettier-plugin-astro` to devDependencies
- Update ESLint config to include `.astro` files
- Prettier config picks up the plugin automatically

## R10: Images Handling

**Decision**: Use standard `<img>` tags for avatar and project images. Consider Astro's built-in `<Image />` component for automatic optimization.

**Rationale**: The current site uses `next/image` with `unoptimized: true` (required for static export). Astro's `<Image />` component can optimize images at build time without a server. Start with `<img>` for simplicity (YAGNI) and upgrade to `<Image />` if optimization is needed.

**Migration impact**:
- `next/image` `<Image>` → `<img>` or Astro `<Image />`
- Avatar image path remains the same (`/images/avatar.webp`)

## R11: Constitution Amendment Required

**Decision**: The Technology Stack section in the constitution must be amended from "Next.js (App Router) with static export" to "Astro with static generation".

**Rationale**: The constitution explicitly lists Next.js as the framework. This migration changes the framework, so the constitution must be updated following the amendment process (proposal, verification, version bump).

**Migration impact**:
- Update constitution.md Technology Stack section
- Bump constitution version from 1.0.0 to 1.1.0
- Verify all existing principles still hold with Astro
