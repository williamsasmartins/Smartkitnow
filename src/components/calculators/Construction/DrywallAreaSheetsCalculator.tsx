import React, { useState, useEffect, useMemo } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { 
  Ruler, 
  HardHat, 
  Info, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  Calculator, 
  FileQuestion 
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

// =====================================================================
// USER'S CUSTOM LOGIC & HELPERS (PRESERVED)
// =====================================================================

const IN_PER_FT = 12;
const CM_PER_IN = 2.54;
const M_PER_FT = 0.3048;
const FT2_TO_M2 = 0.09290304;
const DECIMAL_RE = /^\d*(?:\.\d*)?$/;

function safeId() {
  try {
    const c = (typeof globalThis !== "undefined" && (globalThis as any).crypto) ? (globalThis as any).crypto : undefined;
    if (c && typeof c.randomUUID === "function") return c.randomUUID();
  } catch { /* Ignored */ }
  return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

const UnitSystem = {
  IMPERIAL: "imperial",
  METRIC: "metric",
} as const;

type UnitSystemKey = typeof UnitSystem[keyof typeof UnitSystem];

function toInches(value: number, unit: UnitSystemKey): number {
  if (!Number.isFinite(value)) return NaN;
  if (unit === UnitSystem.IMPERIAL) return value * IN_PER_FT; // ft -> in
  return (value / M_PER_FT) * IN_PER_FT; // m -> in
}
function inchesToUnit(inches: number, unit: UnitSystemKey): number {
  if (!Number.isFinite(inches)) return NaN;
  if (unit === UnitSystem.IMPERIAL) return inches / IN_PER_FT; // in -> ft
  return (inches / IN_PER_FT) * M_PER_FT; // in -> m
}
function areaSqFtFromInches2(squareInches: number): number {
  return squareInches / (IN_PER_FT * IN_PER_FT);
}
function fmtArea(valueSqFt: number, unit: UnitSystemKey): string {
  const v = Number.isFinite(valueSqFt) ? valueSqFt : 0;
  if (unit === UnitSystem.IMPERIAL) return `${v.toFixed(2)} ft²`;
  return `${(v * FT2_TO_M2).toFixed(2)} m²`;
}

// ----- Tipos -----
type Opening = {
  id: string;
  label: "Window" | "Door";
  widthIn: number;  // inches
  heightIn: number; // inches
  count: number;    // inteiro
};

type Room = {
  id: string;
  name: string;
  lengthIn: number; // inches
  widthIn: number;  // inches
  heightIn: number; // inches
  includeCeiling: boolean;
  openings: Opening[];
};

type BoardOption = {
  id: string;
  label: string; // e.g., 4' x 8'
  widthIn: number;
  lengthIn: number;
};

type BoardSelection = {
  id: string;
  boardId: string;   // de BOARD_OPTIONS
  thickness: string; // 1/4", 1/2", 5/8"
  quantity: number;  // folhas
  unitPrice: number; // $/folha
};

type DrywallConfig = {
  coverCeilings: boolean;
  wastePct: number;
  selections: BoardSelection[];
};

type ManualMaterial = {
  id: string;
  name: string;
  size: string;
  thickness: string;
  quantity: number;
  unitPrice: number;
};

// ----- Dados -----
const BOARD_OPTIONS: BoardOption[] = [
  { id: "4x8",  label: "4' x 8'",  widthIn: 4 * IN_PER_FT, lengthIn: 8  * IN_PER_FT },
  { id: "4x9",  label: "4' x 9'",  widthIn: 4 * IN_PER_FT, lengthIn: 9  * IN_PER_FT },
  { id: "4x10", label: "4' x 10'", widthIn: 4 * IN_PER_FT, lengthIn: 10 * IN_PER_FT },
  { id: "4x12", label: "4' x 12'", widthIn: 4 * IN_PER_FT, lengthIn: 12 * IN_PER_FT },
  { id: "4x14", label: "4' x 14'", widthIn: 4 * IN_PER_FT, lengthIn: 14 * IN_PER_FT },
  { id: "54x8", label: "54\" x 8' (4.5' x 8')",  widthIn: 54, lengthIn: 8  * IN_PER_FT },
  { id: "54x9", label: "54\" x 9' (4.5' x 9')",  widthIn: 54, lengthIn: 9  * IN_PER_FT },
  { id: "54x10",label: "54\" x 10' (4.5' x 10')", widthIn: 54, lengthIn: 10 * IN_PER_FT },
  { id: "54x12",label: "54\" x 12' (4.5' x 12')", widthIn: 54, lengthIn: 12 * IN_PER_FT },
];
const THICKNESS_OPTIONS = ['1/4"', '1/2"', '5/8"'] as const;

const DEFAULT_ROOM = (): Room => ({
  id: safeId(),
  name: "Room",
  lengthIn: 12 * IN_PER_FT,
  widthIn: 10 * IN_PER_FT,
  heightIn: 8 * IN_PER_FT,
  includeCeiling: true,
  openings: [],
});
const DEFAULT_OPENING = (): Opening => ({
  id: safeId(),
  label: "Window",
  widthIn: 36,
  heightIn: 48,
  count: 1,
});
const DEFAULT_SELECTION = (): BoardSelection => ({
  id: safeId(),
  boardId: BOARD_OPTIONS[0].id,
  thickness: THICKNESS_OPTIONS[1],
  quantity: 0,
  unitPrice: 15,
});
const DEFAULT_DRYWALL_CONFIG: DrywallConfig = {
  coverCeilings: true,
  wastePct: 10,
  selections: [DEFAULT_SELECTION()],
};
const DEFAULT_MATERIAL = (): ManualMaterial => ({
  id: safeId(),
  name: "Joint Compound",
  size: "4.5 gal bucket",
  thickness: "N/A",
  quantity: 2,
  unitPrice: 22.5,
});

const STORAGE_KEY = "drywall_calc_state_v4";

// ----- Inputs reutilizáveis (Internal Components) -----
function NumInput({
  value,
  onChange,
  className = "",
  id,
  name,
  ariaLabel,
  ariaDescribedBy,
}: {
  value: number;
  onChange: (n: number) => void;
  className?: string;
  id?: string;
  name?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}) {
  const [text, setText] = useState<string>(Number.isFinite(value) ? String(value) : "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) setText(Number.isFinite(value) ? String(value) : "");
  }, [value, isEditing]);

  const commit = () => {
    setIsEditing(false);
    const v = text.trim();
    if (v === "") {
      setText("");
      onChange(NaN);
    } else if (DECIMAL_RE.test(v)) {
      onChange(parseFloat(v));
    } else {
      setText("");
      onChange(NaN);
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      pattern="[0-9]*[.]?[0-9]*"
      className={`w-full rounded-lg border bg-white dark:bg-slate-950 px-3 py-2 shadow-sm outline-none focus:ring border-slate-200 dark:border-slate-800 ${className}`}
      value={text}
      id={id}
      name={name}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      onFocus={() => setIsEditing(true)}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          commit();
          (e.currentTarget as HTMLInputElement).blur();
        }
      }}
      onBlur={commit}
    />
  );
}

