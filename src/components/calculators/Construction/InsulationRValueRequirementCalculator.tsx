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

export default function InsulationRValueRequirementCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    width: "",
    depth: "", // thickness of insulation (meters or feet)
    targetRValue: "", // required R-Value for the area
    waste: "10", // waste percentage
    price: "",
    materialSize: "standard", // standard or large sheet/roll size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Material properties for common insulation types:
   * - Fiberglass Batt: R-Value per inch ~ 3.1 to 3.4
   * - Rigid Foam Board: R-Value per inch ~ 5.0
   * - Spray Foam: R-Value per inch ~ 6.0 to 7.0
   *
   * For simplicity, assume material R-Value per unit thickness:
   * - standard: 3.5 per inch (fiberglass batt)
   * - large: 5.0 per inch (rigid foam board)
   *
   * Material unit sizes (for ordering):
   * - standard: 1.2m x 2.4m sheet (approx 8.3 sqft)
   * - large: 1.2m x 3.6m sheet (approx 12.9 sqft)
   *
   * For imperial, convert accordingly.
   */

  // Conversion constants
  const INCHES_PER_METER = 39.3701;
  const SQFT_PER_SQM = 10.7639;

  // Material R-Value per inch by size/type
  const materialRValuePerInch = {
    standard: 3.5, // fiberglass batt
    large: 5.0, // rigid foam board
  };

  // Material sheet sizes in square meters
  const materialSheetSizeSqm = {
    standard: 1.2 * 2.4, // 2.88 sqm
    large: 1.2 * 3.6, // 4.32 sqm
  };

  // Calculate required thickness of insulation to meet target R-Value:
  // Thickness (inches) = Target R-Value / R-Value per inch
  // Then convert thickness to meters or feet accordingly.

  // Calculate total surface area (Length x Width)
  // Calculate total volume of insulation needed = Area x Thickness

  // Calculate number of material units needed = total area / sheet area
  // Add waste margin

  // Calculate cost estimate = units * price per unit

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const depth = parseFloat(inputs.depth);
    const targetRValue = parseFloat(inputs.targetRValue);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);
    const materialSize = inputs.materialSize;

    if (
      !length ||
      !width ||
      !depth ||
      !targetRValue ||
      isNaN(length) ||
      isNaN(width) ||
      isNaN(depth) ||
      isNaN(targetRValue)
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter all required inputs.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Convert thickness to inches for R-Value calculation
    let thicknessInches = 0;
    if (inputs.unit === "metric") {
      thicknessInches = depth * INCHES_PER_METER;
    } else {
      thicknessInches = depth; // already in feet, convert feet to inches
      thicknessInches = thicknessInches * 12;
    }

    // Calculate achievable R-Value with given thickness and material type
    const rValuePerInch = materialRValuePerInch[materialSize];
    const achievableRValue = thicknessInches * rValuePerInch;

    // Check if achievable R-Value meets target
    if (achievableRValue < targetRValue) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: `Given thickness does not meet target R-Value. Increase thickness or choose higher R-Value material.`,
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Calculate surface area in square meters or square feet
    let area = 0;
    if (inputs.unit === "metric") {
      area = length * width; // sqm
    } else {
      area = length * width; // sqft (feet x feet)
      area = area / SQFT_PER_SQM; // convert sqft to sqm for material sheet calc
    }

    // Calculate number of sheets needed (area / sheet area)
    const sheetArea = materialSheetSizeSqm[materialSize];
    let baseUnits = area / sheetArea;

    // Add waste margin
    const totalUnits = Math.ceil(baseUnits * (1 + wastePercent / 100));

    // Calculate cost
    const totalCost =
      pricePerUnit && !isNaN(pricePerUnit)
        ? (totalUnits * pricePerUnit).toFixed(2)
        : "0.00";

    return {
      mainQty: `${totalUnits} Units`,
      cost: `$${totalCost}`,
      details: `Base units: ${baseUnits.toFixed(2)} sheets (Area: ${area.toFixed(
        2
      )} m²)`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [
    inputs.length,
    inputs.width,
    inputs.depth,
    inputs.targetRValue,
    inputs.waste,
    inputs.price,
    inputs.materialSize,
    inputs.unit,
  ]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question:
        "How do I determine the correct R-Value requirement for my insulation project?",
      answer:
        "The R-Value requirement depends on your local climate zone, building codes, and the specific area you are insulating (walls, attic, floors). Consult local building regulations or energy efficiency guidelines to find the minimum R-Value needed. Higher R-Values provide better insulation but may cost more.",
    },
    {
      question:
        "Why is it important to include a waste margin when ordering insulation materials?",
      answer:
        "Including a waste margin accounts for cutting losses, fitting around obstacles, and potential mistakes during installation. Typically, a 10% waste margin is recommended to ensure you have enough material without costly shortages or multiple orders.",
    },
    {
      question:
        "Can I use this calculator for different types of insulation materials?",
      answer:
        "Yes, but you need to select the appropriate material size and understand the R-Value per inch for your chosen insulation type. This calculator uses typical values for fiberglass batt and rigid foam board insulation. For other materials like spray foam, manual adjustments may be necessary.",
    },
    {
      question:
        "How do I convert between metric and imperial units in this calculator?",
      answer:
        "You can switch between metric (meters) and imperial (feet) units using the unit selector. The calculator automatically converts thickness and area measurements to ensure accurate calculations regardless of the unit system.",
    },
    {
      question:
        "What happens if the insulation thickness I enter does not meet the target R-Value?",
      answer:
        "The calculator will notify you that the given thickness does not meet the target R-Value. You should increase the thickness or select a material with a higher R-Value per inch to meet your insulation requirements.",
    },
    {
      question:
        "How is the number of insulation units calculated in this tool?",
      answer:
        "The tool calculates the total surface area to be insulated, divides it by the coverage area of a single insulation sheet or roll, and then adds a waste margin. The result is rounded up to the nearest whole unit to ensure you order enough material.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are insulating a wall that measures 5 meters long by 3 meters high, and you need an R-Value of 20. You plan to use standard fiberglass batt insulation sheets.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate the surface area: 5m (length) × 3m (height) = 15 m².",
      },
      {
        label: "2. Thickness & R-Value Check",
        explanation:
          "You enter a thickness of 0.15m (15 cm). Convert to inches: 0.15 × 39.37 = 5.9 inches. With fiberglass batt R-Value ~3.5 per inch, achievable R-Value = 5.9 × 3.5 = 20.65, which meets the target.",
      },
      {
        label: "3. Waste Margin",
        explanation:
          "Add 10% waste margin to the base units calculated from area and sheet size.",
      },
      {
        label: "4. Order",
        explanation:
          "Divide total area by sheet coverage (2.88 m² for standard size) and add waste, then round up to whole sheets.",
      },
    ],
    result: "Final Order: 6 Sheets of standard fiberglass batt insulation",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Units Needed = ⌈ (Area / Sheet Area) × (1 + Waste %) ⌉, where Area = Length × Width",
    variables: [
      { symbol: "Length", description: "Length of the area to insulate" },
      { symbol: "Width", description: "Width or height of the area" },
      { symbol: "Sheet Area", description: "Coverage area per insulation unit" },
      { symbol: "Waste %", description: "Percentage of extra material for waste" },
      {
        symbol: "⌈ ⌉",
        description: "Ceiling function to round up to nearest whole unit",
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
        <div className="space-y-2">
          <Label>Width/Height ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder="e.g. 3"
          />
        </div>
        <div className="space-y-2">
          <Label>
            Insulation Thickness ({inputs.unit === "metric" ? "meters" : "feet"})
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder="e.g. 0.15"
          />
        </div>
        <div className="space-y-2">
          <Label>Target R-Value</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.targetRValue}
            onChange={(e) => handleInputChange("targetRValue", e.target.value)}
            placeholder="e.g. 20"
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
              <SelectItem value="standard">Standard Size (1.2m x 2.4m)</SelectItem>
              <SelectItem value="large">Large Size (1.2m x 3.6m)</SelectItem>
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
              min="0"
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
          Professional Guide: Insulation R-Value Requirement Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The Insulation R-Value Requirement Calculator is a vital tool for
            contractors, builders, and homeowners aiming to achieve optimal
            energy efficiency in their buildings. It helps determine the amount
            of insulation material needed to meet a specified R-Value, which
            measures thermal resistance. By inputting the dimensions of the
            area and the desired R-Value, users can accurately estimate the
            quantity of insulation units required.
          </p>
          <p>
            Precision in calculating insulation requirements is crucial. Over-
            or underestimating material needs can lead to increased costs,
            wasted resources, or insufficient insulation performance. This
            calculator incorporates waste margins to account for cutting,
            fitting, and installation losses, ensuring you order the right
            amount.
          </p>
          <p>
            Various insulation materials offer different R-Values per inch of
            thickness. Common types include fiberglass batts, rigid foam boards,
            and spray foam. This tool primarily supports fiberglass and rigid
            foam by allowing selection of material size and typical R-Value
            ratings, helping you tailor calculations to your chosen product.
          </p>
          <p>
            Whether you are insulating walls, attics, or floors, this calculator
            simplifies the process of translating thermal resistance
            requirements into practical material orders, saving time and money
            on your construction or renovation project.
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
            <strong>Tip:</strong> Always verify local building codes for minimum
            R-Value requirements before ordering insulation materials.
          </li>
          <li>
            <strong>Did You Know?</strong> Fiberglass batts are one of the most
            cost-effective insulation types but require precise installation to
            avoid gaps that reduce effectiveness.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering slightly larger sheets
            can reduce installation time and waste, especially in irregular
            spaces.
          </li>
          <li>
            <strong>Tip:</strong> Use the waste margin slider to adjust for your
            project's complexity—higher waste for tricky layouts.
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
            <strong>1. Mistake:</strong> Neglecting to convert units properly when
            switching between metric and imperial systems can cause major
            miscalculations in material quantities.
          </p>
          <p>
            <strong>2. Mistake:</strong> Using insulation thickness that does not
            meet the target R-Value leads to poor energy efficiency and potential
            code violations.
          </p>
          <p>
            <strong>3. Mistake:</strong> Forgetting to include a waste margin
            often results in insufficient materials, causing project delays and
            additional costs.
          </p>
          <p>
            <strong>4. Mistake:</strong> Assuming all insulation materials have
            the same R-Value per inch can cause ordering incorrect quantities.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-500" />
          Frequently Asked Questions
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
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">

          <li>
            <a href="https://www.thisoldhouse.com/search?q=Insulation%20R-Value" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Insulation R-Value - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Insulation R-Value from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Insulation%20R-Value" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Insulation R-Value - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Insulation R-Value, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.energy.gov/search/site?keywords=Insulation%20R-Value" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Insulation R-Value - Energy.gov
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Official Department of Energy guidelines for energy efficiency and Insulation R-Value to save money and improve home comfort.
            </p>
          </li>
          <li>
            <a href="https://www.ashrae.org/search?q=Insulation%20R-Value" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Insulation R-Value - ASHRAE
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Technical standards and guidelines for HVAC and building systems related to Insulation R-Value.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Insulation R-Value Requirement Calculator"
      description="The ultimate professional guide and calculator for Insulation R-Value Requirement Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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