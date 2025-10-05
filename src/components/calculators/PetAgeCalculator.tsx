/* eslint-disable react-refresh/only-export-components */
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export type DogSize = "small" | "medium" | "large" | "giant";

export function computeDogHumanAge(ageYears: number, size: DogSize): number {
  if (ageYears <= 0) return 0;
  // Based on size-adjusted model used in DogAgeCalculator: 1st two years ~12.5 each, then size-dependent multiplier
  if (ageYears <= 2) {
    return ageYears * 12.5;
  }
  const base = 25; // first two years
  const extraYears = ageYears - 2;
  const multiplier = size === "small" ? 4.5 : size === "medium" ? 5.5 : size === "large" ? 6.5 : 7.5;
  return base + extraYears * multiplier;
}

export function computeCatHumanAge(ageYears: number): number {
  if (ageYears <= 0) return 0;
  // Common veterinary guideline: 1st year ≈ 15, 2nd ≈ 24, each additional year ≈ +4
  if (ageYears <= 1) return ageYears * 15;
  if (ageYears <= 2) return 24;
  return 24 + (ageYears - 2) * 4;
}

function getLifeStage(species: "dog" | "cat", ageYears: number): string {
  if (species === "dog") {
    if (ageYears < 0.5) return "Puppy";
    if (ageYears < 2) return "Young Adult";
    if (ageYears < 7) return "Adult";
    if (ageYears < 10) return "Senior";
    return "Geriatric";
  }
  // cats
  if (ageYears < 0.25) return "Kitten"; // ~0-3 months
  if (ageYears < 1) return "Junior";
  if (ageYears < 3) return "Young Adult";
  if (ageYears < 6) return "Prime Adult";
  if (ageYears < 10) return "Mature";
  if (ageYears < 15) return "Senior";
  return "Super Senior";
}

const PetAgeCalculator: React.FC = () => {
  const [species, setSpecies] = useState<"dog" | "cat" | "">("");
  const [age, setAge] = useState<string>("");
  const [dogSize, setDogSize] = useState<DogSize | "">("");
  const [result, setResult] = useState<{ humanAge: number; lifestage: string } | null>(null);

  const calculateAge = () => {
    const ageYears = parseFloat(age);
    if (isNaN(ageYears) || ageYears < 0 || !species) return;

    let humanAge = 0;
    if (species === "dog") {
      if (!dogSize) return;
      humanAge = computeDogHumanAge(ageYears, dogSize as DogSize);
    } else {
      humanAge = computeCatHumanAge(ageYears);
    }

    const lifestage = getLifeStage(species as "dog" | "cat", ageYears);
    setResult({ humanAge: Math.round(humanAge), lifestage });
  };

  const clearAll = () => {
    setSpecies("");
    setAge("");
    setDogSize("");
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">Pet Age Calculator</h1>
        <p className="text-lg text-muted-foreground">Convert your pet's age into human years based on species and size.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculate Pet Age in Human Years</CardTitle>
          <CardDescription>Select species and enter age. For dogs, choose size for better accuracy.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="species">Species</Label>
              <Select value={species} onValueChange={(v) => setSpecies(v as any)}>
                <SelectTrigger id="species" aria-label="Species">
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="age">Age (years)</Label>
              <Input id="age" type="number" placeholder="Enter age" value={age} onChange={(e) => setAge(e.target.value)} min="0" step="0.1" />
            </div>
          </div>

          {species === "dog" && (
            <div>
              <Label htmlFor="dogSize">Dog size</Label>
              <Select value={dogSize || undefined} onValueChange={(v) => setDogSize(v as DogSize)}>
                <SelectTrigger id="dogSize" aria-label="Dog size">
                  <SelectValue placeholder="Select dog size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (under 20 lbs)</SelectItem>
                  <SelectItem value="medium">Medium (20-50 lbs)</SelectItem>
                  <SelectItem value="large">Large (50-90 lbs)</SelectItem>
                  <SelectItem value="giant">Giant (over 90 lbs)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />
          <div className="flex gap-2">
            <Button variant="calculate" onClick={calculateAge}>Calculate Age</Button>
            <Button onClick={clearAll} variant="reset">Clear</Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">{result.humanAge} years old</div>
                <p className="text-muted-foreground">in human years</p>
              </div>
              <div className="text-lg">Life Stage: <span className="font-semibold text-primary">{result.lifestage}</span></div>
              <Separator />
              <div className="text-sm text-muted-foreground">
                Note: Dog conversion uses size-adjusted coefficients; Cat conversion follows common veterinary guidelines (first year ~15, second ~24, then +4/year).
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PetAgeCalculator;