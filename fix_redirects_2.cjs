const fs = require('fs');
const path = require('path');

const userMessage = `
https://smartkitnow.com/nl/	Mar 16, 2026
https://www.smartkitnow.com/nl/	Mar 16, 2026
https://www.smartkitnow.com/nl	Mar 16, 2026
https://www.smartkitnow.com/time/day-of-week-for-date	Mar 16, 2026
https://smartkitnow.com/pt/	Mar 12, 2026
https://www.smartkitnow.com/pt/	Mar 12, 2026
https://www.smartkitnow.com/pt	Mar 12, 2026
https://www.smartkitnow.com/culinary/potato-gnocchi-with-tomato-sauce	Mar 11, 2026
https://www.smartkitnow.com/financial/savings-rate-tracker	Mar 11, 2026
https://www.smartkitnow.com/pl/strona-glowna-2/	Mar 11, 2026
https://www.smartkitnow.com/pl/strona-glowna-2	Mar 11, 2026
https://www.smartkitnow.com/video/speaker-crossover-calculator	Mar 11, 2026
https://smartkitnow.com/home/	Mar 10, 2026
https://www.smartkitnow.com/home	Mar 10, 2026
https://www.smartkitnow.com/home/	Mar 10, 2026
https://www.smartkitnow.com/culinary/italian/tuscan-steak-florentine-style	Mar 10, 2026
https://www.smartkitnow.com/culinary/mexican/pico-de-gallo	Mar 10, 2026
https://www.smartkitnow.com/video/resolution-aspect-ratio-pixels/aspect-ratio-16-9-to-9-16-1-1-crop-safe-area-helper	Mar 9, 2026
https://www.smartkitnow.com/culinary/italian/garlic-and-olive-oil-pasta-aglio-e-olio	Mar 9, 2026
https://www.smartkitnow.com/culinary/elote	Mar 8, 2026
https://www.smartkitnow.com/culinary/salsa-roja	Mar 8, 2026
https://www.smartkitnow.com/culinary/affogato	Mar 8, 2026
https://www.smartkitnow.com/culinary/panna-cotta	Mar 8, 2026
https://www.smartkitnow.com/culinary/polenta-with-meat-ragu	Mar 8, 2026
https://www.smartkitnow.com/culinary/breadsticks-grissini	Mar 8, 2026
https://www.smartkitnow.com/culinary/italian/chicken-saltimbocca	Mar 8, 2026
https://www.smartkitnow.com/culinary/shrimp-cocktail-mexican-style	Mar 8, 2026
https://www.smartkitnow.com/culinary/italian-style-roast-pork-porchetta	Mar 8, 2026
https://www.smartkitnow.com/video/camera-bitrate-record-time-converter	Mar 8, 2026
https://www.smartkitnow.com/tv	Mar 7, 2026
http://smartkitnow.com/	Mar 6, 2026
https://smartkitnow.com/	Mar 6, 2026
http://www.smartkitnow.com/	Feb 26, 2026
https://www.smartkitnow.com/recipes/chicken-and-corn-stew	Feb 22, 2026
https://www.smartkitnow.com/recipes/brazilian-black-beans	Feb 20, 2026
https://www.smartkitnow.com/sports/running-cycling-triathlon-performance/pool-length-time-converter	Feb 9, 2026
https://www.smartkitnow.com/video/time-fps-timecode/timecode-to-frames-calculator	Feb 9, 2026
https://www.smartkitnow.com/recipes/creamy-shrimp-peanut-stew-vatapa	Jan 18, 2026
https://www.smartkitnow.com/recipes/coastal-fish-stew	Jan 18, 2026
https://www.smartkitnow.com/recipes/chicken-and-okra-stew-frango-com-quiabo	Jan 18, 2026
https://www.smartkitnow.com/culinary/mexican/pozole	Jan 15, 2026
https://www.smartkitnow.com/recipes/birria-tacos	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/birria-tacos	Jan 14, 2026
https://www.smartkitnow.com/recipes/tostadas	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/tostadas	Jan 14, 2026
https://www.smartkitnow.com/recipes/chilaquiles	Jan 14, 2026
https://www.smartkitnow.com/recipes/huaraches	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/huaraches	Jan 14, 2026
https://www.smartkitnow.com/recipes/pozole	Jan 14, 2026
https://www.smartkitnow.com/recipes/tacos-al-pastor	Jan 14, 2026
https://www.smartkitnow.com/recipes/mole-poblano	Jan 14, 2026
https://www.smartkitnow.com/recipes/agua-de-jamaica	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/agua-de-jamaica	Jan 14, 2026
https://www.smartkitnow.com/recipes/churros	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/churros	Jan 14, 2026
https://www.smartkitnow.com/recipes/esquites	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/esquites	Jan 14, 2026
https://www.smartkitnow.com/recipes/sopes	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/sopes	Jan 14, 2026
https://www.smartkitnow.com/recipes/pico-de-gallo	Jan 14, 2026
https://www.smartkitnow.com/recipes/cochinita-pibil	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/cochinita-pibil	Jan 14, 2026
https://www.smartkitnow.com/recipes/frijoles-refritos	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/frijoles-refritos	Jan 14, 2026
https://www.smartkitnow.com/recipes/chicken-tinga-tacos	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/chicken-tinga-tacos	Jan 14, 2026
https://www.smartkitnow.com/recipes/huevos-mexicanos-con-salsa	Jan 14, 2026
https://www.smartkitnow.com/recipes/salsa-roja	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/salsa-roja	Jan 14, 2026
https://www.smartkitnow.com/recipes/arroz-mexicano	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/arroz-mexicano	Jan 14, 2026
https://www.smartkitnow.com/recipes/pastel-tres-leches	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/pastel-tres-leches	Jan 14, 2026
https://www.smartkitnow.com/recipes/carne-asada	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/carne-asada	Jan 14, 2026
https://www.smartkitnow.com/recipes/sopa-de-lima	Jan 14, 2026
https://www.smartkitnow.com/recipes/carne-asada-tacos	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/sopa-de-lima	Jan 14, 2026
https://www.smartkitnow.com/recipes/birria	Jan 14, 2026
https://www.smartkitnow.com/recipes/quesadillas	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/birria	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/quesadillas	Jan 14, 2026
https://www.smartkitnow.com/recipes/horchata	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/horchata	Jan 14, 2026
https://www.smartkitnow.com/recipes/enchiladas-suizas	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/elote	Jan 14, 2026
https://www.smartkitnow.com/recipes/chiles-en-nogada	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/chiles-en-nogada	Jan 14, 2026
https://www.smartkitnow.com/recipes/elote	Jan 14, 2026
https://www.smartkitnow.com/recipes/chicken-tinga	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/chicken-tinga	Jan 14, 2026
https://www.smartkitnow.com/recipes/queso-fundido	Jan 14, 2026
https://www.smartkitnow.com/recipes/guacamole	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/guacamole	Jan 14, 2026
https://www.smartkitnow.com/recipes/enchiladas-rojas	Jan 14, 2026
https://www.smartkitnow.com/recipes/huevos-rancheros	Jan 14, 2026
https://www.smartkitnow.com/recipes/enchiladas-verdes	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/huevos-rancheros	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/enchiladas-verdes	Jan 14, 2026
https://www.smartkitnow.com/recipes/fish-tacos	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/fish-tacos	Jan 14, 2026
https://www.smartkitnow.com/recipes/migas-mexican-style	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/migas-mexican-style	Jan 14, 2026
https://www.smartkitnow.com/recipes/salsa-verde	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/salsa-verde	Jan 14, 2026
https://www.smartkitnow.com/recipes/chiles-rellenos	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/chiles-rellenos	Jan 14, 2026
https://www.smartkitnow.com/recipes/roasted-tomato-salsa	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/roasted-tomato-salsa	Jan 14, 2026
https://www.smartkitnow.com/recipes/tamales	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/tamales	Jan 14, 2026
https://www.smartkitnow.com/recipes/gorditas	Jan 14, 2026
https://www.smartkitnow.com/recipes/taquitos	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/gorditas	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/taquitos	Jan 14, 2026
https://www.smartkitnow.com/recipes/shrimp-tacos	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/shrimp-tacos	Jan 14, 2026
https://www.smartkitnow.com/recipes/frijoles-charros	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/frijoles-charros	Jan 14, 2026
https://www.smartkitnow.com/recipes/baja-fish-tacos	Jan 14, 2026
https://www.smartkitnow.com/recipes/breakfast-tacos	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/baja-fish-tacos	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/breakfast-tacos	Jan 14, 2026
https://www.smartkitnow.com/recipes/chicken-tortilla-soup	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/chicken-tortilla-soup	Jan 14, 2026
https://www.smartkitnow.com/recipes/flautas	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/flautas	Jan 14, 2026
https://www.smartkitnow.com/recipes/black-bean-dip	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/black-bean-dip	Jan 14, 2026
https://www.smartkitnow.com/recipes/tlayudas	Jan 14, 2026
https://www.smartkitnow.com/recipes/pork-carnitas	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/tlayudas	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/pork-carnitas	Jan 14, 2026
https://www.smartkitnow.com/recipes/carnitas-tacos	Jan 14, 2026
https://www.smartkitnow.com/recipes/flan	Jan 14, 2026
https://www.smartkitnow.com/recipes/menudo	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/menudo	Jan 14, 2026
https://www.smartkitnow.com/recipes/tortillas-de-maiz	Jan 14, 2026
https://www.smartkitnow.com/recipes/margarita	Jan 14, 2026
https://www.smartkitnow.com/recipes/albondigas-soup	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/margarita	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/albondigas-soup	Jan 14, 2026
https://www.smartkitnow.com/recipes/shrimp-cocktail-mexican-style	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/shrimp-cocktail-mexican-style	Jan 14, 2026
https://www.smartkitnow.com/recipes/nachos	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/nachos	Jan 14, 2026
https://www.smartkitnow.com/recipes/barbacoa-tacos	Jan 14, 2026
https://www.smartkitnow.com/recipes/tortillas-de-harina	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/barbacoa-tacos	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/tortillas-de-harina	Jan 14, 2026
https://www.smartkitnow.com/recipes/chicken-enchiladas	Jan 14, 2026
https://www.smartkitnow.com/recipes/mexican/chicken-enchiladas	Jan 14, 2026
https://www.smartkitnow.com/culinary/italian/focaccia	Jan 14, 2026
https://www.smartkitnow.com/pets/cat-water-intake	Jan 14, 2026
https://www.smartkitnow.com/culinary/italian/spaghetti-with-clams	Jan 14, 2026
https://www.smartkitnow.com/recipes/baby-back-ribs	Jan 14, 2026
https://www.smartkitnow.com/recipes/bbq-smoking/baby-back-ribs	Jan 14, 2026
https://www.smartkitnow.com/culinary/italian/ciabatta	Jan 12, 2026
https://www.smartkitnow.com/recipes/minestrone-soup	Jan 11, 2026
https://www.smartkitnow.com/recipes/baked-stuffed-mushrooms	Jan 11, 2026
https://www.smartkitnow.com/recipes/italian/minestrone-soup	Jan 11, 2026
https://www.smartkitnow.com/recipes/prosciutto-and-melon	Jan 11, 2026
https://www.smartkitnow.com/recipes/fried-rice-balls-arancini	Jan 11, 2026
https://www.smartkitnow.com/recipes/italian/baked-stuffed-mushrooms	Jan 11, 2026
https://www.smartkitnow.com/recipes/italian/prosciutto-and-melon	Jan 11, 2026
https://www.smartkitnow.com/recipes/italian/fried-rice-balls-arancini	Jan 11, 2026
https://www.smartkitnow.com/recipes/tuscan-bread-and-vegetable-soup-ribollita	Jan 11, 2026
https://www.smartkitnow.com/recipes/italian/tuscan-bread-and-vegetable-soup-ribollita	Jan 11, 2026
https://www.smartkitnow.com/recipes/garlic-and-herb-crostini	Jan 11, 2026
https://www.smartkitnow.com/recipes/italian/garlic-and-herb-crostini	Jan 11, 2026
https://www.smartkitnow.com/recipes/stuffed-zucchini-blossoms	Jan 11, 2026
https://www.smartkitnow.com/recipes/italian/stuffed-zucchini-blossoms	Jan 11, 2026
https://www.smartkitnow.com/recipes/caprese-salad	Jan 11, 2026
https://www.smartkitnow.com/recipes/italian/caprese-salad	Jan 11, 2026
https://www.smartkitnow.com/recipes/antipasto-platter-cured-meats-cheese-olives	Jan 11, 2026
https://www.smartkitnow.com/recipes/italian/antipasto-platter-cured-meats-cheese-olives	Jan 11, 2026
https://www.smartkitnow.com/recipes/italian-bread-salad-panzanella	Jan 11, 2026
https://www.smartkitnow.com/recipes/italian/italian-bread-salad-panzanella	Jan 11, 2026
https://www.smartkitnow.com/recipes/marinated-artichokes	Jan 11, 2026
https://www.smartkitnow.com/recipes/tomato-and-basil-bruschetta	Jan 11, 2026
https://www.smartkitnow.com/recipes/italian/marinated-artichokes	Jan 11, 2026
https://www.smartkitnow.com/recipes/italian/tomato-and-basil-bruschetta	Jan 11, 2026
https://www.smartkitnow.com/recipes/pasta-and-bean-soup-pasta-e-fagioli	Jan 11, 2026
https://www.smartkitnow.com/recipes/italian/pasta-and-bean-soup-pasta-e-fagioli	Jan 11, 2026
https://www.smartkitnow.com/recipes/brazilian-picanha-top-sirloin-cap	Jan 11, 2026
https://www.smartkitnow.com/recipes/texas-style-brisket	Jan 11, 2026
https://www.smartkitnow.com/recipes/bbq-smoking/texas-style-brisket	Jan 11, 2026
https://smartkitnow.com/discover/	Jan 10, 2026
https://www.smartkitnow.com/video/audio-processing-engineering/dbu-dbv-conversion-calculator	Jan 8, 2026
https://www.smartkitnow.com/discover/	Jan 5, 2026
https://www.smartkitnow.com/pets/cats/cat-meloxicam-dose	Jan 2, 2026
https://www.smartkitnow.com/financial/loans-mortgages-payments/heloc-payment-estimator	Dec 23, 2025
https://www.smartkitnow.com/financial/loans-mortgages-payments/loan-payment	Dec 4, 2025
https://www.smartkitnow.com/financial/loans-mortgages-payments/car-loan-affordability	Dec 4, 2025
https://www.smartkitnow.com/financial/loans-mortgages-payments/refinance-savings	Dec 4, 2025
https://www.smartkitnow.com/pets/cats/cat-enrichment-planner	Nov 13, 2025
https://www.smartkitnow.com/smart-tips/wellbeing/sleep-debt-ideal-bedtime	Nov 5, 2025
https://www.smartkitnow.com/financial/currency-tax/vat-gst	Nov 2, 2025
https://www.smartkitnow.com/pets/cats/cat-litter-output-tracker	Nov 2, 2025
https://www.smartkitnow.com/pets/cats/cat-activity-calorie-adjuster	Nov 2, 2025
https://www.smartkitnow.com/pets/cats/prednisolone-dose-cats	Nov 1, 2025
https://www.smartkitnow.com/everyday/home/water-heater-recovery-time	Nov 1, 2025
https://www.smartkitnow.com/smart-tips/wellbeing/caffeine-max-per-day	Nov 1, 2025
https://www.smartkitnow.com/pets/small-mammals/guinea-pig-vitamin-c-intake	Nov 1, 2025
https://www.smartkitnow.com/financial/investments-savings/roi-return-on-investment	Nov 1, 2025
https://www.smartkitnow.com/financial/income-budget-expenses/expense-splitter-shared-bills	Nov 1, 2025
https://www.smartkitnow.com/pets/cats/cat-harness-size	Nov 1, 2025
https://www.smartkitnow.com/pets/dog-nutrition-weight/dog-calorie-needs-rer-mer	Oct 31, 2025
https://www.smartkitnow.com/financial/income-budget-expenses/net-income-after-tax
`;

