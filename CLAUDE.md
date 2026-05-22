# CLAUDE.md — Smart Kit Now

## Project Goal
Multi-category free online calculator/tool SPA. Live at **https://www.smartkitnow.com**.
Features: 300+ calculators, games, smart tips, daily quotes, horoscope, search, dark/light theme, full SEO, AdSense ads.

---

## Tech Stack
| Layer | Tech |
|---|---|
| Framework | React 18 + Vite 5 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 3.4 + shadcn/ui (Radix UI + CVA) |
| Icons | Lucide-React, React Icons, Simple Icons |
| Routing | React Router DOM v6 |
| State | React Context API + TanStack Query v5 |
| Forms | React Hook Form + Zod |
| SEO | react-helmet-async + JSON-LD schema.org |
| Charts | Recharts |
| PDF | jsPDF |
| Tests | Vitest + Testing Library + Playwright |
| Bundler | Vite (chunks: vendor-react, vendor-ui) |
| Ads | Partytown + AdSense |

**Dev server:** `npm run dev` → port 8080  
**Build:** `npm run build` (runs sitemap script first via prebuild)  
**Path alias:** `@/` → `src/`

---

## Directory Map
```
src/
├── App.tsx                    # Router: all routes defined here (lazy imports)
├── main.tsx                   # Entry point
├── pages/
│   ├── Index.tsx              # Homepage (large file, ~71KB)
│   ├── CalculatorPage.tsx     # Generic wrapper for all calculators via REGISTRY
│   ├── CategoryIndex.tsx      # Fallback category page (catches /:category)
│   ├── categories/            # 16 explicit category pages (FinancialCategory, HealthCategory, …)
│   ├── GamesPage.tsx          # Games hub
│   ├── GamePlayerPage.tsx     # Individual game renderer
│   ├── SmartTips.tsx          # Smart tips hub
│   ├── SmartTipsSubCategory.tsx
│   ├── SmartTipDetail.tsx
│   ├── DailyQuotesPage.tsx    # Daily quotes + horoscope
│   └── Search.tsx / About.tsx / NotFound.tsx / Privacy.tsx / Terms.tsx / Cookies.tsx
├── components/
│   ├── Header.tsx             # Top nav with search, theme toggle, category menu
│   ├── Footer.tsx
│   ├── Breadcrumbs.tsx        # Auto breadcrumbs from route
│   ├── SEOHead.tsx            # <Helmet> wrapper
│   ├── AdUnit.tsx             # AdSense ad unit
│   ├── RelatedCalculators.tsx # Shown below each calculator
│   ├── calculators/           # Feature calculators by category
│   │   ├── Financial/ Health/ Math/ Conversion/ …(20 folders, one per category)
│   ├── ui/                    # shadcn/ui base components (Button, Card, Input…)
│   ├── seo/                   # JsonLd.tsx, SEO.tsx
│   ├── home/                  # Homepage-specific sections
│   └── games/ cards/ layouts/ forms/ common/ ads/ share/ templates/ theme/
├── data/
│   ├── calculatorRegistry.ts  # ⚠️ MASTER REGISTRY (~313KB, 7030 lines) — single source of truth
│   ├── categoryMeta.ts        # Category metadata (titles, descriptions)
│   ├── categorySections.ts    # Sections config per category page
│   ├── gameRegistry.tsx       # All games definitions
│   ├── gamesRegistry.ts       # Game slugs/metadata
│   ├── smartTipsData.ts       # All smart tips content (~156KB)
│   ├── mathCatalog.tsx / mathSubcatalog.tsx
│   └── crossLinks.ts / recommendedResources.ts
├── hooks/
│   ├── use-toast.ts / use-mobile.tsx
│   ├── useCookieConsent.ts / useFaqJsonLd.ts
│   └── useHiddenCuisines.ts / useWeightUnitPreference.ts
├── config/                    # App config files
├── lib/                       # Utilities (cn, etc.)
├── styles/                    # Additional CSS
└── test/                      # Vitest setup
```

---

