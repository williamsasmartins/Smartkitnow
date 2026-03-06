import fs from 'fs';

const v = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

if (v.redirects) {
  v.redirects = v.redirects.map(r => {
    let source = r.source;
    let destination = r.destination;
    
    // Convert source that uses `:path*` to `/(.*)`
    if (source.includes('/:path*')) {
      source = source.replace('/:path*', '/(.*)');
      // If destination is `/` it's fine, if it uses `:path*` replace it with `$1`
    }
    
    // Convert source that uses `/:category/:subcategory/calculator/:slug`
    if (source === '/:category/:subcategory/calculator/:slug') {
      source = '/(?<category>[^/]+)/(?<subcategory>[^/]+)/calculator/(?<slug>[^/]+)';
      destination = '/$category/$subcategory/$slug';
    }

    return { ...r, source, destination };
  });
}

// Ensure rewrites route to / and not /index.html
if (v.rewrites) {
  v.rewrites = v.rewrites.map(r => {
    if (r.destination === '/index.html') {
      r.destination = '/';
    }
    return r;
  });
}

// Convert other Next.js dynamic segments just in case
// For example: /pets/dogs/:slug
let changed = false;
v.redirects.forEach((r, i) => {
  // Add other manual regex conversions if needed
});

fs.writeFileSync('vercel.json', JSON.stringify(v, null, 2), 'utf8');
console.log('Fixed vercel.json');

