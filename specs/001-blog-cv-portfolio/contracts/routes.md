# Route Contracts: Blog & CV Portfolio Landing Page

**Date**: 2026-06-09

## Routes

### `GET /` — Landing Page (Home)

Static page. Displays the full CV/portfolio.

**Response**: HTML page with sections: Hero, About, Experience, Education,
Skills, Projects, Contact.

**Data sources**: `profile.json`, `experience.json`, `education.json`,
`skills.json`, `projects.json`, `social-links.json`

**Metadata**:
- Title: `"{name} — {title}"` (from profile)
- Description: profile summary
- Open Graph: title, description, avatar image, site URL

---

### `GET /blog` — Blog Listing

Static page. Lists all published blog posts.

**Response**: HTML page with post cards sorted by date (newest first).

**Data source**: All MDX files from `posts/` directory.

**Post card displays**: title, date, category, excerpt, reading time.

**Empty state**: If no posts exist, display "Aún no hay publicaciones."
message.

**Metadata**:
- Title: `"Blog — {name}"`
- Description: "Artículos sobre desarrollo y tecnología."

---

### `GET /blog/{slug}` — Blog Post Detail

Static page (one per post). Renders full MDX content.

**Response**: HTML page with full post body, title, date, category, reading
time.

**Dynamic params**: Generated via `generateStaticParams` at build time.
`dynamicParams = false` — non-existent slugs return 404.

**Data source**: `posts/{slug}.mdx`

**MDX components supported**: headings (h2–h4), paragraphs, code blocks
(with syntax highlighting), images, links, lists (ul/ol), blockquotes.

**Metadata** (dynamic):
- Title: `"{post.title} — {name}"`
- Description: post excerpt
- Open Graph: title, description, date (article type)

---

### `GET /sitemap.xml` — Sitemap

Auto-generated via `app/sitemap.ts`.

**Response**: XML sitemap listing all static routes and blog post routes
with lastModified dates.

---

### `GET /robots.txt` — Robots

Auto-generated via `app/robots.ts`.

**Response**: Allow all crawlers, reference sitemap URL.

---

### `*` — 404 Not Found

Custom not-found page rendered via `app/not-found.tsx`.

**Response**: HTML page with a friendly message and a link back to home.

**Triggered when**: Any URL not matching the routes above.
