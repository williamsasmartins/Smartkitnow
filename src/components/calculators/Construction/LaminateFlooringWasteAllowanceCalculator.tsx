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

export default function LaminateFlooringWasteAllowanceCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    width: "",
    waste: "10", // default 10%
    price: "",
    materialSize: "standard", // standard or large plank size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * 1. Convert length and width to meters if imperial (feet to meters)
   * 2. Calculate area in square meters
   * 3. Add waste allowance (percentage)
   * 4. Calculate number of units needed based on material size coverage (sqm per unit)
   * 5. Calculate cost if price per unit provided
   */

  // Coverage per unit (plank box) in sqm:
  // Standard size box covers approx 2.13 sqm (typical 8mm thick laminate box)
  // Large size box covers approx 3.0 sqm (some larger boxes)
  const coveragePerUnit = {
    standard: 2.13,
    large: 3.0,
  };

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const wastePercent = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    const coverage = coveragePerUnit[inputs.materialSize] || coveragePerUnit.standard;

    if (
      isNaN(lengthNum) ||
      lengthNum <= 0 ||
      isNaN(widthNum) ||
      widthNum <= 0 ||
      isNaN(wastePercent) ||
      wastePercent < 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions and waste percentage.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Convert to meters if imperial
    // 1 foot = 0.3048 meters
    const lengthMeters = inputs.unit === "imperial" ? lengthNum * 0.3048 : lengthNum;
    const widthMeters = inputs.unit === "imperial" ? widthNum * 0.3048 : widthNum;

    // Calculate area in sqm
    const area = lengthMeters * widthMeters;

    // Add waste allowance
    const totalArea = area * (1 + wastePercent / 100);

    // Calculate units needed (round up to whole boxes)
    const unitsNeeded = Math.ceil(totalArea / coverage);

    // Calculate cost if price given
    const totalCost = priceNum && priceNum > 0 ? (unitsNeeded * priceNum).toFixed(2) : null;

    return {
      mainQty: `${unitsNeeded} Unit${unitsNeeded > 1 ? "s" : ""}`,
      cost: totalCost ? `$${totalCost}` : "Price not set",
      details: `Base area: ${area.toFixed(2)} m², Total with waste: ${totalArea.toFixed(
        2
      )} m², Coverage per unit: ${coverage.toFixed(2)} m²`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question:
        "What is a laminate flooring waste allowance and why is it important to include it in calculations?",
      answer:
        "Laminate flooring waste allowance is an extra percentage of material added to the calculated floor area to account for cutting, fitting, and potential damage during installation. Including this allowance ensures you purchase enough material to complete the job without costly delays or shortages. Typically, waste allowances range from 5% to 15%, depending on room complexity and installer experience.",
    },
    {
      question: "How do I measure my room correctly for the laminate flooring calculation?",
      answer:
        "To measure your room accurately, measure the length and width of the floor area in either meters or feet. For irregularly shaped rooms, divide the space into rectangles, measure each separately, and sum their areas. Always measure to the nearest centimeter or inch for precision. Avoid including areas like closets or built-in cabinets unless you plan to cover them with flooring.",
    },
    {
      question:
        "Why do different laminate flooring boxes cover different areas, and how does that affect ordering?",
      answer:
        "Laminate flooring boxes vary in coverage because of plank size, thickness, and packaging. Standard boxes typically cover around 2.13 square meters, while larger boxes can cover up to 3 square meters or more. Knowing the coverage per box helps you calculate how many boxes to order accurately, preventing overbuying or underbuying materials.",
    },
    {
      question:
        "Can I use this calculator if my flooring planks have different dimensions or thicknesses?",
      answer:
        "Yes, but you should adjust the coverage per unit accordingly. This calculator uses typical coverage values for standard and large laminate flooring boxes. If your planks differ significantly, check the packaging or supplier information for exact coverage per box and input that manually if possible, or select the closest size option.",
    },
    {
      question:
        "How does the waste percentage affect the total material needed, and what is a recommended waste allowance?",
      answer:
        "The waste percentage increases the total material quantity to cover cuts, mistakes, and fitting around obstacles. For simple, rectangular rooms, 5-10% waste is usually sufficient. For complex layouts with many corners, stairs, or patterns, 10-15% waste is recommended. Using too low a waste allowance risks running short, while too high increases cost and leftover material.",
    },
    {
      question:
        "Is it better to order slightly more laminate flooring than calculated or exactly the amount needed?",
      answer:
        "It is generally better to order slightly more than the exact calculated amount to avoid shortages during installation. Flooring batches can vary slightly in color or texture, so ordering extra from the same batch ensures consistency for repairs or future replacements. Excess material can often be returned or stored for later use.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing laminate flooring in a rectangular living room measuring 5 meters by 4 meters. You want to include a 10% waste allowance and are using standard size laminate boxes covering 2.13 square meters each.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Calculate area: 5 m × 4 m = 20 m²",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste: 20 m² × 1.10 = 22 m² total material needed",
      },
      {
        label: "3. Order",
        explanation:
          "Divide total area by coverage per box: 22 m² ÷ 2.13 m² ≈ 10.33 boxes, round up to 11 boxes",
      },
    ],
    result: "Final Order: 11 boxes of laminate flooring",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Total Material Needed = (Length × Width) × (1 + Waste Percentage / 100)",
    variables: [
      { symbol: "Length", description: "Length of the floor area" },
      { symbol: "Width", description: "Width of the floor area" },
      { symbol: "Waste Percentage", description: "Waste allowance percentage" },
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

      {/* Inputs for Length and Width */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="length">Length</Label>
          <Input
            id="length"
            type="number"
            min={0}
            step="any"
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            type="number"
            min={0}
            step="any"
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
          />
        </div>
      </div>

      {/* Material Size and Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="materialSize">Material Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger id="materialSize">
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Size (2.13 m²/box)</SelectItem>
              <SelectItem value="large">Large Size (3.00 m²/box)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price per Unit</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              id="price"
              className="pl-8"
              type="number"
              min={0}
              step="0.01"
              placeholder="0.00"
              value={inputs.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Waste Margin Slider */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between">
          <Label htmlFor="waste">Waste Margin</Label>
          <span className="font-bold text-blue-600">{inputs.waste}%</span>
        </div>
        <Slider
          id="waste"
          value={[parseInt(inputs.waste)]}
          min={0}
          max={25}
          step={5}
          onValueChange={(v) => handleInputChange("waste", v[0].toString())}
        />
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" type="button">
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Materials Needed
            </span>
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
          <BookOpen className="w-6 h-6 text-blue-500" />
          Professional Guide: Laminate Flooring Waste Allowance Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Laminate flooring waste allowance is an essential factor in planning your flooring
            project. It represents the extra material you need to purchase beyond the exact floor
            area to accommodate cutting, fitting, and potential mistakes during installation.
            Without accounting for waste, you risk running short of materials, causing delays and
            additional costs.
          </p>
          <p>
            Precision in measuring your floor dimensions and calculating the waste allowance helps
            ensure you order the right amount of laminate flooring. This calculator assists you in
            determining the total units required, factoring in waste, and estimating the cost based
            on your inputs.
          </p>
          <p>
            Laminate flooring comes in various box sizes and coverage areas. Standard boxes typically
            cover around 2.13 square meters, while larger boxes can cover up to 3 square meters or
            more. Selecting the correct material size in the calculator will improve the accuracy of
            your order.
          </p>
          <p>
            Remember that waste percentages vary depending on room complexity. Simple rectangular
            rooms may only require 5-10% waste, while rooms with many corners, stairs, or patterns
            may need 10-15% or more. Always consider your specific project conditions when choosing
            a waste allowance.
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
            <strong>Tip 1:</strong> Always measure your room twice and consider irregular shapes by
            breaking them into rectangles for more accurate area calculation.
          </li>
          <li>
            <strong>Did You Know?</strong> Laminate flooring waste allowance not only covers cuts
            but also accounts for damaged planks and future repairs, so ordering a bit extra is
            smart.
          </li>
          <li>
            <strong>Tip 2:</strong> When ordering, try to get all your flooring from the same batch
            number to avoid color or texture variations.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Experienced installers often add 10-15% waste for
            complex rooms and patterns, but only 5-7% for simple layouts.
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
            <strong>1. Underestimating Waste:</strong> Many installers forget to add a sufficient waste
            margin, leading to material shortages mid-project and costly last-minute orders.
          </p>
          <p>
            <strong>2. Incorrect Measurements:</strong> Measuring only the longest length and width
            without accounting for irregular shapes or alcoves can cause inaccurate area
            calculations.
          </p>
          <p>
            <strong>3. Ignoring Unit Conversions:</strong> Mixing metric and imperial units without
            proper conversion can lead to ordering far too much or too little material.
          </p>
          <p>
            <strong>4. Not Considering Box Coverage:</strong> Assuming all laminate boxes cover the
            same area can cause miscalculations; always check the coverage per box.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-500" />
          Frequently Asked Questions
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
            <a href="https://www.thisoldhouse.com/search?q=Laminate%20Flooring" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Laminate Flooring - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Laminate Flooring from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Laminate%20Flooring" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Laminate Flooring - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Laminate Flooring, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.finehomebuilding.com/?s=Laminate%20Flooring" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Laminate Flooring - Fine Homebuilding
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Expert articles and detailed construction techniques for Laminate Flooring from professional builders and craftsmen.
            </p>
          </li>
          <li>
            <a href="https://www.constructconnect.com/blog/search?term=Laminate%20Flooring" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Laminate Flooring - ConstructConnect
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Construction industry insights, cost data, and project management tips relevant to Laminate Flooring.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Laminate Flooring Waste Allowance Calculator"
      description="The ultimate professional guide and calculator for Laminate Flooring Waste Allowance Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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