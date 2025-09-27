import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function AquariumVolumeCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [shape, setShape] = useState("");
  const [units, setUnits] = useState("inches");
  const [result, setResult] = useState<{
    gallons: number;
    liters: number;
    cubicInches: number;
    waterWeight: number;
  } | null>(null);

  const calculateVolume = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    
    if (isNaN(l) || isNaN(w) || isNaN(h) || l <= 0 || w <= 0 || h <= 0 || !shape) {
      return;
    }

    let cubicInches = 0;

    // Convert to inches if needed
    const lengthInches = units === "cm" ? l / 2.54 : l;
    const widthInches = units === "cm" ? w / 2.54 : w;
    const heightInches = units === "cm" ? h / 2.54 : h;

    if (shape === "rectangular") {
      cubicInches = lengthInches * widthInches * heightInches;
    } else if (shape === "cylindrical") {
      // For cylinder: length = diameter, width not used, height = height
      const radius = lengthInches / 2;
      cubicInches = Math.PI * radius * radius * heightInches;
    } else if (shape === "bow-front") {
      // Bow front approximation (about 1.2x rectangular volume)
      cubicInches = lengthInches * widthInches * heightInches * 1.2;
    }

    // Account for substrate, decorations, etc. (typically 90% of gross volume)
    const actualCubicInches = cubicInches * 0.9;

    // Convert to gallons (231 cubic inches = 1 gallon)
    const gallons = actualCubicInches / 231;
    
    // Convert to liters (1 gallon = 3.78541 liters)
    const liters = gallons * 3.78541;
    
    // Water weight (1 gallon = 8.34 lbs)
    const waterWeight = gallons * 8.34;

    setResult({
      gallons: Number(gallons.toFixed(1)),
      liters: Number(liters.toFixed(1)),
      cubicInches: Number(actualCubicInches.toFixed(0)),
      waterWeight: Number(waterWeight.toFixed(1))
    });
  };

  const clearAll = () => {
    setLength("");
    setWidth("");
    setHeight("");
    setShape("");
    setUnits("inches");
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Aquarium Volume Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Calculate your aquarium's water volume, capacity, and weight based on dimensions and shape.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculate Tank Volume</CardTitle>
          <CardDescription>
            Enter your aquarium dimensions to calculate water capacity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="shape">Tank Shape</Label>
              <Select value={shape} onValueChange={setShape}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tank shape" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rectangular">Rectangular</SelectItem>
                  <SelectItem value="cylindrical">Cylindrical</SelectItem>
                  <SelectItem value="bow-front">Bow Front</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="units">Units</Label>
              <Select value={units} onValueChange={setUnits}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inches">Inches</SelectItem>
                  <SelectItem value="cm">Centimeters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="length">
                {shape === "cylindrical" ? "Diameter" : "Length"} ({units})
              </Label>
              <Input
                id="length"
                type="number"
                placeholder={shape === "cylindrical" ? "Enter diameter" : "Enter length"}
                value={length}
                onChange={(e) => setLength(e.target.value)}
                min="0"
                step="0.1"
              />
            </div>
            {shape !== "cylindrical" && (
              <div>
                <Label htmlFor="width">Width ({units})</Label>
                <Input
                  id="width"
                  type="number"
                  placeholder="Enter width"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>
            )}
            <div>
              <Label htmlFor="height">Height ({units})</Label>
              <Input
                id="height"
                type="number"
                placeholder="Enter height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={calculateVolume}>
              Calculate Volume
            </Button>
            <Button onClick={clearAll} variant="secondary">
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tank Volume Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {result.gallons}
                </div>
                <p className="text-muted-foreground">US Gallons</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {result.liters}
                </div>
                <p className="text-muted-foreground">Liters</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {result.cubicInches}
                </div>
                <p className="text-muted-foreground">Cubic Inches</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {result.waterWeight}
                </div>
                <p className="text-muted-foreground">lbs (water only)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Volume Calculation Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Calculation Notes</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Results show actual water volume (90% of gross tank volume)</li>
              <li>• Accounts for substrate, decorations, and equipment</li>
              <li>• Bow front tanks estimated at 120% of rectangular volume</li>
              <li>• Water weight calculation includes water only (not tank weight)</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Tank Shape Guidelines</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Rectangular:</strong> Standard aquarium shape</li>
              <li>• <strong>Cylindrical:</strong> Round tanks (enter diameter as length)</li>
              <li>• <strong>Bow Front:</strong> Curved front glass tanks</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Important Reminders</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Check your stand's weight capacity before setup</li>
              <li>• Factor in substrate depth (usually 1-3 inches)</li>
              <li>• Consider equipment displacement</li>
              <li>• Fill levels are typically 1-2 inches below the rim</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
