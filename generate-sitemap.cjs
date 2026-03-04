
const fs = require('fs');
const path = require('path');

// 1. Configuração Básica
const BASE_URL = "https://www.smartkitnow.com";
const TODAY = new Date().toISOString().split('T')[0];
// Data de referência para páginas estáticas — atualizar ao fazer mudanças significativas de conteúdo
const STATIC_DATE = "2026-02-26";

// 2. Lista COMPLETA baseada no que você me mandou (Limpa e Padronizada)
// Note que removi as subcategorias para resolver o problema de URL duplicada no Google
const pages = [
    // --- PÁGINAS FIXAS ---
    { url: "", priority: "1.0", changefreq: "daily" }, // Home
    { url: "search", priority: "0.8", changefreq: "weekly" },
    { url: "privacy", priority: "0.5", changefreq: "yearly" },
    { url: "terms", priority: "0.5", changefreq: "yearly" },
    { url: "about", priority: "0.5", changefreq: "yearly" },
    { url: "contact", priority: "0.5", changefreq: "yearly" },

    // --- FERRAMENTAS RECORRENTES (Alto Engajamento) ---
    { url: "lifestyle/dream-interpreter", priority: "0.9", changefreq: "daily" },
    { url: "lifestyle/daily-horoscope", priority: "0.9", changefreq: "daily" },

    // --- FINANCEIRO (Financial) ---
    { url: "financial/loan-payment", priority: "0.8" },
    { url: "financial/mortgage-amortization", priority: "0.8" },
    { url: "financial/extra-payments-payoff", priority: "0.8" },
    { url: "financial/interest-only-loan", priority: "0.8" },
    { url: "financial/refinance-savings", priority: "0.8" },
    { url: "financial/heloc-payment-estimator", priority: "0.8" },
    { url: "financial/car-loan-affordability", priority: "0.8" },
    { url: "financial/balloon-payment", priority: "0.8" },
    { url: "financial/house-affordability", priority: "0.8" },
    { url: "financial/auto-loan", priority: "0.8" },
    { url: "financial/student-loan-repayment", priority: "0.8" },
    { url: "financial/lease-vs-buy", priority: "0.8" },
    { url: "financial/future-value-investment", priority: "0.8" },
    { url: "financial/roi-return-on-investment", priority: "0.8" },
    { url: "financial/sip-monthly-investment-planner", priority: "0.8" },
    { url: "financial/inflation-adjusted-value", priority: "0.8" },
    { url: "financial/retirement-savings-goal", priority: "0.8" },
    { url: "financial/emergency-fund-goal", priority: "0.8" },
    { url: "financial/401k-retirement-savings-growth", priority: "0.8" },
    { url: "financial/social-security-benefit-estimator", priority: "0.8" },
    { url: "financial/rule-of-72", priority: "0.8" },
    { url: "financial/bond-yield", priority: "0.8" },
    { url: "financial/roth-ira-conversion", priority: "0.8" },
    { url: "financial/dca-simulator", priority: "0.8" },
    { url: "financial/crypto-dca-strategy", priority: "0.8" },
    { url: "financial/stock-dca-return-estimator", priority: "0.8" },
    { url: "financial/monthly-budget-planner", priority: "0.8" },
    { url: "financial/net-income-after-tax", priority: "0.8" },
    { url: "financial/hourly-to-annual-salary", priority: "0.8" },
    { url: "financial/debt-to-income-ratio", priority: "0.8" },
    { url: "financial/savings-rate-tracker", priority: "0.8" },
    { url: "financial/expense-splitter-shared-bills", priority: "0.8" },
    { url: "financial/take-home-pay", priority: "0.8" },
    { url: "financial/paycheck-calculator", priority: "0.8" },
    { url: "financial/absence-percentage-calculator", priority: "0.8" },
    { url: "financial/credit-card-payoff", priority: "0.8" },
    { url: "financial/debt-consolidation", priority: "0.8" },
    { url: "financial/net-worth", priority: "0.8" },
    { url: "financial/currency-converter-live", priority: "0.8" },
    { url: "financial/sales-tax", priority: "0.8" },
    { url: "financial/vat-gst", priority: "0.8" },
    { url: "financial/debt-snowball", priority: "0.8" },
    { url: "financial/apr", priority: "0.8" },
    { url: "financial/credit-card-interest", priority: "0.8" },
    { url: "financial/loan-comparison", priority: "0.8" },
    { url: "financial/college-savings", priority: "0.8" },
    { url: "financial/irr-npv", priority: "0.8" },
    { url: "financial/tax-bracket", priority: "0.8" },
    { url: "financial/crypto-to-fiat", priority: "0.8" },
    { url: "financial/crypto-to-crypto-exchange-rate", priority: "0.8" },
    { url: "financial/live-price-checker", priority: "0.8" },
    { url: "financial/portfolio-value-tracker", priority: "0.8" },
    { url: "financial/fiat-to-crypto-purchase", priority: "0.8" },
    { url: "financial/multi-currency-crypto-converter", priority: "0.8" },
    { url: "financial/crypto-profit-loss", priority: "0.8" },
    { url: "financial/crypto-roi", priority: "0.8" },
    { url: "financial/crypto-future-value-compound-growth", priority: "0.8" },
    { url: "financial/yield-farming-apy", priority: "0.8" },
    { url: "financial/staking-rewards-estimator", priority: "0.8" },
    { url: "financial/investment-break-even-point", priority: "0.8" },
    { url: "financial/dca-strategy-analyzer-crypto", priority: "0.8" },
    { url: "financial/mining-profitability", priority: "0.8" },
    { url: "financial/hash-rate-to-earnings", priority: "0.8" },
    { url: "financial/electricity-cost-vs-mining-revenue", priority: "0.8" },
    { url: "financial/gpu-asic-mining-roi", priority: "0.8" },
    { url: "financial/pool-fee-impact", priority: "0.8" },
    { url: "financial/crypto-tax-liability", priority: "0.8" },
    { url: "financial/capital-gains-tax-estimator", priority: "0.8" },
    { url: "financial/transaction-fee-deduction", priority: "0.8" },
    { url: "financial/cost-basis-fifo-lifo", priority: "0.8" },
    { url: "financial/leverage-margin-profit", priority: "0.8" },
    { url: "financial/position-size-risk-management", priority: "0.8" },
    { url: "financial/volatility-risk-assessment", priority: "0.8" },

    // --- SAÚDE (Health) ---
    { url: "health/bmi-body-mass-index", priority: "0.9" },
    { url: "health/bmr-mifflin-st-jeor", priority: "0.8" },
    { url: "health/tdee-daily-energy-expenditure", priority: "0.8" },
    { url: "health/body-fat-us-navy-3-sites", priority: "0.8" },
    { url: "health/ideal-weight-range-hamwi-devine-miller", priority: "0.8" },
    { url: "health/waist-to-height-ratio", priority: "0.8" },
    { url: "health/body-surface-area-bsa", priority: "0.8" },
    { url: "health/daily-calorie-needs-goal", priority: "0.8" },
    { url: "health/weight-loss-date-deficit-planner", priority: "0.8" },
    { url: "health/macro-split-planner", priority: "0.8" },
    { url: "health/protein-intake-by-goal", priority: "0.8" },
    { url: "health/carb-target-low-carb-keto", priority: "0.8" },
    { url: "health/fat-intake-range-amdr", priority: "0.8" },
    { url: "health/fiber-intake-target", priority: "0.8" },
    { url: "health/water-intake-per-day", priority: "0.8" },
    { url: "health/meal-calories-split", priority: "0.8" },
    { url: "health/running-pace-speed-splits", priority: "0.8" },
    { url: "health/calories-burned-met", priority: "0.8" },
    { url: "health/heart-rate-zones", priority: "0.8" },
    { url: "health/vo2max-estimator-cooper-rockport", priority: "0.8" },
    { url: "health/one-rep-max-1rm-epley-brzycki", priority: "0.8" },
    { url: "health/steps-distance-calories-converter", priority: "0.8" },
    { url: "health/ovulation-fertile-window", priority: "0.8" },
    { url: "health/pregnancy-due-date-naegele", priority: "0.8" },
    { url: "health/pregnancy-weight-gain-range-bmi-aware", priority: "0.8" },
    { url: "health/tdee-gestation-adjusted", priority: "0.8" },

    // --- CONVERSÃO (Conversion) ---
    { url: "conversion/length-m-ft-in", priority: "0.7" },
    { url: "conversion/area-m2-ft2", priority: "0.7" },
    { url: "conversion/volume-l-ml-gal-oz", priority: "0.7" },
    { url: "conversion/mass-kg-lb-oz", priority: "0.7" },
    { url: "conversion/temperature-c-f-k", priority: "0.7" },
    { url: "conversion/density-g-per-ml-kg-per-m3", priority: "0.7" },
    { url: "conversion/angle-deg-rad", priority: "0.7" },
    { url: "conversion/speed-mps-kmph-mph", priority: "0.7" },
    { url: "conversion/force-n-lbf", priority: "0.7" },
    { url: "conversion/energy-j-cal-kwh", priority: "0.7" },
    { url: "conversion/power-w-hp", priority: "0.7" },
    { url: "conversion/pressure-pa-bar-psi", priority: "0.7" },
    { url: "conversion/torque-nm-lbfft", priority: "0.7" },
    { url: "conversion/work-potential-energy", priority: "0.7" },
    { url: "conversion/time-ms-s-min-hr", priority: "0.7" },
    { url: "conversion/frequency-hz-khz-mhz", priority: "0.7" },
    { url: "conversion/period-frequency", priority: "0.7" },
    { url: "conversion/frame-rate-fps-hz", priority: "0.7" },
    { url: "conversion/clock-time-timezone-shift", priority: "0.7" },
    { url: "conversion/bytes-b-kb-mb-gb-tb", priority: "0.7" },
    { url: "conversion/bits-b-kb-mb-gb", priority: "0.7" },
    { url: "conversion/binary-decimal-prefixes", priority: "0.7" },
    { url: "conversion/transfer-speed-mbps-mbs", priority: "0.7" },
    { url: "conversion/compression-ratio-size", priority: "0.7" },
    { url: "conversion/checksum-hash-quick-tools", priority: "0.7" },
    { url: "conversion/cooking-tsp-tbsp-cup-ml", priority: "0.7" },
    { url: "conversion/fuel-economy-l-per-100km-mpg", priority: "0.7" },
    { url: "conversion/currency-fx-quick-convert", priority: "0.7" },
    { url: "conversion/bmi-bsa-quick-estimators", priority: "0.7" },
    { url: "conversion/paper-size-a-series-us", priority: "0.7" },
    { url: "conversion/shoe-size-eu-us-uk", priority: "0.7" },

    // --- CULINÁRIA (Cooking) ---
    { url: "cooking/cups-grams-ounces-by-ingredient", priority: "0.7" },
    { url: "cooking/volume-weight-food-density", priority: "0.7" },
    { url: "cooking/fahrenheit-celsius-oven-internal-temp", priority: "0.7" },
    { url: "cooking/teaspoon-tablespoon-cup-ml-converter", priority: "0.7" },
    { url: "cooking/recipe-scaler", priority: "0.7" },
    { url: "cooking/serving-size-multiplier", priority: "0.7" },
    { url: "cooking/salt-percent-brining", priority: "0.7" },
    { url: "cooking/alcohol-abv-dilution", priority: "0.7" },
    { url: "cooking/cake-pan-size-volume-converter", priority: "0.7" },
    { url: "cooking/bakers-percentage", priority: "0.7" },
    { url: "cooking/dough-hydration-percent", priority: "0.7" },
    { url: "cooking/sourdough-starter-ratio-feed-planner", priority: "0.7" },
    { url: "cooking/yeast-conversion-instant-active-fresh", priority: "0.7" },
    { url: "cooking/flour-blend-substitution", priority: "0.7" },
    { url: "cooking/sugar-butter-flour-density-lookup", priority: "0.7" },
    { url: "cooking/chocolate-butter-tempering-temperature", priority: "0.7" },
    { url: "cooking/turkey-thaw-cook-time", priority: "0.7" },
    { url: "cooking/whole-chicken-roast-cook-time", priority: "0.7" },
    { url: "cooking/steak-doneness-time-resting", priority: "0.7" },
    { url: "cooking/pork-beef-smoking-time-per-lb", priority: "0.7" },
    { url: "cooking/safe-internal-temperature-checker", priority: "0.7" },
    { url: "cooking/defrost-time-fridge-cold-water", priority: "0.7" },
    { url: "cooking/rice-water-ratio-yield", priority: "0.7" },
    { url: "cooking/pasta-dry-cooked-yield-portions", priority: "0.7" },
    { url: "cooking/stock-broth-reduction-time-yield", priority: "0.7" },
    { url: "cooking/oil-for-frying-pan-depth-volume", priority: "0.7" },
    { url: "cooking/icing-frosting-coverage-cake-size", priority: "0.7" },

    // --- MATEMÁTICA (Math) ---
    { url: "math/percent-of-total", priority: "0.7" },
    { url: "math/percent-increase-decrease", priority: "0.7" },
    { url: "math/percent-change", priority: "0.7" },
    { url: "math/fraction-decimal-converter", priority: "0.7" },
    { url: "math/fraction-reducer-simplifier", priority: "0.7" },
    { url: "math/ratio-calculator", priority: "0.7" },
    { url: "math/percent-error-calculator", priority: "0.7" },
    { url: "math/proportion-solver", priority: "0.7" },
    { url: "math/quadratic-equation-solver", priority: "0.7" },
    { url: "math/linear-equation-solver-1-2-variables", priority: "0.7" },
    { url: "math/system-of-equations-substitution-elimination", priority: "0.7" },
    { url: "math/exponent-power-calculator", priority: "0.7" },
    { url: "math/log-antilog-base-10-e", priority: "0.7" },
    { url: "math/scientific-notation-standard-form", priority: "0.7" },
    { url: "math/polynomial-factorization-helper", priority: "0.7" },
    { url: "math/root-radical-simplifier", priority: "0.7" },
    { url: "math/gcf-gcd-calculator", priority: "0.7" },
    { url: "math/lcm-calculator", priority: "0.7" },
    { url: "math/prime-factorization-tool", priority: "0.7" },
    { url: "math/modulo-remainder-calculator", priority: "0.7" },
    { url: "math/permutations-combinations-npr-ncr", priority: "0.7" },
    { url: "math/random-number-generator-ranges", priority: "0.7" },
    { url: "math/triangle-solver-sss-sas-asa", priority: "0.7" },
    { url: "math/circle-area-circumference", priority: "0.7" },
    { url: "math/rectangle-parallelogram-area", priority: "0.7" },
    { url: "math/pythagorean-theorem-solver", priority: "0.7" },
    { url: "math/trig-functions-angle-side-finder", priority: "0.7" },
    { url: "math/shapes-area-volume-pack", priority: "0.7" },
    { url: "math/angle-converter-deg-rad", priority: "0.7" },
    { url: "math/mean-median-mode", priority: "0.7" },
    { url: "math/standard-deviation-variance-pop-sample", priority: "0.7" },
    { url: "math/z-score-percentile-finder", priority: "0.7" },
    { url: "math/linear-interpolation-extrapolation", priority: "0.7" },
    { url: "math/binomial-probability-calculator", priority: "0.7" },
    { url: "math/normal-cdf-pdf-estimator", priority: "0.7" },

    // --- CIÊNCIA (Science) ---
    { url: "science/kinematics-suvat-solver", priority: "0.7" },
    { url: "science/projectile-motion-calculator", priority: "0.7" },
    { url: "science/force-work-energy-calculator", priority: "0.7" },
    { url: "science/momentum-impulse-calculator", priority: "0.7" },
    { url: "science/power-efficiency-calculator", priority: "0.7" },
    { url: "science/uniform-circular-motion-centripetal", priority: "0.7" },
    { url: "science/free-fall-time-velocity-estimator", priority: "0.7" },
    { url: "science/wave-speed-frequency-wavelength", priority: "0.7" },
    { url: "science/snells-law-critical-angle", priority: "0.7" },
    { url: "science/thin-lens-solver", priority: "0.7" },
    { url: "science/specific-heat-q-mc-delta-t", priority: "0.7" },
    { url: "science/heat-transfer-conduction", priority: "0.7" },
    { url: "science/blackbody-peak-wien-law-estimator", priority: "0.7" },
    { url: "science/photon-energy-e-hf", priority: "0.7" },
    { url: "science/half-life-exponential-decay", priority: "0.7" },
    { url: "science/radioactive-activity-a-lambda-n", priority: "0.7" },
    { url: "science/reactance-capacitor-inductor-educational", priority: "0.7" },
    { url: "science/rc-time-constant-tau-rc", priority: "0.7" },
    { url: "science/molarity-moles-volume", priority: "0.7" },
    { url: "science/dilution-c1v1-c2v2", priority: "0.7" },
    { url: "science/molality-normality-converter", priority: "0.7" },
    { url: "science/ideal-gas-law-pv-nrt", priority: "0.7" },
    { url: "science/stoichiometry-limiting-reagent", priority: "0.7" },
    { url: "science/percent-yield-theoretical-yield", priority: "0.7" },
    { url: "science/ph-poh-h-oh-calculator", priority: "0.7" },
    { url: "science/buffer-henderson-hasselbalch-helper", priority: "0.7" },
    { url: "science/molar-mass-calculator", priority: "0.7" },
    { url: "science/percent-composition-by-mass", priority: "0.7" },
    { url: "science/ppm-ppb-concentration-converter", priority: "0.7" },
    { url: "science/density-specific-gravity-calculator", priority: "0.7" },
    { url: "science/escape-velocity-calculator", priority: "0.7" },
    { url: "science/orbital-period-kepler-estimator", priority: "0.7" },
    { url: "science/gravity-on-other-planets-calculator", priority: "0.7" },

    // --- DIA A DIA (Everyday) ---
    { url: "everyday/cleaning-dilution-ratio", priority: "0.7" },
    { url: "everyday/laundry-detergent-dosage", priority: "0.7" },
    { url: "everyday/home-paint-touch-up", priority: "0.7" },
    { url: "everyday/room-air-changes-ach", priority: "0.7" },
    { url: "everyday/propane-tank-burn-time", priority: "0.7" },
    { url: "everyday/refrigerator-freezer-safe-zone-time-window", priority: "0.7" },
    { url: "everyday/light-bulb-cost-per-year", priority: "0.7" },
    { url: "everyday/water-heater-recovery-time", priority: "0.7" },
    { url: "everyday/home-renovation-cost-estimator", priority: "0.7" },
    { url: "everyday/appliance-energy-consumption", priority: "0.7" },
    { url: "everyday/life-expectancy", priority: "0.7" },
    { url: "everyday/sleep-debt-ideal-bedtime", priority: "0.7" },
    { url: "everyday/caffeine-max-per-day", priority: "0.7" },
    { url: "everyday/screen-time-pomodoro-planner", priority: "0.7" },
    { url: "everyday/steps-to-distance-converter", priority: "0.7" },
    { url: "everyday/hydration-reminder-interval", priority: "0.7" },
    { url: "everyday/myplate-daily-calorie-nutrient", priority: "0.7" },
    { url: "everyday/party-food-drinks-planner", priority: "0.7" },
    { url: "everyday/ice-quantity-beverages", priority: "0.7" },
    { url: "everyday/buffet-pan-capacity-count", priority: "0.7" },
    { url: "everyday/beverage-mix-estimator", priority: "0.7" },
    { url: "everyday/coffee-urn-yield-strength", priority: "0.7" },
    { url: "everyday/leftovers-cooling-reheat-time", priority: "0.7" },
    { url: "everyday/event-budget-calculator", priority: "0.7" },
    { url: "everyday/event-capacity-calculator", priority: "0.7" },
    { url: "everyday/mulch-coverage-bag-count", priority: "0.7" },
    { url: "everyday/garden-soil-compost-volume", priority: "0.7" },
    { url: "everyday/lawn-mowing-time-fuel", priority: "0.7" },
    { url: "everyday/hose-runtime-flow-rate", priority: "0.7" },
    { url: "everyday/rainwater-barrel-days-supply", priority: "0.7" },
    { url: "everyday/grass-seed-quantity", priority: "0.7" },
    { url: "everyday/square-footage-calculator", priority: "0.7" },
    { url: "everyday/planting-calendar-frost-date", priority: "0.7" },
    { url: "everyday/plant-spacing-calculator", priority: "0.7" },
    { url: "everyday/fertilizer-application-calculator", priority: "0.7" },

    // --- JOGOS (Games) — slugs exatos do gameRegistry.tsx ---
    { url: "games", priority: "0.8", changefreq: "weekly" },
    // Arcade
    { url: "games/neon-snake", priority: "0.8" },
    { url: "games/galaxy-invaders", priority: "0.8" },
    { url: "games/brick-breaker-pro", priority: "0.8" },
    { url: "games/pong-masters", priority: "0.8" },
    { url: "games/meteor-blast", priority: "0.8" },
    { url: "games/cyber-pinball", priority: "0.8" },
    { url: "games/tank-battle-arena", priority: "0.8" },
    { url: "games/pac-runner", priority: "0.8" },
    // Endless Runner
    { url: "games/dino-run-3d", priority: "0.8" },
    { url: "games/subway-surfer-lite", priority: "0.7" },
    { url: "games/cosmic-dash", priority: "0.7" },
    { url: "games/temple-escape", priority: "0.7" },
    { url: "games/ninja-roof-runner", priority: "0.8" },
    { url: "games/brick-dash", priority: "0.8" },
    // Puzzle
    { url: "games/sudoku-zen", priority: "0.9" },
    { url: "games/jigsaw-explorer", priority: "0.7" },
    { url: "games/2048-classic", priority: "0.9" },
    { url: "games/minesweeper-pro", priority: "0.8" },
    { url: "games/tangram-master", priority: "0.7" },
    { url: "games/pipe-connect", priority: "0.7" },
    { url: "games/block-puzzle-jewel", priority: "0.7" },
    { url: "games/differences-finder", priority: "0.7" },
    { url: "games/water-sort", priority: "0.8" },
    { url: "games/hexa-puzzle", priority: "0.7" },
    // Magic Cube
    { url: "games/rubiks-cube-3x3", priority: "0.7" },
    { url: "games/speed-cuber-timer", priority: "0.7" },
    { url: "games/cube-solver-ai", priority: "0.7" },
    // Word
    { url: "games/wordle-unlimited", priority: "0.9" },
    { url: "games/crossword-daily", priority: "0.8" },
    { url: "games/word-search-pro", priority: "0.8" },
    { url: "games/hangman-extreme", priority: "0.8" },
    { url: "games/scrabble-solo", priority: "0.7" },
    { url: "games/typing-racer", priority: "0.8" },
    // Math
    { url: "games/math-blaster", priority: "0.7" },
    { url: "games/24-game", priority: "0.8" },
    { url: "games/mental-math-gym", priority: "0.8" },
    { url: "games/fraction-pizza", priority: "0.7" },
    { url: "games/geometry-dash-lite", priority: "0.8" },
    // Board
    { url: "games/tic-tac-toe-prime", priority: "0.9" },
    { url: "games/chess-master-ai", priority: "0.8" },
    { url: "games/checkers-online", priority: "0.7" },
    { url: "games/connect-4-pro", priority: "0.8" },
    { url: "games/backgammon-live", priority: "0.7" },
    { url: "games/ludo-party", priority: "0.7" },
    // Card
    { url: "games/solitaire-klondike", priority: "0.8" },
    { url: "games/baccarat-royale", priority: "0.7" },
    { url: "games/spider-solitaire", priority: "0.7" },
    { url: "games/uno-friends", priority: "0.7" },
    { url: "games/memory-match-cards", priority: "0.8" },
    // Match-3
    { url: "games/candy-crush-clone", priority: "0.7" },
    { url: "games/jewel-hunter", priority: "0.7" },
    { url: "games/bubble-shooter-pop", priority: "0.8" },
    { url: "games/zuma-tumble", priority: "0.7" },
    { url: "games/fruit-splash", priority: "0.7" },
    // Rhythm
    { url: "games/piano-tiles-speed", priority: "0.8" },
    { url: "games/drum-kit-pro", priority: "0.7" },
    { url: "games/music-racer", priority: "0.7" },
    { url: "games/beat-saber-web", priority: "0.7" },
    // Maze
    { url: "games/maze-runner-3d", priority: "0.7" },
    { url: "games/pac-maze", priority: "0.7" },
    { url: "games/ball-roll-maze", priority: "0.7" },
    { url: "games/scary-maze", priority: "0.7" },
    // Sports
    { url: "games/basketball-hoops", priority: "0.7" },
    { url: "games/penalty-shootout", priority: "0.7" },
    { url: "games/8-ball-pool-lite", priority: "0.7" },
    { url: "games/table-tennis-pro", priority: "0.7" },
    { url: "games/archery-master", priority: "0.7" },
    // Classics
    { url: "games/tetris-blocks", priority: "0.9" },
    { url: "games/snake-classic", priority: "0.8" },
    { url: "games/minesweeper-xp", priority: "0.7" },
    { url: "games/pinball-classic", priority: "0.7" },
    { url: "games/simon-says", priority: "0.8" },
    { url: "games/breakout-retro", priority: "0.7" },

    // Receitas removidas — /recipes/* redireciona para / em App.tsx (não existem como páginas reais)
];

