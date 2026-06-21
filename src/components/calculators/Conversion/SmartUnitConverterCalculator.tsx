import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Copy, Check } from "lucide-react";
import ErrorBoundary from "@/components/common/ErrorBoundary";

// ─── Unit Definitions ────────────────────────────────────────────────────────

type UnitId = string;

interface UnitDef {
  id: UnitId;
  label: string;
  /** Multiplier to convert to the base unit (or function for non-linear) */
  toBase: number | ((v: number) => number);
  fromBase: number | ((v: number) => number);
  symbol: string;
}

interface Category {
  id: string;
  label: string;
  emoji: string;
  base: string; // description of base unit
  units: UnitDef[];
}

// Helper for linear units
const linear = (factor: number): Pick<UnitDef, "toBase" | "fromBase"> => ({
  toBase: factor,
  fromBase: 1 / factor,
});

const CATEGORIES: Category[] = [
  {
    id: "length",
    label: "Length",
    emoji: "📏",
    base: "meters",
    units: [
      { id: "mm",  label: "Millimeters",  symbol: "mm",  ...linear(0.001) },
      { id: "cm",  label: "Centimeters",  symbol: "cm",  ...linear(0.01) },
      { id: "dm",  label: "Decimeters",   symbol: "dm",  ...linear(0.1) },
      { id: "m",   label: "Meters",       symbol: "m",   ...linear(1) },
      { id: "km",  label: "Kilometers",   symbol: "km",  ...linear(1000) },
      { id: "in",  label: "Inches",       symbol: "in",  ...linear(0.0254) },
      { id: "ft",  label: "Feet",         symbol: "ft",  ...linear(0.3048) },
      { id: "yd",  label: "Yards",        symbol: "yd",  ...linear(0.9144) },
      { id: "mi",  label: "Miles",        symbol: "mi",  ...linear(1609.344) },
      { id: "nmi", label: "Nautical Miles", symbol: "nmi", ...linear(1852) },
      { id: "μm",  label: "Micrometers",  symbol: "μm",  ...linear(0.000001) },
    ],
  },
  {
    id: "weight",
    label: "Weight / Mass",
    emoji: "⚖️",
    base: "kilograms",
    units: [
      { id: "mg",  label: "Milligrams",   symbol: "mg",  ...linear(0.000001) },
      { id: "g",   label: "Grams",        symbol: "g",   ...linear(0.001) },
      { id: "kg",  label: "Kilograms",    symbol: "kg",  ...linear(1) },
      { id: "t",   label: "Metric Tons",  symbol: "t",   ...linear(1000) },
      { id: "oz",  label: "Ounces",       symbol: "oz",  ...linear(0.0283495) },
      { id: "lb",  label: "Pounds",       symbol: "lb",  ...linear(0.453592) },
      { id: "st",  label: "Stone",        symbol: "st",  ...linear(6.35029) },
      { id: "ton", label: "Short Tons (US)", symbol: "ton", ...linear(907.185) },
    ],
  },
  {
    id: "temperature",
    label: "Temperature",
    emoji: "🌡️",
    base: "celsius",
    units: [
      {
        id: "c", label: "Celsius", symbol: "°C",
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      {
        id: "f", label: "Fahrenheit", symbol: "°F",
        toBase: (v) => (v - 32) * 5 / 9,
        fromBase: (v) => v * 9 / 5 + 32,
      },
      {
        id: "k", label: "Kelvin", symbol: "K",
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    ],
  },
  {
    id: "volume",
    label: "Volume",
    emoji: "🧪",
    base: "liters",
    units: [
      { id: "ml",    label: "Milliliters",      symbol: "mL",   ...linear(0.001) },
      { id: "l",     label: "Liters",           symbol: "L",    ...linear(1) },
      { id: "m3",    label: "Cubic Meters",     symbol: "m³",   ...linear(1000) },
      { id: "cm3",   label: "Cubic Centimeters", symbol: "cm³", ...linear(0.001) },
      { id: "ft3",   label: "Cubic Feet",       symbol: "ft³",  ...linear(28.3168) },
      { id: "in3",   label: "Cubic Inches",     symbol: "in³",  ...linear(0.0163871) },
      { id: "gal",   label: "US Gallons",       symbol: "gal",  ...linear(3.78541) },
      { id: "qt",    label: "US Quarts",        symbol: "qt",   ...linear(0.946353) },
      { id: "pt",    label: "US Pints",         symbol: "pt",   ...linear(0.473176) },
      { id: "cup",   label: "US Cups",          symbol: "cup",  ...linear(0.236588) },
      { id: "floz",  label: "Fluid Ounces (US)", symbol: "fl oz", ...linear(0.0295735) },
      { id: "tbsp",  label: "Tablespoons",      symbol: "tbsp", ...linear(0.0147868) },
      { id: "tsp",   label: "Teaspoons",        symbol: "tsp",  ...linear(0.00492892) },
      { id: "ukgal", label: "UK Gallons",       symbol: "UK gal", ...linear(4.54609) },
    ],
  },
  {
    id: "area",
    label: "Area",
    emoji: "🔲",
    base: "square meters",
    units: [
      { id: "mm2",  label: "Square Millimeters", symbol: "mm²",  ...linear(0.000001) },
      { id: "cm2",  label: "Square Centimeters", symbol: "cm²",  ...linear(0.0001) },
      { id: "m2",   label: "Square Meters",      symbol: "m²",   ...linear(1) },
      { id: "km2",  label: "Square Kilometers",  symbol: "km²",  ...linear(1_000_000) },
      { id: "ha",   label: "Hectares",           symbol: "ha",   ...linear(10_000) },
      { id: "in2",  label: "Square Inches",      symbol: "in²",  ...linear(0.00064516) },
      { id: "ft2",  label: "Square Feet",        symbol: "ft²",  ...linear(0.092903) },
      { id: "yd2",  label: "Square Yards",       symbol: "yd²",  ...linear(0.836127) },
      { id: "ac",   label: "Acres",              symbol: "ac",   ...linear(4046.86) },
      { id: "mi2",  label: "Square Miles",       symbol: "mi²",  ...linear(2_589_988) },
    ],
  },
  {
    id: "speed",
    label: "Speed",
    emoji: "💨",
    base: "m/s",
    units: [
      { id: "mps",   label: "Meters/Second",     symbol: "m/s",   ...linear(1) },
      { id: "kmph",  label: "Kilometers/Hour",   symbol: "km/h",  ...linear(1 / 3.6) },
      { id: "mph",   label: "Miles/Hour",        symbol: "mph",   ...linear(0.44704) },
      { id: "fps",   label: "Feet/Second",       symbol: "ft/s",  ...linear(0.3048) },
      { id: "knot",  label: "Knots",             symbol: "kn",    ...linear(0.514444) },
      { id: "mach",  label: "Mach (at sea level)", symbol: "Mach", ...linear(340.3) },
    ],
  },
  {
    id: "pressure",
    label: "Pressure",
    emoji: "🔩",
    base: "pascals",
    units: [
      { id: "pa",   label: "Pascals",           symbol: "Pa",   ...linear(1) },
      { id: "kpa",  label: "Kilopascals",       symbol: "kPa",  ...linear(1000) },
      { id: "mpa",  label: "Megapascals",       symbol: "MPa",  ...linear(1_000_000) },
      { id: "bar",  label: "Bar",               symbol: "bar",  ...linear(100_000) },
      { id: "psi",  label: "PSI",               symbol: "psi",  ...linear(6894.76) },
      { id: "atm",  label: "Atmospheres",       symbol: "atm",  ...linear(101_325) },
      { id: "mmhg", label: "mmHg (Torr)",       symbol: "mmHg", ...linear(133.322) },
      { id: "inhg", label: "Inches of Mercury", symbol: "inHg", ...linear(3386.39) },
    ],
  },
  {
    id: "energy",
    label: "Energy",
    emoji: "⚡",
    base: "joules",
    units: [
      { id: "j",    label: "Joules",             symbol: "J",    ...linear(1) },
      { id: "kj",   label: "Kilojoules",         symbol: "kJ",   ...linear(1000) },
      { id: "cal",  label: "Calories (small)",   symbol: "cal",  ...linear(4.184) },
      { id: "kcal", label: "Kilocalories (kcal)", symbol: "kcal", ...linear(4184) },
      { id: "kwh",  label: "Kilowatt-Hours",     symbol: "kWh",  ...linear(3_600_000) },
      { id: "wh",   label: "Watt-Hours",         symbol: "Wh",   ...linear(3600) },
      { id: "btu",  label: "BTU",                symbol: "BTU",  ...linear(1055.06) },
      { id: "ftlb", label: "Foot-Pounds",        symbol: "ft·lb", ...linear(1.35582) },
      { id: "ev",   label: "Electron-Volts",     symbol: "eV",   ...linear(1.60218e-19) },
    ],
  },
  {
    id: "data",
    label: "Data",
    emoji: "💾",
    base: "bytes",
    units: [
      { id: "b",   label: "Bytes",     symbol: "B",   ...linear(1) },
      { id: "kb",  label: "Kilobytes", symbol: "kB",  ...linear(1_000) },
      { id: "mb",  label: "Megabytes", symbol: "MB",  ...linear(1_000_000) },
      { id: "gb",  label: "Gigabytes", symbol: "GB",  ...linear(1_000_000_000) },
      { id: "tb",  label: "Terabytes", symbol: "TB",  ...linear(1_000_000_000_000) },
      { id: "kib", label: "Kibibytes", symbol: "KiB", ...linear(1_024) },
      { id: "mib", label: "Mebibytes", symbol: "MiB", ...linear(1_048_576) },
      { id: "gib", label: "Gibibytes", symbol: "GiB", ...linear(1_073_741_824) },
      { id: "bit", label: "Bits",      symbol: "bit", ...linear(0.125) },
      { id: "kbit",label: "Kilobits",  symbol: "kbit",...linear(125) },
      { id: "mbit",label: "Megabits",  symbol: "Mbit",...linear(125_000) },
      { id: "gbit",label: "Gigabits",  symbol: "Gbit",...linear(125_000_000) },
    ],
  },
  {
    id: "angle",
    label: "Angle",
    emoji: "📐",
    base: "degrees",
    units: [
      { id: "deg",  label: "Degrees",   symbol: "°",    ...linear(1) },
      { id: "rad",  label: "Radians",   symbol: "rad",  ...linear(180 / Math.PI) },
      { id: "grad", label: "Gradians",  symbol: "grad", ...linear(0.9) },
      { id: "turn", label: "Turns",     symbol: "turn", ...linear(360) },
      { id: "arcmin", label: "Arc Minutes", symbol: "′", ...linear(1 / 60) },
      { id: "arcsec", label: "Arc Seconds", symbol: "″", ...linear(1 / 3600) },
    ],
  },
  {
    id: "power",
    label: "Power",
    emoji: "🔋",
    base: "watts",
    units: [
      { id: "w",    label: "Watts",             symbol: "W",    ...linear(1) },
      { id: "kw",   label: "Kilowatts",         symbol: "kW",   ...linear(1000) },
      { id: "mw",   label: "Megawatts",         symbol: "MW",   ...linear(1_000_000) },
      { id: "hp",   label: "Horsepower (mech)", symbol: "hp",   ...linear(745.7) },
      { id: "hpm",  label: "Horsepower (metric)", symbol: "PS", ...linear(735.499) },
      { id: "btu_h",label: "BTU/hour",          symbol: "BTU/h",...linear(0.29307) },
      { id: "cal_s",label: "Calories/second",   symbol: "cal/s",...linear(4.184) },
    ],
  },
];

// ─── Conversion Logic ────────────────────────────────────────────────────────

function applyToBase(unit: UnitDef, value: number): number {
  if (typeof unit.toBase === "function") return unit.toBase(value);
  return value * unit.toBase;
}

function applyFromBase(unit: UnitDef, value: number): number {
  if (typeof unit.fromBase === "function") return unit.fromBase(value);
  return value * unit.fromBase;
}

function convert(value: number, from: UnitDef, to: UnitDef): number {
  const inBase = applyToBase(from, value);
  return applyFromBase(to, inBase);
}

function formatResult(n: number): string {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) === 0) return "0";
  if (Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-6 && n !== 0)) {
    return n.toExponential(6);
  }
  // Up to 10 significant figures, trimmed of trailing zeros
  const s = parseFloat(n.toPrecision(10)).toString();
  return s;
}

