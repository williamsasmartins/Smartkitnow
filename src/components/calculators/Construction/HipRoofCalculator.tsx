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

export default function HipRoofCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "", // base length of the building
    width: "", // base width of the building
    height: "", // roof height (hip height)
    waste: "10", // waste percentage
    price: "", // price per unit material
    materialSize: "standard", // standard or large size material units
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion helpers
  const toMeters = (val: number) => (inputs.unit === "imperial" ? val * 0.3048 : val);
  const toFeet = (val: number) => (inputs.unit === "metric" ? val / 0.3048 : val);

  // Hip Roof Surface Area Calculation:
  // Hip roof has 4 sloping sides: 2 trapezoids (length sides) and 2 triangles (width sides)
  // Calculate the slant height (l) using Pythagoras:
  // l = sqrt((width/2)^2 + height^2)
  // Area trapezoid side = (length * l)
  // Area triangle side = (width/2 * l)
  // Total area = 2 * trapezoid + 2 * triangle

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const heightNum = parseFloat(inputs.height);
    const wastePercent = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    if (
      isNaN(lengthNum) ||
      isNaN(widthNum) ||
      isNaN(heightNum) ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      heightNum <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Convert inputs to meters for calculation consistency
    const L = toMeters(lengthNum);
    const W = toMeters(widthNum);
    const H = toMeters(heightNum);

    // Slant height (l)
    const l = Math.sqrt((W / 2) ** 2 + H ** 2);

    // Area trapezoid sides (2 sides)
    const areaTrapezoid = L * l * 2;

    // Area triangle sides (2 sides)
    const areaTriangle = (W / 2) * l * 2;

    // Total roof surface area (m²)
    const totalArea = areaTrapezoid + areaTriangle;

    // Add waste margin
    const totalAreaWithWaste = totalArea * (1 + wastePercent / 100);

    // Material unit size in m²
    // Standard size = 1.5 m² per unit, Large size = 2.5 m² per unit (example)
    const materialUnitSize = inputs.materialSize === "large" ? 2.5 : 1.5;

    // Calculate required units, round up to next whole unit
    const unitsRequired = Math.ceil(totalAreaWithWaste / materialUnitSize);

    // Calculate cost if price provided
    const cost = priceNum > 0 ? (unitsRequired * priceNum).toFixed(2) : "0.00";

    // Format results based on unit system
    const areaDisplay =
      inputs.unit === "imperial"
        ? `${(totalAreaWithWaste * 10.7639).toFixed(2)} ft²` // convert m² to ft²
        : `${totalAreaWithWaste.toFixed(2)} m²`;

    return {
      mainQty: `${unitsRequired} Units`,
      cost: `$${cost}`,
      details: `Total roof surface area (incl. waste): ${areaDisplay}`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is a hip roof and how does this calculator help?",
      answer:
        "A hip roof is a type of roof where all sides slope downwards to the walls, usually with a gentle slope. This calculator estimates the amount of roofing material needed by calculating the total surface area of the hip roof, including waste margin, helping contractors and builders order the correct quantity of materials.",
    },
    {
      question: "Why is it important to include a waste margin in roofing calculations?",
      answer:
        "Including a waste margin accounts for material losses due to cutting, fitting, and errors during installation. It ensures that you have enough materials on site to complete the job without delays or additional orders, which can increase costs and extend project timelines.",
    },
    {
      question: "How do I measure the height input for the hip roof?",
      answer:
        "The height input refers to the vertical distance from the top of the wall plate to the peak of the roof (the ridge). This is often called the 'hip height' or 'roof rise'. Accurate measurement is crucial as it affects the slant height calculation and ultimately the surface area estimation.",
    },
    {
      question: "Can I use this calculator for different roofing materials?",
      answer:
        "Yes, this calculator estimates the surface area and converts it into material units based on the selected material size. You can adjust the 'Item Size' and 'Price per Unit' inputs to match different roofing materials such as shingles, metal panels, or tiles.",
    },
    {
      question: "What unit system should I use, metric or imperial?",
      answer:
        "Use the unit system that matches your project measurements. Metric units use meters and square meters, while imperial units use feet and square feet. The calculator converts inputs accordingly to provide accurate results.",
    },
    {
      question: "How does the material size affect the calculation?",
      answer:
        "Material size determines the coverage area per unit of roofing material. Standard sizes cover less area per unit, requiring more units, while large sizes cover more area per unit, reducing the number of units needed. Selecting the correct size ensures accurate quantity and cost estimation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a hip roof for a rectangular building measuring 12 meters in length, 8 meters in width, with a roof height of 3 meters. You want to order standard size roofing panels and include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Input Length = 12 m, Width = 8 m, Height = 3 m into the calculator. The calculator computes the slant height and total roof surface area.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin to the total surface area to account for cutting and fitting losses.",
      },
      {
        label: "3. Order",
        explanation:
          "Divide the total adjusted surface area by the coverage area of one standard size panel (1.5 m²) and round up to the nearest whole number to get the units to order.",
      },
    ],
    result: "Final Order: 38 Units of standard size roofing panels",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Total Area = 2 × (Length × Slant Height) + 2 × (½ × Width × Slant Height), where Slant Height = √((Width/2)² + Height²)",
    variables: [
      { symbol: "L", description: "Length of the building base" },
      { symbol: "W", description: "Width of the building base" },
      { symbol: "H", description: "Vertical height of the roof (hip height)" },
      { symbol: "l", description: "Slant height of the roof side" },
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
          <Label>Length</Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Width</Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Roof Height</Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Item Size</Label>
          <Select value={inputs.materialSize} onValueChange={(v) => handleInputChange("materialSize", v)}>
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Size (1.5 m²/unit)</SelectItem>
              <SelectItem value="large">Large Size (2.5 m²/unit)</SelectItem>
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Hip Roof Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            A hip roof is a popular roofing style where all sides slope downwards to the walls, typically with a gentle pitch.
            Unlike gable roofs, hip roofs have no vertical ends, providing better stability and resistance to wind. Calculating the
            amount of roofing material needed for a hip roof requires understanding its geometry and surface area.
          </p>
          <p>
            Precision in these calculations is crucial. Overestimating materials can lead to unnecessary expenses and waste, while
            underestimating can cause project delays and additional costs. This calculator uses the building's base dimensions and
            roof height to estimate the total surface area of the hip roof, factoring in waste margins for accuracy.
          </p>
          <p>
            Different roofing materials come in various sizes and coverage areas. Common materials include asphalt shingles,
            metal panels, and clay tiles. This tool allows you to select material sizes to tailor the calculation to your specific
            product, ensuring you order the right quantity.
          </p>
          <p>
            Always measure carefully and consider local building codes and climate conditions when planning your roofing project.
            This calculator is designed to assist professionals and DIY enthusiasts alike in making informed decisions.
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
            <strong>Tip:</strong> Always double-check your roof height measurement from the wall plate to the ridge for accurate
            slant height calculation.
          </li>
          <li>
            <strong>Did You Know?</strong> Hip roofs are more wind-resistant than gable roofs due to their sloping sides on all
            four directions.
          </li>
          <li>
            <strong>Contractor Secret:</strong> When ordering materials, round up generously to avoid last-minute shortages,
            especially if your roof has complex features like dormers or valleys.
          </li>
          <li>
            <strong>Tip:</strong> Use the waste slider to adjust the margin based on your team's experience and material type.
            Some materials require more cutting and fitting.
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
            <strong>1. Incorrect Measurements:</strong> Using wall height instead of roof height or mixing units can lead to
            significant errors in material estimation.
          </p>
          <p>
            <strong>2. Ignoring Waste Margin:</strong> Failing to include a waste factor often results in insufficient materials,
            causing project delays and extra costs.
          </p>
          <p>
            <strong>3. Misunderstanding Material Coverage:</strong> Not accounting for the actual coverage area per material unit
            can cause under or over-ordering.
          </p>
          <p>
            <strong>4. Not Converting Units Properly:</strong> Mixing metric and imperial units without conversion leads to
            inaccurate calculations.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="scroll-mt-24">
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
      title="Hip Roof Calculator"
      description="The ultimate professional guide and calculator for Hip Roof Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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