import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ProjectorCalculator() {
  const [throwRatio, setThrowRatio] = useState("");
  const [screenWidth, setScreenWidth] = useState("");
  const [distance, setDistance] = useState("");
  const [mode, setMode] = useState("distance");
  const [results, setResults] = useState<any>(null);

  const calculateProjector = () => {
    if (mode === "distance") {
      // Calculate distance from screen width and throw ratio
      const width = parseFloat(screenWidth);
      const ratio = parseFloat(throwRatio);
      
      if (!width || !ratio || width <= 0 || ratio <= 0) {
        alert("Please enter valid positive numbers.");
        return;
      }
      
      const calculatedDistance = width * ratio;
      setResults({
        distance: calculatedDistance.toFixed(2),
        screenWidth: width.toFixed(2),
        throwRatio: ratio.toFixed(2)
      });
    } else {
      // Calculate screen width from distance and throw ratio
      const dist = parseFloat(distance);
      const ratio = parseFloat(throwRatio);
      
      if (!dist || !ratio || dist <= 0 || ratio <= 0) {
        alert("Please enter valid positive numbers.");
        return;
      }
      
      const calculatedWidth = dist / ratio;
      setResults({
        screenWidth: calculatedWidth.toFixed(2),
        distance: dist.toFixed(2),
        throwRatio: ratio.toFixed(2)
      });
    }
  };

  const handleReset = () => {
    setThrowRatio("");
    setScreenWidth("");
    setDistance("");
    setResults(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Projector Calculator
        </h1>
        <p className="text-xl text-muted-foreground">
          Calculate projector distance, screen size, and throw ratio
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-background/80 backdrop-blur-sm border-border/60">
          <CardHeader>
            <CardTitle>Projector Setup</CardTitle>
            <CardDescription>
              Calculate projection parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Calculation Mode</Label>
              <div className="flex gap-2">
                <Button
                  variant={mode === "distance" ? "default" : "outline"}
                  onClick={() => setMode("distance")}
                  className="flex-1"
                >
                  Calculate Distance
                </Button>
                <Button
                  variant={mode === "width" ? "default" : "outline"}
                  onClick={() => setMode("width")}
                  className="flex-1"
                >
                  Calculate Screen Width
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="throwRatio">Throw Ratio</Label>
              <Input
                id="throwRatio"
                type="number"
                placeholder="Enter throw ratio (e.g., 1.5)"
                value={throwRatio}
                onChange={(e) => setThrowRatio(e.target.value)}
              />
            </div>

            {mode === "distance" ? (
              <div className="space-y-2">
                <Label htmlFor="screenWidth">Screen Width (inches or cm)</Label>
                <Input
                  id="screenWidth"
                  type="number"
                  placeholder="Enter screen width"
                  value={screenWidth}
                  onChange={(e) => setScreenWidth(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="distance">Distance (inches or cm)</Label>
                <Input
                  id="distance"
                  type="number"
                  placeholder="Enter distance"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                />
              </div>
            )}

            <div className="flex gap-4">
              <Button onClick={calculateProjector} className="flex-1">
                Calculate
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/80 backdrop-blur-sm border-border/60">
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              Calculated projector parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Distance</div>
                    <div className="text-2xl font-bold text-primary">{results.distance}</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Screen Width</div>
                    <div className="text-2xl font-bold text-primary">{results.screenWidth}</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Throw Ratio</div>
                    <div className="text-2xl font-bold text-primary">{results.throwRatio}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Enter values and click Calculate to see results
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}