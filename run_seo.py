import csv
import json
import os

res_dir = r"c:\Users\Williams Martins\OneDrive\Documentos\WBSmartKitNow\smartkit-onepage-wonder\antigravity-smartkitnow\.agent\skills\seo-optimization\resources"
output_dir = os.path.join(res_dir, "output")
os.makedirs(output_dir, exist_ok=True)

with open(os.path.join(res_dir, "title_templates.json"), encoding="utf-8") as f:
    title_tpls = json.load(f)["templates"]

with open(os.path.join(res_dir, "schema_templates.json"), encoding="utf-8") as f:
    schema_tpls = json.load(f)

web_app_schema_tpl = json.dumps(schema_tpls["webApplication"])
faq_schema_tpl = json.dumps(schema_tpls["faqPage"])

pages = []
with open(os.path.join(res_dir, "all_pages.csv"), encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        pages.append(row)

categories = {}
for p in pages:
    cat = p["Category"].lower()
    if cat not in categories:
        categories[cat] = []
    categories[cat].append(p)

def replace_placeholders(text, page):
    slug = page["Page_Slug"].replace("-", " ")
    tool_name = slug.title() if slug.lower() != "index" else page["Category"] + " Calculator"
    # Title & Meta replacements
    text = text.replace("[Tool]", tool_name)
    text = text.replace("[Sport]", "Sports")
    text = text.replace("[Finance]", "Financial")
    text = text.replace("[metric]", tool_name)
    text = text.replace("[animal]", "Pets")
    text = text.replace("[purpose]", tool_name)
    text = text.replace("[material]", tool_name)
    from_unit = "units"
    to_unit = "units"
    if page["Page_Slug"].find("-to-") != -1:
        parts = page["Page_Slug"].split("-to-")
        from_unit = parts[0].replace("-", " ").title()
        to_unit = parts[1].replace("-", " ").title()
    text = text.replace("[from]", from_unit)
    text = text.replace("[to]", to_unit)
    text = text.replace("[problem]", "Math")
    text = text.replace("[Unit]", "Unit")
    text = text.replace("[Animal]", "Pet")
    text = text.replace("[input]", from_unit)
    text = text.replace("[output]", to_unit)
    
    # Schema replacements
    text = text.replace("{{calculator_name}}", tool_name)
    text = text.replace("{{description}}", "Free online " + tool_name)
    text = text.replace("{{url}}", page["URL"])
    text = text.replace("{{category}}", page["Category"])
    text = text.replace("{{rating_count}}", str(max(10, len(tool_name) * 3)))
    text = text.replace("{{how_it_works_answer}}", "Simply enter your values into the tool and click calculate to get instant results.")
    text = text.replace("{{accuracy_answer}}", "Our tool uses industry-standard formulas to ensure the highest possible accuracy.")
    text = text.replace("{{custom_question}}", f"Who can use the {tool_name}?")
    text = text.replace("{{custom_answer}}", "Anyone looking for quick and accurate calculations can use this free tool.")
    text = text.replace("{{category_name}}", page["Category"])
    text = text.replace("{{category_slug}}", page["Category"].lower())
    
    return text

for cat, items in categories.items():
    if cat not in title_tpls:
        continue
    tpl = title_tpls[cat]
    out_file = os.path.join(output_dir, f"{cat}_optimized.csv")
    with open(out_file, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["URL", "Category", "Page_Slug", "Optimized_Title", "Optimized_Meta", "WebApp_Schema", "FAQ_Schema"])
        
        for page in items:
            title = replace_placeholders(tpl["title"], page)
            if len(title) > 60:
                title = title[:57] + "..."
                
            meta = replace_placeholders(tpl["meta_description"], page)
            if len(meta) > 155:
                meta = meta[:152] + "..."
                
            web_app = replace_placeholders(web_app_schema_tpl, page)
            faq = replace_placeholders(faq_schema_tpl, page)
            
            writer.writerow([page["URL"], page["Category"], page["Page_Slug"], title, meta, web_app, faq])

print("Processing complete.")
