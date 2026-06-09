# Data Model: Blog & CV Portfolio Landing Page

**Date**: 2026-06-09

## Entity Definitions

### Profile

Owner's personal and professional identity.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | yes | Full display name |
| title | string | yes | Professional title (e.g. "Full Stack Developer") |
| summary | string | yes | 1–3 sentence professional summary |
| avatar | string | yes | Relative path to avatar image (e.g. "/images/avatar.webp") |
| location | string | no | City, Country |
| email | string | yes | Contact email address |
| resumeUrl | string | no | URL to downloadable resume PDF |

**Source file**: `src/content/profile.json`

### Experience

Work history entries, stored as an array.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| company | string | yes | Company name |
| role | string | yes | Job title / role |
| period | string | yes | Date range (e.g. "Ene 2023 – Presente") |
| description | string | yes | Bullet-point or paragraph description of responsibilities |
| technologies | string[] | no | Technologies used in this role |

**Source file**: `src/content/experience.json` (array of Experience)

### Education

Academic background entries, stored as an array.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| institution | string | yes | School or university name |
| degree | string | yes | Degree or certification earned |
| period | string | yes | Date range |
| description | string | no | Additional details (honors, relevant coursework) |

**Source file**: `src/content/education.json` (array of Education)

### SkillGroup

Skills organized by category, stored as an array.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| category | string | yes | Category name (e.g. "Frontend", "Backend", "Tools") |
| items | string[] | yes | List of skill names in this category |

**Source file**: `src/content/skills.json` (array of SkillGroup)

### Project

Featured portfolio projects, stored as an array.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | yes | Project name |
| description | string | yes | 2–4 sentence project description |
| image | string | no | Relative path to project screenshot |
| technologies | string[] | yes | Technologies used |
| liveUrl | string | no | URL to live demo |
| repoUrl | string | no | URL to source repository |
| featured | boolean | no | Whether to show on landing page (default: true) |

**Source file**: `src/content/projects.json` (array of Project)

### SocialLink

External profile links for the contact section.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| platform | string | yes | Platform name (e.g. "GitHub", "LinkedIn") |
| url | string | yes | Full URL to profile |
| icon | string | yes | Icon identifier for rendering (e.g. "github", "linkedin", "mail") |

**Source file**: `src/content/social-links.json` (array of SocialLink)

### BlogPost

Blog articles stored as MDX files with frontmatter.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | yes | Post title (frontmatter) |
| slug | string | yes | URL-safe identifier (derived from filename) |
| date | string (ISO) | yes | Publication date (frontmatter) |
| category | string | no | Post category tag (frontmatter) |
| excerpt | string | yes | Short summary for listings (frontmatter) |
| readingTime | string | no | Estimated reading time (computed or frontmatter) |
| body | MDX | yes | Full post content (file body after frontmatter) |

**Source files**: `posts/*.mdx` (one file per post)

**Computed fields**:
- `slug`: Derived from the MDX filename (e.g. `hello-world.mdx` → `hello-world`)
- `readingTime`: Computed from word count if not provided in frontmatter

## Relationships

```
Profile ──── 1:N ──── SocialLink    (profile references social links)
Profile ──── 1:N ──── Experience    (profile's work history)
Profile ──── 1:N ──── Education     (profile's education)
Profile ──── 1:N ──── SkillGroup    (profile's skills)
Profile ──── 1:N ──── Project       (profile's featured projects)
BlogPost is independent (no foreign keys to other entities)
```

All relationships are implicit — JSON files are loaded independently and
composed in page components. No relational database or joins needed.

## Validation Rules

- All `url` fields MUST be valid absolute URLs or valid `mailto:` links.
- All `image` fields MUST reference files that exist in `public/`.
- `date` in BlogPost frontmatter MUST be a valid ISO date string.
- `slug` is auto-derived from filename — frontmatter MUST NOT define a
  conflicting slug.
- Empty arrays are valid for all array fields (graceful empty states).
