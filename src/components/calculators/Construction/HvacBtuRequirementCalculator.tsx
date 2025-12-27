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

export default function HvacBtuRequirementCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "",
    width: "",
    height: "",
    waste: "10", // waste margin in %
    price: "",
    materialSize: "standard", // standard or large (affects BTU per unit)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Constants for BTU per cubic meter or cubic foot by material size
  // These are example values for typical HVAC BTU requirements per volume unit.
  // Standard size: 500 BTU per cubic meter (metric), 14,000 BTU per cubic foot (imperial)
  // Large size: 600 BTU per cubic meter, 17,000 BTU per cubic foot
  // These can represent typical cooling/heating loads per volume for HVAC design.
  const BTU_PER_UNIT = {
    metric: {
      standard: 500,
      large: 600,
    },
    imperial: {
      standard: 14000,
      large: 17000,
    },
  };

  // Material unit sizes and yields (example: 1 unit covers X BTU)
  // For simplicity, assume one material unit provides a fixed BTU capacity.
  // Standard unit: 10,000 BTU capacity
  // Large unit: 15,000 BTU capacity
  const MATERIAL_UNIT_BTU_CAPACITY = {
    standard: 10000,
    large: 15000,
  };

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const height = parseFloat(inputs.height);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);
    const unit = inputs.unit;
    const materialSize = inputs.materialSize;

    if (
      isNaN(length) ||
      isNaN(width) ||
      isNaN(height) ||
      length <= 0 ||
      width <= 0 ||
      height <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Calculate volume in cubic meters or cubic feet
    // Metric: meters, Imperial: feet
    const volume = length * width * height;

    // Calculate base BTU requirement for the volume
    const baseBTU = volume * BTU_PER_UNIT[unit][materialSize];

    // Add waste margin
    const totalBTU = baseBTU * (1 + wastePercent / 100);

    // Calculate number of material units needed (round up)
    const unitsNeeded = Math.ceil(
      totalBTU / MATERIAL_UNIT_BTU_CAPACITY[materialSize]
    );

    // Calculate estimated cost
    const cost =
      !isNaN(pricePerUnit) && pricePerUnit > 0
        ? (unitsNeeded * pricePerUnit).toFixed(2)
        : null;

    return {
      mainQty: `${unitsNeeded} Unit${unitsNeeded !== 1 ? "s" : ""}`,
      cost: cost ? `$${cost}` : "Enter price per unit",
      details: `Volume: ${volume.toFixed(
        2
      )} ${unit === "metric" ? "m³" : "ft³"} × ${
        BTU_PER_UNIT[unit][materialSize]
      } BTU/unit volume = ${baseBTU.toFixed(0)} BTU base`,
      wasteInfo: `+${wastePercent}% Waste included → Total BTU: ${totalBTU.toFixed(
        0
      )}`,
    };
  }, [
    inputs.length,
    inputs.width,
    inputs.height,
    inputs.waste,
    inputs.price,
    inputs.unit,
    inputs.materialSize,
  ]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question:
        "What is the HVAC BTU Requirement Calculator and how does it help in HVAC design?",
      answer:
        "The HVAC BTU Requirement Calculator estimates the total heating or cooling capacity needed for a given space based on its dimensions. By calculating the volume and applying typical BTU per volume values, it helps contractors and engineers determine the appropriate HVAC equipment size. This ensures efficient climate control, energy savings, and occupant comfort.",
    },
    {
      question:
        "Why is it important to include a waste margin in BTU calculations?",
      answer:
        "Including a waste margin accounts for unforeseen factors such as heat loss, insulation imperfections, or future changes in space usage. This safety buffer prevents under-sizing HVAC equipment, which can lead to inadequate heating or cooling, increased energy consumption, and premature wear of the system. Typically, a 10% waste margin is recommended for reliable performance.",
    },
    {
      question:
        "How do different material sizes affect the BTU requirement and unit calculations?",
      answer:
        "Material size refers to the capacity or efficiency of HVAC components or materials used. Larger size materials generally provide higher BTU capacity per unit, reducing the total number of units needed. Selecting the right material size balances upfront costs with installation complexity and operational efficiency.",
    },
    {
      question:
        "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, the calculator supports both metric (meters) and imperial (feet) units. It automatically adjusts BTU per volume values and unit calculations based on the selected measurement system, ensuring accurate results regardless of your preferred units.",
    },
    {
      question:
        "How do I interpret the results and use them for ordering HVAC materials?",
      answer:
        "The calculator outputs the number of material units required to meet the BTU demand, including waste margin. Use this quantity to order HVAC equipment or materials, ensuring you have enough capacity for the space. Additionally, if you enter the price per unit, the calculator provides an estimated total cost to assist budgeting.",
    },
    {
      question:
        "What are common mistakes to avoid when using the HVAC BTU Requirement Calculator?",
      answer:
        "Common mistakes include entering incorrect dimensions, forgetting to select the correct unit system, neglecting to add a waste margin, and not updating the price per unit for cost estimates. Always double-check inputs and understand the assumptions behind BTU per volume values for accurate results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are designing HVAC for a room measuring 5 meters long, 4 meters wide, and 3 meters high. You want to use standard size materials and include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate the volume: 5 m × 4 m × 3 m = 60 m³. Multiply by BTU per cubic meter (500 BTU): 60 × 500 = 30,000 BTU base requirement.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 30,000 × 1.10 = 33,000 BTU total requirement.",
      },
      {
        label: "3. Order",
        explanation:
          "Divide total BTU by material unit capacity (10,000 BTU): 33,000 ÷ 10,000 = 3.3 → round up to 4 units to order.",
      },
    ],
    result: "Final Order: 4 Units of standard size HVAC material.",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Total BTU = Length × Width × Height × BTU per unit volume × (1 + Waste Margin)",
    variables: [
      { symbol: "Length", description: "Length of the space (meters or feet)" },
      { symbol: "Width", description: "Width of the space (meters or feet)" },
      { symbol: "Height", description: "Height of the space (meters or feet)" },
      {
        symbol: "BTU per unit volume",
        description:
          "Heating or cooling BTU required per cubic meter or cubic foot",
      },
      {
        symbol: "Waste Margin",
        description: "Additional percentage to cover inefficiencies and waste",
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
        <div className="space-y-2">
          <Label>Height ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder="e.g. 3"
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Material Size</Label>
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
              min={0}
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
            <p className="text-xs text-slate-500 mt-1">{results.wasteInfo}</p>
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: HVAC BTU
          Requirement Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The HVAC BTU Requirement Calculator is a vital tool for contractors,
            engineers, and HVAC professionals to accurately estimate the heating or
            cooling capacity needed for any given space. By inputting the room's
            dimensions and selecting the appropriate material size, this calculator
            determines the total BTUs required to maintain comfortable indoor
            temperatures efficiently.
          </p>
          <p>
            Precision in BTU calculations is crucial because undersized HVAC systems
            struggle to maintain desired temperatures, leading to increased energy
            consumption and equipment wear. Conversely, oversized systems waste
            energy and increase upfront costs. This calculator incorporates a waste
            margin to provide a safety buffer, ensuring reliable performance.
          </p>
          <p>
            Different material sizes correspond to HVAC components or materials with
            varying BTU capacities. Standard size materials offer a baseline BTU
            output, while large size materials provide higher capacity per unit,
            reducing the number of units needed. Selecting the right size balances
            cost, efficiency, and installation complexity.
          </p>
          <p>
            This calculator supports both metric and imperial units, automatically
            adjusting calculations to your preferred measurement system. It also
            allows you to input price per unit to estimate total project costs,
            helping you plan budgets effectively.
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
            <strong>Tip 1:</strong> Always double-check your room dimensions and
            unit selections before finalizing calculations to avoid costly errors.
          </li>
          <li>
            <strong>Did You Know?</strong> Adding a waste margin of 10-15% is a
            common industry practice to cover installation inefficiencies and future
            changes in space usage.
          </li>
          <li>
            <strong>Tip 2:</strong> Larger material sizes can reduce the number of
            units needed but may require different installation techniques or
            equipment.
          </li>
          <li>
            <strong>Contractor Secret:</strong> When in doubt, consult local HVAC
            codes and standards to ensure your BTU calculations meet regulatory
            requirements.
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
            <strong>1. Incorrect Dimensions:</strong> Entering wrong or inconsistent
            length, width, or height values leads to inaccurate BTU requirements.
            Always measure carefully and use consistent units.
          </p>
          <p>
            <strong>2. Forgetting Waste Margin:</strong> Neglecting to add a waste
            margin can cause undersized HVAC systems that fail to meet heating or
            cooling demands.
          </p>
          <p>
            <strong>3. Mixing Units:</strong> Switching between metric and imperial
            units without adjusting inputs or understanding the system can cause
            errors.
          </p>
          <p>
            <strong>4. Ignoring Material Size Impact:</strong> Using the wrong
            material size selection skews unit quantity and cost estimates.
          </p>
          <p>
            <strong>5. Skipping Price Input:</strong> Not entering price per unit
            results in incomplete cost estimations, affecting budgeting accuracy.
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
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">

          <li>
            <a href="https://www.thisoldhouse.com/search?q=HVAC%20Sizing" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              HVAC Sizing - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on HVAC Sizing from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=HVAC%20Sizing" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              HVAC Sizing - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for HVAC Sizing, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.energy.gov/search/site?keywords=HVAC%20Sizing" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              HVAC Sizing - Energy.gov
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Official Department of Energy guidelines for energy efficiency and HVAC Sizing to save money and improve home comfort.
            </p>
          </li>
          <li>
            <a href="https://www.ashrae.org/search?q=HVAC%20Sizing" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              HVAC Sizing - ASHRAE
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Technical standards and guidelines for HVAC and building systems related to HVAC Sizing.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="HVAC BTU Requirement Calculator"
      description="The ultimate professional guide and calculator for HVAC BTU Requirement Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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
        { id: "references", label: "References & Resources" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}