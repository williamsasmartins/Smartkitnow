import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function MolarityCalculator() {
  const [moles, setMoles] = useState("");
  const [volume, setVolume] = useState("");
  const [molarity, setMolarity] = useState("");
  const [mass, setMass] = useState("");
  const [molarMass, setMolarMass] = useState("");
  const [volumeUnit, setVolumeUnit] = useState("L");
  const [calculationType, setCalculationType] = useState("molarity");
  const [result, setResult] = useState<{
    molarity?: number;
    moles?: number;
    volume?: number;
    mass?: number;
  } | null>(null);

  const convertVolumeToLiters = (vol: number, unit: string): number => {
    switch (unit) {
      case "mL": return vol / 1000;
      case "μL": return vol / 1000000;
      default: return vol; // L
    }
  };

  const calculate = () => {
    if (calculationType === "molarity") {
      // Calculate molarity from moles and volume
      const molesNum = parseFloat(moles);
      const volumeNum = parseFloat(volume);
      
      if (!isNaN(molesNum) && !isNaN(volumeNum) && volumeNum > 0) {
        const volumeInL = convertVolumeToLiters(volumeNum, volumeUnit);
        const molarityResult = molesNum / volumeInL;
        setResult({ molarity: Number(molarityResult.toFixed(4)) });
      }
    } else if (calculationType === "moles") {
      // Calculate moles from molarity and volume
      const molarityNum = parseFloat(molarity);
      const volumeNum = parseFloat(volume);
      
      if (!isNaN(molarityNum) && !isNaN(volumeNum)) {
        const volumeInL = convertVolumeToLiters(volumeNum, volumeUnit);
        const molesResult = molarityNum * volumeInL;
        setResult({ moles: Number(molesResult.toFixed(4)) });
      }
    } else if (calculationType === "volume") {
      // Calculate volume from molarity and moles
      const molarityNum = parseFloat(molarity);
      const molesNum = parseFloat(moles);
      
      if (!isNaN(molarityNum) && !isNaN(molesNum) && molarityNum > 0) {
        const volumeInL = molesNum / molarityNum;
        let volumeResult = volumeInL;
        
        // Convert back to selected unit
        if (volumeUnit === "mL") volumeResult *= 1000;
        else if (volumeUnit === "μL") volumeResult *= 1000000;
        
        setResult({ volume: Number(volumeResult.toFixed(4)) });
      }
    } else if (calculationType === "mass") {
      // Calculate mass from molarity, volume, and molar mass
      const molarityNum = parseFloat(molarity);
      const volumeNum = parseFloat(volume);
      const molarMassNum = parseFloat(molarMass);
      
      if (!isNaN(molarityNum) && !isNaN(volumeNum) && !isNaN(molarMassNum)) {
        const volumeInL = convertVolumeToLiters(volumeNum, volumeUnit);
        const molesNeeded = molarityNum * volumeInL;
        const massResult = molesNeeded * molarMassNum;
        setResult({ mass: Number(massResult.toFixed(4)) });
      }
    }
  };

  const clearAll = () => {
    setMoles("");
    setVolume("");
    setMolarity("");
    setMass("");
    setMolarMass("");
    setVolumeUnit("L");
    setCalculationType("molarity");
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Molarity Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Calculate molarity, moles, volume, or mass for chemical solutions using the molarity formula.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Molarity Calculations</CardTitle>
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
                <SelectItem value="molarity">Molarity (M)</SelectItem>
                <SelectItem value="moles">Moles (n)</SelectItem>
                <SelectItem value="volume">Volume (V)</SelectItem>
                <SelectItem value="mass">Mass of solute</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {calculationType !== "molarity" && (
              <div>
                <Label htmlFor="molarity">Molarity (M)</Label>
                <Input
                  id="molarity"
                  type="number"
                  placeholder="Enter molarity"
                  value={molarity}
                  onChange={(e) => setMolarity(e.target.value)}
                  min="0"
                  step="any"
                />
              </div>
            )}

            {calculationType !== "moles" && (
              <div>
                <Label htmlFor="moles">Moles (n)</Label>
                <Input
                  id="moles"
                  type="number"
                  placeholder="Enter moles"
                  value={moles}
                  onChange={(e) => setMoles(e.target.value)}
                  min="0"
                  step="any"
                />
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
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="mL">mL</SelectItem>
                      <SelectItem value="μL">μL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {calculationType === "mass" && (
              <div>
                <Label htmlFor="molarMass">Molar Mass (g/mol)</Label>
                <Input
                  id="molarMass"
                  type="number"
                  placeholder="Enter molar mass"
                  value={molarMass}
                  onChange={(e) => setMolarMass(e.target.value)}
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
              {result.molarity !== undefined && (
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {result.molarity} M
                  </div>
                  <p className="text-muted-foreground">Molarity</p>
                </div>
              )}
              {result.moles !== undefined && (
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {result.moles} mol
                  </div>
                  <p className="text-muted-foreground">Moles</p>
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
              {result.mass !== undefined && (
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {result.mass} g
                  </div>
                  <p className="text-muted-foreground">Mass of solute</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Molarity Formula & Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Molarity Formula</h3>
            <p className="text-muted-foreground font-mono text-lg">M = n / V</p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• M = Molarity (mol/L)</li>
              <li>• n = Number of moles of solute</li>
              <li>• V = Volume of solution in liters</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">What is Molarity?</h3>
            <p className="text-sm text-muted-foreground">
              Molarity is a measure of solution concentration defined as the number of moles of solute per liter of solution. 
              It's the most common unit for expressing concentration in chemistry.
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Examples</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 1 M NaCl solution contains 1 mole of NaCl per liter</li>
              <li>• 0.5 M solution has half the concentration of 1 M solution</li>
              <li>• To make 500 mL of 0.1 M solution, you need 0.05 moles of solute</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
