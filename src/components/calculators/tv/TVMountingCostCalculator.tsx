import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function TVMountingCostCalculator() {
  const [tvSize, setTvSize] = useState("");
  const [mountType, setMountType] = useState("fixed");
  const [wallType, setWallType] = useState("drywall");
  const [cableManagement, setCableManagement] = useState(false);
  const [soundbar, setSoundbar] = useState(false);
  const [professional, setProfessional] = useState(true);
  const [results, setResults] = useState<any>(null);

  const calculateCost = () => {
    const size = parseFloat(tvSize);
    
    if (!size || size <= 0) {
      alert("Please enter a valid TV size.");
      return;
    }

    let mountCost = 0;
    let laborCost = 0;
    let additionalCosts = 0;

    // Mount cost based on type and TV size
    switch (mountType) {
      case "fixed":
        mountCost = size < 32 ? 25 : size < 55 ? 40 : size < 75 ? 60 : 80;
        break;
      case "tilt":
        mountCost = size < 32 ? 40 : size < 55 ? 60 : size < 75 ? 80 : 120;
        break;
      case "full-motion":
        mountCost = size < 32 ? 80 : size < 55 ? 120 : size < 75 ? 180 : 250;
        break;
    }

    // Labor cost based on professional installation
    if (professional) {
      laborCost = 100; // Base labor cost
      
      // Additional labor for wall type
      if (wallType === "brick" || wallType === "concrete") {
        laborCost += 50;
      } else if (wallType === "plaster") {
        laborCost += 25;
      }
      
      // Cable management
      if (cableManagement) {
        laborCost += 75;
      }
      
      // Soundbar mounting
      if (soundbar) {
        laborCost += 50;
        additionalCosts += 30; // Soundbar mount
      }
    }

    // Additional materials
    if (wallType === "brick" || wallType === "concrete") {
      additionalCosts += 20; // Special anchors/bits
    }

    if (cableManagement) {
      additionalCosts += 25; // Cable kit
    }

    const totalCost = mountCost + laborCost + additionalCosts;

    setResults({
      mountCost,
      laborCost,
      additionalCosts,
      totalCost,
      professional,
      breakdown: {
        mount: mountCost,
        baseLabor: professional ? 100 : 0,
        wallSurcharge: wallType === "brick" || wallType === "concrete" ? 50 : wallType === "plaster" ? 25 : 0,
        cableLabor: cableManagement && professional ? 75 : 0,
        soundbarLabor: soundbar && professional ? 50 : 0,
        materials: additionalCosts
      }
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
          TV Mounting and Installation Cost Guide
        </h1>
        <p className="text-xl text-muted-foreground">
          Calculate TV mounting and installation costs
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-background/80 backdrop-blur-sm border-border/60">
          <CardHeader>
            <CardTitle>Installation Details</CardTitle>
            <CardDescription>
              Enter your installation requirements
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
              <Label htmlFor="mountType">Mount Type</Label>
              <Select value={mountType} onValueChange={setMountType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed (No Movement)</SelectItem>
                  <SelectItem value="tilt">Tilt Mount</SelectItem>
                  <SelectItem value="full-motion">Full Motion/Articulating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallType">Wall Type</Label>
              <Select value={wallType} onValueChange={setWallType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drywall">Drywall/Sheetrock</SelectItem>
                  <SelectItem value="plaster">Plaster</SelectItem>
                  <SelectItem value="brick">Brick</SelectItem>
                  <SelectItem value="concrete">Concrete</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="professional" 
                  checked={professional}
                  onCheckedChange={(checked) => setProfessional(checked === true)}
                />
                <Label htmlFor="professional">Professional Installation</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cableManagement" 
                  checked={cableManagement}
                  onCheckedChange={(checked) => setCableManagement(checked === true)}
                />
                <Label htmlFor="cableManagement">Cable Management/Hide Cables</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="soundbar" 
                  checked={soundbar}
                  onCheckedChange={(checked) => setSoundbar(checked === true)}
                />
                <Label htmlFor="soundbar">Mount Soundbar</Label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={calculateCost} className="flex-1">
                Calculate Cost
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/80 backdrop-blur-sm border-border/60">
          <CardHeader>
            <CardTitle>Cost Estimate</CardTitle>
            <CardDescription>
              Breakdown of installation costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-4 border-green-500">
                  <div className="text-sm text-green-700 dark:text-green-300">Total Estimated Cost</div>
                  <div className="text-3xl font-bold text-green-800 dark:text-green-200">
                    ${results.totalCost}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <span>Mount Hardware</span>
                    <span className="font-semibold">${results.breakdown.mount}</span>
                  </div>
                  
                  {results.professional && (
                    <>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                        <span>Base Labor</span>
                        <span className="font-semibold">${results.breakdown.baseLabor}</span>
                      </div>
                      
                      {results.breakdown.wallSurcharge > 0 && (
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                          <span>Wall Type Surcharge</span>
                          <span className="font-semibold">${results.breakdown.wallSurcharge}</span>
                        </div>
                      )}
                      
                      {results.breakdown.cableLabor > 0 && (
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                          <span>Cable Management Labor</span>
                          <span className="font-semibold">${results.breakdown.cableLabor}</span>
                        </div>
                      )}
                      
                      {results.breakdown.soundbarLabor > 0 && (
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                          <span>Soundbar Installation</span>
                          <span className="font-semibold">${results.breakdown.soundbarLabor}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {results.breakdown.materials > 0 && (
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <span>Additional Materials</span>
                      <span className="font-semibold">${results.breakdown.materials}</span>
                    </div>
                  )}
                </div>

                {!results.professional && (
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border">
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>DIY Installation:</strong> Cost includes only hardware. 
                      Consider tool requirements and safety precautions.
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Enter installation details to see cost estimate
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cost Factors */}
      <Card className="bg-background/80 backdrop-blur-sm border-border/60">
        <CardHeader>
          <CardTitle>Cost Factors</CardTitle>
          <CardDescription>
            What affects TV mounting costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="font-semibold text-primary">TV Size</div>
              <div className="text-sm text-muted-foreground">Larger TVs require stronger, more expensive mounts</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="font-semibold text-primary">Mount Type</div>
              <div className="text-sm text-muted-foreground">Full-motion mounts cost more than fixed mounts</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="font-semibold text-primary">Wall Material</div>
              <div className="text-sm text-muted-foreground">Brick/concrete require special tools and anchors</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="font-semibold text-primary">Cable Management</div>
              <div className="text-sm text-muted-foreground">Hiding cables adds labor and materials</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="font-semibold text-primary">Location</div>
              <div className="text-sm text-muted-foreground">High/difficult locations may cost more</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="font-semibold text-primary">Additional Services</div>
              <div className="text-sm text-muted-foreground">Soundbar mounting, device setup, etc.</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
