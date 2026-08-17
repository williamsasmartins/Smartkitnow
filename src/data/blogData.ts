// src/data/blogData.ts
// Blog content model + posts. Modeled on the SmartTips pattern already used in
// the app: a flat array of richly-typed entries plus small lookup helpers.
//
// Each post links to one or more calculators via `relatedCalculators` so the
// blog drives traffic into the tools (good for engagement and AdSense).
//
// To add a post: append a BlogPost object to the `blogPosts` array. The route
// /blog/:slug and the sitemap entry are generated automatically from the slug.

export interface BlogSection {
  heading: string;
  /** Paragraphs of body copy. Each string is rendered as its own <p>. */
  paragraphs: string[];
}

export interface BlogRelatedCalculator {
  title: string;
  /** Absolute site path, e.g. "/financial/mortgage-amortization". */
  url: string;
  icon?: string;
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  /** One-line summary used for cards, meta description, and the post header. */
  excerpt: string;
  /** Broad topic bucket shown as a badge, e.g. "Personal Finance". */
  category: string;
  /** ISO date (YYYY-MM-DD) the post was published. Drives sorting + Article schema. */
  date: string;
  /** Display author name (E-E-A-T signal). */
  author: string;
  /** Rough read time in minutes for the UI badge. */
  readingMinutes: number;
  /** Opening paragraph shown above the first section. */
  intro: string;
  sections: BlogSection[];
  faqs?: BlogFaq[];
  relatedCalculators: BlogRelatedCalculator[];
  /** Optional SEO overrides; fall back to title/excerpt when absent. */
  seoTitle?: string;
  seoDescription?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-calculate-your-mortgage-payment",
    title: "How to Calculate Your Mortgage Payment (With Real Examples)",
    excerpt:
      "A plain-English guide to how mortgage payments are calculated, what drives them up or down, and how to estimate yours in under a minute.",
    category: "Personal Finance",
    date: "2026-08-10",
    author: "Smart Kit Now Editorial Team",
    readingMinutes: 7,
    intro:
      "Your monthly mortgage payment comes from four inputs — loan amount, interest rate, loan term, and how much you put down — run through one formula. A $320,000 loan at 6.5% over 30 years works out to about $2,023 a month in principal and interest. This guide shows the formula in plain English, works through real numbers, and points you to a free calculator that does the arithmetic instantly.",
    sections: [
      {
        heading: "What makes up a mortgage payment",
        paragraphs: [
          "The payment lenders quote you is almost always the principal-and-interest (P&I) portion of your loan. Principal is the amount you borrowed; interest is the lender's fee for lending it. Every month you pay a fixed total, but the split between principal and interest shifts over time — early on you pay mostly interest, and near the end you pay mostly principal.",
          "Your real housing cost usually includes more than P&I: property taxes, homeowners insurance, and — if you put down less than 20% — private mortgage insurance (PMI). These extras are often bundled into your payment through an escrow account, so budget for them separately when you plan.",
        ],
      },
      {
        heading: "The formula behind the payment",
        paragraphs: [
          "The standard fixed-rate mortgage payment uses this formula: M = P[r(1+r)^n] / [(1+r)^n − 1]. Here M is the monthly payment, P is the loan amount (home price minus down payment), r is the monthly interest rate (annual rate divided by 12), and n is the total number of payments (loan term in years times 12).",
          "You never need to run this by hand — but seeing it explains why small rate changes matter so much. Because the rate is compounded across hundreds of payments, even a half-percent difference can add tens of thousands of dollars over a 30-year loan.",
        ],
      },
      {
        heading: "A worked example",
        paragraphs: [
          "Say you buy a $400,000 home with an $80,000 (20%) down payment at a 6.5% interest rate over 30 years. Your loan amount is $320,000. Plugging those numbers into the formula gives a monthly P&I payment of about $2,023, and you'd pay roughly $408,000 in total interest across the full term.",
          "Now shorten the term to 15 years at the same rate. The monthly payment jumps to about $2,787 — but total interest drops to roughly $182,000. That's a savings of more than $225,000 in interest for the same loan, simply by choosing a shorter term you can afford.",
        ],
      },
      {
        heading: "Which levers actually move your payment",
        paragraphs: [
          "Four inputs control your payment: the home price, your down payment, the interest rate, and the loan term. Increasing your down payment lowers the loan amount directly and can also unlock a better rate and eliminate PMI once you hit 20% down. Shopping for a lower interest rate does the most per unit of effort — and a better credit score is the fastest way to earn one.",
          "The loan term is a trade-off, not a free win: a longer term lowers the monthly payment but raises total interest, while a shorter term does the reverse. The right choice depends on your monthly budget and how long you plan to keep the loan.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does the calculator include property taxes and insurance?",
        answer:
          "The mortgage calculator estimates the principal-and-interest payment, which is the core loan math. Add roughly 1/12 of your annual property tax, insurance, and any PMI to get your true monthly housing cost.",
      },
      {
        question: "How much of a difference does my credit score make?",
        answer:
          "A lot. On a $320,000 30-year loan, moving from a 7.25% rate (fair credit) to a 6.25% rate (excellent credit) saves about $215 per month and over $77,000 in total interest. Improving your score before applying is one of the highest-return things you can do.",
      },
    ],
    relatedCalculators: [
      { title: "Mortgage Payment & Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
      { title: "House Affordability Calculator", url: "/financial/house-affordability", icon: "🏡" },
      { title: "Refinance Savings Calculator", url: "/financial/refinance-savings", icon: "💰" },
    ],
    seoTitle: "How to Calculate Your Mortgage Payment (Examples)",
    seoDescription:
      "See how mortgage payments are calculated: the plain-English formula, a worked $320k example, and how rate, term, and down payment change what you pay monthly.",
  },
  {
    slug: "how-to-calculate-your-bmi-what-it-means",
    title: "How to Calculate Your BMI and What the Number Really Means",
    excerpt:
      "A clear guide to what body mass index measures, how to work it out yourself, why it isn't the whole story, and what to look at alongside it.",
    category: "Health & Fitness",
    date: "2026-08-11",
    author: "Smart Kit Now Editorial Team",
    readingMinutes: 7,
    intro:
      "BMI is your weight in kilograms divided by your height in meters squared (or 703 × pounds ÷ inches²), and it sorts adults into four bands from underweight to obese. It's quick and useful for spotting trends across a population, but it was never meant to be a verdict on one person's health. This guide walks through a worked example, explains what the categories mean, and shows where the number falls short so you can read it wisely.",
    sections: [
      {
        heading: "The formula and how to calculate it",
        paragraphs: [
          "BMI is your weight divided by your height squared. In metric units the formula is BMI = weight (kg) / height (m)². In US units it's BMI = 703 × weight (lb) / height (in)². The 703 factor simply converts pounds and inches into the metric result, so both formulas give the same number for the same person.",
          "Here's a worked example. Someone who is 5 feet 9 inches (69 inches) tall and weighs 170 pounds calculates it as 703 × 170 / (69 × 69) = 703 × 170 / 4,761, which works out to about 25.1. In metric that same person is roughly 1.75 m and 77 kg: 77 / (1.75 × 1.75) = 77 / 3.06, which is about 25.1 as well. No special equipment required — just a scale and a tape measure.",
        ],
      },
      {
        heading: "What the categories mean",
        paragraphs: [
          "The World Health Organization groups adult BMI into four broad bands: below 18.5 is underweight, 18.5 to 24.9 is the normal or healthy range, 25.0 to 29.9 is overweight, and 30.0 and above is obese. The person in our example, at 25.1, sits just inside the overweight band — barely across the line from the healthy range, which shows how little the categories mean at the edges.",
          "These cutoffs come from population studies linking BMI to health risks like heart disease and type 2 diabetes. They describe statistical averages across large groups, not guarantees for individuals. Two people with the same BMI can have very different health, which is exactly why the number is a starting point for a conversation, not a diagnosis.",
        ],
      },
      {
        heading: "Where BMI falls short",
        paragraphs: [
          "BMI only knows your height and weight — it can't tell muscle from fat. A muscular athlete and a sedentary person can share an identical BMI while having completely different body compositions. This is why many fit, strong people land in the overweight band despite low body fat, and why BMI alone can misjudge them.",
          "It also ignores where fat is stored, which matters a great deal. Fat around the abdomen carries more health risk than fat on the hips and thighs, so two people with the same BMI can face very different risks. BMI is also less reliable for older adults, who tend to lose muscle, and it uses different percentile-based charts for children and teens rather than the fixed adult cutoffs.",
        ],
      },
      {
        heading: "What to measure alongside BMI",
        paragraphs: [
          "Waist circumference is a simple, powerful complement. A waist over about 40 inches (102 cm) for men or 35 inches (88 cm) for women signals higher risk regardless of BMI, because it captures the abdominal fat BMI can't see. Waist-to-height ratio — keeping your waist under half your height — is another quick, evidence-backed check.",
          "For a fuller picture, look at body fat percentage and your resting metabolism. Body fat percentage separates lean mass from fat directly, and your basal metabolic rate (BMR) tells you how many calories your body burns at rest, which anchors any sensible nutrition plan. Used together, these numbers give context that BMI on its own simply can't provide.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is a BMI of 25 unhealthy?",
        answer:
          "Not necessarily. A BMI of 25 sits at the very bottom of the overweight band, one decimal above the healthy range. For a muscular or athletic person it may reflect lean mass rather than excess fat. Pair it with waist measurement and body fat percentage before drawing any conclusion.",
      },
      {
        question: "Should athletes use BMI?",
        answer:
          "BMI is unreliable for athletes because it can't distinguish muscle from fat, and muscle is denser than fat. A lean, muscular athlete often shows an overweight or even obese BMI despite low body fat. A body fat percentage estimate is far more informative for them.",
      },
      {
        question: "What's a healthy BMI range for adults?",
        answer:
          "For most adults, 18.5 to 24.9 is considered the healthy range. Below 18.5 is underweight and 25 or above is overweight. These are population guidelines, so use them as a rough guide alongside other measures rather than a strict target.",
      },
    ],
    relatedCalculators: [
      { title: "BMI Calculator", url: "/health/bmi-calculator", icon: "⚖️" },
      { title: "Body Fat Percentage Calculator", url: "/health/body-fat-calculator", icon: "📊" },
      { title: "BMR Calculator", url: "/health/bmr-calculator", icon: "🔥" },
    ],
    seoTitle: "How to Calculate Your BMI and What It Really Means",
    seoDescription:
      "Learn the BMI formula, calculate yours with a worked example, understand the categories, and see why waist and body fat matter too. Free BMI calculator included.",
  },
  {
    slug: "daily-calorie-needs-bmr-tdee-explained",
    title: "Daily Calorie Needs Explained: BMR, TDEE, and How to Use Them",
    excerpt:
      "Understand the two numbers that decide your calorie target — your resting burn and your total daily burn — and how to turn them into a plan that works.",
    category: "Health & Fitness",
    date: "2026-08-11",
    author: "Smart Kit Now Editorial Team",
    readingMinutes: 8,
    intro:
      "Your daily calorie target comes from two numbers: your basal metabolic rate (BMR), the energy you burn at rest, and your total daily energy expenditure (TDEE), that figure scaled up for how active you are. Eat around your TDEE to hold your weight, below it to lose, above it to gain. This guide walks through both numbers with a real example, then shows how to turn them into a target you can actually follow.",
    sections: [
      {
        heading: "BMR: the calories you burn doing nothing",
        paragraphs: [
          "Your basal metabolic rate is the energy your body uses just to stay alive — pumping blood, breathing, keeping your brain and organs running — if you did nothing but rest for 24 hours. For most people, BMR accounts for 60 to 70 percent of all the calories they burn in a day, which is why it's the foundation of any calorie plan.",
          "The most common estimate is the Mifflin-St Jeor equation. For men: BMR = 10 × weight (kg) + 6.25 × height (cm) − 5 × age + 5. For women the last term is −161 instead of +5. A 35-year-old man who is 178 cm tall and 80 kg gets 10 × 80 + 6.25 × 178 − 5 × 35 + 5 = 800 + 1,112.5 − 175 + 5, which is about 1,743 calories per day at complete rest.",
        ],
      },
      {
        heading: "TDEE: your real daily burn",
        paragraphs: [
          "Nobody spends the whole day motionless, so TDEE multiplies your BMR by an activity factor to reflect how you actually live. The standard multipliers are roughly 1.2 for sedentary (desk job, little exercise), 1.375 for light activity (1–3 workouts a week), 1.55 for moderate (3–5), 1.725 for very active (6–7), and 1.9 for extremely active (hard physical job or twice-daily training).",
          "Take our example man with a BMR of 1,743. If he works at a desk and trains three days a week, moderate activity fits, so 1,743 × 1.55 is about 2,700 calories per day. That's his maintenance number: eat around 2,700 and his weight stays steady over time. Picking an honest activity level matters most here — people routinely overestimate it, which is a common reason a plan stalls.",
        ],
      },
      {
        heading: "Turning TDEE into a weight goal",
        paragraphs: [
          "A pound of body fat holds roughly 3,500 calories, so a daily deficit of 500 calories predicts about a pound of fat loss per week. Our example man would eat around 2,200 to lose weight, 2,700 to maintain, and about 3,000 to gain — usually paired with strength training so the added weight is muscle rather than fat.",
          "A safe, sustainable rate is 0.5 to 1 percent of your body weight per week. Cutting far more aggressively backfires: very low intakes cost you muscle, slow your metabolism, and are hard to stick with. It's also worth setting a floor — most guidance suggests not dropping below about 1,500 calories a day for men or 1,200 for women without medical supervision.",
        ],
      },
      {
        heading: "Why the numbers are estimates, not laws",
        paragraphs: [
          "BMR and TDEE formulas are population averages, so your real burn can differ by 10 percent or more in either direction depending on genetics, muscle mass, hormones, and even how much you fidget. Treat the calculated number as a well-informed starting point, not an exact measurement carved in stone.",
          "The reliable way to dial it in is to eat at your estimated target for two to three weeks and track your average weight, ignoring day-to-day swings from water and food volume. If the trend isn't moving the way you predicted, adjust by 100 to 200 calories and reassess. As you lose or gain weight your TDEE shifts too, so recalculating every 10 to 15 pounds keeps your target accurate.",
        ],
      },
    ],
    faqs: [
      {
        question: "What's the difference between BMR and TDEE?",
        answer:
          "BMR is what you'd burn at complete rest for a full day; TDEE is that number multiplied by an activity factor to include movement, exercise, and digestion. TDEE is always higher and is the number you actually eat around to lose, maintain, or gain weight.",
      },
      {
        question: "How big a calorie deficit should I aim for?",
        answer:
          "A deficit of 500 calories a day predicts roughly a pound of fat loss per week, which is a sustainable pace for most people. Larger deficits speed the scale up short-term but tend to cost muscle and are harder to maintain, so err toward moderate.",
      },
      {
        question: "How often should I recalculate my calorie needs?",
        answer:
          "Recalculate every time your weight changes by about 10 to 15 pounds, since your BMR and TDEE both shift as your body size changes. Also revisit the numbers if your activity level changes substantially, such as starting or stopping a training program.",
      },
    ],
    relatedCalculators: [
      { title: "Calorie Calculator", url: "/health/calorie-calculator", icon: "🍽️" },
      { title: "BMR Calculator", url: "/health/bmr-calculator", icon: "🔥" },
      { title: "TDEE Daily Energy Expenditure Calculator", url: "/health/tdee-daily-energy-expenditure", icon: "💪" },
    ],
    seoTitle: "Daily Calorie Needs Explained: BMR and TDEE",
    seoDescription:
      "Calculate your BMR and TDEE with worked examples, then set a calorie target for losing, maintaining, or gaining weight. Free BMR and calorie calculators inside.",
  },
  {
    slug: "how-much-concrete-do-i-need-slab-guide",
    title: "How Much Concrete Do I Need? A Slab Estimating Guide",
    excerpt:
      "Estimate concrete for a slab the right way — the volume formula, unit conversions, waste allowance, and how to avoid the two most costly ordering mistakes.",
    category: "Home & Construction",
    date: "2026-08-11",
    author: "Smart Kit Now Editorial Team",
    readingMinutes: 7,
    intro:
      "To estimate concrete for a slab, multiply length × width × thickness to get volume, then divide by 27 to convert cubic feet to the cubic yards suppliers sell — and add 5 to 10 percent for waste. A 10 ft × 12 ft slab at 4 inches thick needs about 1.5 cubic yards before that cushion. Guessing wrong is expensive both ways, so this guide walks through the calculation step by step so you order the right amount the first time.",
    sections: [
      {
        heading: "Concrete is sold by volume, not area",
        paragraphs: [
          "The single biggest mistake is thinking in square feet. Concrete is a three-dimensional material sold by the cubic yard in the US or the cubic meter elsewhere, so you need length, width, and thickness. The formula is simply volume = length × width × thickness, with every measurement in the same unit before you convert.",
          "Thickness is where people slip because it's usually given in inches while length and width are in feet. A standard patio or shed slab is 4 inches thick, a driveway that carries vehicles is often 5 to 6 inches, and a light footpath might be 3.5 inches. Always convert thickness to the same unit as your other dimensions before multiplying — mixing feet and inches is how estimates go badly wrong.",
        ],
      },
      {
        heading: "A worked example in cubic yards",
        paragraphs: [
          "Say you're pouring a 10 ft by 12 ft slab at 4 inches thick. First convert the thickness: 4 inches is 4 / 12 = 0.333 feet. Now multiply: 10 × 12 × 0.333 = 40 cubic feet. Since concrete is ordered in cubic yards and there are 27 cubic feet in a cubic yard, divide 40 / 27 = 1.48 cubic yards.",
          "That 1.48 is your bare volume — you would never order exactly that. Ready-mix suppliers typically sell in quarter-yard increments and expect you to round up, and you also need to account for waste. In metric the same slab is about 3.05 m × 3.66 m × 0.1 m = 1.12 cubic meters, which you would round up for the same reasons.",
        ],
      },
      {
        heading: "Always add for waste and uneven ground",
        paragraphs: [
          "Real-world pours never use exactly the calculated volume. Sub-grade rarely sits perfectly level, forms bow slightly under the weight of wet concrete, and some material is lost in the wheelbarrow and on the tools. The standard allowance is 5 to 10 percent extra, so our 1.48-yard slab becomes about 1.63 yards at 10 percent — round up and order 1.75 yards.",
          "That cushion is cheap insurance. Running short mid-pour is far more costly than a little leftover: a second small delivery carries a short-load fee, and if the first batch has started to set you get a cold joint — a visible, structurally weak seam where old and new concrete never fully bond. When in doubt, round up rather than down.",
        ],
      },
      {
        heading: "Beyond the slab: footings, thickened edges, and other materials",
        paragraphs: [
          "Many slabs aren't a simple rectangle of uniform depth. A thickened edge or perimeter footing adds volume you must calculate separately and add to the total — a slab with a footing can need 15 to 25 percent more concrete than the flat area alone suggests. Break any complex shape into rectangles, calculate each, and sum them.",
          "Concrete is also rarely the only material in a project. A slab usually sits on a compacted gravel base, and walls built on it may need brick or block, while interior finishing brings in drywall. Estimating each material with the same careful volume-or-area math — and the same waste allowance — keeps your whole material order accurate and your budget intact.",
        ],
      },
    ],
    faqs: [
      {
        question: "How many cubic feet are in a cubic yard?",
        answer:
          "There are 27 cubic feet in one cubic yard (3 ft × 3 ft × 3 ft). This is the conversion that trips most people up: calculate your slab volume in cubic feet, then divide by 27 to get the cubic yards concrete is actually ordered in.",
      },
      {
        question: "How much extra concrete should I order for waste?",
        answer:
          "Add 5 to 10 percent to your calculated volume to cover uneven sub-grade, form movement, and spillage, then round up to the supplier's nearest increment (usually a quarter yard). Running short mid-pour is far more expensive than a small leftover.",
      },
      {
        question: "How thick should a concrete slab be?",
        answer:
          "A patio, shed, or walkway is typically 4 inches thick, a driveway carrying cars is usually 5 to 6 inches, and a light footpath can be 3.5 inches. Thicker slabs and any that bear vehicle or structural loads generally also need reinforcing mesh or rebar.",
      },
    ],
    relatedCalculators: [
      { title: "Concrete Slab Volume Calculator", url: "/construction/concrete-slab-volume", icon: "🧱" },
      { title: "Brick Calculator", url: "/construction/brick-calculator", icon: "🧱" },
      { title: "Drywall Area & Sheets Calculator", url: "/construction/drywall-area-sheets", icon: "🏗️" },
    ],
    seoTitle: "How Much Concrete Do I Need? Slab Estimating Guide",
    seoDescription:
      "Estimate concrete for a slab step by step: the volume formula, cubic-yard conversion, waste allowance, and how to avoid a short pour. Free concrete calculator inside.",
  },
  {
    slug: "electric-vs-gas-car-true-5-year-cost",
    title: "Electric vs Gas Car: How to Compare the True 5-Year Cost",
    excerpt:
      "Sticker price is only the start. Here's how to build a fair five-year total-cost comparison between an EV and a gas car — fuel, maintenance, incentives, and depreciation.",
    category: "Automotive",
    date: "2026-08-11",
    author: "Smart Kit Now Editorial Team",
    readingMinutes: 8,
    intro:
      "To compare an electric and a gas car fairly, add up six costs over the years you'll keep it: purchase price after incentives, fuel or electricity, maintenance, insurance, fees, and depreciation. EVs usually cost more up front and win back the gap on fuel and upkeep — but not always. This guide breaks down each piece so your comparison reflects your own driving, electricity rate, and local gas prices rather than a generic headline.",
    sections: [
      {
        heading: "Start with purchase price minus incentives",
        paragraphs: [
          "EVs typically carry a higher sticker price than a comparable gas car, sometimes by several thousand dollars, so that gap is your starting deficit for the EV. But the number that matters is the net price after incentives, which can dramatically narrow or even close the gap depending on where you live and which model you choose.",
          "Federal, state, and local incentives can knock thousands off an eligible EV, and some regions add utility rebates for home chargers on top. These programs change often and come with eligibility rules tied to income, the vehicle, and where it was built, so verify what you actually qualify for before assuming a discount. Subtract only the incentives you're confident you'll receive.",
        ],
      },
      {
        heading: "Fuel versus electricity is usually the biggest gap",
        paragraphs: [
          "This is where EVs typically claw back their price premium. Consider 12,000 miles a year. A gas car getting 30 mpg burns 400 gallons; at $3.50 a gallon that's $1,400 a year, or $7,000 over five years. An EV using about 0.30 kWh per mile needs roughly 3,600 kWh; at a home rate of $0.15 per kWh that's $540 a year, or $2,700 over five years.",
          "In that example the EV saves about $4,300 in energy over five years — often enough to offset a higher purchase price by itself. But the result swings with your inputs: cheap gas and expensive electricity narrow the gap, while frequent public fast-charging (which can cost two to three times a home rate) erodes the EV's advantage. Charging mostly at home is what makes the math strongly favor electric.",
        ],
      },
      {
        heading: "Maintenance, insurance, and the quieter costs",
        paragraphs: [
          "EVs have far fewer moving parts — no oil changes, no spark plugs, no timing belts, no exhaust system — so scheduled maintenance is typically lower, and regenerative braking makes brake pads last longer too. Over five years that difference often adds up to a few hundred to a couple thousand dollars in the EV's favor.",
          "The costs don't all point one way, though. EVs frequently carry higher insurance premiums because repairs and battery packs are expensive, and they cost more to fix after a collision. Registration fees, some states' special EV road-use fees, and tire wear (EVs are heavier and torquey) all belong in an honest tally. None is huge alone, but together they matter.",
        ],
      },
      {
        heading: "Depreciation is the cost most people forget",
        paragraphs: [
          "Depreciation — how much value the car loses — is usually the single largest cost of ownership, bigger than fuel or maintenance, yet it's the one buyers overlook because you don't write a check for it. A car that costs $40,000 and is worth $22,000 after five years has cost you $18,000 in depreciation alone, dwarfing most other line items.",
          "Resale values for EVs have historically been more volatile than for gas cars, swayed by battery-health concerns, fast-improving new models, and shifting incentives, though this varies a lot by brand and model. Because depreciation is so large, a strong or weak resale value can flip the whole five-year comparison — which is exactly why a proper total-cost-of-ownership calculation includes it rather than stopping at fuel savings.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is an electric car really cheaper over five years?",
        answer:
          "Often, but not always. EVs usually win on fuel and maintenance and can benefit from incentives, but they cost more up front, can have higher insurance, and may depreciate faster. The answer depends on your mileage, electricity rate, local gas price, and how long you keep the car — which is why a full five-year comparison beats a rule of thumb.",
      },
      {
        question: "Why include depreciation in the comparison?",
        answer:
          "Depreciation is typically the biggest cost of owning any car — larger than fuel or maintenance — and it differs between EVs and gas cars. Leaving it out can make an EV look cheaper or more expensive than it truly is over five years, so a fair total-cost comparison has to account for resale value.",
      },
      {
        question: "Does home charging versus public charging change the math?",
        answer:
          "Significantly. Home electricity often costs around $0.15 per kWh, while public fast-charging can run two to three times that. An EV that charges mostly at home enjoys the largest fuel savings; one that relies on public fast-chargers gives much of that advantage back.",
      },
    ],
    relatedCalculators: [
      { title: "ICE vs EV 5-Year Ownership Cost Calculator", url: "/automotive/ice-vs-ev-ownership-cost-5y", icon: "🔌" },
      { title: "Total Cost of Ownership Calculator", url: "/automotive/tco-total-cost-ownership", icon: "🚙" },
      { title: "Trip Fuel Cost Calculator", url: "/automotive/trip-fuel-cost", icon: "⛽" },
    ],
    seoTitle: "Electric vs Gas Car: How to Compare the True 5-Year Cost",
    seoDescription:
      "Compare an EV and a gas car over five years the right way: purchase price, incentives, fuel, maintenance, insurance, and depreciation. Free ownership-cost calculators.",
  },
  {
    slug: "how-to-calculate-your-car-loan-payment",
    title: "How to Calculate Your Car Loan Payment (With a Real Example)",
    excerpt:
      "A $30,000 auto loan at 6.5% for 5 years runs about $587 a month. Here's the formula behind that number, a worked example, and how term and down payment change what you pay.",
    category: "Personal Finance",
    date: "2026-08-11",
    author: "Smart Kit Now Editorial Team",
    readingMinutes: 7,
    intro:
      "A $30,000 auto loan at 6.5% APR over 60 months comes out to about $587 a month, with roughly $5,220 in total interest by the time it's paid off. That number comes from the same amortization formula used for any installment loan, but auto loans add a few extra pieces — trade-in value, sales tax, and fees — that change what you're actually financing. This guide walks through the math with real figures, shows how term length trades a lower payment for more interest, and points you to calculators that do the arithmetic for you.",
    sections: [
      {
        heading: "The formula behind every auto loan payment",
        paragraphs: [
          "Car loans use the standard fixed-rate installment formula: M = P[r(1+r)^n] / [(1+r)^n − 1]. M is the monthly payment, P is the amount financed, r is the monthly interest rate (your annual APR divided by 12), and n is the number of monthly payments (loan term in years times 12).",
          "It's the identical formula behind a mortgage — only the size and term of the loan differ. A car loan usually runs 3 to 7 years instead of 15 or 30, which is why the interest portion is smaller in dollar terms even though the rate is often similar or higher than a mortgage rate.",
        ],
      },
      {
        heading: "A worked example: $30,000 over 5 years",
        paragraphs: [
          "Finance $30,000 at 6.5% APR for 60 months. The monthly rate is 6.5% ÷ 12 = 0.5417%, and there are 60 payments. Running those through the formula gives a monthly payment of about $587. Over 60 months you pay roughly $35,220 total, meaning about $5,220 of that is interest.",
          "Stretch the same $30,000 loan to 72 months at the same rate and the payment drops to about $504 a month — a saving of roughly $83 a month. But total interest climbs to about $6,309, which is around $1,090 more than the 5-year loan. The lower payment isn't free; you're renting the extra room in your budget by paying more for the car overall.",
        ],
      },
      {
        heading: "What actually goes into your loan amount",
        paragraphs: [
          "The amount you finance is rarely just the sticker price. Say you're buying a $32,000 car with a $4,000 down payment and a $3,000 trade-in, and your state charges 6% sales tax on the price after the trade-in credit. Tax works out to 6% × ($32,000 − $3,000) = 6% × $29,000 = $1,740.",
          "Your amount financed is then $32,000 − $4,000 down − $3,000 trade-in + $1,740 tax = $26,740. Documentation fees, title and registration charges, and any add-ons like an extended warranty typically get rolled in the same way, so it's worth listing every line item before you assume you know your real loan amount.",
        ],
      },
      {
        heading: "Term length and down payment are the two levers you control",
        paragraphs: [
          "A bigger down payment or trade-in lowers the amount financed directly, which lowers both the monthly payment and the total interest — no trade-off involved. On the $30,000 example above, adding $3,000 more down (financing $27,000 instead) at the same rate and term brings the payment down to about $528 a month, a saving of roughly $59 a month with less interest paid overall.",
          "Term length is a genuine trade-off, not a free lunch: shorter terms mean higher payments but far less interest, while longer terms mean lower payments but more interest and a longer stretch where you can owe more than the car is worth. A widely used rule of thumb is the 20/4/10 guideline — aim for at least 20% down, a loan term no longer than 4 years, and total monthly transportation costs (payment, insurance, and fuel combined) under 10% of your gross income.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much should I put down on a car?",
        answer:
          "20% is a common target, especially on a new car, because it helps offset the steep first-year depreciation and keeps you from owing more than the car is worth. Any amount you put down still helps — it reduces the loan principal dollar for dollar, which lowers both your payment and your total interest.",
      },
      {
        question: "Does a longer loan term actually save me money?",
        answer:
          "It lowers your monthly payment but not your total cost. In the example above, moving from a 60-month to a 72-month term on a $30,000 loan cuts the payment by about $83 a month but adds roughly $1,090 in extra interest over the life of the loan. Choose the shortest term your budget can comfortably handle.",
      },
      {
        question: "Is a car loan calculated the same way as a mortgage?",
        answer:
          "Yes — both use the same fixed-rate amortization formula with principal, rate, and term as the inputs. The difference is what makes up the principal: a car loan's amount financed typically includes sales tax, fees, and trade-in value, while a mortgage's principal is simply the home price minus the down payment.",
      },
    ],
    relatedCalculators: [
      { title: "Auto Loan Calculator", url: "/financial/auto-loan", icon: "🚗" },
      { title: "Loan Payment Calculator", url: "/financial/loan-payment", icon: "💵" },
      { title: "Total Cost of Ownership Calculator", url: "/automotive/tco-total-cost-ownership", icon: "🚙" },
      { title: "Trip Fuel Cost Calculator", url: "/automotive/trip-fuel-cost", icon: "⛽" },
    ],
    seoTitle: "How to Calculate Your Car Loan Payment (Real Example)",
    seoDescription:
      "See how car loan payments are calculated: the formula, a worked $30k example, how sales tax and trade-in affect it, and why term length is a real trade-off.",
  },
  {
    slug: "how-much-house-can-you-afford-28-36-rule",
    title: "How Much House Can You Afford? The 28/36 Rule Explained",
    excerpt:
      "Lenders cap your housing payment at 28% of income and your total debt at 36% — whichever number is lower wins. Here's how to run both and see what actually limits your budget.",
    category: "Personal Finance",
    date: "2026-08-11",
    author: "Smart Kit Now Editorial Team",
    readingMinutes: 7,
    intro:
      "The 28/36 rule caps your monthly house payment at 28% of gross income and your total debt payments at 36% — whichever produces the smaller number is your real budget. On a $95,000 household income with $500 in existing monthly debt, that works out to about $2,217 a month for housing, enough to support roughly a $311,000 home with 10% down. This guide breaks down where those two percentages come from, runs the math on two different debt loads, and shows why the number that limits you isn't always the one you'd expect.",
    sections: [
      {
        heading: "Two ratios, and the lower one wins",
        paragraphs: [
          "The 28/36 rule is a mortgage underwriting guideline built from two separate debt-to-income ratios, and it dates back to standards conventional lenders and mortgage insurers have used for decades to judge how much a household can safely borrow. The front-end ratio caps your housing payment — principal, interest, property taxes, homeowners insurance, and any HOA dues — at 28% of your gross monthly income, meaning income before taxes are withheld. The back-end ratio caps all recurring debt payments combined, housing included, at 36% of that same income.",
          "Lenders check both because the two numbers measure different risks. A person with no car payment or student loan can safely stretch closer to the 28% ceiling, while someone carrying $700 a month in other debt has far less room left before hitting the 36% back-end cap regardless of how much they earn. Underwriters verify the inputs with pay stubs, W-2s or tax returns, and a credit report pulling your actual monthly obligations — so whichever ratio produces the smaller housing budget is the one that actually governs what you can afford, and you always calculate both and take the lower figure.",
        ],
      },
      {
        heading: "Running the numbers on a $95,000 income",
        paragraphs: [
          "Start with gross monthly income: $95,000 a year is $7,916.67 a month. The front-end cap is 28% of that, or $2,217. The back-end cap is 36%, or $2,850 — but that ceiling covers all debt, so subtract $500 in existing monthly payments (a car loan, say) and only $2,350 is left over for housing. Comparing $2,217 to $2,350, the front-end ratio produces the smaller number, so it sets the budget: $2,217 a month for the entire housing payment, taxes and insurance included.",
          "Set aside roughly 18% of that for property taxes, homeowners insurance, and PMI — about $399 a month — and $1,818 remains for principal and interest. At a 6.75% fixed rate over 30 years, that payment supports a loan of about $280,250. Add a 10% down payment on top of that loan and you land on a home price near $311,400, with roughly $31,100 due at closing for the down payment alone before closing costs.",
        ],
      },
      {
        heading: "Why more debt hurts more than a lower income",
        paragraphs: [
          "Keep the same $95,000 income but raise existing monthly debt from $500 to $850 — say a car payment plus a student loan bill. The front-end cap doesn't move; it's still $2,217, because it only looks at income. But the back-end cap does move: $2,850 minus $850 leaves only $2,000 available for housing. Now the back-end ratio produces the smaller number, so it takes over as the binding constraint, cutting the housing budget from $2,217 down to $2,000 — a $217 drop caused entirely by $350 more in debt.",
          "Running that $2,000 through the same steps — 18% to taxes and insurance, the remainder to principal and interest at 6.75% over 30 years — supports a loan of about $252,850 and a home price near $280,950 with 10% down. That's roughly $30,400 less house for $350 more in monthly debt, a bigger swing than a comparable change in income would cause. Debt eats housing budget at closer to a dollar-for-dollar rate once it pushes the back-end ratio below the front-end one, while income only affects the budget indirectly, through the 28% and 36% multipliers.",
        ],
      },
      {
        heading: "How to raise your number",
        paragraphs: [
          "If the back-end ratio is what's limiting you, paying down or paying off a car loan or credit card balance frees up back-end room directly — every $100 in monthly debt payments you eliminate adds roughly $100 back to your housing cap, dollar for dollar. A student loan moved onto an income-driven repayment plan can also lower the monthly figure lenders count against you, which is worth modeling with an amortization tool before you start shopping for a rate.",
          "If the front-end ratio is the constraint instead, a larger down payment shrinks the loan itself, and a better interest rate stretches the same monthly payment further — a full percentage point off the rate can support tens of thousands more in loan amount for an identical payment. Some loan programs allow back-end ratios above 36%, up to roughly 43-50% for certain government-backed loans, but a higher ratio leaves less monthly breathing room if income drops, a rate resets, or an unexpected repair hits — budget an extra 1-2% of the home's value per year for maintenance on top of the mortgage — so treat 28/36 as the comfortable target even when a lender is willing to approve more.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do all lenders actually use the 28/36 rule?",
        answer:
          "It's a widely used guideline rather than a universal requirement. Conventional loans often follow it closely, while FHA, VA, and some other programs allow higher back-end ratios — sometimes up to 45-50% for well-qualified borrowers. Treat 28/36 as a conservative, budget-friendly target even if your specific lender permits more.",
      },
      {
        question: "What counts toward the 36% back-end figure?",
        answer:
          "Your projected housing payment plus every recurring debt obligation that shows on your credit report: car loans, student loans, minimum credit card payments, personal loans, and child support or alimony. It doesn't include everyday expenses like groceries, utilities, or subscriptions — those matter for your personal budget but aren't part of the lender's DTI calculation.",
      },
      {
        question: "Does a bigger down payment always increase how much house I can afford?",
        answer:
          "It lowers your loan amount and monthly principal and interest, which helps the front-end ratio, but it doesn't change your income or existing debt. If the back-end ratio is already your binding constraint because of other debt payments, a larger down payment helps less than paying down that debt would.",
      },
    ],
    relatedCalculators: [
      { title: "How Much House Can I Afford? Calculator", url: "/financial/house-affordability", icon: "🏡" },
      { title: "Mortgage Payment & Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
      { title: "Loan Payment Calculator", url: "/financial/loan-payment", icon: "💵" },
      { title: "Student Loan Repayment Calculator", url: "/financial/student-loan-repayment", icon: "🎓" },
    ],
    seoTitle: "How Much House Can You Afford? The 28/36 Rule",
    seoDescription:
      "Learn the 28/36 debt-to-income rule for home affordability, run the math on real numbers, and see why existing debt can limit you more than income does.",
  },
  {
    slug: "compound-interest-explained-why-time-beats-amount",
    title: "Compound Interest Explained: Why Ten Extra Years Beats a Bigger Contribution",
    excerpt:
      "The real math behind compound interest — how $200 a month grows differently depending on when you start, and why the same force makes debt grow just as fast.",
    category: "Personal Finance",
    date: "2026-08-16",
    author: "Smart Kit Now Editorial Team",
    readingMinutes: 8,
    intro:
      "Investing $200 a month at a 7% average annual return grows to about $244,000 after 30 years — and $72,000 of that is money you actually put in, with the other $172,000 coming from compound interest itself. Start the same $200-a-month habit ten years earlier and let it run for 40 years instead, and the total climbs to roughly $525,000, more than double, from just ten extra years of growth. That gap is the entire idea behind compound interest: it pays interest on interest, and time does more of the work than the size of your monthly deposit. This guide runs the actual math, shows how the same mechanism grows debt just as fast when it works against you, and points to calculators that will run your own numbers instead of these examples.",
    sections: [
      {
        heading: "What compound interest actually means",
        paragraphs: [
          "Simple interest pays a percentage of the original amount only. Compound interest pays a percentage of the original amount plus every dollar of interest already earned, so the base it's calculated on keeps growing. The formula is A = P(1 + r/n)^(nt), where P is the starting amount, r is the annual rate, n is how many times per year it compounds, and t is the number of years.",
          "Take $10,000 invested at a 7% annual return, compounded monthly, for 20 years: A = 10,000 × (1 + 0.07/12)^(12×20), which works out to about $40,390 — the money roughly quadruples without a single additional deposit. A shortcut called the Rule of 72 gets close to the same answer: divide 72 by the interest rate to estimate the years it takes to double. At 7%, that's 72 ÷ 7 ≈ 10.3 years, so two doublings over 20 years lands almost exactly on the $40,390 figure above.",
        ],
      },
      {
        heading: "Why ten extra years beats a bigger monthly contribution",
        paragraphs: [
          "Two savers each put away $200 a month at a 7% average annual return, compounded monthly. Saver A starts at 25 and stops contributing at 65 — 40 years. Saver B waits until 35 to start and also stops at 65 — 30 years. Saver A ends up with about $525,000; Saver B ends up with about $244,000. Saver A only contributed $24,000 more in total ($96,000 versus $72,000), yet ends up with roughly $281,000 more.",
          "To catch up, Saver B would need to put in about $430 a month for those same 30 years instead of $200 — more than double the monthly amount — just to reach the $525,000 that Saver A got to with a decade's head start. That's the practical lesson: an extra ten years of compounding did more than doubling the monthly contribution could. Waiting is the most expensive decision in a compound interest plan, even when the delay feels small.",
        ],
      },
      {
        heading: "The same force works against you on debt",
        paragraphs: [
          "Compound interest doesn't care whether it's growing your savings or growing what you owe. Many student loans capitalize unpaid interest — interest that accrues while you're in school gets added to the principal, and future interest is then charged on that larger balance. A $30,000 loan at a 6% rate that sits untouched through 4 years of school plus a 6-month grace period (4.5 years total) grows to roughly $39,000 by the time repayment starts, even though you never touched the money — about $9,000 in interest stacked onto the original balance before you make a single payment.",
          "Credit cards typically compound daily rather than monthly, which is part of why carrying a balance is so costly. A $5,000 balance at a 22% APR, left untouched with only compounding and no payments, grows past $6,200 in a single year. The fix runs on the same principle in reverse: any payment above the minimum reduces the balance the next round of interest gets calculated on, so extra payments made early do more good than the same extra payment made later.",
        ],
      },
      {
        heading: "How to put compounding to work for your own goals",
        paragraphs: [
          "For savings, automate a fixed monthly contribution so compounding runs on a schedule you don't have to remember, and start it as early as your budget allows — the ten-year comparison above shows why waiting is the costliest choice you can make. If you're saving toward a specific goal like a home down payment, run your own monthly amount and expected return through a compound interest calculator to see the projected balance on your actual timeline, rather than someone else's example.",
          "For debt, target the account with the highest rate first, since that's where compounding costs you the most per dollar of balance, and treat any extra payment as money that stops future interest from building on top of it. If a growing savings balance is meant to become a home down payment, pairing a compound interest projection with an affordability check tells you both when you'll have the money and what price range it gets you into.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does compounding monthly instead of annually make a big difference?",
        answer:
          "Some, but less than most people expect. $10,000 at 7% for 20 years compounded annually grows to about $38,700; compounded monthly it grows to about $40,390 — a difference of roughly $1,700, or about 4%. Compounding more frequently always helps, but the interest rate and the length of time matter far more than how often the interest compounds.",
      },
      {
        question: "What's the Rule of 72 and how accurate is it?",
        answer:
          "Divide 72 by the interest rate to estimate how many years it takes an amount to double. At 7%, that's 72 ÷ 7 ≈ 10.3 years, and the actual figure from the compound interest formula is about 10.2 years — close enough for quick mental math. It gets less accurate at very high rates (above roughly 20%) or very low ones (below roughly 3%), where the underlying math curves more than the simple division accounts for.",
      },
      {
        question: "Why do extra payments on debt save so much interest?",
        answer:
          "Because compound interest is calculated on whatever balance remains. Paying $200 extra early in a loan reduces the principal immediately, so every future round of interest is calculated on a smaller number — the savings compound in your favor for the rest of the loan. The same $200 paid near the end of the loan only avoids interest for the few months left, which is why paying down high-rate debt sooner is far more valuable than waiting.",
      },
    ],
    relatedCalculators: [
      { title: "Compound Interest Calculator", url: "/financial/compound-interest", icon: "📈" },
      { title: "Student Loan Repayment Calculator", url: "/financial/student-loan-repayment", icon: "🎓" },
      { title: "How Much House Can I Afford? Calculator", url: "/financial/house-affordability", icon: "🏡" },
    ],
    seoTitle: "Compound Interest Explained (Why Time Beats Amount)",
    seoDescription:
      "See the real math behind compound interest: worked examples on savings and debt, and why starting ten years earlier beats doubling your monthly contribution.",
  },
  {
    slug: "how-many-sheets-of-drywall-for-a-12x12-room",
    title: "How Many Sheets of Drywall for a 12x12 Room?",
    excerpt:
      "A 12x12 room with 8-ft ceilings needs 12 standard 4x8 sheets for the walls, waste included. Here's the exact math, a size-by-size breakdown, and the ceiling add-on.",
    category: "Home & Construction",
    date: "2026-08-16",
    author: "Smart Kit Now Editorial Team",
    readingMinutes: 7,
    intro:
      "A 12x12 room with standard 8-foot ceilings, one door, and one window needs 12 sheets of standard 4x8 drywall to cover the walls, including a 10% cutting-waste allowance. That comes from 384 square feet of gross wall area, minus about 35 square feet for the door and window openings, divided by 32 square feet per sheet, then rounded up for cuts and mistakes. Add the ceiling and the job jumps to 17 sheets; go to 9-foot walls instead and it's 14. This guide shows the exact math, a size-by-size breakdown, and where the estimate can go wrong.",
    sections: [
      {
        heading: "How many sheets of drywall do you need for a 12x12 room? The math, step by step",
        paragraphs: [
          "Start with the wall area. Perimeter is 2 × (12 + 12) = 48 linear feet. Multiply by an 8-foot ceiling height: 48 × 8 = 384 square feet of gross wall area. That's the number before you subtract anything for doors or windows. (Bump the ceiling to 9 feet and gross area rises to 48 × 9 = 432 square feet — worth checking before you order, since plenty of newer builds use 9-foot walls.)",
          "Next, subtract openings. A standard door rough opening is about 3 ft × 6 ft 8 in, or roughly 20 square feet; a standard window is about 3 ft × 5 ft, or 15 square feet. One of each removes 35 square feet, leaving 384 − 35 = 349 square feet of net wall area to actually cover. A standard sheet is 4 ft × 8 ft = 32 square feet, so 349 ÷ 32 = 10.9 sheets before you account for cutting losses. But theory doesn't survive a real job site.",
        ],
      },
      {
        heading: "Why do you round up to 12 instead of 11?",
        paragraphs: [
          "Drywall crews add 10 to 15% on top of the net area to cover cut waste, damaged sheets, and the fact that sheets don't tile perfectly around corners and odd angles. Applying a 10% margin to 349 square feet gives 383.9 square feet, and 383.9 ÷ 32 = 11.997 sheets — just a hair under 12, so you buy the full 12th sheet. That's why a 12x12 room with a standard door and window lands on 12 sheets for the walls, not the 11 you'd get from the bare net area.",
          "That result has almost no headroom, though: it's 99.97% of what 12 sheets cover, not a comfortable margin. Skip the window (a windowless laundry room or closet, say) and the deduction drops to 20 square feet, pushing the total to 400.4 square feet — 12.5 sheets, which rounds up to 13. Swap in a narrower 2 ft 8 in interior door instead of a 3 ft slab and you land at 12.07 sheets, also 13. Small, ordinary changes to the assumptions can add a whole sheet, so treat 12 as this exact room's answer, not a rule for every 12x12 room.",
        ],
      },
      {
        heading: "Common room sizes at a glance",
        paragraphs: [
          "The same formula scales directly to any room. Each figure below assumes an 8-foot ceiling, one standard door, one standard window, and a 10% cutting-waste margin — walls only, no ceiling: an 8x10 room needs 288 sq ft of gross wall area (253 sq ft net) and 9 sheets. A 10x10 room needs 320 sq ft gross (285 sq ft net) and 10 sheets. A 10x12 room needs 352 sq ft gross (317 sq ft net) and 11 sheets.",
          "A 12x12 room needs 384 sq ft gross (349 sq ft net) and 12 sheets. A 12x15 room needs 432 sq ft gross (397 sq ft net) and 14 sheets. A 14x14 room needs 448 sq ft gross (413 sq ft net) and 15 sheets. Sheet counts always round up to a whole number after the waste margin is applied — never before it — which is exactly why the 12x12 room needs a full 12 sheets even though its bare net area alone only calls for 10.9.",
        ],
      },
      {
        heading: "Should you drywall the ceiling too?",
        paragraphs: [
          "A 12x12 ceiling adds another 144 square feet — the full floor area, since a flat ceiling and floor are always the same size. Add that to the 349 square feet of net wall area for 493 square feet total, apply the same 10% margin, and 493 × 1.10 = 542.3 square feet, which is 542.3 ÷ 32 = 16.95, rounding up to 17 sheets for the whole room, walls and ceiling combined.",
          "Ceilings are also more labor-intensive: sheets are heavier to lift overhead, usually need a drywall lift or two people, and butt joints on a ceiling are more visible than on a wall once the room is painted. If the ceiling is already finished — common in a basement refinish where only the walls are being framed and covered — you only need the 12-sheet wall estimate, not the 17-sheet combined total.",
        ],
      },
    ],
    faqs: [
      {
        question: "How many square feet does one sheet of drywall cover?",
        answer:
          "A standard sheet is 4 ft × 8 ft, which is 32 square feet. Larger 4 ft × 12 ft sheets (48 square feet) are also available and can reduce the number of seams on tall or long walls, but they're heavier and harder to maneuver alone, so most DIY jobs stick with the standard 4x8 size.",
      },
      {
        question: "Do I need to subtract closets, doors, and windows from the total?",
        answer:
          "For doors and windows, yes — a standard door removes about 20 square feet and a standard window about 15 square feet from your gross wall area. Closets are the exception: you subtract the closet doorway like any other opening, but the closet's own interior walls add area rather than removing it, so measure and add those separately.",
      },
      {
        question: "Should I use a 10% or 15% waste margin?",
        answer:
          "10% is enough for a simple rectangular room with one door and one window, like the 12x12 example here. Move up to 15% once the room has angled walls, a soffit or bulkhead, multiple doors and windows, or any cut that isn't a straight line — more openings and angles mean more offcuts that can't be reused.",
      },
    ],
    relatedCalculators: [
      { title: "Drywall Area & Sheets Calculator", url: "/construction/drywall-area-sheets", icon: "🏗️" },
      { title: "Concrete Slab Volume Calculator", url: "/construction/concrete-slab-volume", icon: "🧱" },
      { title: "Brick Calculator", url: "/construction/brick-calculator", icon: "🧱" },
    ],
    seoTitle: "How Many Sheets of Drywall for a 12x12 Room?",
    seoDescription:
      "A 12x12 room needs 12 sheets of drywall for the walls (10% waste included) — see the exact math, a size-by-size breakdown, and the ceiling add-on.",
  },
  {
    slug: "is-refinancing-worth-it-for-a-1-percent-lower-rate",
    title: "Is Refinancing Worth It for a 1% Lower Rate?",
    excerpt:
      "A $302,000 balance at 7.25% dropping to 6.25% saves real money — but the term you pick changes whether refinancing wins or quietly costs you more.",
    category: "Personal Finance",
    date: "2026-08-17",
    author: "Smart Kit Now Editorial Team",
    readingMinutes: 8,
    intro:
      "Is refinancing worth it for a 1% lower rate? On a $302,000 balance moving from 7.25% to 6.25%, yes on the break-even math: a new 30-year loan saves about $323 a month and $6,000 in closing costs breaks even in 19 months. But that same 30-year option costs $14,545 more in total interest than just keeping the original loan, because it resets the clock five years earlier than needed. Matching the 25 years actually remaining saves $57,205 instead. The term you pick decides which answer you get.",
    sections: [
      {
        heading: "Is refinancing worth it for a 1% lower rate? Start with break-even",
        paragraphs: [
          "The standard way to check whether refinancing is worth it is a break-even calculation: divide your closing costs by your monthly savings to get the number of months before the refinance pays for itself. Take a homeowner five years into a $320,000, 30-year loan at 7.25%. Their current payment is $2,183 in principal and interest (property taxes and insurance don't change when you refinance, so they're left out of every comparison below), and after 60 payments their remaining balance is $302,012 with 25 years left on the original schedule.",
          "A lender offers 6.25% — exactly one percentage point lower — with $6,000 in closing costs (about 2% of the balance, a typical range is 2-5%). Refinance that $302,012 balance into a new 30-year loan and the payment drops to $1,860, a monthly savings of $323. Divide $6,000 by $323 and the break-even point is 18.6 months, under two years. By the usual rule — worth it if you'll stay past the break-even point — this refinance looks like an easy yes.",
        ],
      },
      {
        heading: "The trap: a lower rate can still cost you more, in total",
        paragraphs: [
          "Break-even math only tracks monthly cash flow, not the total interest you'll pay over the life of the loan — and those two answers can point in opposite directions. Refinancing into a fresh 30-year term doesn't just lower the rate, it also restarts the amortization clock, so the borrower goes from having 25 years left to having 30 years left, adding 5 years of payments back onto the schedule.",
          "Run the comparison side by side. If this borrower had simply kept the original 7.25% loan for the 25 years actually remaining, they'd pay $352,877 in remaining interest. Refinance into a new 30-year term at 6.25% instead, and total interest over that loan is $367,422 — $14,545 more, despite the lower rate and the $323 monthly savings.",
          "A 25-year term tells a different story. Matching the time actually left on the original loan, the payment is $1,992 (still $191 a month cheaper), the break-even point is 31.5 months, and total interest drops to $295,672 — a genuine savings of $57,205 versus sticking with the original loan.",
        ],
      },
      {
        heading: "Same rate drop, three different outcomes",
        paragraphs: [
          "All three paths start from the identical $302,012 balance and the identical 1-point rate drop from 7.25% to 6.25%. What changes is only the term, and it swings the result from a loss to a substantial gain:",
          "1. Keep the original loan (25 years left, 7.25%): payment $2,183, remaining interest $352,877. This is the baseline.",
          "2. Refinance to a new 30-year term (6.25%): payment $1,860, monthly savings $323, break-even 19 months, total interest $367,422 — $14,545 worse than the baseline.",
          "3. Refinance to a 25-year term (6.25%, matching the time actually left): payment $1,992, monthly savings $191, break-even 32 months, total interest $295,672 — $57,205 better than the baseline.",
          "The 30-year refinance has the bigger monthly savings and the faster break-even, yet it is the only one of the three that leaves you paying more interest than doing nothing.",
        ],
      },
      {
        heading: "How to decide which one to take",
        paragraphs: [
          "Ask your lender for a quote at your remaining term, not just their default 30-year offer — most quote 15, 20, and 25-year terms, and some will price a custom term on request. If the payment on that shorter term still fits your budget, it captures nearly all the lifetime savings while keeping your original payoff date, which is the version of refinancing that's worth it in both the short-run and long-run sense.",
          "If the shorter-term payment genuinely doesn't fit, the 30-year reset isn't automatically wrong — a lower guaranteed payment has real value if it prevents missed payments or lets you invest the difference elsewhere — but go in knowing you're trading total interest for monthly flexibility, not getting a free win. Either way, skip the refinance entirely if you plan to sell or move before your break-even month, and be wary of rolling closing costs into the new balance, since that raises the principal and pushes your break-even point out further than the sticker price on the closing costs suggests.",
          "One caveat most refinance guides skip: the 30-year loan's disadvantage only holds if you actually pay the minimum. Take the 30-year refinance at $1,860 and voluntarily send $1,992 a month — the 25-year payment — and you land on the same $295,672 in total interest, while keeping the right to drop back to $1,860 in a bad month. As long as the loan has no prepayment penalty, that combination beats locking into the 25-year term outright.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much does refinancing typically cost in closing costs?",
        answer:
          "Commonly cited industry estimates put refinance closing costs at 2-5% of the loan balance; Freddie Mac's own guidance runs higher, at 3-6%. On the $302,012 example here, 2-5% is about $6,000 to $15,000, covering the lender's origination fee, appraisal, title insurance, and recording fees. Ask for the CFPB-mandated Loan Estimate in writing and use the actual total in your break-even math rather than a generic percentage.",
      },
      {
        question: "Does refinancing always reset my loan back to 30 years?",
        answer:
          "Only if you choose a new 30-year term, which is the lender's default quote but not your only option. Requesting a term that matches the years you actually have left — 25 in the example above — keeps your original payoff date and captures most of the lifetime interest savings, typically for a payment still lower than your current one.",
      },
      {
        question: "What break-even period counts as a good deal?",
        answer:
          "Under 24 months is strong for most homeowners, since you recoup the closing costs quickly even with an average time in the home. A break-even of 24 to 36 months is still worth it if you're confident you'll stay 5 or more years. Beyond about 4 years, run the total-interest comparison carefully — the monthly savings alone can be misleading, as this example shows.",
      },
    ],
    relatedCalculators: [
      { title: "Refinance Savings Calculator", url: "/financial/refinance-savings", icon: "💰" },
      { title: "Mortgage Payment & Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
      { title: "Loan Payment Calculator", url: "/financial/loan-payment", icon: "💵" },
    ],
    seoTitle: "Is Refinancing Worth It for a 1% Lower Rate?",
    seoDescription:
      "Is refinancing worth it for a 1% lower rate? See the break-even math on a $302,000 balance, plus why resetting the term can cost more despite lower payments.",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** All posts, newest first. */
export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

/** Up to `limit` other posts, newest first, excluding `slug`. */
export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, limit);
}
