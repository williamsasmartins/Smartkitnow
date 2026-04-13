import fs from "fs";

const filePath = "src/components/calculators/Financial/LoanPaymentCalculator.tsx";
let content = fs.readFileSync(filePath, "utf8");

// Find _removed={  and the matching closing } at prop level
const markerStart = content.indexOf("      _removed={");
if (markerStart === -1) {
  console.log("_removed not found — nothing to do");
  process.exit(0);
}

// Start counting from the `{` in `_removed={`
const braceStart = content.indexOf("{", markerStart + "      _removed=".length);
let depth = 0;
let i = braceStart;
let inStr = false, strChar = "";

while (i < content.length) {
  const ch = content[i];
  const prev = i > 0 ? content[i - 1] : "";
  if (!inStr && (ch === '"' || ch === "`")) { inStr = true; strChar = ch; }
  else if (inStr && ch === strChar && prev !== "\\") { inStr = false; }
  else if (!inStr) {
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) break;
    }
  }
  i++;
}

if (i >= content.length) {
  console.error("Could not find closing } for _removed prop");
  process.exit(1);
}

// i is now the index of the closing }
// Remove from markerStart up to and including the closing }
// Also remove the trailing newline
const removeEnd = i + 1;
const removedBlock = content.slice(markerStart, removeEnd);
console.log(`Removing block (${removedBlock.length} chars) from offset ${markerStart} to ${removeEnd}`);
console.log("Block start:", JSON.stringify(removedBlock.slice(0, 40)));
console.log("Block end:", JSON.stringify(removedBlock.slice(-40)));

content = content.slice(0, markerStart) + content.slice(removeEnd);

// Now also fix the dangling `</section>\n    />` issue if the previous edit broke the file
// Check if the layout closes correctly: should end with `    />\n  );\n}\n`
const lastPart = content.slice(-100);
console.log("\nFile end (last 100 chars):", JSON.stringify(lastPart));

fs.writeFileSync(filePath, content, "utf8");
console.log("\n✅ Done");
