# Tasks: Blog & CV Portfolio Landing Page

**Input**: Design documents from `/specs/001-blog-cv-portfolio/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested — test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `src/` at repository root (single frontend project)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Next.js 15 project with TypeScript, App Router, and Tailwind CSS v4 using `npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-eslint --import-alias "@/*"` in repository root
- [x] T002 Install additional dependencies: `npm install next-mdx-remote gray-matter`
- [x] T003 [P] Configure static export and unoptimized images in `next.config.ts` with `output: 'export'` and `images: { unoptimized: true }`
- [x] T004 [P] Configure ESLint and Prettier: `npm install -D eslint prettier eslint-config-prettier` and create `.prettierrc` with `{ "semi": false, "singleQuote": true, "tabWidth": 2, "trailingComma": "es5" }`
- [x] T005 [P] Add scripts to `package.json`: `"build": "next build"`, `"dev": "next dev"`, `"lint": "eslint src/"`, `"format": "prettier --write src/"`
- [x] T006 [P] Create directory structure: `src/components/layout/`, `src/components/sections/`, `src/components/blog/`, `src/components/ui/`, `src/content/`, `src/lib/`, `src/types/`, `posts/`, `public/images/projects/`
- [x] T007 [P] Create global styles in `src/app/globals.css` with Tailwind v4 import (`@import "tailwindcss"`) and custom theme variables for colors, fonts, and spacing using `@theme` directive
- [x] T008 [P] Create placeholder avatar image at `public/images/avatar.webp` (any temporary placeholder)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Define all TypeScript interfaces in `src/types/index.ts`: `Profile`, `Experience`, `Education`, `SkillGroup`, `Project`, `SocialLink`, `BlogPost`, `BlogPostFrontmatter` matching the data-model.md entity definitions
- [x] T010 Create `src/lib/data.ts` with typed accessor functions: `getProfile()`, `getExperience()`, `getEducation()`, `getSkills()`, `getProjects()`, `getSocialLinks()` — each reads and parses the corresponding JSON file from `src/content/` and returns typed data
- [x] T011 Create `src/lib/posts.ts` with functions: `getAllPosts()` (reads all MDX from `posts/`, parses frontmatter with gray-matter, derives slug from filename, computes readingTime from word count, returns sorted by date desc), `getPostBySlug(slug)` (returns single post with raw MDX content), `getAllPostSlugs()` (returns slug array for generateStaticParams)
- [x] T012 [P] Create `src/content/profile.json` with Brandom's real data: `{ "name": "Brandom Rafael Ledesma Muñoz", "title": "Principal AI Engineer & Software Architect", "summary": "Software Architect and Nanotechnology Engineer focused on the intersection of complex systems, AI orchestration, and production-grade software. I specialize in designing multi-agent cognitive architectures, real-time event-driven systems, and seamless AI-UI interface layers.", "avatar": "/images/avatar.webp", "location": "Mexico City", "email": "brandom.ledesma@gmail.com", "resumeUrl": "" }`
- [x] T013 [P] Create `src/content/experience.json` with Brandom's 3 work experiences: Reumedika/Lefarma-Artricenter (Oct 2025–Present, Principal AI Engineer), MILANO/DESICI (Sep 2023–Oct 2025, Lead Developer/FullStack Consultant), DESICI (Dec 2020–Sep 2023, FullStack Developer) — each entry with company, role, period, description (combined bullet points), technologies array
- [x] T014 [P] Create `src/content/education.json` with Brandom's education: `{ "institution": "Universidad Politécnica del Valle de México (UPVM)", "degree": "B.S. in Nanotechnology Engineering", "period": "Graduated: 2021", "description": "Continuous education through verified coursework (Platzi, Udemy) in AI & Agentic Architectures, Real-Time Distributed Systems, and Modern Full-Stack Infrastructures." }` and languages: Spanish (Native), English (Intermediate B1-B2)
- [x] T015 [P] Create `src/content/skills.json` with Brandom's skills grouped by category: "AI & Orchestration" (Agent Orchestration Patterns, Prompt Engineering, Evaluation Frameworks, Cognitive Architectures, Structured Outputs, LangGraph, scikit-learn, PyTorch, NumPy), "Languages" (Python, TypeScript, C#, JavaScript, SQL), "Backend" (.NET/.NET Core, Django, Node.js, FastAPI, Flask, NestJS, Prisma), "Frontend" (React, Next.js, Angular 17, Tailwind CSS), "Infrastructure & Data" (SQL Server, Oracle, PostgreSQL, BigQuery, DB2, Docker, Azure, Git, Linux), "Methodologies" (SDD, AI-First Development, Event-Driven Architectures, Agile Leadership)
- [x] T016 [P] Create `src/content/projects.json` with an empty array `[]` as placeholder (Brandom can add projects later)
- [x] T017 [P] Create `src/content/social-links.json` with Brandom's links: `{ "platform": "GitHub", "url": "https://github.com/Zurybr", "icon": "github" }`, `{ "platform": "LinkedIn", "url": "https://linkedin.com/in/brandomled", "icon": "linkedin" }`, `{ "platform": "Email", "url": "mailto:brandom.ledesma@gmail.com", "icon": "mail" }`, `{ "platform": "Website", "url": "https://zurybr.github.io/main/", "icon": "globe" }`

**Checkpoint**: Foundation ready — types, data accessors, and content files are in place. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 — Browse Portfolio Landing Page (Priority: P1) MVP

**Goal**: Visitor sees a polished landing page with all CV sections: Hero, About, Experience, Education, Skills, Projects, Contact.

**Independent Test**: Load `http://localhost:3000/` and verify all sections render with Brandom's real data.

