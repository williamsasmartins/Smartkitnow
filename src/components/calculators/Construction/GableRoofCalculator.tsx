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

export default function GableRoofCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "", // building length (horizontal base)
    width: "", // building width (horizontal base)
    height: "", // roof height (vertical from base to ridge)
    waste: "10", // waste percentage
    price: "", // price per unit material
    materialSize: "standard", // standard or large size material units
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * Gable roof area = 2 × (Length × Slant Height)
   * Slant Height = sqrt((Width/2)^2 + Height^2)
   *
   * Material units depend on selected size:
   * - Standard size covers 1.5 m² (metric) or 16 ft² (imperial)
   * - Large size covers 2.5 m² (metric) or 27 ft² (imperial)
   *
   * Waste margin is added on top.
   *
   * Cost = units × price per unit
   */

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const height = parseFloat(inputs.height);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);

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

    // Calculate slant height (Pythagoras)
    const halfWidth = width / 2;
    const slantHeight = Math.sqrt(halfWidth * halfWidth + height * height);

    // Roof area (both sides)
    const roofArea = 2 * length * slantHeight; // in base units (m² or ft²)

    // Material coverage per unit based on size and unit system
    let coveragePerUnit = 1.5; // default standard metric m²
    if (inputs.unit === "imperial") {
      coveragePerUnit = 16; // standard imperial ft²
    }
    if (inputs.materialSize === "large") {
      coveragePerUnit = inputs.unit === "metric" ? 2.5 : 27;
    }

    // Raw units needed
    const rawUnits = roofArea / coveragePerUnit;

    // Add waste margin
    const totalUnits = rawUnits * (1 + wastePercent / 100);

    // Round up to next whole unit
    const roundedUnits = Math.ceil(totalUnits);

    // Calculate cost if price given
    const cost =
      !isNaN(pricePerUnit) && pricePerUnit > 0
        ? `$${(roundedUnits * pricePerUnit).toFixed(2)}`
        : "$0.00";

    // Format details string
    const details = `Roof Area: ${roofArea.toFixed(
      2
    )} ${inputs.unit === "metric" ? "m²" : "ft²"} | Raw Units: ${rawUnits.toFixed(
      2
    )} | Waste: +${wastePercent}%`;

    return {
      mainQty: `${roundedUnits} Units`,
      cost,
      details,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [
    inputs.length,
    inputs.width,
    inputs.height,
    inputs.waste,
    inputs.price,
    inputs.materialSize,
    inputs.unit,
  ]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is a gable roof and why would I need to calculate its dimensions?",
      answer: "A gable roof is a triangular roof structure with two sloping sides that meet at a ridge, creating a distinctive peaked shape commonly found on residential homes. Calculating gable roof dimensions is essential for accurate material estimation, cost budgeting, and structural planning before construction or renovation. Proper calculations ensure you order the correct amount of framing lumber, shingles, and underlayment, preventing costly overages or shortages.",
    },
    {
      question: "How do I measure the rise and run for my gable roof calculation?",
      answer: "The rise is the vertical distance from the roof's base to the peak, while the run is the horizontal distance from the wall to the point directly below the peak (typically half the building width). To measure accurately, use a level and measuring tape on the roof itself, or calculate rise from architectural plans using the roof pitch specification. Most residential roofs have a pitch between 4:12 and 8:12, meaning 4 to 8 inches of rise for every 12 inches of horizontal run.",
    },
    {
      question: "What roof pitch is most common for residential gable roofs?",
      answer: "The most common residential gable roof pitch is 6:12, providing a balance between water drainage, interior attic space, and ease of construction. Regional variations exist—northern climates favor steeper pitches like 8:12 or 10:12 to shed snow more effectively, while southern regions often use 4:12 or 5:12 for cost savings. A 6:12 pitch means the roof rises 6 inches for every 12 inches of horizontal distance.",
    },
    {
      question: "How do I calculate the total square footage of a gable roof?",
      answer: "Multiply the rafter length (the sloped distance from the wall to the peak) by the total length of the building's width, then multiply by 2 for both roof sides. For example, a 40-foot-wide house with a rafter length of 15 feet would calculate as 15 × 40 × 2 = 1,200 square feet per side, totaling 2,400 square feet. Remember to add 10-15% extra for waste and overhang when ordering materials.",
    },
    {
      question: "What is roof overhang and how much should I add to my gable roof calculation?",
      answer: "Roof overhang is the horizontal extension of the roof beyond the wall, typically ranging from 12 to 24 inches on residential homes. A 16-inch overhang is the standard for most residential applications, providing weather protection for siding and windows while remaining cost-effective. Add the overhang length to your run measurement before calculating rafter length using the Pythagorean theorem.",
    },
    {
      question: "How do I account for roof valleys and dormers in my gable roof calculation?",
      answer: "Valleys and dormers add complexity to gable roofs and typically increase material needs by 5-15% beyond the basic calculation. For valleys, calculate the additional triangular roof area created where two roof sections meet at an angle. Dormers require separate rafter calculations and additional valley flashings, so it's best to consult architectural plans or add a safety margin to your estimate when these features are present.",
    },
    {
      question: "What is the relationship between roof pitch and material costs?",
      answer: "Steeper roof pitches (8:12 and above) require more materials and labor, increasing costs by approximately 10-20% compared to a standard 6:12 pitch. Steeper roofs demand longer rafters, additional bracing, and more safety precautions during installation, which contractors typically charge 15-25% labor premiums for. A shallow 4:12 pitch roof on a 2,000 square foot footprint might cost $8,000-$12,000 in materials, while an 8:12 pitch on the same house could run $10,000-$15,000.",
    },
    {
      question: "How do I calculate the rafter length for my gable roof?",
      answer: "Use the Pythagorean theorem: rafter length = √(rise² + run²), where rise is vertical height and run is half the building width plus overhang. For example, with a 6:12 pitch on a 40-foot-wide building with 16-inch overhang: rise = 20 feet (40÷2 × 6÷12), run = 21.33 feet (20 + 1.33), so rafter length = √(20² + 21.33²) = √857.78 = approximately 29.3 feet. Most roofing calculators automate this computation using the pitch ratio you provide.",
    },
    {
      question: "What building codes should I consider when designing a gable roof?",
      answer: "Building codes vary by location but typically specify minimum pitch requirements (often 4:12 or steeper), wind resistance ratings, and snow load capacity based on your region. The International Building Code (IBC) and local jurisdictions may require specific rafter spacing (typically 16 or 24 inches on center) and fastening specifications. Always consult your local building department before construction, as coastal areas may require hurricane-resistant specifications and northern climates demand higher snow load ratings.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a gable roof on a house that is 12 meters long, 8 meters wide, with a roof height of 3 meters. You want to order standard size roofing panels with a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate the slant height: sqrt((8/2)^2 + 3^2) = sqrt(16 + 9) = 5 meters. Roof area = 2 × 12 × 5 = 120 m².",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 120 m² × 1.10 = 132 m² total area to cover.",
      },
      {
        label: "3. Order",
        explanation:
          "Each standard panel covers 1.5 m², so units needed = 132 / 1.5 = 88 panels. Round up to 88 units.",
      },
    ],
    result: "Final Order: 88 Standard Size Roofing Panels",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Roof Area = 2 × Length × √((Width / 2)² + Height²)\nMaterial Units = (Roof Area × (1 + Waste %)) / Coverage per Unit",
    variables: [
      { symbol: "L", description: "Length of the building (base)" },
      { symbol: "W", description: "Width of the building (base)" },
      { symbol: "H", description: "Height of the roof (vertical rise)" },
      { symbol: "Waste %", description: "Waste margin percentage" },
      {
        symbol: "Coverage per Unit",
        description:
          "Area covered by one unit of roofing material (depends on size and unit system)",
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
            placeholder="e.g. 12"
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
            placeholder="e.g. 8"
          />
        </div>
        <div className="space-y-2">
          <Label>Height (Roof Rise) ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Gable Roof Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Gable Roof Calculator is a specialized tool designed to help homeowners, contractors, and builders quickly estimate materials, dimensions, and costs for gable roof projects. Whether you're planning a new roof installation, replacement, or renovation, this calculator eliminates manual mathematical errors and saves significant time during the planning phase. Accurate calculations are critical because they directly impact material purchasing, labor estimates, and project budgets.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator effectively, gather three key measurements: the building width (eave to eave), the desired roof pitch (expressed as rise:run, such as 6:12), and any roof overhang distance (typically 16 inches for residential homes). Enter these values into the respective fields, and the calculator will automatically compute the rafter length, total roof square footage for both sides, and material quantity estimates. Some advanced calculators also account for valleys, dormers, and waste percentages to provide more comprehensive projections.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results provide actionable data: total roofing square footage helps determine shingle bundles needed, rafter length guides lumber ordering, and the computed measurements validate structural plans before construction begins. Use these outputs to request accurate quotes from suppliers and contractors, cross-reference with building codes for your region, and establish realistic project timelines and budgets. Always add 10-15% contingency to material estimates and consult local building authorities to ensure compliance with snow load and wind resistance requirements.</p>
        </div>
      </section>

      {/* TABLE: Common Roof Pitch Specifications and Rafter Length Multipliers */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Roof Pitch Specifications and Rafter Length Multipliers</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows standard residential roof pitches and their corresponding rafter length multipliers, which simplify the calculation process.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Roof Pitch</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Rise per 12" Run</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Rafter Length Multiplier</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Use Cases</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0541</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low-slope residential, cost-effective construction</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0868</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate climate zones, standard residential</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.1180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Most common residential, good drainage balance</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.1577</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Northern climates, improved snow shedding</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2019</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heavy snow regions, steep residential roofs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.3054</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Steep residential, significant snow load areas</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.4142</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very steep, specialty architectural designs</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Multiply your run distance by the rafter length multiplier to quickly calculate rafter length without using the Pythagorean theorem.</p>
      </section>

      {/* TABLE: Typical Roofing Material Quantities by Square Footage and Pitch */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Typical Roofing Material Quantities by Square Footage and Pitch</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table estimates material requirements for standard asphalt shingle roofing based on total roof square footage and pitch steepness.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Roof Square Footage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">4:12 to 6:12 Pitch (bundles)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">7:12 to 9:12 Pitch (bundles)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">10:12+ Pitch (bundles)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Starter Strips (feet)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,000 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-30 bundles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-33 bundles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33-36 bundles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200 linear feet</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,500 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42-45 bundles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-50 bundles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-54 bundles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280 linear feet</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,000 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56-60 bundles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-66 bundles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">66-72 bundles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">360 linear feet</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,500 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70-75 bundles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-83 bundles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">83-90 bundles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">440 linear feet</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,000 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">84-90 bundles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90-99 bundles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">99-108 bundles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">520 linear feet</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">One bundle typically covers 33.3 square feet. Add 10-15% for waste, valleys, and dormers. Steeper pitches require more material due to increased surface area.</p>
      </section>

      {/* TABLE: Rafter Spacing Standards and Lumber Grade Requirements */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Rafter Spacing Standards and Lumber Grade Requirements</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Building codes specify rafter spacing and lumber grades based on roof pitch, snow load, and local climate conditions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Rafter Spacing</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Standard Lumber Grade</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum Snow Load (50-yr)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Applications</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Cost per Linear Foot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">16 inches on center</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">#2 or Better 2×6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Up to 30 psf</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mild to moderate climates, lower snow loads</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.20-$1.80</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">16 inches on center</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">#2 or Better 2×8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Up to 50 psf</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Northern regions, moderate snow loads</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.80-$2.50</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24 inches on center</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">#2 or Better 2×8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Up to 30 psf</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cost-effective for lighter loads</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.50-$2.20</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24 inches on center</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">#1 or Better 2×10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Up to 70+ psf</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heavy snow regions, maximum spacing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.80-$4.00</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12 inches on center</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">#2 or Better 2×6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Up to 50 psf</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Steep slopes, high wind zones</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.40-$2.10</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Lumber prices fluctuate; 2025 prices shown are approximate. Always verify with local suppliers and building codes for your specific location.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always measure your building width at multiple points along the structure, as older homes may not have perfectly square footprints; use the average for accurate calculations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for roof overhang in your input measurements—standard residential overhangs are 16-24 inches and significantly affect both material costs and water protection; don't overlook this component.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use your local roof pitch or consult architectural plans rather than estimating; a misidentified pitch can result in 20-30% errors in rafter length calculations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">When ordering materials, increase calculator estimates by 15% for waste, especially if your roof includes valleys, dormers, or irregular features that require custom cutting.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check your local building codes for minimum pitch requirements and snow load ratings before finalizing dimensions; northern climates and coastal areas have specific structural demands.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing roof pitch direction</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some builders incorrectly swap rise and run when inputting pitch data, causing rafter length calculations to be dramatically wrong. Always verify that pitch is expressed correctly as vertical rise per 12 inches of horizontal run (e.g., 6:12, not 12:6).</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for roof overhang</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Omitting the overhang measurement from calculations can underestimate material needs by 5-10% and compromise weather protection design. Standard residential overhangs of 16-24 inches must be added to your run measurement before computing rafter length.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring additional features like valleys and dormers</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating only the basic gable roof area without factoring in valleys, dormers, or intersecting roof sections typically results in 5-20% material shortages. These architectural features create additional roof surface area and require specialized flashing materials not captured in simple gable calculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using incorrect building width measurement</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Measuring from the outside of framing instead of the sheathing surface, or measuring at only one point on an older home, can compound calculation errors significantly. Always measure at multiple locations eave-to-eave and use consistent reference points for accuracy.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting regional building code requirements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some regions demand steeper minimum pitches or higher snow load ratings that may alter rafter size and spacing requirements beyond basic calculator outputs. Failing to account for local codes can result in non-compliant installations that fail inspections and require expensive corrections.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a gable roof and why would I need to calculate its dimensions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A gable roof is a triangular roof structure with two sloping sides that meet at a ridge, creating a distinctive peaked shape commonly found on residential homes. Calculating gable roof dimensions is essential for accurate material estimation, cost budgeting, and structural planning before construction or renovation. Proper calculations ensure you order the correct amount of framing lumber, shingles, and underlayment, preventing costly overages or shortages.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure the rise and run for my gable roof calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The rise is the vertical distance from the roof's base to the peak, while the run is the horizontal distance from the wall to the point directly below the peak (typically half the building width). To measure accurately, use a level and measuring tape on the roof itself, or calculate rise from architectural plans using the roof pitch specification. Most residential roofs have a pitch between 4:12 and 8:12, meaning 4 to 8 inches of rise for every 12 inches of horizontal run.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What roof pitch is most common for residential gable roofs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The most common residential gable roof pitch is 6:12, providing a balance between water drainage, interior attic space, and ease of construction. Regional variations exist—northern climates favor steeper pitches like 8:12 or 10:12 to shed snow more effectively, while southern regions often use 4:12 or 5:12 for cost savings. A 6:12 pitch means the roof rises 6 inches for every 12 inches of horizontal distance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the total square footage of a gable roof?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Multiply the rafter length (the sloped distance from the wall to the peak) by the total length of the building's width, then multiply by 2 for both roof sides. For example, a 40-foot-wide house with a rafter length of 15 feet would calculate as 15 × 40 × 2 = 1,200 square feet per side, totaling 2,400 square feet. Remember to add 10-15% extra for waste and overhang when ordering materials.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is roof overhang and how much should I add to my gable roof calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Roof overhang is the horizontal extension of the roof beyond the wall, typically ranging from 12 to 24 inches on residential homes. A 16-inch overhang is the standard for most residential applications, providing weather protection for siding and windows while remaining cost-effective. Add the overhang length to your run measurement before calculating rafter length using the Pythagorean theorem.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for roof valleys and dormers in my gable roof calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Valleys and dormers add complexity to gable roofs and typically increase material needs by 5-15% beyond the basic calculation. For valleys, calculate the additional triangular roof area created where two roof sections meet at an angle. Dormers require separate rafter calculations and additional valley flashings, so it's best to consult architectural plans or add a safety margin to your estimate when these features are present.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the relationship between roof pitch and material costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Steeper roof pitches (8:12 and above) require more materials and labor, increasing costs by approximately 10-20% compared to a standard 6:12 pitch. Steeper roofs demand longer rafters, additional bracing, and more safety precautions during installation, which contractors typically charge 15-25% labor premiums for. A shallow 4:12 pitch roof on a 2,000 square foot footprint might cost $8,000-$12,000 in materials, while an 8:12 pitch on the same house could run $10,000-$15,000.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the rafter length for my gable roof?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use the Pythagorean theorem: rafter length = √(rise² + run²), where rise is vertical height and run is half the building width plus overhang. For example, with a 6:12 pitch on a 40-foot-wide building with 16-inch overhang: rise = 20 feet (40÷2 × 6÷12), run = 21.33 feet (20 + 1.33), so rafter length = √(20² + 21.33²) = √857.78 = approximately 29.3 feet. Most roofing calculators automate this computation using the pitch ratio you provide.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What building codes should I consider when designing a gable roof?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Building codes vary by location but typically specify minimum pitch requirements (often 4:12 or steeper), wind resistance ratings, and snow load capacity based on your region. The International Building Code (IBC) and local jurisdictions may require specific rafter spacing (typically 16 or 24 inches on center) and fastening specifications. Always consult your local building department before construction, as coastal areas may require hurricane-resistant specifications and northern climates demand higher snow load ratings.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.iccsafe.org/products-and-services/icc-codes/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Building Code (IBC) - Roof Assembly Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official resource for building code standards including roof pitch minimums, rafter spacing, and snow load requirements across jurisdictions.</p>
          </li>
          <li>
            <a href="https://www.nrca.net/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Roofing Contractors Association (NRCA) - Residential Roof Design Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standard guidelines for residential roof design, pitch recommendations, and material specifications for gable roof installations.</p>
          </li>
          <li>
            <a href="https://www.epa.gov/greenerproducts/sustainable-materials-management-roofing" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Environmental Protection Agency (EPA) - Roofing Materials and Energy Efficiency</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Information on roofing material selection, environmental impact, and energy efficiency considerations for residential roof projects.</p>
          </li>
          <li>
            <a href="https://www.asce.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Society of Civil Engineers (ASCE) - Minimum Design Loads for Buildings and Other Structures</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical standards for calculating snow loads, wind resistance, and structural requirements for roof designs in various climate zones.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Gable Roof Calculator"
      description="The ultimate professional guide and calculator for Gable Roof Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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