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

export default function CfmCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    width: "",
    depth: "", // depth or height/thickness
    waste: "10", // percent waste margin
    price: "",
    materialSize: "standard", // standard or large unit size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Material unit yields (example: bags or sheets per cubic feet or meters)
  // For demonstration, assume:
  // Standard size unit covers 0.03 cubic meters (approx 1 cubic foot)
  // Large size unit covers 0.05 cubic meters (approx 1.76 cubic feet)
  // Price per unit is user input

  const results = useMemo(() => {
    // Parse inputs
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const depth = parseFloat(inputs.depth);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);

    if (
      isNaN(length) ||
      isNaN(width) ||
      isNaN(depth) ||
      length <= 0 ||
      width <= 0 ||
      depth <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Convert all to meters if imperial
    // 1 foot = 0.3048 meters
    const conversionFactor = inputs.unit === "imperial" ? 0.3048 : 1;

    const lengthM = length * conversionFactor;
    const widthM = width * conversionFactor;
    const depthM = depth * conversionFactor;

    // Calculate volume in cubic meters
    const volume = lengthM * widthM * depthM;

    // Add waste margin
    const volumeWithWaste = volume * (1 + wastePercent / 100);

    // Determine unit volume yield
    const unitVolumeYield =
      inputs.materialSize === "standard" ? 0.03 : 0.05; // cubic meters per unit

    // Calculate required units, round up to whole units
    const unitsNeeded = Math.ceil(volumeWithWaste / unitVolumeYield);

    // Calculate cost
    const totalCost = pricePerUnit && !isNaN(pricePerUnit) ? unitsNeeded * pricePerUnit : 0;

    return {
      mainQty: `${unitsNeeded.toLocaleString()} Units`,
      cost: `$${totalCost.toFixed(2)}`,
      details: `Raw Volume: ${volume.toFixed(3)} m³ | With Waste: ${volumeWithWaste.toFixed(
        3
      )} m³`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What exactly does the CFM Calculator measure?",
      answer:
        "The CFM Calculator estimates the quantity of material units required to fill a given volume based on length, width, and depth dimensions. It calculates the volume of the space and converts it into material units, factoring in waste and unit size to provide an accurate order quantity.",
    },
    {
      question: "Why is it important to include a waste margin in calculations?",
      answer:
        "Including a waste margin accounts for material loss due to cutting, spillage, or installation errors. This safety factor ensures you order enough material to complete the job without costly delays or shortages, improving project efficiency and reducing the risk of running out.",
    },
    {
      question: "How do I choose between standard and large material sizes?",
      answer:
        "Standard and large sizes refer to the volume each unit covers. Large sizes cover more volume per unit, potentially reducing the number of units needed and simplifying logistics. Choose based on availability, project requirements, and cost-effectiveness.",
    },
    {
      question: "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, the calculator supports metric (meters) and imperial (feet) units. It automatically converts imperial inputs to metric internally for consistent volume calculations, ensuring accurate results regardless of your preferred measurement system.",
    },
    {
      question: "How accurate are the cost estimates provided?",
      answer:
        "Cost estimates are based on the price per unit you enter and the calculated number of units needed. While the calculator provides a solid baseline, actual costs may vary due to taxes, delivery fees, or supplier pricing fluctuations. Always confirm prices with your supplier.",
    },
    {
      question: "What are common mistakes to avoid when using this calculator?",
      answer:
        "Common mistakes include entering incorrect units, forgetting to add a waste margin, or not verifying material unit sizes. Always double-check your inputs and understand the material specifications to ensure accurate calculations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing a concrete slab measuring 5 meters long, 3 meters wide, and 0.15 meters deep. You want to order concrete bags with a standard size unit covering 0.03 cubic meters, and you want to include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Calculate volume: 5m × 3m × 0.15m = 2.25 cubic meters.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 2.25 × 1.10 = 2.475 cubic meters total volume needed.",
      },
      {
        label: "3. Order",
        explanation:
          "Divide total volume by unit yield: 2.475 ÷ 0.03 = 82.5 units. Round up to 83 units.",
      },
    ],
    result: "Final Order: 83 Bags of concrete.",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Volume = Length × Width × Depth",
    variables: [
      { symbol: "L", description: "Length of the area" },
      { symbol: "W", description: "Width of the area" },
      { symbol: "D", description: "Depth or Thickness of the material" },
    ],
  };

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
          aria-label="Select measurement unit"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="length">Length</Label>
          <Input
            id="length"
            type="number"
            min="0"
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
            min="0"
            step="any"
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="depth">Depth / Thickness</Label>
          <Input
            id="depth"
            type="number"
            min="0"
            step="any"
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="materialSize">Item Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
            aria-label="Select material size"
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Size (0.03 m³)</SelectItem>
              <SelectItem value="large">Large Size (0.05 m³)</SelectItem>
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
              min="0"
              step="0.01"
              placeholder="0.00"
              value={inputs.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
            />
          </div>
        </div>
      </div>

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
          aria-label="Waste margin slider"
        />
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" type="button" aria-label="Calculate materials needed">
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
          <BookOpen className="w-6 h-6 text-blue-500" />
          Professional Guide: CFM Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The CFM Calculator is a vital tool used in construction and material estimation to calculate the volume of a given space and determine the number of material units required to fill that space. CFM stands for Cubic Feet per Minute in HVAC contexts, but here it refers to calculating cubic volume for materials such as concrete, soil, or insulation. By inputting the dimensions of length, width, and depth, you can quickly estimate the total volume and translate that into material units.
          </p>
          <p>
            Precision in these calculations is crucial. Overestimating material needs can lead to unnecessary expenses and waste, while underestimating can cause project delays and additional costs due to last-minute orders. This calculator helps balance accuracy with practical waste margins to ensure you order just enough material.
          </p>
          <p>
            Different materials come in various unit sizes and packaging. For example, concrete bags, insulation sheets, or soil bags each have a standard volume they cover. This calculator allows you to select between standard and large unit sizes to better match your material specifications and optimize ordering.
          </p>
          <p>
            Whether you are working in metric or imperial units, the calculator converts your inputs internally to maintain consistency and accuracy. It also factors in a waste margin, which you can adjust based on your project's complexity and expected material loss.
          </p>
          <p>
            Use this tool to streamline your material estimation process, reduce waste, and keep your construction projects on budget and on schedule.
          </p>
        </div>
      </section>

      {/* 5. TIPS / DID YOU KNOW */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Pro Tips & Curiosities
        </h3>
        <ul className="space-y-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>Tip:</strong> Always measure twice and input dimensions carefully. Small errors in length, width, or depth can exponentially affect volume calculations.
          </li>
          <li>
            <strong>Did You Know?</strong> Adding a waste margin of 10-15% is standard practice in construction to cover unforeseen material loss, but complex projects might require up to 20-25%.
          </li>
          <li>
            <strong>Contractor Secret:</strong> When ordering materials, rounding up to the nearest whole unit ensures you never run short, which can save costly downtime.
          </li>
          <li>
            <strong>Tip:</strong> Use the large size material option if available; it can reduce the number of units needed and simplify handling and storage.
          </li>
          <li>
            <strong>Did You Know?</strong> This calculator converts imperial inputs to metric internally, so you can confidently work in your preferred measurement system without manual conversions.
          </li>
        </ul>
      </section>

      {/* 6. MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" />
          Common Mistakes to Avoid
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Forgetting Unit Consistency:</strong> Mixing metric and imperial units without proper conversion leads to wildly inaccurate volume calculations. Always select the correct unit system before entering dimensions.
          </p>
          <p>
            <strong>2. Skipping Waste Margin:</strong> Not including a waste margin can cause material shortages, project delays, and increased costs due to emergency orders.
          </p>
          <p>
            <strong>3. Incorrect Material Size Selection:</strong> Using the wrong unit size for your material can result in ordering too many or too few units. Verify your material specifications before selecting.
          </p>
          <p>
            <strong>4. Rounding Down Quantities:</strong> Always round up your material units to ensure you have enough. Rounding down can leave you short and disrupt your workflow.
          </p>
          <p>
            <strong>5. Ignoring Price Input:</strong> Leaving the price per unit blank or incorrect will cause inaccurate cost estimates, affecting your budgeting and bidding.
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
      title="CFM Calculator"
      description="The ultimate professional guide and calculator for CFM Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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