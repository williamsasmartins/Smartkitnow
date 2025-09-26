import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function AquariumWeightCalculator() {
  const [gallons, setGallons] = useState("");
  const [tankType, setTankType] = useState("");
  const [substrate, setSubstrate] = useState("");
  const [decorations, setDecorations] = useState("");
  const [result, setResult] = useState<{
    waterWeight: number;
    tankWeight: number;
    substrateWeight: number;
    decorationsWeight: number;
    totalWeight: number;
  } | null>(null);

  const calculateWeight = () => {
    const gallonsNum = parseFloat(gallons);
    const decorationsNum = parseFloat(decorations) || 0;
    
    if (isNaN(gallonsNum) || gallonsNum <= 0 || !tankType || !substrate) {
      return;
    }

    // Water weight (8.34 lbs per gallon)
    const waterWeight = gallonsNum * 8.34;

    // Tank weight based on type and size
    let tankWeight = 0;
    if (tankType === "glass") {
      // Glass tanks: approximately 1-1.2 lbs per gallon
      tankWeight = gallonsNum * 1.1;
    } else if (tankType === "acrylic") {
      // Acrylic tanks: approximately 0.5-0.7 lbs per gallon
      tankWeight = gallonsNum * 0.6;
    } else if (tankType === "rimless") {
      // Rimless glass: slightly heavier due to thicker glass
      tankWeight = gallonsNum * 1.3;
    }

    // Substrate weight
    let substrateWeight = 0;
    if (substrate === "gravel") {
      // Gravel: about 1.5 lbs per gallon
      substrateWeight = gallonsNum * 1.5;
    } else if (substrate === "sand") {
      // Sand: about 1.8 lbs per gallon
      substrateWeight = gallonsNum * 1.8;
    } else if (substrate === "soil") {
      // Aqua soil: about 1.2 lbs per gallon
      substrateWeight = gallonsNum * 1.2;
    } else if (substrate === "bare") {
      substrateWeight = 0;
    }

    const totalWeight = waterWeight + tankWeight + substrateWeight + decorationsNum;

    setResult({
      waterWeight: Number(waterWeight.toFixed(1)),
      tankWeight: Number(tankWeight.toFixed(1)),
      substrateWeight: Number(substrateWeight.toFixed(1)),
      decorationsWeight: decorationsNum,
      totalWeight: Number(totalWeight.toFixed(1))
    });
  };

  const clearAll = () => {
    setGallons("");
    setTankType("");
    setSubstrate("");
    setDecorations("");
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Aquarium Weight Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Calculate the total weight of your aquarium setup including water, tank, substrate, and decorations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculate Total Tank Weight</CardTitle>
          <CardDescription>
            Enter your tank specifications to calculate the complete setup weight
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="gallons">Tank Volume (gallons)</Label>
              <Input
                id="gallons"
                type="number"
                placeholder="Enter tank volume"
                value={gallons}
                onChange={(e) => setGallons(e.target.value)}
                min="1"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="tankType">Tank Type</Label>
              <Select value={tankType} onValueChange={setTankType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tank type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="glass">Standard Glass</SelectItem>
                  <SelectItem value="acrylic">Acrylic</SelectItem>
                  <SelectItem value="rimless">Rimless Glass</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="substrate">Substrate Type</Label>
              <Select value={substrate} onValueChange={setSubstrate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select substrate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gravel">Gravel</SelectItem>
                  <SelectItem value="sand">Sand</SelectItem>
                  <SelectItem value="soil">Aqua Soil</SelectItem>
                  <SelectItem value="bare">Bare Bottom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="decorations">Decorations Weight (lbs)</Label>
              <Input
                id="decorations"
                type="number"
                placeholder="Enter decoration weight (optional)"
                value={decorations}
                onChange={(e) => setDecorations(e.target.value)}
                min="0"
                step="0.1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Include rocks, driftwood, ornaments, equipment
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={calculateWeight}>
              Calculate Weight
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
            <CardTitle>Weight Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {result.waterWeight}
                  </div>
                  <p className="text-sm text-muted-foreground">Water (lbs)</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {result.tankWeight}
                  </div>
                  <p className="text-sm text-muted-foreground">Tank (lbs)</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {result.substrateWeight}
                  </div>
                  <p className="text-sm text-muted-foreground">Substrate (lbs)</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {result.decorationsWeight}
                  </div>
                  <p className="text-sm text-muted-foreground">Decorations (lbs)</p>
                </div>
              </div>
              
              <div className="text-center p-6 border-2 border-primary rounded-lg">
                <div className="text-4xl font-bold text-primary mb-2">
                  {result.totalWeight} lbs
                </div>
                <p className="text-lg text-muted-foreground">Total Setup Weight</p>
                <p className="text-sm text-muted-foreground mt-2">
                  ({(result.totalWeight / 2.205).toFixed(1)} kg)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Weight Calculation Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Weight Components</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Water:</strong> 8.34 lbs per gallon (heaviest component)</li>
              <li>• <strong>Glass tanks:</strong> ~1.1 lbs per gallon</li>
              <li>• <strong>Acrylic tanks:</strong> ~0.6 lbs per gallon</li>
              <li>• <strong>Substrate:</strong> Varies by material density</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Stand Requirements</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Ensure stand can support 1.5x the calculated weight</li>
              <li>• Check floor support for large tanks (over 75 gallons)</li>
              <li>• Consider weight distribution across stand surface</li>
              <li>• Account for dynamic loads (water movement)</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Safety Notes</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Never exceed manufacturer stand weight limits</li>
              <li>• Ensure level placement to prevent stress fractures</li>
              <li>• Consider professional installation for tanks over 100 gallons</li>
              <li>• Check building codes for floor load limits</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}