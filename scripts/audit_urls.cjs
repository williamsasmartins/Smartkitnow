const fs = require('fs');

const urls = [
    "https://smartkitnow.com/de/datenschutz/",
    "https://smartkitnow.com/es/acerca-de/",
    "https://smartkitnow.com/home/",
    "https://smartkitnow.com/pt/",
    "https://www.smartkitnow.com/contact",
    "https://www.smartkitnow.com/cooking",
    "https://www.smartkitnow.com/culinary/chicken-cacciatore",
    "https://www.smartkitnow.com/culinary/italian/arugula-and-parmesan-salad",
    "https://www.smartkitnow.com/culinary/italian/calzone",
    "https://www.smartkitnow.com/culinary/italian/tiramisu",
    "https://www.smartkitnow.com/culinary/mexican/queso-fundido",
    "https://www.smartkitnow.com/culinary/potato-gnocchi-with-tomato-sauce",
    "https://www.smartkitnow.com/everyday-life/utilities/qr-code-generator",
    "https://www.smartkitnow.com/everyday/beverage-mix-planner",
    "https://www.smartkitnow.com/financial/income-budget-expenses/savings-rate-tracker",
    "https://www.smartkitnow.com/financial/savings-rate-tracker",
    "https://www.smartkitnow.com/home/",
    "https://www.smartkitnow.com/it/",
    "https://www.smartkitnow.com/math/lcm-calculator",
    "https://www.smartkitnow.com/math/shapes-area-volume-pack",
    "https://www.smartkitnow.com/pets/cat-bcs-helper",
    "https://www.smartkitnow.com/pets/cat-phosphorus-per-meal",
    "https://www.smartkitnow.com/pets/cat-prednisolone-dose",
    "https://www.smartkitnow.com/pets/cat-stress-score-playtime-offset",
    "https://www.smartkitnow.com/pets/dog-calorie-needs-rer-mer",
    "https://www.smartkitnow.com/pets/reptile-uvb-distance",
    "https://www.smartkitnow.com/pl/",
    "https://www.smartkitnow.com/pt/",
    "https://www.smartkitnow.com/smart-tips/commute-cost-time",
    "https://www.smartkitnow.com/smart-tips/planning/commute-cost-time",
    "https://www.smartkitnow.com/sports/vo2max-estimator-cooper-rockport",
    "https://www.smartkitnow.com/time/calendar-extras/day-of-week-for-date",
    "https://www.smartkitnow.com/time/day-of-week-for-date",
    "https://www.smartkitnow.com/time/dst-change-checker",
    "https://www.smartkitnow.com/time/epoch-unix-time-converter",
    "https://www.smartkitnow.com/tv",
    "https://www.smartkitnow.com/tv/lb-cc-converter",
    "https://www.smartkitnow.com/video/amplifier-power-required-calculator",
    "https://www.smartkitnow.com/video/anamorphic-lens-calculator",
    "https://www.smartkitnow.com/video/animation-render-duration-estimator",
    "https://www.smartkitnow.com/video/aspect-ratio-letterbox-pillarbox",
    "https://www.smartkitnow.com/video/audio-bitrate-channels-impact-file-size",
    "https://www.smartkitnow.com/video/audio-file-size-estimator",
    "https://www.smartkitnow.com/video/audio-processing-engineering/decibel-power-ratio-calculator",
    "https://www.smartkitnow.com/video/camera-bitrate-record-time-converter",
    "https://www.smartkitnow.com/video/gpu-render-performance-calculator",
    "https://www.smartkitnow.com/video/h264-h265-target-bitrate-helper-resolution-fps",
    "https://www.smartkitnow.com/video/live-streaming-bitrate-calculator",
    "https://www.smartkitnow.com/video/recording-time-card-ssd-capacity",
    "https://www.smartkitnow.com/video/render-time-per-frame-calculator",
    "https://www.smartkitnow.com/video/resolution-aspect-ratio-pixels/aspect-ratio-16-9-to-9-16-1-1-crop-safe-area-helper",
    "https://www.smartkitnow.com/video/screen-size-from-diagonal-ar",
    "https://www.smartkitnow.com/video/slow-mo-speed-ramp-time-calculator",
    "https://www.smartkitnow.com/video/speaker-crossover-calculator",
    "https://www.smartkitnow.com/video/surveillance-nvr-video-storage-planner",
    "https://www.smartkitnow.com/video/vbr-cbr-size-estimator",
    "https://www.smartkitnow.com/video/video-compression-size-estimator",
    "https://www.smartkitnow.com/video/video-data-rate-calculator",
    "https://www.smartkitnow.com/video/video-export-time-estimator",
    "https://www.smartkitnow.com/video/youtube-twitch-recommended-bitrate-checker"
];

