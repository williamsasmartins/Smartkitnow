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
      "Buying a home is the biggest purchase most people ever make, yet the math behind the monthly payment stays a mystery for a lot of buyers. Understanding how that number is built — and which levers actually move it — puts you in control at the negotiating table. This guide walks through the formula in plain English, shows worked examples, and points you to a free calculator that does the arithmetic instantly.",
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
          "Four inputs control your payment: the home price, your down payment, the interest rate, and the loan term. Increasing your down payment lowers the loan amount directly and can also unlock a better rate and eliminate PMI once you hit 20% down. Shopping for a lower interest rate is the single highest-leverage move — a better credit score is the fastest way to get one.",
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
    seoTitle: "How to Calculate Your Mortgage Payment — Formula & Examples",
    seoDescription:
      "Learn how mortgage payments are calculated with a plain-English formula, real examples, and a free calculator. See how rate, term, and down payment change your payment.",
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