// 3. Função Geradora de XML
const generateXml = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    pages.forEach(page => {
        // Garante que não haja barra dupla
        const safePath = page.url ? `/${page.url}` : '';
        const fullUrl = `${BASE_URL}${safePath}`;
        // Páginas dinâmicas (daily) usam a data de hoje; estáticas usam STATIC_DATE
        const lastmod = page.changefreq === 'daily' ? TODAY : STATIC_DATE;

        xml += `
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq || 'monthly'}</changefreq>
    <priority>${page.priority || '0.7'}</priority>
  </url>`;
    });

    xml += `
</urlset>`;
    return xml;
};

// 4. Salvar Arquivo
try {
    const xmlContent = generateXml();
    const outputPath = path.join(__dirname, 'public', 'sitemap.xml');

    // Verifica se a pasta public existe, se não, usa o diretório atual
    const finalPath = fs.existsSync(path.join(__dirname, 'public'))
        ? outputPath
        : path.join(__dirname, 'sitemap.xml');

    fs.writeFileSync(finalPath, xmlContent);
    console.log(`✅ Sitemap gerado com sucesso em: ${finalPath}`);
    console.log(`📊 Total de URLs: ${pages.length}`);
} catch (error) {
    console.error("❌ Erro ao gerar sitemap:", error);
}
