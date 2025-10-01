// scripts/validate-registry.ts
// Executa: npm run validate:registry  (usa tsx)

import { existsSync, writeFileSync } from "fs";
import path from "path";

// Importa o registry via caminho relativo (sem alias e sem extensão)
import { REGISTRY, type CalcEntry } from "../src/data/calculatorRegistry";

// Converte "@/..." para caminho físico dentro de src/
function resolveFromAlias(p: string): string | undefined {
  if (!p?.startsWith("@/")) return undefined;
  const rel = p.replace(/^@\//, "src/");
  return path.resolve(process.cwd(), rel);
}

// Tenta extrair "import('...')" do loader
function getImportPathFromLoader(loader: CalcEntry["loader"]): string | undefined {
  try {
    const s = loader.toString();
    const m = s.match(/import\((['"`])(.+?)\1\)/);
    return m ? m[2] : undefined;
  } catch {
    return undefined;
  }
}

// Dado um caminho base sem extensão (ex.: /src/components/calculators/ConcreteSlab)
// verifica se existe algum arquivo correspondente (.tsx, .ts, /index.tsx, /index.ts)
function resolveExistingFile(absNoExt: string): { found?: string; exists: boolean } {
  const candidates = [
    `${absNoExt}.tsx`,
    `${absNoExt}.ts`,
    path.join(absNoExt, "index.tsx"),
    path.join(absNoExt, "index.ts"),
  ];
  for (const c of candidates) {
    if (existsSync(c)) return { found: c, exists: true };
  }
  return { exists: false };
}

type Row = {
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  alias?: string;
  importPath?: string;
  resolvedBase?: string; // caminho sem extensão
  resolvedFile?: string; // arquivo existente encontrado
  exists?: boolean;
  duplicateSlug?: boolean;
  duplicateAlias?: boolean;
  mismatchPath?: boolean;
};

(async function main() {
  const bySlug = new Map<string, number>();
  const aliasSet = new Set<string>();

  const rows: Row[] = [];

  for (const entry of REGISTRY) {
    const importPath = getImportPathFromLoader(entry.loader);
    const resolvedBase = importPath ? resolveFromAlias(importPath) : undefined;

    // existencia do arquivo alvo
    let exists: boolean | undefined = undefined;
    let resolvedFile: string | undefined = undefined;

    if (resolvedBase) {
      const res = resolveExistingFile(resolvedBase);
      exists = res.exists;
      resolvedFile = res.found;
    }

    // slug duplicado
    const newCnt = (bySlug.get(entry.slug) ?? 0) + 1;
    bySlug.set(entry.slug, newCnt);
    const duplicateSlug = newCnt > 1;

    // alias duplicado (global)
    let duplicateAlias = false;
    if (entry.aliases?.length) {
      for (const a of entry.aliases) {
        if (aliasSet.has(a)) duplicateAlias = true;
        aliasSet.add(a);
      }
    }

    // o importPath correto deve começar com "@/components/calculators"
    const mismatchPath =
      !!importPath && !importPath.startsWith("@/components/calculators");

    // linha do slug principal
    rows.push({
      slug: entry.slug,
      name: entry.name,
      category: entry.category,
      subcategory: entry.subcategory ?? undefined,
      importPath,
      resolvedBase,
      resolvedFile,
      exists,
      duplicateSlug,
      duplicateAlias,
      mismatchPath,
    });

    // linhas para aliases, se houver
    if (entry.aliases?.length) {
      for (const a of entry.aliases) {
        rows.push({
          slug: entry.slug,
          name: entry.name,
          category: entry.category,
          subcategory: entry.subcategory ?? undefined,
          alias: a,
          importPath,
          resolvedBase,
          resolvedFile,
          exists,
          duplicateSlug,
          duplicateAlias,
          mismatchPath,
        });
      }
    }
  }

  // Gera TSV
  const header = [
    "slug",
    "alias",
    "name",
    "category",
    "subcategory",
    "importPath",
    "resolvedBase",
    "resolvedFile",
    "exists",
    "duplicateSlug",
    "duplicateAlias",
    "mismatchPath",
  ].join("\t");

  const lines = rows.map((r) =>
    [
      r.slug,
      r.alias ?? "",
      r.name,
      r.category,
      r.subcategory ?? "",
      r.importPath ?? "",
      r.resolvedBase ?? "",
      r.resolvedFile ?? "",
      r.exists === undefined ? "" : String(r.exists),
      String(!!r.duplicateSlug),
      String(!!r.duplicateAlias),
      String(!!r.mismatchPath),
    ].join("\t")
  );

  const out = [header, ...lines].join("\n");
  const outPath = path.resolve(process.cwd(), "registry_validation.tsv");
  writeFileSync(outPath, out, "utf8");
  console.log(`✅ registry_validation.tsv gerado em: ${outPath}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
