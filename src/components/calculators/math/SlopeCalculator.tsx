import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function SlopeCalculator() {
  const [x1, setX1] = useState("");
  const [y1, setY1] = useState("");
  const [x2, setX2] = useState("");
  const [y2, setY2] = useState("");
  const [result, setResult] = useState<{
    slope: number | string;
    angle: number;
    equation: string;
    distance: number;
  } | null>(null);

  const calculateSlope = () => {
    const point1X = parseFloat(x1);
    const point1Y = parseFloat(y1);
    const point2X = parseFloat(x2);
    const point2Y = parseFloat(y2);

    if (isNaN(point1X) || isNaN(point1Y) || isNaN(point2X) || isNaN(point2Y)) {
      return;
    }

    const deltaX = point2X - point1X;
    const deltaY = point2Y - point1Y;

    let slope: number | string;
    let angle: number;
    let equation: string;

    if (deltaX === 0) {
      slope = "undefined (vertical line)";
      angle = 90;
      equation = `x = ${point1X}`;
    } else {
      const slopeValue = deltaY / deltaX;
      slope = slopeValue;
      angle = Math.atan(slopeValue) * (180 / Math.PI);
      
      // Point-slope form: y - y1 = m(x - x1)
      // Simplified to: y = mx + b
      const b = point1Y - slopeValue * point1X;
      equation = `y = ${slopeValue.toFixed(4)}x ${b >= 0 ? '+' : ''} ${b.toFixed(4)}`;
    }

    // Calculate distance between points
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    setResult({
      slope,
      angle,
      equation,
      distance
    });
  };

  const clearAll = () => {
    setX1("");
    setY1("");
    setX2("");
    setY2("");
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Slope Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Calculate the slope, angle, and equation of a line between two points, plus the distance between them.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Two Points</CardTitle>
          <CardDescription>
            Enter the coordinates of two points to calculate the slope and line equation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold">Point 1 (x₁, y₁)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="x1">x₁</Label>
                  <Input
                    id="x1"
                    type="number"
                    placeholder="x coordinate"
                    value={x1}
                    onChange={(e) => setX1(e.target.value)}
                    step="any"
                  />
                </div>
                <div>
                  <Label htmlFor="y1">y₁</Label>
                  <Input
                    id="y1"
                    type="number"
                    placeholder="y coordinate"
                    value={y1}
                    onChange={(e) => setY1(e.target.value)}
                    step="any"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Point 2 (x₂, y₂)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="x2">x₂</Label>
                  <Input
                    id="x2"
                    type="number"
                    placeholder="x coordinate"
                    value={x2}
                    onChange={(e) => setX2(e.target.value)}
                    step="any"
                  />
                </div>
                <div>
                  <Label htmlFor="y2">y₂</Label>
                  <Input
                    id="y2"
                    type="number"
                    placeholder="y coordinate"
                    value={y2}
                    onChange={(e) => setY2(e.target.value)}
                    step="any"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={calculateSlope}>
              Calculate Slope
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
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold">Slope (m)</h4>
                <p className="text-lg font-mono">
                  {typeof result.slope === 'number' ? result.slope.toFixed(4) : result.slope}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Angle</h4>
                <p className="text-lg font-mono">{result.angle.toFixed(2)}°</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Line Equation</h4>
                <p className="text-lg font-mono">{result.equation}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Distance</h4>
                <p className="text-lg font-mono">{result.distance.toFixed(4)} units</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Slope Formula & Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Slope Formula</h3>
            <p className="text-muted-foreground font-mono">m = (y₂ - y₁) / (x₂ - x₁)</p>
            <p className="text-sm text-muted-foreground mt-1">
              The slope represents the rate of change or "rise over run"
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Distance Formula</h3>
            <p className="text-muted-foreground font-mono">d = √[(x₂ - x₁)² + (y₂ - y₁)²]</p>
            <p className="text-sm text-muted-foreground mt-1">
              Calculates the straight-line distance between two points
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Slope Interpretation</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Positive slope: line rises from left to right</li>
              <li>• Negative slope: line falls from left to right</li>
              <li>• Zero slope: horizontal line</li>
              <li>• Undefined slope: vertical line</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}