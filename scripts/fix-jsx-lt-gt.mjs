/**
 * Fixes raw `<` inside JSX text content only.
 * Targets lines that contain closing JSX tags (</td>, </li>, </p>, etc.)
 * which guarantees we're looking at rendered text, not TypeScript code.
 */
import fs from "fs";
import path from "path";

const categories = process.argv.slice(2).length > 0
  ? process.argv.slice(2)
  : ["Financial"];

const ROOT = "src/components/calculators";
let totalFixed = 0;

// These closing tags indicate the line is JSX text content
const JSX_TEXT_TAGS = /<\/(td|li|p|span|h[1-6]|dt|dd|caption)>/;

function fixLine(line) {
  // Only process lines that contain a closing JSX text tag
  if (!JSX_TEXT_TAGS.test(line)) return line;

  // Fix `<` that is NOT a valid JSX tag opener (never starts with letter or /)
  // Note: `>` in JSX text needs manual fixing — auto-regex too risky (breaks </tag>)
  return line.replace(/<(\s*[0-9$%])/g, "&lt;$1");
}

for (const cat of categories) {
  const dir = path.join(ROOT, cat);
  if (!fs.existsSync(dir)) continue;

  const files = fs.readdirSync(dir).filter(f => f.endsWith(".tsx"));
  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const sep = content.includes("\r\n") ? "\r\n" : "\n";
    const lines = content.split(/\r?\n/);

    let changed = false;
    const fixed = lines.map(line => {
      const f = fixLine(line);
      if (f !== line) changed = true;
      return f;
    });

    if (changed) {
      fs.writeFileSync(filePath, fixed.join(sep), "utf8");
      console.log(`✅ ${file}`);
      totalFixed++;
    }
  }
}

console.log(`\nDone — fixed ${totalFixed} files`);
