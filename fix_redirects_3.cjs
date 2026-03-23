const fs = require('fs');
const path = require('path');

const userMessage = `
https://smartkitnow.com/nl/
https://www.smartkitnow.com/nl/
https://www.smartkitnow.com/nl
https://www.smartkitnow.com/time/day-of-week-for-date
https://smartkitnow.com/pt/
https://www.smartkitnow.com/pt/
https://www.smartkitnow.com/pt
https://www.smartkitnow.com/culinary/potato-gnocchi-with-tomato-sauce
https://www.smartkitnow.com/financial/savings-rate-tracker
https://www.smartkitnow.com/pl/strona-glowna-2/
https://www.smartkitnow.com/pl/strona-glowna-2
https://www.smartkitnow.com/video/speaker-crossover-calculator
https://smartkitnow.com/home/
https://www.smartkitnow.com/home
https://www.smartkitnow.com/home/
https://www.smartkitnow.com/culinary/italian/tuscan-steak-florentine-style
https://www.smartkitnow.com/culinary/mexican/pico-de-gallo
https://www.smartkitnow.com/video/resolution-aspect-ratio-pixels/aspect-ratio-16-9-to-9-16-1-1-crop-safe-area-helper
https://www.smartkitnow.com/culinary/italian/garlic-and-olive-oil-pasta-aglio-e-olio
https://www.smartkitnow.com/culinary/elote
https://www.smartkitnow.com/culinary/salsa-roja
https://www.smartkitnow.com/culinary/affogato
https://www.smartkitnow.com/culinary/panna-cotta
https://www.smartkitnow.com/culinary/polenta-with-meat-ragu
https://www.smartkitnow.com/culinary/breadsticks-grissini
https://www.smartkitnow.com/culinary/italian/chicken-saltimbocca
https://www.smartkitnow.com/culinary/shrimp-cocktail-mexican-style
https://www.smartkitnow.com/culinary/italian-style-roast-pork-porchetta
https://www.smartkitnow.com/video/camera-bitrate-record-time-converter
https://www.smartkitnow.com/tv
http://smartkitnow.com/
https://smartkitnow.com/
http://www.smartkitnow.com/
https://www.smartkitnow.com/recipes/chicken-and-corn-stew
https://www.smartkitnow.com/recipes/brazilian-black-beans
https://www.smartkitnow.com/sports/running-cycling-triathlon-performance/pool-length-time-converter
https://www.smartkitnow.com/video/time-fps-timecode/timecode-to-frames-calculator
https://www.smartkitnow.com/recipes/creamy-shrimp-peanut-stew-vatapa
https://www.smartkitnow.com/recipes/coastal-fish-stew
https://www.smartkitnow.com/recipes/chicken-and-okra-stew-frango-com-quiabo
https://www.smartkitnow.com/culinary/mexican/pozole
https://www.smartkitnow.com/recipes/birria-tacos
https://www.smartkitnow.com/recipes/mexican/birria-tacos
https://www.smartkitnow.com/recipes/tostadas
https://www.smartkitnow.com/recipes/mexican/tostadas
https://www.smartkitnow.com/recipes/chilaquiles
https://www.smartkitnow.com/recipes/huaraches
https://www.smartkitnow.com/recipes/mexican/huaraches
https://www.smartkitnow.com/recipes/pozole
https://www.smartkitnow.com/recipes/tacos-al-pastor
https://www.smartkitnow.com/recipes/mole-poblano
https://www.smartkitnow.com/recipes/agua-de-jamaica
https://www.smartkitnow.com/recipes/mexican/agua-de-jamaica
https://www.smartkitnow.com/recipes/churros
https://www.smartkitnow.com/recipes/mexican/churros
https://www.smartkitnow.com/recipes/esquites
https://www.smartkitnow.com/recipes/mexican/esquites
https://www.smartkitnow.com/recipes/sopes
https://www.smartkitnow.com/recipes/mexican/sopes
https://www.smartkitnow.com/recipes/pico-de-gallo
https://www.smartkitnow.com/recipes/cochinita-pibil
https://www.smartkitnow.com/recipes/mexican/cochinita-pibil
https://www.smartkitnow.com/recipes/frijoles-refritos
https://www.smartkitnow.com/recipes/mexican/frijoles-refritos
https://www.smartkitnow.com/recipes/chicken-tinga-tacos
https://www.smartkitnow.com/recipes/mexican/chicken-tinga-tacos
https://www.smartkitnow.com/recipes/huevos-mexicanos-con-salsa
https://www.smartkitnow.com/recipes/salsa-roja
https://www.smartkitnow.com/recipes/mexican/salsa-roja
https://www.smartkitnow.com/recipes/arroz-mexicano
https://www.smartkitnow.com/recipes/mexican/arroz-mexicano
https://www.smartkitnow.com/recipes/pastel-tres-leches
https://www.smartkitnow.com/recipes/mexican/pastel-tres-leches
https://www.smartkitnow.com/recipes/carne-asada
https://www.smartkitnow.com/recipes/mexican/carne-asada
https://www.smartkitnow.com/recipes/sopa-de-lima
https://www.smartkitnow.com/recipes/carne-asada-tacos
https://www.smartkitnow.com/recipes/mexican/sopa-de-lima
https://www.smartkitnow.com/recipes/birria
https://www.smartkitnow.com/recipes/quesadillas
https://www.smartkitnow.com/recipes/mexican/birria
https://www.smartkitnow.com/recipes/mexican/quesadillas
https://www.smartkitnow.com/recipes/horchata
https://www.smartkitnow.com/recipes/mexican/horchata
https://www.smartkitnow.com/recipes/enchiladas-suizas
https://www.smartkitnow.com/recipes/mexican/elote
https://www.smartkitnow.com/recipes/chiles-en-nogada
https://www.smartkitnow.com/recipes/mexican/chiles-en-nogada
https://www.smartkitnow.com/recipes/elote
https://www.smartkitnow.com/recipes/chicken-tinga
https://www.smartkitnow.com/recipes/mexican/chicken-tinga
https://www.smartkitnow.com/recipes/queso-fundido
https://www.smartkitnow.com/recipes/guacamole
https://www.smartkitnow.com/recipes/mexican/guacamole
https://www.smartkitnow.com/recipes/enchiladas-rojas
https://www.smartkitnow.com/recipes/huevos-rancheros
https://www.smartkitnow.com/recipes/enchiladas-verdes
https://www.smartkitnow.com/recipes/mexican/huevos-rancheros
https://www.smartkitnow.com/recipes/mexican/enchiladas-verdes
https://www.smartkitnow.com/recipes/fish-tacos
https://www.smartkitnow.com/recipes/mexican/fish-tacos
https://www.smartkitnow.com/recipes/migas-mexican-style
https://www.smartkitnow.com/recipes/mexican/migas-mexican-style
https://www.smartkitnow.com/recipes/salsa-verde
https://www.smartkitnow.com/recipes/mexican/salsa-verde
https://www.smartkitnow.com/recipes/chiles-rellenos
https://www.smartkitnow.com/recipes/mexican/chiles-rellenos
https://www.smartkitnow.com/recipes/roasted-tomato-salsa
https://www.smartkitnow.com/recipes/mexican/roasted-tomato-salsa
https://www.smartkitnow.com/recipes/tamales
https://www.smartkitnow.com/recipes/mexican/tamales
https://www.smartkitnow.com/recipes/gorditas
https://www.smartkitnow.com/recipes/taquitos
https://www.smartkitnow.com/recipes/mexican/gorditas
https://www.smartkitnow.com/recipes/mexican/taquitos
https://www.smartkitnow.com/recipes/shrimp-tacos
https://www.smartkitnow.com/recipes/mexican/shrimp-tacos
https://www.smartkitnow.com/recipes/frijoles-charros
https://www.smartkitnow.com/recipes/mexican/frijoles-charros
https://www.smartkitnow.com/recipes/baja-fish-tacos
https://www.smartkitnow.com/recipes/breakfast-tacos
https://www.smartkitnow.com/recipes/mexican/baja-fish-tacos
https://www.smartkitnow.com/recipes/mexican/breakfast-tacos
https://www.smartkitnow.com/recipes/chicken-tortilla-soup
https://www.smartkitnow.com/recipes/mexican/chicken-tortilla-soup
https://www.smartkitnow.com/recipes/flautas
https://www.smartkitnow.com/recipes/mexican/flautas
https://www.smartkitnow.com/recipes/black-bean-dip
https://www.smartkitnow.com/recipes/mexican/black-bean-dip
https://www.smartkitnow.com/recipes/tlayudas
https://www.smartkitnow.com/recipes/pork-carnitas
https://www.smartkitnow.com/recipes/mexican/tlayudas
https://www.smartkitnow.com/recipes/mexican/pork-carnitas
https://www.smartkitnow.com/recipes/carnitas-tacos
https://www.smartkitnow.com/recipes/flan
https://www.smartkitnow.com/recipes/menudo
https://www.smartkitnow.com/recipes/mexican/menudo
https://www.smartkitnow.com/recipes/tortillas-de-maiz
https://www.smartkitnow.com/recipes/margarita
https://www.smartkitnow.com/recipes/albondigas-soup
https://www.smartkitnow.com/recipes/mexican/margarita
https://www.smartkitnow.com/recipes/mexican/albondigas-soup
https://www.smartkitnow.com/recipes/shrimp-cocktail-mexican-style
https://www.smartkitnow.com/recipes/mexican/shrimp-cocktail-mexican-style
https://www.smartkitnow.com/recipes/nachos
https://www.smartkitnow.com/recipes/mexican/nachos
https://www.smartkitnow.com/recipes/barbacoa-tacos
https://www.smartkitnow.com/recipes/tortillas-de-harina
https://www.smartkitnow.com/recipes/mexican/barbacoa-tacos
https://www.smartkitnow.com/recipes/mexican/tortillas-de-harina
https://www.smartkitnow.com/recipes/chicken-enchiladas
https://www.smartkitnow.com/recipes/mexican/chicken-enchiladas
https://www.smartkitnow.com/culinary/italian/focaccia
https://www.smartkitnow.com/pets/cat-water-intake
https://www.smartkitnow.com/culinary/italian/spaghetti-with-clams
https://www.smartkitnow.com/recipes/baby-back-ribs
https://www.smartkitnow.com/recipes/bbq-smoking/baby-back-ribs
https://www.smartkitnow.com/culinary/italian/ciabatta
https://www.smartkitnow.com/recipes/minestrone-soup
https://www.smartkitnow.com/recipes/baked-stuffed-mushrooms
https://www.smartkitnow.com/recipes/italian/minestrone-soup
https://www.smartkitnow.com/recipes/prosciutto-and-melon
https://www.smartkitnow.com/recipes/fried-rice-balls-arancini
https://www.smartkitnow.com/recipes/italian/baked-stuffed-mushrooms
https://www.smartkitnow.com/recipes/italian/prosciutto-and-melon
https://www.smartkitnow.com/recipes/italian/fried-rice-balls-arancini
https://www.smartkitnow.com/recipes/tuscan-bread-and-vegetable-soup-ribollita
https://www.smartkitnow.com/recipes/italian/tuscan-bread-and-vegetable-soup-ribollita
https://www.smartkitnow.com/recipes/garlic-and-herb-crostini
https://www.smartkitnow.com/recipes/italian/garlic-and-herb-crostini
https://www.smartkitnow.com/recipes/stuffed-zucchini-blossoms
https://www.smartkitnow.com/recipes/italian/stuffed-zucchini-blossoms
https://www.smartkitnow.com/recipes/caprese-salad
https://www.smartkitnow.com/recipes/italian/caprese-salad
https://www.smartkitnow.com/recipes/antipasto-platter-cured-meats-cheese-olives
https://www.smartkitnow.com/recipes/italian/antipasto-platter-cured-meats-cheese-olives
https://www.smartkitnow.com/recipes/italian-bread-salad-panzanella
https://www.smartkitnow.com/recipes/italian/italian-bread-salad-panzanella
https://www.smartkitnow.com/recipes/marinated-artichokes
https://www.smartkitnow.com/recipes/tomato-and-basil-bruschetta
https://www.smartkitnow.com/recipes/italian/marinated-artichokes
https://www.smartkitnow.com/recipes/italian/tomato-and-basil-bruschetta
https://www.smartkitnow.com/recipes/pasta-and-bean-soup-pasta-e-fagioli
https://www.smartkitnow.com/recipes/italian/pasta-and-bean-soup-pasta-e-fagioli
https://www.smartkitnow.com/recipes/brazilian-picanha-top-sirloin-cap
https://www.smartkitnow.com/recipes/texas-style-brisket
https://www.smartkitnow.com/recipes/bbq-smoking/texas-style-brisket
https://smartkitnow.com/discover/
https://www.smartkitnow.com/video/audio-processing-engineering/dbu-dbv-conversion-calculator
https://www.smartkitnow.com/discover/
https://www.smartkitnow.com/pets/cats/cat-meloxicam-dose
https://www.smartkitnow.com/financial/loans-mortgages-payments/heloc-payment-estimator
https://www.smartkitnow.com/financial/loans-mortgages-payments/loan-payment
https://www.smartkitnow.com/financial/loans-mortgages-payments/car-loan-affordability
https://www.smartkitnow.com/financial/loans-mortgages-payments/refinance-savings
https://www.smartkitnow.com/pets/cats/cat-enrichment-planner
https://www.smartkitnow.com/smart-tips/wellbeing/sleep-debt-ideal-bedtime
https://www.smartkitnow.com/financial/currency-tax/vat-gst
https://www.smartkitnow.com/pets/cats/cat-litter-output-tracker
https://www.smartkitnow.com/pets/cats/cat-activity-calorie-adjuster
https://www.smartkitnow.com/pets/cats/prednisolone-dose-cats
https://www.smartkitnow.com/everyday/home/water-heater-recovery-time
https://www.smartkitnow.com/smart-tips/wellbeing/caffeine-max-per-day
https://www.smartkitnow.com/pets/small-mammals/guinea-pig-vitamin-c-intake
https://www.smartkitnow.com/financial/investments-savings/roi-return-on-investment
https://www.smartkitnow.com/financial/income-budget-expenses/expense-splitter-shared-bills
https://www.smartkitnow.com/pets/cats/cat-harness-size
https://www.smartkitnow.com/pets/dog-nutrition-weight/dog-calorie-needs-rer-mer
https://www.smartkitnow.com/financial/income-budget-expenses/net-income-after-tax
`;

