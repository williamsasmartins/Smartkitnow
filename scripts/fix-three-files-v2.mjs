/**
 * Converts 3 special-case files to use `const editorial = (...)` pattern
 * so improve-editorial.mjs can process them.
 *
 * LoanPaymentCalculator   → has `editorial={<JSX inline>}` as a prop
 * DebtConsolidationCalculator  → editorial is inline in JSX, no prop
 * HouseAffordabilityCalculator → editorial is inline in JSX, no prop
 */
import fs from "fs";

// ── helpers ────────────────────────────────────────────────────────────────────

/** Find the matching closing brace/bracket/paren for the opener at position `openerIdx` */
function findMatchingClose(content, openerIdx, open, close) {
  let depth = 0;
  let inStr = false, strChar = "";
  for (let i = openerIdx; i < content.length; i++) {
    const ch = content[i];
    const prev = i > 0 ? content[i - 1] : "";
    if (!inStr && (ch === '"' || ch === "`")) { inStr = true; strChar = ch; }
    else if (inStr && ch === strChar && prev !== "\\") { inStr = false; }
    else if (!inStr) {
      if (ch === open) depth++;
      else if (ch === close) {
        depth--;
        if (depth === 0) return i;
      }
    }
  }
  return -1;
}

// ── 1. LoanPaymentCalculator ───────────────────────────────────────────────────
(function fixLoan() {
  const filePath = "src/components/calculators/Financial/LoanPaymentCalculator.tsx";
  let content = fs.readFileSync(filePath, "utf8");

  if (content.includes("const editorial = (")) {
    console.log("ℹ️  LoanPaymentCalculator already has const editorial");
    return;
  }

  // Find `editorial={`
  const propMarker = "      editorial={";
  const propStart = content.indexOf(propMarker);
  if (propStart === -1) { console.error("❌ LoanPayment: editorial={ not found"); return; }

  // The `{` is at propStart + propMarker.length - 1
  const braceIdx = propStart + propMarker.length - 1;
  const closeBrace = findMatchingClose(content, braceIdx, "{", "}");
  if (closeBrace === -1) { console.error("❌ LoanPayment: matching } not found"); return; }

  // Everything between `editorial={` and `}` (exclusive) is the old editorial JSX
  // We want to:
  // 1. Extract it as a const variable
  // 2. Replace `editorial={<JSX>}` with `editorial={editorial}`

  const oldJsx = content.slice(braceIdx + 1, closeBrace).trim();

  // Insert `const editorial = (\n  <old JSX>\n);\n\n` before the `return (`
  const returnIdx = content.lastIndexOf("  return (");
  if (returnIdx === -1) { console.error("❌ LoanPayment: return ( not found"); return; }

  const editorialVar = `  const editorial = (\n    ${oldJsx.replace(/\n/g, "\n  ")}\n  );\n\n`;

  // Build new content: before return + var + return + (replace prop)
  let newContent = content.slice(0, returnIdx) + editorialVar + content.slice(returnIdx);

  // Now replace `editorial={<oldJsx>}` with `editorial={editorial}` in new content
  // The prop is now at a shifted position — search for it
  const newPropStart = newContent.indexOf(propMarker);
  const newBraceIdx = newPropStart + propMarker.length - 1;
  const newCloseBrace = findMatchingClose(newContent, newBraceIdx, "{", "}");
  newContent = newContent.slice(0, newPropStart) + "      editorial={editorial}" + newContent.slice(newCloseBrace + 1);

  fs.writeFileSync(filePath, newContent, "utf8");
  console.log("✅ LoanPaymentCalculator: converted to const editorial pattern");
})();

