"""
FAQ Upgrade Priority List Generator
Run: python3 scripts/generate_faq_upgrade_list.py

Outputs faq_upgrade_list.md — a prioritized work list for replacing
the 58 generic FAQ templates with unique, calculator-specific FAQs.

WHAT MAKES A GOOD FAQ (vs the generic template):
================================================
BAD (generic template):
  - "How accurate is this calculator?" → Generic trust-building answer
  - "What should I do with these results?" → Generic "consult an advisor"
  - "How often should I recalculate?" → Generic "when things change"

GOOD (specific to calculator):
  - Questions that reference the actual metric/formula being calculated
  - Answers with real numbers, benchmarks, or regulatory thresholds
  - Answers that explain edge cases or common misunderstandings
  - 1-2 contextual internal links to related calculators

CHECKLIST PER FAQ SET:
  ✓ 5-6 questions, each unique to this specific calculator
  ✓ No question uses the generic template language
  ✓ At least 2 answers include numeric examples or benchmarks
  ✓ At least 1 answer compares to a related concept (e.g., APR vs interest rate)
  ✓ At least 1 internal link to a related calculator
"""

import os
import re

CALC_DIR = "src/components/calculators"

GENERIC_MARKERS = [
    ("How accurate is this calculator", "Trust question — replace with real accuracy context"),
    ("What should I do with these results", "Action question — replace with specific next steps"),
    ("How often should I recalculate", "Cadence question — replace with trigger-based advice"),
    ("What are common mistakes people make with this calculation", "Mistakes question — replace with specific errors for this calculator"),
    ("What information do I need to use this calculator", "Input question — already somewhat specific, but often generic"),
]

PRIORITY_KEYWORDS = {
    # High search volume financial topics
    "APR": 1, "CreditCard": 1, "Mortgage": 1, "Loan": 1, "Interest": 1,
    "Crypto": 2, "Investment": 2, "Retirement": 2, "Tax": 2,
    "Budget": 3, "Savings": 3, "Debt": 3,
}

def get_priority(filename):
    for kw, p in PRIORITY_KEYWORDS.items():
        if kw.lower() in filename.lower():
            return p
    return 4

def extract_calculator_title(content):
    m = re.search(r'title[=:]\s*["\']([^"\']+)["\']', content)
    return m.group(1) if m else ""

def count_generic_markers(content):
    return sum(1 for m, _ in GENERIC_MARKERS if m in content)

def main():
    rows = []
    for root, _, files in os.walk(CALC_DIR):
        for f in sorted(files):
            if not f.endswith(".tsx"):
                continue
            path = os.path.join(root, f)
            content = open(path, encoding="utf-8", errors="ignore").read()
            count = count_generic_markers(content)
            if count < 2:
                continue
            title = extract_calculator_title(content) or f.replace(".tsx", "")
            priority = get_priority(f)
            markers_found = [desc for marker, desc in GENERIC_MARKERS if marker in content]
            rows.append((priority, count, title, path.replace("\\", "/"), markers_found))

    rows.sort(key=lambda x: (x[0], -x[1]))

    lines = ["# FAQ Upgrade Priority List\n"]
    lines.append(f"Total files to upgrade: {len(rows)}\n")
    lines.append("Priority 1 = highest search volume (APR, Credit Card, Mortgage, Loan)\n")
    lines.append("Priority 4 = lower priority (niche financial calculators)\n\n")

    current_priority = None
    for priority, count, title, path, markers in rows:
        if priority != current_priority:
            current_priority = priority
            lines.append(f"\n## Priority {priority}\n")

        lines.append(f"### {title}")
        lines.append(f"- **File:** `{path}`")
        lines.append(f"- **Generic markers found:** {count}/5")
        lines.append(f"- **Questions to replace:**")
        for m in markers:
            lines.append(f"  - {m}")

        # Generate FAQ structure hint based on calculator title
        t = title.lower()
        if "apr" in t:
            lines.append("- **Suggested topics:** APR vs interest rate, APR vs APY, fee types included/excluded, APR by credit score, how to negotiate APR")
        elif "credit card" in t:
            lines.append("- **Suggested topics:** Daily vs monthly compounding, average APR 2024, minimum payment trap with numbers, grace period mechanics, balance transfer math")
        elif "mortgage" in t:
            lines.append("- **Suggested topics:** Fixed vs ARM, DTI ratio limits, PMI threshold, prepayment penalty, refinance breakeven")
        elif "crypto" in t:
            lines.append("- **Suggested topics:** Volatility impact on results, tax treatment, DCA vs lump sum evidence, exchange fee comparison, regulatory risk")
        elif "invest" in t or "roi" in t:
            lines.append("- **Suggested topics:** Nominal vs real returns, CAGR vs simple return, risk-adjusted return, inflation effect, time horizon impact")
        elif "tax" in t:
            lines.append("- **Suggested topics:** Short-term vs long-term rates, wash sale rule, tax-loss harvesting, state tax differences, IRS holding period rules")
        elif "loan" in t:
            lines.append("- **Suggested topics:** Origination fee impact on true cost, prepayment penalty, secured vs unsecured rates, DTI qualification, amortization front-loading")
        else:
            lines.append("- **Suggested topics:** [Add 5 specific topics relevant to this calculator's subject matter]")
        lines.append("")

    with open("faq_upgrade_list.md", "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))

    print(f"Written faq_upgrade_list.md with {len(rows)} calculators to upgrade")
    print(f"Priority 1: {sum(1 for r in rows if r[0]==1)}")
    print(f"Priority 2: {sum(1 for r in rows if r[0]==2)}")
    print(f"Priority 3: {sum(1 for r in rows if r[0]==3)}")
    print(f"Priority 4: {sum(1 for r in rows if r[0]==4)}")

if __name__ == "__main__":
    main()
