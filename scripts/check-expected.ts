// scripts/check-expected.ts
// Compare expected pets entries against src/data/calculatorRegistry.ts

import type { CalculatorEntry } from "../src/data/calculatorRegistry.ts";
import { REGISTRY } from "../src/data/calculatorRegistry.ts";
import { expectedAll, type ExpectedEntry } from "./expected-pets.ts";

function normalize(v?: string) {
  return String(v ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]/g, "");
}

function extractLoaderSpec(e: CalculatorEntry): string | null {
  const src = (e.loader as any)?.toString?.() || "";
  const m = src.match(/import\(\s*['"]([^'\"]+)['"]\s*\)/);
  return m?.[1] ?? null;
}

function sameLoaderHint(actualSpec?: string | null, hint?: string): boolean {
  if (!actualSpec || !hint) return false;
  const a = actualSpec.replace(/\.(tsx|ts|js|jsx)$/i, "");
  const b = hint.replace(/\.(tsx|ts|js|jsx)$/i, "");
  return normalize(a) === normalize(b);
}

async function run() {
  const bySlug = new Map<string, CalculatorEntry>();
  for (const e of REGISTRY) {
    bySlug.set(normalize(e.slug), e);
  }

  const missing: ExpectedEntry[] = [];
  const titleMismatch: Array<{ expected: ExpectedEntry; actual: CalculatorEntry }> = [];
  const categoryMismatch: Array<{ expected: ExpectedEntry; actual: CalculatorEntry }> = [];
  const subcategoryMismatch: Array<{ expected: ExpectedEntry; actual: CalculatorEntry }> = [];
  const loaderMismatch: Array<{ expected: ExpectedEntry; actualSpec: string | null }> = [];

  for (const exp of expectedAll) {
    const key = normalize(exp.slug);
    const actual = bySlug.get(key);
    if (!actual) {
      missing.push(exp);
      continue;
    }
    if (normalize(actual.title) !== normalize(exp.title)) {
      titleMismatch.push({ expected: exp, actual });
    }
    if (normalize(actual.category) !== normalize(exp.category)) {
      categoryMismatch.push({ expected: exp, actual });
    }
    if (normalize(actual.subcategory) !== normalize(exp.subcategory)) {
      subcategoryMismatch.push({ expected: exp, actual });
    }
    const spec = extractLoaderSpec(actual);
    if (exp.loaderHint && !sameLoaderHint(spec, exp.loaderHint)) {
      loaderMismatch.push({ expected: exp, actualSpec: spec });
    }
  }

  const expectedSlugs = new Set(expectedAll.map((e) => normalize(e.slug)));
  const extras: CalculatorEntry[] = REGISTRY.filter(
    (e) => normalize(e.category) === "pets" && !expectedSlugs.has(normalize(e.slug))
  );

  let failures = 0;

  if (missing.length) {
    failures += missing.length;
    console.error("\n❌ Missing in registry (", missing.length, "):");
    for (const m of missing) {
      console.error(" -", `${m.category}/${m.subcategory}/${m.slug}`);
    }
  }

  if (titleMismatch.length) {
    failures += titleMismatch.length;
    console.error("\n⚠️ Title mismatches (", titleMismatch.length, "):");
    for (const { expected, actual } of titleMismatch) {
      console.error(
        " -",
        `${expected.category}/${expected.subcategory}/${expected.slug}`,
        "=> expected:", expected.title,
        "| actual:", actual.title
      );
    }
  }

  if (categoryMismatch.length) {
    failures += categoryMismatch.length;
    console.error("\n⚠️ Category mismatches (", categoryMismatch.length, "):");
    for (const { expected, actual } of categoryMismatch) {
      console.error(
        " -",
        `${expected.slug}`,
        "=> expected:", expected.category,
        "| actual:", actual.category
      );
    }
  }

  if (subcategoryMismatch.length) {
    failures += subcategoryMismatch.length;
    console.error("\n⚠️ Subcategory mismatches (", subcategoryMismatch.length, "):");
    for (const { expected, actual } of subcategoryMismatch) {
      console.error(
        " -",
        `${expected.slug}`,
        "=> expected:", expected.subcategory,
        "| actual:", actual.subcategory
      );
    }
  }

  if (loaderMismatch.length) {
    failures += loaderMismatch.length;
    console.error("\n⚠️ Loader spec mismatches (", loaderMismatch.length, "):");
    for (const { expected, actualSpec } of loaderMismatch) {
      console.error(
        " -",
        `${expected.slug}`,
        "=> expected:", expected.loaderHint,
        "| actual:", actualSpec ?? "<none>"
      );
    }
  }

  if (extras.length) {
    console.log("\nℹ️ Extras in registry not in expected list (", extras.length, "):");
    for (const e of extras) {
      console.log(" -", `${e.category}/${e.subcategory}/${e.slug}`);
    }
  }

  if (!failures) {
    console.log("\n✅ All expected entries match the registry.");
  } else {
    console.error("\nSummary:", {
      missing: missing.length,
      titleMismatch: titleMismatch.length,
      categoryMismatch: categoryMismatch.length,
      subcategoryMismatch: subcategoryMismatch.length,
      loaderMismatch: loaderMismatch.length,
      extras: extras.length,
    });
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Unexpected error:", err?.message || String(err));
  process.exit(1);
});