## Navigation / Routing (Graphify Context)

```
/ (Index)
├── /about
├── /contact
├── /search
├── /privacy | /terms | /cookies | /cookie-settings
│
├── /games
│   └── /games/:slug  → GamePlayerPage
│
├── /smart-tips
│   ├── /smart-tips/:subcategory
│   └── /smart-tip/:slug  → SmartTipDetail
│
├── /daily-quotes
│   ├── /daily-quotes/:category
│   └── /daily-quotes/horoscopo → DailyHoroscopeCalculator
│
├── CATEGORY INDEX PAGES (explicit routes):
│   /financial | /health | /cooking | /conversion | /math | /science
│   /time | /pets | /automotive | /construction | /electrical
│   /everyday | /sports | /funny | /video | /marketing
│
├── CALCULATOR ROUTES (generated from REGISTRY):
│   /:category/:slug              ← urlStyle: "flat" (most calculators)
│   /:category/:subcategory/:slug ← urlStyle: "nested"
│   → All render CalculatorPage with activeSlug prop
│
├── /:category  → CategoryIndex (generic fallback)
└── /* → NotFound
```

**Redirects:**
- `/home` → `/`
- `/recipes/*` → `/`
- `/everyday-life/:slug` → `/everyday/:slug`
- `/horoscopo` → `/daily-quotes/horoscopo`

---

## calculatorRegistry.ts — How It Works

```ts
export interface CalculatorEntry {
  slug: string;          // unique URL identifier
  title: string;
  category: string;      // e.g. "financial", "health"
  subcategory?: string;  // e.g. "loans", "investments"
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  aliases?: string[];
  loader: () => Promise<{ default: React.ComponentType<any> }>;
  namedExport?: string;
  urlStyle?: "nested" | "flat";  // default "flat"
}
```

- **URL generation:** `calcLink(entry)` → `/category/slug` (flat) or `/category/subcategory/slug` (nested)
- **Access:** `getEntry(slug)` finds an entry by slug or alias
- **`REGISTRY`** = exported array used in App.tsx to generate all routes
- **Adding a new calculator:** append entry to `calculatorRegistry` array + create component in `src/components/calculators/<Category>/`

---

## Development Rules

### Code Style
- Always TypeScript — no `any` unless unavoidable
- Use `@/` alias for all src imports (never relative `../`)
- New components → Radix UI + Tailwind utility-first classes (CVA for variants)
- Use `cn()` from `@/lib/utils` for conditional class merging

### Calculator Components
- Each calculator is a self-contained component in `src/components/calculators/<Category>/`
- Must have a `default` export (React component)
- Wrap with `CalculatorVerticalLayout` from `@/components/layouts/` (controls padding/spacing)
- Register in `calculatorRegistry.ts` to make it accessible

### SEO (Mandatory on every calculator)
- `CalculatorPage.tsx` automatically injects: `BreadcrumbList`, `SoftwareApplication`, `HowTo` JSON-LD
- Use `SEOHead` component for custom `<title>` and `<meta description>`
- Canonical URL: always `https://www.smartkitnow.com/category/slug`

### Routing Rules
- **Do NOT** add routes manually in `App.tsx` for calculators — they are auto-generated from `REGISTRY`
- Only add explicit routes for new page types (non-calculator features)
- Category pages live in `src/pages/categories/` and need an explicit route in App.tsx

### State & Data Fetching
- TanStack Query for async/API data
- React context for global UI state (theme, cookie consent)
- No Redux, no Zustand

### Environment Variables
```
VITE_ADSENSE_ENABLED=true|false
VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
VITE_ADSENSE_SLOT_TOP_BANNER=...
VITE_ADSENSE_SLOT_SIDEBAR=...
VITE_ADSENSE_SLOT_BOTTOM_BANNER=...
```

### Testing
- Unit: `npm test` (Vitest + jsdom)
- E2E: Playwright (in `playwright-mcp/` and `src/test/`)
- Run before PRs: `npm run test:run`