const urls = userMessage.trim().split(/\n/).filter(line => line.startsWith('http')).map(line => line.trim());

const vercelFile = path.join(__dirname, 'vercel.json');
const config = JSON.parse(fs.readFileSync(vercelFile, 'utf8'));

if (!config.rewrites) config.rewrites = [];

const addedRewrites = new Set();
let removedRedirectsCount = 0;

urls.forEach(u => {
  try {
    const urlObj = new URL(u);
    let pathname = urlObj.pathname;
    
    // We will find any redirect that has source matching these exactly
    // e.g. /home/ or /home
    const possibleSrcs = [
      pathname,
      pathname.endsWith('/') ? pathname.slice(0, -1) : pathname,
      pathname.endsWith('/') ? pathname : pathname + '/'
    ];

    for (let i = config.redirects.length - 1; i >= 0; i--) {
      const src = config.redirects[i].source;
      if (possibleSrcs.includes(src)) {
        config.redirects.splice(i, 1);
        removedRedirectsCount++;
      }
    }
    
    // Add rewrite to 404
    const toAdd = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    if (toAdd && toAdd !== '/' && !addedRewrites.has(toAdd)) {
        config.rewrites.unshift({
            source: toAdd,
            destination: "/api/404"
        });
        addedRewrites.add(toAdd);
        
        config.rewrites.unshift({
            source: toAdd + '/:path*',
            destination: "/api/404"
        });
        addedRewrites.add(toAdd + '_path');
    }
  } catch (e) {
    console.error(e);
  }
});

fs.writeFileSync(vercelFile, JSON.stringify(config, null, 2));
console.log('Fixed! Removed', removedRedirectsCount, 'redirects and added', addedRewrites.size / 2, 'rewrites.');
