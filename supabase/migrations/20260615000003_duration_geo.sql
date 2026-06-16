-- ============================================================
-- Visitor Tracking — duration + geo support + privacy fix
-- ============================================================
-- 1) record_duration: scoped write-only update for time-on-page.
--    SECURITY DEFINER (owner=postgres) is deliberate and documented:
--    anon must NOT read page_views (private analytics), and UPDATE under
--    RLS requires a SELECT policy (which would expose reads). This function
--    updates ONLY duration_ms of the most-recent matching row and returns
--    no data, so it cannot leak reads. Same trust level as the existing
--    anon INSERT (write-only analytics, no PII, no security boundary).
-- ============================================================

-- (cleanup) the UPDATE-via-anon experiment is not used; keep table locked.
revoke update on public.page_views from anon;
drop policy if exists "anon can update page view duration" on public.page_views;

create or replace function public.record_duration(p_session uuid, p_path text, p_ms int)
returns void
language plpgsql
security definer set search_path = public as $$
begin
  update public.page_views
     set duration_ms = p_ms
   where session_id = p_session
     and path = p_path
     and created_at = (
       select max(created_at) from public.page_views
        where session_id = p_session and path = p_path
     );
end; $$;

-- EXECUTE defaults to PUBLIC; restrict to anon only (no authenticated users here).
revoke execute on function public.record_duration(uuid, text, int) from public, authenticated;
grant execute on function public.record_duration(uuid, text, int) to anon;

-- ============================================================
-- 2) Privacy fix: analytics views were running as owner (postgres),
--    bypassing RLS — anon could read the aggregates. Switch to
--    security_invoker so views run as the caller: anon sees 0 rows
--    (no SELECT policy), service_role bypasses RLS and sees everything.
-- ============================================================
alter view public.daily_stats       set (security_invoker = true);
alter view public.top_pages         set (security_invoker = true);
alter view public.top_countries     set (security_invoker = true);
alter view public.device_breakdown set (security_invoker = true);

notify pgrst, 'reload schema';
