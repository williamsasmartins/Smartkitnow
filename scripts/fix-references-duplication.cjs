const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/components/calculators/Science');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let fixedCount = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix duplicated onThisPage entry
    const dupRegex = /\{\s*id:\s*"references",\s*label:\s*"References & Resources"\s*\}\s*,\s*,?\s*\{\s*id:\s*"references",\s*label:\s*"References & Resources"\s*\}/;
    
    if (dupRegex.test(content)) {
        content = content.replace(dupRegex, '{ id: "references", label: "References & Resources" }');
        
        // Fix potential double comma and newlines
        // The previous script might have left something like:
        // { ... "FAQ" },
        // { ... "References" },,
        // { ... "References" }
        
        // Let's just remove all occurrences and add one back properly? 
        // No, regex replacement is safer if I can match the specific duplication pattern.
        
        // Let's check for specific double comma pattern
        content = content.replace(/,\s*,\s*/g, ',\n        ');
        
        fs.writeFileSync(filePath, content);
        console.log(`Fixed duplication in ${file}`);
        fixedCount++;
    } else {
        // Check for other variation of duplication
        const occurrences = (content.match(/id:\s*"references"/g) || []).length;
        if (occurrences > 1) {
             console.log(`Still has duplicates in ${file} (count: ${occurrences})`);
             // Manual fix or aggressive regex
             // Remove all references entries and add one back
             content = content.replace(/,\s*\{\s*id:\s*"references",\s*label:\s*"References & Resources"\s*\}/g, '');
             // Now add it back once
             content = content.replace(/(label:\s*"FAQ"[^}]+})/, '$1,\n        { id: "references", label: "References & Resources" }');
             fs.writeFileSync(filePath, content);
             console.log(`Fixed duplication (aggressive) in ${file}`);
             fixedCount++;
        }
    }
});

console.log(`Total files fixed: ${fixedCount}`);
