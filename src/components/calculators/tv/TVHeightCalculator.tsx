import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function TVHeightCalculator() {
  const [tvSize, setTvSize] = useState("");
  const [viewingHeight, setViewingHeight] = useState("");
  const [results, setResults] = useState<any>(null);

  const calculateTVHeight = () => {
    const size = parseFloat(tvSize);
    const eyeHeight = parseFloat(viewingHeight);
    
    if (!size || !eyeHeight || size <= 0 || eyeHeight <= 0) {
      alert("Please enter valid positive numbers for both fields.");
      return;
    }

    // Calculate TV dimensions (assuming 16:9 aspect ratio)
    const tvWidth = size / Math.sqrt(1 + (9/16) * (9/16));
    const tvHeight = tvWidth * (9/16);
    
    // Calculate optimal mounting height
    // TV center should be at eye level when seated (typically 42" from floor)
    // For wall mounting, we want the center of the TV at eye level
    const tvCenterHeight = eyeHeight;
    const bottomOfTV = tvCenterHeight - (tvHeight / 2);
    const topOfTV = tvCenterHeight + (tvHeight / 2);
    
    // Alternative calculations for different viewing preferences
    const lowerMount = eyeHeight - (tvHeight / 3); // Bottom third at eye level
    const higherMount = eyeHeight - (tvHeight * 0.75); // Top quarter at eye level
    
    setResults({
      tvWidth: tvWidth.toFixed(1),
      tvHeight: tvHeight.toFixed(1),
      bottomOfTV: bottomOfTV.toFixed(1),
      topOfTV: topOfTV.toFixed(1),
      centerHeight: tvCenterHeight.toFixed(1),
      lowerMount: lowerMount.toFixed(1),
      higherMount: higherMount.toFixed(1)
    });
  };

  const handleReset = () => {
    setTvSize("");
    setViewingHeight("");
    setResults(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          TV Height Calculator
        </h1>
        <p className="text-xl text-muted-foreground">
          Calculate optimal TV mounting height for comfortable viewing
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-background/80 backdrop-blur-sm border-border/60">
          <CardHeader>
            <CardTitle>TV and Viewing Information</CardTitle>
            <CardDescription>
              Enter your TV size and viewing position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tvSize">TV Size (diagonal in inches)</Label>
              <Input
                id="tvSize"
                type="number"
                placeholder="Enter TV size (e.g., 55)"
                value={tvSize}
                onChange={(e) => setTvSize(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="viewingHeight">Eye Level When Seated (inches from floor)</Label>
              <Input
                id="viewingHeight"
                type="number"
                placeholder="Enter eye level height (typically 42)"
                value={viewingHeight}
                onChange={(e) => setViewingHeight(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Typical seated eye level is 42" from floor
              </p>
            </div>

            <div className="flex gap-4">
              <Button onClick={calculateTVHeight} className="flex-1">
                Calculate Height
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/80 backdrop-blur-sm border-border/60">
          <CardHeader>
            <CardTitle>Mounting Recommendations</CardTitle>
            <CardDescription>
              Optimal TV mounting heights for different preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <div className="text-sm text-muted-foreground">Recommended: Center at Eye Level</div>
                  <div className="text-lg font-bold">Bottom: {results.bottomOfTV}" from floor</div>
                  <div className="text-sm">Center: {results.centerHeight}" | Top: {results.topOfTV}"</div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Alternative: Lower Mount</div>
                  <div className="text-lg font-semibold">Bottom: {results.lowerMount}" from floor</div>
                  <div className="text-xs text-muted-foreground">For closer viewing or lower seating</div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Alternative: Higher Mount</div>
                  <div className="text-lg font-semibold">Bottom: {results.higherMount}" from floor</div>
                  <div className="text-xs text-muted-foreground">For wall-mounted above furniture</div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border">
                  <div className="text-sm font-semibold text-blue-800 dark:text-blue-200">TV Dimensions</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Width: {results.tvWidth}" × Height: {results.tvHeight}"
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Enter TV size and eye level height to see mounting recommendations
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Guidelines */}
      <Card className="bg-background/80 backdrop-blur-sm border-border/60">
        <CardHeader>
          <CardTitle>Mounting Guidelines</CardTitle>
          <CardDescription>
            Best practices for TV placement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">Optimal Viewing</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• TV center at seated eye level</li>
                <li>• No neck strain looking up or down</li>
                <li>• 42" typical seated eye height</li>
                <li>• Consider couch height and cushion sag</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Mounting Tips</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Use a tilting mount for higher placement</li>
                <li>• Ensure mount can support TV weight</li>
                <li>• Check for studs in wall</li>
                <li>• Plan cable management</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
