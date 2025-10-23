// scripts/verify-registry.ts
// Este script carrega o REGISTRY real, compara com a lista esperada,
// e mostra: faltando, extras e um PATCH pronto para colar.

import path from "path";
import { fileURLToPath } from "url";
import { expectedAll } from "./expected-pets.ts";
import { readFileSync } from "fs";

// Ajuste o caminho se seu projeto não usar ts-node/ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const registryPath = path.resolve(projectRoot, "src/data/calculatorRegistry.ts");

// Leitura ingênua do arquivo (sem executar) só para extrair slugs existentes
const registryText = readFileSync(registryPath, "utf-8");

// Match simples por `slug: "..."` dentro de objetos
const slugRegex = /slug\s*:\s*["'`]([^"'`]+)["'`]/g;
const foundSlugs = new Set<string>();
let m: RegExpExecArray | null;
while ((m = slugRegex.exec(registryText))) {
  foundSlugs.add(m[1]);
}

// Compare
const expectedSlugs = expectedAll.map((e) => e.slug);
const missing = expectedSlugs.filter((s) => !foundSlugs.has(s));
const extras = [...foundSlugs].filter((s) => !expectedSlugs.includes(s)); // pode existir e não ser problema

// Sugere patch para os que faltam
function patchFor(slug: string) {
  const e = expectedAll.find((x) => x.slug === slug)!;
  const loader = e.loaderHint
    ? `() => import("${e.loaderHint}")`
    : "() => Promise.reject(new Error(\"TODO: add loader\"))";
  return `{
  slug: "${e.slug}",
  category: "pets",
  subcategory: "${e.subcategory}",
  title: "${e.title}",
  description: "",
  loader: ${loader},
  aliases: [],
},`;
}

console.log("=== Registry check (src/data/calculatorRegistry.ts) ===");
console.log(`Total in registry: ${foundSlugs.size}`);
console.log(`Expected total:    ${expectedSlugs.length}\n`);

if (missing.length === 0) {
  console.log("✅ No missing calculators.");
} else {
  console.log("❌ Missing calculators:", missing.length);
  console.log(missing.join(", "));
  console.log("\n--- PATCH TO ADD (paste into REGISTRY array) ---");
  console.log(missing.map(patchFor).join("\n"));
}

if (extras.length > 0) {
  console.log("\nℹ️ Extras present in registry (not in expected list):");
  console.log(extras.join(", "));
}

console.log("\nTip: ensure routes are short /pets/<slug> via your Router and aliases if needed.");