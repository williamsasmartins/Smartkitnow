import React, { useEffect, useState } from "react";
import { REGISTRY } from "@/data/calculatorRegistry";

type Row = {
  slug: string;
  path: string;
  ok: boolean;
  error?: string;
};

export default function CalcsDebug() {
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    (async () => {
      setRunning(true);
      const out: Row[] = [];
      for (const e of REGISTRY) {
        const pathGuess = (() => {
          try { return (e.loader as any)?.toString?.() || ""; } catch { return ""; }
        })();
        try {
          // força o import dinâmico do loader
          const mod = await (e.loader() as Promise<any>);
          const hasDefault = !!(mod?.default);
          out.push({ slug: `${e.category}/${e.subcategory}/${e.slug}`, path: pathGuess, ok: hasDefault });
        } catch (err: any) {
          out.push({
            slug: `${e.category}/${e.subcategory}/${e.slug}`,
            path: pathGuess,
            ok: false,
            error: (err?.message || String(err)).slice(0, 300),
          });
        }
      }
      setRows(out);
      setRunning(false);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Calculators Loader Check</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Tenta importar cada loader do <code>REGISTRY</code> e mostra se há <b>default export</b>.
      </p>
      {running ? <div>Checking…</div> : null}
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left p-2">Route (category/subcategory/slug)</th>
              <th className="text-left p-2">Loader (fn.toString)</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Error</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{r.slug}</td>
                <td className="p-2 text-xs text-muted-foreground">{r.path?.slice(0,180)}</td>
                <td className="p-2">
                  {r.ok ? <span className="text-emerald-600 font-medium">OK</span>
                        : <span className="text-red-600 font-medium">BROKEN</span>}
                </td>
                <td className="p-2 text-xs text-red-600">{r.error}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Remova esta página/rota depois de consertar.
      </p>
    </div>
  );
}