# Data Model: Migrate from Next.js to Astro

**Feature**: `002-migrate-next-astro` | **Date**: 2026-06-09

## Overview

The data model remains unchanged from the existing Next.js implementation. This migration is a framework swap — the entities, their fields, and relationships are preserved. The key change is in **how** data is loaded and validated (Content Collections + Zod instead of manual JSON imports + custom loaders).

## Entities

### Profile

| Field        | Type     | Required | Description                        |
| ------------ | -------- | -------- | ---------------------------------- |
| name         | string   | yes      | Full display name                  |
| title        | string   | yes      | Professional title/role            |
| summary      | string   | yes      | Bio/summary paragraph              |
| avatar       | string   | yes      | Path to avatar image               |
| location     | string   | yes      | City, Country                      |
| email        | string   | yes      | Contact email address              |
| resumeUrl    | string   | no       | URL to downloadable resume         |

**Storage**: `src/content/profile.json`

### Experience

| Field         | Type     | Required | Description                        |
| ------------- | -------- | -------- | ---------------------------------- |
| company       | string   | yes      | Company name                       |
| role          | string   | yes      | Job title                          |
| period        | string   | yes      | Date range (e.g., "Oct 2025 - Present") |
| description   | string   | yes      | Role description                   |
| technologies  | string[] | yes      | Tech stack used                    |

**Storage**: `src/content/experience.json` (array)

### Education

| Field        | Type     | Required | Description                        |
| ------------ | -------- | -------- | ---------------------------------- |
| institution  | string   | yes      | School/university name             |
| degree       | string   | yes      | Degree/certification title         |
| period       | string   | yes      | Date range                         |
| description  | string   | yes      | Additional details                 |

**Storage**: `src/content/education.json` (array)

### SkillGroup

| Field    | Type     | Required | Description                        |
| -------- | -------- | -------- | ---------------------------------- |
| category | string   | yes      | Skill category name                |
| items    | string[] | yes      | Skills within this category        |

**Storage**: `src/content/skills.json` (array)

### Project

| Field         | Type     | Required | Description                        |
| ------------- | -------- | -------- | ---------------------------------- |
| title         | string   | yes      | Project name                       |
| description   | string   | yes      | Project description                |
| image         | string   | no       | Screenshot/image path              |
| technologies  | string[] | yes      | Tech stack                         |
| liveUrl       | string   | no       | Live demo URL                      |
| repoUrl       | string   | no       | Repository URL                     |
| featured      | boolean  | no       | Show on homepage (default: true)   |

**Storage**: `src/content/projects.json` (array)

### SocialLink

| Field    | Type   | Required | Description                         |
| -------- | ------ | -------- | ----------------------------------- |
| platform | string | yes      | Platform name (github, linkedin...) |
| url      | string | yes      | Profile/email URL                   |
| icon     | string | yes      | Icon identifier for SVG rendering   |

**Storage**: `src/content/social-links.json` (array)

### BlogPost (Content Collection)

| Field       | Type     | Required | Description                          |
| ----------- | -------- | -------- | ------------------------------------ |
| title       | string   | yes      | Post title                           |
| date        | Date     | yes      | Publication date (frontmatter)       |
| category    | string   | no       | Post category                        |
| excerpt     | string   | yes      | Short summary                        |
| readingTime | string   | no       | Computed reading time (not in frontmatter) |
| body        | MDX      | yes      | Post content (file body)             |

**Storage**: `src/content/blog/*.mdx` (Content Collection with Zod schema)

**Schema definition** (in `src/content.config.ts`):
```typescript
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string().optional(),
    excerpt: z.string(),
  }),
});
```

Note: `readingTime` is computed at render time, not stored in frontmatter.

## Data Loading Changes

### Before (Next.js)

```
src/lib/data.ts    → JSON imports with type casting
src/lib/posts.ts   → fs + gray-matter + next-mdx-remote
```

### After (Astro)

```
src/types/index.ts             → Type definitions (unchanged)
src/content.config.ts          → Content Collection for blog posts (new)
JSON imports                   → Direct import in page components
src/lib/utils.ts               → readingTime helper (extracted)
```

### Data Flow (Post-Migration)

```
JSON files (src/content/*.json)
       │
       ▼
src/pages/index.astro ── imports JSON directly, passes to section components
       │
       ├── <Hero profile={profile} />
       ├── <About summary={profile.summary} />
       ├── <Experience experience={experience} />
       ├── <Education education={education} />
       ├── <Skills skills={skills} />
       ├── <Projects projects={projects} />
       └── <Contact socialLinks={socialLinks} email={profile.email} />

Content Collection (src/content/blog/*.mdx)
       │
       ▼
getCollection("blog") ──→ src/pages/blog/index.astro (listing)
getEntry("blog", slug) ──→ src/pages/blog/[slug].astro (detail)
```

## Validation Rules

- Blog post frontmatter: validated by Zod schema at build time
- CV JSON data: validated by TypeScript type checking (no runtime schema)
- All required fields must be present or the build fails
- Empty arrays (e.g., projects) are valid — components handle empty states
