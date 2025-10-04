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

export function AquariumWeightCalculator() {
  const [gallons, setGallons] = useState("");
  const [tankType, setTankType] = useState("");
  const [substrate, setSubstrate] = useState("");
  const [decorations, setDecorations] = useState("");
  const [result, setResult] = useState<{
    waterWeight: number;
    tankWeight: number;
    substrateWeight: number;
    decorationsWeight: number;
    totalWeight: number;
  } | null>(null);

  const calculateWeight = () => {
    const gallonsNum = parseFloat(gallons);
    const decorationsNum = parseFloat(decorations) || 0;
    
    if (isNaN(gallonsNum) || gallonsNum <= 0 || !tankType || !substrate) {
      return;
    }

    // Water weight (8.34 lbs per gallon)
    const waterWeight = gallonsNum * 8.34;

    // Tank weight based on type and size
    let tankWeight = 0;
    if (tankType === "glass") {
      // Glass tanks: approximately 1-1.2 lbs per gallon
      tankWeight = gallonsNum * 1.1;
    } else if (tankType === "acrylic") {
      // Acrylic tanks: approximately 0.5-0.7 lbs per gallon
      tankWeight = gallonsNum * 0.6;
    } else if (tankType === "rimless") {
      // Rimless glass: slightly heavier due to thicker glass
      tankWeight = gallonsNum * 1.3;
    }

    // Substrate weight
    let substrateWeight = 0;
    if (substrate === "gravel") {
      // Gravel: about 1.5 lbs per gallon
      substrateWeight = gallonsNum * 1.5;
    } else if (substrate === "sand") {
      // Sand: about 1.8 lbs per gallon
      substrateWeight = gallonsNum * 1.8;
    } else if (substrate === "soil") {
      // Aqua soil: about 1.2 lbs per gallon
      substrateWeight = gallonsNum * 1.2;
    } else if (substrate === "bare") {
      substrateWeight = 0;
    }

    const totalWeight = waterWeight + tankWeight + substrateWeight + decorationsNum;

    setResult({
      waterWeight: Number(waterWeight.toFixed(1)),
      tankWeight: Number(tankWeight.toFixed(1)),
      substrateWeight: Number(substrateWeight.toFixed(1)),
      decorationsWeight: decorationsNum,
      totalWeight: Number(totalWeight.toFixed(1))
    });
  };

  const clearAll = () => {
    setGallons("");
    setTankType("");
    setSubstrate("");
    setDecorations("");
    setResult(null);
  };

  // Sharing & Feedback state
  const [feedback, setFeedback] = useState({ name: "", email: "", suggestions: "" });
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleNativeShare = async () => {
    try {
      if (navigator.share && currentUrl) {
        await navigator.share({
          title: "Aquarium Weight Calculator",
          text: "Check out this Aquarium Weight Calculator!",
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
          Aquarium Weight Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Calculate the total weight of your aquarium setup including water, tank, substrate, and decorations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculate Total Tank Weight</CardTitle>
          <CardDescription>
            Enter your tank specifications to calculate the complete setup weight
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="gallons">Tank Volume (gallons)</Label>
              <Input
                id="gallons"
                type="number"
                placeholder="Enter tank volume"
                value={gallons}
                onChange={(e) => setGallons(e.target.value)}
                min="1"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="tankType">Tank Type</Label>
              <Select value={tankType} onValueChange={setTankType}>
                <SelectTrigger id="tankType" aria-label="Tank type">
                  <SelectValue placeholder="Select tank type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="glass">Standard Glass</SelectItem>
                  <SelectItem value="acrylic">Acrylic</SelectItem>
                  <SelectItem value="rimless">Rimless Glass</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="substrate">Substrate Type</Label>
              <Select value={substrate} onValueChange={setSubstrate}>
                <SelectTrigger id="substrate" aria-label="Substrate type">
                  <SelectValue placeholder="Select substrate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gravel">Gravel</SelectItem>
                  <SelectItem value="sand">Sand</SelectItem>
                  <SelectItem value="soil">Aqua Soil</SelectItem>
                  <SelectItem value="bare">Bare Bottom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="decorations">Decorations Weight (lbs)</Label>
              <Input
                id="decorations"
                type="number"
                placeholder="Enter decoration weight (optional)"
                value={decorations}
                onChange={(e) => setDecorations(e.target.value)}
                min="0"
                step="0.1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Include rocks, driftwood, ornaments, equipment
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={calculateWeight} variant="calculate">
              Calculate Weight
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
            <CardTitle>Weight Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {result.waterWeight}
                  </div>
                  <p className="text-sm text-muted-foreground">Water (lbs)</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {result.tankWeight}
                  </div>
                  <p className="text-sm text-muted-foreground">Tank (lbs)</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {result.substrateWeight}
                  </div>
                  <p className="text-sm text-muted-foreground">Substrate (lbs)</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {result.decorationsWeight}
                  </div>
                  <p className="text-sm text-muted-foreground">Decorations (lbs)</p>
                </div>
              </div>
              
              <div className="text-center p-6 border-2 border-primary rounded-lg">
                <div className="text-4xl font-bold text-primary mb-2">
                  {result.totalWeight} lbs
                </div>
                <p className="text-lg text-muted-foreground">Total Setup Weight</p>
                <p className="text-sm text-muted-foreground mt-2">
                  ({(result.totalWeight / 2.205).toFixed(1)} kg)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Weight Calculation Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Weight Components</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Water:</strong> 8.34 lbs per gallon (heaviest component)</li>
              <li>• <strong>Glass tanks:</strong> ~1.1 lbs per gallon</li>
              <li>• <strong>Acrylic tanks:</strong> ~0.6 lbs per gallon</li>
              <li>• <strong>Substrate:</strong> Varies by material density</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Stand Requirements</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Ensure stand can support 1.5x the calculated weight</li>
              <li>• Check floor support for large tanks (over 75 gallons)</li>
              <li>• Consider weight distribution across stand surface</li>
              <li>• Account for dynamic loads (water movement)</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Safety Notes</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Never exceed manufacturer stand weight limits</li>
              <li>• Ensure level placement to prevent stress fractures</li>
              <li>• Consider professional installation for tanks over 100 gallons</li>
              <li>• Check building codes for floor load limits</li>
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
            {[{ step: 1, title: "Enter Tank Volume", desc: "Provide gallons of your tank" }, { step: 2, title: "Choose Types", desc: "Select tank and substrate types" }, { step: 3, title: "Add Decorations", desc: "Optionally include weight for rocks/wood" }].map((s) => (
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
              Water is the heaviest component. Ensure your stand supports 1.5× the total weight.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Weight Components Explained</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">Water weight: 8.34 lbs per gallon. Tank weight varies by material. Substrate density differs (sand &gt; gravel &gt; soil).</p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Practical Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>40 gal glass + gravel + 10 lbs decor → ~ (334 + 44 + 60 + 10) = 448 lbs total</li>
            <li>75 gal acrylic + sand + 20 lbs decor → ~ (626 + 45 + 135 + 20) = 826 lbs total</li>
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
              <AccordionTrigger>How accurate are these weights?</AccordionTrigger>
              <AccordionContent>They are estimates. Always verify manufacturer specs and consider safety margins.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Should I include equipment weight?</AccordionTrigger>
              <AccordionContent>Yes. Heaters, filters, and lights add weight (often a few pounds).</AccordionContent>
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
          <a href={`mailto:?subject=Aquarium Weight Calculator&body=${encodeURIComponent(currentUrl || "")}`} className="inline-flex items-center gap-2">
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
          <p className="text-sm text-muted-foreground">These calculations are estimates. Always verify stand capacity and floor load limits. Consider professional consultation for large tanks.</p>
        </CardContent>
      </Card>
    </div>
  );
}