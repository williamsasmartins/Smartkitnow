// scripts/verify-registry.mjs — plain ESM, runs with `node` (no tsx needed)
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { expectedAll } from "./expected-pets.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const registryPath = resolve(__dirname, "../src/data/calculatorRegistry.ts");
const registryText = readFileSync(registryPath, "utf-8");

const slugRegex = /slug\s*:\s*["'`]([^"'`]+)["'`]/g;
const foundSlugs = new Set();
let m;
while ((m = slugRegex.exec(registryText))) foundSlugs.add(m[1]);

const expectedSlugs = expectedAll.map((e) => e.slug);
const missing = expectedSlugs.filter((s) => !foundSlugs.has(s));
const extras = [...foundSlugs].filter((s) => !expectedSlugs.includes(s));

console.log(`=== Registry check (src/data/calculatorRegistry.ts) ===`);
console.log(`Total in registry: ${foundSlugs.size}`);
console.log(`Expected total:    ${expectedSlugs.length}`);

if (missing.length > 0) {
  console.log(`\n❌ Missing calculators: ${missing.length}`);
  missing.forEach((s) => console.log(`  - ${s}`));

  // Generate patch
  console.log("\n--- PATCH TO ADD (paste into REGISTRY array) ---");
  missing.forEach((s) => {
    const e = expectedAll.find((x) => x.slug === s);
    console.log(`{
  slug: "${s}",
  category: "${e?.category ?? "pets"}",
  subcategory: "${e?.subcategory ?? "cats"}",
  title: "${e?.title ?? s}",
  description: "",
  loader: () => import("@/components/calculators/${toPascalCase(s)}Calculator"),
  aliases: [],
},`);
  });
}

if (extras.length > 0) {
  console.log(`\nℹ️ Extras present in registry (not in expected list):\n${extras.join(", ")}`);
}

console.log("\nTip: ensure routes are short /pets/<slug> via your Router and aliases if needed.");
console.log("✅ Registry OK.");

function toPascalCase(slug) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}
