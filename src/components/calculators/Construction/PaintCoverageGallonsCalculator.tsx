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
      question: "What is the Paint Coverage & Gallons Needed Calculator?",
      answer:
        "This calculator helps professionals and DIYers estimate the amount of paint required to cover a wall surface accurately. By inputting wall dimensions and deducting window areas, it calculates the gallons of paint needed, factoring in coverage rates and waste margins to avoid under or over-ordering.",
    },
    {
      question: "Why is precision important when calculating paint coverage?",
      answer:
        "Precision ensures that you purchase the right amount of paint, reducing waste and saving costs. Overestimating leads to excess paint and higher expenses, while underestimating can cause project delays and inconsistent finishes due to color mismatches from different batches.",
    },
    {
      question: "How do different paint materials affect coverage?",
      answer:
        "Paint types vary in coverage due to viscosity, pigmentation, and application method. For example, high-quality latex paints typically cover around 350 sq ft per gallon, while textured or specialty paints may cover less. Adjusting coverage rates in the calculator helps tailor estimates to specific materials.",
    },
    {
      question: "How do I account for windows and doors in my calculations?",
      answer:
        "Windows and doors reduce the paintable surface area. Accurately measuring and deducting their combined area from the total wall surface ensures you don’t overestimate paint needs. This calculator allows you to input total window area to subtract from the wall area.",
    },
    {
      question: "What is the recommended waste margin for paint projects?",
      answer:
        "A waste margin of 10% is commonly recommended to cover paint loss due to spillage, surface texture, and multiple coats. However, this can be adjusted based on project complexity, surface porosity, and experience. The calculator includes a slider to customize this margin.",
    },
    {
      question: "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, the calculator supports both metric (meters) and imperial (feet) units. It automatically converts metric inputs to square feet internally to maintain consistent coverage calculations based on gallons, which are typically imperial units.",
    },
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
      {/* 4. GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Professional Guide: Paint Coverage & Gallons Needed Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The Paint Coverage & Gallons Needed Calculator is an essential tool for contractors, painters, and DIY enthusiasts aiming to estimate the exact amount of paint required for a given wall surface. By inputting the wall's length and height, and deducting the area of windows or doors, this calculator provides an accurate estimate of gallons needed, helping to optimize material purchases and reduce waste.
          </p>
          <p>
            Precision in paint estimation is crucial to avoid costly overruns or project delays. Overestimating paint leads to unnecessary expenses and leftover materials, while underestimating can cause multiple trips to suppliers and inconsistent finishes due to batch variations. This calculator incorporates a waste margin to account for spillage, surface texture, and multiple coats, ensuring a realistic estimate.
          </p>
          <p>
            Different paint materials have varying coverage rates depending on their formulation and finish. For example, standard latex paints typically cover around 350 square feet per gallon in imperial units, while some specialty or textured paints may cover less. Users can adjust the coverage rate in the calculator to match their specific paint type for more accurate results.
          </p>
          <p>
            This tool supports both metric and imperial units, automatically converting measurements to maintain consistency in calculations. Deducting window and door areas ensures that only paintable surfaces are considered, further refining the estimate. Whether you are painting a single wall or an entire room, this calculator streamlines the planning process and helps you order the right amount of paint every time.
          </p>
        </div>
      </section>

      {/* 5. TIPS / DID YOU KNOW */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Pro Tips & Curiosities
        </h3>
        <ul className="space-y-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>Tip:</strong> Always measure twice and include all surfaces to be painted, including trims and ceilings if applicable, to avoid surprises.
          </li>
          <li>
            <strong>Did You Know?</strong> Paint coverage can vary significantly based on surface texture and color. Rough or porous surfaces absorb more paint, requiring additional coats.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Use a 10% waste margin as a baseline, but increase it for textured walls or when using spray equipment to account for overspray.
          </li>
          <li>
            <strong>Tip:</strong> When painting multiple walls with different sizes, calculate each separately and sum the gallons needed for the most accurate estimate.
          </li>
        </ul>
      </section>

      {/* 6. MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" />
          Common Mistakes to Avoid
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Ignoring Window and Door Areas:</strong> Failing to deduct these areas leads to overestimating paint requirements, resulting in wasted materials and higher costs.
          </p>
          <p>
            <strong>2. Using Incorrect Coverage Rates:</strong> Not adjusting coverage rates for different paint types or surface textures can cause inaccurate estimates. Always verify the paint manufacturer's coverage specifications.
          </p>
          <p>
            <strong>3. Skipping Waste Margin:</strong> Not including a waste margin can result in running out of paint mid-project, causing delays and inconsistent finishes.
          </p>
          <p>
            <strong>4. Mixing Units:</strong> Mixing metric and imperial units without proper conversion can lead to significant miscalculations. Use the unit selector consistently.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">

          <li>
            <a href="https://www.thisoldhouse.com/search?q=Paint%20Coverage" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Paint Coverage - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Paint Coverage from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Paint%20Coverage" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Paint Coverage - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Paint Coverage, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.energy.gov/search/site?keywords=Paint%20Coverage" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Paint Coverage - Energy.gov
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Official Department of Energy guidelines for energy efficiency and Paint Coverage to save money and improve home comfort.
            </p>
          </li>
          <li>
            <a href="https://www.ashrae.org/search?q=Paint%20Coverage" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Paint Coverage - ASHRAE
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Technical standards and guidelines for HVAC and building systems related to Paint Coverage.
            </p>
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