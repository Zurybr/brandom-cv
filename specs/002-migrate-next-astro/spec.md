# Feature Specification: Migrate from Next.js to Astro

**Feature Branch**: `002-migrate-next-astro`

**Created**: 2026-06-09

**Status**: Draft

**Input**: User description: "Necesito cambiar la tecnología de Next a Astro"

## User Scenarios & Testing

### User Story 1 - Portfolio Site Built with Astro Instead of Next.js (Priority: P1)

The site owner (developer) wants to rebuild their existing blog/CV portfolio site
using Astro instead of Next.js. All current features — landing page, blog, CV
sections, navigation, SEO — must continue to work identically after the migration.
The developer benefits from Astro's content-first approach, zero-JS-by-default
output, and simpler mental model for a static site.

**Why this priority**: This is the core migration — the entire site must run on
Astro before any improvements or new features are added.

**Independent Test**: Can be fully tested by running the Astro dev server, loading
every existing page (home, blog listing, individual posts, 404), and verifying
that all content, navigation, styling, and SEO tags render identically to the
Next.js version.

**Acceptance Scenarios**:

1. **Given** the migrated Astro project, **When** a visitor loads the root URL,
   **Then** the landing page renders with all CV sections (hero, about, experience,
   education, skills, projects) and all data loads from structured content files.
2. **Given** the migrated Astro project, **When** a visitor navigates to `/blog`,
   **Then** the blog listing page displays all posts sorted by date with titles,
   dates, categories, and excerpts.
3. **Given** the blog listing page, **When** a visitor clicks a post, **Then**
   the full post renders at `/blog/[slug]` with proper MDX content formatting,
   metadata, and reading time.
4. **Given** any page on the migrated site, **When** the visitor views the
   navigation, **Then** they see the same consistent nav bar with Home, Blog,
   and responsive mobile menu.

---

### User Story 2 - Zero-JS Static Output (Priority: P2)

The developer wants the site to ship zero client-side JavaScript by default. Pages
must be fully static HTML at build time, with JS only added where explicitly needed
(e.g., the mobile menu toggle). This results in faster page loads and better
Lighthouse scores than the Next.js version.

**Why this priority**: A primary motivation for migrating to Astro is the
performance gain from zero-JS output. This must be validated as a core benefit.

**Independent Test**: Can be tested by building the site statically, inspecting
page output, and confirming that pages contain no unnecessary JavaScript bundles.

**Acceptance Scenarios**:

1. **Given** the built Astro site, **When** a page is inspected, **Then** the
   HTML output contains no JavaScript bundle for static content pages.
2. **Given** the built Astro site, **When** a visitor loads any page on a slow
   connection, **Then** above-the-fold content appears faster than the equivalent
   Next.js page did.

---

### User Story 3 - Developer Experience with Astro Content Collections (Priority: P3)

The developer wants to manage blog posts and CV data using Astro Content
Collections, which provide type-safe schema validation for frontmatter and a
first-class content authoring experience. This replaces the custom MDX loading
logic and manual type definitions used in the Next.js version.

**Why this priority**: Content Collections simplify the codebase and reduce
maintenance, but the site must be functional first (P1).

**Independent Test**: Can be tested by adding a new blog post with invalid
frontmatter and verifying that the build fails with a clear schema validation
error.

**Acceptance Scenarios**:

1. **Given** the Astro project with Content Collections, **When** a developer
   creates a new blog post file with correct frontmatter, **Then** it appears
   on the blog listing without any code changes.
2. **Given** the Astro project with Content Collections, **When** a developer
   creates a post with missing required frontmatter fields, **Then** the build
   fails with a descriptive validation error.

---

### User Story 4 - Maintain Existing Project Conventions (Priority: P4)

The developer wants the migrated project to keep the same development workflow:
local preview, conventional commits, zero-warning production builds, and the same
styling approach (Tailwind CSS). The migration should feel like a framework swap,
not a full rewrite of conventions.

**Why this priority**: Continuity in workflow ensures the developer doesn't lose
productivity during and after the migration.

**Independent Test**: Can be tested by running `dev`, `build`, `lint`, and
`format` commands and verifying they work as expected.

**Acceptance Scenarios**:

1. **Given** the Astro project, **When** the developer runs the dev command,
   **Then** a local dev server starts with hot module replacement.
