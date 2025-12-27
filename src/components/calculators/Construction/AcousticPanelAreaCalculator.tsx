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

export default function AcousticPanelAreaCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "", // length of the wall/area
    width: "", // width of the wall/area
    panelThickness: "", // thickness of acoustic panel (depth)
    waste: "10", // waste percentage
    price: "", // price per unit
    materialSize: "standard", // standard or large panel size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Constants for panel sizes (area per unit)
  // Standard size: 0.6m x 0.6m = 0.36 m², Large size: 1.2m x 0.6m = 0.72 m²
  // Imperial: Standard 2ft x 2ft = 4 ft², Large 4ft x 2ft = 8 ft²
  const panelSizes = {
    metric: {
      standard: 0.36, // m²
      large: 0.72, // m²
    },
    imperial: {
      standard: 4, // ft²
      large: 8, // ft²
    },
  };

  // Convert inputs to numbers
  const lengthNum = parseFloat(inputs.length);
  const widthNum = parseFloat(inputs.width);
  const thicknessNum = parseFloat(inputs.panelThickness);
  const wastePercent = parseFloat(inputs.waste);
  const priceNum = parseFloat(inputs.price);
  const unit = inputs.unit;
  const materialSize = inputs.materialSize;

  // Calculate total area to cover (Length x Width)
  // Thickness is not used for area calculation but can be used for volume or cost if needed
  // For acoustic panels, area coverage is the main factor
  const results = useMemo(() => {
    if (
      isNaN(lengthNum) ||
      isNaN(widthNum) ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      isNaN(wastePercent) ||
      wastePercent < 0 ||
      wastePercent > 25 ||
      !panelSizes[unit][materialSize]
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Invalid input values",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Calculate total area (Length x Width)
    const totalArea = lengthNum * widthNum; // m² or ft² depending on unit

    // Calculate raw units needed (area / panel area)
    const panelArea = panelSizes[unit][materialSize];
    const rawUnits = totalArea / panelArea;

    // Add waste margin
    const unitsWithWaste = rawUnits * (1 + wastePercent / 100);

    // Round up to next whole unit
    const finalUnits = Math.ceil(unitsWithWaste);

    // Calculate cost if price provided
    const cost = priceNum && priceNum > 0 ? finalUnits * priceNum : 0;

    return {
      mainQty: `${finalUnits} Unit${finalUnits !== 1 ? "s" : ""}`,
      cost: cost > 0 ? `$${cost.toFixed(2)}` : "N/A",
      details: `Raw units: ${rawUnits.toFixed(2)} (Area: ${totalArea.toFixed(2)} ${unit === "metric" ? "m²" : "ft²"})`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [lengthNum, widthNum, wastePercent, priceNum, unit, materialSize, inputs.waste]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is the Acoustic Panel Area Planner and how does it help?",
      answer:
        "The Acoustic Panel Area Planner is a tool designed to help contractors and installers accurately estimate the number of acoustic panels required to cover a specified area. By inputting the dimensions of the space and selecting panel sizes, users can calculate material quantities, factoring in waste margins to avoid shortages or excess. This ensures efficient budgeting and project planning.",
    },
    {
      question: "Why is precision important when calculating acoustic panel quantities?",
      answer:
        "Precision in calculating acoustic panel quantities is crucial because underestimating can lead to project delays and increased costs due to last-minute orders, while overestimating results in wasted materials and budget overruns. Accurate measurements and waste considerations help maintain project timelines and optimize resource allocation.",
    },
    {
      question: "What types of acoustic panel materials are commonly used?",
      answer:
        "Common acoustic panel materials include fiberglass, foam, mineral wool, and fabric-wrapped panels. Each material offers different sound absorption properties, thickness options, and aesthetic finishes. The choice depends on the acoustic requirements, installation environment, and budget constraints.",
    },
    {
      question: "How do I decide between standard and large panel sizes?",
      answer:
        "Choosing between standard and large panel sizes depends on the installation area and design preferences. Large panels cover more area and reduce installation time but may be heavier and harder to handle. Standard panels offer more flexibility for irregular spaces and easier handling. Consider the project scope and labor when selecting panel sizes.",
    },
    {
      question: "How should I account for waste when ordering acoustic panels?",
      answer:
        "Waste accounts for material loss due to cutting, fitting, and installation errors. Typically, a 5-15% waste margin is added depending on project complexity. This calculator allows you to adjust the waste percentage to ensure you order enough panels without significant surplus, balancing cost and efficiency.",
    },
    {
      question: "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, the Acoustic Panel Area Planner supports both metric (meters) and imperial (feet) units. Simply select your preferred unit system, and the calculator will adjust the panel size values and output accordingly, ensuring accurate estimations regardless of measurement preference.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing standard acoustic panels on a wall measuring 5 meters in length and 3 meters in height. You want to include a 10% waste margin and know the price per panel is $25.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Calculate total area: 5m (length) × 3m (height) = 15 m².",
      },
      {
        label: "2. Calculate Raw Units",
        explanation:
          "Each standard panel covers 0.36 m², so 15 ÷ 0.36 = 41.67 panels needed.",
      },
      {
        label: "3. Add Waste",
        explanation:
          "Add 10% waste: 41.67 × 1.10 = 45.83 panels, round up to 46 panels.",
      },
      {
        label: "4. Calculate Cost",
        explanation: "46 panels × $25 = $1,150 total estimated cost.",
      },
    ],
    result: "Final Order: 46 Standard Panels, Estimated Cost: $1,150",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Units Needed = (Length × Width) / Panel Area × (1 + Waste%)",
    variables: [
      { symbol: "Length", description: "Length of the area to cover" },
      { symbol: "Width", description: "Width or height of the area to cover" },
      { symbol: "Panel Area", description: "Coverage area of one acoustic panel" },
      { symbol: "Waste%", description: "Waste margin percentage (e.g., 0.10 for 10%)" },
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

      {/* Inputs for Length, Width, Thickness */}
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
          <Label>Width / Height ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
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
          <Label>Panel Thickness ({inputs.unit === "metric" ? "mm" : "inches"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.panelThickness}
            onChange={(e) => handleInputChange("panelThickness", e.target.value)}
            placeholder="e.g. 50"
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Panel Size</Label>
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
          value={[parseInt(inputs.waste) || 10]}
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Acoustic Panel Area Planner
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Acoustic panels are essential components in controlling sound quality within a space by absorbing unwanted noise and reducing echo. The Acoustic Panel Area Planner is a specialized tool designed to help professionals accurately estimate the number of panels required to cover a given area, ensuring optimal acoustic performance and cost efficiency.
          </p>
          <p>
            Precision in measurement and calculation is critical when planning acoustic panel installations. Overestimating materials can lead to unnecessary expenses and waste, while underestimating can cause project delays and insufficient sound treatment. This planner accounts for dimensions, panel sizes, and waste margins to provide reliable estimates.
          </p>
          <p>
            Acoustic panels come in various materials such as fiberglass, foam, mineral wool, and fabric-wrapped options. Each material offers different sound absorption qualities and thicknesses, affecting both performance and installation requirements. Selecting the right panel size—standard or large—can also impact installation speed and material usage.
          </p>
          <p>
            By inputting your project's dimensions and preferences into this calculator, you can quickly determine the number of panels needed, adjust for waste, and estimate costs. This ensures you order the correct quantity, optimize your budget, and maintain professional standards throughout your acoustic treatment project.
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
            <strong>Tip:</strong> Always measure twice and consider irregular wall shapes by breaking them into smaller rectangles for more accurate panel quantity calculations.
          </li>
          <li>
            <strong>Did You Know?</strong> Using larger panels can reduce installation time but may require more careful handling due to their weight and size.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering an extra 5-10% panels as waste margin can save costly delays caused by cutting errors or last-minute adjustments.
          </li>
          <li>
            <strong>Tip:</strong> When working in imperial units, remember that 1 foot = 12 inches, and panel thickness is often specified in inches rather than feet.
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
            <strong>1. Ignoring Waste Margins:</strong> Failing to include a waste margin can result in insufficient panels, causing project delays and increased costs due to rush orders.
          </p>
          <p>
            <strong>2. Incorrect Unit Conversion:</strong> Mixing metric and imperial units without proper conversion leads to inaccurate calculations and material shortages or excess.
          </p>
          <p>
            <strong>3. Overlooking Panel Size Differences:</strong> Not accounting for the actual coverage area of different panel sizes can cause ordering too many or too few panels.
          </p>
          <p>
            <strong>4. Neglecting Irregular Surfaces:</strong> Assuming all walls are perfect rectangles can underestimate the needed panels when dealing with windows, doors, or angled walls.
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
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">

          <li>
            <a href="https://www.thisoldhouse.com/search?q=Acoustic%20Treatment" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Acoustic Treatment - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Acoustic Treatment from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Acoustic%20Treatment" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Acoustic Treatment - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Acoustic Treatment, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.energy.gov/search/site?keywords=Acoustic%20Treatment" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Acoustic Treatment - Energy.gov
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Official Department of Energy guidelines for energy efficiency and Acoustic Treatment to save money and improve home comfort.
            </p>
          </li>
          <li>
            <a href="https://www.ashrae.org/search?q=Acoustic%20Treatment" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Acoustic Treatment - ASHRAE
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Technical standards and guidelines for HVAC and building systems related to Acoustic Treatment.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Acoustic Panel Area Planner"
      description="The ultimate professional guide and calculator for Acoustic Panel Area Planner. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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