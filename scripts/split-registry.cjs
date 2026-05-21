/* eslint-disable */
// scripts/split-registry.cjs
//
// Splits src/data/calculatorRegistry.ts into per-category registry files
// under src/components/calculators/<Group>/registry.ts, then rewrites the
// master registry to re-export the merged REGISTRY by importing each
// per-group array. Helper functions (getEntry, calcLink, ...) are preserved
// verbatim because they live in the postamble (after the array literal).
//
// Usage:  node scripts/split-registry.cjs
//
// Idempotent: safe to re-run. Each per-group registry.ts is fully regenerated.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const REGISTRY_PATH = path.join(ROOT, "src", "data", "calculatorRegistry.ts");
const COMPONENTS_DIR = path.join(ROOT, "src", "components", "calculators");

// 16 explicit groups + fallback "general"
const KNOWN_GROUPS = [
  "financial",
  "health",
  "cooking",
  "conversion",
  "math",
  "science",
  "time",
  "pets",
  "automotive",
  "construction",
  "electrical",
  "everyday",
  "sports",
  "funny",
  "video",
  "marketing",
];

// Group key -> on-disk folder under src/components/calculators/
const GROUP_FOLDERS = {
  financial: "Financial",
  health: "Health",
  cooking: "Cooking",
  conversion: "Conversion",
  math: "Math",
  science: "Science",
  time: "Time",
  pets: "Pets",
  automotive: "Automotive",
  construction: "Construction",
  electrical: "Electrical",
  everyday: "EverydayLife",
  sports: "Sports",
  funny: "Funny",
  video: "Video",
  marketing: "Marketing",
  general: "Misc",
};

const START_MARKER = "export const calculatorRegistry: CalculatorEntry[] = [";

// ---------------------------------------------------------------------------
// Parsing: scan the source character-by-character with awareness of strings
// (single/double/backtick) and line/block comments, so we can correctly
// locate the matching `]` for the array literal and the matching `}` for
// each top-level entry object.
// ---------------------------------------------------------------------------

function findArrayBounds(source) {
  const startIdx = source.indexOf(START_MARKER);
  if (startIdx === -1) {
    throw new Error(`Could not find marker: ${START_MARKER}`);
  }
  const arrStart = startIdx + START_MARKER.length;

  let depth = 1; // we are just inside the opening [
  let i = arrStart;
  let strQuote = null;
  let inLine = false;
  let inBlock = false;

  while (i < source.length && depth > 0) {
    const ch = source[i];
    const next = source[i + 1];

    if (inLine) {
      if (ch === "\n") inLine = false;
      i++;
      continue;
    }
    if (inBlock) {
      if (ch === "*" && next === "/") {
        inBlock = false;
        i += 2;
        continue;
      }
      i++;
      continue;
    }
    if (strQuote) {
      if (ch === "\\") {
        i += 2;
        continue;
      }
      if (ch === strQuote) strQuote = null;
      i++;
      continue;
    }
    if (ch === "/" && next === "/") {
      inLine = true;
      i += 2;
      continue;
    }
    if (ch === "/" && next === "*") {
      inBlock = true;
      i += 2;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      strQuote = ch;
      i++;
      continue;
    }
    if (ch === "[") depth++;
    else if (ch === "]") depth--;
    i++;
  }

  if (depth !== 0) throw new Error("Unbalanced brackets in registry array");
  // i is now one past the closing ']'
  const arrEnd = i - 1;
  return { startIdx, arrStart, arrEnd };
}

function extractEntries(body) {
  const entries = [];
  let j = 0;
  let strQuote = null;
  let inLine = false;
  let inBlock = false;

  while (j < body.length) {
    const ch = body[j];
    const next = body[j + 1];

    if (inLine) {
      if (ch === "\n") inLine = false;
      j++;
      continue;
    }
    if (inBlock) {
      if (ch === "*" && next === "/") {
        inBlock = false;
        j += 2;
        continue;
      }
      j++;
      continue;
    }
    if (strQuote) {
      if (ch === "\\") {
        j += 2;
        continue;
      }
      if (ch === strQuote) strQuote = null;
      j++;
      continue;
    }
    if (ch === "/" && next === "/") {
      inLine = true;
      j += 2;
      continue;
    }
    if (ch === "/" && next === "*") {
      inBlock = true;
      j += 2;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      strQuote = ch;
      j++;
      continue;
    }
    if (ch === "{") {
      const start = j;
      let d = 1;
      let k = j + 1;
      let s = null;
      let lc = false;
      let bc = false;
      while (k < body.length && d > 0) {
        const c = body[k];
        const n = body[k + 1];
        if (lc) {
          if (c === "\n") lc = false;
          k++;
          continue;
        }
        if (bc) {
          if (c === "*" && n === "/") {
            bc = false;
            k += 2;
            continue;
          }
          k++;
          continue;
        }
        if (s) {
          if (c === "\\") {
            k += 2;
            continue;
          }
          if (c === s) s = null;
          k++;
          continue;
        }
        if (c === "/" && n === "/") {
          lc = true;
          k += 2;
          continue;
        }
        if (c === "/" && n === "*") {
          bc = true;
          k += 2;
          continue;
        }
        if (c === '"' || c === "'" || c === "`") {
          s = c;
          k++;
          continue;
        }
        if (c === "{") d++;
        else if (c === "}") d--;
        k++;
      }
      if (d !== 0) throw new Error("Unbalanced braces in entry object");
      entries.push(body.slice(start, k)); // includes outer { ... }
      j = k;
      continue;
    }
    j++;
  }
  return entries;
}