const content = fs.readFileSync('src/data/calculatorRegistry.ts', 'utf8');
const slugs = new Set();
const categories = new Set();
const subcategories = new Set();
let m;
const regex = /slug:\s*\"([^\"]+)\"/g;
while ((m = regex.exec(content)) !== null) {
    slugs.add(m[1]);
}

const catRegex = /category:\s*\"([^\"]+)\"/g;
while ((m = catRegex.exec(content)) !== null) {
    categories.add(m[1]);
}

const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

// Load all redirects into checking logic
const redirects = vercel.redirects || [];

function matchRedirect(path) {
    for (let r of redirects) {
        if (r.source === path) return true;
        if (r.source.includes('(.*)')) {
            const regexStr = '^' + r.source.replace(/\(\.\*\)/g, '(.*)') + '$';
            try {
                if (new RegExp(regexStr).test(path)) return true;
            } catch (e) { }
        }
    }
    return false;
}

const hardcodedRoutes = [
    '/', '/about', '/contact', '/cookies', '/cookie-settings', '/privacy', '/terms', '/search', '/games', '/smart-tips', '/daily-quotes'
];

let missing = [];

urls.forEach(urlStr => {
    const url = new URL(urlStr);
    let path = url.pathname;
    if (path.length > 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
    }

    if (hardcodedRoutes.includes(path)) {
        return;
    }

    const parts = path.split('/').filter(Boolean);

    // Is it a direct category?
    if (parts.length === 1 && categories.has(parts[0])) {
        return;
    }

    // Last part slug check
    const lastPart = parts[parts.length - 1];

    // If it matches a slug, the app router handles it via the exact path in registry, but our app generates flat or nested paths in calcLink
    // The App.tsx handles routes exactly matching what calcLink outputs, which usually looks like /category/slug or /category/subcategory/slug
    // If last part is a slug, let's assume valid for now, or check redirect

    if (slugs.has(lastPart)) {
        return;
    }

    if (matchRedirect(path)) {
        return;
    }

    if (matchRedirect(path + '/')) { // trailing slash case
        return;
    }

    // Still unhandled
    missing.push(path);
});

console.log('UNHANDLED PATHS:');
console.log(missing.join('\n'));

// Let's create a list of new redirects to add to vercel.json
const newRedirects = missing.map(m => {
    // Try to find the closest valid route
    const parts = m.split('/').filter(Boolean);
    const last = parts[parts.length - 1];

    // if language root like /de, /es, /it, /pl, /pt handled by (.*) but maybe they need direct to /
    if (['de', 'es', 'it', 'pl', 'pt', 'pt-pt', 'nl', 'fr', 'sv'].includes(parts[0])) {
        return { source: `/${parts[0]}/(.*)`, destination: "/", permanent: true };
    }

    // For culinary recipes/italian/potato-gnocchi-with-tomato-sauce
    if (parts.includes('culinary') || parts.includes('cooking')) {
        return { source: `/${parts[0]}/(.*)`, destination: "/cooking", permanent: true };
    }

    if (parts.includes('home')) {
        return { source: `/home`, destination: "/", permanent: true };
    }

    if (parts.includes('utilities')) {
        return { source: `/everyday-life/(.*)`, destination: "/everyday", permanent: true };
    }

    if (parts.includes('everyday')) {
        return { source: `/everyday/(.*)`, destination: "/everyday", permanent: true };
    }

    if (parts.includes('financial')) {
        return { source: `/financial/(.*)`, destination: "/financial", permanent: true };
    }

    if (parts.includes('pets') || parts.includes('cat') || parts.includes('dog')) {
        return { source: `/pets/(.*)`, destination: "/pets", permanent: true };
    }

    if (parts.includes('math')) {
        return { source: `/math/(.*)`, destination: "/math", permanent: true };
    }

    if (parts.includes('smart-tips')) {
        return { source: `/smart-tips/(.*)`, destination: "/smart-tips", permanent: true };
    }

    if (parts.includes('sports')) {
        return { source: `/sports/(.*)`, destination: "/sports", permanent: true };
    }

    if (parts.includes('time')) {
        return { source: `/time/(.*)`, destination: "/time", permanent: true };
    }

    if (parts.includes('tv') || parts.includes('video')) {
        return { source: `/${parts[0]}/(.*)`, destination: "/video", permanent: true };
    }

    return { source: m, destination: "/", permanent: true };
});

const uniqueNew = [];
newRedirects.forEach(nr => {
    if (!uniqueNew.find(x => x.source === nr.source && x.destination === nr.destination)) {
        if (!redirects.find(x => x.source === nr.source)) {
            uniqueNew.push(nr);
        }
    }
});

console.log('NEW REDIRECTS TO ADD:');
console.log(JSON.stringify(uniqueNew, null, 2));

if (uniqueNew.length > 0) {
    vercel.redirects = [...uniqueNew, ...vercel.redirects];
    fs.writeFileSync('vercel.json', JSON.stringify(vercel, null, 2), 'utf8');
}
