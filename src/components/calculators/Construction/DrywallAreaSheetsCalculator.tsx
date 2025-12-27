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
      question: "Should I hang drywall horizontally or vertically?",
      answer: "For most residential walls (up to 9ft high), horizontal hanging is generally preferred. It reduces the total linear footage of joints by about 25%, making finishing easier and keeping joints at a convenient height. However, for walls taller than 9ft or commercial metal stud framing, vertical installation is often required to maintain fire ratings and structural rigidity."
    },
    {
      question: "How do I calculate how much joint compound (mud) I need?",
      answer: "A general rule of thumb for standard finishing is approximately 0.053 pounds of ready-mixed compound per square foot of drywall. Alternatively, plan for roughly 1 gallon of mud for every 100-150 square feet of drywall. This covers embedding tape, filling screws, and two finishing coats."
    },
    {
      question: "What is the best drywall thickness for my project?",
      answer: "Standard residential walls use 1/2-inch (12.7mm) drywall. For ceilings, 5/8-inch (15.9mm) 'Type X' is recommended to prevent sagging and improve fire resistance. 1/4-inch drywall is used primarily for covering existing walls or for curved surfaces."
    },
    {
      question: "Do I need to account for openings like windows and doors?",
      answer: "Yes, but with a caveat. While you technically don't cover openings, you often cannot use the cutout pieces elsewhere efficiently. Professional estimators calculate the full wall area (ignoring small openings) to ensure they have enough full sheets to span across headers and minimize joints around stress points like door corners."
    },
    {
      question: "Why should I avoid lining up joints with door jambs?",
      answer: "Aligning a drywall joint perfectly with the vertical edge of a door or window frame creates a continuous stress line. Vibrations from closing the door will almost certainly cause this joint to crack over time. Instead, 'flag' the sheet by cutting an L-shape so the joint lands above the middle of the header, distributing the stress."
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
      <section id="guide" className="scroll-mt-24">
         <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <BookOpen className="w-6 h-6 text-blue-500"/> Ultimate Drywall Guide
         </h2>
         <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
               Drywall installation (often called "hanging rock") is a skill that blends precision measurement with physical endurance. The goal is to cover the framing with as few sheets as possible to minimize the number of joints that need finishing. Fewer joints mean less taping, less mudding, and a flatter, better-looking wall.
            </p>
            <p>
               Selecting the right drywall type is critical. <strong>Regular</strong> 1/2-inch board is standard for walls. <strong>Green Board</strong> or mold-resistant drywall is essential for bathrooms and kitchens. For garages or furnace rooms, local codes often require 5/8-inch <strong>Type X</strong> fire-resistant drywall. Always check your local building codes before purchasing materials.
            </p>
         </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
         <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <AlertTriangle className="w-5 h-5"/> Costly Mistakes to Avoid
         </h3>
         <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <p><strong>1. Lining up joints with door jambs:</strong> This creates a weak point that will almost certainly crack due to door vibrations. Always cut the sheet around the opening ("flagging") so the joint lands above the middle of the header.</p>
            <p><strong>2. Ignoring screw depth:</strong> Breaking the paper face with the screw head reduces holding power significantly. The screw head should sit just below the surface in a dimple, without tearing the paper.</p>
            <p><strong>3. Not staggering joints:</strong> Never allow four corners of drywall sheets to meet at one point. Always stagger butt joints (the short ends) to create a stronger wall and hide seams better.</p>
         </div>
      </section>

      <section id="faq">
         <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
         <div className="space-y-6">
            {faqs.map((faq, i) => (
               <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                     {faq.answer}
                  </p>
               </div>
            ))}
         </div>
      </section>
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">

          <li>
            <a href="https://www.thisoldhouse.com/search?q=Drywall%20Installation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Drywall Installation - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Drywall Installation from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Drywall%20Installation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Drywall Installation - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Drywall Installation, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.energy.gov/search/site?keywords=Drywall%20Installation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Drywall Installation - Energy.gov
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Official Department of Energy guidelines for energy efficiency and Drywall Installation to save money and improve home comfort.
            </p>
          </li>
          <li>
            <a href="https://www.ashrae.org/search?q=Drywall%20Installation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Drywall Installation - ASHRAE
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Technical standards and guidelines for HVAC and building systems related to Drywall Installation.
            </p>
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
