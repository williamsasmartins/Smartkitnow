import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function VelocityCalculator() {
  const [displacement, setDisplacement] = useState("");
  const [time, setTime] = useState("");
  const [velocity, setVelocity] = useState("");
  const [initialVelocity, setInitialVelocity] = useState("");
  const [finalVelocity, setFinalVelocity] = useState("");
  const [displacementUnit, setDisplacementUnit] = useState("m");
  const [timeUnit, setTimeUnit] = useState("s");
  const [velocityUnit, setVelocityUnit] = useState("m/s");
  const [calculationType, setCalculationType] = useState("average-velocity");
  const [result, setResult] = useState<{
    velocity?: number;
    displacement?: number;
    time?: number;
    velocityType?: string;
  } | null>(null);

  const convertDisplacement = (disp: number, fromUnit: string, toUnit: string): number => {
    const dispInM = fromUnit === "km" ? disp * 1000 :
                    fromUnit === "cm" ? disp / 100 :
                    fromUnit === "mm" ? disp / 1000 :
                    fromUnit === "ft" ? disp * 0.3048 :
                    fromUnit === "in" ? disp * 0.0254 : disp;
    
    if (toUnit === "km") return dispInM / 1000;
    if (toUnit === "cm") return dispInM * 100;
    if (toUnit === "mm") return dispInM * 1000;
    if (toUnit === "ft") return dispInM / 0.3048;
    if (toUnit === "in") return dispInM / 0.0254;
    return dispInM;
  };

  const convertTime = (time: number, fromUnit: string, toUnit: string): number => {
    const timeInS = fromUnit === "min" ? time * 60 :
                    fromUnit === "hr" ? time * 3600 :
                    fromUnit === "ms" ? time / 1000 : time;
    
    if (toUnit === "min") return timeInS / 60;
    if (toUnit === "hr") return timeInS / 3600;
    if (toUnit === "ms") return timeInS * 1000;
    return timeInS;
  };

  const convertVelocity = (vel: number, fromUnit: string, toUnit: string): number => {
    const velInMpS = fromUnit === "km/h" ? vel / 3.6 :
                     fromUnit === "mph" ? vel * 0.44704 :
                     fromUnit === "ft/s" ? vel * 0.3048 : vel;
    
    if (toUnit === "km/h") return velInMpS * 3.6;
    if (toUnit === "mph") return velInMpS / 0.44704;
    if (toUnit === "ft/s") return velInMpS / 0.3048;
    return velInMpS;
  };

  const calculate = () => {
    if (calculationType === "average-velocity") {
      // v = d / t
      const dispNum = parseFloat(displacement);
      const timeNum = parseFloat(time);
      
      if (!isNaN(dispNum) && !isNaN(timeNum) && timeNum > 0) {
        const dispInM = convertDisplacement(dispNum, displacementUnit, "m");
        const timeInS = convertTime(timeNum, timeUnit, "s");
        
        const velInMpS = dispInM / timeInS;
        const velResult = convertVelocity(velInMpS, "m/s", velocityUnit);
        
        setResult({ 
          velocity: Number(velResult.toFixed(4)), 
          velocityType: "Average Velocity" 
        });
      }
    } else if (calculationType === "final-velocity") {
      // v_avg = (v_i + v_f) / 2, so v_f = 2*v_avg - v_i
      const avgVelNum = parseFloat(velocity);
      const initVelNum = parseFloat(initialVelocity);
      
      if (!isNaN(avgVelNum) && !isNaN(initVelNum)) {
        const avgVelInMpS = convertVelocity(avgVelNum, velocityUnit, "m/s");
        const initVelInMpS = convertVelocity(initVelNum, velocityUnit, "m/s");
        
        const finalVelInMpS = 2 * avgVelInMpS - initVelInMpS;
        const finalVelResult = convertVelocity(finalVelInMpS, "m/s", velocityUnit);
        
        setResult({ 
          velocity: Number(finalVelResult.toFixed(4)), 
          velocityType: "Final Velocity" 
        });
      }
    } else if (calculationType === "displacement") {
      // d = v * t
      const velNum = parseFloat(velocity);
      const timeNum = parseFloat(time);
      
      if (!isNaN(velNum) && !isNaN(timeNum)) {
        const velInMpS = convertVelocity(velNum, velocityUnit, "m/s");
        const timeInS = convertTime(timeNum, timeUnit, "s");
        
        const dispInM = velInMpS * timeInS;
        const dispResult = convertDisplacement(dispInM, "m", displacementUnit);
        
        setResult({ displacement: Number(dispResult.toFixed(4)) });
      }
    } else if (calculationType === "time") {
      // t = d / v
      const dispNum = parseFloat(displacement);
      const velNum = parseFloat(velocity);
      
      if (!isNaN(dispNum) && !isNaN(velNum) && velNum !== 0) {
        const dispInM = convertDisplacement(dispNum, displacementUnit, "m");
        const velInMpS = convertVelocity(velNum, velocityUnit, "m/s");
        
        const timeInS = dispInM / velInMpS;
        const timeResult = convertTime(timeInS, "s", timeUnit);
        
        setResult({ time: Number(timeResult.toFixed(4)) });
      }
    }
  };

  const clearAll = () => {
    setDisplacement("");
    setTime("");
    setVelocity("");
    setInitialVelocity("");
    setFinalVelocity("");
    setDisplacementUnit("m");
    setTimeUnit("s");
    setVelocityUnit("m/s");
    setCalculationType("average-velocity");
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Velocity Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Calculate velocity, displacement, or time using kinematic equations for motion.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Velocity Calculations</CardTitle>
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
                <SelectItem value="average-velocity">Average Velocity (v = d/t)</SelectItem>
                <SelectItem value="final-velocity">Final Velocity (from average)</SelectItem>
                <SelectItem value="displacement">Displacement (d = vt)</SelectItem>
                <SelectItem value="time">Time (t = d/v)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {(calculationType === "average-velocity" || calculationType === "time") && (
              <div>
                <Label htmlFor="displacement">Displacement</Label>
                <div className="flex gap-2">
                  <Input
                    id="displacement"
                    type="number"
                    placeholder="Enter displacement"
                    value={displacement}
                    onChange={(e) => setDisplacement(e.target.value)}
                    step="any"
                    className="flex-1"
                  />
                  <Select value={displacementUnit} onValueChange={setDisplacementUnit}>
                    <SelectTrigger id="displacementUnit" aria-label="Displacement unit" className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm">mm</SelectItem>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="m">m</SelectItem>
                      <SelectItem value="km">km</SelectItem>
                      <SelectItem value="in">in</SelectItem>
                      <SelectItem value="ft">ft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {(calculationType === "average-velocity" || calculationType === "displacement") && (
              <div>
                <Label htmlFor="time">Time</Label>
                <div className="flex gap-2">
                  <Input
                    id="time"
                    type="number"
                    placeholder="Enter time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    min="0"
                    step="any"
                    className="flex-1"
                  />
                  <Select value={timeUnit} onValueChange={setTimeUnit}>
                    <SelectTrigger id="timeUnit" aria-label="Time unit" className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ms">ms</SelectItem>
                      <SelectItem value="s">s</SelectItem>
                      <SelectItem value="min">min</SelectItem>
                      <SelectItem value="hr">hr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {(calculationType === "final-velocity" || calculationType === "displacement" || calculationType === "time") && (
              <div>
                <Label htmlFor="velocity">
                  {calculationType === "final-velocity" ? "Average Velocity" : "Velocity"}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="velocity"
                    type="number"
                    placeholder="Enter velocity"
                    value={velocity}
                    onChange={(e) => setVelocity(e.target.value)}
                    step="any"
                    className="flex-1"
                  />
                  <Select value={velocityUnit} onValueChange={setVelocityUnit}>
                    <SelectTrigger id="velocityUnit" aria-label="Velocity unit" className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m/s">m/s</SelectItem>
                      <SelectItem value="km/h">km/h</SelectItem>
                      <SelectItem value="mph">mph</SelectItem>
                      <SelectItem value="ft/s">ft/s</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {calculationType === "final-velocity" && (
              <div>
                <Label htmlFor="initialVelocity">Initial Velocity</Label>
                <div className="flex gap-2">
                  <Input
                    id="initialVelocity"
                    type="number"
                    placeholder="Enter initial velocity"
                    value={initialVelocity}
                    onChange={(e) => setInitialVelocity(e.target.value)}
                    step="any"
                    className="flex-1"
                  />
                  <Select value={velocityUnit} onValueChange={setVelocityUnit}>
                    <SelectTrigger id="initialVelocityUnit" aria-label="Initial velocity unit" className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m/s">m/s</SelectItem>
                      <SelectItem value="km/h">km/h</SelectItem>
                      <SelectItem value="mph">mph</SelectItem>
                      <SelectItem value="ft/s">ft/s</SelectItem>
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
              {result.velocity !== undefined && (
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {result.velocity} {velocityUnit}
                  </div>
                  <p className="text-muted-foreground">{result.velocityType || "Velocity"}</p>
                </div>
              )}
              {result.displacement !== undefined && (
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {result.displacement} {displacementUnit}
                  </div>
                  <p className="text-muted-foreground">Displacement</p>
                </div>
              )}
              {result.time !== undefined && (
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {result.time} {timeUnit}
                  </div>
                  <p className="text-muted-foreground">Time</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Velocity Formulas & Concepts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Basic Velocity Formula</h3>
            <p className="text-muted-foreground font-mono text-lg">v = d / t</p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• v = velocity (speed with direction)</li>
              <li>• d = displacement (change in position)</li>
              <li>• t = time taken</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Velocity vs Speed</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Velocity:</strong> Vector quantity with direction</li>
              <li>• <strong>Speed:</strong> Scalar quantity (magnitude only)</li>
              <li>• Velocity can be negative (indicating direction)</li>
              <li>• Average velocity = total displacement / total time</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Common Velocities</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Walking: ~1.4 m/s (5 km/h)</li>
              <li>• Running: ~5 m/s (18 km/h)</li>
              <li>• Car (city): ~14 m/s (50 km/h)</li>
              <li>• Car (highway): ~28 m/s (100 km/h)</li>
              <li>• Sound in air: ~343 m/s</li>
              <li>• Light in vacuum: ~300,000,000 m/s</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}