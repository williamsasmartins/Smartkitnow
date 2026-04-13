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
    const baseUnits = area / sheetArea;

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
      question: "What is an R-value and why does it matter for insulation?",
      answer: "R-value measures thermal resistance, indicating how effectively insulation slows heat transfer through building materials. Higher R-values provide better insulation performance; for example, R-19 fiberglass batts are commonly used in walls, while R-38 to R-60 is typical for attics depending on climate zone. The better your insulation's R-value, the less energy your HVAC system needs to maintain comfortable indoor temperatures.",
    },
    {
      question: "How do I determine the R-value requirement for my attic?",
      answer: "R-value requirements for attics range from R-30 in warm climates (zones 1-2) to R-60 in cold climates (zones 7-8), as defined by the 2021 International Energy Conservation Code (IECC). Your specific requirement depends on your geographic location and heating/cooling degree days. The calculator uses your zip code and climate zone to recommend the appropriate R-value for maximum energy efficiency.",
    },
    {
      question: "What are the minimum R-value requirements for walls?",
      answer: "Wall insulation requirements typically range from R-13 to R-21 for exterior walls across most U.S. climate zones. In colder climates (zones 6-8), R-21 cavity insulation plus continuous R-5 to R-7.5 exterior sheathing is often required. The 2021 IECC recommends these minimums to balance energy efficiency with construction costs.",
    },
    {
      question: "How does climate zone affect my insulation R-value needs?",
      answer: "The U.S. is divided into 8 climate zones (1 being warmest, 8 being coldest), and each zone has different insulation requirements based on heating and cooling degree days. A home in Miami (Zone 1) might need R-13 attic insulation, while a home in Minneapolis (Zone 7) requires R-49 to R-60. The calculator automatically adjusts recommendations based on your climate zone.",
    },
    {
      question: "What's the difference between cavity insulation and continuous insulation?",
      answer: "Cavity insulation (like batts or blown-in fiberglass) fills the space between wall studs and joists, while continuous insulation is a rigid layer applied to the exterior of framing that provides uninterrupted thermal protection. Building codes increasingly require both: R-13 cavity insulation plus R-5 to R-7.5 continuous insulation in colder zones to minimize thermal bridging through studs. Using only cavity insulation leaves gaps that reduce overall wall performance by 15-25%.",
    },
    {
      question: "How do basement and crawl space R-value requirements differ?",
      answer: "Basement walls require R-10 continuous insulation in most climates, while crawl space walls require R-13 to R-19 depending on the zone and whether the space is vented or unvented. Unvented crawl spaces (increasingly recommended) should have R-13 to R-19 insulation on the walls plus a vapor barrier on the floor. The calculator helps distinguish between these different assembly types.",
    },
    {
      question: "Can I mix different types of insulation to meet R-value requirements?",
      answer: "Yes, R-values are additive, so you can combine fiberglass batts (R-3.2 per inch), spray foam (R-3.5 to R-6.5 per inch), and rigid foam boards (R-4 to R-8 per inch) to reach the total requirement. For example, R-19 cavity insulation plus R-7.5 rigid foam sheathing totals R-26.5, which exceeds many wall requirements. However, ensure that vapor barriers and moisture management are properly coordinated when mixing materials.",
    },
    {
      question: "What happens if my insulation falls short of required R-values?",
      answer: "Undersized insulation increases energy consumption by 10-30% depending on how far below code you fall, leading to higher heating and cooling bills year-round. It may also fail building code inspections and potentially affect your home's resale value or insurability. Many jurisdictions require remediation if insulation is discovered to be below minimums during renovation or inspection.",
    },
    {
      question: "How often should I update my insulation to meet current code requirements?",
      answer: "The International Energy Conservation Code (IECC) updates every 3 years, with the latest version being 2021, and many states have adopted it for new construction and major renovations. While existing homes typically aren't required to retrofit immediately, upgrading insulation during renovations (roof replacement, siding work, etc.) is often mandated to meet current standards. It's recommended to review your current insulation R-value every 10-15 years and compare it against your local building code.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Insulation R-Value Requirement Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Insulation R-Value Requirement Calculator helps homeowners and builders determine the minimum insulation levels required by current building codes based on location and assembly type. This tool ensures compliance with the 2021 International Energy Conservation Code (IECC) and helps optimize energy efficiency for new construction or major renovations. By identifying correct R-value targets upfront, you avoid costly code violations, failed inspections, and energy waste.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter your zip code or select your climate zone, then specify the building assembly you're insulating (attic, walls, basement, or crawl space). The calculator also asks whether you're adding cavity insulation, continuous insulation, or both, since many jurisdictions now require a combination of these methods. These inputs determine your exact heating and cooling degree days and corresponding code requirements.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results will display your minimum required R-value, recommended R-values for better performance, and practical guidance on material combinations to achieve these targets. Compare the output against your current insulation levels or planned specifications to confirm compliance before purchasing materials or scheduling installation. The calculator also identifies cost-effective ways to exceed minimums, which can reduce energy bills by 10–30% over time.</p>
        </div>
      </section>

      {/* TABLE: Recommended Attic Insulation R-Values by Climate Zone (2021 IECC) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Attic Insulation R-Values by Climate Zone (2021 IECC)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the minimum recommended R-values for attic insulation across all eight U.S. climate zones.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Climate Zone</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Zone Description</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Heating Degree Days</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Attic R-Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Warm/Tropical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Warm/Humid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500–1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-30</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Warm/Mixed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,000–2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mixed/Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000–3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-38</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cool/Mixed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000–4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-38</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cold</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,000–5,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-49</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Cold</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,500–7,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-60</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Subarctic/Arctic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;7,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-60</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Heating degree days (HDD) are calculated as the sum of daily temperature differences below 65°F. These are minimum code requirements; higher R-values improve efficiency and reduce long-term energy costs.</p>
      </section>

      {/* TABLE: Exterior Wall Insulation Requirements by Climate Zone */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Exterior Wall Insulation Requirements by Climate Zone</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table displays cavity insulation and continuous insulation (sheathing) requirements for exterior walls across climate zones.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Climate Zone</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cavity Insulation (R-value)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Continuous Insulation Minimum</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Equivalent R-Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1–2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-13</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-0 (optional)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-13</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-13</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-0 to R-3.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-13–R-17</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-13</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-3.8 to R-5.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-17–R-19</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-13</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-5.6 to R-7.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-19–R-21</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-13</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-7.5 to R-9.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-21–R-23</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-19</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-7.5 to R-11.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-26–R-30</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-11.3 to R-15.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-32–R-37</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Continuous insulation reduces thermal bridging through studs and framing, improving overall wall performance by 15–25% compared to cavity insulation alone.</p>
      </section>

      {/* TABLE: Common Insulation Materials and Their R-Values */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Insulation Materials and Their R-Values</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares R-value per inch for popular insulation materials used in residential construction.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Material Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">R-Value per Inch</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Cost per Sq. Ft.</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fiberglass Batts</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-3.2–R-3.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.30–$0.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Walls, attics, basements</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Blown-In Cellulose</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-3.2–R-3.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.40–$0.70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Attics, wall cavities</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Spray Foam (Open-Cell)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-3.5–R-3.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.80–$1.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Irregular cavities, air sealing</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Spray Foam (Closed-Cell)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-6.0–R-6.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.50–$2.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High-performance applications</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rigid Foam Board</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-4.0–R-8.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.60–$1.80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Continuous exterior insulation</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mineral Wool Batts</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">R-3.8–R-4.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.50–$0.80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fire-rated applications, walls</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs vary by region and market conditions. Closed-cell spray foam provides the highest R-value per inch but carries higher labor costs. Blown-in materials work well for retrofits and irregular spaces.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Input your exact zip code rather than just your climate zone — this allows the calculator to account for local heating and cooling degree days, which may vary significantly within a single zone and affect your specific R-value requirement.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">When combining cavity and continuous insulation, verify that your vapor barrier placement is correct; placing vapor barriers on the wrong side of the assembly can trap moisture and lead to mold growth, negating efficiency gains.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider exceeding minimum code requirements by 10–20% if you plan to stay in your home long-term — the extra insulation investment typically pays back in 5–7 years through reduced HVAC costs and increased comfort.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Don't assume old insulation still meets current code requirements; insulation settles over time and can lose 10–15% of its R-value effectiveness after 15–20 years, so recalculate when planning renovations.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Vapor Barrier Placement</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Placing vapor barriers on the wrong side of the wall assembly (e.g., interior-facing in cold climates) can trap moisture in the wall cavity, causing mold and structural damage. Always follow the calculator's guidance and your local building code on vapor barrier orientation based on your climate zone and assembly type.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Only Cavity Insulation Without Continuous Insulation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Relying exclusively on cavity insulation in zones 5 and higher leaves significant thermal bridging through wood framing, reducing actual wall performance by 15–25% compared to code-recommended values. The calculator will show that zones 6–8 now require both cavity and continuous insulation for compliance.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing Incompatible Materials</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Combining spray foam with standard kraft-faced fiberglass batts can create vapor barrier conflicts and lead to condensation problems inside walls. Always ensure material selections are compatible; the calculator provides guidance, but consult your building inspector before mixing different insulation types.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Air Leakage Impact</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Achieving the required R-value alone doesn't guarantee energy efficiency if air leaks aren't sealed; uncontrolled air infiltration can reduce effective insulation performance by 20–40%. The calculator focuses on R-value compliance, so also implement proper air-sealing techniques around windows, doors, and mechanical penetrations for optimal results.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is an R-value and why does it matter for insulation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">R-value measures thermal resistance, indicating how effectively insulation slows heat transfer through building materials. Higher R-values provide better insulation performance; for example, R-19 fiberglass batts are commonly used in walls, while R-38 to R-60 is typical for attics depending on climate zone. The better your insulation's R-value, the less energy your HVAC system needs to maintain comfortable indoor temperatures.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I determine the R-value requirement for my attic?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">R-value requirements for attics range from R-30 in warm climates (zones 1-2) to R-60 in cold climates (zones 7-8), as defined by the 2021 International Energy Conservation Code (IECC). Your specific requirement depends on your geographic location and heating/cooling degree days. The calculator uses your zip code and climate zone to recommend the appropriate R-value for maximum energy efficiency.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the minimum R-value requirements for walls?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Wall insulation requirements typically range from R-13 to R-21 for exterior walls across most U.S. climate zones. In colder climates (zones 6-8), R-21 cavity insulation plus continuous R-5 to R-7.5 exterior sheathing is often required. The 2021 IECC recommends these minimums to balance energy efficiency with construction costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does climate zone affect my insulation R-value needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The U.S. is divided into 8 climate zones (1 being warmest, 8 being coldest), and each zone has different insulation requirements based on heating and cooling degree days. A home in Miami (Zone 1) might need R-13 attic insulation, while a home in Minneapolis (Zone 7) requires R-49 to R-60. The calculator automatically adjusts recommendations based on your climate zone.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between cavity insulation and continuous insulation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cavity insulation (like batts or blown-in fiberglass) fills the space between wall studs and joists, while continuous insulation is a rigid layer applied to the exterior of framing that provides uninterrupted thermal protection. Building codes increasingly require both: R-13 cavity insulation plus R-5 to R-7.5 continuous insulation in colder zones to minimize thermal bridging through studs. Using only cavity insulation leaves gaps that reduce overall wall performance by 15-25%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do basement and crawl space R-value requirements differ?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Basement walls require R-10 continuous insulation in most climates, while crawl space walls require R-13 to R-19 depending on the zone and whether the space is vented or unvented. Unvented crawl spaces (increasingly recommended) should have R-13 to R-19 insulation on the walls plus a vapor barrier on the floor. The calculator helps distinguish between these different assembly types.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I mix different types of insulation to meet R-value requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, R-values are additive, so you can combine fiberglass batts (R-3.2 per inch), spray foam (R-3.5 to R-6.5 per inch), and rigid foam boards (R-4 to R-8 per inch) to reach the total requirement. For example, R-19 cavity insulation plus R-7.5 rigid foam sheathing totals R-26.5, which exceeds many wall requirements. However, ensure that vapor barriers and moisture management are properly coordinated when mixing materials.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if my insulation falls short of required R-values?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Undersized insulation increases energy consumption by 10-30% depending on how far below code you fall, leading to higher heating and cooling bills year-round. It may also fail building code inspections and potentially affect your home's resale value or insurability. Many jurisdictions require remediation if insulation is discovered to be below minimums during renovation or inspection.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I update my insulation to meet current code requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The International Energy Conservation Code (IECC) updates every 3 years, with the latest version being 2021, and many states have adopted it for new construction and major renovations. While existing homes typically aren't required to retrofit immediately, upgrading insulation during renovations (roof replacement, siding work, etc.) is often mandated to meet current standards. It's recommended to review your current insulation R-value every 10-15 years and compare it against your local building code.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.iccsafe.org/products-and-services/standards/i-codes/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">2021 International Energy Conservation Code (IECC)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The authoritative source for current U.S. building code requirements including insulation R-values and climate zone definitions.</p>
          </li>
          <li>
            <a href="https://www.energy.gov/energysaver/insulation-and-air-sealing" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy — Insulation and Air Sealing</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Government resource providing technical guidance on insulation materials, R-values, and energy efficiency best practices for residential buildings.</p>
          </li>
          <li>
            <a href="https://www.energystar.gov/about/origins-mission-governance/how-energy-star-works" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA ENERGY STAR — Home Insulation Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Environmental Protection Agency standards and recommendations for insulation performance and energy-efficient home construction across all climate zones.</p>
          </li>
          <li>
            <a href="https://www.insulation.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Insulation Association — R-Value Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry association providing technical standards, material specifications, and installation guidelines for insulation products and performance verification.</p>
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