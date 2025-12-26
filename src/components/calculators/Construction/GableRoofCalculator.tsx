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

export default function GableRoofCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "", // building length (horizontal base)
    width: "", // building width (horizontal base)
    height: "", // roof height (vertical from base to ridge)
    waste: "10", // waste percentage
    price: "", // price per unit material
    materialSize: "standard", // standard or large size material units
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * Gable roof area = 2 × (Length × Slant Height)
   * Slant Height = sqrt((Width/2)^2 + Height^2)
   *
   * Material units depend on selected size:
   * - Standard size covers 1.5 m² (metric) or 16 ft² (imperial)
   * - Large size covers 2.5 m² (metric) or 27 ft² (imperial)
   *
   * Waste margin is added on top.
   *
   * Cost = units × price per unit
   */

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const height = parseFloat(inputs.height);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);

    if (
      isNaN(length) ||
      isNaN(width) ||
      isNaN(height) ||
      length <= 0 ||
      width <= 0 ||
      height <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Calculate slant height (Pythagoras)
    const halfWidth = width / 2;
    const slantHeight = Math.sqrt(halfWidth * halfWidth + height * height);

    // Roof area (both sides)
    const roofArea = 2 * length * slantHeight; // in base units (m² or ft²)

    // Material coverage per unit based on size and unit system
    let coveragePerUnit = 1.5; // default standard metric m²
    if (inputs.unit === "imperial") {
      coveragePerUnit = 16; // standard imperial ft²
    }
    if (inputs.materialSize === "large") {
      coveragePerUnit = inputs.unit === "metric" ? 2.5 : 27;
    }

    // Raw units needed
    const rawUnits = roofArea / coveragePerUnit;

    // Add waste margin
    const totalUnits = rawUnits * (1 + wastePercent / 100);

    // Round up to next whole unit
    const roundedUnits = Math.ceil(totalUnits);

    // Calculate cost if price given
    const cost =
      !isNaN(pricePerUnit) && pricePerUnit > 0
        ? `$${(roundedUnits * pricePerUnit).toFixed(2)}`
        : "$0.00";

    // Format details string
    const details = `Roof Area: ${roofArea.toFixed(
      2
    )} ${inputs.unit === "metric" ? "m²" : "ft²"} | Raw Units: ${rawUnits.toFixed(
      2
    )} | Waste: +${wastePercent}%`;

    return {
      mainQty: `${roundedUnits} Units`,
      cost,
      details,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [
    inputs.length,
    inputs.width,
    inputs.height,
    inputs.waste,
    inputs.price,
    inputs.materialSize,
    inputs.unit,
  ]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is a gable roof and why is it popular?",
      answer:
        "A gable roof is a classic roof style featuring two sloping sides that meet at a ridge, forming a triangular shape. It is popular due to its simple design, efficient water drainage, and ability to provide good attic space. This design is widely used in residential and commercial buildings for its aesthetic appeal and structural advantages.",
    },
    {
      question:
        "Why is it important to calculate the slant height when estimating materials?",
      answer:
        "The slant height represents the actual length of the roof slope, which is longer than the horizontal half-width due to the roof's pitch. Calculating the slant height accurately ensures you estimate the true surface area of the roof, which directly affects the amount of roofing material needed. Underestimating this can lead to material shortages and project delays.",
    },
    {
      question:
        "How does the waste margin affect the total material quantity needed?",
      answer:
        "The waste margin accounts for material losses due to cutting, fitting, mistakes, and damage during installation. Adding a waste percentage ensures you order extra materials to cover these losses, preventing costly reorders. Typically, a 10% waste margin is recommended, but it can vary depending on project complexity and material type.",
    },
    {
      question:
        "What types of roofing materials can this calculator help estimate?",
      answer:
        "This calculator is designed to estimate material units for common roofing materials such as asphalt shingles, metal panels, tiles, and synthetic roofing sheets. By adjusting the material size and coverage per unit, you can tailor the estimates to different product types and sizes, ensuring accurate ordering.",
    },
    {
      question:
        "Can I use this calculator for non-standard roof pitches or complex roof shapes?",
      answer:
        "This calculator is optimized for standard gable roofs with symmetrical slopes. For roofs with complex shapes, multiple pitches, or additional features like dormers, you may need to break down the roof into simpler sections and calculate each separately or use specialized software. Always verify measurements on-site for complex projects.",
    },
    {
      question:
        "How do unit systems (metric vs imperial) affect the calculations?",
      answer:
        "The calculator supports both metric (meters, square meters) and imperial (feet, square feet) units. Material coverage per unit is adjusted accordingly to reflect typical product sizes in each system. Ensure you select the correct unit system matching your project measurements to get accurate results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a gable roof on a house that is 12 meters long, 8 meters wide, with a roof height of 3 meters. You want to order standard size roofing panels with a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate the slant height: sqrt((8/2)^2 + 3^2) = sqrt(16 + 9) = 5 meters. Roof area = 2 × 12 × 5 = 120 m².",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 120 m² × 1.10 = 132 m² total area to cover.",
      },
      {
        label: "3. Order",
        explanation:
          "Each standard panel covers 1.5 m², so units needed = 132 / 1.5 = 88 panels. Round up to 88 units.",
      },
    ],
    result: "Final Order: 88 Standard Size Roofing Panels",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Roof Area = 2 × Length × √((Width / 2)² + Height²)\nMaterial Units = (Roof Area × (1 + Waste %)) / Coverage per Unit",
    variables: [
      { symbol: "L", description: "Length of the building (base)" },
      { symbol: "W", description: "Width of the building (base)" },
      { symbol: "H", description: "Height of the roof (vertical rise)" },
      { symbol: "Waste %", description: "Waste margin percentage" },
      {
        symbol: "Coverage per Unit",
        description:
          "Area covered by one unit of roofing material (depends on size and unit system)",
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
            <SelectItem value="metric">Metric (m)</SelectItem>
            <SelectItem value="imperial">Imperial (ft)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DYNAMIC INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="e.g. 12"
          />
        </div>
        <div className="space-y-2">
          <Label>Width ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder="e.g. 8"
          />
        </div>
        <div className="space-y-2">
          <Label>Height (Roof Rise) ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder="e.g. 3"
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Material Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Size</SelectItem>
              <SelectItem value="large">Large Size</SelectItem>
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
              min={0}
              step="any"
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
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Materials Needed
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.mainQty}
            </div>
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Gable Roof
          Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            A gable roof is one of the most common and recognizable roof types,
            characterized by two sloping sides that meet at a central ridge,
            forming a triangular end wall known as a gable. This design is favored
            for its simplicity, effective water drainage, and ability to provide
            ample attic space. Estimating the correct amount of roofing material
            for a gable roof requires understanding its geometry and dimensions.
          </p>
          <p>
            Precision in measurement is crucial because roofing materials are
            typically sold in fixed sizes or coverage areas. Overestimating leads
            to unnecessary costs and waste, while underestimating can cause
            project delays and additional expenses. Calculating the slant height of
            the roof slope using the Pythagorean theorem ensures you measure the
            actual surface area rather than just the horizontal footprint.
          </p>
          <p>
            Different roofing materials come in various sizes and coverage areas.
            For example, asphalt shingles, metal panels, and tiles each have
            specific coverage per unit. This calculator allows you to select
            material size and unit system (metric or imperial) to tailor the
            estimate to your project needs. Additionally, including a waste margin
            accounts for cutting losses and mistakes, providing a buffer to avoid
            shortages.
          </p>
          <p>
            Using this calculator, contractors and DIYers can quickly determine
            the number of material units required for a gable roof, helping to
            streamline ordering, budgeting, and project planning.
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
            <strong>Tip:</strong> Always measure the roof height from the base to
            the ridge vertically, not along the slope, to get an accurate slant
            height calculation.
          </li>
          <li>
            <strong>Did You Know?</strong> The waste margin can vary depending on
            material type; for example, tile roofs often require a higher waste
            factor due to breakage during handling.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering slightly more material than
            calculated (around 5-10%) can save time and money by avoiding urgent
            reorders mid-project.
          </li>
          <li>
            <strong>Tip:</strong> When working in imperial units, remember that
            roofing panels and shingles are often sized in square feet, so ensure
            your unit coverage matches the product specifications.
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
            <strong>1. Ignoring the Roof Pitch:</strong> Using only the building’s
            width and length without calculating the slant height leads to
            underestimating the roof surface area and material needs.
          </p>
          <p>
            <strong>2. Forgetting Waste Margin:</strong> Not including a waste
            percentage can cause material shortages, especially when cutting and
            fitting materials around roof features.
          </p>
          <p>
            <strong>3. Mixing Units:</strong> Confusing metric and imperial units
            or not matching material coverage units with your measurements can
            result in inaccurate estimates.
          </p>
          <p>
            <strong>4. Overlooking Material Size Differences:</strong> Different
            roofing materials cover different areas per unit. Using incorrect
            coverage values will skew your calculations.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq">
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
      title="Gable Roof Calculator"
      description="The ultimate professional guide and calculator for Gable Roof Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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