// ── 2. DebtConsolidationCalculator ───────────────────────────────────────────
(function fixDebt() {
  const filePath = "src/components/calculators/Financial/DebtConsolidationCalculator.tsx";
  let content = fs.readFileSync(filePath, "utf8");

  if (content.includes("const editorial = (")) {
    console.log("ℹ️  DebtConsolidationCalculator already has const editorial");
    return;
  }

  // The editorial is inline: <section id="editorial" ...>...</section>
  // Find it and extract it
  const sectionMarker = '      <section id="editorial"';
  const sectionAlt = "      <section id='editorial'";
  let sectionStart = content.indexOf(sectionMarker);
  if (sectionStart === -1) sectionStart = content.indexOf(sectionAlt);
  if (sectionStart === -1) { console.error("❌ Debt: section#editorial not found"); return; }

  // Find closing </section> at the same nesting level
  // Count <section and </section>
  let depth = 0;
  let i = sectionStart;
  let sectionEnd = -1;
  while (i < content.length) {
    if (content.slice(i, i + 8) === "<section") depth++;
    else if (content.slice(i, i + 9) === "</section") {
      depth--;
      if (depth === 0) {
        // Find end of this closing tag
        const closeTag = content.indexOf(">", i);
        sectionEnd = closeTag + 1;
        break;
      }
    }
    i++;
  }

  if (sectionEnd === -1) { console.error("❌ Debt: matching </section> not found"); return; }

  const oldSection = content.slice(sectionStart, sectionEnd);

  // Build const editorial = (...) wrapping the old section
  const editorialVar = `  const editorial = (\n    <div className="space-y-12">\n${oldSection}\n    </div>\n  );\n\n`;

  // Insert before `return (`
  const returnIdx = content.lastIndexOf("  return (");
  if (returnIdx === -1) { console.error("❌ Debt: return ( not found"); return; }

  let newContent = content.slice(0, returnIdx) + editorialVar + content.slice(returnIdx);

  // Replace the inline section with `{editorial}` in the JSX
  newContent = newContent.replace(oldSection, "      {editorial}");

  // Also add editorial={editorial} to CalculatorVerticalLayout if not already there
  // Find the layout and add prop
  const layoutOpen = "<CalculatorVerticalLayout";
  const layoutIdx = newContent.indexOf(layoutOpen);
  if (layoutIdx !== -1) {
    // Insert editorial={editorial} after the opening tag's first prop
    const firstPropEnd = newContent.indexOf("\n", layoutIdx);
    if (!newContent.includes("editorial={editorial}")) {
      // Find a good insertion point: after `description="..."`
      const descEnd = newContent.indexOf("\n", newContent.indexOf('description="', layoutIdx));
      if (descEnd !== -1) {
        newContent = newContent.slice(0, descEnd + 1) + "      editorial={editorial}\n" + newContent.slice(descEnd + 1);
      }
    }
  }

  fs.writeFileSync(filePath, newContent, "utf8");
  console.log("✅ DebtConsolidationCalculator: converted to const editorial pattern");
})();

// ── 3. HouseAffordabilityCalculator ──────────────────────────────────────────
(function fixHouse() {
  const filePath = "src/components/calculators/Financial/HouseAffordabilityCalculator.tsx";
  let content = fs.readFileSync(filePath, "utf8");

  if (content.includes("const editorial = (")) {
    console.log("ℹ️  HouseAffordabilityCalculator already has const editorial");
    return;
  }

  // Same structure as Debt — section id="editorial" inline
  const sectionMarker = '      <section id="editorial"';
  let sectionStart = content.indexOf(sectionMarker);
  if (sectionStart === -1) { console.error("❌ House: section#editorial not found"); return; }

  let depth = 0;
  let i = sectionStart;
  let sectionEnd = -1;
  while (i < content.length) {
    if (content.slice(i, i + 8) === "<section") depth++;
    else if (content.slice(i, i + 9) === "</section") {
      depth--;
      if (depth === 0) {
        const closeTag = content.indexOf(">", i);
        sectionEnd = closeTag + 1;
        break;
      }
    }
    i++;
  }

  if (sectionEnd === -1) { console.error("❌ House: matching </section> not found"); return; }

  const oldSection = content.slice(sectionStart, sectionEnd);
  const editorialVar = `  const editorial = (\n    <div className="space-y-12">\n${oldSection}\n    </div>\n  );\n\n`;

  const returnIdx = content.lastIndexOf("  return (");
  if (returnIdx === -1) { console.error("❌ House: return ( not found"); return; }

  let newContent = content.slice(0, returnIdx) + editorialVar + content.slice(returnIdx);
  newContent = newContent.replace(oldSection, "      {editorial}");

  if (!newContent.includes("editorial={editorial}")) {
    const descEnd = newContent.indexOf("\n", newContent.indexOf('description="', newContent.indexOf("<CalculatorVerticalLayout")));
    if (descEnd !== -1) {
      newContent = newContent.slice(0, descEnd + 1) + "      editorial={editorial}\n" + newContent.slice(descEnd + 1);
    }
  }

  fs.writeFileSync(filePath, newContent, "utf8");
  console.log("✅ HouseAffordabilityCalculator: converted to const editorial pattern");
})();

console.log("\nDone. Now run: node scripts/improve-editorial.mjs --category=Financial");
