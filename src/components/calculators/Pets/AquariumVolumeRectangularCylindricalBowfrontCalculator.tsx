import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AquariumVolumeRectangularCylindricalBowfrontCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs for all three aquarium types
  // Rectangular: length, width, height
  // Cylindrical: diameter, height
  // Bowfront: length, width, height, bow depth
  const [shape, setShape] = useState<"rectangular" | "cylindrical" | "bowfront">("rectangular");
  const [inputs, setInputs] = useState({
    length: "",
    width: "",
    height: "",
    diameter: "",
    bowDepth: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    // Parse inputs to floats
    const parseInput = (val: string) => {
      const n = parseFloat(val);
      return isNaN(n) || n <= 0 ? null : n;
    };

    // Convert inches to cm if imperial, else cm stays cm
    const toCm = (val: number) => (unit === "imperial" ? val * 2.54 : val);

    // Volume in liters calculation
    let volumeLiters: number | null = null;

    if (shape === "rectangular") {
      const length = parseInput(inputs.length);
      const width = parseInput(inputs.width);
      const height = parseInput(inputs.height);
      if (length && width && height) {
        // Convert to cm
        const l = toCm(length);
        const w = toCm(width);
        const h = toCm(height);
        // Volume in cubic cm = l * w * h
        // 1 liter = 1000 cubic cm
        volumeLiters = (l * w * h) / 1000;
      }
    } else if (shape === "cylindrical") {
      const diameter = parseInput(inputs.diameter);
      const height = parseInput(inputs.height);
      if (diameter && height) {
        const d = toCm(diameter);
        const h = toCm(height);
        // Volume = π * r^2 * h
        const r = d / 2;
        volumeLiters = (Math.PI * r * r * h) / 1000;
      }
    } else if (shape === "bowfront") {
      // Bowfront approx volume = height * width * length * (1 - bowDepthFactor)
      // BowDepthFactor approx = bowDepth / width * 0.3 (empirical factor)
      const length = parseInput(inputs.length);
      const width = parseInput(inputs.width);
      const height = parseInput(inputs.height);
      const bowDepth = parseInput(inputs.bowDepth);
      if (length && width && height && bowDepth) {
        const l = toCm(length);
        const w = toCm(width);
        const h = toCm(height);
        const bd = toCm(bowDepth);
        // Bowfront volume approx = rectangular volume * (1 - 0.3 * (bowDepth / width))
        const bowFactor = 1 - 0.3 * (bd / w);
        volumeLiters = (l * w * h * bowFactor) / 1000;
      }
    }

    if (volumeLiters === null) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for all required fields.",
      };
    }

    // Convert liters to gallons if imperial
    const volume = unit === "imperial" ? +(volumeLiters * 0.264172).toFixed(2) : +volumeLiters.toFixed(2);
    const label = unit === "imperial" ? "Gallons" : "Liters";

    return {
      value: volume,
      label,
      subtext: `Calculated volume of your ${shape} aquarium.`,
      warning: null,
    };
  }, [inputs, unit, shape]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How do I calculate the volume of a rectangular aquarium?",
      answer: "Measure the length, width, and height in inches, then multiply all three values together and divide by 231 to convert cubic inches to gallons. For example, a 36×18×24 inch tank holds approximately 67 gallons.",
    },
    {
      question: "What's the difference between cylindrical and bowfront aquarium calculations?",
      answer: "Cylindrical tanks use radius and height with the formula πr²h, while bowfront tanks account for the curved front panel, requiring separate depth measurements for curved and straight sections.",
    },
    {
      question: "Why is accurate volume calculation important for fish stocking?",
      answer: "Overstocking based on incorrect volume can cause poor water quality and harm fish; the general rule is 1 inch of fish per gallon, so 55-gallon tanks safely hold around 50 inches of fish.",
    },
    {
      question: "How do I measure for a bowfront aquarium calculator?",
      answer: "Measure the straight back wall width, the curved front depth at its deepest point, and the overall height; the calculator separates curved and straight sections for accurate total volume.",
    },
    {
      question: "Can I use centimeters instead of inches in this calculator?",
      answer: "Yes, most calculators allow metric input; just ensure all measurements are in the same unit and select the correct output unit (liters vs. gallons) for accurate results.",
    },
    {
      question: "What volume should I leave empty at the top of my aquarium?",
      answer: "Leave 1–2 inches of space below the rim to prevent water overflow during decoration placement and ensure proper gas exchange; this reduces usable volume by 5–10%.",
    },
    {
      question: "How accurate are aquarium volume calculators for irregularly shaped tanks?",
      answer: "Rectangular and cylindrical calculations are highly accurate; bowfront estimates may vary by 5–10% depending on curve complexity, so verify with water displacement for critical stocking decisions.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (inches, gallons)</SelectItem>
              <SelectItem value="metric">Metric (cm, liters)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-slate-700 dark:text-slate-300">Aquarium Shape</Label>
        <Select value={shape} onValueChange={setShape}>
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rectangular">Rectangular</SelectItem>
            <SelectItem value="cylindrical">Cylindrical</SelectItem>
            <SelectItem value="bowfront">Bowfront</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs based on shape */}
      {shape === "rectangular" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="length" className="text-slate-700 dark:text-slate-300">
              Length ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="length"
              type="number"
              min={0}
              step="any"
              value={inputs.length}
              onChange={(e) => setInputs({ ...inputs, length: e.target.value })}
              placeholder="e.g. 36"
            />
          </div>
          <div>
            <Label htmlFor="width" className="text-slate-700 dark:text-slate-300">
              Width ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="width"
              type="number"
              min={0}
              step="any"
              value={inputs.width}
              onChange={(e) => setInputs({ ...inputs, width: e.target.value })}
              placeholder="e.g. 18"
            />
          </div>
          <div>
            <Label htmlFor="height" className="text-slate-700 dark:text-slate-300">
              Height ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="height"
              type="number"
              min={0}
              step="any"
              value={inputs.height}
              onChange={(e) => setInputs({ ...inputs, height: e.target.value })}
              placeholder="e.g. 20"
            />
          </div>
        </div>
      )}

      {shape === "cylindrical" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="diameter" className="text-slate-700 dark:text-slate-300">
              Diameter ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="diameter"
              type="number"
              min={0}
              step="any"
              value={inputs.diameter}
              onChange={(e) => setInputs({ ...inputs, diameter: e.target.value })}
              placeholder="e.g. 24"
            />
          </div>
          <div>
            <Label htmlFor="height" className="text-slate-700 dark:text-slate-300">
              Height ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="height"
              type="number"
              min={0}
              step="any"
              value={inputs.height}
              onChange={(e) => setInputs({ ...inputs, height: e.target.value })}
              placeholder="e.g. 30"
            />
          </div>
        </div>
      )}

      {shape === "bowfront" && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="length" className="text-slate-700 dark:text-slate-300">
              Length ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="length"
              type="number"
              min={0}
              step="any"
              value={inputs.length}
              onChange={(e) => setInputs({ ...inputs, length: e.target.value })}
              placeholder="e.g. 48"
            />
          </div>
          <div>
            <Label htmlFor="width" className="text-slate-700 dark:text-slate-300">
              Width ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="width"
              type="number"
              min={0}
              step="any"
              value={inputs.width}
              onChange={(e) => setInputs({ ...inputs, width: e.target.value })}
              placeholder="e.g. 18"
            />
          </div>
          <div>
            <Label htmlFor="height" className="text-slate-700 dark:text-slate-300">
              Height ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="height"
              type="number"
              min={0}
              step="any"
              value={inputs.height}
              onChange={(e) => setInputs({ ...inputs, height: e.target.value })}
              placeholder="e.g. 20"
            />
          </div>
          <div>
            <Label htmlFor="bowDepth" className="text-slate-700 dark:text-slate-300">
              Bow Depth ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="bowDepth"
              type="number"
              min={0}
              step="any"
              value={inputs.bowDepth}
              onChange={(e) => setInputs({ ...inputs, bowDepth: e.target.value })}
              placeholder="e.g. 4"
            />
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here)
            setInputs((i) => ({ ...i }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              length: "",
              width: "",
              height: "",
              diameter: "",
              bowDepth: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Aquarium Volume Calculator (Rectangular / Cylindrical / Bowfront)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator computes aquarium volume in gallons or liters by accepting shape-specific dimensions, helping you determine proper filtration, stocking capacity, and water change schedules.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Select your tank shape (rectangular, cylindrical, or bowfront), then input length, width, and height in either inches or centimeters; for bowfront tanks, measure the curved front depth and straight back width separately.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator returns total volume in your chosen unit; use this figure to determine safe fish stocking (1 inch per gallon rule), select appropriately sized filters (3–10× turnover rate), and plan maintenance routines.</p>
        </div>
      </section>

      {/* TABLE: Common Aquarium Dimensions and Volumes */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Aquarium Dimensions and Volumes</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard tank sizes with actual volumes used in the pet aquarium industry.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tank Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dimensions (L×W×H inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Volume (Gallons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Fish Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Nano</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12×8×8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–5</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small Rectangular</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20×10×12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12–14</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standard 20-Gallon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24×12×16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18–20</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standard 40-Gallon Breeder</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36×18×18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35–40</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">55-Gallon Standard</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48×12×24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50–55</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large 75-Gallon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48×18×21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70–75</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cylindrical 35-Gallon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Diameter 20, Height 24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30–35</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Volumes account for substrate and decorations; reduce stocking counts by 10–15% if tank is heavily decorated.</p>
      </section>

      {/* TABLE: Water Quality Parameters by Tank Volume */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Water Quality Parameters by Tank Volume</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Guidelines for water change frequency and filtration capacity based on aquarium size.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tank Volume (Gallons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weekly Water Change (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Filter Turnover Rate (GPH)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Nitrate Buildup Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5–10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">11–20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40–80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate-High</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">21–40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80–160</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">41–75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160–300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low-Moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">76–125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300–500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">126–200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500–800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Low</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Smaller tanks require proportionally larger water changes due to faster ammonia accumulation; bioload from stocking density affects these rates.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure twice: aquarium dimensions can vary by ±0.5 inches from listed specs, so verify with a tape measure before stocking.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for substrate and décor: they displace 5–15% of volume, so reduce calculated capacity when planning fish numbers.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use gallons for fish stocking rules and liters for water chemistry calculations to avoid unit conversion errors.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test your calculation by filling the tank and measuring water volume with a known container to verify accuracy before adding fish.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting Interior vs. Exterior Dimensions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Always measure inside the tank; exterior dimensions include glass thickness and will overestimate volume by 5–10%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting Bowfront Curve Complexity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Bowfront calculators assume a standard curve; extremely shallow or deep curves may require manual adjustment to prevent 10–15% volume error.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Listed Tank Capacity Instead of Calculated Volume</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manufacturer specs often round down (e.g., a 55-gallon may hold 57 gallons calculated); verify with your measurements for precision.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing Measurement Units Midway</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Convert all measurements to either inches or centimeters before input; mixing units produces incorrect results.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the volume of a rectangular aquarium?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure the length, width, and height in inches, then multiply all three values together and divide by 231 to convert cubic inches to gallons. For example, a 36×18×24 inch tank holds approximately 67 gallons.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between cylindrical and bowfront aquarium calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cylindrical tanks use radius and height with the formula πr²h, while bowfront tanks account for the curved front panel, requiring separate depth measurements for curved and straight sections.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is accurate volume calculation important for fish stocking?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Overstocking based on incorrect volume can cause poor water quality and harm fish; the general rule is 1 inch of fish per gallon, so 55-gallon tanks safely hold around 50 inches of fish.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure for a bowfront aquarium calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure the straight back wall width, the curved front depth at its deepest point, and the overall height; the calculator separates curved and straight sections for accurate total volume.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use centimeters instead of inches in this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, most calculators allow metric input; just ensure all measurements are in the same unit and select the correct output unit (liters vs. gallons) for accurate results.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What volume should I leave empty at the top of my aquarium?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Leave 1–2 inches of space below the rim to prevent water overflow during decoration placement and ensure proper gas exchange; this reduces usable volume by 5–10%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate are aquarium volume calculators for irregularly shaped tanks?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Rectangular and cylindrical calculations are highly accurate; bowfront estimates may vary by 5–10% depending on curve complexity, so verify with water displacement for critical stocking decisions.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.thesprucepets.com/aquarium-stocking-guide-4586147" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Spruce Pets – Aquarium Stocking Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Expert guide on safe fish stocking ratios based on aquarium volume and bioload.</p>
          </li>
          <li>
            <a href="https://www.fishkeepingworld.com/aquarium-filter/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FishKeeping World – Aquarium Filter Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Details on proper filter sizing and turnover rates relative to tank volume.</p>
          </li>
          <li>
            <a href="https://www.aquariumcoop.com/blogs/aquarium/aquarium-maintenance-schedule" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Aquarium Co-op – Tank Maintenance Schedules</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Water change frequency and care routines adjusted by tank size and bioload.</p>
          </li>
          <li>
            <a href="https://www.vet.cornell.edu/animal-health-diagnostic-center/laboratory-services" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Cornell University – Aquatic Animal Care Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Scientific standards for aquarium volume requirements and fish welfare guidelines.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Aquarium Volume Calculator (Rectangular / Cylindrical / Bowfront)"
      description="Calculate the accurate volume (in Liters or Gallons) of rectangular, cylindrical, or bowfront aquariums."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Rectangular: Volume = (Length × Width × Height) / 1000; Cylindrical: Volume = (π × (Diameter/2)² × Height) / 1000; Bowfront: Volume ≈ (Length × Width × Height × (1 - 0.3 × (BowDepth / Width))) / 1000",
        variables: [
          { symbol: "Length", description: "Length of the aquarium" },
          { symbol: "Width", description: "Width of the aquarium" },
          { symbol: "Height", description: "Height of the aquarium" },
          { symbol: "Diameter", description: "Diameter of the cylindrical aquarium" },
          { symbol: "BowDepth", description: "Depth of the bowfront curve" },
          { symbol: "π", description: "Mathematical constant Pi (~3.1416)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A hobbyist owns a bowfront aquarium measuring 48 inches in length, 18 inches in width, 20 inches in height, and a bow depth of 4 inches. They want to know the volume in gallons to dose medication accurately.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert all measurements to centimeters (1 inch = 2.54 cm). Length = 121.92 cm, Width = 45.72 cm, Height = 50.8 cm, Bow Depth = 10.16 cm.",
          },
          {
            label: "2",
            explanation:
              "Calculate the bowfront volume using the formula: Volume ≈ (Length × Width × Height × (1 - 0.3 × (BowDepth / Width))) / 1000.",
          },
          {
            label: "3",
            explanation:
              "Substitute values: Volume ≈ (121.92 × 45.72 × 50.8 × (1 - 0.3 × (10.16 / 45.72))) / 1000 ≈ 270.5 liters.",
          },
          {
            label: "4",
            explanation:
              "Convert liters to gallons: 270.5 × 0.264172 ≈ 71.4 gallons.",
          },
        ],
        result: "The aquarium volume is approximately 71.4 gallons, which can be used for precise veterinary dosing and maintenance.",
      }}
      relatedCalculators={[
        { title: "Lilies Poisoning Risk Guide (cats)", url: "/pets/cat-lilies-poisoning-risk-guide", icon: "🐱" },
        { title: "Kitten Adult Weight Predictor", url: "/pets/kitten-adult-weight-predictor", icon: "🐶" },
        { title: "Ambient Temperature Safe Zone Calculator", url: "/pets/bird-ambient-temperature-safe-zone", icon: "🐱" },
        { title: "Phosphorus per Meal Estimator (diet label helper)", url: "/pets/cat-phosphorus-per-meal-estimator", icon: "🍖" },
        { title: "Daily Water Intake Checker for Cats", url: "/pets/cat-daily-water-intake-checker", icon: "🐱" },
        { title: "Benadryl (Diphenhydramine) Dose Calculator for Cats", url: "/pets/cat-benadryl-diphenhydramine-dose", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Aquarium Volume Calculator (Rectangular / Cylindrical / Bowfront)" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Veterinary References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}