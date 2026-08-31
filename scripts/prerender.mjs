/**
 * Prerender all sitemap routes to static HTML.
 *
 * Why: the app is a client-side React SPA. Without prerendering, every route
 * ships an empty `<div id="root"></div>`. Crawlers (Googlebot, and especially
 * the AdSense review crawler) see no content -> "Low value content" reject.
 *
 * This script boots a static server over `dist/`, drives a real Chromium via
 * Puppeteer to each route, waits until React (including lazy/Suspense chunks)
 * has painted real content, then writes the fully-rendered HTML back to a
 * per-route `dist/<route>/index.html`. The `__CANONICAL__` placeholder from
 * `index.html` is replaced per route in the same pass (this replaces the old
 * inject-canonicals.mjs step).
 *
 * Run after `vite build` (wired as `postbuild`).
 */
import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'
import { fileURLToPath } from 'node:url'

// Chromium launcher — chosen at runtime:
//   • Serverless build images (Vercel, AWS Lambda) lack Chromium's system libs
//     (libnspr4/libnss3/…), so full `puppeteer`'s bundled Chrome fails to launch
//     with `error while loading shared libraries`. There we use `puppeteer-core`
//     driving `@sparticuz/chromium`, which ships a self-contained Chromium.
//   • Locally (dev machines / CI with a normal OS) we use full `puppeteer` and
//     its bundled Chromium — no extra binary needed.
const IS_SERVERLESS =
  !!process.env.VERCEL ||
  !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
  !!process.env.AWS_EXECUTION_ENV ||
  process.env.PRERENDER_SERVERLESS === '1'

let puppeteer
let launchOptions = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-zygote',
    '--js-flags=--max-old-space-size=512',
  ],
  headless: true,
  protocolTimeout: 60000,
}

if (IS_SERVERLESS) {
  const [{ default: pptrCore }, { default: chromium }] = await Promise.all([
    import('puppeteer-core'),
    import('@sparticuz/chromium'),
  ])
  puppeteer = pptrCore
  launchOptions = {
    // --single-process keeps all of Chromium in one process, which drastically
    // lowers peak RSS on the memory-capped build box (each renderer subprocess
    // otherwise adds its own footprint). Combined with browser recycling and
    // per-route retry this is stable enough for a build-time prerender.
    args: [
      ...chromium.args,
      '--single-process',
      '--js-flags=--max-old-space-size=384',
    ],
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    protocolTimeout: 60000,
  }
  console.log('[prerender] launcher: puppeteer-core + @sparticuz/chromium (serverless)')
} else {
  puppeteer = (await import('puppeteer')).default
  console.log('[prerender] launcher: puppeteer bundled Chromium (local)')
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const INDEX_HTML = path.join(DIST, 'index.html')
const SITEMAP = path.join(DIST, 'sitemap.xml')

const BASE_URL = 'https://www.smartkitnow.com'
const PLACEHOLDER = '__CANONICAL__'
const PORT = 45678
const HOST = '127.0.0.1'

// Tuning knobs (overridable via env for CI / local debugging).
// Serverless build boxes are small (Vercel: 2 cores) and memory-constrained, so
// default to a lower concurrency there; local dev machines can push higher.
const CONCURRENCY = Number(process.env.PRERENDER_CONCURRENCY || (IS_SERVERLESS ? 1 : 4))
const NAV_TIMEOUT = Number(process.env.PRERENDER_NAV_TIMEOUT || 30000)
const RENDER_TIMEOUT = Number(process.env.PRERENDER_RENDER_TIMEOUT || 15000)
// Optional: prerender only the first N routes (smoke test). 0 = all.
const LIMIT = Number(process.env.PRERENDER_LIMIT || 0)

// ---------------------------------------------------------------------------
// Preconditions
// ---------------------------------------------------------------------------
if (!fs.existsSync(INDEX_HTML)) {
  throw new Error('dist/index.html not found. Run `vite build` first.')
}
if (!fs.existsSync(SITEMAP)) {
  throw new Error('dist/sitemap.xml not found. Run `vite build` first.')
}

const template = fs.readFileSync(INDEX_HTML, 'utf-8')
if (!template.includes(PLACEHOLDER)) {
  throw new Error(`Placeholder "${PLACEHOLDER}" not found in dist/index.html.`)
}

// ---------------------------------------------------------------------------
// Routes.
//
// Preferred source is .prerender-routes.json, emitted by generate-sitemap.ts.
// It is a SUPERSET of the sitemap: it also carries the routes we deliberately
// keep out of the index (noindexed thin pages) plus utility routes like
// /search. Those are still real pages people open, so they must ship rendered
// HTML — otherwise the catch-all rewrite hands them the homepage instead.
//
// Falls back to parsing the sitemap if the manifest is missing, so the script
// still works standalone.
// ---------------------------------------------------------------------------
const ROUTE_MANIFEST = path.join(process.cwd(), '.prerender-routes.json')
let allRoutes
if (fs.existsSync(ROUTE_MANIFEST)) {
  allRoutes = JSON.parse(fs.readFileSync(ROUTE_MANIFEST, 'utf-8'))
  console.log(`[prerender] ${allRoutes.length} routes from .prerender-routes.json`)
} else {
  const sitemapXml = fs.readFileSync(SITEMAP, 'utf-8')
  allRoutes = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => {
      const url = m[1].trim()
      return url.startsWith(BASE_URL) ? url.slice(BASE_URL.length) || '/' : null
    })
    .filter(Boolean)
  console.warn(`[prerender] manifest missing — fell back to sitemap (${allRoutes.length} routes)`)
}

