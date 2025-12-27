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

export default function SidingPanelCoverageCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "", // length of wall/area
    height: "", // height of wall/area
    panelWidth: "", // width of one siding panel
    panelHeight: "", // height of one siding panel
    waste: "10", // waste percentage
    price: "", // price per panel
    materialType: "vinyl", // material type for info
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion helpers
  const toMeters = (val: number) =>
    inputs.unit === "imperial" ? val * 0.3048 : val;
  const toFeet = (val: number) =>
    inputs.unit === "metric" ? val / 0.3048 : val;

  // Calculate coverage and units needed
  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const heightNum = parseFloat(inputs.height);
    const panelWidthNum = parseFloat(inputs.panelWidth);
    const panelHeightNum = parseFloat(inputs.panelHeight);
    const wastePercent = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);

    if (
      !lengthNum ||
      !heightNum ||
      !panelWidthNum ||
      !panelHeightNum ||
      lengthNum <= 0 ||
      heightNum <= 0 ||
      panelWidthNum <= 0 ||
      panelHeightNum <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive numbers for all dimensions.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Convert all dimensions to meters for calculation consistency
    const lengthM = toMeters(lengthNum);
    const heightM = toMeters(heightNum);
    const panelWidthM = toMeters(panelWidthNum);
    const panelHeightM = toMeters(panelHeightNum);

    // Total wall area in square meters
    const totalArea = lengthM * heightM;

    // Single panel coverage area in square meters
    const panelArea = panelWidthM * panelHeightM;

    if (panelArea === 0) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Panel dimensions must be greater than zero.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Raw number of panels needed without waste
    const rawPanels = totalArea / panelArea;

    // Add waste margin
    const panelsWithWaste = rawPanels * (1 + wastePercent / 100);

    // Round up to next whole panel
    const panelsRounded = Math.ceil(panelsWithWaste);

    // Calculate cost if price provided
    const totalCost =
      priceNum && priceNum > 0 ? panelsRounded * priceNum : 0;

    // Format cost string
    const costStr = totalCost
      ? `$${totalCost.toFixed(2)}`
      : "Price not set";

    // Format details string
    const detailsStr = `Raw panels needed: ${rawPanels.toFixed(
      2
    )}, with waste: ${panelsWithWaste.toFixed(2)}`;

    return {
      mainQty: `${panelsRounded} Units`,
      cost: costStr,
      details: detailsStr,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is a siding panel coverage calculator and how does it work?",
      answer:
        "A siding panel coverage calculator helps contractors and homeowners estimate the number of siding panels required to cover a given wall or surface area. By inputting the dimensions of the wall and the size of the siding panels, the calculator computes the total area and divides it by the panel coverage area. It also factors in a waste margin to account for cutting, mistakes, and overlaps, ensuring you order enough material without excessive surplus.",
    },
    {
      question:
        "Why is it important to include a waste margin in siding calculations?",
      answer:
        "Including a waste margin is crucial because siding installation often involves cutting panels to fit around windows, doors, corners, and other architectural features. Additionally, panels can be damaged during transport or installation. A typical waste margin ranges from 5% to 15%, depending on the complexity of the project. This buffer helps prevent costly delays caused by running out of materials mid-project.",
    },
    {
      question:
        "How do different siding materials affect panel coverage and ordering?",
      answer:
        "Different siding materials come in various panel sizes and thicknesses, which directly impact coverage calculations. For example, vinyl siding panels are often larger and lighter, while fiber cement panels may be smaller but heavier. Some materials require overlapping or special installation techniques that reduce effective coverage area. Knowing the exact panel dimensions and material type ensures accurate quantity estimates and cost calculations.",
    },
    {
      question:
        "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, this calculator supports both metric (meters) and imperial (feet) units. Simply select your preferred unit system, and input all dimensions accordingly. The calculator internally converts measurements as needed to ensure accurate calculations regardless of the unit system chosen.",
    },
    {
      question:
        "What are common mistakes to avoid when estimating siding panel coverage?",
      answer:
        "Common mistakes include not measuring the wall dimensions accurately, forgetting to account for windows and doors, neglecting to add a waste margin, and using incorrect panel sizes. Additionally, mixing units or failing to convert between metric and imperial can lead to significant errors. Always double-check measurements and inputs before ordering materials.",
    },
    {
      question:
        "How can I estimate the total cost of siding panels using this calculator?",
      answer:
        "To estimate total cost, enter the price per siding panel in the calculator. After calculating the number of panels needed (including waste), the calculator multiplies this quantity by the unit price to provide an estimated total cost. This helps with budgeting and comparing different material options.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are siding a rectangular wall that measures 30 feet in length and 10 feet in height. You plan to use vinyl siding panels that are 12 inches wide and 48 inches tall. You want to include a 10% waste margin to account for cuts and mistakes.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Convert all measurements to feet: Wall area = 30 ft × 10 ft = 300 sq ft. Panel area = 1 ft × 4 ft = 4 sq ft.",
      },
      {
        label: "2. Calculate Panels Needed",
        explanation:
          "Raw panels = 300 sq ft ÷ 4 sq ft = 75 panels.",
      },
      {
        label: "3. Add Waste",
        explanation:
          "Add 10% waste: 75 × 1.10 = 82.5 panels, round up to 83 panels.",
      },
      {
        label: "4. Order",
        explanation:
          "Order 83 vinyl siding panels to cover the wall with waste included.",
      },
    ],
    result: "Final Order: 83 Panels",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Panels Needed = ⌈ (Wall Length × Wall Height) ÷ (Panel Width × Panel Height) × (1 + Waste %) ⌉",
    variables: [
      { symbol: "Wall Length", description: "Length of the wall or surface" },
      { symbol: "Wall Height", description: "Height of the wall or surface" },
      { symbol: "Panel Width", description: "Width of one siding panel" },
      { symbol: "Panel Height", description: "Height of one siding panel" },
      {
        symbol: "Waste %",
        description:
          "Waste margin percentage to account for cuts and errors",
      },
      {
        symbol: "⌈ ⌉",
        description: "Ceiling function to round up to the nearest whole panel",
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
          <Label>Wall Length ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "metric" ? "10" : "30"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Wall Height ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "metric" ? "3" : "10"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Panel Width ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.panelWidth}
            onChange={(e) => handleInputChange("panelWidth", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "metric" ? "0.3" : "1"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Panel Height ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.panelHeight}
            onChange={(e) => handleInputChange("panelHeight", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "metric" ? "1.2" : "4"}`}
          />
        </div>
      </div>

      {/* Material Type */}
      <div className="space-y-2">
        <Label>Material Type</Label>
        <Select
          value={inputs.materialType}
          onValueChange={(v) => handleInputChange("materialType", v)}
        >
          <SelectTrigger>
            <HardHat className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vinyl">Vinyl</SelectItem>
            <SelectItem value="fiber-cement">Fiber Cement</SelectItem>
            <SelectItem value="wood">Wood</SelectItem>
            <SelectItem value="metal">Metal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Waste Margin (%)</Label>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-2 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between">
              <span>{inputs.waste}%</span>
            </div>
            <Slider
              value={[parseInt(inputs.waste)]}
              min={0}
              max={25}
              step={1}
              onValueChange={(v) => handleInputChange("waste", v[0].toString())}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Price per Panel</Label>
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
          <BookOpen className="w-6 h-6 text-blue-500" />
          Professional Guide: Siding Panel Coverage Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            A siding panel coverage calculator is an essential tool for anyone
            involved in exterior construction or renovation projects. It helps
            you accurately estimate the number of siding panels required to
            cover a wall or surface area based on your measurements and panel
            sizes. This ensures you order the right amount of material,
            minimizing waste and saving money.
          </p>
          <p>
            Precision matters because siding installation often involves
            cutting panels to fit around windows, doors, corners, and other
            architectural features. Without an accurate estimate, you risk
            ordering too few panels, causing delays, or too many, resulting in
            unnecessary expense.
          </p>
          <p>
            Different siding materials such as vinyl, fiber cement, wood, and
            metal come in various panel sizes and thicknesses. Each material
            type has unique installation requirements and coverage areas. This
            calculator lets you input your specific panel dimensions and
            material type to provide tailored estimates.
          </p>
          <p>
            By including a waste margin, the calculator accounts for cutting
            losses, mistakes, and damaged panels. Typically, a 5-15% waste
            factor is recommended depending on project complexity.
          </p>
          <p>
            Using this tool will help you plan your siding project more
            efficiently, reduce material costs, and avoid common pitfalls in
            ordering siding panels.
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
            <strong>Tip:</strong> Always measure your wall dimensions at
            multiple points and use the largest measurements to avoid
            underestimating.
          </li>
          <li>
            <strong>Did You Know?</strong> Vinyl siding panels typically overlap
            during installation, which slightly reduces effective coverage per
            panel. Make sure to use the net coverage size when available.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering an extra 10% of panels
            upfront can save time and money by preventing multiple small orders
            and shipping fees.
          </li>
          <li>
            <strong>Tip:</strong> When working with irregularly shaped walls,
            break the area into rectangles, calculate coverage for each, then
            sum totals.
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
            <strong>1. Incorrect Measurements:</strong> Failing to measure wall
            length and height accurately or mixing units can lead to ordering
            too few or too many panels.
          </p>
          <p>
            <strong>2. Ignoring Waste Margin:</strong> Not including a waste
            factor can cause shortages during installation, leading to delays
            and extra costs.
          </p>
          <p>
            <strong>3. Using Nominal Panel Sizes:</strong> Some siding panels
            have nominal sizes that differ from actual coverage due to
            overlapping edges. Always use net coverage dimensions.
          </p>
          <p>
            <strong>4. Forgetting Openings:</strong> Not subtracting areas for
            windows, doors, or vents can result in over-ordering.
          </p>
          <p>
            <strong>5. Not Rounding Up:</strong> Always round up to the next
            whole panel to ensure you have enough material.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="scroll-mt-24">
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
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">

          <li>
            <a href="https://www.thisoldhouse.com/search?q=Siding%20Installation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Siding Installation - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Siding Installation from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Siding%20Installation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Siding Installation - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Siding Installation, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.constructiondive.com/search/?q=Siding%20Installation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Siding Installation - Construction Dive
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Latest news and trends in the construction industry regarding Siding Installation.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Siding Panel Coverage Calculator"
      description="The ultimate professional guide and calculator for Siding Panel Coverage Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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