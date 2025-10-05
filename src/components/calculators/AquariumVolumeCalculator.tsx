import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Info, Share2, Copy, Mail } from "lucide-react";

export function AquariumVolumeCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [shape, setShape] = useState("");
  const [units, setUnits] = useState("inches");
  const [result, setResult] = useState<{
    gallons: number;
    liters: number;
    cubicInches: number;
    waterWeight: number;
  } | null>(null);
  const [feedback, setFeedback] = useState({ name: "", email: "", suggestions: "" });
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const calculateVolume = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    
    if (isNaN(l) || isNaN(w) || isNaN(h) || l <= 0 || w <= 0 || h <= 0 || !shape) {
      return;
    }

    let cubicInches = 0;

    // Convert to inches if needed
    const lengthInches = units === "cm" ? l / 2.54 : l;
    const widthInches = units === "cm" ? w / 2.54 : w;
    const heightInches = units === "cm" ? h / 2.54 : h;

    if (shape === "rectangular") {
      cubicInches = lengthInches * widthInches * heightInches;
    } else if (shape === "cylindrical") {
      // For cylinder: length = diameter, width not used, height = height
      const radius = lengthInches / 2;
      cubicInches = Math.PI * radius * radius * heightInches;
    } else if (shape === "bow-front") {
      // Bow front approximation (about 1.2x rectangular volume)
      cubicInches = lengthInches * widthInches * heightInches * 1.2;
    }

    // Account for substrate, decorations, etc. (typically 90% of gross volume)
    const actualCubicInches = cubicInches * 0.9;

    // Convert to gallons (231 cubic inches = 1 gallon)
    const gallons = actualCubicInches / 231;
    
    // Convert to liters (1 gallon = 3.78541 liters)
    const liters = gallons * 3.78541;
    
    // Water weight (1 gallon = 8.34 lbs)
    const waterWeight = gallons * 8.34;

    setResult({
      gallons: Number(gallons.toFixed(1)),
      liters: Number(liters.toFixed(1)),
      cubicInches: Number(actualCubicInches.toFixed(0)),
      waterWeight: Number(waterWeight.toFixed(1))
    });
  };

  const clearAll = () => {
    setLength("");
    setWidth("");
    setHeight("");
    setShape("");
    setUnits("inches");
    setResult(null);
  };

  const handleNativeShare = async () => {
    try {
      if (navigator.share && currentUrl) {
        await navigator.share({
          title: "Aquarium Volume Calculator",
          text: "Check out this Aquarium Volume Calculator!",
          url: currentUrl,
        });
      } else if (currentUrl) {
        await navigator.clipboard.writeText(currentUrl);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  const handleCopyLink = async () => {
    try {
      if (currentUrl) {
        await navigator.clipboard.writeText(currentUrl);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Copy error:", err);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", feedback.name || "Anônimo");
    formData.append("email", feedback.email || "No email");
    formData.append("suggestions", feedback.suggestions);

    try {
      const response = await fetch("https://formspree.io/f/xanpypnb", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        alert("Thank you for your feedback! It has been sent successfully.");
        setFeedback({ name: "", email: "", suggestions: "" });
      } else {
        throw new Error("Failed to send");
      }
    } catch (error) {
      alert("Failed to send feedback. Please try again later.");
      console.error("Formspree error:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Aquarium Volume Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Calculate your aquarium's water volume, capacity, and weight based on dimensions and shape.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculate Tank Volume</CardTitle>
          <CardDescription>
            Enter your aquarium dimensions to calculate water capacity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="shape">Tank Shape</Label>
              <Select value={shape} onValueChange={setShape}>
                <SelectTrigger id="shape" aria-label="Tank shape">
                  <SelectValue placeholder="Select tank shape" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rectangular">Rectangular</SelectItem>
                  <SelectItem value="cylindrical">Cylindrical</SelectItem>
                  <SelectItem value="bow-front">Bow Front</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="units">Units</Label>
              <Select value={units} onValueChange={setUnits}>
                <SelectTrigger id="units" aria-label="Units">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inches">Inches</SelectItem>
                  <SelectItem value="cm">Centimeters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="length">
                {shape === "cylindrical" ? "Diameter" : "Length"} ({units})
              </Label>
              <Input
                id="length"
                type="number"
                placeholder={shape === "cylindrical" ? "Enter diameter" : "Enter length"}
                value={length}
                onChange={(e) => setLength(e.target.value)}
                min="0"
                step="0.1"
              />
            </div>
            {shape !== "cylindrical" && (
              <div>
                <Label htmlFor="width">Width ({units})</Label>
                <Input
                  id="width"
                  type="number"
                  placeholder="Enter width"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>
            )}
            <div>
              <Label htmlFor="height">Height ({units})</Label>
              <Input
                id="height"
                type="number"
                placeholder="Enter height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={calculateVolume} variant="calculate">
              Calculate Volume
            </Button>
            <Button onClick={clearAll} variant="reset">
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tank Volume Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {result.gallons}
                </div>
                <p className="text-muted-foreground">US Gallons</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {result.liters}
                </div>
                <p className="text-muted-foreground">Liters</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {result.cubicInches}
                </div>
                <p className="text-muted-foreground">Cubic Inches</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {result.waterWeight}
                </div>
                <p className="text-muted-foreground">lbs (water only)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Volume Calculation Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Calculation Notes</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Results show actual water volume (90% of gross tank volume)</li>
              <li>• Accounts for substrate, decorations, and equipment</li>
              <li>• Bow front tanks estimated at 120% of rectangular volume</li>
              <li>• Water weight calculation includes water only (not tank weight)</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Tank Shape Guidelines</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Rectangular:</strong> Standard aquarium shape</li>
              <li>• <strong>Cylindrical:</strong> Round tanks (enter diameter as length)</li>
              <li>• <strong>Bow Front:</strong> Curved front glass tanks</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Important Reminders</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Check your stand's weight capacity before setup</li>
              <li>• Factor in substrate depth (usually 1-3 inches)</li>
              <li>• Consider equipment displacement</li>
              <li>• Fill levels are typically 1-2 inches below the rim</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Rich Content Sections */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" /> How to Use the Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-3 gap-4">
            {[{ step: 1, title: "Select Tank Shape", desc: "Choose rectangular, cylindrical, or bow front" }, { step: 2, title: "Enter Dimensions", desc: "Fill the length, width, and height fields" }, { step: 3, title: "Calculate Volume", desc: "Click Calculate to see the results" }].map((s) => (
              <div key={s.step} className="text-center space-y-2 p-4 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto font-semibold">{s.step}</div>
                <div className="font-semibold">{s.title}</div>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
          <Alert className="bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              For bow front tanks, we use a 1.2x multiplier as an approximation of the curved front.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How Volume is Calculated</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">Rectangular tanks: V = L × W × H; Cylindrical tanks: V = π × r² × H; Bow front: approx. 1.2 × L × W × H.</p>
          <p className="text-sm text-muted-foreground">We estimate actual water volume at about 90% of the gross tank volume to account for substrate and equipment displacement.</p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Practical Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>20" × 10" × 12" (rectangular) → ~9.3 gal actual water</li>
            <li>24" diameter × 18" height (cylindrical) → ~17.5 gal actual water</li>
            <li>36" × 12" × 18" (bow front) → ~30 gal actual water</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>FAQ</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>Which unit should I use?</AccordionTrigger>
              <AccordionContent>Use inches for US measurements or centimeters if you prefer metric. We convert automatically.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Does substrate affect water volume?</AccordionTrigger>
              <AccordionContent>Yes. Substrate, rocks, and equipment displace water; that's why we estimate 90% of gross volume.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How full should I fill the tank?</AccordionTrigger>
              <AccordionContent>Most tanks are filled 1–2 inches below the rim to accommodate surface movement and equipment.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Share2 className="h-5 w-5" /> Share This Calculator</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button variant="outline" onClick={handleNativeShare} className="flex items-center gap-2"><Share2 className="h-4 w-4" /> Share</Button>
          <Button variant="outline" onClick={handleCopyLink} className="flex items-center gap-2"><Copy className="h-4 w-4" /> Copy Link</Button>
          <a href={`mailto:?subject=Aquarium Volume Calculator&body=${encodeURIComponent(currentUrl || "")}`} className="inline-flex items-center gap-2">
            <Button variant="outline"><Mail className="h-4 w-4" /> Email</Button>
          </a>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Send Us Your Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFeedbackSubmit} className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="fb-name">Name</Label>
                <Input id="fb-name" value={feedback.name} onChange={(e) => setFeedback({ ...feedback, name: e.target.value })} placeholder="Optional" />
              </div>
              <div>
                <Label htmlFor="fb-email">Email</Label>
                <Input id="fb-email" type="email" value={feedback.email} onChange={(e) => setFeedback({ ...feedback, email: e.target.value })} placeholder="Optional" />
              </div>
            </div>
            <div>
              <Label htmlFor="fb-suggestions">Suggestions</Label>
              <Textarea id="fb-suggestions" value={feedback.suggestions} onChange={(e) => setFeedback({ ...feedback, suggestions: e.target.value })} placeholder="Tell us how we can improve this tool" />
            </div>
            <Button type="submit" variant="calculate">Send Feedback</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">This calculator provides estimates for planning purposes. Always verify stand and floor load capacity and consult manufacturers for specific limits.</p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Glossary & Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>231 cubic inches = 1 US gallon</li>
            <li>1 gallon = 3.78541 liters</li>
            <li>Water weight ≈ 8.34 lbs per gallon</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-6 mb-10">
        <CardHeader>
          <CardTitle>Related Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>
              <a className="text-primary underline" href="/pets/pet-care-calculators/aquarium-weight-calculator">Aquarium Weight Calculator</a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default AquariumVolumeCalculator;