### Shared UI Components

- [x] T018 [P] [US1] Create `src/components/ui/section-heading.tsx` — accepts `title` and optional `subtitle` props, renders an accessible `<section>` heading with consistent styling (h2, underline accent, responsive sizing)
- [x] T019 [P] [US1] Create `src/components/ui/card.tsx` — accepts `children`, optional `className` props, renders a styled card container with rounded corners, subtle shadow, and padding
- [x] T020 [P] [US1] Create `src/components/ui/badge.tsx` — accepts `text` prop, renders a small pill/tag element for technology labels and skill items
- [x] T021 [P] [US1] Create `src/components/ui/icon-link.tsx` — accepts `href`, `icon`, `label`, optional `external` props, renders an accessible link with an SVG icon and text. If `external`, opens in new tab with `rel="noopener noreferrer"`

### Section Components

- [x] T022 [P] [US1] Create `src/components/sections/hero.tsx` — accepts `Profile` props, renders a full-width hero section with name (h1), title (h2), summary paragraph, and a subtle background gradient or pattern. Mobile-first: stacked layout on small screens, side-by-side on desktop with avatar
- [x] T023 [P] [US1] Create `src/components/sections/about.tsx` — accepts `summary` string prop, renders an "About Me" section with the profile summary. Uses `SectionHeading` component
- [x] T024 [P] [US1] Create `src/components/sections/experience.tsx` — accepts `Experience[]` props, renders a timeline-style list of work experiences. Each entry shows company, role (h3), period, description, and technology badges using `Badge` component. Uses `SectionHeading`
- [x] T025 [P] [US1] Create `src/components/sections/education.tsx` — accepts `Education[]` props, renders education entries as cards. Each shows institution (h3), degree, period, and description. Uses `SectionHeading` and `Card`
- [x] T026 [P] [US1] Create `src/components/sections/skills.tsx` — accepts `SkillGroup[]` props, renders skills grouped by category. Each category has a heading (h3) and a grid of `Badge` components for individual skills. Uses `SectionHeading`
- [x] T027 [P] [US1] Create `src/components/sections/projects.tsx` — accepts `Project[]` props, renders featured projects as a grid of `Card` components. Each card shows title, description, technology badges, and links (liveUrl, repoUrl) via `IconLink`. Shows empty state "Próximamente más proyectos." if array is empty. Uses `SectionHeading`
- [x] T028 [US1] Create `src/app/page.tsx` — landing page that imports all section components and passes data from `lib/data.ts`. Renders: `<Hero>`, `<About>`, `<Experience>`, `<Education>`, `<Skills>`, `<Projects>`, `<Contact>`. Export static metadata with title "Brandom Ledesma — Principal AI Engineer & Software Architect" and Open Graph tags
- [x] T029 [US1] Create `src/components/sections/contact.tsx` — accepts `SocialLink[]` and `email` props, renders a contact section with social links using `IconLink` components and a "Get in Touch" heading. Uses `SectionHeading`