// ─── Popular quick-picks per category ────────────────────────────────────────

const POPULAR: Record<string, [string, string][]> = {
  length:      [["mm","in"],["cm","ft"],["m","ft"],["km","mi"],["in","cm"]],
  weight:      [["kg","lb"],["lb","kg"],["g","oz"],["oz","g"],["t","ton"]],
  temperature: [["c","f"],["f","c"],["c","k"]],
  volume:      [["l","gal"],["ml","floz"],["cup","ml"],["m3","ft3"]],
  area:        [["m2","ft2"],["ha","ac"],["km2","mi2"],["cm2","in2"]],
  speed:       [["kmph","mph"],["mps","kmph"],["knot","kmph"]],
  pressure:    [["bar","psi"],["kpa","psi"],["atm","bar"]],
  energy:      [["kcal","kj"],["kwh","j"],["btu","kj"]],
  data:        [["gb","gib"],["mb","mib"],["tb","gb"]],
  angle:       [["deg","rad"],["rad","deg"],["turn","deg"]],
  power:       [["kw","hp"],["hp","kw"],["mw","kw"]],
};

// ─── FAQ type ────────────────────────────────────────────────────────────────

interface FaqItem { question: string; answer: string; }

// ─── Props ───────────────────────────────────────────────────────────────────

