import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function DensityCalculator() {
  const [mass, setMass] = useState("");
  const [volume, setVolume] = useState("");
  const [density, setDensity] = useState("");
  const [massUnit, setMassUnit] = useState("g");
  const [volumeUnit, setVolumeUnit] = useState("cm3");
  const [calculationType, setCalculationType] = useState("density");
  const [result, setResult] = useState<{
    density?: number;
    mass?: number;
    volume?: number;
    densityUnit?: string;
  } | null>(null);

  const convertMass = (mass: number, fromUnit: string, toUnit: string): number => {
    const massInGrams = fromUnit === "kg" ? mass * 1000 : 
                       fromUnit === "mg" ? mass / 1000 : mass;
    
    if (toUnit === "kg") return massInGrams / 1000;
    if (toUnit === "mg") return massInGrams * 1000;
    return massInGrams;
  };

  const convertVolume = (volume: number, fromUnit: string, toUnit: string): number => {
    const volumeInCm3 = fromUnit === "m3" ? volume * 1000000 :
                        fromUnit === "L" ? volume * 1000 :
                        fromUnit === "mL" ? volume : volume;
    
    if (toUnit === "m3") return volumeInCm3 / 1000000;
    if (toUnit === "L") return volumeInCm3 / 1000;
    if (toUnit === "mL") return volumeInCm3;
    return volumeInCm3;
  };

  const calculate = () => {
    if (calculationType === "density") {
      const massNum = parseFloat(mass);
      const volumeNum = parseFloat(volume);
      
      if (!isNaN(massNum) && !isNaN(volumeNum) && volumeNum > 0) {
        // Convert to standard units (g/cm³)
        const massInG = convertMass(massNum, massUnit, "g");
        const volumeInCm3 = convertVolume(volumeNum, volumeUnit, "cm3");
        
        const densityResult = massInG / volumeInCm3;
        
        setResult({ 
          density: Number(densityResult.toFixed(4)), 
          densityUnit: "g/cm³" 
        });
      }
    } else if (calculationType === "mass") {
      const densityNum = parseFloat(density);
      const volumeNum = parseFloat(volume);
      
      if (!isNaN(densityNum) && !isNaN(volumeNum)) {
        const volumeInCm3 = convertVolume(volumeNum, volumeUnit, "cm3");
        const massInG = densityNum * volumeInCm3;
        const massResult = convertMass(massInG, "g", massUnit);
        
        setResult({ mass: Number(massResult.toFixed(4)) });
      }
    } else if (calculationType === "volume") {
      const densityNum = parseFloat(density);
      const massNum = parseFloat(mass);
      
      if (!isNaN(densityNum) && !isNaN(massNum) && densityNum > 0) {
        const massInG = convertMass(massNum, massUnit, "g");
        const volumeInCm3 = massInG / densityNum;
        const volumeResult = convertVolume(volumeInCm3, "cm3", volumeUnit);
        
        setResult({ volume: Number(volumeResult.toFixed(4)) });
      }
    }
  };

  const clearAll = () => {
    setMass("");
    setVolume("");
    setDensity("");
    setMassUnit("g");
    setVolumeUnit("cm3");
    setCalculationType("density");
    setResult(null);
  };

  const commonDensities = [
    { name: "Water", density: 1.0, unit: "g/cm³" },
    { name: "Ice", density: 0.92, unit: "g/cm³" },
    { name: "Aluminum", density: 2.70, unit: "g/cm³" },
    { name: "Iron", density: 7.87, unit: "g/cm³" },
    { name: "Lead", density: 11.34, unit: "g/cm³" },
    { name: "Gold", density: 19.32, unit: "g/cm³" },
    { name: "Mercury", density: 13.53, unit: "g/cm³" },
    { name: "Air (STP)", density: 0.001225, unit: "g/cm³" }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Density Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Calculate density, mass, or volume using the density formula: Density = Mass / Volume
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Density Calculations</CardTitle>
          <CardDescription>
            Choose what you want to calculate and enter the known values
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="calculationType">What do you want to calculate?</Label>
            <Select value={calculationType} onValueChange={setCalculationType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="density">Density (ρ)</SelectItem>
                <SelectItem value="mass">Mass (m)</SelectItem>
                <SelectItem value="volume">Volume (V)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {calculationType !== "mass" && (
              <div>
                <Label htmlFor="mass">Mass</Label>
                <div className="flex gap-2">
                  <Input
                    id="mass"
                    type="number"
                    placeholder="Enter mass"
                    value={mass}
                    onChange={(e) => setMass(e.target.value)}
                    min="0"
                    step="any"
                    className="flex-1"
                  />
                  <Select value={massUnit} onValueChange={setMassUnit}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mg">mg</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {calculationType !== "volume" && (
              <div>
                <Label htmlFor="volume">Volume</Label>
                <div className="flex gap-2">
                  <Input
                    id="volume"
                    type="number"
                    placeholder="Enter volume"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    min="0"
                    step="any"
                    className="flex-1"
                  />
                  <Select value={volumeUnit} onValueChange={setVolumeUnit}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm3">cm³</SelectItem>
                      <SelectItem value="mL">mL</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="m3">m³</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {calculationType !== "density" && (
              <div>
                <Label htmlFor="density">Density (g/cm³)</Label>
                <Input
                  id="density"
                  type="number"
                  placeholder="Enter density"
                  value={density}
                  onChange={(e) => setDensity(e.target.value)}
                  min="0"
                  step="any"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={calculate}>
              Calculate
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
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              {result.density !== undefined && (
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {result.density} {result.densityUnit}
                  </div>
                  <p className="text-muted-foreground">Density</p>
                </div>
              )}
              {result.mass !== undefined && (
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {result.mass} {massUnit}
                  </div>
                  <p className="text-muted-foreground">Mass</p>
                </div>
              )}
              {result.volume !== undefined && (
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {result.volume} {volumeUnit}
                  </div>
                  <p className="text-muted-foreground">Volume</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Common Material Densities</CardTitle>
          <CardDescription>Reference densities for common materials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {commonDensities.map((material, index) => (
              <div key={index} className="p-3 border rounded text-center">
                <div className="font-semibold">{material.name}</div>
                <div className="text-sm text-muted-foreground">
                  {material.density} {material.unit}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Density Formula & Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Density Formula</h3>
            <p className="text-muted-foreground font-mono text-lg">ρ = m / V</p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• ρ (rho) = Density</li>
              <li>• m = Mass</li>
              <li>• V = Volume</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">What is Density?</h3>
            <p className="text-sm text-muted-foreground">
              Density is a measure of how much mass is contained in a given volume. It's an intrinsic property of materials 
              and is commonly expressed in g/cm³ or kg/m³.
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Applications</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Material identification and quality control</li>
              <li>• Determining if objects will float or sink</li>
              <li>• Engineering design and material selection</li>
              <li>• Chemical analysis and purity testing</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
