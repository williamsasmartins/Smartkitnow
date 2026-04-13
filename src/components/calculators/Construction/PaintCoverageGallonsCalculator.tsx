import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Ruler,
  Hammer,
  HardHat,
  Box,
  DollarSign,
  Info,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Lightbulb,
  Calculator,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PaintCoverageGallonsCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial", // imperial or metric
    length: "", // wall length
    height: "", // wall height
    windows: "", // total window area to deduct
    coveragePerGallon: "350", // typical paint coverage sq ft per gallon (imperial)
    waste: "10", // waste percentage
    pricePerGallon: "", // optional price input
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion constants
  const SQFT_PER_SQM = 10.7639;

  // Calculate results
  const results = useMemo(() => {
    // Parse inputs
    const length = parseFloat(inputs.length);
    const height = parseFloat(inputs.height);
    const windows = parseFloat(inputs.windows) || 0;
    const coveragePerGallon = parseFloat(inputs.coveragePerGallon);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerGallon = parseFloat(inputs.pricePerGallon);

    if (
      isNaN(length) ||
      isNaN(height) ||
      isNaN(windows) ||
      isNaN(coveragePerGallon) ||
      length <= 0 ||
      height <= 0 ||
      coveragePerGallon <= 0
    ) {
      return {
        mainQty: "0 Gallons",
        cost: "$0.00",
        details: "Please enter valid positive numbers for length, height, windows, and coverage.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Calculate wall area
    let wallArea = length * height; // in feet or meters depending on unit

    // Deduct windows area
    wallArea = Math.max(wallArea - windows, 0);

    // Convert to square feet if metric
    let wallAreaSqFt = wallArea;
    if (inputs.unit === "metric") {
      wallAreaSqFt = wallArea * SQFT_PER_SQM;
    }

    // Calculate gallons needed before waste
    const gallonsRaw = wallAreaSqFt / coveragePerGallon;

    // Add waste margin
    const gallonsWithWaste = gallonsRaw * (1 + wastePercent / 100);

    // Round up to nearest 0.1 gallon (common commercial unit)
    const gallonsRounded = Math.ceil(gallonsWithWaste * 10) / 10;

    // Calculate cost if price provided
    const cost = pricePerGallon && !isNaN(pricePerGallon) ? pricePerGallon * gallonsRounded : 0;

    return {
      mainQty: `${gallonsRounded.toFixed(1)} Gallons`,
      cost: cost > 0 ? `$${cost.toFixed(2)}` : "Price not provided",
      details: `Raw: ${gallonsRaw.toFixed(2)} gallons before waste`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "How do I calculate paint coverage for my room?",
      answer: "To calculate paint coverage, measure the total square footage of the walls you plan to paint by multiplying height by width for each wall, then add them together. Most interior paints cover between 350–400 square feet per gallon, though this varies by paint quality and surface texture. Divide your total square footage by the coverage rate (typically 375 sq ft/gallon for standard latex paint) to determine gallons needed. Don't forget to account for a second coat, which typically requires 50% more paint than the first coat.",
    },
    {
      question: "What factors affect paint coverage rates?",
      answer: "Paint coverage is affected by surface texture, paint quality, application method, and environmental conditions. Rough or porous surfaces like drywall or stucco reduce coverage to 300–350 sq ft/gallon, while smooth surfaces achieve 400–450 sq ft/gallon. Higher-quality paints with better pigmentation cover more area per gallon than budget brands. Application with a roller typically achieves better coverage than brush application, and humidity and temperature can impact drying and adhesion.",
    },
    {
      question: "Why do I need to add extra paint to my calculation?",
      answer: "It's wise to add 10–15% extra to your calculated gallons to account for spills, waste, uneven surfaces, and touch-ups after paint dries. Paint often appears darker when wet and lighter when dry, so additional paint helps ensure color consistency for future repairs. Having leftover paint also allows for matching touch-ups on walls over time without worrying about slight color variations from new batches.",
    },
    {
      question: "How much paint do I need for a 10x12 bedroom?",
      answer: "A 10x12 bedroom with 8-foot ceilings has approximately 440 square feet of wall space (2 walls at 10×8 = 80 sq ft each, and 2 walls at 12×8 = 96 sq ft each). At a standard coverage rate of 375 sq ft/gallon, you need approximately 1.2 gallons for one coat. For two coats, plan for 2.4 gallons, or round up to 2.5 gallons to account for waste and ensure adequate coverage.",
    },
    {
      question: "What's the difference between interior and exterior paint coverage?",
      answer: "Exterior paint typically covers 300–350 square feet per gallon due to more porous surfaces like wood siding and stucco, while interior paint covers 350–400 sq ft/gallon on standard drywall. Exterior paints are formulated to resist weather, UV rays, and moisture, making them thicker and less spreadable than interior paints. Exterior projects often require two coats due to surface porosity and durability requirements, significantly increasing total gallons needed compared to interior jobs.",
    },
    {
      question: "How do I account for doors, windows, and trim in my calculation?",
      answer: "Subtract the square footage of doors and large windows from your total wall area. A standard 3×7 foot door removes approximately 21 square feet, and a 3×4 foot window removes about 12 square feet. However, if you're painting trim a different color, add that footage back separately and calculate it with the appropriate coverage rate. As a rule of thumb, subtract 15–20 square feet per door and 10 square feet per window from your total wall calculation.",
    },
    {
      question: "What coverage rate should I use for textured walls or ceilings?",
      answer: "Textured surfaces, including popcorn ceilings, textured drywall, and stucco, reduce coverage to 250–300 square feet per gallon compared to smooth surfaces. Heavy textures like orange peel or knockdown texture are particularly absorbent and require more paint for even coverage. Always test your paint on a sample area of textured surface first, then adjust your total calculation upward by 20–30% to ensure complete, even coverage.",
    },
    {
      question: "How many coats of paint do I need?",
      answer: "Most interior painting projects require two coats for even color and durability, though high-quality paints with better opacity may cover adequately in one coat on previously painted surfaces. New drywall, dark colors, or dramatic color changes typically require two coats, while covering stains or existing dark colors may require three coats. Primer is often needed as a first coat on bare drywall, fresh repairs, or when changing from dark to light colors, which adds another layer to your paint calculation.",
    },
    {
      question: "Should I buy paint in 1-gallon or 5-gallon containers?",
      answer: "For projects requiring 2–3 gallons, buying a 5-gallon bucket offers better value (typically $35–45 per gallon vs. $8–12 per single gallon) and ensures consistent color batching. For smaller projects needing &lt;2 gallons, 1-gallon containers reduce waste and storage concerns. Consider the shelf life of leftover paint (1–2 years when sealed properly) and your likelihood of future touch-ups when deciding container size for your project.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are painting a living room wall that is 20 feet long and 9 feet high, with two windows totaling 30 square feet. You want to use a paint that covers 350 square feet per gallon and include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Calculate wall area: 20 ft (length) × 9 ft (height) = 180 sq ft. Deduct windows: 180 - 30 = 150 sq ft paintable area.",
      },
      {
        label: "2. Waste",
        explanation: "Add 10% waste margin: 150 sq ft × 10% = 15 sq ft extra. Total area = 165 sq ft.",
      },
      {
        label: "3. Calculate Gallons",
        explanation: "Divide total area by coverage: 165 ÷ 350 = 0.471 gallons. Round up to 0.5 gallons for ordering.",
      },
    ],
    result: "Final Order: 0.5 Gallons of paint",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Gallons Needed = ((Wall Length × Wall Height) - Window Area) ÷ Coverage per Gallon × (1 + Waste Percentage)",
    variables: [
      { symbol: "Wall Length", description: "Length of the wall surface" },
      { symbol: "Wall Height", description: "Height of the wall surface" },
      { symbol: "Window Area", description: "Total area of windows and doors to deduct" },
      { symbol: "Coverage per Gallon", description: "Paint coverage area per gallon (sq ft)" },
      { symbol: "Waste Percentage", description: "Additional paint percentage for waste (decimal form)" },
    ],
  };

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Ruler className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (meters)</SelectItem>
            <SelectItem value="imperial">Imperial (feet)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Wall Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={`Enter length in ${inputs.unit === "metric" ? "meters" : "feet"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Wall Height ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder={`Enter height in ${inputs.unit === "metric" ? "meters" : "feet"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Total Window Area ({inputs.unit === "metric" ? "m²" : "sq ft"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.windows}
            onChange={(e) => handleInputChange("windows", e.target.value)}
            placeholder={`Enter window area in ${inputs.unit === "metric" ? "m²" : "sq ft"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Coverage per Gallon ({inputs.unit === "metric" ? "m²" : "sq ft"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.coveragePerGallon}
            onChange={(e) => handleInputChange("coveragePerGallon", e.target.value)}
            placeholder={`Typical: ${inputs.unit === "metric" ? "33" : "350"}`}
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Waste Margin (%)</Label>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between">
              <span>{inputs.waste}%</span>
            </div>
            <Slider
              value={[parseInt(inputs.waste)]}
              min={0}
              max={25}
              step={5}
              onValueChange={(v) => handleInputChange("waste", v[0].toString())}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Price per Gallon ($)</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              type="number"
              min={0}
              step="any"
              value={inputs.pricePerGallon}
              onChange={(e) => handleInputChange("pricePerGallon", e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Materials Needed</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.mainQty}</div>
            <div className="text-xl font-bold mt-2">Est. Cost: {results.cost}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="text-xs text-slate-400 mt-1">{results.wasteInfo}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Paint Coverage & Gallons Needed Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Paint Coverage & Gallons Needed Calculator helps you determine exactly how much paint to purchase for your interior or exterior project, eliminating guesswork and reducing waste. By inputting your room dimensions, surface type, and desired number of coats, this calculator applies industry-standard coverage rates (typically 350–400 sq ft/gallon for interior paint) to provide an accurate gallon recommendation. Knowing your paint requirement before shopping saves money, prevents leftover paint, and ensures you have enough for complete, even coverage across all surfaces.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator effectively, gather measurements of each wall you plan to paint in linear feet (length × height), note the total square footage or let the calculator compute it for you, and select your surface type and paint quality. The calculator accounts for different coverage rates based on texture (smooth drywall covers more area than textured surfaces), paint type (premium paints have higher hide and coverage), and the number of coats required. Include any special conditions like primer needs, stain-blocking requirements, or previous color changes that may affect total paint volume.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results will show you the gallons needed for one coat, multiple coats, and a recommended purchase amount that includes a 10–15% buffer for waste, spills, and touch-ups. If your calculator shows you need 3.2 gallons, purchase 3.5 or 4 gallons to account for application loss and ensure color consistency. Review the recommended container size (1-gallon vs. 5-gallon bucket) based on project scope, and verify that your selected paint brand matches the coverage rate assumptions; premium or high-hide paints may require slightly less volume than budget brands.</p>
        </div>
      </section>

      {/* TABLE: Paint Coverage by Surface Type and Quality */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Paint Coverage by Surface Type and Quality</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Coverage rates vary significantly based on surface texture and paint quality; use these benchmarks to refine your calculator inputs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Surface Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Paint Quality</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Coverage (sq ft/gallon)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Smooth drywall</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard latex</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">375–400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Most common interior application</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Smooth drywall</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Premium/hi-hide</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400–425</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Better pigmentation reduces coats needed</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Textured drywall</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard latex</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300–325</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Orange peel and light textures</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Popcorn/heavy texture</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard latex</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250–275</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Requires extra paint due to absorption</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wood siding (exterior)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exterior latex</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300–350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rough surface reduces spread rate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Stucco (exterior)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exterior latex</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250–300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very porous; may need primer</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Metal/glossy surfaces</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Bonding primer first</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350–375</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Primer improves adhesion significantly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Previously painted walls</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard latex</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400–450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sealed surface increases coverage</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bare wood (interior)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Stain or paint</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150–200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very absorbent; often requires sealer</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Coverage rates assume standard roller application at 1/16-inch wet film thickness. Actual coverage may vary by brand, environmental conditions, and application skill.</p>
      </section>

      {/* TABLE: Paint Requirements for Common Room Sizes */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Paint Requirements for Common Room Sizes</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These calculations assume 8-foot ceilings, standard drywall texture, and two coats of interior latex paint with standard coverage.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Room Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Wall Area (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gallons for 1 Coat</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gallons for 2 Coats</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Purchase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10×10 bedroom</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 gallons</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10×12 bedroom</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">440</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5 gallons</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12×14 living room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">624</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5 gallons</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12×20 family room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">896</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 gallons</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10×8 bathroom</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">288</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5–2 gallons</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9×9 powder room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">216</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 gallon</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Entire 2BR apartment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,400–1,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.75–4.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5–8.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 gallons</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Single ceiling (10×12)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 gallon</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Recommendations include 10% waste buffer. Subtract ~15 sq ft per door and ~10 sq ft per window. Textured surfaces require 20–30% additional paint.</p>
      </section>

      {/* TABLE: Paint Primer and Specialty Scenarios */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Paint Primer and Specialty Scenarios</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Certain conditions require primer, which affects total gallons needed; use this guide to determine when primer is essential.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Scenario</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Primer Needed?</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Coverage (sq ft/gal)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">New drywall (bare)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300–350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Blocks stains and improves topcoat adhesion</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Water stains or smoke damage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250–300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Primer seals tannins and prevents bleed-through</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dark color to light color</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes (tinted)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350–375</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduces coats of topcoat needed</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Light to dark color</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">375–400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Existing paint provides adequate base</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Glossy/semi-gloss surface</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes (bonding primer)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300–350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Improves adhesion without sanding</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wood paneling</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250–300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Seals knots and grain, prevents bleed-through</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Previously painted interior</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">375–400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Unless staining or major color change</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Exterior raw wood/siding</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250–300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Prevents moisture penetration and warping</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bathroom/high-moisture areas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No (use mold-resistant paint)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350–375</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Use moisture-resistant paint instead of primer</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Primer coverage is typically 15–20% lower than topcoat paint due to higher absorption on unsealed surfaces. Primer cost is usually 20–40% less than premium paint.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always measure twice and double-check your square footage calculations before using the calculator — a 10% error in measurements becomes a 10% error in paint volume, leading to either purchasing too much or running short mid-project.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test your paint color on a large sample area (at least 2×3 feet) and view it at different times of day, as artificial light, natural light, and adjacent colors significantly affect how paint appears on your walls.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Add an extra 15–20% to your calculated gallons for textured surfaces, water-damaged areas, or dark color changes, as these scenarios consume more paint than standard calculations assume.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Buy all paint from the same batch or batch code to ensure perfect color consistency, especially for large rooms or multi-wall projects; different batches can show slight color variations even in the same paint line.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store leftover paint properly in sealed containers in a cool, dry place to extend shelf life to 1–2 years, allowing you to use it for future touch-ups without purchasing new gallons.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider renting or buying a high-quality roller and extension pole rather than relying on cheap brushes; better tools improve coverage uniformity and can reduce paint consumption by 5–10% through more efficient application.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to subtract doors and windows</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many homeowners calculate wall area without subtracting door and window openings, leading to 15–25% paint overages. A standard door removes ~21 sq ft and a large window removes ~12 sq ft, so ignoring these can result in buying 1–2 unnecessary gallons for a typical room.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using the same coverage rate for all surface types</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Textured ceilings and walls reduce coverage to 250–300 sq ft/gallon compared to smooth surfaces at 375–400 sq ft/gallon. Applying standard coverage assumptions to textured surfaces results in underbidding paint quantity and running short mid-project.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for primer in total paint calculation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Projects requiring primer (new drywall, water stains, dark-to-light color changes) need an additional 1–2 gallons of primer, which many calculators overlook. Primer typically covers 300–350 sq ft/gallon and shouldn't be combined with topcoat estimates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming one coat is sufficient for most projects</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Interior projects typically require two coats for even color and durability; assuming one coat causes severe underbidding of paint volume. Dramatic color changes, primer applications, and stain coverage may even require three coats, doubling initial estimates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring paint quality and coverage differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Premium paints with higher opacity cover 400–425 sq ft/gallon while budget paints cover only 350–375 sq ft/gallon. Failing to adjust the calculator for paint quality leads to either overbuying cheap paint or underbuying premium paint.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate paint coverage for my room?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To calculate paint coverage, measure the total square footage of the walls you plan to paint by multiplying height by width for each wall, then add them together. Most interior paints cover between 350–400 square feet per gallon, though this varies by paint quality and surface texture. Divide your total square footage by the coverage rate (typically 375 sq ft/gallon for standard latex paint) to determine gallons needed. Don't forget to account for a second coat, which typically requires 50% more paint than the first coat.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect paint coverage rates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Paint coverage is affected by surface texture, paint quality, application method, and environmental conditions. Rough or porous surfaces like drywall or stucco reduce coverage to 300–350 sq ft/gallon, while smooth surfaces achieve 400–450 sq ft/gallon. Higher-quality paints with better pigmentation cover more area per gallon than budget brands. Application with a roller typically achieves better coverage than brush application, and humidity and temperature can impact drying and adhesion.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do I need to add extra paint to my calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">It's wise to add 10–15% extra to your calculated gallons to account for spills, waste, uneven surfaces, and touch-ups after paint dries. Paint often appears darker when wet and lighter when dry, so additional paint helps ensure color consistency for future repairs. Having leftover paint also allows for matching touch-ups on walls over time without worrying about slight color variations from new batches.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much paint do I need for a 10x12 bedroom?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 10x12 bedroom with 8-foot ceilings has approximately 440 square feet of wall space (2 walls at 10×8 = 80 sq ft each, and 2 walls at 12×8 = 96 sq ft each). At a standard coverage rate of 375 sq ft/gallon, you need approximately 1.2 gallons for one coat. For two coats, plan for 2.4 gallons, or round up to 2.5 gallons to account for waste and ensure adequate coverage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between interior and exterior paint coverage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Exterior paint typically covers 300–350 square feet per gallon due to more porous surfaces like wood siding and stucco, while interior paint covers 350–400 sq ft/gallon on standard drywall. Exterior paints are formulated to resist weather, UV rays, and moisture, making them thicker and less spreadable than interior paints. Exterior projects often require two coats due to surface porosity and durability requirements, significantly increasing total gallons needed compared to interior jobs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for doors, windows, and trim in my calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Subtract the square footage of doors and large windows from your total wall area. A standard 3×7 foot door removes approximately 21 square feet, and a 3×4 foot window removes about 12 square feet. However, if you're painting trim a different color, add that footage back separately and calculate it with the appropriate coverage rate. As a rule of thumb, subtract 15–20 square feet per door and 10 square feet per window from your total wall calculation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What coverage rate should I use for textured walls or ceilings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Textured surfaces, including popcorn ceilings, textured drywall, and stucco, reduce coverage to 250–300 square feet per gallon compared to smooth surfaces. Heavy textures like orange peel or knockdown texture are particularly absorbent and require more paint for even coverage. Always test your paint on a sample area of textured surface first, then adjust your total calculation upward by 20–30% to ensure complete, even coverage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many coats of paint do I need?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most interior painting projects require two coats for even color and durability, though high-quality paints with better opacity may cover adequately in one coat on previously painted surfaces. New drywall, dark colors, or dramatic color changes typically require two coats, while covering stains or existing dark colors may require three coats. Primer is often needed as a first coat on bare drywall, fresh repairs, or when changing from dark to light colors, which adds another layer to your paint calculation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I buy paint in 1-gallon or 5-gallon containers?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For projects requiring 2–3 gallons, buying a 5-gallon bucket offers better value (typically $35–45 per gallon vs. $8–12 per single gallon) and ensures consistent color batching. For smaller projects needing &lt;2 gallons, 1-gallon containers reduce waste and storage concerns. Consider the shelf life of leftover paint (1–2 years when sealed properly) and your likelihood of future touch-ups when deciding container size for your project.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.epa.gov/lead/renovation-repair-and-painting-program" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA Lead-Based Paint Renovation, Repair, and Painting Program Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official EPA guidance on safe paint practices, including coverage standards and lead-safe work practices for interior and exterior painting projects.</p>
          </li>
          <li>
            <a href="https://www.thespruce.com/how-much-paint-do-you-need-4586626" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Spruce Home Improvement Paint Coverage Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource covering paint coverage rates, room-by-room calculations, and best practices for estimating paint requirements.</p>
          </li>
          <li>
            <a href="https://www.nist.gov/laboratories/tools-instruments" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NIST Building and Fire Research Laboratory: Paint and Coatings Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical standards and benchmarks for paint coverage, adhesion, and performance metrics used in construction and home improvement projects.</p>
          </li>
          <li>
            <a href="https://www.sherwin-williams.com/homeowners" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Sherwin-Williams Paint Coverage and Application Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry-leading paint manufacturer's guidelines for coverage rates, surface preparation, and application techniques specific to various paint products and conditions.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Paint Coverage & Gallons Needed Calculator"
      description="The ultimate professional guide and calculator for Paint Coverage & Gallons Needed Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "guide", label: "Guide" },
        { id: "tips", label: "Pro Tips" },
        { id: "formula", label: "Formula" },
        { id: "example", label: "Example" },
        { id: "mistakes", label: "Mistakes" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References & Resources" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}