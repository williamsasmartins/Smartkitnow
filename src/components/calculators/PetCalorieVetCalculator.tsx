import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Vet-Approved Calorie Requirements Calculator for Pets
// Species (dog/cat), Weight (kg/lb), Body Condition Score (1-9), Criteria (intact/neutered/obese-prone)
// Outputs: Ideal weight (kg), daily calories (kcal), optional portions if kcal/unit given

type Species = "dog" | "cat";
type Criteria = "intact" | "neutered" | "obese-prone";

function roundTo10(n: number) { return Math.round(n / 10) * 10; }
function toKg(value: number, unit: "kg" | "lb") { return !isFinite(value) || value <= 0 ? 0 : unit === "kg" ? value : value * 0.45359237; }

function idealWeightFromBCS(currentKg: number, bcs: number): number {
  if (!isFinite(currentKg) || currentKg <= 0 || !isFinite(bcs) || bcs < 1 || bcs > 9) return 0;
  if (bcs === 5) return currentKg;
  if (bcs > 5) {
    const pct = 0.10 * (bcs - 5); // reduce ~10% per point above 5
    return Math.max(0.1, currentKg * (1 - pct));
  }
  // bcs < 5 -> increase ~10% per point below 5
  const pct = 0.10 * (5 - bcs);
  return currentKg * (1 + pct);
}

function rerDog(kg: number) { return !isFinite(kg) || kg <= 0 ? 0 : 70 * Math.pow(kg, 0.75); }
function rerCat(kg: number) { return !isFinite(kg) || kg <= 0 ? 0 : 30 * kg + 70; }

function merFactorVet(species: Species, criteria: Criteria): number {
  if (species === "dog") {
    if (criteria === "intact") return 1.6;
    if (criteria === "obese-prone") return 1.2;
    return 1.4; // neutered
  } else {
    if (criteria === "intact") return 1.4;
    if (criteria === "obese-prone") return 1.1;
    return 1.2; // neutered
  }
}

const PetCalorieVetCalculator: React.FC = () => {
  const [species, setSpecies] = useState<Species>("dog");
  const [weight, setWeight] = useState<number>(20);
  const [unit, setUnit] = useState<"kg" | "lb">("lb");
  const [bcs, setBCS] = useState<number>(5);
  const [criteria, setCriteria] = useState<Criteria>("neutered");
  const [foodKcalUnit, setFoodKcalUnit] = useState<number>(0); // optional kcal per cup/can
  const [unitType, setUnitType] = useState<"cup" | "can">("cup");

  const weightKg = useMemo(() => toKg(weight, unit), [weight, unit]);
  const idealKg = useMemo(() => Math.round(idealWeightFromBCS(weightKg, bcs) * 10) / 10, [weightKg, bcs]);
  const rer = useMemo(() => (species === "dog" ? rerDog(idealKg) : rerCat(idealKg)), [species, idealKg]);
  const merF = useMemo(() => merFactorVet(species, criteria), [species, criteria]);
  const daily = useMemo(() => roundTo10(rer * merF), [rer, merF]);

  const portions = useMemo(() => {
    if (!foodKcalUnit || foodKcalUnit <= 0) return 0;
    return Math.round((daily / foodKcalUnit) * 10) / 10;
  }, [daily, foodKcalUnit]);

  const warning = useMemo(() => {
    if (weightKg <= 0) return "Weight must be greater than 0.";
    if (bcs < 1 || bcs > 9) return "BCS must be between 1 and 9.";
    if (weightKg < 1 || weightKg > 100) return "For very small/large pets, consult your veterinarian.";
    if (bcs <= 2 || bcs >= 8) return "BCS extreme: consult your veterinarian for tailored guidance.";
    return "";
  }, [weightKg, bcs]);

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl" style={{ color: "#3c83f6" }}>Vet-Approved Calorie Requirements</CardTitle>
        <CardDescription>
          Calculate ideal weight and daily calories using BCS and criteria. <span title="From Vetcalculators methodology">Methodology</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
              <Input type="number" min={1} max={100} step={0.1} value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
              <Select value={unit} onValueChange={(v) => setUnit(v as any)}>
                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lb">lb</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Toggle kg/lb. Default 20 lb.</div>
          </div>
          <div>
            <Label>Body Condition Score (BCS)</Label>
            <Select value={String(bcs)} onValueChange={(v) => setBCS(Number(v))}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8,9].map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground mt-1">BCS: 1-3 underweight, 4-5 ideal, 6-9 overweight.</div>
          </div>
          <div>
            <Label>Criteria</Label>
            <Select value={criteria} onValueChange={(v) => setCriteria(v as Criteria)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="intact">Intact</SelectItem>
                <SelectItem value="neutered">Neutered</SelectItem>
                <SelectItem value="obese-prone">Obese-prone</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Food kcal per {unitType === "cup" ? "Cup" : "Can"} (optional)</Label>
            <div className="flex gap-2 mt-1">
              <Input type="number" min={100} max={1000} step={10} value={foodKcalUnit} onChange={(e) => setFoodKcalUnit(Number(e.target.value))} />
              <Select value={unitType} onValueChange={(v) => setUnitType(v as any)}>
                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cup">Cup</SelectItem>
                  <SelectItem value="can">Can</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-sm">Ideal Weight: <span className="font-semibold">{idealKg.toFixed(1)} kg</span></div>
          <div className="text-sm">RER ({species === "dog" ? "70×kg^0.75" : "30×kg+70"}) at ideal weight: {Math.round(rer)} kcal</div>
          <div className="text-sm">Factor ({criteria}): {merF.toFixed(2)}</div>
        </div>

        <div className="mt-2">
          <div className="text-lg font-semibold" style={{ color: "#22c55e" }}>Daily Calories: {daily} kcal/day</div>
          {foodKcalUnit > 0 && (
            <div className="text-sm mt-1">Estimated Portions: {portions} {unitType}s/day</div>
          )}
          {warning && <div className="text-xs text-red-600 mt-1">{warning}</div>}
          <div className="text-sm text-muted-foreground mt-2">Tip: Use ideal weight for feeding. Monitor progress and adjust with your veterinarian.</div>
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          Examples: Dog, 20 lb (~9 kg), BCS 6, Neutered → Ideal ~8.1 kg, ~500 kcal/day. Cat, 10 lb (~4.5 kg), BCS 4, Intact → Ideal ~5.0 kg, ~300 kcal/day.
        </div>
      </CardContent>
    </Card>
  );
};

export default PetCalorieVetCalculator;