interface FormulaVar { symbol: string; description: string; }
interface ExampleStep { step: string; formula: string; result: string; }

interface ConverterProps {
  initialCat?: string;
  initialFrom?: string;
  initialTo?: string;
  title?: string;
  description?: string;
  faqs?: FaqItem[];
  editorial?: React.ReactNode;
  formula?: { formula: string; variables: FormulaVar[]; title?: string };
  example?: { title: string; scenario: string; steps: ExampleStep[]; result: string };
}

// ─── Component ───────────────────────────────────────────────────────────────

function SmartUnitConverter({
  initialCat  = "length",
  initialFrom = "mm",
  initialTo   = "in",
  title       = "Smart Unit Converter",
  description = "Convert between any units instantly — length, weight, temperature, volume, area, speed, pressure, energy, data, angle, and power. Bidirectional. No signup.",
  faqs,
  editorial,
  formula,
  example,
}: ConverterProps) {
  const [catId, setCatId] = useState(initialCat);
  const [fromId, setFromId] = useState(initialFrom);
  const [toId, setToId] = useState(initialTo);
  const [fromVal, setFromVal] = useState("1");
  const [toVal, setToVal] = useState("");
  const [copied, setCopied] = useState(false);

  const cat = useMemo(() => CATEGORIES.find((c) => c.id === catId)!, [catId]);
  const fromUnit = useMemo(() => cat.units.find((u) => u.id === fromId) ?? cat.units[0], [cat, fromId]);
  const toUnit   = useMemo(() => cat.units.find((u) => u.id === toId)   ?? cat.units[1], [cat, toId]);

  // When category changes, reset to first two units
  const switchCategory = (id: string) => {
    const newCat = CATEGORIES.find((c) => c.id === id)!;
    setCatId(id);
    setFromId(newCat.units[0].id);
    setToId(newCat.units[1].id);
    setFromVal("");
    setToVal("");
  };

  const result = useMemo(() => {
    const n = parseFloat(fromVal);
    if (isNaN(n) || fromVal === "") return "";
    return formatResult(convert(n, fromUnit, toUnit));
  }, [fromVal, fromUnit, toUnit]);

  const resultReverse = useMemo(() => {
    const n = parseFloat(toVal);
    if (isNaN(n) || toVal === "") return "";
    return formatResult(convert(n, toUnit, fromUnit));
  }, [toVal, fromUnit, toUnit]);

  const handleFromChange = useCallback((v: string) => {
    setFromVal(v);
    setToVal("");
  }, []);

  const handleToChange = useCallback((v: string) => {
    setToVal(v);
    setFromVal("");
  }, []);

  const swap = () => {
    setFromId(toId);
    setToId(fromId);
    setFromVal(result || toVal);
    setToVal("");
  };

  const applyPopular = (f: string, t: string) => {
    setFromId(f);
    setToId(t);
    setFromVal("1");
    setToVal("");
  };

  const copyResult = () => {
    const val = fromVal !== "" ? result : resultReverse;
    if (!val) return;
    navigator.clipboard.writeText(val).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  // What's displayed in each field
  const displayFrom = fromVal !== "" ? fromVal : resultReverse;
  const displayTo   = fromVal !== "" ? result   : toVal;

  const formula = useMemo(() => {
    if (typeof fromUnit.toBase === "number" && typeof toUnit.fromBase === "number") {
      const factor = fromUnit.toBase * toUnit.fromBase;
      const nice = parseFloat(factor.toPrecision(8)).toString();
      return `1 ${fromUnit.symbol} = ${nice} ${toUnit.symbol}`;
    }
    // Non-linear (temperature)
    return `1 ${fromUnit.symbol} → ${toUnit.symbol} (formula applied)`;
  }, [fromUnit, toUnit]);

  const widget = (
    <ErrorBoundary calculatorName="Smart Unit Converter">
      <div className="space-y-5">

        {/* ── Category tabs ── */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => switchCategory(c.id)}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                catId === c.id
                  ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                  : "bg-background text-muted-foreground border-border hover:border-teal-400 hover:text-teal-600",
              ].join(" ")}
            >
              <span>{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>

        {/* ── Converter card ── */}
        <Card className="border-2 border-teal-100 dark:border-teal-900">
          <CardContent className="pt-6 space-y-5">

            {/* From */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">From</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={displayFrom}
                  onChange={(e) => handleFromChange(e.target.value)}
                  placeholder="Enter value…"
                  className="flex-1 text-lg font-mono"
                />
                <Select value={fromId} onValueChange={(v) => { setFromId(v); setFromVal(fromVal); setToVal(""); }}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cat.units.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.label} ({u.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Swap button */}
            <div className="flex items-center justify-center">
              <button
                onClick={swap}
                className="p-2 rounded-full border border-border hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all"
                aria-label="Swap units"
              >
                <ArrowRightLeft className="w-4 h-4 text-teal-600" />
              </button>
            </div>

            {/* To */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">To</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={displayTo}
                  onChange={(e) => handleToChange(e.target.value)}
                  placeholder="Result…"
                  className="flex-1 text-lg font-mono"
                />
                <Select value={toId} onValueChange={(v) => { setToId(v); setToVal(""); }}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cat.units.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.label} ({u.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Formula & Copy */}
            <div className="flex items-center justify-between pt-1 border-t border-border">
              <p className="text-xs text-muted-foreground font-mono">{formula}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyResult}
                className="gap-1.5 text-xs"
                disabled={!result && !resultReverse}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-teal-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* ── Popular quick-picks ── */}
        {POPULAR[catId] && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quick conversions</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR[catId].map(([f, t]) => {
                const fu = cat.units.find((u) => u.id === f);
                const tu = cat.units.find((u) => u.id === t);
                if (!fu || !tu) return null;
                return (
                  <button
                    key={`${f}-${t}`}
                    onClick={() => applyPopular(f, t)}
                    className={[
                      "px-3 py-1 rounded-lg text-xs font-medium border transition-all",
                      fromId === f && toId === t
                        ? "bg-teal-50 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300"
                        : "border-border text-muted-foreground hover:border-teal-300 hover:text-teal-600",
                    ].join(" ")}
                  >
                    {fu.symbol} → {tu.symbol}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── All units reference ── */}
        <details className="group">
          <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors select-none list-none flex items-center gap-1">
            <span className="group-open:rotate-90 inline-block transition-transform">▶</span>
            All {cat.label} units &amp; factors
          </summary>
          <div className="mt-3 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left px-3 py-2 font-medium">Unit</th>
                  <th className="text-left px-3 py-2 font-medium">Symbol</th>
                  <th className="text-right px-3 py-2 font-medium">→ {cat.units[0]?.symbol}</th>
                </tr>
              </thead>
              <tbody>
                {cat.units.map((u, i) => {
                  const base = cat.units[0];
                  let factor = "—";
                  if (typeof u.toBase === "number" && typeof base.fromBase === "number") {
                    factor = parseFloat((u.toBase * base.fromBase).toPrecision(8)).toString();
                  }
                  return (
                    <tr key={u.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/40"}>
                      <td className="px-3 py-1.5">{u.label}</td>
                      <td className="px-3 py-1.5 font-mono">{u.symbol}</td>
                      <td className="px-3 py-1.5 font-mono text-right">{factor}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </details>

      </div>
    </ErrorBoundary>
  );

  const defaultFaqs: FaqItem[] = [
    {
      question: "How do I convert millimeters to inches?",
      answer: "Select the 'Length' category, choose 'Millimeters' as the From unit and 'Inches' as the To unit, then type your value. 1 mm = 0.039370 inches.",
    },
    {
      question: "Can I convert in both directions?",
      answer: "Yes — you can type in either field and the other updates automatically. Or use the ⇄ swap button to reverse the conversion.",
    },
    {
      question: "How accurate are the conversions?",
      answer: "All linear conversions use exact NIST-standard factors with up to 10 significant figures of precision. Temperature uses exact formulas.",
    },
    {
      question: "What categories are supported?",
      answer: "Length, Weight/Mass, Temperature, Volume, Area, Speed, Pressure, Energy, Data (bytes/bits), Angle, and Power — with more planned.",
    },
  ];

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={widget}
      faqs={faqs ?? defaultFaqs}
    />
  );
}

// ─── Default export (hub page) ───────────────────────────────────────────────

export default function SmartUnitConverterCalculator() {
  return <SmartUnitConverter />;
}

// ─── Named exports — one per top-searched conversion ────────────────────────
// Each gets its own registry entry with targeted slug + SEO metadata.

export function MmToInchesCalculator() {
  return <SmartUnitConverter
    initialCat="length" initialFrom="mm" initialTo="in"
    title="MM to Inches Converter"
    description="Convert millimeters to inches instantly. Type any mm value and get the exact result in inches (and vice versa). 1 mm = 0.03937 inches. Free, no signup."
    faqs={[
      { question: "How many inches is 1 mm?", answer: "1 millimeter = 0.03937 inches. To convert mm to inches, divide by 25.4. So 10 mm = 10 ÷ 25.4 = 0.3937 inches." },
      { question: "How many mm is 1 inch?", answer: "1 inch = 25.4 millimeters exactly (by international definition since 1959)." },
      { question: "How to convert mm to inches?", answer: "Divide the millimeter value by 25.4. Formula: inches = mm ÷ 25.4. Example: 100 mm ÷ 25.4 = 3.937 inches." },
      { question: "Is 25 mm the same as 1 inch?", answer: "Not exactly. 25 mm = 0.9843 inches. 1 inch = 25.4 mm, so 25 mm is slightly less than 1 inch." },
    ]}
  />;
}

export function CmToInchesCalculator() {
  return <SmartUnitConverter
    initialCat="length" initialFrom="cm" initialTo="in"
    title="CM to Inches Converter"
    description="Convert centimeters to inches instantly. Free bidirectional converter — type cm or inches and get the exact result. 1 cm = 0.3937 inches."
    faqs={[
      { question: "How many inches is 1 cm?", answer: "1 centimeter = 0.3937 inches. To convert cm to inches, divide by 2.54." },
      { question: "How many cm is 1 inch?", answer: "1 inch = 2.54 centimeters exactly." },
      { question: "How to convert centimeters to inches?", answer: "Divide the cm value by 2.54. Formula: inches = cm ÷ 2.54. Example: 30 cm ÷ 2.54 = 11.811 inches." },
      { question: "How tall is 170 cm in inches?", answer: "170 cm ÷ 2.54 = 66.93 inches, which is 5 feet 6.93 inches." },
    ]}
  />;
}

export function InchesToCmCalculator() {
  return <SmartUnitConverter
    initialCat="length" initialFrom="in" initialTo="cm"
    title="Inches to CM Converter"
    description="Convert inches to centimeters instantly. Free bidirectional converter — type inches or cm and get the exact result. 1 inch = 2.54 cm."
    faqs={[
      { question: "How many cm is 1 inch?", answer: "1 inch = 2.54 centimeters exactly. To convert inches to cm, multiply by 2.54." },
      { question: "How to convert inches to centimeters?", answer: "Multiply the inch value by 2.54. Formula: cm = inches × 2.54. Example: 12 inches × 2.54 = 30.48 cm." },
      { question: "How many inches is 5 feet?", answer: "5 feet = 60 inches = 152.4 cm." },
      { question: "What is 6 feet in cm?", answer: "6 feet = 72 inches × 2.54 = 182.88 cm." },
    ]}
  />;
}

export function MetersToFeetCalculator() {
  return <SmartUnitConverter
    initialCat="length" initialFrom="m" initialTo="ft"
    title="Meters to Feet Converter"
    description="Convert meters to feet instantly. Bidirectional — type meters or feet. 1 meter = 3.28084 feet. Free, accurate, no signup."
    faqs={[
      { question: "How many feet is 1 meter?", answer: "1 meter = 3.28084 feet. To convert meters to feet, multiply by 3.28084." },
      { question: "How to convert meters to feet?", answer: "Multiply the meter value by 3.28084. Example: 5 meters × 3.28084 = 16.4042 feet." },
      { question: "How many meters is 1 foot?", answer: "1 foot = 0.3048 meters exactly." },
      { question: "How tall is 6 feet in meters?", answer: "6 feet × 0.3048 = 1.8288 meters, commonly rounded to 1.83 m." },
    ]}
  />;
}

export function KmToMilesCalculator() {
  return <SmartUnitConverter
    initialCat="length" initialFrom="km" initialTo="mi"
    title="KM to Miles Converter"
    description="Convert kilometers to miles instantly. Bidirectional — type km or miles. 1 km = 0.621371 miles. Free, no signup."
    faqs={[
      { question: "How many miles is 1 km?", answer: "1 kilometer = 0.621371 miles. A quick approximation: 1 km ≈ 0.62 miles." },
      { question: "How to convert km to miles?", answer: "Multiply the km value by 0.621371. Example: 10 km × 0.621371 = 6.21371 miles." },
      { question: "How many km is 1 mile?", answer: "1 mile = 1.60934 kilometers." },
      { question: "How many km is a 5K race?", answer: "A 5K race is 5 kilometers = 3.10686 miles." },
    ]}
  />;
}

export function MilesToKmCalculator() {
  return <SmartUnitConverter
    initialCat="length" initialFrom="mi" initialTo="km"
    title="Miles to KM Converter"
    description="Convert miles to kilometers instantly. Bidirectional — type miles or km. 1 mile = 1.60934 km. Free, no signup."
    faqs={[
      { question: "How many km is 1 mile?", answer: "1 mile = 1.60934 kilometers. To convert miles to km, multiply by 1.60934." },
      { question: "How to convert miles to kilometers?", answer: "Multiply the mile value by 1.60934. Example: 26.2 miles (marathon) × 1.60934 = 42.165 km." },
      { question: "How many miles is 100 km?", answer: "100 km ÷ 1.60934 = 62.137 miles." },
      { question: "How many km is a half marathon?", answer: "A half marathon is 13.1094 miles = 21.0975 km." },
    ]}
  />;
}

export function KgToLbsCalculator() {
  return <SmartUnitConverter
    initialCat="weight" initialFrom="kg" initialTo="lb"
    title="KG to LBS Converter"
    description="Convert kilograms to pounds instantly. Bidirectional — type kg or lbs. 1 kg = 2.20462 lbs. Free, no signup."
    faqs={[
      { question: "How many lbs is 1 kg?", answer: "1 kilogram = 2.20462 pounds. To convert kg to lbs, multiply by 2.20462." },
      { question: "How to convert kilograms to pounds?", answer: "Multiply the kg value by 2.20462. Example: 70 kg × 2.20462 = 154.32 lbs." },
      { question: "How many kg is 1 pound?", answer: "1 pound = 0.453592 kilograms." },
      { question: "How many lbs is 100 kg?", answer: "100 kg × 2.20462 = 220.462 pounds." },
    ]}
  />;
}

export function LbsToKgCalculator() {
  return <SmartUnitConverter
    initialCat="weight" initialFrom="lb" initialTo="kg"
    title="LBS to KG Converter"
    description="Convert pounds to kilograms instantly. Bidirectional — type lbs or kg. 1 lb = 0.453592 kg. Free, no signup."
    faqs={[
      { question: "How many kg is 1 pound?", answer: "1 pound = 0.453592 kilograms. To convert lbs to kg, multiply by 0.453592." },
      { question: "How to convert pounds to kilograms?", answer: "Multiply the pound value by 0.453592. Example: 150 lbs × 0.453592 = 68.039 kg." },
      { question: "How many lbs is 1 kg?", answer: "1 kg = 2.20462 pounds." },
      { question: "How many kg is 200 lbs?", answer: "200 lbs × 0.453592 = 90.718 kg." },
    ]}
  />;
}

export function CelsiusToFahrenheitCalculator() {
  return <SmartUnitConverter
    initialCat="temperature" initialFrom="c" initialTo="f"
    title="Celsius to Fahrenheit Converter"
    description="Convert Celsius to Fahrenheit instantly. Bidirectional — type °C or °F. Formula: °F = (°C × 9/5) + 32. Free, no signup."
    faqs={[
      { question: "How to convert Celsius to Fahrenheit?", answer: "Formula: °F = (°C × 9/5) + 32. Example: 100°C = (100 × 9/5) + 32 = 212°F." },
      { question: "What is 37°C in Fahrenheit?", answer: "37°C = (37 × 9/5) + 32 = 98.6°F — normal human body temperature." },
      { question: "What is 0°C in Fahrenheit?", answer: "0°C = 32°F — the freezing point of water." },
      { question: "What temperature is the same in Celsius and Fahrenheit?", answer: "-40°C = -40°F. That is the only point where both scales are equal." },
    ]}
  />;
}

export function FahrenheitToCelsiusCalculator() {
  return <SmartUnitConverter
    initialCat="temperature" initialFrom="f" initialTo="c"
    title="Fahrenheit to Celsius Converter"
    description="Convert Fahrenheit to Celsius instantly. Bidirectional — type °F or °C. Formula: °C = (°F − 32) × 5/9. Free, no signup."
    faqs={[
      { question: "How to convert Fahrenheit to Celsius?", answer: "Formula: °C = (°F − 32) × 5/9. Example: 98.6°F = (98.6 − 32) × 5/9 = 37°C." },
      { question: "What is 32°F in Celsius?", answer: "32°F = 0°C — the freezing point of water." },
      { question: "What is 212°F in Celsius?", answer: "212°F = 100°C — the boiling point of water at sea level." },
      { question: "What is 72°F in Celsius?", answer: "72°F = (72 − 32) × 5/9 = 22.2°C — a comfortable room temperature." },
    ]}
  />;
}

export function LitersToGallonsCalculator() {
  return <SmartUnitConverter
    initialCat="volume" initialFrom="l" initialTo="gal"
    title="Liters to Gallons Converter"
    description="Convert liters to US gallons instantly. Bidirectional — type liters or gallons. 1 liter = 0.264172 US gallons. Free, no signup."
    faqs={[
      { question: "How many gallons is 1 liter?", answer: "1 liter = 0.264172 US gallons. To convert liters to gallons, multiply by 0.264172." },
      { question: "How many liters is 1 gallon?", answer: "1 US gallon = 3.78541 liters." },
      { question: "How to convert liters to gallons?", answer: "Multiply the liter value by 0.264172. Example: 10 liters × 0.264172 = 2.64172 gallons." },
      { question: "How many liters is 5 gallons?", answer: "5 gallons × 3.78541 = 18.927 liters." },
    ]}
  />;
}

export function GallonsToLitersCalculator() {
  return <SmartUnitConverter
    initialCat="volume" initialFrom="gal" initialTo="l"
    title="Gallons to Liters Converter"
    description="Convert US gallons to liters instantly. Bidirectional — type gallons or liters. 1 US gallon = 3.78541 liters. Free, no signup."
    faqs={[
      { question: "How many liters is 1 gallon?", answer: "1 US gallon = 3.78541 liters. To convert gallons to liters, multiply by 3.78541." },
      { question: "How many gallons is 1 liter?", answer: "1 liter = 0.264172 US gallons." },
      { question: "How to convert gallons to liters?", answer: "Multiply the gallon value by 3.78541. Example: 10 gallons × 3.78541 = 37.8541 liters." },
      { question: "How many liters is a gallon of milk?", answer: "A US gallon of milk = 3.78541 liters. A UK gallon = 4.54609 liters." },
    ]}
  />;
}

export function OzToGramsCalculator() {
  return <SmartUnitConverter
    initialCat="weight" initialFrom="oz" initialTo="g"
    title="Ounces to Grams Converter"
    description="Convert ounces to grams instantly. Bidirectional — type oz or grams. 1 oz = 28.3495 grams. Free, no signup."
    faqs={[
      { question: "How many grams is 1 ounce?", answer: "1 ounce = 28.3495 grams. To convert oz to grams, multiply by 28.3495." },
      { question: "How many ounces is 100 grams?", answer: "100 grams ÷ 28.3495 = 3.5274 ounces." },
      { question: "How to convert ounces to grams?", answer: "Multiply the ounce value by 28.3495. Example: 8 oz × 28.3495 = 226.796 grams." },
      { question: "Is 1 oz 30 grams?", answer: "Not exactly. 1 oz = 28.3495 grams. 30 grams ≈ 1.0582 oz." },
    ]}
  />;
}

export function GramsToOzCalculator() {
  return <SmartUnitConverter
    initialCat="weight" initialFrom="g" initialTo="oz"
    title="Grams to Ounces Converter"
    description="Convert grams to ounces instantly. Bidirectional — type grams or oz. 1 gram = 0.035274 oz. Free, no signup."
    faqs={[
      { question: "How many ounces is 1 gram?", answer: "1 gram = 0.035274 ounces. To convert grams to oz, multiply by 0.035274." },
      { question: "How many grams is 1 ounce?", answer: "1 ounce = 28.3495 grams." },
      { question: "How to convert grams to ounces?", answer: "Multiply the gram value by 0.035274. Example: 200 grams × 0.035274 = 7.0548 oz." },
      { question: "How many grams is 4 ounces?", answer: "4 oz × 28.3495 = 113.398 grams." },
    ]}
  />;
}

export function MmToFeetCalculator() {
  return <SmartUnitConverter
    initialCat="length" initialFrom="mm" initialTo="ft"
    title="MM to Feet Converter"
    description="Convert millimeters to feet instantly. Bidirectional — type mm or feet. 1 mm = 0.003281 feet. Free, no signup."
    faqs={[
      { question: "How many feet is 1 mm?", answer: "1 millimeter = 0.003281 feet. To convert mm to feet, divide by 304.8." },
      { question: "How many mm is 1 foot?", answer: "1 foot = 304.8 millimeters exactly." },
      { question: "How to convert mm to feet?", answer: "Divide the mm value by 304.8. Example: 1000 mm ÷ 304.8 = 3.281 feet." },
      { question: "How many mm is 6 feet?", answer: "6 feet × 304.8 = 1828.8 mm." },
    ]}
  />;
}
