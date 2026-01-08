import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { REGISTRY } from "../src/data/calculatorRegistry.ts";

const __DIR = path.dirname(fileURLToPath(import.meta.url));

function resolveFromLoader(e: any): string | null {
  const src = (e.loader as any)?.toString?.() || "";
  const m = src.match(/import\(\s*['"]([^'"]+)['"]\s*\)/);
  const spec = m?.[1];
  if (!spec) return null;
  if (spec.startsWith("@/")) {
    const rel = spec.slice(2);
    if (rel.endsWith(".tsx") || rel.endsWith(".ts")) {
      const direct = path.resolve(__DIR, "../src", rel);
      if (fs.existsSync(direct)) return direct;
    }
    const tsx = path.resolve(__DIR, "../src", rel + ".tsx");
    const ts = path.resolve(__DIR, "../src", rel + ".ts");
    if (fs.existsSync(tsx)) return tsx;
    if (fs.existsSync(ts)) return ts;
    return tsx; // default guess
  }
  const abs = path.resolve(__DIR, spec);
  return abs;
}

const DEFAULT_EXPORT_RE = new RegExp(
  '(export\\s+default\\s+)|(export\\s*\\{\\s*default\\s*\\}\\s*from\\s*["\']([^"\']+)["\'])',
  'm'
);

const run = async () => {
  let failed = 0;
  for (const e of REGISTRY) {
    try {
      const abs = resolveFromLoader(e);
      if (!abs) throw new Error("Cannot extract import specifier from loader");
      const code = fs.readFileSync(abs, "utf8");
      const ok = DEFAULT_EXPORT_RE.test(code);
      if (!ok) {
        failed++;
        console.error("❌ No default export:", `${e.category}/${e.subcategory}/${e.slug}`);
      } else {
        console.log("✅ OK:", `${e.category}/${e.subcategory}/${e.slug}`);
      }
    } catch (err: any) {
      failed++;
      console.error(
        "❌ Import error:",
        `${e.category}/${e.subcategory}/${e.slug}`,
        "-",
        err?.message || String(err)
      );
    }
  }
  if (failed) process.exit(1);
};

run();
