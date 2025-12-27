const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/components/calculators/Science');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let modifiedCount = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('id: "references"')) {
        console.log(`Skipping ${file} - already has references`);
        return;
    }

    // Extract title
    const titleMatch = content.match(/title="([^"]+)"/);
    let title = "Science Topic";
    if (titleMatch) {
        title = titleMatch[1].replace(/Calculator|Estimator/g, '').trim();
    }

    const wikiLink = `https://en.wikipedia.org/wiki/${title.replace(/ /g, '_')}`;
    const khanLink = `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(title)}`;

    const referenceSection = `
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
          <li>
            <a href="${wikiLink}" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
              ${title} - Wikipedia
            </a>
          </li>
          <li>
            <a href="${khanLink}" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
              ${title} - Khan Academy
            </a>
          </li>
        </ul>
      </section>`;

    // Insert section after the last </section> inside editorial
    // We assume editorial ends with a </div> followed by );
    // A robust way is to find the last </section> and insert after it.
    
    // Check if we can find the FAQ section end
    const faqEndRegex = /(<\/section>)\s*(\n\s*<\/div>\s*\);)/;
    
    if (faqEndRegex.test(content)) {
        content = content.replace(faqEndRegex, `$1\n${referenceSection}$2`);
        
        // Update onThisPage
        // We look for onThisPage={[ ... ]}
        const onThisPageRegex = /(onThisPage=\{\[\s*[\s\S]*?)(\s*\]\})/;
        if (onThisPageRegex.test(content)) {
            content = content.replace(onThisPageRegex, `$1,\n        { id: "references", label: "References & Resources" }$2`);
            
            // Fix double commas if any (regex replacement might introduce one if not careful, but here we append)
            // Actually, let's make sure we have a comma before if needed.
            // But the previous item might not have a comma if it was the last one.
            // JSON-like array in JS allows trailing comma, but if the previous line didn't have one...
            // e.g. { id: "faq", label: "FAQ" }
            // We should add a comma to the previous line if missing.
            
            // Let's refine the onThisPage replacement.
            // Find the last object inside onThisPage array
            const lastItemRegex = /({[^}]+label:\s*"FAQ"[^}]+})/;
            if (lastItemRegex.test(content)) {
                 content = content.replace(lastItemRegex, `$1,\n        { id: "references", label: "References & Resources" }`);
            } else {
                // Fallback: just insert before ]}
                 content = content.replace(/(\s*\]\}\s*showTopBanner)/, `,\n        { id: "references", label: "References & Resources" }$1`);
            }

            fs.writeFileSync(filePath, content);
            console.log(`Updated ${file}`);
            modifiedCount++;
        } else {
            console.log(`Could not find onThisPage in ${file}`);
        }
    } else {
        console.log(`Could not find editorial end in ${file}`);
    }
});

console.log(`Total files modified: ${modifiedCount}`);
