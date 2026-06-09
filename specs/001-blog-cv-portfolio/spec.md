# Feature Specification: Blog & CV Portfolio Landing Page

**Feature Branch**: `001-blog-cv-portfolio`

**Created**: 2026-06-09

**Status**: Draft

**Input**: User description: "Un proyecto de un blog con su landing page para mostrarme como mi CV — a personal portfolio site with a blog and a landing page that doubles as an interactive resume/CV."

## User Scenarios & Testing

### User Story 1 - Browse Portfolio Landing Page (Priority: P1)

A recruiter or visitor lands on the site and sees a polished landing page that
presents the owner's professional identity: name, headline, summary, key skills,
work experience, education, and featured projects. The page acts as an interactive
CV that is visually engaging and easy to scan.

**Why this priority**: The landing page IS the core value proposition — it is
the first thing anyone sees and serves as the owner's primary professional
presentation online.

**Independent Test**: Can be fully tested by loading the root URL and verifying
that all CV sections (about, experience, education, skills, projects) render
correctly with real or sample data. Delivers a complete, shareable personal page.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the site root, **When** the page loads,
   **Then** they see a hero section with the owner's name, professional title,
   and a brief tagline or summary.
2. **Given** the landing page is loaded, **When** the visitor scrolls down,
   **Then** they encounter clearly labeled sections for About, Experience,
   Education, Skills, and Featured Projects in a logical reading order.
3. **Given** a visitor is on the landing page, **When** they click a project
   card, **Then** they are taken to a project detail view or an external link
   with more information.
4. **Given** a visitor is on any device, **When** they view the landing page,
   **Then** the layout adapts gracefully and remains readable on mobile, tablet,
   and desktop.

---

### User Story 2 - Read Blog Posts (Priority: P2)

A visitor browses the blog section to read articles written by the site owner.
They can see a list of posts with titles, dates, and excerpts, then click into
a full post to read the content.

**Why this priority**: The blog adds depth to the professional profile and
improves SEO, but the landing page (P1) must exist first as the entry point.

**Independent Test**: Can be tested by navigating to `/blog`, seeing a list of
posts, clicking into one, and reading the full article with proper formatting
and metadata.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to `/blog`, **When** the page loads, **Then**
   they see a list of blog posts sorted by date (newest first), each showing
   title, publication date, category, and a short excerpt.
2. **Given** the blog listing page, **When** a visitor clicks a post title,
   **Then** they are taken to the full post page with the complete content,
   author name, date, and reading time estimate.
3. **Given** a blog post page, **When** the content includes code blocks,
   images, or links, **Then** these elements render correctly and are
   well-formatted.
4. **Given** the blog listing page, **When** there are more posts than fit on
   one page, **Then** the visitor can paginate or load more posts.

---

### User Story 3 - Navigate Between Sections (Priority: P3)

A visitor uses the site navigation to move seamlessly between the landing page,
blog, and individual projects. The navigation is intuitive and consistent across
all pages.

**Why this priority**: Navigation ties the site together but depends on having
pages (landing + blog) to navigate between.

**Independent Test**: Can be tested by clicking every nav link and verifying
correct page transitions, active states, and back-navigation behavior.

**Acceptance Scenarios**:

1. **Given** the visitor is on any page, **When** they view the header, **Then**
   they see a consistent navigation bar with links to Home, Blog, and a contact
   or social links section.
2. **Given** the navigation bar, **When** the visitor clicks "Home", **Then**
   they are taken to the landing page root.
3. **Given** the navigation bar, **When** the visitor clicks "Blog", **Then**
   they are taken to the blog listing page.
4. **Given** a mobile viewport, **When** the visitor taps the menu icon,
   **Then** a responsive navigation menu opens with all the same links.

---

### User Story 4 - Contact and Social Links (Priority: P4)

A visitor wants to reach out to the site owner after reviewing their CV/blog.
They can find social media links, email, and optionally a contact form on the
landing page.

**Why this priority**: Contact enables professional opportunities but the
content must be compelling first.

**Independent Test**: Can be tested by locating the contact section and
verifying all links point to the correct external profiles or email client.

**Acceptance Scenarios**:

1. **Given** the landing page, **When** the visitor scrolls to the contact
   section, **Then** they see icons/links for GitHub, LinkedIn, email, and any
   other relevant profiles.
2. **Given** the contact section, **When** the visitor clicks the email link,
   **Then** their default email client opens with the owner's address
   pre-filled.
3. **Given** the contact section, **When** the visitor clicks a social link,
   **Then** they are taken to the correct external profile in a new tab.

---

### Edge Cases

- What happens when a visitor navigates to a non-existent blog post URL? A
  friendly 404 page MUST be shown with a link back to the home page.
- What happens when blog content is empty (no posts published yet)? The blog
  listing page MUST show a graceful empty state message.
- What happens on very slow connections? Critical above-the-fold content MUST
  render quickly; below-the-fold sections can load progressively.
- What happens when JavaScript is disabled? The site MUST still render all
  essential content (progressive enhancement).

## Requirements

### Functional Requirements

- **FR-001**: The site MUST display a landing page at the root URL that contains
  sections for: hero/intro, about me, work experience, education, skills, and
  featured projects.
- **FR-002**: The landing page MUST load all CV data from structured data files
  (not hardcoded in components).
- **FR-003**: The site MUST display a blog section at `/blog` with a listing of
  all published posts sorted by date.
- **FR-004**: Each blog post MUST be accessible via a unique URL (e.g.,
  `/blog/[slug]`) and display the full content with proper formatting.
- **FR-005**: Blog posts MUST support frontmatter metadata: title, date,
  category, excerpt, and reading time.
- **FR-006**: Blog post content MUST support rich formatting: headings,
  paragraphs, code blocks, images, links, and lists.
- **FR-007**: The site MUST include a consistent navigation bar on every page
  with links to Home and Blog.
- **FR-008**: The navigation MUST include a responsive mobile menu that toggles
  on tap.
- **FR-009**: The site MUST display social/contact links (GitHub, LinkedIn,
  email) in a dedicated section of the landing page.
- **FR-010**: The site MUST display a 404 page for non-existent routes with a
  link back to the home page.
- **FR-011**: All pages MUST include proper HTML meta tags (title, description,
  Open Graph) for SEO and social sharing.
- **FR-012**: The site MUST generate a sitemap and robots.txt for search engine
  crawling.
- **FR-013**: The site MUST be statically generated (no server-side rendering
  required at request time).

### Key Entities

- **Profile**: Owner's personal data — name, title, summary, avatar, location,
  social links.
- **Experience**: Work history entries — company, role, period, description,
  technologies used.
- **Education**: Academic entries — institution, degree, period, description.
- **Skill**: Categorized skills — category name, list of skill names with
  proficiency level.
- **Project**: Featured project — title, description, image, technologies,
  external URL, repository URL.
- **Blog Post**: Article — title, slug, date, category, excerpt, reading time,
  body content (MDX).
- **Social Link**: External profile — platform name, URL, icon identifier.

## Success Criteria

### Measurable Outcomes

- **SC-001**: A first-time visitor can understand the owner's professional
  profile (role, skills, experience) within 30 seconds of landing on the page.
- **SC-002**: The site achieves a Lighthouse Performance score of 90+ and
  SEO score of 95+ on all pages.
- **SC-003**: All pages render correctly and remain usable on viewports from
  320px to 1440px width.
- **SC-004**: The site loads above-the-fold content in under 2 seconds on a
  4G connection.
- **SC-005**: A visitor can navigate from the landing page to a blog post and
  back to home in under 3 clicks.
- **SC-006**: Adding a new blog post requires only creating a new content file
  with no code changes.

## Assumptions

- The site targets a single language (Spanish) for the initial version; i18n
  is out of scope.
- The site owner will manage content by editing files directly in the repository
  — no admin panel or CMS is needed.
- Images (project screenshots, avatar) will be provided by the owner and stored
  in the repository.
- The site will be deployed to a static hosting platform (Vercel, Netlify, or
  GitHub Pages).
- The initial content will be seeded with placeholder/sample data that the owner
  can later replace.
- No user authentication, comments, or analytics are required for v1.
- The portfolio belongs to a single individual — no multi-user support needed.