// Deduplicate + ensure "/" is present
allRoutes = [...new Set(['/', ...allRoutes])]

// ---------------------------------------------------------------------------
// Prioritisation + cap.
//
// Rendering all ~950 routes through headless Chromium inside one Vercel build
// exceeds the 45-minute build limit. It is also unnecessary for the goal
// (AdSense approval + SEO): AdSense reviews a SAMPLE of pages, and Googlebot
// renders JS for the long tail over time. So we prerender the highest-value
// pages up to a cap, in priority order:
//   1. "/"  (homepage)
//   2. single-segment routes: category hubs + static pages (/health, /about…)
//   3. everything else (individual calculators), sitemap order
// Routes beyond the cap still receive a valid canonical'd SPA shell (below), so
// they work as normal client-rendered pages — they are just not pre-rendered.
//
// A FIXED COUNT CAP IS THE WRONG TOOL HERE. It used to be 500, which left 448
// of 948 routes shipping as byte-identical empty shells — same <title>, same
// meta description, `<div id="root"></div>` — which is exactly the fingerprint
// AdSense reads as "Low value content". Whole high-quality sections (all 44
// construction calculators, every blog post) were invisible to the reviewer.
//
// Instead we prerender EVERYTHING and bound the work by WALL-CLOCK TIME (see
// TIME_BUDGET_MS below). That way the build can never blow the 45-minute limit,
// but on a normal run (~0.85-1.2s/route) all routes finish comfortably inside
// the budget and every indexed URL ships real HTML.
//
// PRERENDER_MAX_ROUTES>0 still forces a hard count cap if ever needed.
const DEFAULT_MAX = 0
const MAX_ROUTES = Number(
  process.env.PRERENDER_MAX_ROUTES != null ? process.env.PRERENDER_MAX_ROUTES : DEFAULT_MAX
)

// Wall-clock ceiling for the render phase. Vercel's build limit is 45 minutes
// and `npm install` + `vite build` take roughly 3-6 of those, so 24 minutes of
// prerendering leaves a wide margin. If the budget is ever exhausted the
// remaining routes fall back to canonical'd SPA shells instead of the build
// dying — degraded, but never a failed deploy. 0 disables the budget.
const TIME_BUDGET_MS = Number(
  process.env.PRERENDER_TIME_BUDGET_MS != null
    ? process.env.PRERENDER_TIME_BUDGET_MS
    : IS_SERVERLESS ? 24 * 60 * 1000 : 0
)

const segCount = (r) => (r === '/' ? 0 : r.split('/').filter(Boolean).length)
const priority = (r) => (r === '/' ? 0 : segCount(r) === 1 ? 1 : 2)
allRoutes.sort((a, b) => priority(a) - priority(b)) // stable within same tier

