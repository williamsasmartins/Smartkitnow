import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { computeRER, merFactor, goalAdjustFactor } from "@/components/calculators/PetCaloriePNACalculator";

// Pet Food and Feeding Decisions Calculator - Cost and Portion Estimator
// Portions/day and cost/day based on calories needed and food energy/cost details.

type Species = "dog" | "cat";

function roundTo(n: number, d: number) { const p = Math.pow(10, d); return Math.round(n * p) / p; }
function toKg(value: number, unit: "kg" | "lb") { return !isFinite(value) || value <= 0 ? 0 : unit === "kg" ? value : value * 0.45359237; }

const PetFeedingDecisionsCalculator: React.FC = () => {
  const [species, setSpecies] = useState<Species>("dog");
  const [weight, setWeight] = useState<number>(10);
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [life, setLife] = useState<"puppy/kitten" | "adult" | "senior">("adult");
  const [activity, setActivity] = useState<"low" | "moderate" | "high">("moderate");
  const [goal, setGoal] = useState<"maintain" | "lose" | "gain">("maintain");

  const [foodKcalUnit, setFoodKcalUnit] = useState<number>(400);
  const [containerType, setContainerType] = useState<"bag" | "can">("bag");
  const [containerSize, setContainerSize] = useState<number>(5); // kg for bag, count for cans
  const [gramsPerCup, setGramsPerCup] = useState<number>(100); // default assumption
  const [manualDaily, setManualDaily] = useState<string>(""); // optional manual override

  const weightKg = useMemo(() => toKg(weight, unit), [weight, unit]);
  const rer = useMemo(() => computeRER(weightKg), [weightKg]);
  const merF = useMemo(() => merFactor(species, life, activity), [species, life, activity]);
  const goalF = useMemo(() => goalAdjustFactor(goal), [goal]);
  const autoDaily = useMemo(() => Math.round((rer * merF * goalF) / 10) * 10, [rer, merF, goalF]);
  const daily = useMemo(() => {
    const v = Number(manualDaily);
    return isFinite(v) && v > 0 ? Math.round(v / 10) * 10 : autoDaily;
  }, [manualDaily, autoDaily]);

  const portions = useMemo(() => {
    if (!foodKcalUnit || foodKcalUnit <= 0) return 0;
    return roundTo(daily / foodKcalUnit, 2);
  }, [daily, foodKcalUnit]);

  const cupsPerBag = useMemo(() => {
    if (containerType !== "bag") return 0;
    return (containerSize * 1000) / gramsPerCup;
  }, [containerType, containerSize, gramsPerCup]);

  const costPerUnit = useMemo(() => {
    // cost per cup (bag) or per can
    if (containerType === "bag") {
      if (cupsPerBag <= 0) return 0;
      return 20 / cupsPerBag; // default $20 bag shown below; user can change cost in the next field
    }
    // for cans, cost is cost/containerSize
    return 20 / Math.max(1, containerSize);
  }, [containerType, cupsPerBag, containerSize]);

  const [containerCost, setContainerCost] = useState<number>(20);
  const costPerUnitActual = useMemo(() => {
    if (containerType === "bag") {
      const cups = cupsPerBag;
      return cups > 0 ? containerCost / cups : 0;
    } else {
      return containerCost / Math.max(1, containerSize);
    }
  }, [containerType, containerCost, cupsPerBag, containerSize]);

  const costPerDay = useMemo(() => roundTo(costPerUnitActual * portions, 2), [costPerUnitActual, portions]);
  const costPerMonth = useMemo(() => roundTo(costPerDay * 30, 2), [costPerDay]);

  const warning = useMemo(() => {
    if (weightKg <= 0) return "Weight must be greater than 0.";
    if (foodKcalUnit < 100 || foodKcalUnit > 1000) return "Check kcal per unit; typical range is 100-1000.";
    if (costPerDay > 5) return "Costs appear high — compare brands for savings.";
    return "";
  }, [weightKg, foodKcalUnit, costPerDay]);

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl" style={{ color: "#3c83f6" }}>Pet Feeding Decisions</CardTitle>
        <CardDescription>
          Estimate portions and cost for commercial pet food. <span title="For dog food primarily">Note</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="portions">
          <TabsList className="mb-2">
            <TabsTrigger value="portions">Portions</TabsTrigger>
            <TabsTrigger value="cost">Cost</TabsTrigger>
          </TabsList>
          <TabsContent value="portions">
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
                  <Input type="number" min={1} max={50} step={0.1} value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
                  <Select value={unit} onValueChange={(v) => setUnit(v as any)}>
                    <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lb">lb</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Life Stage</Label>
                <Select value={life} onValueChange={(v) => setLife(v as any)}>
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
                <Select value={activity} onValueChange={(v) => setActivity(v as any)}>
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
                <Select value={goal} onValueChange={(v) => setGoal(v as any)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintain">Maintain</SelectItem>
                    <SelectItem value="lose">Lose Weight</SelectItem>
                    <SelectItem value="gain">Gain Weight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Daily Calories Needed</Label>
                <Input type="number" placeholder={`auto: ${autoDaily} kcal`} value={manualDaily} onChange={(e) => setManualDaily(e.target.value)} />
                <div className="text-xs text-muted-foreground mt-1">Leave blank to auto-calculate from weight/activity.</div>
              </div>
              <div>
                <Label>Food kcal per Cup/Can</Label>
                <Input type="number" min={100} max={1000} step={10} value={foodKcalUnit} onChange={(e) => setFoodKcalUnit(Number(e.target.value))} />
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <div className="text-lg font-semibold" style={{ color: "#22c55e" }}>Daily Portions: {portions} {containerType === "bag" ? "cups" : "cans"}/day</div>
              <div className="text-xs text-muted-foreground mt-1">Tip: Integrate with calorie calculator for precise needs.</div>
            </div>
          </TabsContent>
          <TabsContent value="cost">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Container Type</Label>
                <Select value={containerType} onValueChange={(v) => setContainerType(v as any)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bag">Bag</SelectItem>
                    <SelectItem value="can">Can</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{containerType === "bag" ? "Bag Size (kg)" : "Number of Cans in Pack"}</Label>
                <Input type="number" min={containerType === "bag" ? 1 : 1} step={1} value={containerSize} onChange={(e) => setContainerSize(Number(e.target.value))} />
              </div>
              {containerType === "bag" && (
                <div>
                  <Label>Grams per Cup</Label>
                  <Input type="number" min={50} max={300} step={10} value={gramsPerCup} onChange={(e) => setGramsPerCup(Number(e.target.value))} />
                  <div className="text-xs text-muted-foreground mt-1">Assume 100 g per cup (typical kibble).</div>
                </div>
              )}
              <div>
                <Label>Food Cost per {containerType === "bag" ? "Bag" : "Pack"} (USD)</Label>
                <Input type="number" min={1} step={0.01} value={containerCost} onChange={(e) => setContainerCost(Number(e.target.value))} />
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-1">
              {containerType === "bag" && (
                <div className="text-sm">Cups per Bag: {Math.floor(cupsPerBag)}</div>
              )}
              <div className="text-sm">Cost per {containerType === "bag" ? "Cup" : "Can"}: ${roundTo(costPerUnitActual, 2)}</div>
              <div className="text-lg font-semibold" style={{ color: "#22c55e" }}>Daily Cost: ${costPerDay}</div>
              <div className="text-sm">Monthly Estimate: ${costPerMonth}</div>
              {warning && <div className="text-xs text-red-600 mt-1">{warning}</div>}
              <div className="text-xs text-muted-foreground mt-2">Example: 10kg dog, 400 kcal/cup, $20/5kg bag → about 2 cups/day, ~$0.80/day (assuming ~50 cups/bag).</div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PetFeedingDecisionsCalculator;