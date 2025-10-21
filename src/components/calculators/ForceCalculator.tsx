import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function ForceCalculator() {
  const [mass, setMass] = useState("");
  const [acceleration, setAcceleration] = useState("");
  const [force, setForce] = useState("");
  const [massUnit, setMassUnit] = useState("kg");
  const [accelerationUnit, setAccelerationUnit] = useState("m/s²");
  const [forceUnit, setForceUnit] = useState("N");
  const [calculationType, setCalculationType] = useState("force");
  const [result, setResult] = useState<{
    force?: number;
    mass?: number;
    acceleration?: number;
  } | null>(null);

  const convertMass = (mass: number, fromUnit: string, toUnit: string): number => {
    const massInKg = fromUnit === "g" ? mass / 1000 : 
                     fromUnit === "lb" ? mass * 0.453592 : mass;
    
    if (toUnit === "g") return massInKg * 1000;
    if (toUnit === "lb") return massInKg / 0.453592;
    return massInKg;
  };

  const convertAcceleration = (acc: number, fromUnit: string, toUnit: string): number => {
    const accInMpS2 = fromUnit === "ft/s²" ? acc * 0.3048 : acc;
    
    if (toUnit === "ft/s²") return accInMpS2 / 0.3048;
    return accInMpS2;
  };

  const convertForce = (force: number, fromUnit: string, toUnit: string): number => {
    const forceInN = fromUnit === "lbf" ? force * 4.44822 :
                     fromUnit === "kgf" ? force * 9.80665 :
                     fromUnit === "dyne" ? force / 100000 : force;
    
    if (toUnit === "lbf") return forceInN / 4.44822;
    if (toUnit === "kgf") return forceInN / 9.80665;
    if (toUnit === "dyne") return forceInN * 100000;
    return forceInN;
  };

  const calculate = () => {
    if (calculationType === "force") {
      const massNum = parseFloat(mass);
      const accelerationNum = parseFloat(acceleration);
      
      if (!isNaN(massNum) && !isNaN(accelerationNum)) {
        // Convert to SI units
        const massInKg = convertMass(massNum, massUnit, "kg");
        const accInMpS2 = convertAcceleration(accelerationNum, accelerationUnit, "m/s²");
        
        // Calculate force in Newtons
        const forceInN = massInKg * accInMpS2;
        
        // Convert to desired unit
        const forceResult = convertForce(forceInN, "N", forceUnit);
        
        setResult({ force: Number(forceResult.toFixed(4)) });
      }
    } else if (calculationType === "mass") {
      const forceNum = parseFloat(force);
      const accelerationNum = parseFloat(acceleration);
      
      if (!isNaN(forceNum) && !isNaN(accelerationNum) && accelerationNum !== 0) {
        // Convert to SI units
        const forceInN = convertForce(forceNum, forceUnit, "N");
        const accInMpS2 = convertAcceleration(accelerationNum, accelerationUnit, "m/s²");
        
        // Calculate mass in kg
        const massInKg = forceInN / accInMpS2;
        
        // Convert to desired unit
        const massResult = convertMass(massInKg, "kg", massUnit);
        
        setResult({ mass: Number(massResult.toFixed(4)) });
      }
    } else if (calculationType === "acceleration") {
      const forceNum = parseFloat(force);
      const massNum = parseFloat(mass);
      
      if (!isNaN(forceNum) && !isNaN(massNum) && massNum !== 0) {
        // Convert to SI units
        const forceInN = convertForce(forceNum, forceUnit, "N");
        const massInKg = convertMass(massNum, massUnit, "kg");
        
        // Calculate acceleration in m/s²
        const accInMpS2 = forceInN / massInKg;
        
        // Convert to desired unit
        const accResult = convertAcceleration(accInMpS2, "m/s²", accelerationUnit);
        
        setResult({ acceleration: Number(accResult.toFixed(4)) });
      }
    }
  };

  const clearAll = () => {
    setMass("");
    setAcceleration("");
    setForce("");
    setMassUnit("kg");
    setAccelerationUnit("m/s²");
    setForceUnit("N");
    setCalculationType("force");
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Force Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Calculate force, mass, or acceleration using Newton's Second Law: F = ma
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Newton's Second Law Calculator</CardTitle>
          <CardDescription>
            Choose what you want to calculate and enter the known values
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="calculationType">What do you want to calculate?</Label>
            <Select value={calculationType} onValueChange={setCalculationType}>
              <SelectTrigger id="calculationType" aria-label="Calculation type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="force">Force (F)</SelectItem>
                <SelectItem value="mass">Mass (m)</SelectItem>
                <SelectItem value="acceleration">Acceleration (a)</SelectItem>
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
                    <SelectTrigger id="massUnit" aria-label="Mass unit" className="mt-2 w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lb">lb</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {calculationType !== "acceleration" && (
              <div>
                <Label htmlFor="acceleration">Acceleration</Label>
                <div className="flex gap-2">
                  <Input
                    id="acceleration"
                    type="number"
                    placeholder="Enter acceleration"
                    value={acceleration}
                    onChange={(e) => setAcceleration(e.target.value)}
                    step="any"
                    className="flex-1"
                  />
                  <Select value={accelerationUnit} onValueChange={setAccelerationUnit}>
                    <SelectTrigger id="accelerationUnit" aria-label="Acceleration unit" className="mt-2 w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m/s²">m/s²</SelectItem>
                      <SelectItem value="ft/s²">ft/s²</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {calculationType !== "force" && (
              <div>
                <Label htmlFor="force">Force</Label>
                <div className="flex gap-2">
                  <Input
                    id="force"
                    type="number"
                    placeholder="Enter force"
                    value={force}
                    onChange={(e) => setForce(e.target.value)}
                    min="0"
                    step="any"
                    className="flex-1"
                  />
                  <Select value={forceUnit} onValueChange={setForceUnit}>
                    <SelectTrigger id="forceUnit" aria-label="Force unit" className="mt-2 w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="N">N</SelectItem>
                      <SelectItem value="lbf">lbf</SelectItem>
                      <SelectItem value="kgf">kgf</SelectItem>
                      <SelectItem value="dyne">dyne</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              {result.force !== undefined && (
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {result.force} {forceUnit}
                  </div>
                  <p className="text-muted-foreground">Force</p>
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
              {result.acceleration !== undefined && (
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {result.acceleration} {accelerationUnit}
                  </div>
                  <p className="text-muted-foreground">Acceleration</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Newton's Second Law</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Formula</h3>
            <p className="text-muted-foreground font-mono text-lg">F = ma</p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• F = Force (Newtons)</li>
              <li>• m = Mass (kilograms)</li>
              <li>• a = Acceleration (meters per second squared)</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Common Force Examples</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Weight = mg (where g = 9.81 m/s²)</li>
              <li>• 1 Newton ≈ force to lift 100 grams against gravity</li>
              <li>• Car acceleration: 50,000 N for 1500 kg car at 33 m/s²</li>
              <li>• Earth's gravity provides 9.81 m/s² acceleration</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Unit Conversions</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 1 N = 1 kg⋅m/s²</li>
              <li>• 1 lbf = 4.448 N</li>
              <li>• 1 kgf = 9.807 N</li>
              <li>• 1 dyne = 10⁻⁵ N</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}