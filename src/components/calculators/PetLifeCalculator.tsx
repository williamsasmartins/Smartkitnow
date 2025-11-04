import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dog, Cat, Bird, Info } from "lucide-react";

// Pet Life Stage and Age Conversion Calculator
// Convert pet ages to human years approximations and determine life stage.

type PetType = "dog" | "cat" | "bird";

type DogSize = "small" | "medium" | "large" | "giant" | "average";
type BirdType = "parrot" | "small-bird" | "average";

type SizeOrBreed = DogSize | BirdType | "average";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round(n: number, d = 0) {
  const p = Math.pow(10, d);
  return Math.round(n * p) / p;
}

function humanYearsDog(age: number, size: DogSize): number {
  if (!isFinite(age) || age <= 0) return 0;
  // Base formula from studies: 16 * ln(age) + 31
  const base = 16 * Math.log(age) + 31;
  // Adjust by size: small slightly higher, giant lower
  const adjust = size === "small" ? 1.0 : size === "medium" ? 0.5 : size === "large" ? -2.0 : size === "giant" ? -4.0 : 0;
  return Math.max(0, base + adjust);
}

function humanYearsCat(age: number): number {
  if (!isFinite(age) || age <= 0) return 0;
  // First year ~15, second +9, subsequent +4 per year
  if (age <= 1) return 15 * age; // crude scaling for <1y
  if (age <= 2) return 15 + 9 * (age - 1);
  return 15 + 9 + 4 * (age - 2);
}

function humanYearsBird(age: number, kind: BirdType): number {
  if (!isFinite(age) || age <= 0) return 0;
  // Example: Parrot ~5 human years per bird year; small birds ~4
  const factor = kind === "parrot" ? 5 : kind === "small-bird" ? 4 : 4.5;
  return age * factor;
}

function lifeStage(pet: PetType, age: number, size: DogSize | BirdType): string {
  if (pet === "dog") {
    const seniorThreshold = size === "large" || size === "giant" ? 6 : 7;
    if (age < 1) return "Young";
    if (age <= seniorThreshold) return "Adult";
    return "Senior";
  }
  if (pet === "cat") {
    if (age < 1) return "Kitten";
    if (age <= 7) return "Adult";
    return "Senior";
  }
  // bird
  if (age < 1) return "Juvenile";
  if (age <= 10) return "Adult";
  return "Senior";
}

function lifespanRange(pet: PetType, size: SizeOrBreed): [number, number] {
  if (pet === "dog") {
    switch (size as DogSize) {
      case "small": return [12, 16];
      case "medium": return [10, 13];
      case "large": return [8, 12];
      case "giant": return [6, 10];
      default: return [10, 13];
    }
  }
  if (pet === "cat") return [12, 18];
  // bird
  if ((size as BirdType) === "parrot") return [20, 50];
  if ((size as BirdType) === "small-bird") return [5, 10];
  return [8, 20];
}

const ComparisonBar: React.FC<{ current: number; max: number }> = ({ current, max }) => {
  const used = clamp(current, 0, max);
  const pct = max > 0 ? (used / max) * 100 : 0;
  return (
    <div>
      <div className="h-4 w-full rounded-md overflow-hidden flex bg-muted" title={`Age vs. Lifespan`}>
        <div className="h-full" style={{ width: `${pct}%`, backgroundColor: "#06b6d4" }} />
        <div className="h-full" style={{ width: `${100 - pct}%`, backgroundColor: "#3c83f6" }} />
      </div>
      <div className="text-xs mt-2 text-muted-foreground">Comparison: Current age vs. expected lifespan</div>
    </div>
  );
};

const PetLifeCalculator: React.FC = () => {
  const [pet, setPet] = useState<PetType>("dog");
  const [age, setAge] = useState<number>(3);
  const [size, setSize] = useState<SizeOrBreed>("average");

  // Update size options when pet changes
  const sizeOptions: SizeOrBreed[] = useMemo(() => {
    if (pet === "dog") return ["small", "medium", "large", "giant", "average"];
    if (pet === "bird") return ["parrot", "small-bird", "average"];
    return ["average"]; // cat
  }, [pet]);

  const humanAge = useMemo(() => {
    if (pet === "dog") return humanYearsDog(age, (size as DogSize) || "average");
    if (pet === "cat") return humanYearsCat(age);
    return humanYearsBird(age, (size as BirdType) || "average");
  }, [pet, age, size]);

  const stage = useMemo(() => lifeStage(pet, age, size), [pet, age, size]);
  const [minLife, maxLife] = useMemo(() => lifespanRange(pet, size), [pet, size]);

  const warning = useMemo(() => {
    if (age <= 0) return "Age must be positive.";
    if (age > maxLife) return "Warning: Age exceeds typical lifespan range for this pet.";
    return "";
  }, [age, maxLife]);

  const icon = useMemo(() => {
    switch (pet) {
      case "dog": return <Dog className="h-6 w-6" />;
      case "cat": return <Cat className="h-6 w-6" />;
      case "bird": return <Bird className="h-6 w-6" />;
    }
  }, [pet]);

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl" style={{ color: "#3c83f6" }}>Pet Life Stage & Age Conversion</CardTitle>
        <CardDescription>
          Convert pet ages to human years and determine life stage. {" "}
          <span title="Approximate based on studies">
            <Info className="inline h-4 w-4" /> Tooltip: Approximate based on studies
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Pet Type</Label>
            <Select value={pet} onValueChange={(v) => setPet(v as PetType)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Dog</SelectItem>
                <SelectItem value="cat">Cat</SelectItem>
                <SelectItem value="bird">Bird</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">{icon} Selected: {pet}</div>
          </div>
          <div>
            <Label>Age (years)</Label>
            <Input type="number" min={0.1} max={25} step={0.1} value={age} onChange={(e) => setAge(Number(e.target.value))} />
            <div className="text-xs text-muted-foreground mt-1">Enter age in years (e.g., 3.5).</div>
          </div>
          <div>
            <Label>{pet === "dog" ? "Breed/Size" : pet === "bird" ? "Bird Type" : "Breed/Size"}</Label>
            <Select value={String(size)} onValueChange={(v) => setSize(v as SizeOrBreed)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {sizeOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt.replace("-", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-sm">Human Age (approx): <span className="font-semibold">{round(humanAge, 0)} years</span></div>
          <div className="text-sm">Life Stage: <span className="font-semibold">{stage}</span></div>
          <div className="text-sm">Expected Lifespan: <span className="font-semibold">{minLife}-{maxLife} years</span></div>
        </div>

        <ComparisonBar current={age} max={maxLife} />

        {warning && <div className="text-xs text-red-600 mt-2">{warning}</div>}

        <div className="text-xs text-muted-foreground mt-2">
          Examples: Dog (medium), 3 years → ~33 human years, Adult, Lifespan 10–13 years. Bird (parrot), 5 years → ~25 human years, Adult.
        </div>
      </CardContent>
    </Card>
  );
};

export default PetLifeCalculator;