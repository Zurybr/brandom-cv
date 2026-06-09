# Tasks: Migrate from Next.js to Astro

**Input**: Design documents from `/specs/002-migrate-next-astro/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/routes.md

**Tests**: Not explicitly requested. Visual validation via quickstart.md scenarios.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install Astro, configure project, remove Next.js, prepare content migration

- [x] T001 Install Astro and integrations: `npm install astro @astrojs/mdx @astrojs/sitemap @tailwindcss/vite`
- [x] T002 [P] Install dev tooling: `npm install -D eslint-plugin-astro prettier-plugin-astro`
- [x] T003 [P] Uninstall Next.js dependencies: `npm uninstall next react react-dom next-mdx-remote gray-matter @types/react @types/react-dom`
- [x] T004 Create `astro.config.mjs` with MDX, sitemap, and Tailwind Vite plugin integrations, site set to `https://zurybr.github.io`
- [x] T005 Update `tsconfig.json` for Astro: set `moduleResolution: "bundler"`, add `"astro"` to types, update path alias `@/*` to `./src/*`, remove `next/babel` plugin
- [x] T006 Update `package.json` scripts: `dev` → `astro dev`, `build` → `astro build`, `start` → `astro preview`, keep `lint` and `format`
- [x] T007 [P] Move `src/app/globals.css` to `src/styles/global.css` (content unchanged)
- [x] T008 [P] Move `posts/hello-world.mdx` to `src/content/blog/hello-world.mdx`
- [x] T009 Create `src/content.config.ts` with blog Content Collection using glob loader and Zod schema (title, date, category?, excerpt) per research.md R2
- [x] T010 Create `src/lib/utils.ts` with `computeReadingTime(content: string): string` extracted from `src/lib/posts.ts`
- [x] T011 [P] Create `public/robots.txt` with `User-agent: *`, `Allow: /`, `Sitemap: https://zurybr.github.io/sitemap-index.xml` (replaces `src/app/robots.ts`)
- [x] T012 [P] Delete Next.js files: `next.config.ts`, `next-env.d.ts`, `postcss.config.mjs`
- [x] T013 [P] Delete default Next.js assets: `public/next.svg`, `public/vercel.svg`
- [x] T014 Delete old source directories: `src/app/`, `src/lib/data.ts`, `src/lib/posts.ts`, `posts/`
- [x] T015 Update `.prettierrc` to add `"plugins": ["prettier-plugin-astro"]`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core Astro layout and shared UI components that ALL pages depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T016 Convert root layout: create `src/layouts/Layout.astro` from `src/app/layout.tsx` — HTML shell with `<html lang="es">`, import `src/styles/global.css`, slot for page content, Header and Footer components, meta tags in `<head>` per contracts/routes.md layout contract
- [x] T017 Convert header: create `src/components/layout/header.astro` from `src/components/layout/header.tsx` — sticky nav with "BL" brand link, desktop nav links (Inicio, Blog), mobile hamburger button, mobile dropdown menu. Use `<script is:inline>` for menu toggle logic (Escape key close, focus management) replacing React hooks. Use `Astro.url.pathname` for active link detection replacing `usePathname()`
- [x] T018 Convert footer: create `src/components/layout/footer.astro` from `src/components/layout/footer.tsx` — copyright "2026 Brandom Ledesma" and social icon links via props `{ socialLinks: SocialLink[] }`
- [x] T019 [P] Convert UI component `src/components/ui/badge.astro` from `src/components/ui/badge.tsx` — `className` → `class`, props via `Astro.props`
- [x] T020 [P] Convert UI component `src/components/ui/card.astro` from `src/components/ui/card.tsx`
- [x] T021 [P] Convert UI component `src/components/ui/icon-link.astro` from `src/components/ui/icon-link.tsx` — inline SVGs unchanged, `className` → `class`
- [x] T022 [P] Convert UI component `src/components/ui/section-heading.astro` from `src/components/ui/section-heading.tsx`

**Checkpoint**: Foundation ready — Layout, Header, Footer, and all UI primitives available for page construction

---

## Phase 3: User Story 1 - Portfolio Site Built with Astro (Priority: P1) 🎯 MVP

**Goal**: Rebuild the entire portfolio/blog site in Astro so all existing pages render identically to the Next.js version

**Independent Test**: Run `astro dev`, load `/`, `/blog`, `/blog/hello-world`, `/nonexistent` — verify all content, navigation, styling, and SEO match the original

### Implementation for User Story 1

