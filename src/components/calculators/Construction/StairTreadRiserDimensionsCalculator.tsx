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

export default function StairTreadRiserDimensionsCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters, cm) or imperial (feet, inches)
    treadLength: "", // horizontal run of tread (depth)
    treadWidth: "", // width of the stair (side to side)
    riserHeight: "", // vertical height of riser
    waste: "10", // waste percentage
    price: "", // price per unit material
    materialSize: "standard", // standard or large size material units
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion helpers
  const toMeters = (val: number, unit: string) => {
    if (unit === "metric") return val; // assume meters input
    // imperial assumed feet, convert feet to meters
    return val * 0.3048;
  };

  const toFeet = (val: number, unit: string) => {
    if (unit === "imperial") return val; // feet input
    // metric assumed meters, convert meters to feet
    return val / 0.3048;
  };

  // Material unit sizes (in meters) for calculation
  // Standard size: 1.0m x 0.3m (typical stair tread board)
  // Large size: 1.2m x 0.4m
  const materialSizes = {
    standard: { length: 1.0, width: 0.3 },
    large: { length: 1.2, width: 0.4 },
  };

  const results = useMemo(() => {
    // Parse inputs
    const treadLengthNum = parseFloat(inputs.treadLength);
    const treadWidthNum = parseFloat(inputs.treadWidth);
    const riserHeightNum = parseFloat(inputs.riserHeight);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);
    const unit = inputs.unit;
    const matSize = inputs.materialSize;

    if (
      isNaN(treadLengthNum) ||
      isNaN(treadWidthNum) ||
      isNaN(riserHeightNum) ||
      treadLengthNum <= 0 ||
      treadWidthNum <= 0 ||
      riserHeightNum <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Convert all dimensions to meters for calculation
    const treadLengthM = unit === "metric" ? treadLengthNum : treadLengthNum * 0.3048;
    const treadWidthM = unit === "metric" ? treadWidthNum : treadWidthNum * 0.3048;
    const riserHeightM = unit === "metric" ? riserHeightNum : riserHeightNum * 0.3048;

    // Calculate area of one tread (top horizontal surface)
    const treadArea = treadLengthM * treadWidthM; // m²

    // Calculate area of one riser (vertical face)
    const riserArea = riserHeightM * treadWidthM; // m²

    // Total material area per step (tread + riser)
    const stepArea = treadArea + riserArea; // m²

    // Material unit size area
    const matLength = materialSizes[matSize].length;
    const matWidth = materialSizes[matSize].width;
    const matArea = matLength * matWidth; // m² per unit

    // Calculate number of material units needed (without waste)
    const rawUnits = stepArea / matArea;

    // Add waste margin
    const totalUnits = rawUnits * (1 + wastePercent / 100);

    // Round up to nearest whole unit
    const roundedUnits = Math.ceil(totalUnits);

    // Calculate cost if price provided
    const totalCost = pricePerUnit && !isNaN(pricePerUnit) ? roundedUnits * pricePerUnit : 0;

    // Format results
    const mainQty = `${roundedUnits} Unit${roundedUnits !== 1 ? "s" : ""}`;
    const cost = pricePerUnit ? `$${totalCost.toFixed(2)}` : "Price not set";
    const details = `Raw units: ${rawUnits.toFixed(2)} (Area per step: ${stepArea.toFixed(
      3
    )} m², Material unit area: ${matArea.toFixed(3)} m²)`;
    const wasteInfo = `+${wastePercent}% Waste included`;

    return {
      mainQty,
      cost,
      details,
      wasteInfo,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What are the standard dimensions for stair treads and risers?",
      answer:
        "Standard stair treads typically have a depth (run) between 10 to 11 inches (25 to 28 cm) and risers have a height between 7 to 7.75 inches (18 to 20 cm). These dimensions ensure comfortable and safe stair use. However, local building codes may vary, so always verify requirements before construction.",
    },
    {
      question: "Why is it important to include a waste margin in material calculations?",
      answer:
        "Including a waste margin accounts for cutting errors, material defects, and unexpected adjustments during installation. Typically, a 10% waste factor is recommended to avoid shortages and delays. Without this buffer, you risk running out of materials mid-project, causing costly downtime.",
    },
    {
      question: "How does material size affect the quantity needed for stair treads and risers?",
      answer:
        "Material size directly impacts how many units are required. Larger material sizes cover more area per unit, reducing the total number of units needed. Choosing the right material size can optimize costs and reduce waste, but availability and handling considerations should also be factored in.",
    },
    {
      question: "Can I use this calculator for both metric and imperial measurements?",
      answer:
        "Yes, this calculator supports both metric (meters) and imperial (feet) units. Simply select your preferred unit system, and input your dimensions accordingly. The calculator converts all values internally to ensure accurate calculations regardless of the unit system.",
    },
    {
      question: "How do I estimate the cost of materials using this calculator?",
      answer:
        "Enter the price per unit of your chosen material in the 'Price per Unit' field. The calculator multiplies the total number of units needed (including waste) by this price to provide an estimated total cost. This helps in budgeting and procurement planning.",
    },
    {
      question: "What types of materials are typically used for stair treads and risers?",
      answer:
        "Common materials include hardwoods like oak or maple, engineered wood, composite decking, concrete, and metal. Each material has different durability, aesthetics, and cost profiles. Selecting the right material depends on the stair location, usage, and design preferences.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a staircase with a tread length of 0.9 meters, tread width of 1.0 meter, and riser height of 0.18 meters. You want to use standard size material boards (1.0m x 0.3m) and include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate the tread area: 0.9m × 1.0m = 0.9 m². Calculate the riser area: 0.18m × 1.0m = 0.18 m². Total area per step = 0.9 + 0.18 = 1.08 m².",
      },
      {
        label: "2. Waste",
        explanation:
          "Material unit area = 1.0m × 0.3m = 0.3 m². Raw units needed = 1.08 / 0.3 = 3.6 units. Add 10% waste: 3.6 × 1.10 = 3.96 units.",
      },
      {
        label: "3. Order",
        explanation:
          "Round up to nearest whole unit: 4 units. If price per unit is $25, total cost = 4 × $25 = $100.",
      },
    ],
    result: "Final Order: 4 Units, Estimated Cost: $100",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Material Units = ⌈ ((Tread Length × Tread Width) + (Riser Height × Tread Width)) / Material Unit Area × (1 + Waste %) ) ⌉",
    variables: [
      { symbol: "Tread Length", description: "Horizontal depth of the stair tread" },
      { symbol: "Tread Width", description: "Width of the stair tread (side to side)" },
      { symbol: "Riser Height", description: "Vertical height of the riser" },
      { symbol: "Material Unit Area", description: "Surface area covered by one material unit" },
      { symbol: "Waste %", description: "Additional percentage to cover waste and cuts" },
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

      {/* DYNAMIC INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Tread Length ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.treadLength}
            onChange={(e) => handleInputChange("treadLength", e.target.value)}
            placeholder="e.g. 0.9"
          />
        </div>
        <div className="space-y-2">
          <Label>Tread Width ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.treadWidth}
            onChange={(e) => handleInputChange("treadWidth", e.target.value)}
            placeholder="e.g. 1.0"
          />
        </div>
        <div className="space-y-2">
          <Label>Riser Height ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.riserHeight}
            onChange={(e) => handleInputChange("riserHeight", e.target.value)}
            placeholder="e.g. 0.18"
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Material Size</Label>
          <Select value={inputs.materialSize} onValueChange={(v) => handleInputChange("materialSize", v)}>
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (1.0m × 0.3m)</SelectItem>
              <SelectItem value="large">Large (1.2m × 0.4m)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Unit</Label>
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
          value={[parseInt(inputs.waste)]}
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
            <span className="text-sm font-semibold text-slate-500 uppercase">Materials Needed</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.mainQty}</div>
            <div className="text-xl font-bold mt-2">Est. Cost: {results.cost}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="text-xs text-slate-400 mt-1 italic">{results.wasteInfo}</p>
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Stair Tread & Riser Dimensions Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The Stair Tread & Riser Dimensions Calculator is a specialized tool designed to help contractors, builders, and DIY enthusiasts accurately estimate the amount of material needed for stair construction. By inputting the key dimensions of the stair tread and riser, this calculator determines the required material units, factoring in waste and material sizes.
          </p>
          <p>
            Precision in stair dimensions is crucial not only for aesthetic appeal but also for safety and compliance with building codes. Incorrect tread depths or riser heights can lead to uncomfortable or hazardous stairs. This calculator ensures that you order the right amount of material, minimizing waste and cost overruns.
          </p>
          <p>
            Materials commonly used for stair treads and risers include hardwoods like oak or maple, engineered wood, composite decking, concrete, and metal. Each material comes in standard sizes, which this calculator uses to determine how many units are necessary based on your project’s dimensions.
          </p>
          <p>
            By selecting the appropriate unit system (metric or imperial), inputting your stair dimensions, and choosing your material size, you can quickly get an accurate estimate of material requirements and costs. This helps streamline project planning and procurement.
          </p>
        </div>
      </section>

      {/* 5. TIPS / DID YOU KNOW */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <Lightbulb className="w-5 h-5 text-yellow-500" /> Pro Tips & Curiosities
        </h3>
        <ul className="space-y-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>Tip:</strong> Always double-check your measurements on-site before ordering materials. Small errors in tread depth or riser height can significantly affect material needs.
          </li>
          <li>
            <strong>Did You Know?</strong> The ideal stair tread depth and riser height ratio is often referred to as the "Golden Rule" of stairs, typically around 17 to 18 inches total (tread + riser) for comfortable climbing.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering slightly larger material sizes can reduce the number of joints and seams, improving the stair’s durability and appearance.
          </li>
          <li>
            <strong>Tip:</strong> When working with hardwoods, consider grain direction and board orientation to minimize waste and maximize strength.
          </li>
        </ul>
      </section>

      {/* 6. MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes to Avoid
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Incorrect Unit Conversion:</strong> Mixing metric and imperial units without proper conversion can lead to ordering too much or too little material. Always confirm your unit system and convert measurements accurately.
          </p>
          <p>
            <strong>2. Ignoring Waste Margin:</strong> Failing to include a waste percentage can cause material shortages during installation, leading to project delays and increased costs.
          </p>
          <p>
            <strong>3. Overlooking Material Size:</strong> Not accounting for the actual size of material units can result in ordering an incorrect quantity. Always select the correct material size in the calculator.
          </p>
          <p>
            <strong>4. Not Verifying Local Codes:</strong> Stair dimensions must comply with local building codes for safety. Using generic dimensions without verification can cause compliance issues.
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
            <a href="https://www.thisoldhouse.com/search?q=Stair%20Dimensions" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Stair Dimensions - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Stair Dimensions from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Stair%20Dimensions" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Stair Dimensions - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Stair Dimensions, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.finehomebuilding.com/?s=Stair%20Dimensions" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Stair Dimensions - Fine Homebuilding
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Expert articles and detailed construction techniques for Stair Dimensions from professional builders and craftsmen.
            </p>
          </li>
          <li>
            <a href="https://www.constructconnect.com/blog/search?term=Stair%20Dimensions" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Stair Dimensions - ConstructConnect
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Construction industry insights, cost data, and project management tips relevant to Stair Dimensions.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Stair Tread & Riser Dimensions Calculator"
      description="The ultimate professional guide and calculator for Stair Tread & Riser Dimensions Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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
        { id: "references", label: "References & Resources" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}