/**
 * One-time script to normalize the 3 files that don't use const editorial = (...)
 * Converts them to the standard pattern so improve-editorial.mjs can process them.
 */
import fs from "fs";

// ── 1. LoanPaymentCalculator: remove _removed={...} prop (was old inline editorial) ──
const loanPath = "src/components/calculators/Financial/LoanPaymentCalculator.tsx";
let loanContent = fs.readFileSync(loanPath, "utf8");

// Find "_removed={" and the matching closing "}" at prop level
const removeStart = loanContent.indexOf("      _removed={");
if (removeStart !== -1) {
  // Find the matching } — it's the "}" followed by "\n    />"
  // We'll just find "      }" followed by "\n    />"
  const tail = "\n      }\n    />";
  const tailIdx = loanContent.indexOf(tail, removeStart);
  if (tailIdx !== -1) {
    loanContent =
      loanContent.slice(0, removeStart) +
      "\n    />" +
      loanContent.slice(tailIdx + tail.length);
    fs.writeFileSync(loanPath, loanContent, "utf8");
    console.log("✅ LoanPaymentCalculator: removed _removed prop");
  } else {
    console.log("⚠️  LoanPaymentCalculator: could not find tail of _removed prop");
  }
} else {
  console.log("ℹ️  LoanPaymentCalculator: _removed prop not found (already cleaned?)");
}

// ── 2. DebtConsolidationCalculator: add const editorial = (<div/>) before return ──
function addEditorialVar(filePath, layoutTitle) {
  let content = fs.readFileSync(filePath, "utf8");

  if (content.includes("const editorial = (")) {
    console.log(`ℹ️  ${filePath}: already has const editorial`);
    return;
  }

  // Insert placeholder before "  return ("
  const returnIdx = content.lastIndexOf("  return (");
  if (returnIdx === -1) {
    console.log(`⚠️  ${filePath}: could not find return (`);
    return;
  }

  const placeholder = `  const editorial = (\n    <div className="space-y-12" />\n  );\n\n`;
  content = content.slice(0, returnIdx) + placeholder + content.slice(returnIdx);

  // The editorial content is inline — the layout doesn't have an editorial prop yet.
  // Add editorial={editorial} to CalculatorVerticalLayout.
  // Find the layout opening and add the prop.
  const layoutOpen = `<CalculatorVerticalLayout \n      title="${layoutTitle}"`;
  const newLayoutOpen = `<CalculatorVerticalLayout \n      title="${layoutTitle}"\n      editorial={editorial}`;
  if (content.includes(layoutOpen)) {
    content = content.replace(layoutOpen, newLayoutOpen);
    console.log(`✅ ${filePath}: added editorial prop`);
  } else {
    console.log(`⚠️  ${filePath}: could not find CalculatorVerticalLayout opening`);
  }

  fs.writeFileSync(filePath, content, "utf8");
}

addEditorialVar(
  "src/components/calculators/Financial/DebtConsolidationCalculator.tsx",
  "Debt Consolidation Calculator"
);
addEditorialVar(
  "src/components/calculators/Financial/HouseAffordabilityCalculator.tsx",
  "House Affordability Calculator"
);

console.log("\nDone. Now run: node scripts/improve-editorial.mjs --category=Financial");
