-- ============================================================
-- Visitor Tracking — Portfolio Analytics
-- Only readable/writable via service_role (private dashboard)
-- ============================================================

-- ─────────────────────────────────────────────
-- Table: page_views
-- One row per page visit
-- ─────────────────────────────────────────────
create table public.page_views (
  id              uuid        primary key default gen_random_uuid(),

  -- What page
  path            text        not null,                        -- e.g. "/en/projects"
  locale          text        not null default 'en',          -- "en" | "es"
  referrer        text,                                        -- document.referrer or null

  -- Who (privacy-safe)
  ip_hash         text,                                        -- SHA-256 of IP, never raw IP
  country_code    text,                                        -- "MX", "US", etc.
  city            text,

  -- Device
  device_type     text        not null default 'unknown',     -- "mobile" | "tablet" | "desktop"
  browser         text,                                        -- "Chrome", "Safari", etc.
  browser_version text,
  os              text,                                        -- "macOS", "Windows", "Android"
  os_version      text,
  screen_width    integer,
  screen_height   integer,
  viewport_width  integer,
  viewport_height integer,

  -- Context
  language        text,                                        -- navigator.language ("en-US")
  timezone        text,                                        -- Intl.DateTimeFormat().resolvedOptions().timeZone
  color_scheme    text,                                        -- "dark" | "light"
  session_id      uuid        not null,                       -- groups page views per visit
  duration_ms     integer,                                    -- ms spent on page (set on leave)

  -- Traffic source
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  utm_term        text,
  utm_content     text,

  -- Meta
  user_agent      text,
  created_at      timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Table: visitor_sessions
-- Aggregated per-session entry (one row per visit)
-- ─────────────────────────────────────────────
create table public.visitor_sessions (
  id              uuid        primary key default gen_random_uuid(),
  session_id      uuid        not null unique,

  -- Journey
  entry_page      text        not null,
  exit_page       text,
  page_count      integer     not null default 1,
  total_duration_ms integer,

  -- Attribution
  referrer        text,
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,

  -- Device (snapshot from first page view)
  device_type     text,
  browser         text,
  os              text,
  country_code    text,
  city            text,
  language        text,
  timezone        text,

  -- Timing
  started_at      timestamptz not null default now(),
  ended_at        timestamptz,
  created_at      timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Indexes for common dashboard queries
-- ─────────────────────────────────────────────
create index on public.page_views (created_at desc);
create index on public.page_views (session_id);
create index on public.page_views (path);
create index on public.page_views (country_code);
create index on public.page_views (device_type);
create index on public.visitor_sessions (started_at desc);
create index on public.visitor_sessions (country_code);
create index on public.visitor_sessions (device_type);

-- ─────────────────────────────────────────────
-- RLS — everything locked down
-- ─────────────────────────────────────────────
alter table public.page_views      enable row level security;
alter table public.visitor_sessions enable row level security;

-- Only service_role bypasses RLS — no policy needed for that role.
-- anon and authenticated cannot read or write anything.
-- (No policies = deny all for non-service_role)

-- ─────────────────────────────────────────────
-- View: daily_stats
-- Quick aggregate for the dashboard
-- ─────────────────────────────────────────────
create or replace view public.daily_stats as
select
  date_trunc('day', created_at at time zone 'UTC') as day,
  count(*)                                          as page_views,
  count(distinct session_id)                        as unique_visitors,
  count(distinct path)                              as unique_pages,
  round(avg(duration_ms) / 1000.0, 1)              as avg_duration_seconds
from public.page_views
group by 1
order by 1 desc;

-- ─────────────────────────────────────────────
-- View: top_pages
-- ─────────────────────────────────────────────
create or replace view public.top_pages as
select
  path,
  count(*)                    as views,
  count(distinct session_id)  as unique_views,
  round(avg(duration_ms) / 1000.0, 1) as avg_duration_seconds
from public.page_views
group by path
order by views desc;

-- ─────────────────────────────────────────────
-- View: top_countries
-- ─────────────────────────────────────────────
create or replace view public.top_countries as
select
  coalesce(country_code, 'Unknown') as country_code,
  count(distinct session_id) as visitors,
  count(*) as page_views
from public.page_views
group by 1
order by visitors desc;

-- ─────────────────────────────────────────────
-- View: device_breakdown
-- ─────────────────────────────────────────────
create or replace view public.device_breakdown as
select
  coalesce(device_type, 'unknown') as device_type,
  count(distinct session_id) as visitors,
  round(count(distinct session_id) * 100.0 / nullif(sum(count(distinct session_id)) over (), 0), 1) as pct
from public.page_views
group by 1
order by visitors desc;
