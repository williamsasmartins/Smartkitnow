"""
Content quality audit script for SmartKitNow calculators.
Run: python3 scripts/audit_content_quality.py

Outputs:
- thin_pages.txt  : pages with under 400 words of visible text content
- generic_faq.txt : pages using the boilerplate FAQ template (identical across calculators)
"""

import os
import re

CALC_DIR = "src/components/calculators"

# These phrases appear verbatim in 58+ calculators — boilerplate FAQ template
GENERIC_MARKERS = [
    "How accurate is this calculator",
    "What should I do with these results",
    "How often should I recalculate",
    "What are common mistakes people make with this calculation",
    "Can I use this calculator for specific scenarios",
]

def extract_text_words(content: str) -> int:
    """Rough word count from visible text strings in JSX (strings inside > < delimiters)."""
    text_parts = re.findall(r'>[^<{]{8,}<', content)
    return len(" ".join(text_parts).split())

def main():
    thin = []
    generic_faq = []

    for root, _, files in os.walk(CALC_DIR):
        for f in sorted(files):
            if not f.endswith(".tsx"):
                continue
            path = os.path.join(root, f)
            content = open(path, encoding="utf-8", errors="ignore").read()

            words = extract_text_words(content)
            markers_found = sum(1 for m in GENERIC_MARKERS if m in content)

            rel_path = path.replace("\\", "/")

            if words < 400:
                thin.append((words, rel_path))

            if markers_found >= 2:
                generic_faq.append((markers_found, rel_path))

    thin.sort(key=lambda x: x[0])
    generic_faq.sort(key=lambda x: -x[0])

    with open("thin_pages.txt", "w", encoding="utf-8") as fh:
        fh.write(f"THIN PAGES (under 400 words of visible text) — {len(thin)} files\n")
        fh.write("=" * 70 + "\n")
        for words, path in thin:
            fh.write(f"{words:4d}w  {path}\n")

    with open("generic_faq.txt", "w", encoding="utf-8") as fh:
        fh.write(f"GENERIC FAQ TEMPLATE DETECTED — {len(generic_faq)} files\n")
        fh.write("These files share identical boilerplate FAQ questions.\n")
        fh.write("Google may treat these as duplicate content.\n")
        fh.write("=" * 70 + "\n")
        for count, path in generic_faq:
            fh.write(f"{count} markers  {path}\n")

    print(f"Thin pages (<400w): {len(thin)}")
    print(f"Generic FAQ pages:  {len(generic_faq)}")
    print("Reports written to thin_pages.txt and generic_faq.txt")

if __name__ == "__main__":
    main()
