const fs = require('fs');

const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const scriptSrc = fs.readFileSync('fix_redirects_3.cjs', 'utf8');

const urls = [];
scriptSrc.split('\n').forEach(l => {
  if (l.trim().startsWith('http')) {
    try {
      urls.push(new URL(l.trim()).pathname.replace(/\\/$/, ''));
    } catch(e) {}
  }
});

const matchingRedirects = new Set();
const toDelete = new Set();

urls.forEach(u => {
  config.redirects.forEach(r => {
    // Vercel path mapping string to Regex
    // Example: /culinary/:path*  -> ^/culinary/.*$
    let str = r.source
      .replace(/:\w+\\*/g, '.*')
      .replace(/:[a-zA-Z]+/g, '[^/]+');
    let regexStr = '^' + str + '$';
    
    try {
      let regex = new RegExp(regexStr);
      if (regex.test(u) || regex.test(u + '/')) {
        matchingRedirects.add(r.source);
        toDelete.add(r.source);
      }
    } catch(e) {}
  });
});

console.log('Redirects currently intercepting the target URLs:');
console.log(Array.from(matchingRedirects));

// Delete them from config
config.redirects = config.redirects.filter(r => !toDelete.has(r.source));

fs.writeFileSync('vercel.json', JSON.stringify(config, null, 2));
console.log('Removed', toDelete.size, 'redirects from vercel.json');
