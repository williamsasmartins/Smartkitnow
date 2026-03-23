const fs = require('fs');
const path = require('path');

const vercelFile = path.join(__dirname, 'vercel.json');
const config = JSON.parse(fs.readFileSync(vercelFile, 'utf8'));

const langs = ['pt', 'es', 'de', 'fr', 'nl', 'it', 'pl', 'sv', 'pt-pt', 'ru', 'zh', 'ja'];
const langRegex = new RegExp(`^\\/(${langs.join('|')})\\b`);

// 1. Remove redirects matching languages
const oldRedirectsLength = config.redirects ? config.redirects.length : 0;
config.redirects = (config.redirects || []).filter(r => {
  return !langRegex.test(r.source);
});
console.log(`Removed ${oldRedirectsLength - config.redirects.length} redirects.`);

// 2. Add rewrites to /api/404
if (!config.rewrites) config.rewrites = [];

langs.forEach(lang => {
  // Add /lang
  config.rewrites.unshift({
    source: `/${lang}`,
    destination: "/api/404"
  });
  // Add /lang/:path*
  config.rewrites.unshift({
    source: `/${lang}/:path*`,
    destination: "/api/404"
  });
});

fs.writeFileSync(vercelFile, JSON.stringify(config, null, 2));
console.log('Fixed vercel.json');

// 3. Create api/404.ts
const apiPath = path.join(__dirname, 'api', '404.ts');
if (!fs.existsSync(path.join(__dirname, 'api'))) {
  fs.mkdirSync(path.join(__dirname, 'api'));
}
fs.writeFileSync(apiPath, `export default function handler(request, response) {
  return response.status(404).send('404 Not Found');
}
`);
console.log('Created api/404.ts');
