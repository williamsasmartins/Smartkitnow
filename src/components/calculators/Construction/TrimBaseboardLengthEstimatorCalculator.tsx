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

export default function TrimBaseboardLengthEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "", // room perimeter length (m or ft)
    waste: "10", // waste percentage
    price: "", // price per unit length
    materialSize: "standard", // standard or large length per unit
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion constants
  const METERS_TO_FEET = 3.28084;

  // Material sizes in meters and feet (length per unit piece)
  // Standard baseboard length: 2.4m (8ft), Large: 3.6m (12ft)
  const materialLengths = {
    metric: {
      standard: 2.4,
      large: 3.6,
    },
    imperial: {
      standard: 8,
      large: 12,
    },
  };

  const results = useMemo(() => {
    // Parse inputs
    const lengthRaw = parseFloat(inputs.length);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);
    if (isNaN(lengthRaw) || lengthRaw <= 0) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter a valid length.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }
    if (isNaN(wastePercent) || wastePercent < 0) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter a valid waste percentage.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Determine material length per unit based on unit system and size
    const unitSystem = inputs.unit === "imperial" ? "imperial" : "metric";
    const pieceLength = materialLengths[unitSystem][inputs.materialSize] || materialLengths[unitSystem].standard;

    // Total length needed including waste
    const totalLengthWithWaste = lengthRaw * (1 + wastePercent / 100);

    // Calculate number of units needed (round up)
    const unitsNeeded = Math.ceil(totalLengthWithWaste / pieceLength);

    // Calculate cost if price per unit is provided
    const totalCost = !isNaN(pricePerUnit) && pricePerUnit > 0 ? unitsNeeded * pricePerUnit : null;

    // Format results
    const mainQty = `${unitsNeeded} Unit${unitsNeeded !== 1 ? "s" : ""}`;
    const cost = totalCost !== null ? `$${totalCost.toFixed(2)}` : "N/A";
    const details = `Raw Length: ${lengthRaw.toFixed(2)} ${unitSystem === "metric" ? "m" : "ft"} × (1 + ${wastePercent}% waste) = ${totalLengthWithWaste.toFixed(
      2
    )} ${unitSystem === "metric" ? "m" : "ft"} total length needed. Each unit covers ${pieceLength} ${unitSystem === "metric" ? "m" : "ft"}.`;

    return {
      mainQty,
      cost,
      details,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is the Trim & Baseboard Length Estimator used for?",
      answer:
        "The Trim & Baseboard Length Estimator helps contractors and DIYers accurately calculate the amount of trim or baseboard material needed to cover a room's perimeter. By inputting the total length of the area and selecting material sizes, users can estimate the number of units required, factoring in waste to avoid shortages or excess.",
    },
    {
      question: "Why is it important to include a waste percentage in the calculation?",
      answer:
        "Including a waste percentage accounts for material lost due to cutting errors, fitting adjustments, and damaged pieces. This safety margin ensures you order enough material to complete the job without unexpected shortages, which can cause delays and additional costs.",
    },
    {
      question: "How do I choose between standard and large material sizes?",
      answer:
        "Standard and large sizes refer to the length of each baseboard or trim piece. Standard sizes are typically 8 feet (2.4 meters), while large sizes can be 12 feet (3.6 meters) or longer. Choosing larger pieces can reduce the number of joints and seams but may be harder to handle or transport. Consider your project's requirements and logistics when selecting the size.",
    },
    {
      question: "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, the calculator supports both metric (meters) and imperial (feet) units. Simply select your preferred unit system, and input your measurements accordingly. The calculator will adjust material sizes and outputs to match the chosen system.",
    },
    {
      question: "How accurate are the cost estimates provided?",
      answer:
        "Cost estimates are based on the price per unit length you input and the calculated number of units needed. While the calculator provides a good approximation, actual costs may vary due to taxes, discounts, or supplier pricing changes. Always verify prices with your supplier before ordering.",
    },
    {
      question: "What should I do if my room has irregular shapes or multiple rooms?",
      answer:
        "For irregular shapes or multiple rooms, measure the perimeter of each area separately and sum the lengths to get the total trim length needed. You can then input the combined length into the calculator. For complex projects, consider consulting a professional estimator.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing baseboards around a living room with a total perimeter of 25 feet. You want to order standard 8-foot baseboard pieces and include a 10% waste margin to account for cuts and mistakes.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Total perimeter length = 25 ft",
      },
      {
        label: "2. Waste",
        explanation: "Add 10% waste: 25 ft × 1.10 = 27.5 ft total length needed",
      },
      {
        label: "3. Order",
        explanation: "Divide total length by piece length: 27.5 ft ÷ 8 ft = 3.44 → round up to 4 units",
      },
    ],
    result: "Final Order: 4 units of 8-foot baseboard",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Units Needed = ⌈ (Total Length × (1 + Waste %)) ÷ Piece Length ⌉",
    variables: [
      { symbol: "Total Length", description: "Total perimeter length of the area (meters or feet)" },
      { symbol: "Waste %", description: "Waste margin percentage expressed as a decimal (e.g., 0.10 for 10%)" },
      { symbol: "Piece Length", description: "Length of one baseboard or trim piece (meters or feet)" },
      { symbol: "⌈ ⌉", description: "Ceiling function to round up to the nearest whole unit" },
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

      {/* Length Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Total Perimeter Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={`Enter length in ${inputs.unit === "metric" ? "meters" : "feet"}`}
          />
        </div>

        {/* Material Size */}
        <div className="space-y-2">
          <Label>Material Size</Label>
          <Select value={inputs.materialSize} onValueChange={(v) => handleInputChange("materialSize", v)}>
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Size ({inputs.unit === "metric" ? "2.4 m" : "8 ft"})</SelectItem>
              <SelectItem value="large">Large Size ({inputs.unit === "metric" ? "3.6 m" : "12 ft"})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Waste Margin (%)</Label>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-2 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between font-semibold text-blue-600">{inputs.waste}%</div>
            <Slider
              value={[parseInt(inputs.waste) || 10]}
              min={0}
              max={25}
              step={1}
              onValueChange={(v) => handleInputChange("waste", v[0].toString())}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Price per Unit ({inputs.unit === "metric" ? "per piece" : "per piece"})</Label>
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

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg flex items-center justify-center gap-2"
        onClick={() => {}}
        type="button"
      >
        <Hammer className="h-5 w-5" /> Calculate
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Trim & Baseboard Length Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Trim and baseboards are essential finishing touches in any construction or renovation project. They cover the joint between the wall and floor, adding aesthetic appeal and protecting walls from damage. Accurately estimating the length of trim or baseboard material needed is crucial to avoid costly overordering or frustrating shortages during installation.
          </p>
          <p>
            The Trim & Baseboard Length Estimator calculator simplifies this process by allowing you to input the total perimeter length of the area to be trimmed, select the size of the material pieces, and include a waste margin to account for cutting and fitting losses. This ensures you purchase the right amount of material for your project.
          </p>
          <p>
            Precision matters because ordering too little material can cause project delays and increase costs due to rush orders or additional trips to the supplier. Conversely, ordering too much leads to wasted materials and unnecessary expenses. Including a waste factor is a standard industry practice to balance these risks.
          </p>
          <p>
            Common material types for trim and baseboards include wood (pine, oak, MDF), PVC, and composite materials. Each type comes in standard lengths, typically 8 or 12 feet (2.4 or 3.6 meters). Selecting the appropriate size depends on your project's requirements, handling capabilities, and aesthetic preferences.
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
            <strong>Tip:</strong> Always measure the perimeter twice and add a little extra length to your estimate to avoid surprises.
          </li>
          <li>
            <strong>Did You Know?</strong> Using longer baseboard pieces reduces the number of joints, resulting in a cleaner, more professional look.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Label each piece as you cut it to speed up installation and reduce confusion on site.
          </li>
          <li>
            <strong>Tip:</strong> When working with irregular room shapes, break down the perimeter into smaller straight sections for more accurate measurement.
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
            <strong>1. Underestimating Waste:</strong> Failing to include a waste margin can lead to ordering insufficient material, causing delays and extra costs.
          </p>
          <p>
            <strong>2. Mixing Units:</strong> Confusing metric and imperial units during measurement or ordering can result in incorrect quantities and mismatched materials.
          </p>
          <p>
            <strong>3. Ignoring Material Size:</strong> Not accounting for the length of each trim piece can cause you to order too few or too many units.
          </p>
          <p>
            <strong>4. Skipping Measurement Verification:</strong> Relying on rough estimates without double-checking measurements often leads to errors in material calculation.
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Trim & Baseboard Length Estimator"
      description="The ultimate professional guide and calculator for Trim & Baseboard Length Estimator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}