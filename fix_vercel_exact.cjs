const fs = require('fs');
const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

// Find redirects that were recently added and fix them to support no-trailing-slash.
if (vercel.redirects) {
    vercel.redirects = vercel.redirects.reduce((acc, r) => {
        // If the source ends with /(.*), we also want to add a version without the trailing slash
        // e.g. /pt/(.*) -> we also need /pt
        if (r.source.endsWith('/(.*)')) {
            const base = r.source.slice(0, -5); // remove /(.*)
            acc.push({ ...r, source: base });
            acc.push(r);
        } else {
            acc.push(r);
        }
        return acc;
    }, []);

    // Deduplicate
    const unique = [];
    vercel.redirects.forEach(r => {
        if (!unique.find(x => x.source === r.source)) {
            unique.push(r);
        }
    });
    vercel.redirects = unique;
}

fs.writeFileSync('vercel.json', JSON.stringify(vercel, null, 2), 'utf8');
console.log('Fixed redirects in vercel.json');
