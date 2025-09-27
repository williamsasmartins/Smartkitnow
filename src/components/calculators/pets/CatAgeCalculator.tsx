import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function CatAgeCalculator() {
  const [catAge, setCatAge] = useState("");
  const [result, setResult] = useState<{ humanAge: number; lifestage: string } | null>(null);

  const calculateAge = () => {
    const age = parseFloat(catAge);
    
    if (isNaN(age) || age < 0) {
      return;
    }

    let humanAge = 0;
    let lifestage = "";

    // Cat age calculation based on veterinary guidelines
    if (age <= 1) {
      humanAge = age * 15;
    } else if (age <= 2) {
      humanAge = 15 + (age - 1) * 9; // Second year adds 9 years
    } else {
      humanAge = 24 + (age - 2) * 4; // Each year after 2 adds 4 years
    }

    // Determine life stage
    if (age < 0.25) {
      lifestage = "Kitten";
    } else if (age < 1) {
      lifestage = "Junior";
    } else if (age < 3) {
      lifestage = "Young Adult";
    } else if (age < 6) {
      lifestage = "Prime Adult";
    } else if (age < 10) {
      lifestage = "Mature";
    } else if (age < 15) {
      lifestage = "Senior";
    } else {
      lifestage = "Super Senior";
    }

    setResult({ humanAge: Math.round(humanAge), lifestage });
  };

  const clearAll = () => {
    setCatAge("");
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Cat Age Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Convert your cat's age to human years using the most current veterinary guidelines.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculate Your Cat's Human Age</CardTitle>
          <CardDescription>
            Enter your cat's age to get an accurate conversion to human years
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="max-w-md">
            <Label htmlFor="catAge">Cat's Age (years)</Label>
            <Input
              id="catAge"
              type="number"
              placeholder="Enter age"
              value={catAge}
              onChange={(e) => setCatAge(e.target.value)}
              min="0"
              step="0.1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              You can use decimals (e.g., 1.5 for 1 year and 6 months)
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={calculateAge}>
              Calculate Age
            </Button>
            <Button onClick={clearAll} variant="secondary">
              Clear
            </Button>
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
                <div className="text-4xl font-bold text-primary mb-2">
                  {result.humanAge} years old
                </div>
                <p className="text-muted-foreground">in human years</p>
              </div>
              <div className="text-lg">
                Life Stage: <span className="font-semibold text-primary">{result.lifestage}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Cat Age Calculation Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Veterinary Guidelines</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>First year:</strong> 15 human years</li>
              <li>• <strong>Second year:</strong> Additional 9 human years (total 24)</li>
              <li>• <strong>Each year after:</strong> Additional 4 human years</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Cat Life Stages</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Kitten:</strong> 0-3 months</li>
              <li>• <strong>Junior:</strong> 3-12 months</li>
              <li>• <strong>Young Adult:</strong> 1-3 years</li>
              <li>• <strong>Prime Adult:</strong> 3-6 years</li>
              <li>• <strong>Mature:</strong> 6-10 years</li>
              <li>• <strong>Senior:</strong> 10-15 years</li>
              <li>• <strong>Super Senior:</strong> 15+ years</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Health Care by Age</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Young cats:</strong> Annual checkups, vaccinations</li>
              <li>• <strong>Mature cats:</strong> Bi-annual checkups recommended</li>
              <li>• <strong>Senior cats:</strong> More frequent health monitoring</li>
              <li>• <strong>Super seniors:</strong> Regular blood work and screenings</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