### Linting & Pre-commit
- ESLint (eslint.config.js) + Husky + lint-staged
- Auto-fix on staged files: `eslint --fix`

### Error Handling (MANDATORY on every calculator)

Every calculator must use the three reusable primitives in `src/components/common/`:

| Component | Purpose | When to use |
|---|---|---|
| `ErrorBoundary` | Catches render-time exceptions thrown by the calculator subtree and shows a recoverable fallback | Wrap every calculator widget; mounts once per calculator |
| `CalculatorSkeleton` | Animated placeholder matching the widget grid (inputs, buttons, result card) | Suspense fallback for lazy-loaded calculators and any in-widget loading state (async fetches, deferred compute) |
| `CalculatorErrorState` | User-facing error card with title, message, optional details, and retry button | Validation failures, fetch failures, computation errors — anywhere you previously rendered ad-hoc red text |

**Rules:**
1. Never `try/catch` and silently swallow — always surface via `CalculatorErrorState`.
2. Async work (fetch, lazy import) must render `CalculatorSkeleton` while pending and `CalculatorErrorState` on failure.
3. `ErrorBoundary` is the outermost wrapper inside the calculator component, **inside** `CalculatorVerticalLayout`'s `widget` slot.
4. Pass `calculatorName` to `ErrorBoundary` so logs and the default fallback identify the source.
5. Do not log errors to `console.log` — `ErrorBoundary` already calls `console.error` with the component stack. Use the `onError` prop to forward to analytics.

**Reference pattern:**

```tsx
import { Suspense, useState } from "react";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import CalculatorSkeleton from "@/components/common/CalculatorSkeleton";
import CalculatorErrorState from "@/components/common/CalculatorErrorState";

export default function ExampleCalculator() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCalculate() {
    setError(null);
    setLoading(true);
    try {
      // ... fetch live rate, run heavy compute, etc.
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation failed");
    } finally {
      setLoading(false);
    }
  }

  const widget = (
    <ErrorBoundary calculatorName="Example Calculator" showDetails={import.meta.env.DEV}>
      {loading && <CalculatorSkeleton rows={4} />}

      {!loading && error && (
        <CalculatorErrorState
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {!loading && !error && (
        <>
          {/* inputs, buttons, result card */}
        </>
      )}
    </ErrorBoundary>
  );

  return <CalculatorVerticalLayout widget={widget} {/* ...rest */} />;
}
```

**Lazy-loaded calculators** (`calculatorRegistry.ts` loader) — `CalculatorPage` wraps the dynamic import in `<Suspense fallback={<CalculatorSkeleton />}>` and an outer `<ErrorBoundary />`; individual calculators only need the inner boundary for their own runtime errors.

---

## Key Utility Scripts (root-level)
| Script | Purpose |
|---|---|
| `generate-sitemap.cjs` | Generates XML sitemap from REGISTRY |
| `auto-update-pages.cjs` | Automates category page updates |
| `scripts/generate-sitemap.ts` | TypeScript sitemap generator (prebuild) |
| `scripts/scaffold-missing.ts` | Scaffolds missing calculator stubs |
| `scripts/check-loaders.ts` | Validates all registry loaders resolve |
| `vercel.json` | Vercel routing rewrites/redirects (SPA fallback) |

---

## Common Tasks — Quick Reference

**Add a new calculator:**
1. Create `src/components/calculators/<Category>/<Name>Calculator.tsx`
2. Add entry to `calculatorRegistry.ts` with `loader`, `slug`, `category`, `urlStyle: "flat"`
3. Run `npm run dev` — route auto-appears

**Add a new category:**
1. Create `src/pages/categories/<Name>Category.tsx`
2. Add lazy import + `<Route path="/<slug>" element={<NameCategory />} />` in `App.tsx`
3. Add icon + friendly title to `FRIENDLY_TITLES` and `categoryIcon()` in registry

**Fix broken route:**
- Check `vercel.json` rewrites for production SPA fallback
- Check `calcLink()` in `calculatorRegistry.ts` for URL generation logic
