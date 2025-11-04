import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, ShieldAlert, Syringe } from "lucide-react";

// Veterinary Emergency Drug Dose Calculator for Pets
// Species: dog/cat; Weight (kg or lb); Drug selection; Optional CRI (ml/hr) configuration
// Outputs: Dose amount (mg and mL if concentration provided), simple administration notes, and strong disclaimers

// IMPORTANT: This tool provides approximate calculations for educational use and emergency planning only.
// Always verify dosages and indications with a licensed veterinarian.

type Species = "dog" | "cat";
type Unit = "kg" | "lb";
type DrugKey = "epinephrine" | "atropine" | "naloxone" | "diazepam" | "lidocaine";

type DrugDef = {
  key: DrugKey;
  name: string;
  // Bolus dosing range in mg/kg when applicable
  bolus?: { min: number; max: number; units: "mg/kg"; route?: string };
  // CRI dosing when applicable
  cri?: { min: number; max: number; units: "mcg/kg/min" | "mg/kg/hr"; notes?: string };
  // Default concentration used to convert mg to mL if user doesn't provide custom concentration
  defaultConcentrationMgMl?: number;
  // Species-specific cautions (e.g., lidocaine CRI in cats)
  speciesNotes?: Partial<Record<Species, string>>;
  generalNotes?: string;
};

const DRUGS: DrugDef[] = [
  {
    key: "epinephrine",
    name: "Epinephrine (Adrenaline)",
    bolus: { min: 0.01, max: 0.02, units: "mg/kg", route: "IV" },
    defaultConcentrationMgMl: 1, // 1 mg/mL (1:1000) common
    generalNotes: "Use appropriate dilution for IV administration; monitor heart rhythm and blood pressure.",
  },
  {
    key: "atropine",
    name: "Atropine",
    bolus: { min: 0.02, max: 0.04, units: "mg/kg", route: "IV" },
    defaultConcentrationMgMl: 0.5, // typical vial ~0.5 mg/mL
    generalNotes: "May cause tachycardia; avoid in certain glaucoma/ileus situations.",
  },
  {
    key: "naloxone",
    name: "Naloxone",
    bolus: { min: 0.01, max: 0.04, units: "mg/kg", route: "IV" },
    defaultConcentrationMgMl: 0.4, // common presentation
    generalNotes: "Reverse opioid effects; titrate to effect; duration may be shorter than opioid.",
  },
  {
    key: "diazepam",
    name: "Diazepam",
    bolus: { min: 0.5, max: 1.0, units: "mg/kg", route: "IV" },
    defaultConcentrationMgMl: 5, // diazepam 5 mg/mL typical
    generalNotes: "For seizures/anxiolysis; avoid co-administration with certain plastics (adsorption).",
  },
  {
    key: "lidocaine",
    name: "Lidocaine",
    cri: { min: 25, max: 75, units: "mcg/kg/min", notes: "Common canine CRI range; titrate to effect." },
    defaultConcentrationMgMl: 20, // 2% = 20 mg/mL
    speciesNotes: { cat: "Use extreme caution; lidocaine CRI is often avoided in cats due to toxicity risk." },
    generalNotes: "Monitor ECG; ensure accurate infusion pump settings.",
  },
];

function toKg(value: number, unit: Unit) {
  if (!isFinite(value) || value <= 0) return 0;
  return unit === "kg" ? value : value * 0.45359237;
}

function formatRange(min: number, max: number, decimals = 2) {
  if (!isFinite(min) || !isFinite(max)) return "–";
  const a = min.toFixed(decimals);
  const b = max.toFixed(decimals);
  return `${a}–${b}`;
}

const Disclaimer: React.FC = () => (
  <div className="flex items-start gap-2 rounded-md border border-red-500/50 bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
    <ShieldAlert className="h-4 w-4 shrink-0" />
    <div>
      <div className="font-semibold">For professional use only</div>
      <div>
        This tool provides approximate calculations and does not replace veterinary judgment. Always consult a licensed veterinarian before administering any medication.
      </div>
    </div>
  </div>
);

