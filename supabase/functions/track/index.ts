// Visitor tracking edge function — resolves geo SERVER-SIDE from the client IP
// (works for adblocker/VPN users, unlike client-side geo APIs) and inserts with
// the service_role key (never exposed to the browser). The client never calls a
// third-party geo domain, so adblockers don't block it.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

function getClientIp(req: Request): string | null {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return req.headers.get("x-real-ip") || req.headers.get("cf-connecting-ip") || null;
}

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ipwho.is supports looking up a specific IP via the path; free, HTTPS, no key.
async function geoLookup(ip: string) {
  try {
    const r = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`);
    if (!r.ok) return null;
    const j = await r.json();
    if (j && j.success) return { country_code: j.country_code || null, city: j.city || null };
  } catch { /* keep nulls */ }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid json" }, 400);
  }

  const sid = body?.session_id;
  const path = body?.path;
  if (!sid || !path) return json({ error: "missing session_id or path" }, 400);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const ip = getClientIp(req);
  const geo = ip
    ? (await geoLookup(ip)) || { country_code: null, city: null }
    : { country_code: null, city: null };
  const ipHash = ip ? await sha256Hex(ip) : null;

  // fields shared by page_views and visitor_sessions
  const common = {
    referrer: body.referrer || null,
    device_type: body.device_type || "unknown",
    browser: body.browser || null,
    os: body.os || null,
    country_code: geo.country_code,
    city: geo.city,
    language: body.language || null,
    timezone: body.timezone || null,
  };

  // 1) page view
  const { error: e1 } = await supabase.from("page_views").insert({
    path,
    locale: body.locale || "en",
    session_id: sid,
    user_agent: body.user_agent || null,
    ip_hash: ipHash,
    screen_width: body.screen_width || null,
    screen_height: body.screen_height || null,
    viewport_width: body.viewport_width || null,
    viewport_height: body.viewport_height || null,
    color_scheme: body.color_scheme || null,
    utm_source: body.utm_source || null,
    utm_medium: body.utm_medium || null,
    utm_campaign: body.utm_campaign || null,
    utm_term: body.utm_term || null,
    utm_content: body.utm_content || null,
    ...common,
  });
  if (e1) return json({ error: "page_views insert failed", detail: e1.message }, 500);

  // 2) visitor session — first touch only (ignore duplicate session_id races)
  if (body.is_new) {
    const { error: e2 } = await supabase.from("visitor_sessions").insert({
      session_id: sid,
      entry_page: path,
      utm_source: body.utm_source || null,
      utm_medium: body.utm_medium || null,
      utm_campaign: body.utm_campaign || null,
      ...common,
    });
    if (e2 && e2.code !== "23505") {
      return json({ error: "visitor_sessions insert failed", detail: e2.message }, 500);
    }
  }

  return new Response(null, { status: 204, headers: CORS });
});
