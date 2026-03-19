# SmartKitNow SEO Optimization Project

## Project Context

This is the SEO optimization project for **SmartKitNow.com**, a calculator tools website with **739 pages** across **15 categories**.

## Current Status

- **Site**: https://www.smartkitnow.com
- **Total Pages**: 739
- **Current CTR**: 0.4% (target: 2.5%+)
- **Current Position**: 14.4 (target: < 10)
- **Schema Markup**: Not implemented
- **Pages Optimized**: 0/739

## Primary Goals

1. Optimize meta tags for all 739 pages
2. Add WebApplication + FAQPage schema to all calculators
3. Improve internal linking structure
4. Enhance thin content pages
5. Achieve top 10 rankings for primary keywords

## Category Priority

### Optimize First (HIGH)
- `/sports/` - 48 pages - Fantasy calculators
- `/financial/` - 77 pages - High CPC keywords
- `/health/` - 26 pages - BMI, TDEE tools
- `/video/` - 52 pages - Already ranking
- `/conversion/` - 32 pages - High volume

### Optimize Second (MEDIUM)
- `/pets/` - 163 pages - Largest category
- `/automotive/` - 55 pages
- `/construction/` - 44 pages
- `/everyday/` - 39 pages
- `/math/` - 37 pages
- `/science/` - 34 pages
- `/electrical/` - 30 pages
- `/cooking/` - 28 pages
- `/time/` - 26 pages

### Optimize Last (LOW)
- `/funny/` - 38 pages - Entertainment only

## Key Files

- `.agent/skills/seo-optimization/SKILL.md` - Main skill instructions
- `.agent/skills/seo-optimization/resources/all_pages.csv` - All 739 URLs
- `.agent/skills/seo-optimization/resources/prompts.md` - Ready prompts
- `.agent/skills/seo-optimization/resources/title_templates.json` - Title formulas
- `.agent/skills/seo-optimization/resources/schema_templates.json` - JSON-LD templates

## Workflow

1. **Audit**: Run technical SEO audit on the site
2. **Plan**: Review all_pages.csv and prioritize by category
3. **Execute**: Generate optimizations in batches (by category)
4. **Output**: Save as actionable files (CSV, JSON, code)
5. **Track**: Update progress.md after each batch

## Rules

- Always process HIGH priority categories first
- Generate unique content for each page (no duplicates)
- Titles must be under 60 characters
- Meta descriptions must be under 155 characters
- Include year "2026" in titles for freshness
- Use power words: Free, Instant, Accurate, Easy
- Add CTA to meta descriptions

## Commands

When optimizing SmartKitNow:

```
@.agent/skills/seo-optimization/resources/all_pages.csv - See all pages
@.agent/skills/seo-optimization/resources/prompts.md - Get prompts
@.agent/skills/seo-optimization/SKILL.md - Full instructions
```

## Output Format

For meta tag optimizations, output as CSV:
```
URL,Current_Title,Optimized_Title,Current_Meta,Optimized_Meta
```

For schema markup, output as individual JSON files per page.