- [x] T023 [P] [US1] Convert section component `src/components/sections/hero.astro` from `src/components/sections/hero.tsx` — replace `next/image` `<Image>` with `<img>`, `className` → `class`, props `{ profile: Profile }`
- [x] T024 [P] [US1] Convert section component `src/components/sections/about.astro` from `src/components/sections/about.tsx` — props `{ summary: string }`
- [x] T025 [P] [US1] Convert section component `src/components/sections/experience.astro` from `src/components/sections/experience.tsx` — props `{ experience: Experience[] }`, uses Badge component
- [x] T026 [P] [US1] Convert section component `src/components/sections/education.astro` from `src/components/sections/education.tsx` — props `{ education: Education[] }`, uses Card component
- [x] T027 [P] [US1] Convert section component `src/components/sections/skills.astro` from `src/components/sections/skills.tsx` — props `{ skills: SkillGroup[] }`, uses Badge component
- [x] T028 [P] [US1] Convert section component `src/components/sections/projects.astro` from `src/components/sections/projects.tsx` — props `{ projects: Project[] }`, filter `featured !== false`, empty state "Pronto mas proyectos"
- [x] T029 [P] [US1] Convert section component `src/components/sections/contact.astro` from `src/components/sections/contact.tsx` — props `{ socialLinks: SocialLink[], email: string }`, uses IconLink component
- [x] T030 [P] [US1] Convert blog component `src/components/blog/post-card.astro` from `src/components/blog/post-card.tsx` — replace `next/link` `<Link>` with `<a>`, `className` → `class`, props `{ post: BlogPost }`
- [x] T031 [P] [US1] Convert blog component `src/components/blog/post-list.astro` from `src/components/blog/post-list.tsx` — grid of PostCards, empty state "Aun no hay publicaciones"
- [x] T032 [US1] Create homepage `src/pages/index.astro` from `src/app/page.tsx` — import all JSON data files directly, import all 7 section components, render in order (Hero, About, Experience, Education, Skills, Projects, Contact), add SEO meta tags in `<head>` per contracts/routes.md homepage contract
- [x] T033 [US1] Create blog listing page `src/pages/blog/index.astro` from `src/app/blog/page.tsx` — use `getCollection("blog")` to fetch posts, sort by date descending, compute readingTime via `computeReadingTime()`, pass to PostList component, add SEO meta tags per contracts/routes.md blog listing contract
- [x] T034 [US1] Create blog post detail page `src/pages/blog/[slug].astro` from `src/app/blog/[slug]/page.tsx` — implement `getStaticPaths()` using `getCollection("blog")`, render entry with `entry.render()`, format date as Spanish locale, compute readingTime, apply MDX component styling (h2, h3, p, pre, code, ul, ol, blockquote, a, img) matching existing Tailwind classes from `mdxComponents`, add SEO meta tags per contracts/routes.md blog post contract
- [x] T035 [US1] Create 404 page `src/pages/404.astro` from `src/app/not-found.tsx` — centered "404" heading, "Pagina no encontrada" message, link back to `/`

**Checkpoint**: At this point, User Story 1 should be fully functional — all pages render, navigation works, blog posts display, 404 handles missing routes

---

## Phase 4: User Story 2 - Zero-JS Static Output (Priority: P2)

**Goal**: Validate that the Astro build produces zero client-side JavaScript on content pages, with JS only for the mobile menu toggle

**Independent Test**: Run `astro build`, inspect `dist/` — confirm no `.js` bundles for homepage, blog listing, blog post pages. Only the header inline script should produce JS.

### Implementation for User Story 2

- [x] T036 [US2] Verify header.astro uses `<script is:inline>` (not `<script>`) for mobile menu to prevent Astro from bundling it as a module — ensure no framework runtime is included in `dist/`
- [x] T037 [US2] Audit all `.astro` components for accidental client-side JS — confirm no `client:*` directives, no `<script>` without `is:inline`, no React/Vue/Svelte imports
- [x] T038 [US2] Run `astro build` and inspect `dist/` output — confirm static HTML pages contain no `<script type="module">` tags except the header menu toggle, verify total JS payload is minimal

**Checkpoint**: Zero-JS output validated — Astro build produces near-zero client-side JavaScript

---

## Phase 5: User Story 3 - Developer Experience with Content Collections (Priority: P3)

**Goal**: Validate that Astro Content Collections provide type-safe frontmatter validation and that adding new posts requires no code changes

**Independent Test**: Create a new MDX file with valid frontmatter → verify it appears on blog listing. Create one with missing fields → verify build fails with Zod error.

### Implementation for User Story 3

- [x] T039 [US3] Verify Content Collection schema in `src/content.config.ts` enforces required fields (title, date, excerpt) via Zod — test by temporarily creating a post with missing `excerpt` and confirming build fails with validation error
- [x] T040 [US3] Verify TypeScript types are auto-generated for blog collection — confirm `getCollection("blog")` returns typed entries with `title`, `date`, `excerpt`, `category` fields accessible without casting
- [x] T041 [US3] Test content workflow: create a new MDX file `src/content/blog/test-post.mdx` with valid frontmatter, run `astro dev`, verify post appears at `/blog` without code changes, then delete test file

**Checkpoint**: Content Collections validated — schema enforcement works, type safety confirmed, zero-code post creation verified

---

## Phase 6: User Story 4 - Maintain Existing Project Conventions (Priority: P4)