### Layout

- [x] T030 [US1] Create `src/components/layout/footer.tsx` — renders a simple footer with copyright "© 2026 Brandom Ledesma" and links to social profiles. Minimal, dark background
- [x] T031 [US1] Update `src/app/layout.tsx` — wrap children with `<html lang="es">`, include `<Header />` and `<Footer />`, set global font (system sans-serif or Google Font), import `globals.css`, add base metadata (site name, description)

**Checkpoint**: At this point, the landing page at `/` should be fully functional and testable with Brandom's real CV data. All sections render, responsive layout works, meta tags are present.

---

## Phase 4: User Story 2 — Read Blog Posts (Priority: P2)

**Goal**: Visitor can browse `/blog` to see a list of posts and click into a full post at `/blog/[slug]`.

**Independent Test**: Navigate to `/blog`, see post cards, click into a post, read full MDX content with formatting.

### Blog Components

- [x] T032 [P] [US2] Create `src/components/blog/post-card.tsx` — accepts `BlogPost` props (title, slug, date, category, excerpt, readingTime), renders a card linking to `/blog/{slug}` with title (h3), formatted date, category badge, excerpt, and reading time
- [x] T033 [P] [US2] Create `src/components/blog/post-list.tsx` — accepts `BlogPost[]` props, renders a grid of `PostCard` components. Shows empty state "Aún no hay publicaciones." if array is empty

### Blog Pages

- [x] T034 [US2] Create sample blog post at `posts/hello-world.mdx` with frontmatter: `title: "Hola Mundo — Mi primer post"`, `date: "2026-06-09"`, `category: "General"`, `excerpt: "Bienvenido a mi blog personal."` and body with headings, paragraphs, a code block, and a list to validate MDX rendering
- [x] T035 [US2] Create `src/app/blog/page.tsx` — blog listing page that calls `getAllPosts()` from `lib/posts.ts`, renders `<PostList>`, exports static metadata with title "Blog — Brandom Ledesma"
- [x] T036 [US2] Create `src/app/blog/[slug]/page.tsx` — blog post detail page with `generateStaticParams` returning all slugs, `dynamicParams = false`, uses `compileMDX` from `next-mdx-remote/rsc` to render post body, displays title (h1), date, category, reading time above the content. `generateMetadata` returns post-specific title and description. Add custom MDX components for styled code blocks (`pre`/`code` with monospace font and background), images, and blockquotes

**Checkpoint**: Blog listing at `/blog` and individual posts at `/blog/[slug]` are fully functional and testable independently.

---

## Phase 5: User Story 3 — Navigate Between Sections (Priority: P3)

**Goal**: Consistent, responsive navigation across all pages.

**Independent Test**: Click every nav link on every page, verify transitions and active states. Test mobile menu toggle.

### Navigation Components

- [x] T037 [US3] Create `src/components/layout/header.tsx` — a client component (`"use client"`) with a responsive navigation bar. Desktop: horizontal links to Home (`/`) and Blog (`/blog`). Mobile: hamburger icon toggles a slide-down menu with the same links. Uses `usePathname()` from `next/navigation` to highlight active link. Accessible: proper aria labels, keyboard navigable, focus trap on mobile menu when open
- [x] T038 [US3] Update `src/app/layout.tsx` — ensure `<Header />` is rendered in the layout so it appears on all pages including blog and 404
- [x] T039 [US3] Create `src/app/not-found.tsx` — custom 404 page with a friendly message "Página no encontrada" and a link back to home (`/`). Styled consistently with the site theme
- [x] T040 [US3] Add smooth scroll behavior to the landing page: update `src/app/globals.css` to add `html { scroll-behavior: smooth; }` so anchor links to sections scroll smoothly

**Checkpoint**: Navigation works across all pages. Mobile menu functions correctly. 404 page renders for invalid routes.

---

## Phase 6: User Story 4 — Contact and Social Links (Priority: P4)

**Goal**: Visitor can find and use social/contact links to reach Brandom.

**Independent Test**: Scroll to contact section, verify all links (GitHub, LinkedIn, email, website) are present and correct.

### Contact Integration

