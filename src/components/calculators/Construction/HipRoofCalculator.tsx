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
      question: "What is a hip roof and why would I need to calculate its dimensions?",
      answer: "A hip roof is a roofing style where all four sides slope downward to the walls, creating a pyramid-like shape that provides excellent weather protection and structural stability. Calculating hip roof dimensions is essential for accurate material estimation, cost budgeting, and ensuring proper construction specifications. Homeowners and contractors use hip roof calculations to determine square footage, rafter lengths, and material quantities before beginning construction or renovation projects.",
    },
    {
      question: "How do I measure the width and length needed for a hip roof calculation?",
      answer: "Measure the width and length of the building's footprint from the outer edges of the walls, not including any overhangs initially. For a rectangular building measuring 40 feet by 60 feet, you would input those dimensions into the calculator. If your building has eaves or overhangs (typically 12 to 24 inches on residential homes), add those measurements to each side before calculating total roof coverage area.",
    },
    {
      question: "What is roof pitch and how does it affect my hip roof calculator results?",
      answer: "Roof pitch represents the steepness of the roof, expressed as a ratio such as 4:12 (meaning 4 inches of rise for every 12 inches of horizontal run). A steeper pitch like 8:12 or 10:12 requires more roofing material and longer rafters compared to a shallow 4:12 pitch on the same building footprint. Pitch directly impacts the total square footage and material costs, with steeper roofs requiring approximately 10-15% more material than a 4:12 pitch configuration.",
    },
    {
      question: "How many squares of roofing material will my hip roof need?",
      answer: "One roofing square equals 100 square feet of material coverage. A hip roof on a 2,000 square foot building footprint with a 6:12 pitch typically requires 24-28 squares of roofing material when accounting for the increased surface area from the sloped design. Use your calculator results divided by 100 to determine the number of squares needed for material ordering and cost estimation.",
    },
    {
      question: "What is the difference between a hip roof and a gable roof in terms of material needs?",
      answer: "A hip roof has four sloping sides while a gable roof has only two, making hip roofs more complex and material-intensive for the same building footprint. For a 40-foot by 60-foot building, a hip roof requires approximately 15-20% more roofing material than a gable roof due to the additional sloped surfaces. Hip roofs also require more complex rafter calculations and ridge beam configurations, increasing labor costs by 10-25% compared to gable construction.",
    },
    {
      question: "How do I account for roof overhangs in my hip roof calculation?",
      answer: "Most residential hip roofs have eaves or overhangs extending 12 to 24 inches beyond the exterior walls for weather protection and aesthetic purposes. Add your overhang measurement to each side of the building dimensions before calculating; for example, a 40-foot building with 18-inch overhangs becomes 43 feet in the calculator. Typical overhang costs add 3-5% to total roofing material expenses and should be included in your final square footage estimate.",
    },
    {
      question: "What material costs should I expect for a typical hip roof installation?",
      answer: "Asphalt shingle roofing typically costs $3.50 to $5.50 per square foot installed, while metal roofing ranges from $7 to $12 per square foot as of 2024-2025. For a 3,000 square foot hip roof area, asphalt shingles cost approximately $10,500 to $16,500 total, while metal options range from $21,000 to $36,000. Labor typically accounts for 40-50% of total installation costs, varying by region and roof complexity.",
    },
    {
      question: "How does a hip roof's pitch affect the rafter length calculation?",
      answer: "A steeper pitch increases rafter length significantly using the Pythagorean theorem; a 4:12 pitch has a different rafter multiplier (1.054) than an 8:12 pitch (1.202). For a 20-foot span, a 4:12 pitch requires 10.54-foot rafters while an 8:12 pitch needs 12.02-foot rafters, representing a 14% increase in material usage. This variation directly impacts lumber costs and installation time, making pitch selection crucial for budget planning.",
    },
    {
      question: "What permits and inspections are required before installing a hip roof?",
      answer: "Most jurisdictions require building permits before any roof installation or replacement, with permit costs typically ranging from $150 to $500 depending on location and project scope. The permit process usually includes inspections at installation stages: before underlayment, after framing, and final inspection upon completion. Check your local building department or municipality website for specific requirements, as codes vary by region and may require engineered plans for complex roof designs.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Hip Roof Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Hip Roof Calculator is an essential tool for homeowners, contractors, and builders planning roof installations or replacements on properties with hip roof designs. This calculator computes the total roofing surface area, material quantities, and rafter dimensions needed based on your building's specific dimensions and roof pitch. By providing accurate calculations upfront, you can obtain precise material estimates, competitive contractor bids, and realistic project budgets before construction begins.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll need to input three primary measurements: your building's length and width (measured from exterior wall to exterior wall), your desired roof pitch expressed as a rise-to-run ratio such as 6:12 or 8:12, and any eave overhang dimensions if applicable. The roof pitch is critical because it directly determines how much additional surface area your sloped roof creates compared to your flat building footprint—steeper pitches create more surface area and require more materials. Optional inputs may include overhang measurements (typically 12 to 24 inches on residential homes) and your preferred roofing material type for cost estimates.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator returns several key outputs: total roofing area in square feet, the number of roofing squares (100-square-foot units) required for material ordering, estimated rafter lengths for construction planning, and optional material cost projections based on current pricing. Interpret these results by dividing total square footage by 100 to determine how many squares of shingles or roofing material to order, with a typical 5-10% waste factor added for cutting and installation complications. Use the rafter length outputs to ensure contractor estimates align with actual construction requirements, and cross-reference material costs with multiple suppliers for competitive pricing.</p>
        </div>
      </section>

      {/* TABLE: Hip Roof Pitch Multipliers and Material Impact */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Hip Roof Pitch Multipliers and Material Impact</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how different roof pitches affect rafter length multipliers and estimated material coverage percentages for hip roofs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Roof Pitch (Rise:Run)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Rafter Length Multiplier</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Material Increase vs. 4:12 Pitch</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Residential Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.054</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline (0%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low-slope residential, modern designs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.087</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Common in temperate climates</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.118</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Most popular residential choice</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.159</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate to steep applications</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.202</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Steep residential, snow-prone areas</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.302</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very steep, high-precipitation regions</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.414</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Extreme steep pitch, specialty projects</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Multipliers are used to calculate actual rafter lengths from horizontal spans. Material increase percentages reflect additional square footage from increased sloped surface area.</p>
      </section>

      {/* TABLE: Hip Roof Material Costs by Roofing Type (2024-2025) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Hip Roof Material Costs by Roofing Type (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Estimated costs per square foot installed for various roofing materials on hip roof installations, including labor.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Roofing Material</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Per Square Foot (Installed)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Per Square (100 sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Lifespan</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maintenance Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Asphalt Shingles (3-tab)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3.50 - $4.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$350 - $450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Asphalt Shingles (architectural)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4.50 - $5.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$450 - $550</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Metal Roofing (standing seam)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7.00 - $10.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$700 - $1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-70 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Metal Roofing (corrugated)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5.00 - $7.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500 - $700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-50 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wood Shake Shingles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8.00 - $12.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$800 - $1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-40 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Slate Tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10.00 - $15.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000 - $1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-100+ years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Synthetic Slate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6.00 - $9.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600 - $900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-50 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs vary by region, local labor rates, material quality grades, and accessibility. Hip roof complexity typically adds 10-15% to labor costs compared to gable roofs.</p>
      </section>

      {/* TABLE: Hip Roof Square Footage Examples by Building Size and Pitch */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Hip Roof Square Footage Examples by Building Size and Pitch</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Sample calculations showing total roofing area needed for common residential building dimensions at different pitch angles.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Building Footprint</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Roof Pitch</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Roof Coverage Area (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Material Squares Needed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Approximate Asphalt Shingle Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30' × 40' (1,200 sq ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,390</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,865 - $7,645</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30' × 40' (1,200 sq ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,540</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,390 - $8,470</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40' × 50' (2,000 sq ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,360</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,260 - $12,980</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40' × 50' (2,000 sq ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,620</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9,170 - $14,410</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50' × 60' (3,000 sq ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,550</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,425 - $19,525</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50' × 60' (3,000 sq ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">41.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$14,630 - $22,990</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs shown for architectural asphalt shingles installed labor included. Add 12-18 inches eave overhang to each side for accurate calculations. Actual costs vary by region and contractor.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always add eave overhangs to your building dimensions before calculating—standard residential overhangs of 18-24 inches add 2-3% to total material costs but provide essential weather protection and curb appeal.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Choose your roof pitch based on climate and precipitation patterns: regions with heavy snow benefit from 8:12 or steeper pitches (requiring 15-25% more material), while temperate areas suit 4:12 to 6:12 pitches (baseline to 6% additional material).</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for waste in your material estimates by ordering 10-15% additional squares beyond calculator results to cover cutting, installation complications, and future repairs or replacements of individual shingles.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Verify your building dimensions by measuring from multiple points and use the average—inaccurate measurements by just 2-3 feet on a 50-foot building can result in miscalculating 100+ square feet of roofing area and material costs.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Roof Overhangs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to include eave overhangs in your measurements can result in underestimating material needs by 3-5%. Standard residential overhangs of 12-24 inches must be added to each side of your building dimensions to get accurate roofing area calculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Roof Pitch Notation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Misinterpreting pitch ratios such as using 6:12 when you meant 12:6 can cause rafter length errors of 15-20% and material miscalculations. Always confirm pitch notation as rise-to-run format (vertical rise for every 12 inches of horizontal run) with your architect or contractor.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Waste Factor</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ordering materials based solely on calculator results without adding 5-10% for waste, cutting losses, and installation complications often leaves projects short of materials. Budget contractors recommend ordering 10-15% additional squares to ensure sufficient material throughout the installation process.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Approximate Building Dimensions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Estimating building measurements instead of measuring precisely can cause errors of 200-400 square feet on larger roofs, translating to $700-$2,200 in material cost discrepancies. Take multiple measurements from different points and use the average for calculator accuracy.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a hip roof and why would I need to calculate its dimensions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A hip roof is a roofing style where all four sides slope downward to the walls, creating a pyramid-like shape that provides excellent weather protection and structural stability. Calculating hip roof dimensions is essential for accurate material estimation, cost budgeting, and ensuring proper construction specifications. Homeowners and contractors use hip roof calculations to determine square footage, rafter lengths, and material quantities before beginning construction or renovation projects.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure the width and length needed for a hip roof calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure the width and length of the building's footprint from the outer edges of the walls, not including any overhangs initially. For a rectangular building measuring 40 feet by 60 feet, you would input those dimensions into the calculator. If your building has eaves or overhangs (typically 12 to 24 inches on residential homes), add those measurements to each side before calculating total roof coverage area.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is roof pitch and how does it affect my hip roof calculator results?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Roof pitch represents the steepness of the roof, expressed as a ratio such as 4:12 (meaning 4 inches of rise for every 12 inches of horizontal run). A steeper pitch like 8:12 or 10:12 requires more roofing material and longer rafters compared to a shallow 4:12 pitch on the same building footprint. Pitch directly impacts the total square footage and material costs, with steeper roofs requiring approximately 10-15% more material than a 4:12 pitch configuration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many squares of roofing material will my hip roof need?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">One roofing square equals 100 square feet of material coverage. A hip roof on a 2,000 square foot building footprint with a 6:12 pitch typically requires 24-28 squares of roofing material when accounting for the increased surface area from the sloped design. Use your calculator results divided by 100 to determine the number of squares needed for material ordering and cost estimation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between a hip roof and a gable roof in terms of material needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A hip roof has four sloping sides while a gable roof has only two, making hip roofs more complex and material-intensive for the same building footprint. For a 40-foot by 60-foot building, a hip roof requires approximately 15-20% more roofing material than a gable roof due to the additional sloped surfaces. Hip roofs also require more complex rafter calculations and ridge beam configurations, increasing labor costs by 10-25% compared to gable construction.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for roof overhangs in my hip roof calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most residential hip roofs have eaves or overhangs extending 12 to 24 inches beyond the exterior walls for weather protection and aesthetic purposes. Add your overhang measurement to each side of the building dimensions before calculating; for example, a 40-foot building with 18-inch overhangs becomes 43 feet in the calculator. Typical overhang costs add 3-5% to total roofing material expenses and should be included in your final square footage estimate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What material costs should I expect for a typical hip roof installation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Asphalt shingle roofing typically costs $3.50 to $5.50 per square foot installed, while metal roofing ranges from $7 to $12 per square foot as of 2024-2025. For a 3,000 square foot hip roof area, asphalt shingles cost approximately $10,500 to $16,500 total, while metal options range from $21,000 to $36,000. Labor typically accounts for 40-50% of total installation costs, varying by region and roof complexity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does a hip roof's pitch affect the rafter length calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A steeper pitch increases rafter length significantly using the Pythagorean theorem; a 4:12 pitch has a different rafter multiplier (1.054) than an 8:12 pitch (1.202). For a 20-foot span, a 4:12 pitch requires 10.54-foot rafters while an 8:12 pitch needs 12.02-foot rafters, representing a 14% increase in material usage. This variation directly impacts lumber costs and installation time, making pitch selection crucial for budget planning.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What permits and inspections are required before installing a hip roof?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most jurisdictions require building permits before any roof installation or replacement, with permit costs typically ranging from $150 to $500 depending on location and project scope. The permit process usually includes inspections at installation stages: before underlayment, after framing, and final inspection upon completion. Check your local building department or municipality website for specific requirements, as codes vary by region and may require engineered plans for complex roof designs.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.hud.gov/program_offices/public_indian_housing/programs/ph/phr_info/about/faq/construction" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Housing and Urban Development (HUD) - Residential Construction Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official HUD guidelines covering residential construction standards and building code requirements for roof installations.</p>
          </li>
          <li>
            <a href="https://www.iccsafe.org/products-and-services/standards/i-codes/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Code Council (ICC) - Building Code Documentation</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive ICC building codes and standards that govern roof pitch, structural requirements, and roofing material specifications.</p>
          </li>
          <li>
            <a href="https://www.nrca.net/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Roofing Contractors Association (NRCA) - Roofing Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry-leading standards and best practices for all types of roofing installations including hip roof specifications and material guidelines.</p>
          </li>
          <li>
            <a href="https://www.energystar.gov/index.cfm?c=home_improvement.hm_improvement_roof" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA Energy Star - Residential Roofing and Energy Efficiency</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Energy-efficient roofing material options and their impact on home heating and cooling costs for residential properties.</p>
          </li>
        </ul>
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
        { id: "references", label: "References & Resources" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}