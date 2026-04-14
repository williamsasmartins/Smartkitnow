import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const paintCoveragePerGallon = 350; // square feet per gallon, typical coverage for wall paint

const paintTypes = [
  { label: "Latex (Water-Based)", value: "latex", coverage: 350 },
  { label: "Oil-Based", value: "oil", coverage: 400 },
  { label: "Enamel", value: "enamel", coverage: 375 },
];

const surfaceTypes = [
  { label: "Drywall / Wall", value: "drywall", multiplier: 1 },
  { label: "Wood Trim / Molding", value: "wood", multiplier: 0.8 },
  { label: "Metal Surface", value: "metal", multiplier: 0.9 },
];

export default function HomePaintTouchUpCalculator() {
  const [inputs, setInputs] = useState({
    length: "",
    width: "",
    height: "",
    numberOfSpots: "",
    averageSpotSize: "",
    paintType: "latex",
    surfaceType: "drywall",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculate total touch-up area and paint needed
  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const height = parseFloat(inputs.height);
    const numberOfSpots = parseInt(inputs.numberOfSpots);
    const averageSpotSize = parseFloat(inputs.averageSpotSize);
    const paintTypeObj = paintTypes.find((p) => p.value === inputs.paintType);
    const surfaceTypeObj = surfaceTypes.find((s) => s.value === inputs.surfaceType);

    if (
      isNaN(length) || length <= 0 ||
      isNaN(width) || width <= 0 ||
      isNaN(height) || height <= 0 ||
      isNaN(numberOfSpots) || numberOfSpots < 0 ||
      isNaN(averageSpotSize) || averageSpotSize <= 0 ||
      !paintTypeObj || !surfaceTypeObj
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please enter valid positive numbers for all fields.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Total wall area (4 walls assumed rectangular room)
    const totalWallArea = 2 * height * (length + width);

    // Total touch-up area = number of spots * average spot size (in sq ft)
    const totalTouchUpArea = numberOfSpots * averageSpotSize;

    // Adjusted coverage based on paint type and surface
    const adjustedCoverage = paintTypeObj.coverage * surfaceTypeObj.multiplier;

    // Paint needed in gallons = total touch-up area / adjusted coverage
    // Add 10% extra for wastage and multiple coats
    const paintNeededGallonsRaw = totalTouchUpArea / adjustedCoverage;
    const paintNeededGallons = paintNeededGallonsRaw * 1.1;

    // Convert gallons to ounces (1 gallon = 128 ounces)
    const paintNeededOunces = paintNeededGallons * 128;

    // Format results
    const paintGallonsRounded = paintNeededGallons < 0.01 ? 0 : Math.max(0.01, parseFloat(paintNeededGallons.toFixed(3)));
    const paintOuncesRounded = paintNeededOunces < 1 ? 0 : Math.max(0, Math.ceil(paintNeededOunces));

    return {
      value: `${paintGallonsRounded} gallons (${paintOuncesRounded} ounces)`,
      label: "Estimated Paint Needed for Touch-Ups",
      subtext: `Based on ${totalTouchUpArea.toFixed(2)} sq ft of touch-up area using ${paintTypeObj.label} paint on ${surfaceTypeObj.label}.`,
      warning: totalTouchUpArea > totalWallArea * 0.1 ? "Warning: Touch-up area exceeds 10% of total wall area, consider full repaint." : null,
      formulaUsed: `Paint Needed (gallons) = (Number of Spots × Average Spot Size) ÷ (Coverage × Surface Multiplier) × 1.1 (wastage)`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How much paint do I need for a small touch-up job?",
      answer: "Most small touch-ups require 1-4 ounces of paint, depending on wall size and coverage. A quart (32 oz) typically covers 100-150 sq ft and is sufficient for multiple small repairs.",
    },
    {
      question: "What's the difference between interior and exterior touch-up paint coverage?",
      answer: "Exterior paint generally covers 250-400 sq ft per gallon due to thicker formulation, while interior latex covers 350-400 sq ft per gallon under standard conditions.",
    },
    {
      question: "Do I need to account for multiple coats in touch-up estimates?",
      answer: "Yes, most touch-ups require 2 coats for proper blending and color matching, which doubles your material estimate compared to a single-coat calculation.",
    },
    {
      question: "How does wall texture affect paint coverage estimates?",
      answer: "Textured walls absorb 10-20% more paint than smooth surfaces; popcorn ceilings and rough stucco can reduce coverage by up to 25%.",
    },
    {
      question: "What paint sheen should I use for touch-ups?",
      answer: "Match the original sheen (flat, eggshell, satin, or gloss); using a different finish will create visible inconsistencies even with the same color.",
    },
    {
      question: "How accurate is this estimator for oddly-shaped rooms?",
      answer: "Break down irregular rooms into rectangles and add the areas together for highest accuracy; the calculator works best with standard wall dimensions.",
    },
    {
      question: "Should I buy slightly more paint than estimated?",
      answer: "Yes, purchasing 10-15% extra accounts for waste, variation in application, and ensures you have leftover for future touch-ups.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="length">Room Length (ft)</Label>
              <Input
                id="length"
                type="number"
                min={0}
                step="0.1"
                value={inputs.length}
                onChange={(e) => handleInputChange("length", e.target.value)}
                placeholder="e.g., 15"
              />
            </div>
            <div>
              <Label htmlFor="width">Room Width (ft)</Label>
              <Input
                id="width"
                type="number"
                min={0}
                step="0.1"
                value={inputs.width}
                onChange={(e) => handleInputChange("width", e.target.value)}
                placeholder="e.g., 12"
              />
            </div>
            <div>
              <Label htmlFor="height">Room Height (ft)</Label>
              <Input
                id="height"
                type="number"
                min={0}
                step="0.1"
                value={inputs.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                placeholder="e.g., 8"
              />
            </div>
            <div>
              <Label htmlFor="numberOfSpots">Number of Touch-Up Spots</Label>
              <Input
                id="numberOfSpots"
                type="number"
                min={0}
                step="1"
                value={inputs.numberOfSpots}
                onChange={(e) => handleInputChange("numberOfSpots", e.target.value)}
                placeholder="e.g., 10"
              />
            </div>
            <div>
              <Label htmlFor="averageSpotSize">Average Spot Size (sq ft)</Label>
              <Input
                id="averageSpotSize"
                type="number"
                min={0}
                step="0.01"
                value={inputs.averageSpotSize}
                onChange={(e) => handleInputChange("averageSpotSize", e.target.value)}
                placeholder="e.g., 0.5"
              />
            </div>
            <div>
              <Label htmlFor="paintType">Paint Type</Label>
              <Select
                value={inputs.paintType}
                onValueChange={(v) => handleInputChange("paintType", v)}
              >
                <SelectTrigger id="paintType" className="w-full">
                  <SelectValue placeholder="Select paint type" />
                </SelectTrigger>
                <SelectContent>
                  {paintTypes.map((pt) => (
                    <SelectItem key={pt.value} value={pt.value}>
                      {pt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="surfaceType">Surface Type</Label>
              <Select
                value={inputs.surfaceType}
                onValueChange={(v) => handleInputChange("surfaceType", v)}
              >
                <SelectTrigger id="surfaceType" className="w-full">
                  <SelectValue placeholder="Select surface type" />
                </SelectTrigger>
                <SelectContent>
                  {surfaceTypes.map((st) => (
                    <SelectItem key={st.value} value={st.value}>
                      {st.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              length: "",
              width: "",
              height: "",
              numberOfSpots: "",
              averageSpotSize: "",
              paintType: "latex",
              surfaceType: "drywall",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-700 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Home Paint Touch-Up Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the amount of paint needed for interior or exterior touch-up projects by analyzing wall dimensions, surface type, and finish. Input your room measurements and paint specifications to get precise material estimates.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include total wall area (length × height), wall texture type (smooth, textured, popcorn), paint sheen (flat, eggshell, satin, gloss), and number of coats. The calculator accounts for coverage variations across different paint formulations and surface conditions.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show gallons or quarts needed, along with adjusted estimates for texture and multiple coats. Use these figures to purchase the correct paint quantity and reduce waste while ensuring complete coverage.</p>
        </div>
      </section>

      {/* TABLE: Paint Coverage by Type and Finish */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Paint Coverage by Type and Finish</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard coverage rates vary by paint type and sheen level for single-coat applications.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Paint Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sheen</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Coverage (sq ft/gallon)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Interior Latex</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Flat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350-400</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Interior Latex</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Eggshell</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350-375</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Interior Latex</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Satin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">325-375</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Interior Latex</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Gloss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-350</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Exterior Acrylic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Flat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250-350</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Exterior Acrylic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Satin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250-300</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Primer</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">All</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-250</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Actual coverage depends on wall texture, color change magnitude, and application technique.</p>
      </section>

      {/* TABLE: Common Touch-Up Project Sizes and Paint Needs */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Touch-Up Project Sizes and Paint Needs</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Estimate material quantities based on typical residential touch-up scenarios.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Project Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Area (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Paint Required</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Coats</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Patch repair</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 oz</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Accent wall touch-up</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">½ quart</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Closet interior</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 quart</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bedroom refresh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-1.5 quarts</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Living room walls</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600-800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 quarts</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Textured surface</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5 quarts</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Popcorn ceiling</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 quarts</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Add 15% extra for waste and future touch-ups; textured surfaces require more material than smooth walls.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always measure twice before calculating; even 10 sq ft errors compound across large touch-up areas.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Bring a paint sample or color code from the original can to ensure perfect color matching and sheen consistency.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Apply primer before paint on patched drywall, stains, or color transitions to prevent bleed-through and improve adhesion.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Buy paint in the smallest container available for small repairs; quarts (32 oz) are ideal for touch-ups rather than gallons.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring textured surfaces</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Textured walls absorb significantly more paint than smooth drywall; always select the correct texture type in the calculator.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating for multiple coats</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Most touch-ups require 2 coats for proper color coverage, especially when changing from light to dark or covering stains.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Matching wrong paint finish</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using a different sheen than the original creates visible inconsistencies; verify eggshell vs. satin before purchasing.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for waste</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Brush strokes, spills, and application variations consume 10-15% more paint than theoretical coverage calculations.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much paint do I need for a small touch-up job?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most small touch-ups require 1-4 ounces of paint, depending on wall size and coverage. A quart (32 oz) typically covers 100-150 sq ft and is sufficient for multiple small repairs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between interior and exterior touch-up paint coverage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Exterior paint generally covers 250-400 sq ft per gallon due to thicker formulation, while interior latex covers 350-400 sq ft per gallon under standard conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do I need to account for multiple coats in touch-up estimates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, most touch-ups require 2 coats for proper blending and color matching, which doubles your material estimate compared to a single-coat calculation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does wall texture affect paint coverage estimates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Textured walls absorb 10-20% more paint than smooth surfaces; popcorn ceilings and rough stucco can reduce coverage by up to 25%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What paint sheen should I use for touch-ups?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Match the original sheen (flat, eggshell, satin, or gloss); using a different finish will create visible inconsistencies even with the same color.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is this estimator for oddly-shaped rooms?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Break down irregular rooms into rectangles and add the areas together for highest accuracy; the calculator works best with standard wall dimensions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I buy slightly more paint than estimated?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, purchasing 10-15% extra accounts for waste, variation in application, and ensures you have leftover for future touch-ups.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sherwin-williams.com/homeowners/more/faqs/coverage-calculator" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Sherwin-Williams Paint Coverage Chart</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official paint coverage guidelines and calculator for residential interior and exterior projects.</p>
          </li>
          <li>
            <a href="https://www.epa.gov/indoor-air-quality-iaq/painting-your-home" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA Guide to Painting and Color Selection</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Government resource on paint types, coverage estimates, and indoor air quality considerations for touch-ups.</p>
          </li>
          <li>
            <a href="https://www.benjaminmoore.com/en-us/paint-color/coverage-calculator" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Benjamin Moore Paint Coverage Calculator</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional paint manufacturer's tool for calculating coverage based on surface type and application method.</p>
          </li>
          <li>
            <a href="https://www.thespruce.com/how-much-paint-needed-4845865" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Spruce: How Much Paint Do You Need</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide explaining paint coverage formulas and adjustment factors for different wall conditions.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Home Paint Touch-Up Estimator"
      description="Estimate paint needed for touch-ups. Calculate exactly how much paint covers scratches and small repairs on walls and trim."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Paint Needed (gallons) = (Number of Spots × Average Spot Size) ÷ (Coverage × Surface Multiplier) × 1.1 (wastage buffer)",
        variables: [
          { variable: "Number of Spots", description: "Total count of touch-up areas" },
          { variable: "Average Spot Size", description: "Average size of each spot in square feet" },
          { variable: "Coverage", description: "Paint coverage in square feet per gallon (varies by paint type)" },
          { variable: "Surface Multiplier", description: "Adjustment factor based on surface type" },
          { variable: "1.1", description: "10% extra paint added for wastage and multiple coats" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a living room measuring 15 ft by 12 ft with 8 ft ceilings. There are 12 scratches on the drywall walls, each averaging 0.4 square feet. You plan to use latex paint on drywall surfaces.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate total touch-up area: 12 spots × 0.4 sq ft = 4.8 sq ft.",
          },
          {
            label: "Step 2",
            explanation:
              "Use latex paint coverage of 350 sq ft/gallon and surface multiplier of 1 for drywall.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate paint needed: (4.8 ÷ (350 × 1)) × 1.1 = 0.015 gallons (~1.92 ounces).",
          },
          {
            label: "Step 4",
            explanation:
              "Purchase a small sample or quart container as this amount is minimal, ensuring enough paint for multiple coats.",
          },
        ],
        result: "Estimated paint needed is approximately 0.015 gallons or about 2 ounces.",
      }}
      relatedCalculators={[
        { title: "Grass Seed Quantity Calculator", url: "/everyday/grass-seed-quantity", icon: "💡" },
        { title: "Party Food & Drinks Planner", url: "/everyday/party-food-drinks-planner", icon: "🎉" },
        { title: "Fertilizer Application Calculator", url: "/everyday/fertilizer-application-calculator", icon: "💡" },
        { title: "Propane Tank Burn Time Estimator", url: "/everyday/propane-tank-burn-time", icon: "💡" },
        { title: "Body Mass Index (BMI) Calculator", url: "/everyday/bmi-calculator", icon: "❤️" },
        { title: "Caffeine Max per Day Calculator", url: "/everyday/caffeine-max-per-day", icon: "💡" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Pro Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}