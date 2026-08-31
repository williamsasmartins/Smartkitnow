/**
 * Real 404 for unmatched URLs.
 *
 * Why this exists: the catch-all rewrite in vercel.json used to point at "/",
 * which after prerendering is the fully-rendered homepage. Every unknown URL
 * therefore returned HTTP 200 with complete homepage content and an
 * index,follow robots tag — an unbounded soft-404 farm of duplicate pages,
 * exactly the kind of thing AdSense and Search Console read as low value.
 *
 * Every real route (738 indexed + the noindexed thin ones + utility pages) is
 * prerendered to its own file and is served from the filesystem before this
 * handler is ever reached, so anything landing here genuinely does not exist.
 * Calculator aliases are lookup keys, not routes — the SPA already renders
 * NotFound for them — so answering 404 here matches the app's own behaviour.
 */
export default function handler(request, response) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, follow">
<title>Page not found · Smart Kit Now</title>
<style>
  :root { color-scheme: light dark; }
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center;
    font: 16px/1.6 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background: #f8fafc; color: #0f172a; padding: 24px;
  }
  main { max-width: 34rem; text-align: center; }
  h1 { font-size: 1.75rem; margin: 0 0 .5rem; }
  p { color: #475569; margin: 0 0 1.5rem; }
  .links { display: flex; flex-wrap: wrap; gap: .5rem; justify-content: center; }
  a {
    display: inline-block; padding: .5rem .9rem; border-radius: .5rem;
    background: #3c83f6; color: #fff; text-decoration: none; font-weight: 600;
  }
  a.secondary { background: #e2e8f0; color: #0f172a; }
  @media (prefers-color-scheme: dark) {
    body { background: #0f172a; color: #f1f5f9; }
    p { color: #94a3b8; }
    a.secondary { background: #1e293b; color: #f1f5f9; }
  }
</style>
</head>
<body>
  <main>
    <h1>We couldn't find that page</h1>
    <p>The link may be out of date, or the address may have a typo. All of our free calculators are still one click away.</p>
    <div class="links">
      <a href="/">Go to the homepage</a>
      <a class="secondary" href="/financial">Financial</a>
      <a class="secondary" href="/health">Health</a>
      <a class="secondary" href="/conversion">Conversion</a>
      <a class="secondary" href="/blog">Blog</a>
    </div>
  </main>
</body>
</html>`;

  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('X-Robots-Tag', 'noindex, follow');
  response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  return response.status(404).send(html);
}
