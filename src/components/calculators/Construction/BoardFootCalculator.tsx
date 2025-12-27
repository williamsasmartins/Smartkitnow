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

export default function BoardFootCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial", // default imperial for board foot calc
    length: "",
    width: "",
    depth: "",
    waste: "10",
    price: "",
    materialSize: "standard",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Board Foot Calculation:
   * Board Foot = (Length (ft) × Width (in) × Thickness (in)) / 12
   * 
   * Notes:
   * - Length in feet
   * - Width and Thickness in inches
   * 
   * For metric:
   * 1 board foot = 2.36 liters (approx)
   * Convert all dimensions to inches and feet accordingly or convert result to cubic meters.
   */

  const results = useMemo(() => {
    // Parse inputs
    const lengthRaw = parseFloat(inputs.length);
    const widthRaw = parseFloat(inputs.width);
    const depthRaw = parseFloat(inputs.depth);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);

    if (
      isNaN(lengthRaw) ||
      isNaN(widthRaw) ||
      isNaN(depthRaw) ||
      lengthRaw <= 0 ||
      widthRaw <= 0 ||
      depthRaw <= 0
    ) {
      return {
        mainQty: "0 Board Feet",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Convert inputs based on unit system
    // Imperial: length in feet, width & depth in inches
    // Metric: length, width, depth in mm or cm? We'll assume cm input, convert to inches/feet
    // For simplicity, metric inputs are in centimeters:
    // Convert cm to inches: 1 cm = 0.393701 inches
    // Convert cm to feet: 1 cm = 0.0328084 feet

    let lengthFt = 0,
      widthIn = 0,
      depthIn = 0;

    if (inputs.unit === "imperial") {
      lengthFt = lengthRaw;
      widthIn = widthRaw;
      depthIn = depthRaw;
    } else {
      // metric assumed cm input
      lengthFt = lengthRaw * 0.0328084;
      widthIn = widthRaw * 0.393701;
      depthIn = depthRaw * 0.393701;
    }

    // Calculate board feet
    // Board Foot = (L ft × W in × D in) / 12
    const rawBoardFeet = (lengthFt * widthIn * depthIn) / 12;

    // Add waste margin
    const totalBoardFeet = rawBoardFeet * (1 + wastePercent / 100);

    // Round up to 2 decimals for display
    const roundedRaw = rawBoardFeet.toFixed(2);
    const roundedTotal = totalBoardFeet.toFixed(2);

    // Calculate cost if price given
    const cost = pricePerUnit && !isNaN(pricePerUnit) ? totalBoardFeet * pricePerUnit : 0;

    return {
      mainQty: `${roundedTotal} Board Feet`,
      cost: cost > 0 ? `$${cost.toFixed(2)}` : "Price not set",
      details: `Raw: ${roundedRaw} Board Feet`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What exactly is a board foot and why is it important?",
      answer:
        "A board foot is a unit of volume used for lumber, representing a piece of wood 1 foot long, 1 foot wide, and 1 inch thick. It helps standardize lumber measurements so contractors and suppliers can accurately estimate material quantities and costs. Using board feet ensures you order the right amount of wood, minimizing waste and expense.",
    },
    {
      question: "How do I convert metric measurements to board feet?",
      answer:
        "Since board feet are based on imperial units, metric dimensions must be converted before calculating. Typically, length is converted from centimeters to feet, and width and thickness from centimeters to inches. After conversion, apply the board foot formula: (Length in feet × Width in inches × Thickness in inches) ÷ 12.",
    },
    {
      question: "Why should I include a waste margin in my calculations?",
      answer:
        "Woodworking projects often require extra material to account for cutting errors, defects, or changes in plans. Including a waste margin (commonly 5-15%) ensures you have enough lumber to complete your project without costly delays or additional orders.",
    },
    {
      question: "Does the size of the lumber affect the board foot calculation?",
      answer:
        "Yes, the dimensions directly impact the board foot volume. Larger or thicker boards yield more board feet per piece. Selecting standard or large sizes affects how many units you need to order to meet your volume requirements.",
    },
    {
      question: "Can I use this calculator for all types of wood?",
      answer:
        "This calculator works for any wood type as it measures volume, not weight or density. However, different wood species vary in price and suitability for projects, so always consider the material type when estimating costs and ordering.",
    },
    {
      question: "How accurate is the board foot calculation for irregular shapes?",
      answer:
        "The board foot formula assumes rectangular, straight lumber. For irregular or curved pieces, the calculation may be less accurate. In such cases, measure the average dimensions or consult a professional for precise volume estimation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a wooden deck and need to order lumber. You have boards that are 12 feet long, 6 inches wide, and 2 inches thick. You want to include a 10% waste margin and know the price per board foot is $3.50.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate board feet: (12 ft × 6 in × 2 in) ÷ 12 = 12 board feet per board.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 12 × 1.10 = 13.2 board feet needed per board.",
      },
      {
        label: "3. Order",
        explanation:
          "Multiply by number of boards needed and multiply by price per board foot to estimate cost.",
      },
    ],
    result: "Final Order: 13.2 board feet per board, costing approximately $46.20 per board.",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Board Feet = (Length (ft) × Width (in) × Thickness (in)) ÷ 12",
    variables: [
      { symbol: "L", description: "Length of the board in feet" },
      { symbol: "W", description: "Width of the board in inches" },
      { symbol: "T", description: "Thickness of the board in inches" },
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
            <SelectItem value="metric">Metric (cm)</SelectItem>
            <SelectItem value="imperial">Imperial (ft/in)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DYNAMIC INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "imperial" ? "feet" : "cm"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 12" : "e.g. 365"}
          />
        </div>
        <div className="space-y-2">
          <Label>Width ({inputs.unit === "imperial" ? "inches" : "cm"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 6" : "e.g. 15"}
          />
        </div>
        <div className="space-y-2">
          <Label>Thickness ({inputs.unit === "imperial" ? "inches" : "cm"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 2" : "e.g. 5"}
          />
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
          <Label>Price per Board Foot</Label>
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Board Foot Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The board foot is a traditional unit of measurement used primarily in the lumber industry to quantify the volume of wood. One board foot represents a volume of wood that is 1 foot long, 1 foot wide, and 1 inch thick. This measurement helps contractors, builders, and suppliers standardize orders and pricing for lumber materials.
          </p>
          <p>
            Precision in calculating board feet is crucial for budgeting and material planning. Ordering too little wood can cause project delays and increased costs, while ordering too much leads to waste and unnecessary expense. Accurate measurements and calculations ensure efficient use of resources.
          </p>
          <p>
            Different types of materials, such as softwoods, hardwoods, and engineered wood products, can all be measured in board feet. However, the price and density vary widely, so understanding the volume alone is just one part of effective material estimation.
          </p>
          <p>
            This calculator supports both imperial and metric units, converting metric inputs to the imperial system internally to provide accurate board foot calculations. It also allows you to factor in waste margins and price per board foot to estimate total material costs.
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
            <strong>Tip:</strong> Always measure your lumber dimensions carefully and double-check before ordering. Slight differences in thickness or width can significantly affect board foot calculations.
          </li>
          <li>
            <strong>Did You Know?</strong> The board foot measurement originated in the 18th century as a simple way to price lumber by volume, and it remains widely used in North America today.
          </li>
          <li>
            <strong>Contractor Secret:</strong> When ordering large quantities, ask your supplier about standard board sizes and consider ordering slightly larger boards to reduce the number of cuts and waste.
          </li>
          <li>
            <strong>Tip:</strong> For metric users, converting your measurements to imperial units before calculating board feet ensures accuracy. This calculator automates that conversion for you.
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
            <strong>1. Mixing Units:</strong> One of the most common errors is mixing metric and imperial units without proper conversion. This leads to wildly inaccurate board foot calculations and can cause costly ordering mistakes.
          </p>
          <p>
            <strong>2. Forgetting Waste Margin:</strong> Not including a waste margin can leave you short of materials during construction, causing delays and extra expenses. Always add a reasonable waste percentage based on your project complexity.
          </p>
          <p>
            <strong>3. Incorrect Dimension Inputs:</strong> Confusing thickness with width or length, or entering dimensions in the wrong units, can drastically skew your results. Double-check your inputs before calculating.
          </p>
          <p>
            <strong>4. Ignoring Material Type:</strong> While board feet measure volume, different woods have different densities and prices. Don’t assume all board feet cost the same—factor in your specific material costs.
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
            <a href="https://www.thisoldhouse.com/search?q=Board%20Foot%20Measurement" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Board Foot Measurement - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Board Foot Measurement from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Board%20Foot%20Measurement" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Board Foot Measurement - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Board Foot Measurement, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.finehomebuilding.com/?s=Board%20Foot%20Measurement" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Board Foot Measurement - Fine Homebuilding
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Expert articles and detailed construction techniques for Board Foot Measurement from professional builders and craftsmen.
            </p>
          </li>
          <li>
            <a href="https://www.constructconnect.com/blog/search?term=Board%20Foot%20Measurement" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Board Foot Measurement - ConstructConnect
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Construction industry insights, cost data, and project management tips relevant to Board Foot Measurement.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Board Foot Calculator"
      description="The ultimate professional guide and calculator for Board Foot Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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