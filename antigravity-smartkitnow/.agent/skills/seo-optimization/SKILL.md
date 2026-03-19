---
name: smartkitnow-seo-optimization
description: "Complete SEO optimization skill for SmartKitNow.com - 739 pages across 15 categories. Use this skill when optimizing meta tags, generating schema markup, analyzing SEO issues, creating content, or improving search rankings for the SmartKitNow calculator website."
---

# SmartKitNow SEO Optimization Skill

## Overview

SmartKitNow.com is a calculator tools website with **739 pages** across **15 categories**. This skill provides everything needed to optimize the entire site for search engines.

## Current Metrics (Baseline - March 2026)

| Metric | Current | Target (90 days) |
|--------|---------|------------------|
| Total Clicks | 228 | 2,000+ |
| CTR | 0.4% | 2.5%+ |
| Average Position | 14.4 | < 10 |
| Pages in Top 10 | ~5 | 200+ |

## Site Structure

### Categories by Priority

**HIGH PRIORITY (Optimize First):**
- `/sports/` - 48 pages (Fantasy calculators performing well)
- `/financial/` - 77 pages (High CPC potential)
- `/health/` - 26 pages (BMI, TDEE - high volume)
- `/video/` - 52 pages (Timecode calculator ranking)
- `/conversion/` - 32 pages (High search volume)

**MEDIUM PRIORITY:**
- `/pets/` - 163 pages (Largest category)
- `/automotive/` - 55 pages
- `/construction/` - 44 pages
- `/everyday/` - 39 pages
- `/math/` - 37 pages
- `/science/` - 34 pages
- `/electrical/` - 30 pages
- `/cooking/` - 28 pages
- `/time/` - 26 pages

**LOW PRIORITY:**
- `/funny/` - 38 pages (Viral potential but low SEO value)

## Resources Available

All data files are in the `resources/` folder:
- `all_pages.csv` - Complete list of 739 URLs with categories and priorities
- `prompts.md` - Ready-to-use prompts for each optimization task
- `title_templates.json` - Title templates by category
- `schema_templates.json` - JSON-LD schema templates

## Optimization Tasks

### Task 1: Technical Audit
Run complete technical SEO audit checking:
- Broken links and 404 errors
- Duplicate meta descriptions
- Missing H1 tags
- Core Web Vitals issues
- Schema markup gaps
- Internal linking problems

### Task 2: Meta Tag Optimization
For each calculator page, optimize:
1. **Title** (max 60 chars): `[Tool Name] Calculator 2026 | Free [Category] Tool`
2. **Meta Description** (max 155 chars): Include keyword, benefit, CTA
3. **Open Graph**: og:title, og:description, og:image
4. **Twitter Cards**: twitter:card, twitter:title, twitter:description

### Task 3: Schema Markup Generation
Generate for each calculator:
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "[Calculator Name]",
  "applicationCategory": "[Category]Application",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
```

Plus FAQPage schema with 3-5 relevant questions.

### Task 4: Internal Linking
Create links between related calculators:
- BMI ↔ TDEE ↔ Calorie Calculator
- Loan ↔ Amortization ↔ Interest
- Fantasy Points ↔ Betting Odds ↔ Team Stats

### Task 5: Content Enhancement
For thin pages, add:
- "How to use" section (100-150 words)
- Formula explanation
- 3 practical examples
- FAQ section (5 questions)

## Execution Order

1. **Week 1-2**: Technical audit + HIGH priority meta tags
2. **Week 3-4**: Schema markup for all calculators
3. **Week 5-6**: Internal linking optimization
4. **Week 7-8**: Content enhancement for top 100 pages
5. **Week 9-12**: Remaining pages + backlink outreach

## Commands

When asked to optimize SmartKitNow, follow this workflow:

```
1. Read resources/all_pages.csv to understand site structure
2. Start with HIGH priority categories
3. Generate optimizations in batch (by category)
4. Output as actionable files (CSV, JSON, or code)
5. Track progress in resources/progress.md
```

## Success Criteria

- All 739 pages have unique, optimized titles
- All 739 pages have unique meta descriptions
- All calculator pages have WebApplication schema
- All calculator pages have FAQPage schema
- Zero orphan pages (all have internal links)
- Core Web Vitals passing on all pages
