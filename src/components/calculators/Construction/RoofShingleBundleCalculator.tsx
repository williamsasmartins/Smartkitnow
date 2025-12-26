import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function RoofShingleBundleCalculator() {
  /**
   * Roof shingle bundles typically cover about 33.3 sq ft (1/3 of a roofing square).
   * 1 roofing square = 100 sq ft.
   * Waste factor is added as a percentage to cover cutting and overlaps.
   * Material sizes: standard bundles cover ~33.3 sq ft, large bundles cover ~40 sq ft.
   */

  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "", // roof length
    width: "", // roof width
    waste: "10", // waste percentage
    price: "", // price per bundle
    materialSize: "standard", // standard or large bundle coverage
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion constants
  const SQFT_PER_BUNDLE_STANDARD = 33.3; // sq ft per standard bundle
  const SQFT_PER_BUNDLE_LARGE = 40; // sq ft per large bundle

  const results = useMemo(() => {
    // Parse inputs
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const wasteNum = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    if (
      isNaN(lengthNum) ||
      isNaN(widthNum) ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      isNaN(wasteNum) ||
      wasteNum < 0 ||
      wasteNum > 25
    ) {
      return {
        mainQty: "0 Bundles",
        cost: "$0.00",
        details: "Please enter valid positive dimensions and waste % (0-25).",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Calculate roof area in square feet
    let areaSqFt = 0;
    if (inputs.unit === "metric") {
      // inputs in meters, convert to feet (1 m = 3.28084 ft)
      const lengthFt = lengthNum * 3.28084;
      const widthFt = widthNum * 3.28084;
      areaSqFt = lengthFt * widthFt;
    } else {
      // imperial inputs already in feet
      areaSqFt = lengthNum * widthNum;
    }

    // Add waste margin
    const totalAreaWithWaste = areaSqFt * (1 + wasteNum / 100);

    // Determine bundle coverage
    const bundleCoverage =
      inputs.materialSize === "large"
        ? SQFT_PER_BUNDLE_LARGE
        : SQFT_PER_BUNDLE_STANDARD;

    // Calculate bundles needed, round up to whole bundles
    const bundlesNeeded = Math.ceil(totalAreaWithWaste / bundleCoverage);

    // Calculate cost if price given
    const totalCost =
      !isNaN(priceNum) && priceNum > 0
        ? `$${(bundlesNeeded * priceNum).toFixed(2)}`
        : "N/A";

    return {
      mainQty: `${bundlesNeeded} Bundle${bundlesNeeded !== 1 ? "s" : ""}`,
      cost: totalCost,
      details: `Roof area: ${areaSqFt.toFixed(
        2
      )} sq ft + ${wasteNum}% waste = ${totalAreaWithWaste.toFixed(
        2
      )} sq ft total`,
      wasteInfo: `+${wasteNum}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is a roofing square and how does it relate to bundles?",
      answer:
        "A roofing square is a unit of measure equal to 100 square feet of roof area. Roofing shingles are sold in bundles, and typically three bundles cover one roofing square. Knowing this helps you estimate how many bundles you need based on your roof size.",
    },
    {
      question:
        "Why is it important to include a waste factor when ordering shingles?",
      answer:
        "Waste accounts for shingles cutoffs, overlaps, and potential mistakes during installation. Including a waste factor (usually 10-15%) ensures you have enough material to complete the job without delays or extra trips to the supplier.",
    },
    {
      question: "How do I convert metric measurements to imperial for this calculator?",
      answer:
        "If you measure your roof in meters, this calculator automatically converts those dimensions to feet internally, since roofing materials are typically sold based on square feet. Simply select 'metric' and enter your length and width in meters.",
    },
    {
      question: "What are the differences between standard and large bundle sizes?",
      answer:
        "Standard bundles usually cover about 33.3 square feet, while large bundles cover around 40 square feet. Choosing the correct bundle size affects your quantity calculation and cost estimation.",
    },
    {
      question:
        "Can this calculator help me estimate the total cost of shingles for my roof?",
      answer:
        "Yes, by entering the price per bundle, the calculator multiplies the number of bundles needed by the unit price to provide an estimated total cost, helping you budget your roofing project accurately.",
    },
    {
      question:
        "How accurate is this calculator for complex roof shapes or multiple slopes?",
      answer:
        "This calculator assumes a simple rectangular roof area. For complex roofs with multiple slopes, dormers, or valleys, you should calculate the area of each section separately and sum them before using the calculator for best accuracy.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you have a rectangular roof measuring 12 meters in length and 8 meters in width. You want to order standard size bundles with a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Roof area = 12 m × 8 m = 96 m². Convert to square feet: 96 × 10.7639 = 1033.34 sq ft.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste: 1033.34 × 1.10 = 1136.67 sq ft total coverage needed.",
      },
      {
        label: "3. Order",
        explanation:
          "Each standard bundle covers 33.3 sq ft. Bundles needed = 1136.67 ÷ 33.3 ≈ 34.15, round up to 35 bundles.",
      },
    ],
    result: "Final Order: 35 Standard Bundles",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Bundles Needed = ⌈ (Roof Area × (1 + Waste %)) ÷ Bundle Coverage ⌉",
    variables: [
      { symbol: "Roof Area", description: "Length × Width (in square feet)" },
      {
        symbol: "Waste %",
        description:
          "Percentage added to cover cutting, overlaps, and mistakes",
      },
      {
        symbol: "Bundle Coverage",
        description:
          "Area covered by one bundle of shingles (typically 33.3 or 40 sq ft)",
      },
      {
        symbol: "⌈ ⌉",
        description: "Ceiling function to round up to the nearest whole bundle",
      },
    ],
  };

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
        >
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

      {/* DYNAMIC INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="Enter roof length"
          />
        </div>
        <div className="space-y-2">
          <Label>Width ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder="Enter roof width"
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Bundle Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (33.3 sq ft)</SelectItem>
              <SelectItem value="large">Large (40 sq ft)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Bundle</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              type="number"
              min="0"
              step="0.01"
              value={inputs.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between">
          <Label>Waste Margin</Label>
          <span className="font-bold text-blue-600">{inputs.waste}%</span>
        </div>
        <Slider
          value={[parseInt(inputs.waste) || 10]}
          min={0}
          max={25}
          step={5}
          onValueChange={(v) => handleInputChange("waste", v[0].toString())}
        />
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Materials Needed
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.mainQty}
            </div>
            <div className="text-xl font-bold mt-2">Est. Cost: {results.cost}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Roof
          Shingle & Bundle Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The Roof Shingle & Bundle Calculator is a specialized tool designed
            to help contractors, estimators, and DIY homeowners accurately
            determine the number of shingle bundles required to cover a roof
            area. By inputting the roof dimensions and selecting the appropriate
            bundle size, users can quickly calculate material needs and estimate
            costs.
          </p>
          <p>
            Precision in these calculations is crucial. Ordering too few bundles
            can cause project delays and additional trips to suppliers, while
            ordering too many results in unnecessary expenses and leftover
            materials. This calculator incorporates a waste margin to account for
            cutting, overlaps, and potential errors during installation.
          </p>
          <p>
            Roofing shingles come in different bundle sizes, typically standard
            bundles covering about 33.3 square feet and large bundles covering
            around 40 square feet. Selecting the correct bundle size ensures your
            quantity estimates align with the actual product coverage.
          </p>
          <p>
            This tool supports both metric and imperial units, automatically
            converting metric inputs to square feet, the standard measurement for
            roofing materials. It also allows users to input price per bundle to
            estimate total material costs, aiding in budgeting and project
            planning.
          </p>
        </div>
      </section>

      {/* 5. TIPS / DID YOU KNOW */}
      <section
        id="tips"
        className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <Lightbulb className="w-5 h-5 text-yellow-500" /> Pro Tips & Curiosities
        </h3>
        <ul className="space-y-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>Tip:</strong> Always measure your roof multiple times and
            include all slopes and dormers separately to improve accuracy.
          </li>
          <li>
            <strong>Did You Know?</strong> Roofing bundles are designed to cover
            about 1/3 of a roofing square (100 sq ft), so three bundles make one
            square.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering an extra bundle or two
            beyond the calculated amount can save time and money if repairs or
            mistakes occur.
          </li>
          <li>
            <strong>Tip:</strong> When using metric measurements, this calculator
            converts to imperial internally, as roofing materials are sold by
            square feet.
          </li>
        </ul>
      </section>

      {/* 6. MISTAKES */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes to Avoid
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Underestimating Waste:</strong> Failing to include a waste
            margin often leads to running out of shingles mid-project, causing
            delays and extra costs.
          </p>
          <p>
            <strong>2. Ignoring Roof Complexity:</strong> Using this calculator
            for complex roofs without breaking down the area into sections can
            cause inaccurate estimates.
          </p>
          <p>
            <strong>3. Mixing Units:</strong> Inputting dimensions in one unit but
            selecting another can cause incorrect calculations. Always double
            check your unit selection.
          </p>
          <p>
            <strong>4. Not Rounding Up:</strong> Always round up the number of
            bundles to the next whole number; partial bundles cannot be ordered.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0"
            >
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                {faq.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Roof Shingle & Bundle Calculator"
      description="The ultimate professional guide and calculator for Roof Shingle & Bundle Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula} // 8. PASSING FORMULA
      example={example} // 9. PASSING EXAMPLE
      relatedCalculators={[]}
      onThisPage={[
        // 10. FULL NAVIGATION
        { id: "guide", label: "Guide" },
        { id: "tips", label: "Pro Tips" },
        { id: "formula", label: "Formula" }, // Layout handles id="formula" automatically for the prop
        { id: "example", label: "Example" }, // Layout handles id="example" automatically for the prop
        { id: "mistakes", label: "Mistakes" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}