2. **Given** the Astro project, **When** the developer runs the build command,
   **Then** a static build completes with zero warnings.
3. **Given** the Astro project, **When** the developer runs lint and format,
   **Then** ESLint and Prettier work on the Astro codebase.

---

### Edge Cases

- What happens when a visitor navigates to a non-existent blog post URL? A
  friendly 404 page MUST be shown with a link back to the home page.
- What happens when blog content is empty (no posts)? The blog listing MUST
  show a graceful empty state message.
- What happens when the site is built with no content files at all? The build
  MUST succeed with empty but valid pages.
- What happens with the mobile menu toggle? A small client-side script MUST
  handle the hamburger menu interaction without a full JS framework.

## Requirements

### Functional Requirements

- **FR-001**: The site MUST be built with Astro as the framework, replacing
  Next.js entirely.
- **FR-002**: The landing page MUST render at the root URL with all existing
  sections: hero, about, experience, education, skills, and projects.
- **FR-003**: All CV/profile data MUST load from structured content files
  (Markdown/JSON/YAML) — no hardcoded content in components.
- **FR-004**: The blog listing page MUST be available at `/blog` showing all
  posts sorted by date (newest first).
- **FR-005**: Each blog post MUST be accessible at `/blog/[slug]` with full
  MDX content, metadata (title, date, category, excerpt), and reading time.
- **FR-006**: Blog posts and CV data MUST use Astro Content Collections with
  schema validation for frontmatter.
- **FR-007**: The site MUST include consistent navigation on every page with
  links to Home and Blog, including a responsive mobile menu.
- **FR-008**: The site MUST display social/contact links (GitHub, LinkedIn,
  email) in a dedicated section.
- **FR-009**: A custom 404 page MUST be displayed for non-existent routes.
- **FR-010**: All pages MUST include proper meta tags (title, description,
  Open Graph) for SEO and social sharing.
- **FR-011**: The site MUST generate a sitemap.
- **FR-012**: All pages MUST be statically generated at build time — no
  server-side rendering at request time.
- **FR-013**: Tailwind CSS MUST be retained as the styling approach.
- **FR-014**: The project MUST build with zero warnings in production mode.
- **FR-015**: The existing Content as Data principle MUST be preserved —
  content files must remain decoupled from component code.

### Key Entities

- **Profile**: Owner's personal data — name, title, summary, avatar, location,
  social links (unchanged from original spec).
- **Experience**: Work history entries — company, role, period, description,
  technologies.
- **Education**: Academic entries — institution, degree, period, description.
- **Skill**: Categorized skills — category name, list of skill names.
- **Project**: Featured project — title, description, image, technologies,
  external URL, repository URL.
- **Blog Post**: Article — title, slug, date, category, excerpt, reading time,
  body content (MDX).
- **Social Link**: External profile — platform name, URL, icon identifier.

## Success Criteria

### Measurable Outcomes

- **SC-001**: All pages from the Next.js version render identically in the
  Astro version — same content, layout, and styling.
- **SC-002**: The Astro version achieves a Lighthouse Performance score of 95+
  (higher than the Next.js target of 90+) on all pages.
- **SC-003**: The Astro version ships less JavaScript to the browser than the
  Next.js version, with static content pages shipping zero JS.
- **SC-004**: The site builds statically and can be deployed to any static
  hosting platform (Netlify, Vercel, GitHub Pages).
- **SC-005**: Adding a new blog post requires only creating a new content file
  with no code changes.
- **SC-006**: The development workflow (dev server, build, lint, format)
  remains unchanged from the developer's perspective.

## Assumptions

- The site is currently a personal portfolio/blog with no server-side features
  (API routes, server actions) that would complicate the migration to a fully
  static framework.
- All existing content files (MDX posts, CV data) can be reused with minimal
  or no modifications.
- The developer will keep TypeScript as the project language.
- The developer will keep Tailwind CSS for styling.
- No client-side framework (React, Vue, Svelte) will be needed for the initial
  migration — Astro components alone are sufficient.
- The mobile menu toggle can be implemented with a small inline script
  (`<script>` tag in Astro) rather than requiring a JS framework.
- The existing project conventions (conventional commits, ESLint, Prettier)
  will continue with Astro-equivalent configurations.
- Deployment target remains a static hosting platform.
