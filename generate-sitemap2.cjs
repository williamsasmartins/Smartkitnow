const fs = require('fs');

const gamesContent = fs.readFileSync('./src/data/gameRegistry.tsx', 'utf-8');
const tipsContent = fs.readFileSync('./src/data/smartTipsData.ts', 'utf-8');

const games = Array.from(gamesContent.matchAll(/slug:\s*['\"]([^'\"]+)['\"]/g)).map(m => '/games/' + m[1]);

const allSlugs = Array.from(tipsContent.matchAll(/slug:\s*['\"]([^'\"]+)['\"]/g)).map(m => m[1]);
const categories = ['everyday', 'financial', 'health', 'cooking'];
const tips = allSlugs.filter(s => !categories.includes(s)).map(s => '/smart-tip/' + s);

const fixed = ['/', '/games', '/smart-tips', '/everyday', '/financial', '/health', '/cooking'];
const allUrls = fixed.concat(games).concat(tips);
const uniqueUrls = [...new Set(allUrls)];

let xml = '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\\n';
for (const url of uniqueUrls) {
  xml += '  <url>\\n    <loc>https://www.smartkitnow.com' + url + '</loc>\\n  </url>\\n';
}
xml += '</urlset>';

fs.writeFileSync('./public/sitemap.xml', xml);
console.log('Sitemap generated successfully by Node!');
