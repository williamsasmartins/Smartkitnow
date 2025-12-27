/* scripts/scaffold-missing.ts
 * Scaffolds TSX stubs for every calculator loader path in REGISTRY.
 * - Creates directories as needed
 * - Writes a minimal default-exported component if file doesn't exist
 * - Safe to re-run (skips existing files)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Import REGISTRY from your project using an absolute URL so ESM can resolve.
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.resolve(projectRoot, "src", "data", "calculatorRegistry.ts");

// Dynamically import TypeScript using tsx at runtime.
// Align registry entry shape with your calculatorRegistry.ts (title instead of name).

type Entry = {
  title: string;
  category: string;
  subcategory: string;
  slug: string;
  loader: () => Promise<any>;
};

const REGISTRY: Entry[] = (await import(pathToFileURL(registryPath).href) as any).REGISTRY;

const COMPONENTS_ROOT = path.resolve(projectRoot, "src", "components", "calculators");

// Extract the import path strings from loader.toString()
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function extractImportPathFromLoader(fn: Function): string | null {
  const s = fn.toString();
  // Matches: () => import("...") or () => import('...')
  const m = s.match(/import\((["]|'|`)(.+?)\1\)/);
  return m ? m[2] : null;
}

// Very small, branded stub (default export!) that your checker will accept
function makeStubComponent(name: string, category: string, subcategory: string, slug: string) {
  const compName = toValidId(name || slug);
  const safeTitle = escapeHtml(name || slug);
  const safeCat = escapeHtml(category);
  const safeSub = escapeHtml(subcategory);
  const safeSlug = escapeHtml(slug);
  return `import React from "react";

export default function ${compName}() {
  return (
    <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
      <h1 className="mb-2">${safeTitle}</h1>
      <p className="text-sm opacity-80">Category: ${safeCat} · Subcategory: ${safeSub}</p>

      <div className="mt-6 p-4 border rounded-xl">
        <h2>Calculator UI</h2>
        <p>This is a scaffold stub for <code>${safeSlug}</code>. Replace with your real UI.</p>
        <form className="mt-4 grid gap-3">
          <label className="block">
            <span className="text-sm font-medium">Example input</span>
            <input className="mt-1 w-full border rounded-md px-3 py-2" placeholder="Enter a value..." />
          </label>
          <button type="button" className="px-3 py-2 rounded-md border">Compute</button>
        </form>
      </div>

      <div className="mt-8">
        <h3>Formula</h3>
        <pre><code>// TODO: document the formula used here.</code></pre>
      </div>

      <div className="mt-8">
        <h3>Examples</h3>
        <ul>
          <li>Example A — replace with a real example.</li>
          <li>Example B — replace with a real example.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h3>References</h3>
        <ul>
          <li>Add authoritative sources here.</li>
        </ul>
      </div>
    </div>
  );
}
`; // end return string
}

// Simple identifier generator from name
function toValidId(name: string) {
  return String(name || "CalculatorStub")
    .replace(/[^a-zA-Z0-9]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function escapeHtml(s: string) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const created: string[] = [];
const skipped: string[] = [];
const missingPaths: string[] = [];

for (const entry of REGISTRY) {
  const importPath = extractImportPathFromLoader(entry.loader);
  if (!importPath) {
    missingPaths.push(`${entry.title || entry.slug} :: NO_IMPORT_PATH`);
    continue;
  }

  // Convert "@/components/..." to disk path
  let rel = importPath;
  if (rel.startsWith("@/")) rel = rel.replace(/^@\//, "src/");

  // Ensure extension .tsx
  const absPath = path.resolve(projectRoot, rel + (rel.endsWith(".tsx") || rel.endsWith(".ts") ? "" : ".tsx"));
  const dir = path.dirname(absPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(absPath)) {
    skipped.push(path.relative(projectRoot, absPath));
  } else {
    fs.writeFileSync(
      absPath,
      makeStubComponent(entry.title || entry.slug, entry.category, entry.subcategory, entry.slug),
      "utf8"
    );
    created.push(path.relative(projectRoot, absPath));
  }
}

console.log("Scaffold complete.");
console.log("Created:", created.length);
if (created.length) {
  for (const c of created) console.log(" +", c);
}
console.log("Skipped (already existed):", skipped.length);
if (skipped.length) {
  for (const s of skipped) console.log(" =", s);
}
if (missingPaths.length) {
  console.log("Missing loader import specs:", missingPaths.length);
  for (const m of missingPaths) console.log(" !", m);
}