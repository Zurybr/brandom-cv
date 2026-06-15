-- Allow anonymous clients to INSERT tracking data directly.
-- SELECT stays locked to service_role — no read policy for anon.

create policy "anon can insert page views"
  on public.page_views
  for insert
  to anon
  with check (true);

create policy "anon can insert visitor sessions"
  on public.visitor_sessions
  for insert
  to anon
  with check (true);
