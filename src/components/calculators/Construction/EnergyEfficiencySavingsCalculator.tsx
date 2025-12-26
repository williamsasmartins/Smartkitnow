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

export default function EnergyEfficiencySavingsCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    width: "",
    depth: "", // thickness or height of insulation or material layer
    waste: "10", // waste margin in %
    price: "",
    materialSize: "standard", // standard or large size units
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Material unit yields (example values for insulation panels or rolls)
  // Standard size unit covers 1 m² (metric) or 10 ft² (imperial) approx
  // Large size unit covers 2 m² or 20 ft² approx
  const materialUnitCoverage = {
    metric: {
      standard: 1, // m² per unit
      large: 2, // m² per unit
    },
    imperial: {
      standard: 10, // ft² per unit
      large: 20, // ft² per unit
    },
  };

  // Conversion constants
  const ftToM = 0.3048;
  const mToFt = 3.28084;

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const depthNum = parseFloat(inputs.depth);
    const wastePercent = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    const unit = inputs.unit;
    const size = inputs.materialSize;

    if (
      isNaN(lengthNum) ||
      isNaN(widthNum) ||
      isNaN(depthNum) ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      depthNum <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Calculate surface area (length x width) in m² or ft²
    // Depth is thickness but for energy efficiency savings, material units are based on surface coverage,
    // so depth is informational or for volume-based materials (like spray foam).
    // For this generic calculator, we calculate area only for material units.

    let area: number;
    if (unit === "metric") {
      area = lengthNum * widthNum; // m²
    } else {
      area = lengthNum * widthNum; // ft²
    }

    // Add waste margin
    const totalArea = area * (1 + wastePercent / 100);

    // Calculate units needed based on material coverage per unit
    const coveragePerUnit = materialUnitCoverage[unit][size];
    const rawUnits = totalArea / coveragePerUnit;

    // Round up to next whole unit (commercial units)
    const unitsNeeded = Math.ceil(rawUnits);

    // Calculate cost if price provided
    const cost = priceNum && priceNum > 0 ? unitsNeeded * priceNum : 0;

    // Details string
    const details = `Raw coverage needed: ${totalArea.toFixed(
      2
    )} ${unit === "metric" ? "m²" : "ft²"}`;

    return {
      mainQty: `${unitsNeeded} Unit${unitsNeeded > 1 ? "s" : ""}`,
      cost: cost > 0 ? `$${cost.toFixed(2)}` : "Price not set",
      details,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question:
        "What is the Energy Efficiency Savings Estimator and how does it help in construction projects?",
      answer:
        "The Energy Efficiency Savings Estimator is a tool designed to calculate the amount of insulation or energy-saving material units required based on the dimensions of the area to be covered. It helps contractors and builders estimate material quantities accurately, ensuring efficient budgeting and minimizing waste. By inputting length, width, and depth, users can determine how many units of insulation or energy-saving materials are needed, factoring in waste margins and material sizes.",
    },
    {
      question:
        "Why is precision important when estimating materials for energy efficiency?",
      answer:
        "Precision in estimating materials is crucial because underestimating can lead to project delays and additional costs due to last-minute orders, while overestimating results in unnecessary expenses and material waste. Accurate calculations ensure that the right amount of insulation or energy-saving materials are purchased, optimizing both cost and environmental impact. Precise estimates also help maintain project timelines and improve client satisfaction by avoiding surprises.",
    },
    {
      question:
        "What types of materials can be estimated using this calculator?",
      answer:
        "This calculator is versatile and can be used for various energy efficiency materials such as insulation panels, rolls, spray foam, reflective barriers, and other thermal protection products. The key is that the materials are sold in units covering a specific surface area, which the calculator uses to determine the quantity needed. Users can select between standard and large material sizes to match the product specifications they plan to use.",
    },
    {
      question:
        "How does the waste margin affect the total material quantity calculated?",
      answer:
        "The waste margin accounts for extra material needed to cover cutting losses, fitting adjustments, and unforeseen errors during installation. By adding a percentage (commonly 5-15%), the calculator increases the total material quantity to ensure there is enough supply to complete the project without shortages. This margin helps avoid costly delays and reorders, providing a buffer for practical job site conditions.",
    },
    {
      question:
        "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, the calculator supports both metric (meters and square meters) and imperial (feet and square feet) units. Users can switch between unit systems easily, and the calculator adjusts the calculations accordingly. This flexibility makes it suitable for projects in different regions and ensures compatibility with local measurement standards.",
    },
    {
      question:
        "How do I determine the price per unit for accurate cost estimation?",
      answer:
        "To estimate costs accurately, obtain the price per unit from your supplier or product catalog. This price should correspond to the selected material size (standard or large). Entering this value into the calculator allows it to multiply the number of units needed by the unit price, giving you an estimated total cost. Keep in mind that prices may vary based on supplier, quantity discounts, and regional factors.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are insulating a rectangular wall area measuring 5 meters in length and 3 meters in height. You plan to use standard size insulation panels that cover 1 m² each. You want to include a 10% waste margin and the price per panel is $25.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Calculate area: 5 m × 3 m = 15 m²",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste: 15 m² × 1.10 = 16.5 m² total coverage needed",
      },
      {
        label: "3. Order",
        explanation:
          "Divide total area by coverage per panel: 16.5 m² ÷ 1 m² = 16.5 panels → round up to 17 panels",
      },
    ],
    result: "Final Order: 17 Panels, Estimated Cost: $425.00",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Total Material Units = ⌈ (Length × Width × (1 + Waste%)) ÷ Coverage per Unit ⌉",
    variables: [
      { symbol: "Length", description: "Length of the area to cover" },
      { symbol: "Width", description: "Width or height of the area to cover" },
      {
        symbol: "Waste%",
        description:
          "Waste margin percentage added to cover cutting and fitting losses",
      },
      {
        symbol: "Coverage per Unit",
        description:
          "Surface area covered by one unit of the material (depends on material size and unit system)",
      },
      {
        symbol: "⌈ ⌉",
        description: "Ceiling function to round up to the next whole unit",
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
            min="0"
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="e.g. 5"
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
            placeholder="e.g. 3"
          />
        </div>
        <div className="space-y-2">
          <Label>Depth / Thickness ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder="e.g. 0.1"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Informational - thickness of insulation or material layer
          </p>
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Item Size</Label>
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Energy
          Efficiency Savings Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The Energy Efficiency Savings Estimator is a specialized calculator designed
            to help construction professionals accurately estimate the quantity of
            energy-saving materials required for a project. Whether you are installing
            insulation panels, reflective barriers, or other thermal protection
            products, this tool simplifies the process by calculating the number of
            material units based on your project's dimensions.
          </p>
          <p>
            Precision matters in these calculations because energy efficiency materials
            directly impact the thermal performance and cost-effectiveness of a building.
            Overestimating materials leads to unnecessary expenses and waste, while
            underestimating can cause project delays and insufficient insulation,
            reducing energy savings.
          </p>
          <p>
            This estimator supports both metric and imperial units, allowing you to
            input length, width, and depth (thickness) of the area to be covered. While
            the depth is primarily informational for volume-based materials, the core
            calculation focuses on surface area coverage.
          </p>
          <p>
            Material types vary widely, from standard size insulation panels covering
            approximately 1 square meter or 10 square feet, to larger rolls or boards
            that cover more area per unit. Selecting the correct material size in the
            calculator ensures your estimates match the products you plan to order.
          </p>
          <p>
            Additionally, the calculator includes a waste margin slider to add a safety
            buffer for cutting losses and installation adjustments, helping you avoid
            shortages and costly reorders.
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
            <strong>Tip:</strong> Always measure twice and verify dimensions on-site
            before ordering materials to avoid costly mistakes.
          </li>
          <li>
            <strong>Did You Know?</strong> Adding a 10% waste margin is standard
            practice in insulation projects to cover cutting and fitting losses.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering slightly larger material sizes
            can reduce installation time and waste, especially on irregular surfaces.
          </li>
          <li>
            <strong>Tip:</strong> Use the calculator's unit toggle to switch between
            metric and imperial depending on your project's location and supplier.
          </li>
          <li>
            <strong>Did You Know?</strong> Properly installed insulation can reduce
            heating and cooling costs by up to 30%, making accurate estimation vital.
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
            <strong>1. Ignoring Waste Margins:</strong> Failing to include a waste
            margin often results in material shortages and project delays. Always add
            a reasonable percentage to your calculations.
          </p>
          <p>
            <strong>2. Mixing Units:</strong> Inputting dimensions in one unit system
            but selecting another can cause incorrect estimates. Double-check your
            unit settings before calculating.
          </p>
          <p>
            <strong>3. Overlooking Material Coverage:</strong> Different products cover
            different areas per unit. Ensure you select the correct material size to
            match your supplier's specifications.
          </p>
          <p>
            <strong>4. Neglecting Thickness:</strong> While this calculator focuses on
            surface area, ignoring the depth or thickness of insulation can affect
            thermal performance and cost. Consider thickness in your overall project
            planning.
          </p>
          <p>
            <strong>5. Not Updating Prices:</strong> Using outdated or incorrect unit
            prices will skew cost estimates. Always verify current prices with your
            supplier.
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
      title="Energy Efficiency Savings Estimator"
      description="The ultimate professional guide and calculator for Energy Efficiency Savings Estimator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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