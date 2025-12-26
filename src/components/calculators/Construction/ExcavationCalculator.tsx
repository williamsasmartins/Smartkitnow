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

export default function ExcavationCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "",
    width: "",
    depth: "",
    waste: "10", // percentage waste margin
    price: "",
    materialSize: "standard", // standard or large unit size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion constants
  const FEET_TO_METERS = 0.3048;
  const CUBIC_FEET_TO_CUBIC_METERS = 0.0283168;

  // Material unit yields (volume per unit)
  // For example, standard unit = 1 cubic meter, large unit = 1.5 cubic meters
  // These can be adjusted based on typical material packaging or delivery units
  const materialUnitVolumes = {
    standard: 1, // cubic meters
    large: 1.5, // cubic meters
  };

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const depthNum = parseFloat(inputs.depth);
    const wasteNum = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    const materialSize = inputs.materialSize;

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
        wasteInfo: `+${wasteNum}% Waste included`,
      };
    }

    // Convert all dimensions to meters if imperial
    let lengthM = lengthNum;
    let widthM = widthNum;
    let depthM = depthNum;

    if (inputs.unit === "imperial") {
      lengthM = lengthNum * FEET_TO_METERS;
      widthM = widthNum * FEET_TO_METERS;
      depthM = depthNum * FEET_TO_METERS;
    }

    // Calculate volume in cubic meters
    const rawVolume = lengthM * widthM * depthM;

    // Add waste margin
    const totalVolume = rawVolume * (1 + wasteNum / 100);

    // Calculate units needed based on material size volume
    const unitVolume = materialUnitVolumes[materialSize] || 1;
    const unitsNeeded = Math.ceil(totalVolume / unitVolume);

    // Calculate cost if price per unit is provided
    const totalCost = priceNum && priceNum > 0 ? unitsNeeded * priceNum : 0;

    return {
      mainQty: `${unitsNeeded.toLocaleString()} Unit${unitsNeeded > 1 ? "s" : ""}`,
      cost: totalCost > 0 ? `$${totalCost.toFixed(2)}` : "N/A",
      details: `Raw Volume: ${rawVolume.toFixed(3)} m³, Total with Waste: ${totalVolume.toFixed(
        3
      )} m³`,
      wasteInfo: `+${wasteNum}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is an excavation calculator and how does it work?",
      answer:
        "An excavation calculator helps estimate the volume of soil or material to be removed or filled in a construction project. By inputting the dimensions of the excavation area—length, width, and depth—the calculator computes the total volume. It also factors in a waste margin to account for soil compaction, spillage, or measurement inaccuracies, ensuring you order the right amount of material or equipment.",
    },
    {
      question: "Why is precision important when calculating excavation volumes?",
      answer:
        "Precision in excavation calculations is crucial because underestimating volume can lead to material shortages, project delays, and increased costs due to last-minute orders. Overestimating results in excess material, waste, and unnecessary expenses. Accurate calculations help optimize resource allocation, reduce environmental impact, and maintain project timelines and budgets.",
    },
    {
      question: "What types of materials can I calculate with this excavation calculator?",
      answer:
        "This calculator is designed for generic excavation materials such as soil, gravel, sand, or crushed stone. Different materials have varying densities and packaging sizes, so while the calculator provides volume estimates, you should adjust unit sizes and prices according to the specific material you plan to use.",
    },
    {
      question: "How do I choose between metric and imperial units?",
      answer:
        "Select the unit system based on your project location or preference. Metric units use meters for dimensions and cubic meters for volume, while imperial units use feet and cubic feet. The calculator automatically converts imperial inputs to metric internally for consistent volume calculations.",
    },
    {
      question: "What is the purpose of the waste margin in excavation calculations?",
      answer:
        "The waste margin accounts for extra material needed beyond the calculated volume to cover losses due to compaction, spillage, uneven terrain, or measurement errors. Typically, a 5-15% waste margin is recommended to ensure you have enough material without significant over-ordering.",
    },
    {
      question: "How do material unit sizes affect the calculation?",
      answer:
        "Material unit size refers to the volume contained in one delivery unit, such as a bag, cubic yard, or truckload. Choosing the correct unit size helps convert the total volume into practical order quantities. For example, a standard unit might be 1 cubic meter, while a large unit could be 1.5 cubic meters, affecting how many units you need to order.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are excavating a rectangular foundation for a small shed. The dimensions are 4 meters long, 3 meters wide, and 0.5 meters deep. You want to include a 10% waste margin and order standard-sized material units.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Calculate volume: 4 m × 3 m × 0.5 m = 6 cubic meters.",
      },
      {
        label: "2. Waste",
        explanation: "Add 10% waste margin: 6 m³ × 1.10 = 6.6 cubic meters total.",
      },
      {
        label: "3. Order",
        explanation:
          "Divide total volume by unit size (1 m³): 6.6 ÷ 1 = 6.6 units, round up to 7 units.",
      },
    ],
    result: "Final Order: 7 standard units of material.",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Volume = Length × Width × Depth",
    variables: [
      { symbol: "L", description: "Length of the excavation area" },
      { symbol: "W", description: "Width of the excavation area" },
      { symbol: "D", description: "Depth or thickness of the excavation" },
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
            placeholder="e.g. 3"
          />
        </div>
        <div className="space-y-2">
          <Label>Depth ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder="e.g. 0.5"
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
              <SelectItem value="standard">Standard Size (1 m³)</SelectItem>
              <SelectItem value="large">Large Size (1.5 m³)</SelectItem>
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Excavation Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            An excavation calculator is an essential tool for construction professionals and DIY enthusiasts alike. It helps determine the volume of earth or material that needs to be removed or filled for a project. By inputting the dimensions of the excavation area—length, width, and depth—you can quickly estimate the total volume, saving time and reducing errors in manual calculations.
          </p>
          <p>
            Precision in excavation calculations is critical. Underestimating the volume can cause costly delays and material shortages, while overestimating leads to waste and unnecessary expenses. Including a waste margin accounts for soil compaction, spillage, and measurement inaccuracies, ensuring you order enough material without significant surplus.
          </p>
          <p>
            Excavation materials vary widely, from soil and gravel to sand and crushed stone. Each material has different densities and packaging sizes. This calculator uses volume as the basis for estimation, allowing you to adjust unit sizes and prices according to the specific material you plan to use. Whether you are ordering bags, truckloads, or bulk deliveries, this tool helps convert volume into practical material units.
          </p>
          <p>
            The calculator supports both metric and imperial units, automatically converting inputs to maintain accuracy. By selecting your preferred unit system and entering the excavation dimensions, waste margin, and material unit size, you can obtain a reliable estimate of the materials needed and the approximate cost.
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
            <strong>Tip:</strong> Always measure excavation dimensions multiple times and from different points to account for irregularities in the terrain.
          </li>
          <li>
            <strong>Did You Know?</strong> Soil expands when excavated, sometimes up to 30%, so adding a waste margin helps cover this volume increase.
          </li>
          <li>
            <strong>Contractor Secret:</strong> When ordering bulk materials, ask suppliers about their typical delivery unit volumes to better match your project needs.
          </li>
          <li>
            <strong>Tip:</strong> Use the calculator's waste margin slider to adjust based on site conditions—higher waste margins for rocky or uneven sites.
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
            <strong>1. Incorrect Unit Selection:</strong> Mixing metric and imperial units without proper conversion can lead to massive miscalculations. Always double-check your unit settings before entering dimensions.
          </p>
          <p>
            <strong>2. Ignoring Waste Margin:</strong> Failing to include a waste margin often results in ordering insufficient material, causing project delays and additional costs.
          </p>
          <p>
            <strong>3. Rounding Too Early:</strong> Rounding intermediate calculations can accumulate errors. Always perform calculations with full precision and round only the final order quantity.
          </p>
          <p>
            <strong>4. Not Verifying Material Unit Sizes:</strong> Assuming standard unit sizes without confirming with suppliers can cause ordering too much or too little material.
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Excavation Calculator"
      description="The ultimate professional guide and calculator for Excavation Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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