import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Info, Share2, DollarSign } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";

// Pet Ownership Costs Calculator - Estimate Annual and Lifetime Expenses
// Sliders are not available in the current UI library, so we use numeric inputs with sensible defaults.

type PetType = "dog" | "cat";

const DEFAULTS = {
  dog: {
    lifespan: 12,
    expenses: {
      food: 500,
      vet: 300,
      grooming: 200,
      insurance: 400,
      toys: 80,
    },
    adoption: 300,
  },
  cat: {
    lifespan: 15,
    expenses: {
      food: 400,
      vet: 250,
      grooming: 100,
      insurance: 300,
      toys: 60,
    },
    adoption: 250,
  },
} as const;

const LOCATION_FACTOR: Record<string, number> = {
  average: 1.0,
  urban: 1.2,
  rural: 0.9,
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.round(n));
}

const PALETTE = {
  food: "#4F46E5", // indigo
  vet: "#16A34A", // green
  grooming: "#F59E0B", // amber
  insurance: "#EF4444", // red
  toys: "#06B6D4", // cyan
};

const PetCostsCalculator: React.FC = () => {
  const [petType, setPetType] = useState<PetType>("dog");
  const [age, setAge] = useState<number>(1);
  const [lifespan, setLifespan] = useState<number>(DEFAULTS["dog"].lifespan);
  const [location, setLocation] = useState<string>("average");
  const [expenses, setExpenses] = useState<{ [k in keyof typeof DEFAULTS["dog"]["expenses"]]: number }>({
    ...DEFAULTS["dog"].expenses,
  });
  const [adoption, setAdoption] = useState<number>(DEFAULTS["dog"].adoption);
  const [shareMsg, setShareMsg] = useState<string>("");

  // Sync defaults when petType changes
  React.useEffect(() => {
    setLifespan(DEFAULTS[petType].lifespan);
    setExpenses({ ...(DEFAULTS[petType].expenses as any) });
    setAdoption(DEFAULTS[petType].adoption);
  }, [petType]);

  const yearsRemaining = useMemo(() => {
    return Math.max(0, lifespan - age);
  }, [lifespan, age]);

  const annualBase = useMemo(() => {
    return Object.values(expenses).reduce((sum, v) => sum + (Number.isFinite(v) ? v : 0), 0);
  }, [expenses]);

  const locFactor = LOCATION_FACTOR[location] ?? 1.0;
  const annualAdjusted = useMemo(() => annualBase * locFactor, [annualBase, locFactor]);
  const lifetimeTotal = useMemo(() => annualAdjusted * yearsRemaining + adoption, [annualAdjusted, yearsRemaining, adoption]);

  const breakdownData = useMemo(() => {
    const entries = Object.entries(expenses).map(([key, value]) => ({ key, value: value * locFactor }));
    const total = entries.reduce((s, e) => s + e.value, 0) || 1;
    return entries.map((e) => ({ name: e.key, amount: e.value, percent: (e.value / total) * 100 }));
  }, [expenses, locFactor]);

  const chartConfig = useMemo(() => {
    return {
      food: { label: "Food", icon: undefined as any, color: PALETTE.food },
      vet: { label: "Vet Care", icon: undefined as any, color: PALETTE.vet },
      grooming: { label: "Grooming", icon: undefined as any, color: PALETTE.grooming },
      insurance: { label: "Insurance", icon: undefined as any, color: PALETTE.insurance },
      toys: { label: "Toys & Supplies", icon: undefined as any, color: PALETTE.toys },
    };
  }, []);

  const warnings: string[] = [];
  if (age < 0) warnings.push("Age must be positive.");
  if (lifespan <= 0) warnings.push("Expected lifespan must be positive.");
  if (age > lifespan) warnings.push("Age exceeds expected lifespan — please review.");
  if (annualAdjusted > 2000) warnings.push("Consider pet insurance to manage high annual costs.");

  const handleShare = async () => {
    const text = `Annual: ${formatCurrency(annualAdjusted)} | Lifetime: ${formatCurrency(lifetimeTotal)} (${petType}, ${age}y, ${lifespan}y lifespan)`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Pet Costs Estimate", text, url: window.location.href });
        setShareMsg("Shared successfully.");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text} — ${window.location.href}`);
        setShareMsg("Copied estimate link to clipboard.");
      } else {
        setShareMsg("Sharing is not supported in this browser.");
      }
      setTimeout(() => setShareMsg(""), 2500);
    } catch (e) {
      setShareMsg("Share canceled or failed.");
      setTimeout(() => setShareMsg(""), 2500);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" /> Pet Ownership Costs Calculator
        </CardTitle>
        <CardDescription>
          Estimate annual and lifetime costs of owning a pet, including food, vet care, grooming, insurance, and supplies.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4" /> Averages from pet industry data. Adjust inputs to match your situation.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label>Pet Type</Label>
            <Select value={petType} onValueChange={(v) => setPetType(v as PetType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select pet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Dog</SelectItem>
                <SelectItem value="cat">Cat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="urban">Urban (+20%)</SelectItem>
                <SelectItem value="rural">Rural (-10%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Age (years)</Label>
            <Input type="number" min={0} max={25} step="0.1" value={age}
              onChange={(e) => setAge(parseFloat(e.target.value) || 0)} />
          </div>

          <div className="space-y-3">
            <Label>Expected Lifespan (years)</Label>
            <Input type="number" min={1} max={30} step="1" value={lifespan}
              onChange={(e) => setLifespan(parseFloat(e.target.value) || 0)} />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label>Annual Expenses</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Food</Label>
                <Input type="number" min={0} value={expenses.food}
                  onChange={(e) => setExpenses((prev) => ({ ...prev, food: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div>
                <Label className="text-xs">Vet Care</Label>
                <Input type="number" min={0} value={expenses.vet}
                  onChange={(e) => setExpenses((prev) => ({ ...prev, vet: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div>
                <Label className="text-xs">Grooming</Label>
                <Input type="number" min={0} value={expenses.grooming}
                  onChange={(e) => setExpenses((prev) => ({ ...prev, grooming: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div>
                <Label className="text-xs">Insurance</Label>
                <Input type="number" min={0} value={expenses.insurance}
                  onChange={(e) => setExpenses((prev) => ({ ...prev, insurance: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div>
                <Label className="text-xs">Toys & Supplies</Label>
                <Input type="number" min={0} value={expenses.toys}
                  onChange={(e) => setExpenses((prev) => ({ ...prev, toys: parseFloat(e.target.value) || 0 }))} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Initial/Adoption Cost</Label>
            <Input type="number" min={0} value={adoption}
              onChange={(e) => setAdoption(parseFloat(e.target.value) || 0)} />
            <p className="text-xs text-muted-foreground">Typical range $200–$500. One-time cost added to lifetime total.</p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm">Annual Cost (adjusted): <span className="font-semibold">{formatCurrency(annualAdjusted)}</span></div>
            <div className="text-sm">Years Remaining: <span className="font-semibold">{yearsRemaining}</span></div>
            <div className="text-sm">Lifetime Total: <span className="font-semibold">{formatCurrency(lifetimeTotal)}</span></div>
            {warnings.length > 0 && (
              <ul className="mt-2 text-xs text-amber-600 list-disc pl-4">
                {warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            )}
            <div className="flex gap-2 mt-2">
              <Button variant="outline" onClick={handleShare} className="gap-2">
                <Share2 className="h-4 w-4" /> Share/Save Estimate
              </Button>
              {shareMsg && <span className="text-xs text-muted-foreground self-center">{shareMsg}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Breakdown</Label>
            <ChartContainer config={chartConfig} className="aspect-auto w-full h-[280px] md:h-[320px]">
              <PieChart margin={{ top: 16, right: 16, bottom: 56, left: 16 }}>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" labelKey="name" />} />
                <Pie
                  data={breakdownData}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={76}
                  labelLine={false}
                >
                  {breakdownData.map((entry, index) => {
                    const key = entry.name as keyof typeof PALETTE;
                    const color = PALETTE[key] || "#8884d8";
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <ChartLegend verticalAlign="bottom" content={<ChartLegendContent nameKey="name" className="flex-wrap gap-3 text-[11px]" />} />
              </PieChart>
            </ChartContainer>
            <p className="text-xs text-muted-foreground">Tooltip: Averages from pet industry data. Adjust categories to your reality.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetCostsCalculator;