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

export default function RoofUnderlaymentRollCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    width: "",
    waste: "10", // percent
    price: "",
    materialSize: "standard", // standard or large roll
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * 1. Calculate total roof area = length * width (in square meters or square feet)
   * 2. Add waste percentage
   * 3. Calculate number of rolls needed = total area / roll coverage area
   * 4. Round up to nearest whole roll
   * 5. Calculate cost = rolls * price per roll
   *
   * Roll coverage area depends on materialSize and unit system:
   * - Standard roll coverage:
   *    Metric: 1 roll covers 50 m² (typical)
   *    Imperial: 1 roll covers 540 ft² (approx 50 m²)
   * - Large roll coverage:
   *    Metric: 1 roll covers 75 m²
   *    Imperial: 1 roll covers 810 ft²
   */

  const rollCoverage = useMemo(() => {
    if (inputs.unit === "metric") {
      return inputs.materialSize === "standard" ? 50 : 75; // m²
    } else {
      return inputs.materialSize === "standard" ? 540 : 810; // ft²
    }
  }, [inputs.unit, inputs.materialSize]);

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);

    if (
      isNaN(length) ||
      length <= 0 ||
      isNaN(width) ||
      width <= 0 ||
      isNaN(wastePercent) ||
      wastePercent < 0 ||
      isNaN(pricePerUnit) ||
      pricePerUnit < 0
    ) {
      return {
        mainQty: "0 Rolls",
        cost: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Calculate total area
    const totalArea = length * width; // m² or ft²

    // Add waste margin
    const totalAreaWithWaste = totalArea * (1 + wastePercent / 100);

    // Calculate rolls needed
    const rollsNeeded = Math.ceil(totalAreaWithWaste / rollCoverage);

    // Calculate cost
    const totalCost = rollsNeeded * pricePerUnit;

    return {
      mainQty: `${rollsNeeded} Roll${rollsNeeded !== 1 ? "s" : ""}`,
      cost: `$${totalCost.toFixed(2)}`,
      details: `Raw area: ${totalArea.toFixed(2)} ${
        inputs.unit === "metric" ? "m²" : "ft²"
      }, with waste: ${totalAreaWithWaste.toFixed(2)} ${
        inputs.unit === "metric" ? "m²" : "ft²"
      }`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs, rollCoverage]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is roof underlayment and why is it important?",
      answer:
        "Roof underlayment is a protective layer installed beneath roofing materials such as shingles or tiles. It acts as a secondary barrier against water infiltration, wind-driven rain, and ice dams, protecting the roof deck and interior of the building. Proper underlayment installation extends roof life and prevents costly damage.",
    },
    {
      question:
        "How do I choose the right size and type of roof underlayment roll?",
      answer:
        "Underlayment rolls come in various sizes and materials, including synthetic and felt types. The choice depends on roof design, climate, and budget. Standard rolls typically cover around 50 square meters (540 square feet), while larger rolls cover more area and reduce seams. Synthetic underlayments offer better durability and moisture resistance compared to traditional felt.",
    },
    {
      question: "Why is it necessary to include waste in the estimation?",
      answer:
        "Including a waste factor accounts for material lost due to cutting, overlaps, mistakes, and fitting around roof features like vents and chimneys. Typically, a 10% waste margin is recommended to ensure you have enough material to complete the job without delays or additional orders.",
    },
    {
      question:
        "Can I use this calculator for both metric and imperial measurement systems?",
      answer:
        "Yes, the calculator supports both metric (meters) and imperial (feet) units. Simply select your preferred unit system, and input the roof dimensions accordingly. The calculator will automatically adjust roll coverage values and output results in the selected system.",
    },
    {
      question:
        "How do different types of roof underlayment materials affect cost and installation?",
      answer:
        "Synthetic underlayments generally cost more upfront but offer superior durability, UV resistance, and lighter weight, making installation easier and faster. Felt underlayments are less expensive but can be heavier, less durable, and more prone to tearing. Choosing the right material impacts both initial cost and long-term roof performance.",
    },
    {
      question:
        "What are common mistakes contractors make when estimating roof underlayment rolls?",
      answer:
        "Common mistakes include underestimating waste, not accounting for roof complexity (valleys, hips, penetrations), mixing units incorrectly, and ignoring roll size variations. These errors can lead to ordering too little material, causing project delays and increased costs.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are estimating roof underlayment rolls for a rectangular roof measuring 12 meters in length and 8 meters in width. You choose a standard roll size and want to include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate the roof area: 12 m × 8 m = 96 m² total area.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 96 m² × 1.10 = 105.6 m² total coverage needed.",
      },
      {
        label: "3. Order",
        explanation:
          "Divide total coverage by roll coverage (standard roll covers 50 m²): 105.6 ÷ 50 = 2.112 rolls. Round up to 3 rolls.",
      },
    ],
    result: "Final Order: 3 Rolls",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Number of Rolls = ⌈ (Length × Width × (1 + Waste% / 100)) ÷ Roll Coverage Area ⌉",
    variables: [
      { symbol: "Length", description: "Length of the roof area" },
      { symbol: "Width", description: "Width of the roof area" },
      { symbol: "Waste%", description: "Waste margin percentage" },
      { symbol: "Roll Coverage Area", description: "Coverage area per roll" },
      {
        symbol: "⌈ ⌉",
        description: "Ceiling function to round up to the nearest whole roll",
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

      {/* Inputs: Length and Width */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Roll Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Roll</SelectItem>
              <SelectItem value="large">Large Roll</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Roll</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              type="number"
              min={0}
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Roof
          Underlayment Roll Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Roof underlayment is a crucial protective layer installed beneath the
            primary roofing material, such as shingles or tiles. It serves as a
            secondary barrier against moisture, wind-driven rain, and ice dams,
            helping to protect the roof deck and interior of the building from
            water damage. Estimating the correct amount of underlayment material
            is essential to ensure full coverage and avoid costly shortages or
            excess waste.
          </p>
          <p>
            Precision in estimating roof underlayment rolls matters because
            underestimating can lead to project delays and additional costs,
            while overestimating results in wasted materials and increased
            expenses. Accurate calculations help contractors order the right
            quantity, optimize budget, and maintain efficient workflow on site.
          </p>
          <p>
            Roof underlayment materials typically come in rolls of various sizes
            and types. Standard rolls cover approximately 50 square meters (or
            540 square feet), while larger rolls cover more area, reducing seams
            and installation time. Common materials include traditional felt and
            modern synthetic underlayments, each with distinct performance and
            cost characteristics.
          </p>
          <p>
            This calculator allows you to input your roof dimensions, select your
            preferred unit system (metric or imperial), choose roll size, and
            specify a waste margin to get an accurate estimate of the number of
            rolls needed and the total cost. Use this tool to streamline your
            project planning and ensure you have the right materials on hand.
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
            <strong>Tip:</strong> Always measure roof dimensions along the roof
            plane, not just the building footprint, especially for sloped roofs.
            This ensures accurate area calculation.
          </li>
          <li>
            <strong>Did You Know?</strong> Synthetic underlayments are lighter,
            more tear-resistant, and offer better UV protection than traditional
            felt, making them increasingly popular among contractors.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering a slightly larger roll
            size can reduce seams and installation time, often saving labor costs
            on large projects.
          </li>
          <li>
            <strong>Tip:</strong> Adjust your waste margin based on roof
            complexity — roofs with many penetrations, hips, and valleys require
            more waste allowance.
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
            <strong>1. Underestimating Waste:</strong> Failing to include an
            adequate waste margin can result in insufficient material, causing
            costly delays and rush orders.
          </p>
          <p>
            <strong>2. Ignoring Roof Complexity:</strong> Not accounting for
            additional material needed around roof features like chimneys,
            skylights, and valleys leads to shortages.
          </p>
          <p>
            <strong>3. Mixing Units:</strong> Inputting dimensions in one unit
            system but selecting another can cause major miscalculations.
          </p>
          <p>
            <strong>4. Overlooking Roll Size Variations:</strong> Different
            manufacturers offer rolls with varying coverage areas; always verify
            roll coverage before ordering.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-500" /> Frequently Asked
          Questions
        </h2>
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
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">

          <li>
            <a href="https://www.thisoldhouse.com/search?q=Roof%20Underlayment" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Roof Underlayment - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Roof Underlayment from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Roof%20Underlayment" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Roof Underlayment - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Roof Underlayment, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.finehomebuilding.com/?s=Roof%20Underlayment" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Roof Underlayment - Fine Homebuilding
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Expert articles and detailed construction techniques for Roof Underlayment from professional builders and craftsmen.
            </p>
          </li>
          <li>
            <a href="https://www.constructconnect.com/blog/search?term=Roof%20Underlayment" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Roof Underlayment - ConstructConnect
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Construction industry insights, cost data, and project management tips relevant to Roof Underlayment.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Roof Underlayment Roll Estimator"
      description="The ultimate professional guide and calculator for Roof Underlayment Roll Estimator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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