# SmartKitNow - Antigravity SEO Prompts
# Use estes prompts no Manager View do Antigravity para otimizar todas as 739 páginas

## ===== FASE 1: AUDIT TÉCNICO COMPLETO =====

### Prompt 1.1 - Audit Geral do Site
```
Run a complete technical SEO audit on https://www.smartkitnow.com including:
1. Crawl all 739 pages from sitemap.xml
2. Check for: broken links, redirect chains, 404 errors
3. Analyze Core Web Vitals (LCP, FID, CLS) 
4. Find duplicate title tags and meta descriptions
5. Identify missing H1 tags
6. Check robots.txt and sitemap.xml validity
7. Analyze site architecture and crawl depth

Export results as JSON with structure:
{
  "critical_issues": [],
  "warnings": [],
  "opportunities": [],
  "pages_analyzed": 739
}
```

### Prompt 1.2 - Audit por Categoria (repetir para cada categoria)
```
Audit all pages in the /[CATEGORY]/ directory of https://www.smartkitnow.com for:
- Missing or duplicate meta descriptions
- Thin content (under 300 words)
- Missing schema markup
- Broken internal links
- Missing alt text on images
- Page load time issues

Categories to audit: pets (163), financial (77), automotive (55), video (52), sports (48), construction (44), everyday (39), funny (38), math (37), science (34), conversion (32), electrical (30), cooking (28), time (26), health (26)

Output as CSV: URL, Issue_Type, Severity, Fix_Recommendation
```

## ===== FASE 2: OTIMIZAÇÃO DE META TAGS =====

### Prompt 2.1 - Gerar Títulos Otimizados (HIGH Priority First)
```
For each calculator page in /sports/, /financial/, /health/, /video/, /conversion/ directories:

1. Analyze current title tag
2. Generate optimized title following this formula:
   - Under 60 characters
   - Include primary keyword at start
   - Add year "2026" for freshness
   - Include power word: "Free", "Instant", "Accurate"
   - End with brand or benefit

Examples:
- "Fantasy Points Calculator 2026 | Free NFL & NBA Tool"
- "Compound Interest Calculator | Free Investment Estimator"
- "BMI Calculator 2026 | Accurate Body Mass Index Tool"

Output as CSV: URL, Current_Title, Optimized_Title, Primary_Keyword
```

### Prompt 2.2 - Gerar Meta Descriptions
```
For each page in the HIGH priority categories, generate meta descriptions:

Requirements:
- Under 155 characters
- Include primary keyword naturally
- Add clear CTA (Calculate now, Try free, Get instant results)
- Mention key benefit or feature
- Create urgency or curiosity

Format output as:
URL | Current_Meta | Optimized_Meta | CTA_Used
```

## ===== FASE 3: SCHEMA MARKUP EM MASSA =====

### Prompt 3.1 - WebApplication Schema Generator
```
Generate WebApplication JSON-LD schema for all calculator pages. 

Template to use:
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "[Calculator Name]",
  "description": "[Brief description of what it calculates]",
  "url": "[Page URL]",
  "applicationCategory": "[Category: FinanceApplication, HealthApplication, UtilityApplication, etc.]",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150"
  }
}

Process all 732 calculator pages and save as individual JSON files:
/schemas/[category]/[page-slug]-schema.json
```

### Prompt 3.2 - FAQPage Schema Generator
```
For each calculator, generate FAQPage schema with 3-5 relevant questions:

Standard questions to include:
1. "How does the [Calculator Name] work?"
2. "Is this [Calculator Name] free to use?"
3. "How accurate is this calculator?"
4. "[Category-specific question based on calculator purpose]"
5. "Can I use this calculator on mobile?"

Output as JSON-LD that can be added to each page's <head>.
```

## ===== FASE 4: INTERNAL LINKING =====

### Prompt 4.1 - Internal Link Analysis
```
Analyze internal linking structure across all 739 pages:

1. Identify orphan pages (0 internal links pointing to them)
2. Find pages with too many outbound links (50+)
3. Map relationships between related calculators:
   - BMI <-> TDEE <-> Calorie Calculator
   - Loan <-> Amortization <-> Interest Calculator
   - Fantasy Points <-> Betting Odds <-> Team Stats

4. Generate link insertion recommendations:
   Source_URL | Anchor_Text | Target_URL | Context_Sentence

Prioritize HIGH priority categories first.
```

### Prompt 4.2 - Hub Page Creation Plan
```
Design hub pages for each category that link to all calculators within:

For /financial/:
- Create "All Finance Calculators" hub linking to 77 tools
- Group by subcategory: Loans, Investments, Crypto, Taxes, Budgeting

For /pets/:
- Create "Pet Health Calculators" hub
- Group by animal: Dogs (X tools), Cats (X tools), Horses, Birds, etc.

Output: Hub page structure with H2 sections and calculator lists
```

## ===== FASE 5: CONTENT OPTIMIZATION =====

### Prompt 5.1 - Content Gap Analysis
```
For each calculator page, analyze and recommend content additions:

1. Current word count
2. Recommended additions:
   - "How to use" section (100-150 words)
   - Formula explanation (50-100 words)
   - 3 practical examples with numbers
   - FAQ section (5 questions)
   - Related calculators section

3. Prioritize pages already ranking positions 11-20 (quick win opportunity)

Output: URL | Current_Words | Recommended_Additions | Priority_Score
```

### Prompt 5.2 - Competitor Content Comparison
```
Compare SmartKitNow calculator pages against:
- calculator.net
- omnicalculator.com
- calculatorsoup.com

For each calculator type we have, analyze:
1. Their content length vs ours
2. Features they have that we don't
3. Schema markup differences
4. Internal linking patterns

Identify top 20 improvement opportunities with highest search volume.
```

## ===== FASE 6: PROGRAMMATIC SEO =====

### Prompt 6.1 - Location-Based Pages (if applicable)
```
For applicable calculators (tax, real estate, salary), consider creating location variants:

Example for /financial/sales-tax/:
- /financial/sales-tax/california/
- /financial/sales-tax/new-york/
- /financial/sales-tax/texas/

Requirements:
- Unique content per location (tax rates, rules)
- Location-specific schema
- Internal links to parent and sibling pages

Generate list of 50 highest-value location combinations.
```

### Prompt 6.2 - Comparison Pages
```
Generate comparison page ideas that link multiple calculators:

Examples:
- "BMI vs Body Fat Percentage: Which Metric Should You Use?"
- "PPR vs Standard Fantasy Scoring: Complete Guide"
- "EV vs Gas Car: Total Cost Calculator Comparison"

For each comparison page:
- Target keyword
- Outline structure
- Internal links to relevant calculators
- Schema markup (Article + FAQPage)
```

## ===== COMANDOS DE EXECUÇÃO =====

### Para rodar audit completo:
```bash
# No terminal do Antigravity
antigravity run seo-audit --url https://www.smartkitnow.com --depth full --output ./audit-report
```

### Para gerar schemas em massa:
```bash
antigravity run schema-generator --sitemap https://www.smartkitnow.com/sitemap.xml --type WebApplication --output ./schemas
```

### Para otimizar meta tags:
```bash
antigravity run meta-optimizer --input ./pages.csv --templates ./title-templates.json --output ./optimized-meta.csv
```

---
NOTA: Execute estes prompts no Manager View do Antigravity. 
Use múltiplos agentes em paralelo para processar categorias diferentes simultaneamente.
Monitore progresso no Search Console após cada fase de implementação.
