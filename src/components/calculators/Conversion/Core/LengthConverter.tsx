import React, { useMemo, useState } from "react";

/**
 * Length Converter
 * Simple unit table with meters as base.
 */

type Unit =
  | "m" | "km" | "cm" | "mm"
  | "in" | "ft" | "yd" | "mi"
  | "nm" | "um";

const FACTORS_TO_M: Record<Unit, number> = {
  m: 1,
  km: 1_000,
  cm: 0.01,
  mm: 0.001,
  nm: 1e-9,
  um: 1e-6,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

const UNITS: Unit[] = ["km","m","cm","mm","mi","yd","ft","in","um","nm"];

export default function LengthConverter() {
  const [value, setValue] = useState<string>("");
  const [from, setFrom] = useState<Unit>("m");

  const meters = useMemo(() => {
    const v = parseFloat(value);
    if (!isFinite(v)) return NaN;
    return v * FACTORS_TO_M[from];
  }, [value, from]);

  const convert = (u: Unit) => (isFinite(meters) ? meters / FACTORS_TO_M[u] : NaN);

  return (
    <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
      <h1 className="mb-2">Length Converter</h1>
      <p className="text-sm opacity-80">Convert between common metric and imperial units. Base: meters.</p>

      {/* FORM */}
      <div className="mt-6 p-4 border rounded-xl grid gap-4 sm:grid-cols-[1fr_auto]">
        <label className="block">
          <span className="text-sm font-medium">Value</span>
          <input
            inputMode="decimal"
            className="mt-1 w-full border rounded-md px-3 py-2"
            placeholder="e.g., 1.5"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">From</span>
          <select
            className="mt-1 w-full border rounded-md px-3 py-2"
            value={from}
            onChange={(e) => setFrom(e.target.value as Unit)}
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </label>
      </div>

      {/* RESULTS TABLE */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Unit</th>
              <th className="text-left py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {UNITS.map((u) => (
              <tr key={u} className="border-b last:border-0">
                <td className="py-2 font-medium">{u}</td>
                <td className="py-2 tabular-nums">
                  {isFinite(meters) ? formatNumber(convert(u)) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NOTES */}
      <div className="mt-8">
        <h3>Notes</h3>
        <ul>
          <li>Exact factors (e.g., 1 inch = 0.0254 m; 1 mile = 1609.344 m).</li>
          <li>Outputs use 10 significant digits (rounded for readability).</li>
        </ul>
      </div>
    </div>
  );
}

function formatNumber(x: number, sig = 10) {
  if (!isFinite(x)) return "—";
  // Show up to 10 significant digits, then clean trailing zeros
  const s = x.toPrecision(sig);
  // Prefer normal fixed over scientific for moderate ranges
  const n = Number(s);
  const asFixed = Math.abs(n) >= 1e-4 && Math.abs(n) < 1e7 ? n.toString() : s;
  return stripTrailingZeros(asFixed);
}

function stripTrailingZeros(s: string) {
  if (s.indexOf("e") >= 0 || s.indexOf("E") >= 0) return s; // scientific notation
  if (s.indexOf(".") < 0) return s;
  return s.replace(/(\.\d*?[1-9])0+$/,"$1").replace(/\.0+$/,"");
}