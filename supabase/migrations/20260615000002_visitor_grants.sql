-- ============================================================
-- Visitor Tracking — Data API exposure fix
-- ============================================================
-- The new Supabase default does NOT auto-grant table privileges to
-- anon/authenticated for tables created in `public` (see config.toml
-- `auto_expose_new_tables`). The RLS INSERT policies from migration
-- 20260615000001 existed but were unreachable via the Data API because
-- the `anon` role lacked the underlying table-level INSERT privilege.
-- This grants the minimum needed: INSERT-only for anon (reads stay
-- locked to service_role). RLS already blocks every other command.
-- ============================================================

grant insert on public.page_views      to anon;
grant insert on public.visitor_sessions to anon;

-- Refresh PostgREST schema cache so the new privileges are picked up
-- immediately (otherwise inserts keep failing with 42501 until reload).
notify pgrst, 'reload schema';
