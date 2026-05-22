import fs from 'node:fs'
import path from 'node:path'

const BASE_URL = 'https://www.smartkitnow.com'
const DIST = path.join(process.cwd(), 'dist')
const INDEX_HTML = path.join(DIST, 'index.html')
const SITEMAP = path.join(DIST, 'sitemap.xml')
const PLACEHOLDER = '__CANONICAL__'

if (!fs.existsSync(INDEX_HTML)) {
  throw new Error('dist/index.html not found. Run vite build first.')
}
if (!fs.existsSync(SITEMAP)) {
  throw new Error('dist/sitemap.xml not found. Run vite build first.')
}

// Read template once — always contains __CANONICAL__ placeholder
const template = fs.readFileSync(INDEX_HTML, 'utf-8')

if (!template.includes(PLACEHOLDER)) {
  throw new Error(`Placeholder "${PLACEHOLDER}" not found in dist/index.html. Was index.html updated?`)
}

const sitemapXml = fs.readFileSync(SITEMAP, 'utf-8')

// Extract all <loc> values and convert to paths
const routes = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
  const url = m[1].trim()
  return url.startsWith(BASE_URL) ? url.slice(BASE_URL.length) || '/' : '/'
})

let count = 0

for (const route of routes) {
  const canonical = `${BASE_URL}${route}`
  const html = template.replace(PLACEHOLDER, canonical)

  if (route === '/') {
    fs.writeFileSync(INDEX_HTML, html, 'utf-8')
  } else {
    const segments = route.split('/').filter(Boolean)
    const outDir = path.join(DIST, ...segments)
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8')
  }

  count++
}

console.log(`Injected canonical for ${count} routes.`)
