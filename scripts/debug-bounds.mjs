import fs from "fs";

const content = fs.readFileSync(
  "src/components/calculators/Financial/AprCalculator.tsx",
  "utf8"
);

function findFaqsBounds(content) {
  const idx = content.search(/const faqs\s*=\s*\[/);
  if (idx === -1) return null;
  let depth = 0;
  let i = idx;
  while (i < content.length && content[i] !== "[") i++;
  let inString = false, stringChar = "";
  while (i < content.length) {
    const ch = content[i];
    const prev = i > 0 ? content[i - 1] : "";
    if (!inString && (ch === '"' || ch === "'" || ch === "`")) {
      inString = true; stringChar = ch;
    } else if (inString && ch === stringChar && prev !== "\\") {
      inString = false;
    } else if (!inString) {
      if (ch === "[") depth++;
      else if (ch === "]") {
        depth--;
        if (depth === 0) {
          let end = i + 1;
          while (end < content.length && content[end] === ";") end++;
          return { start: idx, end };
        }
      }
    }
    i++;
  }
  return null;
}

function findEditorialBounds(content) {
  const start = content.indexOf("const editorial = (");
  if (start === -1) return null;
  let depth = 0;
  let i = start + "const editorial = ".length;
  // Only track " and ` — NOT ' because JSX text has apostrophes
  let inString = false, stringChar = "";
  while (i < content.length) {
    const ch = content[i];
    const prev = i > 0 ? content[i - 1] : "";
    if (!inString && (ch === '"' || ch === "`")) {
      inString = true; stringChar = ch;
    } else if (inString && ch === stringChar && prev !== "\\") {
      inString = false;
    } else if (!inString) {
      if (ch === "(") depth++;
      else if (ch === ")") {
        depth--;
        if (depth === 0) return { start, end: i + 1 };
      }
    }
    i++;
  }
  return null;
}

const faqsBounds = findFaqsBounds(content);
console.log("faqsBounds:", faqsBounds);
if (faqsBounds) {
  console.log("around faqsBounds.end:", JSON.stringify(content.slice(faqsBounds.end - 10, faqsBounds.end + 40)));
  const updated = content.slice(0, faqsBounds.start) + "FAQS_REPLACED" + content.slice(faqsBounds.end);
  const editorialIdx = updated.indexOf("const editorial = (");
  console.log("editorial in updated:", editorialIdx);
  if (editorialIdx !== -1) {
    const editorialBounds = findEditorialBounds(updated);
    console.log("editorialBounds:", editorialBounds);

    // Debug: trace depth and string state - report every string open/close
    const start = editorialIdx;
    let depth = 0;
    let i = start + "const editorial = ".length;
    let inString = false, stringChar = "";
    let stringLog = [];
    while (i < updated.length) {
      const ch = updated[i];
      const prev = i > 0 ? updated[i - 1] : "";
      if (!inString && (ch === '"' || ch === "'" || ch === "`")) {
        inString = true; stringChar = ch;
        stringLog.push({ type: "open", char: ch, offset: i, ctx: updated.slice(Math.max(0,i-15), i+15) });
      } else if (inString && ch === stringChar && prev !== "\\") {
        inString = false;
        stringLog.push({ type: "close", char: ch, offset: i });
      } else if (!inString) {
        if (ch === "(") depth++;
        else if (ch === ")") {
          depth--;
          if (depth === 0) {
            console.log("depth=0 at offset", i, "relative to editorial:", i - start);
            console.log("context:", JSON.stringify(updated.slice(i - 30, i + 30)));
            break;
          }
          if (depth < 0) {
            console.log("NEGATIVE depth at offset", i, "context:", JSON.stringify(updated.slice(i-30, i+30)));
            // show last 3 strings opened
            console.log("Last string events:", JSON.stringify(stringLog.slice(-6)));
            break;
          }
        }
      }
      i++;
    }
    if (i >= updated.length) {
      console.log("reached end of file without closing paren, depth=", depth);
      console.log("Last string events:", JSON.stringify(stringLog.slice(-10)));
    }
  }
} else {
  console.log("faqsBounds is null — checking editorial on original:");
  const eb = findEditorialBounds(content);
  console.log("editorialBounds on original:", eb);
}
