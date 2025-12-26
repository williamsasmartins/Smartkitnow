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

export default function FlooringMaterialCostCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    width: "",
    waste: "10", // waste percentage
    price: "",
    materialSize: "standard", // standard or large plank/sheet size
    materialType: "laminate", // laminate, hardwood, vinyl, tile
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Material coverage sizes in square meters or square feet per unit (plank, tile, sheet)
  // Approximate typical sizes:
  // Laminate: standard plank ~0.2 m² (2.15 ft²), large plank ~0.3 m² (3.2 ft²)
  // Hardwood: standard plank ~0.15 m² (1.6 ft²), large plank ~0.25 m² (2.7 ft²)
  // Vinyl: standard sheet ~1.0 m² (10.76 ft²), large sheet ~1.5 m² (16.15 ft²)
  // Tile: standard tile ~0.25 m² (2.7 ft²), large tile ~0.5 m² (5.4 ft²)

  const materialCoverage = useMemo(() => {
    const sizesMetric = {
      laminate: { standard: 0.2, large: 0.3 },
      hardwood: { standard: 0.15, large: 0.25 },
      vinyl: { standard: 1.0, large: 1.5 },
      tile: { standard: 0.25, large: 0.5 },
    };
    const sizesImperial = {
      laminate: { standard: 2.15, large: 3.2 },
      hardwood: { standard: 1.6, large: 2.7 },
      vinyl: { standard: 10.76, large: 16.15 },
      tile: { standard: 2.7, large: 5.4 },
    };
    return inputs.unit === "metric"
      ? sizesMetric[inputs.materialType][inputs.materialSize]
      : sizesImperial[inputs.materialType][inputs.materialSize];
  }, [inputs.unit, inputs.materialType, inputs.materialSize]);

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const wastePercent = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);

    if (
      isNaN(lengthNum) ||
      isNaN(widthNum) ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      isNaN(wastePercent) ||
      wastePercent < 0 ||
      isNaN(priceNum) ||
      priceNum < 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Invalid input values",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Calculate total area
    // Metric: m², Imperial: ft²
    const area = lengthNum * widthNum;

    // Add waste margin
    const areaWithWaste = area * (1 + wastePercent / 100);

    // Calculate units needed (round up to next whole unit)
    const unitsNeeded = Math.ceil(areaWithWaste / materialCoverage);

    // Calculate cost
    const totalCost = unitsNeeded * priceNum;

    // Format output strings
    const unitLabel = (() => {
      switch (inputs.materialType) {
        case "laminate":
        case "hardwood":
          return "Planks";
        case "vinyl":
          return "Sheets";
        case "tile":
          return "Tiles";
        default:
          return "Units";
      }
    })();

    return {
      mainQty: `${unitsNeeded.toLocaleString()} ${unitLabel}`,
      cost: `$${totalCost.toFixed(2)}`,
      details: `Base area: ${area.toFixed(2)} ${inputs.unit === "metric" ? "m²" : "ft²"} × (1 + ${wastePercent}%) waste`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs.length, inputs.width, inputs.waste, inputs.price, materialCoverage, inputs.materialType, inputs.unit]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is a Flooring Material Cost Estimator and why is it important?",
      answer:
        "A Flooring Material Cost Estimator is a tool used to calculate the amount of flooring material needed for a project based on the dimensions of the area and the type of material selected. It helps contractors and homeowners avoid ordering too much or too little material, saving money and reducing waste. Accurate estimation ensures project efficiency and timely completion.",
    },
    {
      question: "How does waste percentage affect the flooring material calculation?",
      answer:
        "Waste percentage accounts for extra material needed due to cutting, fitting, mistakes, and damage during installation. Typically, a 5-15% waste margin is added depending on the complexity of the layout and material type. Including waste ensures you have enough material to complete the job without costly delays or additional orders.",
    },
    {
      question: "What are the common types of flooring materials and their typical sizes?",
      answer:
        "Common flooring materials include laminate, hardwood, vinyl, and tile. Laminate and hardwood come in planks of varying sizes, vinyl is often sold in sheets, and tile comes in square or rectangular pieces. Each material type has standard and large sizes, which affect how many units are needed to cover a given area.",
    },
    {
      question: "Can I use this estimator for both metric and imperial units?",
      answer:
        "Yes, the estimator supports both metric (meters) and imperial (feet) units. Simply select your preferred unit system, and input your dimensions accordingly. The calculator automatically adjusts material coverage sizes and outputs results in the selected unit system.",
    },
    {
      question: "How do I determine the price per unit for accurate cost estimation?",
      answer:
        "The price per unit should be based on the cost of a single plank, tile, or sheet of your chosen flooring material. Check with your supplier or retailer for current prices. Entering an accurate price per unit ensures the cost estimate reflects real-world expenses for budgeting and purchasing.",
    },
    {
      question: "What if my flooring area has irregular shapes or multiple rooms?",
      answer:
        "For irregular shapes or multiple rooms, measure each section separately and sum their areas to get the total floor area. Alternatively, measure the longest length and width encompassing the entire space and add a higher waste percentage to account for cuts and complexity. Always round up your material units to avoid shortages.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing laminate flooring in a rectangular living room measuring 5 meters by 4 meters. You choose standard size laminate planks and want to include a 10% waste margin. Each plank covers 0.2 square meters and costs $3.50.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Calculate the area: 5 m × 4 m = 20 m².",
      },
      {
        label: "2. Waste",
        explanation: "Add 10% waste: 20 m² × 1.10 = 22 m² total coverage needed.",
      },
      {
        label: "3. Order",
        explanation: "Divide total area by plank coverage: 22 m² ÷ 0.2 m² = 110 planks. Round up to 110 planks.",
      },
    ],
    result: "Final Order: 110 Planks costing $385.00",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Units Needed = ⌈ (Length × Width) × (1 + Waste%) ÷ Material Coverage per Unit ⌉",
    variables: [
      { symbol: "Length", description: "Length of the flooring area" },
      { symbol: "Width", description: "Width of the flooring area" },
      { symbol: "Waste%", description: "Waste margin percentage (expressed as decimal)" },
      { symbol: "Material Coverage per Unit", description: "Area covered by one unit of flooring material" },
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
            <SelectItem value="metric">Metric (m)</SelectItem>
            <SelectItem value="imperial">Imperial (ft)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs: Length, Width */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={`Enter length in ${inputs.unit === "metric" ? "meters" : "feet"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Width ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder={`Enter width in ${inputs.unit === "metric" ? "meters" : "feet"}`}
          />
        </div>
      </div>

      {/* Material Type & Size */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Material Type</Label>
          <Select value={inputs.materialType} onValueChange={(v) => handleInputChange("materialType", v)}>
            <SelectTrigger>
              <HardHat className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="laminate">Laminate</SelectItem>
              <SelectItem value="hardwood">Hardwood</SelectItem>
              <SelectItem value="vinyl">Vinyl</SelectItem>
              <SelectItem value="tile">Tile</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Item Size</Label>
          <Select value={inputs.materialSize} onValueChange={(v) => handleInputChange("materialSize", v)}>
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
      </div>

      {/* Price per Unit */}
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

      {/* Waste Margin Slider */}
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Flooring Material Cost Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            A Flooring Material Cost Estimator is an essential tool for anyone planning to install new flooring. It calculates the quantity of flooring units required based on the dimensions of the area and the type of flooring material selected. This helps ensure you purchase the right amount of material, avoiding costly shortages or excess waste.
          </p>
          <p>
            Precision in measurement and calculation is critical because flooring materials are often sold in fixed sizes such as planks, tiles, or sheets. Ordering too few units can delay your project, while ordering too many leads to unnecessary expenses and leftover materials. Including a waste margin accounts for cutting, fitting, and potential damage during installation.
          </p>
          <p>
            Flooring materials vary widely in type and size. Common types include laminate, hardwood, vinyl, and tile. Each has standard and large size options that affect coverage per unit. For example, laminate planks typically cover around 0.2 square meters, while vinyl sheets cover about 1 square meter. Selecting the correct material type and size in the estimator ensures accurate calculations.
          </p>
          <p>
            This estimator supports both metric and imperial units, allowing you to input dimensions in meters or feet. It also factors in a customizable waste percentage and price per unit to provide a comprehensive cost estimate. By using this tool, you can confidently plan your flooring project with professional accuracy.
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
            <strong>Tip:</strong> Always measure your flooring area twice and consider irregular shapes separately to improve accuracy.
          </li>
          <li>
            <strong>Did You Know?</strong> Some flooring materials, like vinyl sheets, come in rolls that can be cut to size, reducing waste compared to fixed-size planks or tiles.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Adding a 10% waste margin is standard, but complex patterns or diagonal installations may require up to 15% waste.
          </li>
          <li>
            <strong>Tip:</strong> When ordering, round up to the nearest whole unit to avoid shortages during installation.
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
            <strong>1. Underestimating Waste:</strong> Failing to include an adequate waste margin can lead to running out of material mid-project, causing delays and extra costs.
          </p>
          <p>
            <strong>2. Incorrect Unit Conversion:</strong> Mixing metric and imperial units without proper conversion can result in inaccurate calculations and ordering errors.
          </p>
          <p>
            <strong>3. Ignoring Material Size Variations:</strong> Not accounting for the actual coverage area of your chosen material size can cause you to order too few or too many units.
          </p>
          <p>
            <strong>4. Skipping Price Verification:</strong> Using outdated or estimated prices per unit can lead to budget overruns or underfunding your project.
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
      title="Flooring Material Cost Estimator"
      description="The ultimate professional guide and calculator for Flooring Material Cost Estimator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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