// scripts/verify-registry.mjs
import { readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { expectedAll } from "./expected-pets.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const registryFiles = [resolve(__dirname, "../src/data/calculatorRegistry.ts")];

const calcDir = resolve(__dirname, "../src/components/calculators");
try {
  for (const cat of readdirSync(calcDir, { withFileTypes: true })) {
    if (!cat.isDirectory()) continue;
    const subReg = resolve(calcDir, cat.name, "registry.ts");
    try { readFileSync(subReg); registryFiles.push(subReg); } catch (e) {}
  }
} catch (e) {}

const foundSlugs = new Set();
for (const filePath of registryFiles) {
  let text;
  try { text = readFileSync(filePath, "utf-8"); } catch (e) { continue; }
  const re = /slug\s*:\s*["'`]([^"'`]+)["'`]/g;
  let m;
  while ((m = re.exec(text))) foundSlugs.add(m[1]);
}

const expectedSlugs = expectedAll.map((e) => e.slug);
const missing = expectedSlugs.filter((s) => !foundSlugs.has(s));

console.log("=== Registry check ===");
console.log("Total in registry: " + foundSlugs.size);
console.log("Expected total:    " + expectedSlugs.length);

if (missing.length > 0) {
  console.log("Missing: " + missing.length);
  missing.forEach((s) => console.log("  - " + s));
  process.exit(1);
}

console.log("Registry OK.");