let routes = allRoutes
let deferred = []
if (LIMIT > 0) {
  routes = allRoutes.slice(0, LIMIT)
} else if (MAX_ROUTES > 0 && allRoutes.length > MAX_ROUTES) {
  routes = allRoutes.slice(0, MAX_ROUTES)
  deferred = allRoutes.slice(MAX_ROUTES)
}

console.log(
  `[prerender] prerendering ${routes.length} priority routes` +
    (deferred.length ? `, ${deferred.length} deferred to SPA shell` : '') +
    `, concurrency=${CONCURRENCY}`
)

// ---------------------------------------------------------------------------
// Minimal static file server with SPA fallback to the template.
// (We serve the ORIGINAL template for HTML so the SPA boots and renders;
//  the rendered output is written to disk afterwards, not served.)
// ---------------------------------------------------------------------------
const MIME = {
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.html': 'text/html',
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase()
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
  fs.createReadStream(filePath).pipe(res)
}

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
    // Static asset request (has a file extension and exists on disk)
    const candidate = path.join(DIST, urlPath)
    const hasExt = path.extname(urlPath) !== ''
    if (hasExt && candidate.startsWith(DIST) && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      serveFile(res, candidate)
      return
    }
    // Everything else -> serve the SPA template so React Router handles it.
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(template)
  } catch (e) {
    res.writeHead(500)
    res.end('prerender server error: ' + e.message)
  }
})

// ---------------------------------------------------------------------------
// Write a rendered route to dist
// ---------------------------------------------------------------------------
function writeRoute(route, html) {
  const canonical = `${BASE_URL}${route}`
  const finalHtml = html.replace(PLACEHOLDER, canonical)
  if (route === '/') {
    fs.writeFileSync(INDEX_HTML, finalHtml, 'utf-8')
  } else {
    const segments = route.split('/').filter(Boolean)
    const outDir = path.join(DIST, ...segments)
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, 'index.html'), finalHtml, 'utf-8')
  }
}