const urls = userMessage.split('\\n').map(line => line.split('\\t')[0].trim()).filter(line => line.startsWith('http'));

const vercelFile = path.join(__dirname, 'vercel.json');
const config = JSON.parse(fs.readFileSync(vercelFile, 'utf8'));

if (!config.rewrites) config.rewrites = [];

const addedRewrites = new Set();
// extract paths
urls.forEach(u => {
  try {
    const urlObj = new URL(u);
    let pathname = urlObj.pathname;
    
    // Some are top-level directories or exact paths.
    // If it's a redirect that exists in vercel.json, let's remove it and turn to rewrite
    // We'll just look for exact match or suffix / match
    const pathsToMatch = [pathname, pathname.replace(/\\/$/, '')];
    
    // We will find any redirect that has source matching these exactly
    let matched = false;
    for (let i = config.redirects.length - 1; i >= 0; i--) {
      const src = config.redirects[i].source;
      if (src === pathname || src === pathname + '/' || src === pathname.replace(/\\/$/, '')) {
        config.redirects.splice(i, 1);
        matched = true;
      }
    }
    
    // Add rewrite
    if (!addedRewrites.has(pathname)) {
        config.rewrites.unshift({
            source: pathname,
            destination: "/api/404"
        });
        addedRewrites.add(pathname);
    }
    
    // Add variations
    const pathNoSlash = pathname.replace(/\\/$/, '');
    if (pathNoSlash && !addedRewrites.has(pathNoSlash)) {
        config.rewrites.unshift({
            source: pathNoSlash,
            destination: "/api/404"
        });
        addedRewrites.add(pathNoSlash);
    }
  } catch (e) {
    console.error(e);
  }
});

fs.writeFileSync(vercelFile, JSON.stringify(config, null, 2));
console.log('Fixed redirects for user URLs!');
