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

export default function HeatingCostPerSquareFootCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "",
    width: "",
    pricePerSqFt: "",
    waste: "10",
    materialType: "electric", // electric, hydronic, or radiant
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion constants
  const SQFT_PER_SQM = 10.7639;

  // Material cost multipliers or base costs per sq ft (example values)
  // These could be adjusted or expanded with more precise data
  const materialBaseCosts: Record<string, number> = {
    electric: 12, // $12 per sq ft average installation cost
    hydronic: 18, // $18 per sq ft average installation cost
    radiant: 15, // $15 per sq ft average installation cost
  };

  // Calculate results
  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const wastePercent = parseFloat(inputs.waste);
    let priceNum = parseFloat(inputs.pricePerSqFt);

    if (
      isNaN(lengthNum) ||
      isNaN(widthNum) ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      isNaN(wastePercent) ||
      wastePercent < 0 ||
      wastePercent > 25
    ) {
      return {
        mainQty: "0 sq ft",
        cost: "$0.00",
        details: "Invalid input values",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Calculate area in square feet
    let areaSqFt = 0;
    if (inputs.unit === "metric") {
      // Inputs are in meters, convert to sq ft
      areaSqFt = lengthNum * widthNum * SQFT_PER_SQM;
    } else {
      // Inputs are in feet
      areaSqFt = lengthNum * widthNum;
    }

    // Add waste margin
    const totalAreaWithWaste = areaSqFt * (1 + wastePercent / 100);

    // Determine price per sq ft if not provided, fallback to base cost by material type
    if (isNaN(priceNum) || priceNum <= 0) {
      priceNum = materialBaseCosts[inputs.materialType] || 15;
    }

    // Calculate total cost
    const totalCost = totalAreaWithWaste * priceNum;

    // Format results
    return {
      mainQty: `${totalAreaWithWaste.toFixed(2)} sq ft`,
      cost: `$${totalCost.toFixed(2)}`,
      details: `Base area: ${areaSqFt.toFixed(
        2
      )} sq ft + ${wastePercent}% waste margin`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is the Heating Cost per Square Foot Estimator?",
      answer:
        "The Heating Cost per Square Foot Estimator is a tool designed to help contractors and homeowners estimate the total cost of installing heating systems based on the area size. It calculates the required material units and total cost by considering the dimensions of the space, type of heating material, and waste margin. This estimator simplifies budgeting and ordering by providing a clear cost overview per square foot.",
    },
    {
      question: "Why is precision important when estimating heating costs?",
      answer:
        "Precision in estimating heating costs ensures that you order the correct amount of materials, avoid costly overages or shortages, and maintain project timelines. Accurate measurements and waste considerations prevent delays and reduce unnecessary expenses. Additionally, precise cost estimation helps in creating realistic budgets and proposals, improving client trust and project profitability.",
    },
    {
      question: "How do different heating material types affect the cost?",
      answer:
        "Different heating materials, such as electric mats, hydronic tubing, or radiant panels, vary significantly in cost and installation complexity. Electric systems tend to have lower upfront material costs but might have higher operating expenses. Hydronic systems usually require more extensive installation and higher material costs but offer efficient heating. Radiant panels fall somewhere in between. Selecting the right material type impacts both the initial investment and long-term costs.",
    },
    {
      question:
        "How should I account for waste when ordering heating materials?",
      answer:
        "Waste margin accounts for material lost due to cutting, fitting, or installation errors. Typically, a 5-15% waste factor is added to the calculated material quantity to ensure sufficient supply. Underestimating waste can lead to project delays and additional orders, while overestimating increases upfront costs. Adjust the waste percentage based on project complexity and installer experience.",
    },
    {
      question:
        "Can I use this estimator for both metric and imperial measurement systems?",
      answer:
        "Yes, the estimator supports both metric (meters) and imperial (feet) units. Simply select your preferred unit system, and input the length and width accordingly. The calculator automatically converts metric inputs to square feet for cost calculations, ensuring consistent and accurate results regardless of the measurement system used.",
    },
    {
      question:
        "What should I do if I don’t know the price per square foot for my heating material?",
      answer:
        "If you don’t have a specific price per square foot, the estimator uses average base costs for common heating material types as a fallback. These averages provide a reasonable estimate to help with budgeting. However, for the most accurate results, obtain quotes from suppliers or contractors and input the exact price per square foot.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing an electric underfloor heating system in a 5 meter by 4 meter room. You want to include a 10% waste margin and know the price per square foot is $13.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Convert 5m x 4m to square feet: 5 × 4 × 10.7639 = 215.28 sq ft",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 215.28 × 1.10 = 236.81 sq ft total material needed",
      },
      {
        label: "3. Calculate Cost",
        explanation:
          "Multiply total sq ft by price per sq ft: 236.81 × $13 = $3,078.53 estimated cost",
      },
    ],
    result: "Final Order: 236.81 sq ft of electric heating material costing $3,078.53",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Total Material (sq ft) = Length × Width × Conversion Factor × (1 + Waste Percentage)",
    variables: [
      { symbol: "Length", description: "Length of the area (meters or feet)" },
      { symbol: "Width", description: "Width of the area (meters or feet)" },
      {
        symbol: "Conversion Factor",
        description:
          "10.7639 if input is in meters (to convert to sq ft), 1 if in feet",
      },
      {
        symbol: "Waste Percentage",
        description:
          "Additional percentage of material to account for waste (expressed as decimal)",
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
            min={0}
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
            min={0}
            step="any"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder="e.g. 4"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Heating Material Type</Label>
          <Select
            value={inputs.materialType}
            onValueChange={(v) => handleInputChange("materialType", v)}
          >
            <SelectTrigger>
              <HardHat className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electric">Electric Heating</SelectItem>
              <SelectItem value="hydronic">Hydronic Heating</SelectItem>
              <SelectItem value="radiant">Radiant Panels</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Square Foot (optional)</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              type="number"
              min={0}
              step="any"
              value={inputs.pricePerSqFt}
              onChange={(e) => handleInputChange("pricePerSqFt", e.target.value)}
              placeholder={`Default used if empty`}
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between">
          <Label>Waste Margin (%)</Label>
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Heating
          Cost per Square Foot Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The Heating Cost per Square Foot Estimator is a vital tool for
            contractors, builders, and homeowners planning to install heating
            systems. It calculates the total material units and estimated cost
            based on the dimensions of the area to be heated, the type of heating
            material selected, and an added waste margin to cover installation
            inefficiencies. This estimator simplifies budgeting and ordering,
            ensuring you purchase the right amount of materials without costly
            shortages or excess.
          </p>
          <p>
            Precision matters greatly in heating installations. Accurate
            measurements and calculations help avoid underestimating material
            needs, which can cause project delays and additional expenses. Overestimating,
            on the other hand, ties up capital in unused materials and increases
            waste. By using this estimator, you can confidently plan your project
            with a clear understanding of material requirements and costs.
          </p>
          <p>
            Different heating materials come with varying costs and installation
            requirements. Electric heating mats are generally easier to install
            and have moderate upfront costs, while hydronic systems involve tubing
            and boilers, leading to higher material and labor expenses. Radiant
            panels offer a balance between these options. Selecting the right
            material type in the estimator adjusts the base cost per square foot,
            providing a more tailored estimate.
          </p>
          <p>
            Additionally, the estimator supports both metric and imperial units,
            automatically converting measurements to square feet for consistent
            cost calculations. You can also input your own price per square foot
            if you have supplier quotes, or rely on default average costs for a
            quick estimate.
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
            <strong>Tip:</strong> Always measure twice and consider irregular
            shapes by breaking the area into smaller rectangles for more accurate
            calculations.
          </li>
          <li>
            <strong>Did You Know?</strong> Hydronic heating systems can be more
            energy-efficient over time but require more upfront investment and
            careful planning.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Adding a 10% waste margin is a
            good rule of thumb, but complex layouts or custom installations might
            require up to 15% to avoid last-minute shortages.
          </li>
          <li>
            <strong>Tip:</strong> If unsure about price per square foot, use the
            default values as a baseline and adjust once you receive supplier
            quotes.
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
            <strong>1. Incorrect Unit Selection:</strong> Mixing metric and imperial
            units without conversion leads to wildly inaccurate estimates. Always
            confirm your measurement units before input.
          </p>
          <p>
            <strong>2. Ignoring Waste Margin:</strong> Failing to add a waste
            percentage can result in ordering too little material, causing delays
            and extra costs.
          </p>
          <p>
            <strong>3. Using Outdated or Generic Prices:</strong> Material costs
            fluctuate by region and supplier. Always update price per square foot
            with current quotes for best accuracy.
          </p>
          <p>
            <strong>4. Overlooking Complex Layouts:</strong> Irregular room shapes
            or obstacles require careful measurement and possibly breaking the
            area into sections to avoid underestimating material needs.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-500" /> Frequently Asked Questions
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Heating Cost per Square Foot Estimator"
      description="The ultimate professional guide and calculator for Heating Cost per Square Foot Estimator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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