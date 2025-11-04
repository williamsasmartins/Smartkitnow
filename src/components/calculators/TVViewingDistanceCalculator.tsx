import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TVViewingDistanceCalculator() {
  const [tvSize, setTvSize] = useState("");
  const [resolution, setResolution] = useState("4K");
  const [results, setResults] = useState<any>(null);

  const calculateViewingDistance = () => {
    const size = parseFloat(tvSize);
    
    if (!size || size <= 0) {
      alert("Please enter a valid TV size.");
      return;
    }

    // Viewing distance recommendations based on resolution and TV size
    let minDistance, maxDistance, optimalDistance;
    
    switch (resolution) {
      case "720p":
        minDistance = size * 2.5;
        maxDistance = size * 4.0;
        optimalDistance = size * 3.2;
        break;
      case "1080p":
        minDistance = size * 1.5;
        maxDistance = size * 2.5;
        optimalDistance = size * 2.0;
        break;
      case "4K":
        minDistance = size * 1.0;
        maxDistance = size * 1.5;
        optimalDistance = size * 1.2;
        break;
      case "8K":
        minDistance = size * 0.75;
        maxDistance = size * 1.2;
        optimalDistance = size * 1.0;
        break;
      default:
        minDistance = size * 1.5;
        maxDistance = size * 2.5;
        optimalDistance = size * 2.0;
    }

    // Convert to feet for easier reading
    const minDistanceFeet = (minDistance / 12).toFixed(1);
    const maxDistanceFeet = (maxDistance / 12).toFixed(1);
    const optimalDistanceFeet = (optimalDistance / 12).toFixed(1);

    // Calculate field of view
    const fieldOfView = Math.atan((size * Math.cos(Math.atan(9/16))) / (optimalDistance * 2)) * 2 * (180 / Math.PI);

    setResults({
      minDistance: minDistance.toFixed(0),
      maxDistance: maxDistance.toFixed(0),
      optimalDistance: optimalDistance.toFixed(0),
      minDistanceFeet,
      maxDistanceFeet,
      optimalDistanceFeet,
      fieldOfView: fieldOfView.toFixed(1),
      resolution
    });
  };

  const handleReset = () => {
    setTvSize("");
    setResults(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          TV Size and Viewing Distance Calculator
        </h1>
        <p className="text-xl text-muted-foreground">
          Calculate optimal viewing distance based on TV size and resolution
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-background/80 backdrop-blur-sm border-border/60">
          <CardHeader>
            <CardTitle>TV Specifications</CardTitle>
            <CardDescription>
              Enter your TV size and resolution
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
              <Label htmlFor="resolution">TV Resolution</Label>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger id="resolution" aria-label="TV resolution">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="720p">720p HD</SelectItem>
                  <SelectItem value="1080p">1080p Full HD</SelectItem>
                  <SelectItem value="4K">4K Ultra HD</SelectItem>
                  <SelectItem value="8K">8K Ultra HD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button onClick={calculateViewingDistance} className="flex-1">
                Calculate Distance
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/80 backdrop-blur-sm border-border/60">
          <CardHeader>
            <CardTitle>Recommended Viewing Distances</CardTitle>
            <CardDescription>
              Optimal distances for your TV setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-4 border-green-500">
                  <div className="text-sm text-green-700 dark:text-green-300">Optimal Distance</div>
                  <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                    {results.optimalDistance}" ({results.optimalDistanceFeet} ft)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Minimum Distance</div>
                    <div className="text-lg font-bold">{results.minDistance}"</div>
                    <div className="text-sm">({results.minDistanceFeet} ft)</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Maximum Distance</div>
                    <div className="text-lg font-bold">{results.maxDistance}"</div>
                    <div className="text-sm">({results.maxDistanceFeet} ft)</div>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Field of View</div>
                  <div className="text-xl font-bold text-primary">{results.fieldOfView}°</div>
                  <div className="text-xs text-muted-foreground">
                    For {results.resolution} resolution
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border">
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Tip:</strong> Higher resolution TVs can be viewed from closer distances 
                    without seeing individual pixels.
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Enter TV size and select resolution to see viewing distance recommendations
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resolution Guide */}
      <Card className="bg-background/80 backdrop-blur-sm border-border/60">
        <CardHeader>
          <CardTitle>Resolution and Viewing Distance Guide</CardTitle>
          <CardDescription>
            How resolution affects optimal viewing distance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="font-semibold text-primary">720p HD</div>
              <div className="text-sm text-muted-foreground">2.5-4x TV size</div>
              <div className="text-xs">Sit farther to avoid pixelation</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="font-semibold text-primary">1080p Full HD</div>
              <div className="text-sm text-muted-foreground">1.5-2.5x TV size</div>
              <div className="text-xs">Good detail at moderate distance</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="font-semibold text-primary">4K Ultra HD</div>
              <div className="text-sm text-muted-foreground">1-1.5x TV size</div>
              <div className="text-xs">Can sit very close with sharp detail</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="font-semibold text-primary">8K Ultra HD</div>
              <div className="text-sm text-muted-foreground">0.75-1.2x TV size</div>
              <div className="text-xs">Ultra-close viewing possible</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}