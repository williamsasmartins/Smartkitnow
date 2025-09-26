import React, { useState, useEffect, useMemo } from "react";

/**
 * Drywall Calculator – Full Preview (Advanced)
 * - Imperial por padrão (ft/in). Mantém opção de Metric (m/cm) se desejar.
 * - Rooms com Length/Width/Height (um clique, digita 145 de uma vez).
 * - Openings (dropdown Window/Door + width/height/count).
 * - Drywall Boards (sheet size + thickness 1/4", 1/2", 5/8" + qty + $).
 * - Resumo de área (Project/Purchased/Target) e custos ($ apenas).
 * - IDs seguros (sem exigir crypto.randomUUID).
 * - Salva estado no localStorage.
 */

const IN_PER_FT = 12;
const CM_PER_IN = 2.54;
const M_PER_FT = 0.3048;
const FT2_TO_M2 = 0.09290304;
const DECIMAL_RE = /^\d*(?:\.\d*)?$/;

function safeId() {
  try {
    // @ts-ignore
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
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
const THICKNESS_OPTIONS = ["1/4\"", "1/2\"", "5/8\""] as const;

const DEFAULT_ROOM = (): Room => ({
  id: safeId(),
  name: "Room",
  lengthIn: 12 * IN_PER_FT,
  widthIn: 10 * IN_PER_FT,
  heightIn: 8 * IN_PER_FT,
  includeCeiling: true,
  openings: [],
});
const DEFAULT_OPENING = (): Opening => ({ id: safeId(), label: "Window", widthIn: 36, heightIn: 48, count: 1 });
const DEFAULT_SELECTION = (): BoardSelection => ({ id: safeId(), boardId: BOARD_OPTIONS[0].id, thickness: THICKNESS_OPTIONS[1], quantity: 0, unitPrice: 15 });
const DEFAULT_DRYWALL_CONFIG: DrywallConfig = { coverCeilings: true, wastePct: 10, selections: [DEFAULT_SELECTION()] };
const DEFAULT_MATERIAL = (): ManualMaterial => ({ id: safeId(), name: "Joint Compound", size: "4.5 gal bucket", thickness: "N/A", quantity: 2, unitPrice: 22.5 });

const STORAGE_KEY = "drywall_calc_state_v4";

// ----- Inputs reutilizáveis -----
function NumInput({ value, onChange, className = "" }: { value: number; onChange: (n: number) => void; className?: string }) {
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
      className={`w-full rounded-lg border bg-background px-3 py-2 shadow-sm outline-none focus:ring ${className}`}
      value={text}
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

function Select({ value, onChange, children, className = "" }: any) {
  return (
    <select className={`w-full rounded-lg border bg-background px-3 py-2 shadow-sm ${className}`} value={value} onChange={(e) => onChange(e.target.value)}>
      {children}
    </select>
  );
}

function FieldWithUnit({ label, unitLabel, value, onChange }: { label: string; unitLabel: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm">{label} ({unitLabel})</label>
      <NumInput value={value} onChange={onChange} />
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

// ----- Componente principal -----
export default function DrywallEstimator() {
  const [unit, setUnit] = useState<UnitSystemKey>(UnitSystem.IMPERIAL);
  const [rooms, setRooms] = useState<Room[]>([DEFAULT_ROOM()]);
  const [drywall, setDrywall] = useState<DrywallConfig>(DEFAULT_DRYWALL_CONFIG);
  const [manualMaterials, setManualMaterials] = useState<ManualMaterial[]>([DEFAULT_MATERIAL()]);

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
    } catch {}
  }, []);
  useEffect(() => {
    const state = { rooms, drywall, manualMaterials, unit };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [rooms, drywall, manualMaterials, unit]);

  const { totalWallAreaFt2, totalCeilingAreaFt2, totalOpeningsAreaFt2 } = useMemo(() => {
    let wallsIn2 = 0, ceilingsIn2 = 0, openingsIn2 = 0;
    rooms.forEach((r) => {
      const L = Number.isFinite(r.lengthIn) ? r.lengthIn : 0;
      const W = Number.isFinite(r.widthIn) ? r.widthIn : 0;
      const H = Number.isFinite(r.heightIn) ? r.heightIn : 0;
      const perimIn = 2 * (L + W);
      const wallIn2 = perimIn * H;
      const roomOpeningsIn2 = r.openings.reduce((acc, o) => acc + (Number.isFinite(o.widthIn) ? o.widthIn : 0) * (Number.isFinite(o.heightIn) ? o.heightIn : 0) * (Number.isFinite(o.count) ? o.count : 0), 0);
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

  const coverageFt2 = useMemo(() => totalWallAreaFt2 + (drywall.coverCeilings ? totalCeilingAreaFt2 : 0), [totalWallAreaFt2, totalCeilingAreaFt2, drywall.coverCeilings]);
  const purchasedAreaFt2 = useMemo(() => drywall.selections.reduce((acc, s) => {
    const b = BOARD_OPTIONS.find((x) => x.id === s.boardId);
    if (!b) return acc;
    const sheetArea = (b.widthIn * b.lengthIn) / (IN_PER_FT * IN_PER_FT);
    const qty = Number.isFinite(s.quantity) ? s.quantity : 0;
    return acc + sheetArea * qty;
  }, 0), [drywall.selections]);
  const drywallCost = useMemo(() => drywall.selections.reduce((acc, s) => acc + (Number.isFinite(s.quantity) ? s.quantity : 0) * (Number.isFinite(s.unitPrice) ? s.unitPrice : 0), 0), [drywall.selections]);
  const manualCost = manualMaterials.reduce((acc, m) => acc + (m.quantity || 0) * (m.unitPrice || 0), 0);
  const grandTotal = drywallCost + manualCost;
  const targetFt2 = coverageFt2 * (1 + (drywall.wastePct || 0) / 100);
  const coveragePct = targetFt2 > 0 ? Math.min(999, (purchasedAreaFt2 / targetFt2) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Drywall Calculator (US)</h1>
          <p className="text-muted-foreground">Rooms, openings, boards, and costs — with local save.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm">Units</label>
            <Select value={unit} onChange={setUnit} className="w-auto">
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
            className="rounded-xl bg-red-600 px-4 py-2 text-white shadow hover:brightness-110"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Summary cards */}
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard title="Wall Area" value={fmtArea(totalWallAreaFt2, unit)} />
        <SummaryCard title="Ceiling Area" value={fmtArea(totalCeilingAreaFt2, unit)} />
        <SummaryCard title="Openings Deducted" value={fmtArea(totalOpeningsAreaFt2, unit)} />
      </section>

      {/* Rooms */}
      <section className="mb-8 rounded-2xl border p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Rooms</h2>
          <button onClick={() => setRooms((prev) => [...prev, { ...DEFAULT_ROOM(), name: `Room ${prev.length + 1}` }])} className="rounded-xl bg-primary px-4 py-2 text-primary-foreground shadow hover:brightness-110">+ Add Room</button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {rooms.map((r, idx) => (
            <div key={r.id} className="rounded-2xl border p-4 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <input className="w-56 rounded-lg border bg-background px-3 py-2 shadow-sm" value={r.name} onChange={(e) => setRooms((prev) => prev.map((rr) => (rr.id === r.id ? { ...rr, name: e.target.value } : rr)))} />
                  <span className="text-sm text-muted-foreground">#{idx + 1}</span>
                </div>
                <button onClick={() => setRooms((prev) => prev.filter((rr) => rr.id !== r.id))} className="rounded-xl bg-rose-600 px-3 py-2 text-white hover:brightness-110">Remove</button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <FieldWithUnit label="Length" unitLabel={unit === UnitSystem.IMPERIAL ? "ft" : "m"} value={inchesToUnit(r.lengthIn, unit)} onChange={(v) => setRooms((prev) => prev.map((rr) => (rr.id === r.id ? { ...rr, lengthIn: Number.isFinite(v) ? toInches(v, unit) : rr.lengthIn } : rr)))} />
                <FieldWithUnit label="Width"  unitLabel={unit === UnitSystem.IMPERIAL ? "ft" : "m"} value={inchesToUnit(r.widthIn, unit)}  onChange={(v) => setRooms((prev) => prev.map((rr) => (rr.id === r.id ? { ...rr, widthIn:  Number.isFinite(v) ? toInches(v, unit) : rr.widthIn  } : rr)))} />
                <FieldWithUnit label="Height" unitLabel={unit === UnitSystem.IMPERIAL ? "ft" : "m"} value={inchesToUnit(r.heightIn, unit)} onChange={(v) => setRooms((prev) => prev.map((rr) => (rr.id === r.id ? { ...rr, heightIn: Number.isFinite(v) ? toInches(v, unit) : rr.heightIn } : rr)))} />
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={r.includeCeiling} onChange={(e) => setRooms((prev) => prev.map((rr) => (rr.id === r.id ? { ...rr, includeCeiling: e.target.checked } : rr)))} />Include Ceiling</label>
                </div>
              </div>

              {/* Openings */}
              <div className="mt-4 rounded-xl bg-muted/40 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium">Openings</h3>
                  <button onClick={() => setRooms((prev) => prev.map((rr) => (rr.id === r.id ? { ...rr, openings: [...rr.openings, DEFAULT_OPENING()] } : rr)))} className="rounded-lg bg-secondary px-3 py-1 text-secondary-foreground hover:brightness-110">+ Add Opening</button>
                </div>
                {r.openings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No openings added.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {r.openings.map((o) => (
                      <div key={o.id} className="grid grid-cols-1 items-end gap-3 sm:grid-cols-6">
                        <div>
                          <label className="mb-1 block text-sm">Type</label>
                          <Select value={o.label} onChange={(v: "Window" | "Door") => setRooms((prev) => prev.map((rr) => rr.id !== r.id ? rr : { ...rr, openings: rr.openings.map((oo) => (oo.id === o.id ? { ...oo, label: v } : oo)) }))}>
                            <option value="Window">Window</option>
                            <option value="Door">Door</option>
                          </Select>
                        </div>
                        <FieldWithUnit label="Width"  unitLabel={unit === UnitSystem.IMPERIAL ? "in" : "cm"} value={unit === UnitSystem.IMPERIAL ? o.widthIn  : (o.widthIn  * CM_PER_IN) / 100} onChange={(v) => setRooms((prev) => prev.map((rr) => rr.id !== r.id ? rr : { ...rr, openings: rr.openings.map((oo) => (oo.id === o.id ? { ...oo, widthIn:  Number.isFinite(v) ? (unit === UnitSystem.IMPERIAL ? v : (v * 100) / CM_PER_IN) : oo.widthIn  } : oo)) }))} />
                        <FieldWithUnit label="Height" unitLabel={unit === UnitSystem.IMPERIAL ? "in" : "cm"} value={unit === UnitSystem.IMPERIAL ? o.heightIn : (o.heightIn * CM_PER_IN) / 100} onChange={(v) => setRooms((prev) => prev.map((rr) => rr.id !== r.id ? rr : { ...rr, openings: rr.openings.map((oo) => (oo.id === o.id ? { ...oo, heightIn: Number.isFinite(v) ? (unit === UnitSystem.IMPERIAL ? v : (v * 100) / CM_PER_IN) : oo.heightIn } : oo)) }))} />
                        <div>
                          <label className="mb-1 block text-sm">Count</label>
                          <NumInput value={o.count} onChange={(v) => setRooms((prev) => prev.map((rr) => rr.id !== r.id ? rr : { ...rr, openings: rr.openings.map((oo) => (oo.id === o.id ? { ...oo, count: Number.isFinite(v) ? Math.max(0, Math.round(v)) : oo.count } : oo)) }))} />
                        </div>
                        <div className="sm:col-span-1">
                          <label className="mb-1 block text-sm opacity-0">x</label>
                          <button onClick={() => setRooms((prev) => prev.map((rr) => rr.id !== r.id ? rr : { ...rr, openings: rr.openings.filter((oo) => oo.id !== o.id) }))} className="w-full rounded-lg bg-rose-600 px-3 py-2 text-white hover:brightness-110">Remove</button>
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
      <section className="mb-8 rounded-2xl border p-4 shadow-sm">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-xl font-semibold">Drywall Boards</h2>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={drywall.coverCeilings} onChange={(e) => setDrywall((d) => ({ ...d, coverCeilings: e.target.checked }))} />Include ceilings in coverage</label>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {drywall.selections.map((s) => (
            <div key={s.id} className="grid grid-cols-1 items-end gap-3 rounded-xl border p-3 sm:grid-cols-6">
              <div>
                <label className="mb-1 block text-sm">Sheet Size</label>
                <Select value={s.boardId} onChange={(v: string) => setDrywall((d) => ({ ...d, selections: d.selections.map((x) => (x.id === s.id ? { ...x, boardId: v } : x)) }))}>
                  {BOARD_OPTIONS.map((b) => (
                    <option key={b.id} value={b.id}>{b.label}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm">Thickness</label>
                <Select value={s.thickness} onChange={(v: string) => setDrywall((d) => ({ ...d, selections: d.selections.map((x) => (x.id === s.id ? { ...x, thickness: v } : x)) }))}>
                  {THICKNESS_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm">Quantity (sheets)</label>
                <NumInput value={s.quantity} onChange={(v) => setDrywall((d) => ({ ...d, selections: d.selections.map((x) => (x.id === s.id ? { ...x, quantity: Number.isFinite(v) ? Math.max(0, Math.round(v)) : x.quantity } : x)) }))} />
              </div>
              <div>
                <label className="mb-1 block text-sm">Unit Price ($)</label>
                <NumInput value={s.unitPrice} onChange={(v) => setDrywall((d) => ({ ...d, selections: d.selections.map((x) => (x.id === s.id ? { ...x, unitPrice: Number.isFinite(v) ? Math.max(0, v) : x.unitPrice } : x)) }))} />
              </div>
              <div>
                <button onClick={() => setDrywall((d) => ({ ...d, selections: d.selections.filter((x) => x.id !== s.id) }))} className="w-full rounded-lg bg-rose-600 px-3 py-2 text-white hover:brightness-110">Remove</button>
              </div>
            </div>
          ))}
          <div>
            <button onClick={() => setDrywall((d) => ({ ...d, selections: [...d.selections, DEFAULT_SELECTION()] }))} className="rounded-xl bg-primary px-4 py-2 text-primary-foreground shadow hover:brightness-110">+ Add Another Board</button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="grid grid-cols-1 gap-3 rounded-xl border p-3">
            <div>
              <label className="mb-1 block text-sm">Waste % (target)</label>
              <NumInput value={drywall.wastePct} onChange={(v) => setDrywall((d) => ({ ...d, wastePct: Number.isFinite(v) ? Math.max(0, v) : d.wastePct }))} />
            </div>
            <SummaryRow label="Project Area (incl. ceilings option)" value={fmtArea(coverageFt2, unit)} />
            <SummaryRow label="Target Area (+ waste)" value={`${targetFt2.toFixed(2)} ft²`} />
            <SummaryRow label="Purchased Area" value={`${purchasedAreaFt2.toFixed(2)} ft²`} />
            <SummaryRow label="Coverage vs Target" value={`${coveragePct.toFixed(0)}%`} />
          </div>
          <div className="grid grid-cols-1 gap-3 rounded-xl border p-3">
            <SummaryRow label={`Drywall cost ($)`} value={drywallCost.toFixed(2)} />
            <SummaryRow label={`Other materials ($)`} value={manualCost.toFixed(2)} />
            <SummaryRow label={`Grand total ($)`} value={grandTotal.toFixed(2)} />
          </div>
        </div>
      </section>

      {/* Other Materials */}
      <section className="mb-8 rounded-2xl border p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Other Materials</h2>
          <button onClick={() => setManualMaterials((prev) => [...prev, DEFAULT_MATERIAL()])} className="rounded-xl bg-primary px-4 py-2 text-primary-foreground hover:brightness-110">+ Add Item</button>
        </div>
        {manualMaterials.length === 0 ? (
          <p className="text-sm text-muted-foreground">No materials added.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {manualMaterials.map((m) => (
              <div key={m.id} className="grid grid-cols-1 items-end gap-3 rounded-xl border p-3 sm:grid-cols-6">
                <div>
                  <label className="mb-1 block text-sm">Name</label>
                  <input className="w-full rounded-lg border bg-background px-3 py-2 shadow-sm" value={m.name} onChange={(e) => setManualMaterials((prev) => prev.map((x) => (x.id === m.id ? { ...x, name: e.target.value } : x)))} />
                </div>
                <div>
                  <label className="mb-1 block text-sm">Size</label>
                  <input className="w-full rounded-lg border bg-background px-3 py-2 shadow-sm" value={m.size} onChange={(e) => setManualMaterials((prev) => prev.map((x) => (x.id === m.id ? { ...x, size: e.target.value } : x)))} />
                </div>
                <div>
                  <label className="mb-1 block text-sm">Thickness</label>
                  <Select value={m.thickness} onChange={(v: string) => setManualMaterials((prev) => prev.map((x) => (x.id === m.id ? { ...x, thickness: v } : x)))}>
                    <option value="N/A">N/A</option>
                    {THICKNESS_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-sm">Quantity</label>
                  <NumInput value={m.quantity} onChange={(v) => setManualMaterials((prev) => prev.map((x) => (x.id === m.id ? { ...x, quantity: Number.isFinite(v) ? Math.max(0, Math.round(v)) : x.quantity } : x)))} />
                </div>
                <div>
                  <label className="mb-1 block text-sm">Unit Price ($)</label>
                  <NumInput value={m.unitPrice} onChange={(v) => setManualMaterials((prev) => prev.map((x) => (x.id === m.id ? { ...x, unitPrice: Number.isFinite(v) ? Math.max(0, v) : x.unitPrice } : x)))} />
                </div>
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm opacity-0">x</label>
                  <button onClick={() => setManualMaterials((prev) => prev.filter((x) => x.id !== m.id))} className="w-full rounded-lg bg-rose-600 px-3 py-2 text-white hover:brightness-110">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Totals */}
      <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border p-4 shadow-sm"><h3 className="mb-1 text-sm font-medium text-muted-foreground">Drywall Cost</h3><div className="text-2xl font-semibold">${drywallCost.toFixed(2)}</div></div>
        <div className="rounded-2xl border p-4 shadow-sm"><h3 className="mb-1 text-sm font-medium text-muted-foreground">Other Materials</h3><div className="text-2xl font-semibold">${manualCost.toFixed(2)}</div></div>
        <div className="rounded-2xl border p-4 shadow-sm"><h3 className="mb-1 text-sm font-medium text-muted-foreground">Grand Total</h3><div className="text-2xl font-semibold">${grandTotal.toFixed(2)}</div></div>
      </section>

      <footer className="pb-10 text-xs text-muted-foreground">
        <p>Thickness options: 1/4", 1/2", 5/8". Purchased area sums all selected boards. Project area = walls + optional ceilings; use Waste % to set a target for comparison.</p>
      </footer>
    </div>
  );
}
