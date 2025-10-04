import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// PNA-style Pet Calorie Calculator
// Reference methodology inspired by veterinary guidance (RER and MER factors)
// Species: dog/cat; Weight with unit converter; Life Stage; Activity; Goal
// Output: Daily calories (rounded to nearest 10), guidance text, simple breakdown bar

export type Species = "dog" | "cat";
export type LifeStage = "puppy/kitten" | "adult" | "senior";
export type ActivityLevel = "low" | "moderate" | "high";
export type Goal = "maintain" | "lose" | "gain";

function roundTo10(n: number) {
  return Math.round(n / 10) * 10;
}

export function computeRER(weightKg: number): number {
  if (!isFinite(weightKg) || weightKg <= 0) return 0;
  return 70 * Math.pow(weightKg, 0.75);
}

export function merFactor(species: Species, life: LifeStage, activity: ActivityLevel): number {
  if (species === "dog") {
    if (life === "puppy/kitten") return 3.0; // puppies often need ~3x RER
    // adult dog factors by activity
    if (activity === "low") return 1.4;
    if (activity === "moderate") return 1.6;
    return 2.0; // high
  } else {
    // cats — typical adult neutered ~1.2, intact ~1.4 (we default to neutered)
    if (life === "puppy/kitten") return 2.5; // kittens
    if (activity === "high") return 1.4;
    if (activity === "moderate") return 1.2;
    return 1.1; // low
  }
}

export function goalAdjustFactor(goal: Goal): number {
  if (goal === "lose") return 0.8; // reduce calories for weight loss
  if (goal === "gain") return 1.2; // increase for weight gain
  return 1.0; // maintain
}

function toKg(value: number, unit: "kg" | "lb"): number {
  if (!isFinite(value) || value <= 0) return 0;
  return unit === "kg" ? value : value * 0.45359237;
}

const BreakdownBar: React.FC<{ rer: number; merFactorValue: number; goalFactor: number }> = ({ rer, merFactorValue, goalFactor }) => {
  const rerPart = rer;
  const activityPart = rer * (merFactorValue - 1);
  const goalPart = rer * merFactorValue * (goalFactor - 1);
  const total = rer * merFactorValue * goalFactor;
  const pct = (x: number) => (total > 0 ? Math.max(0, (x / total) * 100) : 0);

  return (
    <div>
      <div className="h-4 w-full rounded-md overflow-hidden flex bg-muted">
        <div className="h-full" style={{ width: `${pct(rerPart)}%`, backgroundColor: "#3c83f6" }} title={`RER: ${Math.round(rerPart)} kcal`} />
        <div className="h-full" style={{ width: `${pct(activityPart)}%`, backgroundColor: "#06b6d4" }} title={`Activity/Life Stage: +${Math.round(activityPart)} kcal`} />
        <div className="h-full" style={{ width: `${pct(goalPart)}%`, backgroundColor: "#f59e0b" }} title={`Goal Adjustment: ${goalFactor > 1 ? "+" : ""}${Math.round(goalPart)} kcal`} />
      </div>
      <div className="text-xs mt-2 text-muted-foreground">Breakdown: RER, Activity/Life Stage, Goal Adjustment</div>
    </div>
  );
};

const PetCaloriePNACalculator: React.FC = () => {
  const [species, setSpecies] = useState<Species>("dog");
  const [weight, setWeight] = useState<number>(10);
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [life, setLife] = useState<LifeStage>("adult");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");

  const weightKg = useMemo(() => toKg(weight, unit), [weight, unit]);
  const rer = useMemo(() => computeRER(weightKg), [weightKg]);
  const merF = useMemo(() => merFactor(species, life, activity), [species, life, activity]);
  const goalF = useMemo(() => goalAdjustFactor(goal), [goal]);
  const daily = useMemo(() => roundTo10(rer * merF * goalF), [rer, merF, goalF]);

  const warning = useMemo(() => {
    if (weightKg <= 0) return "Weight must be greater than 0.";
    if (weightKg < 0.5 || weightKg > 100) return "For very small/large pets, consult your veterinarian.";
    return "";
  }, [weightKg]);

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl" style={{ color: "#3c83f6" }}>Pet Calorie Calculator</CardTitle>
        <CardDescription>
          Estimate daily calories for dogs and cats using RER × MER. <span title="Based on Pet Nutrition Alliance guidelines">Guideline</span>.
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
              <Input type="number" min={0.5} max={100} step={0.1} value={weight}
                     onChange={(e) => setWeight(Number(e.target.value))} />
              <Select value={unit} onValueChange={(v) => setUnit(v as any)}>
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
            <Label>Life Stage</Label>
            <Select value={life} onValueChange={(v) => setLife(v as LifeStage)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="puppy/kitten">Puppy/Kitten</SelectItem>
                <SelectItem value="adult">Adult</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Activity Level</Label>
            <Select value={activity} onValueChange={(v) => setActivity(v as ActivityLevel)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Goal</Label>
            <Select value={goal} onValueChange={(v) => setGoal(v as Goal)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="maintain">Maintain</SelectItem>
                <SelectItem value="lose">Lose Weight</SelectItem>
                <SelectItem value="gain">Gain Weight</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-sm">RER = 70 × (weight_kg^0.75)</div>
          <div className="text-sm">MER Factor = {merF.toFixed(2)} (species/life stage/activity)</div>
          <div className="text-sm">Goal Adjustment = {goalF.toFixed(2)}</div>
        </div>

        <BreakdownBar rer={rer} merFactorValue={merF} goalFactor={goalF} />

        <div className="mt-2">
          <div className="text-lg font-semibold" style={{ color: "#22c55e" }}>Daily Calories: {daily} kcal/day</div>
          {warning && <div className="text-xs text-red-600 mt-1">{warning}</div>}
          <div className="text-sm text-muted-foreground mt-2">
            Suggested adjustments: Monitor body condition; for weight loss, aim for gradual change and consult your vet.
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          Example: Dog, 10kg, Adult, Moderate, Maintain → ~700 kcal/day. Cat, 4kg, Senior, Low, Lose → ~180 kcal/day.
        </div>
      </CardContent>
    </Card>
  );
};

export default PetCaloriePNACalculator;