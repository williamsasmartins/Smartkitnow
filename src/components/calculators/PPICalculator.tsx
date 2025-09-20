import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PPICalculator() {
  const [screenSize, setScreenSize] = useState("");
  const [resolutionWidth, setResolutionWidth] = useState("");
  const [resolutionHeight, setResolutionHeight] = useState("");
  const [unit, setUnit] = useState("inches");
  const [results, setResults] = useState<any>(null);

  const commonResolutions = [
    { label: "HD (1280x720)", width: 1280, height: 720 },
    { label: "Full HD (1920x1080)", width: 1920, height: 1080 },
    { label: "QHD (2560x1440)", width: 2560, height: 1440 },
    { label: "4K UHD (3840x2160)", width: 3840, height: 2160 },
    { label: "5K (5120x2880)", width: 5120, height: 2880 },
    { label: "8K UHD (7680x4320)", width: 7680, height: 4320 }
  ];

  const calculatePPI = () => {
    const size = parseFloat(screenSize);
    const width = parseFloat(resolutionWidth);
    const height = parseFloat(resolutionHeight);

    if (!size || !width || !height || size <= 0 || width <= 0 || height <= 0) {
      alert("Please enter valid positive numbers for all fields.");
      return;
    }

    // Convert size to inches if needed
    const sizeInInches = unit === "cm" ? size / 2.54 : size;

    // Calculate diagonal resolution in pixels
    const diagonalPixels = Math.sqrt(width * width + height * height);
    
    // Calculate PPI
    const ppi = diagonalPixels / sizeInInches;

    // Calculate pixel size
    const pixelSize = 25.4 / ppi; // in millimeters

    // Calculate screen dimensions
    const aspectRatio = width / height;
    const screenWidth = sizeInInches * Math.cos(Math.atan(1 / aspectRatio));
    const screenHeight = sizeInInches * Math.sin(Math.atan(1 / aspectRatio));

    // Actually, let's use proper trigonometry
    const diagonal = sizeInInches;
    const screenWidthInches = diagonal / Math.sqrt(1 + (height/width) * (height/width));
    const screenHeightInches = screenWidthInches * (height/width);

    // Viewing distance recommendations
    const optimalDistance = sizeInInches * 1.6; // inches
    const minDistance = sizeInInches * 1.2;
    const maxDistance = sizeInInches * 2.5;

    setResults({
      ppi: ppi.toFixed(1),
      pixelSize: pixelSize.toFixed(4),
      screenWidth: screenWidthInches.toFixed(1),
      screenHeight: screenHeightInches.toFixed(1),
      screenWidthCm: (screenWidthInches * 2.54).toFixed(1),
      screenHeightCm: (screenHeightInches * 2.54).toFixed(1),
      totalPixels: (width * height).toLocaleString(),
      aspectRatio: `${Math.round(width/gcd(width, height))}:${Math.round(height/gcd(width, height))}`,
      optimalDistance: optimalDistance.toFixed(1),
      minDistance: minDistance.toFixed(1),
      maxDistance: maxDistance.toFixed(1),
      quality: getDisplayQuality(ppi)
    });
  };

  const getDisplayQuality = (ppi: number) => {
    if (ppi >= 400) return "Retina+ (Excellent)";
    if (ppi >= 300) return "Retina (Very Good)";
    if (ppi >= 200) return "High Quality";
    if (ppi >= 150) return "Good Quality";
    if (ppi >= 100) return "Standard Quality";
    return "Low Quality";
  };

  // Greatest Common Divisor function
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const handlePresetResolution = (preset: any) => {
    setResolutionWidth(preset.width.toString());
    setResolutionHeight(preset.height.toString());
  };

  const handleReset = () => {
    setScreenSize("");
    setResolutionWidth("");
    setResolutionHeight("");
    setResults(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          PPI Calculator / DPI Calculator
        </h1>
        <p className="text-xl text-muted-foreground">
          Calculate pixels per inch (PPI) and dots per inch (DPI) for displays
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-background/80 backdrop-blur-sm border-border/60">
          <CardHeader>
            <CardTitle>Display Information</CardTitle>
            <CardDescription>
              Enter your display specifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="screenSize">Screen Size (diagonal)</Label>
              <div className="flex gap-2">
                <Input
                  id="screenSize"
                  type="number"
                  placeholder="Enter screen size"
                  value={screenSize}
                  onChange={(e) => setScreenSize(e.target.value)}
                  className="flex-1"
                />
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inches">in</SelectItem>
                    <SelectItem value="cm">cm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Resolution</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Width (px)"
                  value={resolutionWidth}
                  onChange={(e) => setResolutionWidth(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Height (px)"
                  value={resolutionHeight}
                  onChange={(e) => setResolutionHeight(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Common Resolutions</Label>
              <div className="grid grid-cols-1 gap-2">
                {commonResolutions.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetResolution(preset)}
                    className="justify-start"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={calculatePPI} className="flex-1">
                Calculate PPI
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
              Display specifications and quality assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">PPI/DPI</div>
                    <div className="text-2xl font-bold text-primary">{results.ppi}</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Pixel Size</div>
                    <div className="text-lg font-bold text-primary">{results.pixelSize} mm</div>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Display Quality</div>
                  <div className="text-xl font-bold text-primary">{results.quality}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-semibold">Screen Dimensions</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Width: {results.screenWidth}" ({results.screenWidthCm} cm)</div>
                    <div>Height: {results.screenHeight}" ({results.screenHeightCm} cm)</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-semibold">Display Info</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Total Pixels: {results.totalPixels}</div>
                    <div>Aspect Ratio: {results.aspectRatio}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-semibold">Recommended Viewing Distance</div>
                  <div className="text-sm">
                    <div>Optimal: {results.optimalDistance} inches</div>
                    <div>Range: {results.minDistance}" - {results.maxDistance}"</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Enter display specifications and click Calculate to see results
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* PPI Quality Guide */}
      <Card className="bg-background/80 backdrop-blur-sm border-border/60">
        <CardHeader>
          <CardTitle>PPI Quality Guide</CardTitle>
          <CardDescription>
            Understanding display quality based on pixel density
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="font-semibold text-green-600">400+ PPI</div>
              <div className="text-sm">Retina+ Quality</div>
              <div className="text-xs text-muted-foreground">Extremely sharp, perfect for close viewing</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="font-semibold text-green-500">300-399 PPI</div>
              <div className="text-sm">Retina Quality</div>
              <div className="text-xs text-muted-foreground">Very sharp, excellent for most uses</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="font-semibold text-blue-500">200-299 PPI</div>
              <div className="text-sm">High Quality</div>
              <div className="text-xs text-muted-foreground">Sharp, good for office work</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="font-semibold text-yellow-500">150-199 PPI</div>
              <div className="text-sm">Good Quality</div>
              <div className="text-xs text-muted-foreground">Acceptable for general use</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="font-semibold text-orange-500">100-149 PPI</div>
              <div className="text-sm">Standard Quality</div>
              <div className="text-xs text-muted-foreground">Basic quality, larger displays</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="font-semibold text-red-500">&lt;100 PPI</div>
              <div className="text-sm">Low Quality</div>
              <div className="text-xs text-muted-foreground">Pixelated, not recommended</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}