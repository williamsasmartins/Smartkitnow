import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function DogAgeCalculator() {
  const [dogAge, setDogAge] = useState("");
  const [dogSize, setDogSize] = useState("");
  const [result, setResult] = useState<{ humanAge: number; lifestage: string } | null>(null);

  const calculateAge = () => {
    const age = parseFloat(dogAge);
    
    if (isNaN(age) || age < 0 || !dogSize) {
      return;
    }

    let humanAge = 0;
    let lifestage = "";

    // Modern dog age calculation based on size
    if (dogSize === "small") {
      // Small dogs (under 20 lbs): slower aging
      if (age <= 2) {
        humanAge = age * 12.5;
      } else {
        humanAge = 25 + (age - 2) * 4.5;
      }
    } else if (dogSize === "medium") {
      // Medium dogs (20-50 lbs): moderate aging
      if (age <= 2) {
        humanAge = age * 12.5;
      } else {
        humanAge = 25 + (age - 2) * 5.5;
      }
    } else if (dogSize === "large") {
      // Large dogs (50-90 lbs): faster aging
      if (age <= 2) {
        humanAge = age * 12.5;
      } else {
        humanAge = 25 + (age - 2) * 6.5;
      }
    } else if (dogSize === "giant") {
      // Giant dogs (over 90 lbs): fastest aging
      if (age <= 2) {
        humanAge = age * 12.5;
      } else {
        humanAge = 25 + (age - 2) * 7.5;
      }
    }

    // Determine life stage
    if (age < 0.5) {
      lifestage = "Puppy";
    } else if (age < 2) {
      lifestage = "Young Adult";
    } else if (age < 7) {
      lifestage = "Adult";
    } else if (age < 10) {
      lifestage = "Senior";
    } else {
      lifestage = "Geriatric";
    }

    setResult({ humanAge: Math.round(humanAge), lifestage });
  };

  const clearAll = () => {
    setDogAge("");
    setDogSize("");
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Dog Age Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Convert your dog's age to human years based on size and breed. Different sized dogs age at different rates.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculate Your Dog's Human Age</CardTitle>
          <CardDescription>
            Enter your dog's age and size to get an accurate conversion to human years
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="dogAge">Dog's Age (years)</Label>
              <Input
                id="dogAge"
                type="number"
                placeholder="Enter age"
                value={dogAge}
                onChange={(e) => setDogAge(e.target.value)}
                min="0"
                step="0.1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can use decimals (e.g., 1.5 for 1 year and 6 months)
              </p>
            </div>
            <div>
              <Label htmlFor="dogSize">Dog Size</Label>
              <Select value={dogSize} onValueChange={setDogSize}>
                <SelectTrigger>
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
          <CardTitle>How Dog Age Calculation Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Modern Age Calculation</h3>
            <p className="text-muted-foreground text-sm">
              The old "multiply by 7" rule is outdated. Modern calculations consider that dogs age faster in their early years and that different sizes age at different rates.
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Size-Based Aging</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Small dogs:</strong> Live longer, age slower after 2 years</li>
              <li>• <strong>Medium dogs:</strong> Moderate aging rate</li>
              <li>• <strong>Large dogs:</strong> Age faster, shorter lifespan</li>
              <li>• <strong>Giant dogs:</strong> Age fastest, shortest lifespan</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Life Stages</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Puppy:</strong> 0-6 months</li>
              <li>• <strong>Young Adult:</strong> 6 months - 2 years</li>
              <li>• <strong>Adult:</strong> 2-7 years</li>
              <li>• <strong>Senior:</strong> 7-10 years</li>
              <li>• <strong>Geriatric:</strong> 10+ years</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
