import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ScreenSizeCalculator() {
  const [diagonal, setDiagonal] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [results, setResults] = useState<any>(null);

  const calculateScreenSize = () => {
    const diag = parseFloat(diagonal);
    
    if (!diag || diag <= 0) {
      alert("Please enter a valid positive number for diagonal size.");
      return;
    }

    const [ratioW, ratioH] = aspectRatio.split(':').map(Number);
    
    // Calculate width and height using pythagorean theorem
    const width = diag / Math.sqrt(1 + (ratioH/ratioW) * (ratioH/ratioW));
    const height = width * (ratioH/ratioW);
    
    // Calculate area and perimeter
    const area = width * height;
    const perimeter = 2 * (width + height);
    
    setResults({
      width: width.toFixed(2),
      height: height.toFixed(2),
      area: area.toFixed(2),
      perimeter: perimeter.toFixed(2),
      aspectRatio: aspectRatio
    });
  };

  const handleReset = () => {
    setDiagonal("");
    setResults(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Screen Size Calculator
        </h1>
        <p className="text-xl text-muted-foreground">
          Calculate screen dimensions from diagonal measurements
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-background/80 backdrop-blur-sm border-border/60">
          <CardHeader>
            <CardTitle>Screen Parameters</CardTitle>
            <CardDescription>
              Enter diagonal size and aspect ratio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="diagonal">Diagonal Size (inches)</Label>
              <Input
                id="diagonal"
                type="number"
                placeholder="Enter diagonal size"
                value={diagonal}
                onChange={(e) => setDiagonal(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aspectRatio">Aspect Ratio</Label>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                  <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                  <SelectItem value="21:9">21:9 (Ultrawide)</SelectItem>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  <SelectItem value="3:2">3:2 (Classic)</SelectItem>
                  <SelectItem value="5:4">5:4 (Monitor)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button onClick={calculateScreenSize} className="flex-1">
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
              Calculated screen dimensions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Width</div>
                    <div className="text-2xl font-bold text-primary">{results.width}"</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Height</div>
                    <div className="text-2xl font-bold text-primary">{results.height}"</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Area</div>
                    <div className="text-lg font-semibold">{results.area} sq in</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Perimeter</div>
                    <div className="text-lg font-semibold">{results.perimeter} in</div>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Aspect Ratio</div>
                  <div className="text-xl font-bold text-primary">{results.aspectRatio}</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Enter diagonal size and click Calculate to see results
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