// ---------------------------------------------------------------------------
// Render one route in a page. Waits for real content in #root.
// ---------------------------------------------------------------------------
async function renderRoute(browser, route) {
  // Page creation is inside the try: if the browser disconnected between
  // getBrowser() and here (e.g. another worker closed it after a Target/
  // Protocol error), newPage() throws — we want that surfaced as a
  // { ok: false } result so the caller's retry+relaunch path handles it,
  // not an unhandled rejection that aborts the whole run.
  let page = null
  try {
    page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 900 })
    // Block third-party network (ads/analytics/fonts) to speed up + avoid hangs.
    await page.setRequestInterception(true)
    page.on('request', (r) => {
      const u = r.url()
      const blocked =
        u.includes('googlesyndication') ||
        u.includes('googletagmanager') ||
        u.includes('google-analytics') ||
        u.includes('doubleclick') ||
        u.includes('vercel-insights') ||
        u.includes('vitals.vercel')
      if (blocked) r.abort()
      else r.continue()
    })

    const url = `http://${HOST}:${PORT}${route}`
    // networkidle2 tolerates up to 2 lingering connections (some game pages keep
    // a socket/asset open and never reach full idle). The content-readiness
    // waitForFunction below is the real gate, so this only needs the DOM up.
    await page.goto(url, { waitUntil: 'networkidle2', timeout: NAV_TIMEOUT })

    // Wait until #root has rendered AND no skeleton placeholder is still
    // showing (lazy chunk resolved). "Rendered" = either meaningful text OR a
    // substantial DOM subtree — the latter matters for game/canvas pages that
    // legitimately carry very little text.
    await page.waitForFunction(
      () => {
        const root = document.getElementById('root')
        if (!root) return false
        const text = (root.innerText || '').trim()
        // Substantial text means the real page (not a skeleton) has rendered —
        // accept even if a decorative .animate-pulse element is present in the
        // game/calculator UI. Only bare-skeleton pages have little/no text.
        if (text.length >= 300) return true
        // Below that threshold, a lingering pulse is likely a Suspense skeleton
        // (CalculatorSkeleton) still resolving — keep waiting for it to clear.
        if (root.querySelector('.animate-pulse')) return false
        if (text.length >= 40) return true
        // Text-sparse page (canvas game): accept once a real subtree mounted.
        return root.querySelectorAll('*').length > 30
      },
      { timeout: RENDER_TIMEOUT, polling: 150 }
    )

    // De-duplicate <head> tags. index.html ships static <title>, description,
    // canonical, robots and OG/Twitter tags (needed by the non-prerendered SPA
    // shells). react-helmet ALSO injects its own per-page versions (marked with
    // data-rh="true"). On a prerendered page both would appear, giving Google
    // two canonicals / two titles / duplicate OG tags. Since helmet's versions
    // are authoritative here, remove the STATIC duplicates (those NOT managed by
    // helmet) for the tag types helmet controls, keeping helmet's.
    // De-duplicate <head> tags. index.html ships static <title>, description,
    // canonical, robots and OG/Twitter tags (needed by the non-prerendered SPA
    // shells). react-helmet-async ALSO injects its own per-page versions at
    // runtime — and this version does NOT stamp a data-rh marker, so we can't
    // tell them apart by attribute. But helmet always injects AFTER the static
    // tags, so for the tag types it manages we keep the LAST occurrence
    // (helmet's, authoritative) and drop the earlier static duplicate(s). This
    // removes the double canonical / double description / double OG that Google
    // would otherwise see. (<title> is already single — helmet replaces it.)
    const html = await page.evaluate(() => {
      const head = document.head
      if (head) {
        const dedupeKeepLast = (selector) => {
          const els = Array.from(head.querySelectorAll(selector))
          // Remove all but the last matching element.
          for (let i = 0; i < els.length - 1; i++) els[i].remove()
        }
        dedupeKeepLast('link[rel="canonical"]')
        dedupeKeepLast('meta[name="description"]')
        dedupeKeepLast('meta[name="robots"]')
        // OG/Twitter: dedupe per-property so each property keeps its last value.
        const dedupeAttrGroup = (attr, prefix) => {
          const seen = new Map() // value -> keep-last handled below
          const byKey = {}
          for (const el of Array.from(head.querySelectorAll(`meta[${attr}]`))) {
            const key = el.getAttribute(attr) || ''
            if (!key.startsWith(prefix)) continue
            if (!byKey[key]) byKey[key] = []
            byKey[key].push(el)
          }
          for (const key of Object.keys(byKey)) {
            const els = byKey[key]
            for (let i = 0; i < els.length - 1; i++) els[i].remove()
          }
        }
        dedupeAttrGroup('property', 'og:')
        dedupeAttrGroup('name', 'twitter:')
      }
      return '<!doctype html>\n' + document.documentElement.outerHTML
    })
    writeRoute(route, html)
    return { route, ok: true }
  } catch (e) {
    return { route, ok: false, error: e.message }
  } finally {
    if (page) await page.close().catch(() => {})
  }
}