**Goal**: Ensure dev server, build, lint, and format commands work identically to the Next.js workflow

**Independent Test**: Run `npm run dev`, `npm run build`, `npm run lint`, `npm run format` — all complete successfully with zero warnings

### Implementation for User Story 4

- [x] T042 [US4] Configure ESLint for Astro: update ESLint config to extend `plugin:astro/recommended`, add `.astro` file override in lint config, update `npm run lint` script to target `src/` with `--ext .astro,.ts,.tsx`
- [x] T043 [US4] Run `npm run format` and verify Prettier formats `.astro` files correctly using `prettier-plugin-astro`
- [x] T044 [US4] Run `npm run build` and verify zero warnings and zero errors in production build, confirm `dist/` output is complete
- [x] T045 [US4] Run `npm run dev` and verify dev server starts on `localhost:4321` with HMR working — edit a component, save, confirm browser auto-refreshes

**Checkpoint**: All developer workflow commands functional — migration is transparent to the developer's daily routine

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, constitution update, and full validation

- [x] T046 Update `.specify/memory/constitution.md` Technology Stack section: change "Next.js (App Router) with static export" to "Astro with static generation", bump version from 1.0.0 to 1.1.0, update Last Amended date to 2026-06-09
- [x] T047 [P] Update `AGENTS.md`: remove the Next.js warning block, add an Astro-specific note if needed (e.g., "Read Astro docs at node_modules/astro/dist/docs/ before writing code")
- [x] T048 [P] Verify all `src/types/index.ts` type definitions still match Astro component props — remove any Next.js-specific types (e.g., `BlogPost.body` as raw string is no longer needed since Astro renders MDX via Content Collections)
- [x] T049 [P] Clean up `public/` — remove any leftover Next.js assets (`file.svg`, `globe.svg`, `window.svg`) that are no longer referenced
- [x] T050 Run full quickstart.md validation: execute all 8 scenarios from `specs/002-migrate-next-astro/quickstart.md` and confirm every checkpoint passes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion — BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational (Phase 2) completion
  - US1 (Phase 3) is the MVP — must complete first
  - US2 (Phase 4) depends on US1 being implemented (needs built output to validate)
  - US3 (Phase 5) depends on US1 being implemented (needs Content Collections in pages)
  - US4 (Phase 6) depends on US1 being implemented (needs working project to lint/build)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2 only — no dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 (needs built output to inspect JS)
- **User Story 3 (P3)**: Depends on US1 (needs Content Collections used in pages)
- **User Story 4 (P4)**: Depends on US1 (needs working project to test commands)

### Within Each User Story

- Components before pages (pages import components)
- Layout before components (components may use layout primitives)
- Core implementation before validation
- Story complete before moving to next priority

### Parallel Opportunities

- Phase 1: T002, T003, T007, T008, T011, T012, T013 can all run in parallel
- Phase 2: T019-T022 (all 4 UI components) can run in parallel
- Phase 3: T023-T031 (all 9 section/blog components) can run in parallel
- Phase 7: T047, T048, T049 can run in parallel

---

## Parallel Example: Phase 2 (Foundational UI)

```text
# Launch all UI components together:
Task: "Convert badge.astro in src/components/ui/badge.astro"
Task: "Convert card.astro in src/components/ui/card.astro"
Task: "Convert icon-link.astro in src/components/ui/icon-link.astro"
Task: "Convert section-heading.astro in src/components/ui/section-heading.astro"
```

## Parallel Example: Phase 3 (US1 Components)

```text
# Launch all section components together:
Task: "Convert hero.astro in src/components/sections/hero.astro"
Task: "Convert about.astro in src/components/sections/about.astro"
Task: "Convert experience.astro in src/components/sections/experience.astro"
Task: "Convert education.astro in src/components/sections/education.astro"
Task: "Convert skills.astro in src/components/sections/skills.astro"
Task: "Convert projects.astro in src/components/sections/projects.astro"
Task: "Convert contact.astro in src/components/sections/contact.astro"
Task: "Convert post-card.astro in src/components/blog/post-card.astro"
Task: "Convert post-list.astro in src/components/blog/post-list.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (install Astro, move content, create config)
2. Complete Phase 2: Foundational (layout, header, footer, UI primitives)
3. Complete Phase 3: User Story 1 (all pages and sections)
4. **STOP and VALIDATE**: Run `astro dev` and test all pages per quickstart.md Scenarios 1-4
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test all pages independently → Deploy (MVP!)
3. Add User Story 2 → Validate zero-JS output → Confirm performance gains
4. Add User Story 3 → Validate Content Collections → Confirm developer experience
5. Add User Story 4 → Validate tooling → Confirm workflow parity
6. Polish → Constitution update, cleanup, full validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- The migration is a 1:1 framework swap — no new features, no UI changes
- All existing content files (JSON, MDX) are reused as-is
- The `src/types/index.ts` file may need minor adjustments to remove Next.js-specific types
