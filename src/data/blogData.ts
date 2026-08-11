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