// ---------------------------------------------------------------------------
// Concurrency pool
// ---------------------------------------------------------------------------
async function run() {
  const startedAt = Date.now()
  await new Promise((resolve) => server.listen(PORT, HOST, resolve))
  console.log(`[prerender] static server on http://${HOST}:${PORT}`)

  // Chromium's memory grows steadily across hundreds of renders; on a small
  // build box (Vercel: 2 cores / 8 GB) it eventually thrashes, pages start
  // timing out, and the browser crashes — which on a 949-route run blows past
  // the build time limit. To keep the footprint flat we PROACTIVELY recycle the
  // browser every RECYCLE_EVERY successful renders, and also relaunch on demand
  // if it ever disconnects. A generation counter + mutex ensures exactly one
  // relaunch happens even when several workers notice at once.
  let browser = await puppeteer.launch(launchOptions)
  let generation = 0
  let sinceRecycle = 0
  let relaunching = null
  const isAlive = (b) =>
    b && (typeof b.connected === 'boolean' ? b.connected : b.isConnected?.() ?? false)

  // Recycle after roughly this many renders. Kept modest so peak RSS stays low.
  const RECYCLE_EVERY = Number(process.env.PRERENDER_RECYCLE_EVERY || (IS_SERVERLESS ? 80 : 120))

  async function relaunch(reason, forGeneration) {
    // Only the first caller for a given generation performs the relaunch; others
    // await the same promise and pick up the fresh browser.
    if (forGeneration !== generation) return browser
    if (!relaunching) {
      relaunching = (async () => {
        try { await browser?.close() } catch { /* already dead */ }
        console.warn(`[prerender] recycling browser (${reason})`)
        browser = await puppeteer.launch(launchOptions)
        generation++
        sinceRecycle = 0
        relaunching = null
        return browser
      })()
    }
    return relaunching
  }

  async function getBrowser() {
    if (isAlive(browser) && !relaunching) return browser
    if (relaunching) return relaunching
    return relaunch('disconnected', generation)
  }

  const queue = [...routes]
  const failures = []
  let done = 0
  const total = routes.length
  const MAX_ATTEMPTS = 3

  async function worker() {
    while (queue.length) {
      // Wall-clock guard: if we are out of budget, hand every remaining route
      // back as a canonical'd SPA shell rather than risk the build timing out.
      if (TIME_BUDGET_MS > 0 && Date.now() - startedAt > TIME_BUDGET_MS) {
        const dropped = queue.splice(0)
        if (dropped.length) {
          deferred.push(...dropped)
          console.warn(
            `[prerender] time budget (${Math.round(TIME_BUDGET_MS / 60000)}min) exhausted — ` +
              `${dropped.length} route(s) deferred to SPA shell.`
          )
        }
        break
      }
      const route = queue.shift()
      let res
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        const b = await getBrowser()
        const gen = generation
        res = await renderRoute(b, route)
        if (res.ok) break
        // Browser-level failure -> force a relaunch (tied to this generation so
        // concurrent failures collapse into a single relaunch) before retrying.
        if (/Connection closed|Target closed|Protocol error|detached|Navigation/i.test(res.error || '')) {
          await relaunch('crash recovery', gen)
        }
        if (attempt < MAX_ATTEMPTS) await new Promise((r) => setTimeout(r, 500))
      }
      done++
      sinceRecycle++
      if (!res.ok) failures.push(res)
      if (done % 25 === 0 || done === total) {
        console.log(`[prerender] ${done}/${total} (fail=${failures.length})`)
      }
      // Proactive recycle once the threshold is reached (skip if a relaunch is
      // already underway or we're basically done).
      if (sinceRecycle >= RECYCLE_EVERY && queue.length > 0) {
        await relaunch('scheduled', generation)
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, queue.length) }, () => worker())
  )

  try { await browser?.close() } catch { /* noop */ }
  await new Promise((resolve) => server.close(resolve))

  if (failures.length) {
    console.warn(`[prerender] ${failures.length} route(s) failed:`)
    for (const f of failures.slice(0, 40)) {
      console.warn(`  ${f.route} -> ${f.error}`)
    }
    // Fallback: any failed route still needs a valid canonical'd shell so it is
    // not left with the raw __CANONICAL__ placeholder in production.
    for (const f of failures) writeRoute(f.route, template)
  }

  // Deferred (over-the-cap) routes: write a canonical'd SPA shell so they have
  // the correct <link rel="canonical">, contain no raw __CANONICAL__ placeholder,
  // and still work as normal client-rendered pages. They are simply not
  // prerendered — acceptable for the long tail (Googlebot renders JS over time;
  // AdSense reviews the prerendered priority pages).
  for (const route of deferred) writeRoute(route, template)
  if (deferred.length) {
    console.log(`[prerender] wrote ${deferred.length} deferred SPA shells (canonical only).`)
  }

  const rendered = done - failures.length
  console.log(
    `[prerender] done. ${rendered}/${allRoutes.length} routes prerendered ` +
      `in ${Math.round((Date.now() - startedAt) / 1000)}s` +
      (deferred.length ? `, ${deferred.length} shell-only` : '') +
      `.`
  )
  // Non-zero exit if a large fraction failed (build should surface the problem).
  if (failures.length > total * 0.1) {
    console.error('[prerender] >10% of routes failed — failing the build.')
    process.exit(1)
  }
}

run().catch((e) => {
  console.error('[prerender] fatal:', e)
  process.exit(1)
})
