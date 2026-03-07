const fs = require('fs');

const urls = `
https://www.smartkitnow.com/culinary/italian/tiramisu
https://www.smartkitnow.com/everyday/beverage-mix-planner
https://smartkitnow.com/de/datenschutz/
https://smartkitnow.com/es/acerca-de/
https://www.smartkitnow.com/video/audio-processing-engineering/decibel-power-ratio-calculator
https://www.smartkitnow.com/video/resolution-aspect-ratio-pixels/aspect-ratio-16-9-to-9-16-1-1-crop-safe-area-helper
https://www.smartkitnow.com/time/day-of-week-for-date
https://www.smartkitnow.com/culinary/potato-gnocchi-with-tomato-sauce
https://www.smartkitnow.com/video/surveillance-nvr-video-storage-planner
https://www.smartkitnow.com/video/gpu-render-performance-calculator
https://www.smartkitnow.com/video/video-export-time-estimator
https://www.smartkitnow.com/pl/
https://www.smartkitnow.com/time/dst-change-checker
https://www.smartkitnow.com/pets/cat-prednisolone-dose
https://www.smartkitnow.com/sports/vo2max-estimator-cooper-rockport
https://www.smartkitnow.com/video/video-compression-size-estimator
https://www.smartkitnow.com/contact
https://www.smartkitnow.com/cooking
https://www.smartkitnow.com/video/aspect-ratio-letterbox-pillarbox
https://www.smartkitnow.com/video/screen-size-from-diagonal-ar
https://www.smartkitnow.com/tv
https://www.smartkitnow.com/video/recording-time-card-ssd-capacity
https://www.smartkitnow.com/video/amplifier-power-required-calculator
https://www.smartkitnow.com/video/slow-mo-speed-ramp-time-calculator
https://www.smartkitnow.com/video/live-streaming-bitrate-calculator
https://www.smartkitnow.com/video/audio-bitrate-channels-impact-file-size
https://www.smartkitnow.com/it/
https://www.smartkitnow.com/video/anamorphic-lens-calculator
https://www.smartkitnow.com/time/epoch-unix-time-converter
https://www.smartkitnow.com/video/audio-file-size-estimator
https://www.smartkitnow.com/video/camera-bitrate-record-time-converter
https://www.smartkitnow.com/video/video-data-rate-calculator
https://www.smartkitnow.com/video/vbr-cbr-size-estimator
https://www.smartkitnow.com/video/youtube-twitch-recommended-bitrate-checker
https://www.smartkitnow.com/time/calendar-extras/day-of-week-for-date
https://www.smartkitnow.com/financial/income-budget-expenses/savings-rate-tracker
https://www.smartkitnow.com/smart-tips/planning/commute-cost-time
https://www.smartkitnow.com/pets/dog-calorie-needs-rer-mer
https://www.smartkitnow.com/video/render-time-per-frame-calculator
https://www.smartkitnow.com/video/h264-h265-target-bitrate-helper-resolution-fps
https://www.smartkitnow.com/math/lcm-calculator
https://www.smartkitnow.com/home/
https://www.smartkitnow.com/pt/
https://www.smartkitnow.com/video/speaker-crossover-calculator
https://www.smartkitnow.com/video/animation-render-duration-estimator
https://www.smartkitnow.com/culinary/mexican/queso-fundido
https://www.smartkitnow.com/culinary/italian/arugula-and-parmesan-salad
https://www.smartkitnow.com/smart-tips/commute-cost-time
https://smartkitnow.com/pt/
https://smartkitnow.com/home/
https://www.smartkitnow.com/tv/lb-cc-converter
https://www.smartkitnow.com/math/shapes-area-volume-pack
https://www.smartkitnow.com/pets/cat-stress-score-playtime-offset
https://www.smartkitnow.com/financial/savings-rate-tracker
https://www.smartkitnow.com/everyday-life/utilities/qr-code-generator
https://www.smartkitnow.com/pets/cat-phosphorus-per-meal
https://www.smartkitnow.com/pets/reptile-uvb-distance
https://www.smartkitnow.com/culinary/chicken-cacciatore
https://www.smartkitnow.com/culinary/italian/calzone
https://www.smartkitnow.com/pets/cat-bcs-helper
`.split('\n').map(x => x.trim()).filter(Boolean);

function matchRegex(source, path) {
    // Convert vercel's (.*) to JS regex
    const regexStr = '^' + source.replace(/\(\.\*\)/g, '(.*)') + '$';
    try {
        return new RegExp(regexStr).test(path);
    } catch (e) { return false; }
}

const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

let explicitToAdd = [];

urls.forEach(urlStr => {
    const url = new URL(urlStr);
    let path = url.pathname;

    const hasTrailingSlash = path.length > 1 && path.endsWith('/');
    if (hasTrailingSlash) {
        path = path.slice(0, -1);
    }

    // We are creating EXPLICIT mappings for every single broken link to point to their best parent category.
    // This guarantees Google Search Console sees a 308 (permanent redirect) instead of 404 for these specific pages.

    // Determine best destination
    let destination = '/';

    if (path.includes('culinary') || path.includes('cooking')) destination = '/cooking';
    else if (path.includes('everyday')) destination = '/everyday';
    else if (path.includes('video') || path.includes('tv')) destination = '/video';
    else if (path.includes('time')) destination = '/time';
    else if (path.includes('pets') || path.includes('cat') || path.includes('dog') || path.includes('reptile')) destination = '/pets';
    else if (path.includes('sports')) destination = '/sports';
    else if (path.includes('financial')) destination = '/financial';
    else if (path.includes('math')) destination = '/math';
    else if (path.includes('smart-tips')) destination = '/smart-tips';

    // Specific exclusions: /contact works
    if (path === '/contact') return;

    // Add rules for BOTH with trailing slash and without just to be extremely secure.
    explicitToAdd.push({ source: path, destination, permanent: true });
    explicitToAdd.push({ source: path + '/', destination, permanent: true });
});

// Add them to the beginning of vercel.json redirects list if not already there
let redirects = vercel.redirects || [];
const dedupMap = new Set(redirects.map(r => r.source));

const newlyAdded = [];
explicitToAdd.forEach(r => {
    if (!dedupMap.has(r.source)) {
        redirects.unshift(r);
        dedupMap.add(r.source);
        newlyAdded.push(r);
    }
});

vercel.redirects = redirects;

fs.writeFileSync('vercel.json', JSON.stringify(vercel, null, 2), 'utf8');
console.log('Added ' + newlyAdded.length + ' explicit rules based on the user provided list.');
