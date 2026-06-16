// Private visitor stats viewer — runs locally with the service_role key.
// Usage: npm run stats
// service_role is read from .env at runtime; never bundled, never shipped.
import { createClient } from '@supabase/supabase-js'

const url = process.env.PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  console.error('Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const num = (n) => (n == null ? '-' : Number(n).toLocaleString('en-US'))

async function rpc(query) {
  const { data, error } = await query
  if (error) {
    console.error('Query error:', error.message)
    return []
  }
  return data
}

console.log('\n📊  Visitor stats — ' + url + '\n')

// Totals (head:true returns data:null, count on the response)
async function countAll(table) {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
  if (error) console.error('Count error (' + table + '):', error.message)
  return count ?? 0
}
const pv = await countAll('page_views')
const uv = await countAll('visitor_sessions')
console.log(`Total page views:   ${num(pv)}`)
console.log(`Unique visitors:    ${num(uv)}\n`)

// Last 7 days
const days = await rpc(
  supabase.from('daily_stats').select('*').order('day', { ascending: false }).limit(7)
)
if (days.length) {
  console.log('Last 7 days')
  console.log('  date            views   visitors   avg(s)')
  for (const d of days) {
    const day = String(d.day).slice(0, 10)
    console.log(
      `  ${day}   ${String(d.page_views).padStart(5)}   ${String(d.unique_visitors).padStart(8)}   ${d.avg_duration_seconds ?? '-'}`
    )
  }
  console.log()
}

// Top pages
const pages = await rpc(
  supabase.from('top_pages').select('path,views,unique_views').limit(8)
)
if (pages.length) {
  console.log('Top pages')
  for (const p of pages) {
    console.log(`  ${num(p.views).padStart(6)}  (${num(p.unique_views)} unique)  ${p.path}`)
  }
  console.log()
}

// Countries
const countries = await rpc(
  supabase.from('top_countries').select('country_code,visitors,page_views').limit(8)
)
if (countries.length) {
  console.log('Top countries')
  for (const c of countries) {
    console.log(`  ${num(c.visitors).padStart(5)} visitors   ${c.country_code}`)
  }
  console.log()
}

// Devices
const devices = await rpc(
  supabase.from('device_breakdown').select('device_type,visitors,pct').limit(5)
)
if (devices.length) {
  console.log('Devices')
  for (const d of devices) {
    console.log(`  ${num(d.visitors).padStart(5)}  ${d.pct ?? '-'}%   ${d.device_type}`)
  }
  console.log()
}

if (pv === 0 && uv === 0) {
  console.log('(no visits yet — visit the site to populate)\n')
}
