const fs = require('fs');

const v = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

if (v.redirects) {
    // 1. Remove self-redirects (source === destination causes infinite loop)
    const before = v.redirects.length;
    v.redirects = v.redirects.filter(r => r.source !== r.destination);
    const removed = before - v.redirects.length;
    console.log(`Removed ${removed} self-redirects`);

    // 2. Replace capture groups (.*) with :path* in source
    //    Vercel requires named segments, not regex capture groups in redirects
    let fixed = 0;
    v.redirects = v.redirects.map(r => {
        if (r.source.includes('(.*)')) {
            const newSource = r.source.replace('(.*)', ':path*');
            console.log(`  Fixed: ${r.source} -> ${newSource}`);
            r.source = newSource;
            fixed++;
        }
        return r;
    });
    console.log(`Fixed ${fixed} capture group patterns`);
}

// 3. Fix rewrites too
if (v.rewrites) {
    v.rewrites = v.rewrites.map(r => {
        if (r.source.includes('(.*)') && !r.destination.includes('$1')) {
            const newSource = r.source.replace('(.*)', ':path*');
            console.log(`  Fixed rewrite: ${r.source} -> ${newSource}`);
            r.source = newSource;
        }
        return r;
    });
}

fs.writeFileSync('vercel.json', JSON.stringify(v, null, 2), 'utf8');
console.log('\n✅ vercel.json fixed!');
