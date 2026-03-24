# SEO Strategy A+B — CTR & Content Depth

**Goal:** Increase organic clicks for AdSense revenue (target: 15,000+ pageviews/month)
**Date:** 2026-03-24

## Strategy A — Quick Wins (technical, all 720 calculators)

### A1. SoftwareApplication schema
- Add to `CalculatorPage.tsx` — one change, benefits all 720 calculators
- Schema: `SoftwareApplication`, `applicationCategory: UtilitiesApplication`, `price: 0`

### A2. Meta title optimization
- Add `seoTitle` field to `CalculatorRegistry` type
- Use `seoTitle` in `CalculatorPage.tsx` when present, fallback to auto-generated
- Auto-generated pattern: `"{title} — {category} Calculator | Smart Kit Now"`

### A3. Meta description optimization
- Add `seoDescription` field to registry type
- Priority 5 pages get custom descriptions
- Fallback template improved from generic to keyword-rich

### Priority pages — seoTitle + seoDescription

| Slug | seoTitle | seoDescription |
|---|---|---|
| caffeine-max-per-day | Daily Caffeine Limit Calculator — Safe Dose by Body Weight | Find your safe daily caffeine limit by body weight. Track coffee, tea, and energy drinks to avoid jitters, anxiety, and sleep disruption. |
| pool-length-time-converter | Swim Time Converter — SCY, SCM & LCM Pool Lengths | Convert swim times between Short Course Yards, Short Course Meters, and Long Course Meters. Essential for competitive swimmers comparing performance across pool sizes. |
| dog-calorie-needs-rer-mer | Dog Calorie Calculator — Daily RER & MER by Weight & Activity | Calculate your dog's daily calorie needs using the RER and MER method. Enter breed, weight, and activity level for accurate feeding recommendations. |
| render-time-per-frame-calculator | Render Time Per Frame Calculator — 3D & Animation Estimates | Estimate total render time from a single test frame. Calculate render job duration for 3D animations, VFX, and video sequences by frame count and render speed. |
| event-capacity-calculator | Event Capacity Calculator — Max Guests by Room Size | Calculate safe event capacity from room square footage. Get guest counts for standing, seated, cocktail, and classroom layouts instantly. |

## Strategy B — Content Depth (top 5 impression pages)

Each page needs:
- FAQs: expand from 3–5 → 8–10 (long-tail keyword targeting)
- "How to use" section: numbered steps with real example
- Formula/method section: technical explanation with numbers
- Reference table: context-specific data table

### caffeine-max-per-day
FAQ additions: caffeine content by drink, anxiety threshold, half-life, pregnancy limits, withdrawal symptoms, caffeine vs adenosine mechanism

### pool-length-time-converter
FAQ additions: SCY vs LCM time differences, why times differ, conversion formula, Olympic pool size, training implications, world record context

### dog-calorie-needs-rer-mer
FAQ additions: RER formula (70 × kg^0.75), MER factors by life stage, overweight adjustment, how to weigh dog food, treats as % of daily calories, seasonal variation

### render-time-per-frame-calculator
FAQ additions: GPU vs CPU render times, cloud rendering options, how to run a test render, frame rate vs render time, batch rendering tips, memory impact

### event-capacity-calculator
FAQ additions: fire code requirements, ADA compliance space, cocktail vs seated difference, stage/dance floor deductions, outdoor vs indoor rules, venue insurance implications

## Execution Order

1. [x] Strategy A — CalculatorPage.tsx schema + meta title/desc changes
2. [ ] Strategy B — caffeine-max-per-day content expansion
3. [ ] Strategy B — pool-length-time-converter content expansion
4. [ ] Strategy B — render-time-per-frame-calculator content expansion
5. [ ] Strategy B — event-capacity-calculator content expansion
6. [ ] Strategy B — dog-calorie-needs-rer-mer content expansion (already richest)