const PetEmergencyDrugCalculator: React.FC = () => {
  const [species, setSpecies] = useState<Species>("dog");
  const [weight, setWeight] = useState<number>(10);
  const [unit, setUnit] = useState<Unit>("kg");
  const [drugKey, setDrugKey] = useState<DrugKey | "">("");
  const [concentration, setConcentration] = useState<number | "">("");
  const [infusionRate, setInfusionRate] = useState<number>(10); // ml/hr
  const [bagVolume, setBagVolume] = useState<number>(500); // mL
  const [durationHours, setDurationHours] = useState<number>(1);

  const weightKg = useMemo(() => toKg(weight, unit), [weight, unit]);
  const drug = useMemo(() => DRUGS.find((d) => d.key === drugKey), [drugKey]);
  const conc = useMemo(() => (concentration === "" ? (drug?.defaultConcentrationMgMl ?? undefined) : Number(concentration)), [concentration, drug]);

  const bolus = useMemo(() => {
    if (!drug?.bolus || weightKg <= 0) return null;
    const mgMin = weightKg * drug.bolus.min;
    const mgMax = weightKg * drug.bolus.max;
    const mlMin = conc ? mgMin / conc : undefined;
    const mlMax = conc ? mgMax / conc : undefined;
    return { mgMin, mgMax, mlMin, mlMax };
  }, [drug, weightKg, conc]);

  const cri = useMemo(() => {
    if (!drug?.cri || weightKg <= 0) return null;
    // Compute mg per hour based on units
    let mgPerHrMin = 0;
    let mgPerHrMax = 0;
    if (drug.cri.units === "mcg/kg/min") {
      mgPerHrMin = (drug.cri.min * weightKg * 60) / 1000; // mcg -> mg
      mgPerHrMax = (drug.cri.max * weightKg * 60) / 1000;
    } else {
      mgPerHrMin = drug.cri.min * weightKg;
      mgPerHrMax = drug.cri.max * weightKg;
    }
    const totalMgMin = mgPerHrMin * Math.max(1, durationHours);
    const totalMgMax = mgPerHrMax * Math.max(1, durationHours);
    // Required concentration (mg/mL) for given infusion rate
    const concRequiredMin = infusionRate > 0 ? mgPerHrMin / infusionRate : undefined;
    const concRequiredMax = infusionRate > 0 ? mgPerHrMax / infusionRate : undefined;
    // Mg to add to the bag to deliver for the duration at the given rate
    const mgToAddMin = concRequiredMin ? concRequiredMin * bagVolume : undefined;
    const mgToAddMax = concRequiredMax ? concRequiredMax * bagVolume : undefined;

    return {
      mgPerHrMin,
      mgPerHrMax,
      totalMgMin,
      totalMgMax,
      concRequiredMin,
      concRequiredMax,
      mgToAddMin,
      mgToAddMax,
    };
  }, [drug, weightKg, infusionRate, bagVolume, durationHours]);

  const errors: string[] = useMemo(() => {
    const errs: string[] = [];
    if (weightKg <= 0) errs.push("Weight must be greater than 0.");
    if (!drugKey) errs.push("Please select a drug.");
    return errs;
  }, [weightKg, drugKey]);

  const speciesWarning = useMemo(() => {
    if (!drug || !drug.speciesNotes) return "";
    return drug.speciesNotes[species] ?? "";
  }, [drug, species]);

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2" style={{ color: "#ef4444" }}>
          <Syringe className="h-6 w-6" /> Veterinary Emergency Drug Dose Calculator
        </CardTitle>
        <CardDescription>
          Quickly estimate emergency drug doses and CRI parameters for dogs and cats. <span title="Based on veterinary manuals and common emergency practice">Tooltip: dosages derived from standard references</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Disclaimer />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Species</Label>
            <Select value={species} onValueChange={(v) => setSpecies(v as Species)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Dog</SelectItem>
                <SelectItem value="cat">Cat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Weight</Label>
            <div className="flex gap-2 mt-1">
              <Input type="number" min={0.5} max={100} step={0.1} value={weight}
                     onChange={(e) => setWeight(Number(e.target.value))} />
              <Select value={unit} onValueChange={(v) => setUnit(v as Unit)}>
                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lb">lb</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Unit converter applied automatically.</div>
          </div>
          <div>
            <Label>Drug</Label>
            <Select value={drugKey} onValueChange={(v) => setDrugKey(v as DrugKey)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {DRUGS.map((d) => (
                  <SelectItem key={d.key} value={d.key}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Concentration (optional)</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input type="number" min={0} step={0.1} placeholder={drug?.defaultConcentrationMgMl ? `${drug.defaultConcentrationMgMl}` : "mg/mL"}
                     value={concentration === "" ? "" : concentration}
                     onChange={(e) => setConcentration(e.target.value === "" ? "" : Number(e.target.value))} />
              <span className="text-xs text-muted-foreground">mg/mL</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">If blank, defaults to common product concentration when available.</div>
          </div>
        </div>

        {speciesWarning && (
          <div className="flex items-start gap-2 rounded-md border border-amber-400/50 bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4" />
            <div>{speciesWarning}</div>
          </div>
        )}

        {errors.length > 0 && (
          <div className="text-xs text-red-600">{errors.join(" ")}</div>
        )}

        <Separator />

        {/* Bolus section */}
        <div className="space-y-2">
          <div className="font-semibold">Bolus Dose</div>
          <div className="text-xs text-muted-foreground">Calculated in mg and mL (if concentration known). Admin route: {drug?.bolus?.route ?? "—"}</div>
          {!drug?.bolus ? (
            <div className="text-sm">Selected drug does not have a standard bolus dose in this tool.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-md border p-3">
                <div className="text-sm">Range: {formatRange(drug.bolus.min, drug.bolus.max)} {drug.bolus.units}</div>
                <div className="text-lg font-semibold mt-1" style={{ color: "#22c55e" }}>
                  {bolus ? `${bolus.mgMin.toFixed(2)}–${bolus.mgMax.toFixed(2)} mg` : "—"}
                </div>
                <div className="text-xs text-muted-foreground">Weight: {weightKg.toFixed(2)} kg</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-sm">Equivalent Volume</div>
                <div className="text-lg font-semibold mt-1" style={{ color: "#3b82f6" }}>
                  {bolus && bolus.mlMin !== undefined && bolus.mlMax !== undefined ? `${bolus.mlMin.toFixed(2)}–${bolus.mlMax.toFixed(2)} mL` : "Provide concentration to show mL"}
                </div>
                <div className="text-xs text-muted-foreground">Concentration: {conc ? `${conc} mg/mL` : "—"}</div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* CRI section */}
        <div className="space-y-2">
          <div className="font-semibold">Continuous Rate Infusion (CRI)</div>
          <div className="text-xs text-muted-foreground">Configure infusion rate and bag volume to compute mg to add.</div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Infusion Rate</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input type="number" min={0} step={0.1} value={infusionRate} onChange={(e) => setInfusionRate(Number(e.target.value))} />
                <span className="text-xs text-muted-foreground">mL/hr</span>
              </div>
            </div>
            <div>
              <Label>Fluid Bag Volume</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input type="number" min={100} step={50} value={bagVolume} onChange={(e) => setBagVolume(Number(e.target.value))} />
                <span className="text-xs text-muted-foreground">mL</span>
              </div>
            </div>
            <div>
              <Label>Duration</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input type="number" min={1} step={1} value={durationHours} onChange={(e) => setDurationHours(Number(e.target.value))} />
                <span className="text-xs text-muted-foreground">hours</span>
              </div>
            </div>
          </div>

          {!drug?.cri ? (
            <div className="text-sm">Selected drug does not have a CRI configuration in this tool.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-md border p-3">
                <div className="text-sm">Range: {formatRange(drug.cri.min, drug.cri.max)} {drug.cri.units}</div>
                <div className="text-sm">Weight: {weightKg.toFixed(2)} kg</div>
                <div className="text-xs text-muted-foreground mt-1">Rate → concentration based on infusion</div>
                <div className="text-lg font-semibold mt-1" style={{ color: "#22c55e" }}>
                  {cri?.concRequiredMin !== undefined && cri?.concRequiredMax !== undefined
                    ? `${cri.concRequiredMin.toFixed(3)}–${cri.concRequiredMax.toFixed(3)} mg/mL required`
                    : "—"}
                </div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-sm">Mg to add to bag for selected duration</div>
                <div className="text-lg font-semibold mt-1" style={{ color: "#3b82f6" }}>
                  {cri?.mgToAddMin !== undefined && cri?.mgToAddMax !== undefined
                    ? `${cri.mgToAddMin.toFixed(2)}–${cri.mgToAddMax.toFixed(2)} mg`
                    : "—"}
                </div>
                <div className="text-xs text-muted-foreground">Bag {bagVolume} mL @ {infusionRate} mL/hr × {durationHours} h</div>
              </div>
            </div>
          )}

          {drug?.cri?.notes && (
            <div className="text-xs text-muted-foreground">Note: {drug.cri.notes}</div>
          )}
        </div>

        <Separator />

        <div className="text-xs text-muted-foreground">
          UI Tip: Hover the title for dosage tooltip. Values are approximate and should be verified against local protocols.
        </div>
      </CardContent>
    </Card>
  );
};

export default PetEmergencyDrugCalculator;