function categoryOfEntry(entryText) {
  // Match the first `category: "..."` (or single quotes / backticks) at any
  // nesting; CalculatorEntry only has one category property at the top level.
  const m = entryText.match(/category\s*:\s*["'`]([^"'`]+)["'`]/);
  return m ? m[1].trim().toLowerCase() : "";
}

function groupOfCategory(category) {
  return KNOWN_GROUPS.includes(category) ? category : "general";
}

function indentLines(text, spaces) {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((ln) => (ln.length ? pad + ln : ln))
    .join("\n");
}

function buildGroupFile(groupKey, entries) {
  const varName = `${groupKey}Entries`;
  const body = entries.map((e) => indentLines(e, 2)).join(",\n");
  return `// AUTO-GENERATED by scripts/split-registry.cjs — DO NOT EDIT BY HAND.
// Per-category slice of the master CalculatorEntry registry.
// Re-run \`node scripts/split-registry.cjs\` after editing the master.

import type { CalculatorEntry } from "@/data/calculatorRegistry";

export const ${varName}: CalculatorEntry[] = [
${body}
];
`;
}

function buildNewRegistryBlock(groupKeys) {
  const imports = groupKeys
    .map((g) => {
      const folder = GROUP_FOLDERS[g];
      return `import { ${g}Entries } from "@/components/calculators/${folder}/registry";`;
    })
    .join("\n");

  const spread = groupKeys.map((g) => `  ...${g}Entries,`).join("\n");

  return `${imports}

// ====================================================================
// CALCULATOR REGISTRY
// Split into per-category files under src/components/calculators/<Group>/registry.ts.
// Edit those files (or scaffolding scripts) and re-run scripts/split-registry.cjs
// to regenerate. The merged array below is the single source of truth at runtime.
// ====================================================================
export const calculatorRegistry: CalculatorEntry[] = [
${spread}
]`;
}

function main() {
  const source = fs.readFileSync(REGISTRY_PATH, "utf8");
  const { startIdx, arrStart, arrEnd } = findArrayBounds(source);

  const preamble = source.slice(0, startIdx);
  const body = source.slice(arrStart, arrEnd);
  // postamble begins at the character right after `]` (typically `;\n...`)
  const postamble = source.slice(arrEnd + 1);

  const entries = extractEntries(body);

  const groups = {};
  const allKeys = [...KNOWN_GROUPS, "general"];
  for (const g of allKeys) groups[g] = [];

  for (const entryText of entries) {
    const cat = categoryOfEntry(entryText);
    const g = groupOfCategory(cat);
    groups[g].push(entryText.trim());
  }

  // Write per-group registry files
  for (const g of allKeys) {
    const folder = GROUP_FOLDERS[g];
    const dir = path.join(COMPONENTS_DIR, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, "registry.ts");
    const content = buildGroupFile(g, groups[g]);
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`  wrote ${path.relative(ROOT, filePath)}  (${groups[g].length} entries)`);
  }

  // Rewrite master registry: preamble + new imports/merged export + postamble
  const newBlock = buildNewRegistryBlock(allKeys);
  const newSource = preamble + newBlock + postamble;
  fs.writeFileSync(REGISTRY_PATH, newSource, "utf8");

  const total = entries.length;
  const summary = allKeys
    .map((g) => `${g}=${groups[g].length}`)
    .join(", ");
  console.log(`\nSplit ${total} entries across ${allKeys.length} groups.`);
  console.log(`Counts: ${summary}`);
  console.log(`Rewrote ${path.relative(ROOT, REGISTRY_PATH)}`);
}

main();
