import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AspectRatioCalculator() {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [mode, setMode] = useState("calculate");
  const [targetRatio, setTargetRatio] = useState("16:9");
  const [results, setResults] = useState<any>(null);

  const commonRatios = [
    { label: "16:9 (Widescreen)", value: "16:9", decimal: 16/9 },
    { label: "4:3 (Standard)", value: "4:3", decimal: 4/3 },
    { label: "21:9 (Ultrawide)", value: "21:9", decimal: 21/9 },
    { label: "1:1 (Square)", value: "1:1", decimal: 1 },
    { label: "3:2 (Classic)", value: "3:2", decimal: 3/2 },
    { label: "5:4 (Monitor)", value: "5:4", decimal: 5/4 }
  ];

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const calculateAspectRatio = () => {
    const w = parseFloat(width);
    const h = parseFloat(height);

    if (!w || !h || w <= 0 || h <= 0) {
      alert("Please enter valid positive numbers for width and height.");
      return;
    }

    const decimal = w / h;
    const divisor = gcd(Math.round(w * 100), Math.round(h * 100));
    const simplifiedWidth = Math.round(w * 100) / divisor;
    const simplifiedHeight = Math.round(h * 100) / divisor;

    // Find closest common ratio
    let closestRatio = commonRatios[0];
    let smallestDiff = Math.abs(decimal - closestRatio.decimal);

    commonRatios.forEach(ratio => {
      const diff = Math.abs(decimal - ratio.decimal);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestRatio = ratio;
      }
    });

    setResults({
      decimal: decimal.toFixed(4),
      simplified: `${simplifiedWidth}:${simplifiedHeight}`,
      closest: closestRatio,
      percentage: `${((w / (w + h)) * 100).toFixed(1)}% : ${((h / (w + h)) * 100).toFixed(1)}%`
    });
  };

  const calculateDimensions = () => {
    const knownDimension = parseFloat(width || height);
    const [ratioW, ratioH] = targetRatio.split(':').map(Number);

    if (!knownDimension || knownDimension <= 0) {
      alert("Please enter a valid positive number for the known dimension.");
      return;
    }

    let calculatedWidth, calculatedHeight;

    if (width) {
      // Width is known, calculate height
      calculatedHeight = (knownDimension * ratioH) / ratioW;
      calculatedWidth = knownDimension;
    } else {
      // Height is known, calculate width
      calculatedWidth = (knownDimension * ratioW) / ratioH;
      calculatedHeight = knownDimension;
    }

    setResults({
      width: calculatedWidth.toFixed(2),
      height: calculatedHeight.toFixed(2),
      area: (calculatedWidth * calculatedHeight).toFixed(2),
      perimeter: (2 * (calculatedWidth + calculatedHeight)).toFixed(2)
    });
  };

  const handleCalculate = () => {
    if (mode === "calculate") {
      calculateAspectRatio();
    } else {
      calculateDimensions();
    }
  };

  const handleReset = () => {
    setWidth("");
    setHeight("");
    setResults(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Aspect Ratio Calculator
        </h1>
        <p className="text-xl text-muted-foreground">
          Calculate aspect ratios or find dimensions for specific ratios
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-background/80 backdrop-blur-sm border-border/60">
          <CardHeader>
            <CardTitle>Calculator Mode</CardTitle>
            <CardDescription>
              Choose whether to calculate ratio or find dimensions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mode">Calculation Mode</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger id="mode" aria-label="Calculation mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calculate">Calculate Aspect Ratio</SelectItem>
                  <SelectItem value="dimensions">Find Dimensions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {mode === "calculate" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    type="number"
                    placeholder="Enter width"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Enter height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="targetRatio">Target Aspect Ratio</Label>
                  <Select value={targetRatio} onValueChange={setTargetRatio}>
                    <SelectTrigger id="targetRatio" aria-label="Target aspect ratio">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {commonRatios.map(ratio => (
                        <SelectItem key={ratio.value} value={ratio.value}>
                          {ratio.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Width (leave empty if unknown)</Label>
                  <Input
                    id="width"
                    type="number"
                    placeholder="Enter width"
                    value={width}
                    onChange={(e) => {
                      setWidth(e.target.value);
                      if (e.target.value) setHeight("");
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (leave empty if unknown)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Enter height"
                    value={height}
                    onChange={(e) => {
                      setHeight(e.target.value);
                      if (e.target.value) setWidth("");
                    }}
                  />
                </div>
              </>
            )}

            <div className="flex gap-4">
              <Button onClick={handleCalculate} className="flex-1">
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
              Calculated aspect ratio and related information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                {mode === "calculate" ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Decimal Ratio</div>
                        <div className="text-2xl font-bold text-primary">{results.decimal}</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Simplified Ratio</div>
                        <div className="text-2xl font-bold text-primary">{results.simplified}</div>
                      </div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground">Closest Common Ratio</div>
                      <div className="text-xl font-bold text-primary">{results.closest.label}</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground">Percentage Split</div>
                      <div className="text-lg font-semibold">{results.percentage}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Width</div>
                        <div className="text-2xl font-bold text-primary">{results.width}</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Height</div>
                        <div className="text-2xl font-bold text-primary">{results.height}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Area</div>
                        <div className="text-lg font-semibold">{results.area}</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Perimeter</div>
                        <div className="text-lg font-semibold">{results.perimeter}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Enter values and click Calculate to see results
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Common Aspect Ratios Reference */}
      <Card className="bg-background/80 backdrop-blur-sm border-border/60">
        <CardHeader>
          <CardTitle>Common Aspect Ratios</CardTitle>
          <CardDescription>
            Reference guide for standard aspect ratios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {commonRatios.map(ratio => (
              <div key={ratio.value} className="p-4 bg-muted/30 rounded-lg">
                <div className="font-semibold">{ratio.label}</div>
                <div className="text-sm text-muted-foreground">
                  Decimal: {ratio.decimal.toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}