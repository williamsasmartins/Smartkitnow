import os

res_dir = r"c:\Users\Williams Martins\OneDrive\Documentos\WBSmartKitNow\smartkit-onepage-wonder\antigravity-smartkitnow\.agent\skills\seo-optimization\resources"
prog_file = os.path.join(res_dir, "progress.md")

with open(prog_file, "r", encoding="utf-8") as f:
    content = f.read()

# Replace overall progress
content = content.replace("| Meta Tags - HIGH Priority | ⏳ Not Started | 235 | 0% |", "| Meta Tags - HIGH Priority | ✅ Complete | 235 | 100% |")
content = content.replace("| Meta Tags - MEDIUM Priority | ⏳ Not Started | 459 | 0% |", "| Meta Tags - MEDIUM Priority | ✅ Complete | 459 | 100% |")
content = content.replace("| Meta Tags - LOW Priority | ⏳ Not Started | 38 | 0% |", "| Meta Tags - LOW Priority | ✅ Complete | 38 | 100% |")
content = content.replace("| Schema Markup | ⏳ Not Started | 739 | 0% |", "| Schema Markup | ✅ Complete | 739 | 100% |")

# Replace HIGH categories
content = content.replace("| Sports | 48 | ⏳ | ⏳ | ⏳ | Not Started |", "| Sports | 48 | ✅ | ✅ | ⏳ | Meta/Schema Done |")
content = content.replace("| Financial | 77 | ⏳ | ⏳ | ⏳ | Not Started |", "| Financial | 77 | ✅ | ✅ | ⏳ | Meta/Schema Done |")
content = content.replace("| Health | 26 | ⏳ | ⏳ | ⏳ | Not Started |", "| Health | 26 | ✅ | ✅ | ⏳ | Meta/Schema Done |")
content = content.replace("| Video | 52 | ⏳ | ⏳ | ⏳ | Not Started |", "| Video | 52 | ✅ | ✅ | ⏳ | Meta/Schema Done |")
content = content.replace("| Conversion | 32 | ⏳ | ⏳ | ⏳ | Not Started |", "| Conversion | 32 | ✅ | ✅ | ⏳ | Meta/Schema Done |")

# Replace MEDIUM categories
content = content.replace("| Pets | 163 | ⏳ | ⏳ | ⏳ | Not Started |", "| Pets | 163 | ✅ | ✅ | ⏳ | Meta/Schema Done |")
content = content.replace("| Automotive | 55 | ⏳ | ⏳ | ⏳ | Not Started |", "| Automotive | 55 | ✅ | ✅ | ⏳ | Meta/Schema Done |")
content = content.replace("| Construction | 44 | ⏳ | ⏳ | ⏳ | Not Started |", "| Construction | 44 | ✅ | ✅ | ⏳ | Meta/Schema Done |")
content = content.replace("| Everyday | 39 | ⏳ | ⏳ | ⏳ | Not Started |", "| Everyday | 39 | ✅ | ✅ | ⏳ | Meta/Schema Done |")
content = content.replace("| Math | 37 | ⏳ | ⏳ | ⏳ | Not Started |", "| Math | 37 | ✅ | ✅ | ⏳ | Meta/Schema Done |")
content = content.replace("| Science | 34 | ⏳ | ⏳ | ⏳ | Not Started |", "| Science | 34 | ✅ | ✅ | ⏳ | Meta/Schema Done |")
content = content.replace("| Electrical | 30 | ⏳ | ⏳ | ⏳ | Not Started |", "| Electrical | 30 | ✅ | ✅ | ⏳ | Meta/Schema Done |")
content = content.replace("| Cooking | 28 | ⏳ | ⏳ | ⏳ | Not Started |", "| Cooking | 28 | ✅ | ✅ | ⏳ | Meta/Schema Done |")
content = content.replace("| Time | 26 | ⏳ | ⏳ | ⏳ | Not Started |", "| Time | 26 | ✅ | ✅ | ⏳ | Meta/Schema Done |")

# Replace LOW categories
content = content.replace("| Funny | 38 | ⏳ | ⏳ | ⏳ | Not Started |", "| Funny | 38 | ✅ | ✅ | ⏳ | Meta/Schema Done |")

with open(prog_file, "w", encoding="utf-8") as f:
    f.write(content)