- [x] T041 [US4] Update `src/components/sections/contact.tsx` — ensure it renders all social links from `social-links.json` with correct icons (GitHub, LinkedIn, Mail, Globe). Email link uses `mailto:`, external links open in new tab. Add a brief "Let's connect" message above the links
- [x] T042 [US4] Add SVG icon components inline in `src/components/ui/icon-link.tsx` for: github, linkedin, mail, globe. Each rendered as a simple, accessible SVG within the link. Use a switch/map on the `icon` prop

**Checkpoint**: Contact section is fully functional with all Brandom's social links verified.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: SEO, performance, and final quality improvements

- [x] T043 [P] Create `src/app/sitemap.ts` — generates sitemap with home (`/`), blog listing (`/blog`), and all blog post URLs with their lastModified dates. Uses `getAllPostSlugs()` from `lib/posts.ts`
- [x] T044 [P] Create `src/app/robots.ts` — allows all crawlers, references sitemap URL at `https://zurybr.github.io/sitemap.xml`
- [x] T045 [P] Add Open Graph metadata to `src/app/page.tsx` — include `openGraph` with title, description, avatar image URL, site URL (`https://zurybr.github.io`)
- [x] T046 [P] Add Open Graph metadata to `src/app/blog/[slug]/page.tsx` — include `openGraph` with article type, title, description, publishedTime from post date
- [x] T047 Audit responsive design: test all pages at 320px, 768px, 1024px, and 1440px widths. Fix any layout breaks in section components. Ensure mobile menu works on touch devices
- [x] T048 Run `npm run build` and verify zero errors and zero warnings. Confirm `out/` directory is generated with all expected HTML files including `blog/` subdirectories and `sitemap.xml`
- [x] T049 [P] Verify accessibility: check all images have alt text, all links have descriptive text, color contrast meets WCAG AA, focus indicators are visible, heading hierarchy is correct (single h1 per page, h2 for sections, h3 for items)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–6)**: All depend on Foundational phase completion
  - US1 (Phase 3) can start after Phase 2
  - US2 (Phase 4) can start after Phase 2 (independent of US1)
  - US3 (Phase 5) depends on Phase 2 + ideally US1/US2 have pages to navigate between
  - US4 (Phase 6) depends on Phase 2 (contact section created in US1)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — No dependencies on other stories
- **US2 (P2)**: Can start after Phase 2 — Independent of US1
- **US3 (P3)**: Can start after Phase 2 — Needs pages from US1/US2 but header component is standalone
- **US4 (P4)**: Can start after Phase 2 — Contact section is part of US1 but can be enhanced independently

### Within Each User Story

- UI primitives (Phase 3) before section components
- Section components before page composition
- Content files can be created in parallel with components
- MDX setup before blog pages

### Parallel Opportunities

- T003, T004, T005, T006, T007, T008 can all run in parallel (Phase 1)
- T012–T017 can all run in parallel (Phase 2 content files)
- T018–T021 can all run in parallel (Phase 3 UI primitives)
- T022–T027 can all run in parallel (Phase 3 section components)
- T032–T033 can run in parallel (Phase 4 blog components)
- T043–T046, T049 can all run in parallel (Phase 7)

---

## Parallel Example: Phase 3 (US1)

```bash
# Launch all UI primitives together:
Task: "Create section-heading.tsx in src/components/ui/"
Task: "Create card.tsx in src/components/ui/"
Task: "Create badge.tsx in src/components/ui/"
Task: "Create icon-link.tsx in src/components/ui/"

# Then launch all section components together:
Task: "Create hero.tsx in src/components/sections/"
Task: "Create about.tsx in src/components/sections/"
Task: "Create experience.tsx in src/components/sections/"
Task: "Create education.tsx in src/components/sections/"
Task: "Create skills.tsx in src/components/sections/"
Task: "Create projects.tsx in src/components/sections/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Landing Page)
4. **STOP and VALIDATE**: Load `http://localhost:3000/`, verify all sections render
5. Deploy if ready — the MVP is a complete interactive CV

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → Landing page with full CV → **Deploy (MVP!)**
3. Add US2 → Blog section → Deploy
4. Add US3 → Navigation + 404 → Deploy
5. Add US4 → Contact section polish → Deploy
6. Phase 7 → SEO + accessibility audit → Final deploy

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Content files use Brandom's real CV data — no placeholder text
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
