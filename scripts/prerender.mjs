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
import puppeteer from 'puppeteer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const INDEX_HTML = path.join(DIST, 'index.html')
const SITEMAP = path.join(DIST, 'sitemap.xml')

const BASE_URL = 'https://www.smartkitnow.com'
const PLACEHOLDER = '__CANONICAL__'
const PORT = 45678
const HOST = '127.0.0.1'

// Tuning knobs (overridable via env for CI / local debugging)
const CONCURRENCY = Number(process.env.PRERENDER_CONCURRENCY || 4)
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
// Routes from sitemap
// ---------------------------------------------------------------------------
const sitemapXml = fs.readFileSync(SITEMAP, 'utf-8')
let routes = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => {
    const url = m[1].trim()
    return url.startsWith(BASE_URL) ? url.slice(BASE_URL.length) || '/' : null
  })
  .filter(Boolean)

// Deduplicate + ensure "/" is present
routes = [...new Set(['/', ...routes])]
if (LIMIT > 0) routes = routes.slice(0, LIMIT)

console.log(`[prerender] ${routes.length} routes, concurrency=${CONCURRENCY}`)

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
  const page = await browser.newPage()
  try {
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

    const html = await page.evaluate(() => '<!doctype html>\n' + document.documentElement.outerHTML)
    writeRoute(route, html)
    return { route, ok: true }
  } catch (e) {
    return { route, ok: false, error: e.message }
  } finally {
    await page.close().catch(() => {})
  }
}

// ---------------------------------------------------------------------------
// Concurrency pool
// ---------------------------------------------------------------------------
const LAUNCH_OPTS = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-zygote',
    '--js-flags=--max-old-space-size=512',
  ],
  protocolTimeout: 60000,
}

async function run() {
  await new Promise((resolve) => server.listen(PORT, HOST, resolve))
  console.log(`[prerender] static server on http://${HOST}:${PORT}`)

  // Single shared browser, auto-relaunched if it ever disconnects (a crashed
  // page can otherwise tear down the whole browser mid-run). A mutex around the
  // relaunch prevents concurrent workers from launching several browsers.
  let browser = await puppeteer.launch(LAUNCH_OPTS)
  let relaunching = null
  const isAlive = (b) =>
    b && (typeof b.connected === 'boolean' ? b.connected : b.isConnected?.() ?? false)
  async function getBrowser() {
    if (isAlive(browser)) return browser
    if (!relaunching) {
      relaunching = (async () => {
        try { await browser?.close() } catch { /* already dead */ }
        console.warn('[prerender] browser disconnected — relaunching')
        browser = await puppeteer.launch(LAUNCH_OPTS)
        relaunching = null
        return browser
      })()
    }
    return relaunching
  }

  const queue = [...routes]
  const failures = []
  let done = 0
  const total = routes.length
  const MAX_ATTEMPTS = 3

  async function worker() {
    while (queue.length) {
      const route = queue.shift()
      let res
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        const b = await getBrowser()
        res = await renderRoute(b, route)
        if (res.ok) break
        // Browser-level failure -> force a relaunch before the retry.
        if (/Connection closed|Target closed|Protocol error|detached/i.test(res.error || '')) {
          try { await browser?.close() } catch { /* noop */ }
        }
        if (attempt < MAX_ATTEMPTS) await new Promise((r) => setTimeout(r, 500))
      }
      done++
      if (!res.ok) failures.push(res)
      if (done % 25 === 0 || done === total) {
        console.log(`[prerender] ${done}/${total} (fail=${failures.length})`)
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

  console.log(`[prerender] done. ${total - failures.length}/${total} prerendered.`)
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