function Select({ value, onChange, children, className = "", id, name, ariaLabel }: {
  value: any;
  onChange: (v: any) => void;
  children: React.ReactNode;
  className?: string;
  id?: string;
  name?: string;
  ariaLabel?: string;
}) {
  return (
    <select
      className={`w-full rounded-lg border bg-white dark:bg-slate-950 px-3 py-2 shadow-sm border-slate-200 dark:border-slate-800 ${className}`}
      value={value}
      id={id}
      name={name}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
    >
      {children}
    </select>
  );
}

function FieldWithUnit({
  label,
  unitLabel,
  value,
  onChange,
  id,
}: {
  label: string;
  unitLabel: string;
  value: number;
  onChange: (n: number) => void;
  id?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor={id}>
        {label} ({unitLabel})
      </label>
      <NumInput id={id} value={value} onChange={onChange} />
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <div className="text-sm text-slate-500 dark:text-slate-400">{title}</div>
      <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</div>
    </div>
  );
}
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-900 px-3 py-2 border border-slate-100 dark:border-slate-800">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-medium text-slate-900 dark:text-slate-100">{value}</span>
    </div>
  );
}

// =====================================================================
// MAIN PAGE COMPONENT
// =====================================================================

export default function DrywallAreaSheetsCalculator() {
  const [unit, setUnit] = useState<UnitSystemKey>(UnitSystem.IMPERIAL);
  const [rooms, setRooms] = useState<Room[]>([DEFAULT_ROOM()]);
  const [drywall, setDrywall] = useState<DrywallConfig>(DEFAULT_DRYWALL_CONFIG);
  const [manualMaterials, setManualMaterials] = useState<ManualMaterial[]>([DEFAULT_MATERIAL()]);

  // Load / Save Logic
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.rooms) setRooms(parsed.rooms);
        if (parsed.drywall) setDrywall(parsed.drywall);
        if (parsed.manualMaterials) setManualMaterials(parsed.manualMaterials);
        if (parsed.unit) setUnit(parsed.unit);
      }
    } catch { /* Ignored */ }
  }, []);

  useEffect(() => {
    const state = { rooms, drywall, manualMaterials, unit };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Ignored */ }
  }, [rooms, drywall, manualMaterials, unit]);

  // Calculations
  const { totalWallAreaFt2, totalCeilingAreaFt2, totalOpeningsAreaFt2 } = useMemo(() => {
    let wallsIn2 = 0, ceilingsIn2 = 0, openingsIn2 = 0;
    rooms.forEach((r) => {
      const L = Number.isFinite(r.lengthIn) ? r.lengthIn : 0;
      const W = Number.isFinite(r.widthIn) ? r.widthIn : 0;
      const H = Number.isFinite(r.heightIn) ? r.heightIn : 0;
      const perimIn = 2 * (L + W);
      const wallIn2 = perimIn * H;
      const roomOpeningsIn2 = r.openings.reduce(
        (acc, o) =>
          acc +
          (Number.isFinite(o.widthIn) ? o.widthIn : 0) *
            (Number.isFinite(o.heightIn) ? o.heightIn : 0) *
            (Number.isFinite(o.count) ? o.count : 0),
        0
      );
      openingsIn2 += roomOpeningsIn2;
      wallsIn2 += Math.max(0, wallIn2 - roomOpeningsIn2);
      if (r.includeCeiling) ceilingsIn2 += L * W;
    });
    return {
      totalWallAreaFt2: areaSqFtFromInches2(wallsIn2),
      totalCeilingAreaFt2: areaSqFtFromInches2(ceilingsIn2),
      totalOpeningsAreaFt2: areaSqFtFromInches2(openingsIn2),
    };
  }, [rooms]);

  const coverageFt2 = useMemo(
    () => totalWallAreaFt2 + (drywall.coverCeilings ? totalCeilingAreaFt2 : 0),
    [totalWallAreaFt2, totalCeilingAreaFt2, drywall.coverCeilings]
  );
  const purchasedAreaFt2 = useMemo(
    () =>
      drywall.selections.reduce((acc, s) => {
        const b = BOARD_OPTIONS.find((x) => x.id === s.boardId);
        if (!b) return acc;
        const sheetArea = (b.widthIn * b.lengthIn) / (IN_PER_FT * IN_PER_FT);
        const qty = Number.isFinite(s.quantity) ? s.quantity : 0;
        return acc + sheetArea * qty;
      }, 0),
    [drywall.selections]
  );
  const drywallCost = useMemo(
    () =>
      drywall.selections.reduce(
        (acc, s) =>
          acc +
          (Number.isFinite(s.quantity) ? s.quantity : 0) *
            (Number.isFinite(s.unitPrice) ? s.unitPrice : 0),
        0
      ),
    [drywall.selections]
  );
  const manualCost = manualMaterials.reduce(
    (acc, m) => acc + (m.quantity || 0) * (m.unitPrice || 0),
    0
  );
  const grandTotal = drywallCost + manualCost;
  const targetFt2 = coverageFt2 * (1 + (drywall.wastePct || 0) / 100);
  const coveragePct = targetFt2 > 0 ? Math.min(999, (purchasedAreaFt2 / targetFt2) * 100) : 0;

  // --- CONTENT & SEO ---
  const faqs = [
    {
      question: "How many sheets of drywall do I need for a 12x12 foot room?",
      answer: "For a 12x12 foot room with 8-foot ceilings, you'll have approximately 576 square feet of wall area (accounting for door and window openings). Standard 4x8 drywall sheets cover 32 square feet each, so you'd need roughly 18 sheets for the walls alone, plus additional sheets for the ceiling. Adding 10-15% for waste and cuts, plan for approximately 23-25 sheets total for a complete room.",
    },
    {
      question: "What is the standard size of a drywall sheet?",
      answer: "The most common drywall sheet size is 4 feet wide by 8 feet long (4x8), which covers 32 square feet and weighs approximately 57 pounds. Other standard sizes include 4x10 (40 sq ft, 71 lbs), 4x12 (48 sq ft, 85 lbs), and 4x16 (64 sq ft, 113 lbs). Residential projects typically use 4x8 sheets for their ease of handling and installation, while larger commercial projects may use 4x12 or 4x16 for faster coverage.",
    },
    {
      question: "How do I calculate drywall area for an irregularly shaped room?",
      answer: "Break the room into rectangular sections and calculate the area of each section separately using length × height, then add all sections together. For example, an L-shaped room can be divided into two rectangles—calculate wall area for each rectangle, then sum them. Don't forget to subtract window and door openings (standard doors are ~20 sq ft, windows vary from 5–20 sq ft depending on size).",
    },
    {
      question: "Should I add extra drywall sheets for waste?",
      answer: "Yes, industry standards recommend adding 10-15% extra material to account for cuts, mistakes, and damage during installation and transport. For a project requiring 20 sheets, add 2-3 extra sheets (10-15%) to your order, bringing the total to 22-23 sheets. This buffer prevents costly job delays and reduces the need for additional trips to the supplier.",
    },
    {
      question: "What thickness of drywall should I use?",
      answer: "Standard residential drywall is 5/8 inch thick, which provides good fire resistance and sound dampening for most applications. For ceilings, 5/8 inch is recommended to prevent sagging, while 1/2 inch can be used on walls in non-critical areas. Check local building codes, as some require 5/8 inch for fire-rated assemblies, and commercial applications may have specific requirements.",
    },
    {
      question: "How do I account for doors and windows in my drywall calculation?",
      answer: "Measure the height and width of each opening and subtract its area from your total wall area. A standard 36-inch wide by 80-inch tall door opening equals 20 square feet; a typical window might be 3x4 feet (12 sq ft). For example, a 200 sq ft wall with one door and two windows would reduce to approximately 156 sq ft of actual drywall needed.",
    },
    {
      question: "How much does a sheet of drywall cost?",
      answer: "As of 2024-2025, standard 4x8 drywall sheets typically cost $12–$18 per sheet depending on location and supplier, with specialty types (fire-rated, moisture-resistant) running $18–$25 per sheet. A typical 1,000 sq ft project requiring 31 sheets might cost $370–$560 in materials alone, not including labor or fasteners. Bulk purchases and seasonal sales can reduce unit costs by 10-20%.",
    },
    {
      question: "What fasteners and supplies do I need per sheet of drywall?",
      answer: "A standard 4x8 drywall sheet requires approximately 40-50 drywall screws (if using screws) or 200-250 drywall nails (if using nails), spaced 12-16 inches apart on studs and joists. You'll also need drywall joint compound (mud), joint tape, primer, and paint—plan for approximately 1.5 gallons of joint compound and 1 roll of 250-foot tape per 100 sq ft. Budget roughly $100–$200 in supplies for a 1,000 sq ft project.",
    },
    {
      question: "How do I calculate drywall for ceiling installation?",
      answer: "Ceiling drywall calculation is straightforward: multiply room length by width to get the ceiling area. For a 12x15 foot ceiling, that's 180 square feet; divide by 32 (for 4x8 sheets) to get 5.625, so order 6 sheets minimum. Add 10-15% for waste, bringing the ceiling total to 7 sheets, and remember that 5/8-inch drywall is recommended for ceilings to prevent sagging over time.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="mx-auto w-full p-2 sm:p-0">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">Project Configuration</h2>
          <p className="text-sm text-slate-500">
            Define your rooms and openings below.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium" htmlFor="unit-system">Units</label>
            <Select value={unit} onChange={setUnit} className="w-auto" id="unit-system" name="unit-system" ariaLabel="Unit system">
              <option value={UnitSystem.IMPERIAL}>Imperial (ft/in)</option>
              <option value={UnitSystem.METRIC}>Metric (m)</option>
            </Select>
          </div>
          <button
            onClick={() => {
              if (confirm("Reset all inputs?")) {
                setRooms([DEFAULT_ROOM()]);
                setDrywall(DEFAULT_DRYWALL_CONFIG);
                setManualMaterials([DEFAULT_MATERIAL()]);
              }
            }}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Summary cards */}
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard title="Total Wall Area" value={fmtArea(totalWallAreaFt2, unit)} />
        <SummaryCard title="Total Ceiling Area" value={fmtArea(totalCeilingAreaFt2, unit)} />
        <SummaryCard title="Openings Deducted" value={fmtArea(totalOpeningsAreaFt2, unit)} />
      </section>

      {/* Rooms */}
      <section className="mb-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Rooms</h2>
          <button
            onClick={() =>
              setRooms((prev) => [
                ...prev,
                { ...DEFAULT_ROOM(), name: `Room ${prev.length + 1}` },
              ])
            }
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors"
          >
            + Add Room
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {rooms.map((r, idx) => (
            <div key={r.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium" htmlFor={`room-${r.id}-name`}>Room</label>
                  <input
                    id={`room-${r.id}-name`}
                    name={`room-${r.id}-name`}
                    className="w-48 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 shadow-sm text-sm"
                    value={r.name}
                    onChange={(e) =>
                      setRooms((prev) =>
                        prev.map((rr) => (rr.id === r.id ? { ...rr, name: e.target.value } : rr))
                      )
                    }
                  />
                  <span className="text-xs text-slate-400">#{idx + 1}</span>
                </div>
                <button
                  onClick={() => setRooms((prev) => prev.filter((rr) => rr.id !== r.id))}
                  className="rounded-lg bg-rose-100 dark:bg-rose-900/30 px-3 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/50"
                >
                  Remove Room
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <FieldWithUnit
                  label="Length"
                  unitLabel={unit === UnitSystem.IMPERIAL ? "ft" : "m"}
                  value={inchesToUnit(r.lengthIn, unit)}
                  onChange={(v) =>
                    setRooms((prev) =>
                      prev.map((rr) =>
                        rr.id === r.id
                          ? { ...rr, lengthIn: Number.isFinite(v) ? toInches(v, unit) : rr.lengthIn }
                          : rr
                      )
                    )
                  }
                  id={`room-${r.id}-length`}
                />
                <FieldWithUnit
                  label="Width"
                  unitLabel={unit === UnitSystem.IMPERIAL ? "ft" : "m"}
                  value={inchesToUnit(r.widthIn, unit)}
                  onChange={(v) =>
                    setRooms((prev) =>
                      prev.map((rr) =>
                        rr.id === r.id
                          ? { ...rr, widthIn: Number.isFinite(v) ? toInches(v, unit) : rr.widthIn }
                          : rr
                      )
                    )
                  }
                  id={`room-${r.id}-width`}
                />
                <FieldWithUnit
                  label="Height"
                  unitLabel={unit === UnitSystem.IMPERIAL ? "ft" : "m"}
                  value={inchesToUnit(r.heightIn, unit)}
                  onChange={(v) =>
                    setRooms((prev) =>
                      prev.map((rr) =>
                        rr.id === r.id
                          ? { ...rr, heightIn: Number.isFinite(v) ? toInches(v, unit) : rr.heightIn }
                          : rr
                      )
                    )
                  }
                  id={`room-${r.id}-height`}
                />
                <div className="flex items-end h-full pb-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={r.includeCeiling}
                      onChange={(e) =>
                        setRooms((prev) =>
                          prev.map((rr) =>
                            rr.id === r.id ? { ...rr, includeCeiling: e.target.checked } : rr
                          )
                        )
                      }
                    />
                    Include Ceiling
                  </label>
                </div>
              </div>

              {/* Openings */}
              <div className="mt-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Openings (Windows/Doors)</h3>
                  <button
                    onClick={() =>
                      setRooms((prev) =>
                        prev.map((rr) =>
                          rr.id === r.id
                            ? { ...rr, openings: [...rr.openings, DEFAULT_OPENING()] }
                            : rr
                        )
                      )
                    }
                    className="rounded-md bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    + Add Opening
                  </button>
                </div>
                {r.openings.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No openings added yet.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {r.openings.map((o) => (
                      <div key={o.id} className="grid grid-cols-1 items-end gap-3 sm:grid-cols-6 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                        <div className="sm:col-span-1">
                          <label className="mb-1 block text-xs font-medium" htmlFor={`opening-${o.id}-type`}>Type</label>
                          <Select
                            id={`opening-${o.id}-type`}
                            name={`opening-${o.id}-type`}
                            ariaLabel="Opening type"
                            className="text-sm py-1"
                            value={o.label}
                            onChange={(v: "Window" | "Door") =>
                              setRooms((prev) =>
                                prev.map((rr) =>
                                  rr.id !== r.id
                                    ? rr
                                    : {
                                        ...rr,
                                        openings: rr.openings.map((oo) =>
                                          oo.id === o.id ? { ...oo, label: v } : oo
                                        ),
                                      }
                                )
                              )
                            }
                          >
                            <option value="Window">Window</option>
                            <option value="Door">Door</option>
                          </Select>
                        </div>
                        <div className="sm:col-span-2">
                          <FieldWithUnit
                            label="Width"
                            unitLabel={unit === UnitSystem.IMPERIAL ? "in" : "cm"}
                            value={unit === UnitSystem.IMPERIAL ? o.widthIn : (o.widthIn * CM_PER_IN) / 100}
                            onChange={(v) =>
                              setRooms((prev) =>
                                prev.map((rr) =>
                                  rr.id !== r.id
                                    ? rr
                                    : {
                                        ...rr,
                                        openings: rr.openings.map((oo) =>
                                          oo.id === o.id
                                            ? {
                                                ...oo,
                                                widthIn: Number.isFinite(v)
                                                  ? unit === UnitSystem.IMPERIAL
                                                    ? v
                                                    : (v * 100) / CM_PER_IN
                                                  : oo.widthIn,
                                              }
                                            : oo
                                        ),
                                      }
                                )
                              )
                            }
                            id={`opening-${o.id}-width`}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <FieldWithUnit
                            label="Height"
                            unitLabel={unit === UnitSystem.IMPERIAL ? "in" : "cm"}
                            value={unit === UnitSystem.IMPERIAL ? o.heightIn : (o.heightIn * CM_PER_IN) / 100}
                            onChange={(v) =>
                              setRooms((prev) =>
                                prev.map((rr) =>
                                  rr.id !== r.id
                                    ? rr
                                    : {
                                        ...rr,
                                        openings: rr.openings.map((oo) =>
                                          oo.id === o.id
                                            ? {
                                                ...oo,
                                                heightIn: Number.isFinite(v)
                                                  ? unit === UnitSystem.IMPERIAL
                                                    ? v
                                                    : (v * 100) / CM_PER_IN
                                                  : oo.heightIn,
                                              }
                                            : oo
                                        ),
                                      }
                                )
                              )
                            }
                            id={`opening-${o.id}-height`}
                          />
                        </div>
                        <div className="sm:col-span-1">
                          <button
                            onClick={() =>
                              setRooms((prev) =>
                                prev.map((rr) =>
                                  rr.id !== r.id
                                    ? rr
                                    : {
                                        ...rr,
                                        openings: rr.openings.filter((oo) => oo.id !== o.id),
                                      }
                                )
                              )
                            }
                            className="w-full rounded-lg bg-rose-600 px-2 py-2 text-xs text-white hover:bg-rose-700"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Drywall Boards */}
      <section className="mb-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Material Selection</h2>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none" htmlFor="cover-ceilings">
            <input
              type="checkbox"
              id="cover-ceilings"
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              name="cover-ceilings"
              checked={drywall.coverCeilings}
              onChange={(e) => setDrywall((d) => ({ ...d, coverCeilings: e.target.checked }))}
            />
            Global: Include ceilings
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {drywall.selections.map((s) => (
            <div key={s.id} className="grid grid-cols-1 items-end gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-3 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium" htmlFor={`board-selection-${s.id}-size`}>Sheet Size</label>
                <Select
                  value={s.boardId}
                  onChange={(v: string) =>
                    setDrywall((d) => ({
                      ...d,
                      selections: d.selections.map((x) => (x.id === s.id ? { ...x, boardId: v } : x)),
                    }))
                  }
                  id={`board-selection-${s.id}-size`}
                  name={`board-selection-${s.id}-size`}
                  ariaLabel="Sheet Size"
                >
                  {BOARD_OPTIONS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="sm:col-span-1">
                <label className="mb-1 block text-sm font-medium" htmlFor={`board-selection-${s.id}-thickness`}>Thick.</label>
                <Select
                  value={s.thickness}
                  onChange={(v: string) =>
                    setDrywall((d) => ({
                      ...d,
                      selections: d.selections.map((x) => (x.id === s.id ? { ...x, thickness: v } : x)),
                    }))
                  }
                  id={`board-selection-${s.id}-thickness`}
                  name={`board-selection-${s.id}-thickness`}
                  ariaLabel="Thickness"
                >
                  {THICKNESS_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="sm:col-span-1">
                <label className="mb-1 block text-sm font-medium" htmlFor={`board-selection-${s.id}-quantity`}>Qty</label>
                <NumInput
                  value={s.quantity}
                  onChange={(v) =>
                    setDrywall((d) => ({
                      ...d,
                      selections: d.selections.map((x) =>
                        x.id === s.id
                          ? { ...x, quantity: Number.isFinite(v) ? Math.max(0, Math.round(v)) : x.quantity }
                          : x
                      ),
                    }))
                  }
                  id={`board-selection-${s.id}-quantity`}
                  name={`board-selection-${s.id}-quantity`}
                  ariaLabel="Quantity (sheets)"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="mb-1 block text-sm font-medium" htmlFor={`board-selection-${s.id}-unitprice`}>Price ($)</label>
                <NumInput
                  value={s.unitPrice}
                  onChange={(v) =>
                    setDrywall((d) => ({
                      ...d,
                      selections: d.selections.map((x) =>
                        x.id === s.id
                          ? { ...x, unitPrice: Number.isFinite(v) ? Math.max(0, v) : x.unitPrice }
                          : x
                      ),
                    }))
                  }
                  id={`board-selection-${s.id}-unitprice`}
                  name={`board-selection-${s.id}-unitprice`}
                  ariaLabel="Unit Price ($)"
                />
              </div>
              <div className="sm:col-span-1">
                <button
                  onClick={() => setDrywall((d) => ({ ...d, selections: d.selections.filter((x) => x.id !== s.id) }))}
                  className="w-full rounded-lg bg-rose-600 px-2 py-2 text-white hover:bg-rose-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div>
            <button
              onClick={() => setDrywall((d) => ({ ...d, selections: [...d.selections, DEFAULT_SELECTION()] }))}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
            >
              + Add Another Board Type
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="grid grid-cols-1 gap-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-100 dark:border-slate-800">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="drywall-waste-pct">Waste Factor %</label>
              <NumInput
                value={drywall.wastePct}
                onChange={(v) =>
                  setDrywall((d) => ({ ...d, wastePct: Number.isFinite(v) ? Math.max(0, v) : d.wastePct }))
                }
                id="drywall-waste-pct"
                name="drywall-waste-pct"
                ariaLabel="Waste percentage"
              />
              <p className="text-xs text-slate-500 mt-1">Recommended: 10% for standard, 15-20% for complex jobs.</p>
            </div>
            <SummaryRow label="Total Surface Area" value={fmtArea(coverageFt2, unit)} />
            <SummaryRow label="Target Area (+ waste)" value={`${targetFt2.toFixed(2)} ft²`} />
            <SummaryRow label="Actual Coverage (Purchased)" value={`${purchasedAreaFt2.toFixed(2)} ft²`} />
            <div className={`flex items-center justify-between rounded-lg px-3 py-2 border ${coveragePct >= 100 ? 'bg-green-50 border-green-100 text-green-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
               <span className="text-sm font-medium">Coverage Status</span>
               <span className="font-bold">{coveragePct.toFixed(0)}%</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-100 dark:border-slate-800 h-fit">
            <SummaryRow label={`Drywall Total`} value={`$${drywallCost.toFixed(2)}`} />
            <SummaryRow label={`Other Materials`} value={`$${manualCost.toFixed(2)}`} />
            <div className="flex items-center justify-between rounded-lg bg-slate-900 text-white px-3 py-3 mt-2">
              <span className="text-sm font-medium">Grand Total</span>
              <span className="text-xl font-bold">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Other Materials */}
      <section className="mb-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Other Materials (Mud, Tape, Screws)</h2>
          <button
            onClick={() => setManualMaterials((prev) => [...prev, DEFAULT_MATERIAL()])}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
          >
            + Add Item
          </button>
        </div>
        {manualMaterials.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No extra materials added.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {manualMaterials.map((m) => (
              <div key={m.id} className="grid grid-cols-1 items-end gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-3 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium" htmlFor={`manual-material-${m.id}-name`}>Name</label>
                  <input
                    className="w-full rounded-lg border bg-white dark:bg-slate-950 px-3 py-2 shadow-sm text-sm border-slate-200 dark:border-slate-800"
                    value={m.name}
                    onChange={(e) =>
                      setManualMaterials((prev) =>
                        prev.map((x) => (x.id === m.id ? { ...x, name: e.target.value } : x))
                      )
                    }
                    id={`manual-material-${m.id}-name`}
                    name={`manual-material-${m.id}-name`}
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-medium" htmlFor={`manual-material-${m.id}-quantity`}>Qty</label>
                  <NumInput
                    value={m.quantity}
                    onChange={(v) =>
                      setManualMaterials((prev) =>
                        prev.map((x) => (x.id === m.id ? { ...x, quantity: Number.isFinite(v) ? Math.max(0, Math.round(v)) : x.quantity } : x))
                      )
                    }
                    id={`manual-material-${m.id}-quantity`}
                    name={`manual-material-${m.id}-quantity`}
                    ariaLabel="Quantity"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-medium" htmlFor={`manual-material-${m.id}-unitprice`}>Price ($)</label>
                  <NumInput
                    value={m.unitPrice}
                    onChange={(v) =>
                      setManualMaterials((prev) =>
                        prev.map((x) => (x.id === m.id ? { ...x, unitPrice: Number.isFinite(v) ? Math.max(0, v) : x.unitPrice } : x))
                      )
                    }
                    id={`manual-material-${m.id}-unitprice`}
                    name={`manual-material-${m.id}-unitprice`}
                    ariaLabel="Unit Price ($)"
                  />
                </div>
                <div className="sm:col-span-1 sm:col-start-6">
                  <button
                    onClick={() =>
                      setManualMaterials((prev) => prev.filter((x) => x.id !== m.id))
                    }
                    className="w-full rounded-lg bg-rose-600 px-2 py-2 text-white hover:bg-rose-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Drywall Area & Sheets Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Drywall Area & Sheets Calculator is designed to help contractors, DIYers, and project managers accurately estimate the quantity of drywall sheets needed for walls, ceilings, and other surfaces. By inputting room dimensions and accounting for openings, this tool eliminates guesswork and prevents over-ordering or under-ordering materials, saving both time and money on construction projects.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator requires key measurements: the length and height of each wall section, ceiling dimensions, and the size of door and window openings. Most users input measurements in feet, and the calculator automatically converts these to total square footage, then determines how many standard 4x8 sheets (or alternative sizes) are needed based on the coverage area of 32 square feet per sheet.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results provide the total drywall sheets required plus a built-in waste factor (typically 10-15%) to account for cuts, breakage, and installation irregularities. Review the output sheet count, cross-reference it with your material budget and project timeline, and add fasteners, joint compound, and finishing supplies based on the coverage estimates provided.</p>
        </div>
      </section>

      {/* TABLE: Standard Drywall Sheet Sizes & Coverage */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Standard Drywall Sheet Sizes & Coverage</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Common drywall sheet dimensions used in residential and commercial construction with their respective coverage areas and approximate weights.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sheet Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Coverage Area (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4x8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">57</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Residential walls and ceilings</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4x10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">71</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Faster coverage on tall walls</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4x12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Commercial projects, large walls</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4x16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">64</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">113</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Industrial and large-scale projects</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3x8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">43</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Soffits and narrow spaces</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Weights are for standard 5/8-inch fire-rated drywall; lightweight and specialty types may vary.</p>
      </section>

      {/* TABLE: Drywall Requirements by Room Size (with 10% Waste) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Drywall Requirements by Room Size (with 10% Waste)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Estimated sheets needed for complete room coverage including walls and ceiling at standard 8-foot ceiling height.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Room Dimensions</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Wall Area (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ceiling Area (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Sheets Needed (4x8)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10x10 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12x12 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">384</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">144</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12x15 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">432</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15x20 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">560</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20x20 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">640</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations assume 8-foot ceiling height and account for one standard door (20 sq ft) and two windows (24 sq ft total). Actual requirements may vary based on openings and architectural features.</p>
      </section>

      {/* TABLE: Drywall Material Pricing & Fastener Estimates (2024-2025) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Drywall Material Pricing & Fastener Estimates (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Typical costs for drywall sheets, fasteners, and finishing supplies per 1,000 square feet of coverage.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Material Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Quantity per 1,000 sq ft</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Unit Price</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4x8 Drywall Sheets (standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31 sheets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$14–$18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$434–$558</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Drywall Screws (boxes)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 boxes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8–$12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$24–$36</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Joint Compound (buckets)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4–5 buckets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12–$18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$48–$90</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Joint Tape (rolls)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 rolls</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6–$8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$24–$32</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Primer & Paint (gallons)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–4 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20–$35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60–$140</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Total Estimated Materials</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$590–$856</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs vary by region, supplier, and specialty drywall types (fire-rated, moisture-resistant). Labor costs typically add $1.50–$3.50 per square foot to total project cost.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always measure twice and account for all wall sections, including closets, alcoves, and half-walls—missing even one wall can result in material shortages and project delays.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">When calculating ceiling drywall, use 5/8-inch thickness instead of 1/2-inch to prevent sagging over time; this thickness is also recommended for fire-rated assemblies in most building codes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Order 10-15% extra material beyond your calculated needs; the buffer covers mistakes, damage during transport and installation, and future repairs without requiring additional supplier trips.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Group openings (doors and windows) by wall section for easier subtraction; a single large opening is easier to account for than multiple small ones scattered across different walls.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to subtract door and window openings</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many DIYers calculate total wall area without subtracting openings, leading to over-ordering by 5-15 sheets on larger projects. Always measure and subtract each door (typically 20 sq ft), window (5–20 sq ft), and alcove opening from your total wall area before dividing by sheet coverage.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using wrong sheet size calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming all projects use 4x8 sheets when 4x12 or 4x10 sheets might be more efficient can result in unnecessary waste and extra fastener expenses. Check project requirements and ceiling height; taller walls or commercial projects may benefit from larger sheet sizes that reduce seams and labor time.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting to add waste factor</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating exact drywall needs without a 10-15% buffer for cuts and mistakes often results in running short mid-project, forcing costly expedited orders and schedule delays. Always add extra sheets upfront—the material is cheaper than the labor and time lost waiting for resupply.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for architectural features</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Vaulted ceilings, sloped walls, soffits, and accent walls require additional drywall beyond standard rectangular calculations, and skipping these can leave sections unfinished. Measure and calculate non-standard features separately, or request professional estimates if the room layout is complex.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many sheets of drywall do I need for a 12x12 foot room?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For a 12x12 foot room with 8-foot ceilings, you'll have approximately 576 square feet of wall area (accounting for door and window openings). Standard 4x8 drywall sheets cover 32 square feet each, so you'd need roughly 18 sheets for the walls alone, plus additional sheets for the ceiling. Adding 10-15% for waste and cuts, plan for approximately 23-25 sheets total for a complete room.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard size of a drywall sheet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The most common drywall sheet size is 4 feet wide by 8 feet long (4x8), which covers 32 square feet and weighs approximately 57 pounds. Other standard sizes include 4x10 (40 sq ft, 71 lbs), 4x12 (48 sq ft, 85 lbs), and 4x16 (64 sq ft, 113 lbs). Residential projects typically use 4x8 sheets for their ease of handling and installation, while larger commercial projects may use 4x12 or 4x16 for faster coverage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate drywall area for an irregularly shaped room?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Break the room into rectangular sections and calculate the area of each section separately using length × height, then add all sections together. For example, an L-shaped room can be divided into two rectangles—calculate wall area for each rectangle, then sum them. Don't forget to subtract window and door openings (standard doors are ~20 sq ft, windows vary from 5–20 sq ft depending on size).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I add extra drywall sheets for waste?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, industry standards recommend adding 10-15% extra material to account for cuts, mistakes, and damage during installation and transport. For a project requiring 20 sheets, add 2-3 extra sheets (10-15%) to your order, bringing the total to 22-23 sheets. This buffer prevents costly job delays and reduces the need for additional trips to the supplier.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What thickness of drywall should I use?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard residential drywall is 5/8 inch thick, which provides good fire resistance and sound dampening for most applications. For ceilings, 5/8 inch is recommended to prevent sagging, while 1/2 inch can be used on walls in non-critical areas. Check local building codes, as some require 5/8 inch for fire-rated assemblies, and commercial applications may have specific requirements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for doors and windows in my drywall calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure the height and width of each opening and subtract its area from your total wall area. A standard 36-inch wide by 80-inch tall door opening equals 20 square feet; a typical window might be 3x4 feet (12 sq ft). For example, a 200 sq ft wall with one door and two windows would reduce to approximately 156 sq ft of actual drywall needed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does a sheet of drywall cost?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">As of 2024-2025, standard 4x8 drywall sheets typically cost $12–$18 per sheet depending on location and supplier, with specialty types (fire-rated, moisture-resistant) running $18–$25 per sheet. A typical 1,000 sq ft project requiring 31 sheets might cost $370–$560 in materials alone, not including labor or fasteners. Bulk purchases and seasonal sales can reduce unit costs by 10-20%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What fasteners and supplies do I need per sheet of drywall?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A standard 4x8 drywall sheet requires approximately 40-50 drywall screws (if using screws) or 200-250 drywall nails (if using nails), spaced 12-16 inches apart on studs and joists. You'll also need drywall joint compound (mud), joint tape, primer, and paint—plan for approximately 1.5 gallons of joint compound and 1 roll of 250-foot tape per 100 sq ft. Budget roughly $100–$200 in supplies for a 1,000 sq ft project.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate drywall for ceiling installation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Ceiling drywall calculation is straightforward: multiply room length by width to get the ceiling area. For a 12x15 foot ceiling, that's 180 square feet; divide by 32 (for 4x8 sheets) to get 5.625, so order 6 sheets minimum. Add 10-15% for waste, bringing the ceiling total to 7 sheets, and remember that 5/8-inch drywall is recommended for ceilings to prevent sagging over time.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.gypsum.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Gypsum Association: Drywall Installation Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official industry guidance on drywall sizing, spacing, fastening, and installation best practices for residential and commercial applications.</p>
          </li>
          <li>
            <a href="https://www.iccsafe.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Building Code (IBC) - Gypsum Board Assemblies</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Building code requirements for drywall thickness, fire ratings, and structural assembly specifications that vary by region and building type.</p>
          </li>
          <li>
            <a href="https://www.nahb.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NAHB (National Association of Home Builders) - Construction Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Guidelines for residential construction material specifications, including drywall grades, moisture-resistant types, and installation methods.</p>
          </li>
          <li>
            <a href="https://www.udaca.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">United States Drywall & Acoustical Contractors Association (UDACA)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional standards and technical resources for drywall contractors covering measurement, estimation, and quality control procedures.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Drywall Area & Sheets Calculator"
      description="The professional guide to drywall estimation. Calculate sheets, mud, tape, and costs for walls and ceilings with precision."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      relatedCalculators={[
         { title: "Paint Calculator", url: "/construction/paint-coverage-gallons", icon: "🎨" },
         { title: "Insulation Calculator", url: "/construction/insulation-r-value-requirement", icon: "🏠" },
         { title: "Flooring Cost", url: "/construction/flooring-material-cost", icon: "💲" }
      ]}
      onThisPage={[
         { id: "guide", label: "Drywall Guide" },
         { id: "mistakes", label: "Common Mistakes" },
         { id: "faq", label: "FAQ" },
        { id: "references", label: "References & Resources" }
      ]}
      showTopBanner showSidebar showBottomBanner
    />
  );
}
