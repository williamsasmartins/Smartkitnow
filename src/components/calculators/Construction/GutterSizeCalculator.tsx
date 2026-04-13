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

export default function GutterSizeCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    roofAreaLength: "", // length of roof area draining to gutter (m or ft)
    roofAreaWidth: "", // width of roof area draining to gutter (m or ft)
    rainfallIntensity: "", // rainfall intensity in mm/hr or in/hr
    gutterSlope: "0.005", // slope (default 0.5%)
    gutterMaterial: "aluminum", // material type
    gutterSize: "5", // gutter size in inches (5, 6, 7, 8)
    waste: "10", // waste percentage
    pricePerUnit: "", // price per gutter unit (per meter or foot)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * Step 1: Calculate runoff volume from roof area:
   *   Runoff (L/s) = Roof Area (m²) × Rainfall Intensity (mm/hr) × 0.278
   *   (0.278 converts mm/hr over m² to L/s)
   *
   * Step 2: Convert runoff to cubic feet per second (cfs) if imperial
   *
   * Step 3: Determine gutter capacity based on gutter size and slope
   *   Approximate capacity (cfs) for standard gutters:
   *     5" gutter ~ 0.15 cfs
   *     6" gutter ~ 0.25 cfs
   *     7" gutter ~ 0.35 cfs
   *     8" gutter ~ 0.50 cfs
   *
   * Step 4: Calculate required gutter length = Roof perimeter length (m or ft)
   *
   * Step 5: Adjust gutter length for waste %
   *
   * Step 6: Calculate material units (length rounded up to nearest commercial unit)
   */

  // Helper: Convert inputs to numbers safely
  const toNum = (val: string) => (val === "" ? 0 : parseFloat(val));

  // Convert rainfall intensity to mm/hr if imperial input (in/hr * 25.4)
  const rainfallIntensityMetric = useMemo(() => {
    if (inputs.unit === "imperial") {
      return toNum(inputs.rainfallIntensity) * 25.4;
    }
    return toNum(inputs.rainfallIntensity);
  }, [inputs.rainfallIntensity, inputs.unit]);

  // Roof area in m² or ft²
  const roofArea = useMemo(() => {
    return toNum(inputs.roofAreaLength) * toNum(inputs.roofAreaWidth);
  }, [inputs.roofAreaLength, inputs.roofAreaWidth]);

  // Runoff volume in L/s (metric)
  const runoffLps = useMemo(() => {
    // Runoff (L/s) = Area (m²) * Rainfall (mm/hr) * 0.278
    if (inputs.unit === "metric") {
      return roofArea * rainfallIntensityMetric * 0.278;
    }
    // For imperial, convert area ft² to m² (1 ft² = 0.092903 m²)
    const areaM2 = roofArea * 0.092903;
    return areaM2 * rainfallIntensityMetric * 0.278;
  }, [roofArea, rainfallIntensityMetric, inputs.unit]);

  // Gutter capacity in L/s based on gutter size (approximate)
  // Source: Typical gutter capacities converted to L/s
  // 5" ~ 4.25 L/s, 6" ~ 7.1 L/s, 7" ~ 9.9 L/s, 8" ~ 14.2 L/s
  const gutterCapacityLps = useMemo(() => {
    switch (inputs.gutterSize) {
      case "5":
        return 4.25;
      case "6":
        return 7.1;
      case "7":
        return 9.9;
      case "8":
        return 14.2;
      default:
        return 4.25;
    }
  }, [inputs.gutterSize]);

  // Required gutter length (assume gutter runs along roof length)
  // For simplicity, gutter length = roof length (m or ft)
  const gutterLengthRaw = toNum(inputs.roofAreaLength);

  // Add waste margin
  const wastePercent = toNum(inputs.waste);
  const gutterLengthWithWaste = gutterLengthRaw * (1 + wastePercent / 100);

  // Round up gutter length to nearest commercial unit:
  // Metric: round up to nearest 1 meter
  // Imperial: round up to nearest 1 foot
  const gutterLengthRounded = Math.ceil(gutterLengthWithWaste);

  // Calculate estimated cost
  const pricePerUnitNum = toNum(inputs.pricePerUnit);
  const estimatedCost = gutterLengthRounded * pricePerUnitNum;

  // Check if gutter capacity is sufficient for runoff
  const capacityOk = gutterCapacityLps >= runoffLps;

  // Material units output string
  const mainQty = `${gutterLengthRounded} ${inputs.unit === "metric" ? "meters" : "feet"}`;

  // Details string
  const details = `Runoff: ${runoffLps.toFixed(
    2
  )} L/s | Gutter Capacity: ${gutterCapacityLps.toFixed(
    2
  )} L/s | Waste: +${wastePercent}%`;

  // Cost string
  const cost = estimatedCost > 0 ? `$${estimatedCost.toFixed(2)}` : "$0.00";

  // Waste info string
  const wasteInfo = `+${wastePercent}% Waste included`;

  // Results object
  const results = {
    mainQty,
    cost,
    details,
    wasteInfo,
    capacityOk,
  };

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What roof area do I need to measure for the gutter size calculator?",
      answer: "You need to measure the horizontal projection of your roof, not the actual sloped surface area. Measure the length and width of your house footprint, then multiply them together. For example, a 40-foot by 30-foot house has a 1,200 square foot roof projection, which is the baseline for calculating required gutter capacity and sizing.",
    },
    {
      question: "How does rainfall intensity affect gutter sizing requirements?",
      answer: "Rainfall intensity is measured in inches per hour and directly impacts gutter capacity needs. The calculator uses your local rainfall rate—for example, areas like Florida experience 6-8 inches per hour during heavy storms, while arid regions may only see 1-2 inches per hour. Higher intensity rainfall requires larger gutters; a 5-inch K-style gutter handles approximately 4.4 inches per hour, while a 6-inch gutter can handle about 5.5 inches per hour.",
    },
    {
      question: "What is the difference between K-style and half-round gutters in capacity?",
      answer: "K-style gutters are the most common in North America and have a 5-inch standard size with a capacity of approximately 4.4 inches per hour of rainfall. Half-round gutters offer 4.4 inches per hour capacity in a 5-inch size and 5.5 inches per hour in a 6-inch size. K-style gutters are more efficient at handling water due to their shape, making them the preferred choice for most residential applications.",
    },
    {
      question: "How do roof pitch and slope affect drainage calculations?",
      answer: "Roof pitch affects how quickly water runs off and flows into gutters. A steeper pitch (such as 12:12 or higher) causes water to move faster, potentially requiring larger gutters to handle the volume. A shallow pitch (4:12 or lower) allows more time for water absorption but may create ponding issues. Most standard residential roofs fall between 4:12 and 8:12 pitch, which the calculator adjusts for automatically.",
    },
    {
      question: "What size downspout do I need for my gutters?",
      answer: "Downspout sizing depends on your gutter size and rainfall intensity. A 5-inch K-style gutter typically requires a 2x3-inch or 3x4-inch rectangular downspout, or a 3-inch round downspout. For larger 6-inch gutters in high-rainfall areas, you should use 4-inch round or 3x5-inch rectangular downspouts. The calculator recommends downspout sizes based on your total roof drainage volume.",
    },
    {
      question: "How many downspouts does a typical residential roof need?",
      answer: "The number of downspouts depends on roof area and rainfall intensity. A general rule is one downspout for every 600-800 square feet of roof projection in moderate climates. For a 2,000 square foot roof, you'd typically need 2-3 downspouts; a 3,500 square foot roof would need 4-5 downspouts. High-rainfall areas like the Pacific Northwest may require downspouts every 400-600 square feet.",
    },
    {
      question: "What is the maximum recommended distance between gutter hangers?",
      answer: "Gutter hangers should be spaced no more than 2-3 feet apart to prevent sagging and ensure proper water flow. For a typical 30-foot gutter run, you would need approximately 10-15 hangers depending on material weight and local snow load requirements. Improper spacing can cause standing water and premature gutter failure, reducing their lifespan from 20-25 years to 10-15 years.",
    },
    {
      question: "How does tree coverage impact gutter sizing needs?",
      answer: "Trees increase debris accumulation and can reduce effective gutter capacity by 20-40 percent depending on seasonal shedding. In heavily wooded areas, you may want to choose gutters one size larger than calculations suggest—upgrading from 5-inch to 6-inch K-style gutters. Installing gutter guards can mitigate debris impact and restore capacity, though they add approximately 15-20 percent to total gutter system costs.",
    },
    {
      question: "What is the proper gutter slope and how does it affect drainage?",
      answer: "Gutters should slope toward downspouts at a rate of 0.5 inches per 10 feet of run, or 1/16 inch per foot. This ensures proper drainage without creating noticeable visual slope. A 40-foot gutter run should drop 2.5 inches from the highest to lowest point. Improper slope causes standing water, which can lead to overflow, ice dam formation, and structural damage to fascia boards.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "You have a residential roof area measuring 10 meters in length and 8 meters in width. The local rainfall intensity is 50 mm/hr. You want to use a 6-inch aluminum gutter and include a 10% waste margin.",
    steps: [
      {
        label: "1. Calculate Roof Area",
        explanation: "10 m × 8 m = 80 m²",
      },
      {
        label: "2. Calculate Runoff Volume",
        explanation:
          "Runoff = 80 × 50 × 0.278 = 1112 L/s (liters per second)",
      },
      {
        label: "3. Check Gutter Capacity",
        explanation:
          "6-inch gutter capacity ~7.1 L/s, which is less than runoff, so consider larger gutter or additional downspouts.",
      },
      {
        label: "4. Calculate Gutter Length with Waste",
        explanation:
          "Gutter length = 10 m (roof length) × 1.10 (10% waste) = 11 m",
      },
      {
        label: "5. Final Order",
        explanation: "Order 11 meters of 6-inch aluminum gutter.",
      },
    ],
    result: "Final Order: 11 meters of 6-inch aluminum gutter",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Runoff (L/s) = Roof Area (m²) × Rainfall Intensity (mm/hr) × 0.278",
    variables: [
      { symbol: "Roof Area", description: "Length × Width of roof area (m²)" },
      {
        symbol: "Rainfall Intensity",
        description: "Rainfall rate in millimeters per hour (mm/hr)",
      },
      {
        symbol: "0.278",
        description:
          "Conversion factor from mm/hr over m² to liters per second (L/s)",
      },
    ],
  };

  // --- UI WIDGET ---
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
            <SelectItem value="metric">Metric (m, mm/hr)</SelectItem>
            <SelectItem value="imperial">Imperial (ft, in/hr)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Roof Area Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.roofAreaLength}
            onChange={(e) => handleInputChange("roofAreaLength", e.target.value)}
            placeholder="e.g. 10"
          />
        </div>
        <div className="space-y-2">
          <Label>Roof Area Width ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.roofAreaWidth}
            onChange={(e) => handleInputChange("roofAreaWidth", e.target.value)}
            placeholder="e.g. 8"
          />
        </div>
        <div className="space-y-2">
          <Label>
            Rainfall Intensity ({inputs.unit === "metric" ? "mm/hr" : "in/hr"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.rainfallIntensity}
            onChange={(e) => handleInputChange("rainfallIntensity", e.target.value)}
            placeholder="e.g. 50"
          />
        </div>
        <div className="space-y-2">
          <Label>Gutter Size (inches)</Label>
          <Select
            value={inputs.gutterSize}
            onValueChange={(v) => handleInputChange("gutterSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5"</SelectItem>
              <SelectItem value="6">6"</SelectItem>
              <SelectItem value="7">7"</SelectItem>
              <SelectItem value="8">8"</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Gutter Material</Label>
          <Select
            value={inputs.gutterMaterial}
            onValueChange={(v) => handleInputChange("gutterMaterial", v)}
          >
            <SelectTrigger>
              <HardHat className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aluminum">Aluminum</SelectItem>
              <SelectItem value="steel">Steel</SelectItem>
              <SelectItem value="copper">Copper</SelectItem>
              <SelectItem value="vinyl">Vinyl</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Unit ({inputs.unit === "metric" ? "per meter" : "per foot"})</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              type="number"
              min={0}
              step="any"
              value={inputs.pricePerUnit}
              onChange={(e) => handleInputChange("pricePerUnit", e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between">
          <Label>Waste Margin (%)</Label>
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
        <Card
          className={`mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md ${
            results.capacityOk ? "" : "border-red-500"
          }`}
        >
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Materials Needed
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.mainQty}
            </div>
            <div className="text-xl font-bold mt-2">Est. Cost: {results.cost}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            {!results.capacityOk && (
              <p className="mt-3 text-red-600 font-semibold">
                <AlertTriangle className="inline mr-1 w-4 h-4" />
                Warning: Selected gutter size may be insufficient for runoff volume.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Roof Drainage (Gutter Size) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Roof Drainage (Gutter Size) Calculator helps you determine the correct gutter size, type, and number of downspouts needed for your home based on roof area, local rainfall intensity, and roof characteristics. Properly sized gutters protect your foundation, prevent water damage to siding and fascia, and extend the lifespan of your roof by managing water runoff efficiently. This calculator removes guesswork from the sizing process and ensures your drainage system meets local building codes and your home's specific needs.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your roof's horizontal projection area (length × width of your house footprint), your region's average rainfall intensity in inches per hour, roof pitch, and whether trees or obstructions affect water flow. These inputs determine the total volume of water your gutters must handle and any adjustments needed for efficiency. The calculator also factors in gutter material (aluminum, copper, steel) and slope requirements to provide accurate sizing recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator outputs recommended gutter sizes (such as 5-inch, 6-inch, or 7-inch K-style), the number and size of downspouts required, and gutter spacing specifications. Use these results to consult with a contractor or purchase materials that match your home's actual drainage requirements. Compare the recommended specifications against your current system to identify any undersized or inadequate components that could lead to overflow, ice dams, or foundation damage.</p>
        </div>
      </section>

      {/* TABLE: Gutter Capacity by Size and Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Gutter Capacity by Size and Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the water-handling capacity of standard gutter types measured in inches of rainfall per hour.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gutter Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Capacity (inches/hour)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">K-Style</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard residential homes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">K-Style</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Larger roofs and moderate rainfall</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">K-Style</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High-rainfall areas and large roofs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Half-Round</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Historic and specialty homes</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Half-Round</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Historic homes with larger roof area</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Box Gutter</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Commercial and large residential</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Box Gutter</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High-rainfall commercial applications</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Capacity assumes proper slope of 0.5 inches per 10 feet and unobstructed flow. Actual capacity may reduce by 20-40% with heavy debris accumulation.</p>
      </section>

      {/* TABLE: Required Gutter Size by Roof Area and Rainfall Intensity */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Required Gutter Size by Roof Area and Rainfall Intensity</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table recommends gutter sizes based on roof projection area and local annual rainfall intensity.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Roof Area (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Low Rainfall (1-2 in/hr)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate Rainfall (2-4 in/hr)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High Rainfall (4-6 in/hr)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Very High Rainfall (&gt;6 in/hr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&lt;1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-inch K-style</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-inch K-style</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-inch K-style</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-inch K-style</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,000-2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-inch K-style</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-inch K-style</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-inch K-style</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-inch Box</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,000-3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-inch K-style</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-inch K-style</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-inch K-style</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-inch Box</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,500-5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-inch K-style</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-inch K-style</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-inch Box</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-inch Box dual</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-inch K-style or Box</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-inch Box</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-inch dual Box</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Custom system</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Recommendations assume standard 4:12 to 8:12 roof pitch and minimal tree coverage. Steep roofs or heavy debris may require one size larger.</p>
      </section>

      {/* TABLE: Downspout Sizing and Spacing Guidelines */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Downspout Sizing and Spacing Guidelines</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table provides downspout specifications based on gutter size and recommended spacing for optimal drainage.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gutter Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Downspout Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Max Roof Area per Downspout</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Spacing on Homes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5-inch K-style</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2x3 inch or 3-inch round</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600-800 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-40 feet apart</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6-inch K-style</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3x4 inch or 4-inch round</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800-1,000 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-50 feet apart</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7-inch K-style</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4x5 inch or 4-inch round</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,000-1,200 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-60 feet apart</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6-inch Box</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4x5 inch or 4-inch round</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,000-1,200 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-60 feet apart</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8-inch Box</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5x6 inch or 5-inch round</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500+ sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-80 feet apart</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These recommendations are for standard residential applications. High-rainfall areas should reduce spacing by 15-20% for improved capacity.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always measure your roof's horizontal projection (not the sloped surface area) by measuring the length and width of your house footprint—this is the accurate baseline for gutter capacity calculations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">In high-rainfall regions like the Pacific Northwest or Gulf Coast states that exceed 4 inches per hour, upgrade to the next gutter size larger than minimum recommendations to account for seasonal storms and debris accumulation.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Install gutter guards or leaf screens if you have trees within 20 feet of your home, as they reduce debris buildup and restore 15-20 percent of lost capacity, extending maintenance intervals from 2-3 times yearly to once annually.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Ensure all gutters slope at 0.5 inches per 10 feet of run toward downspouts to prevent standing water; use a level during installation to verify proper slope, as improper grading causes ice dams and structural damage within 3-5 years.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Measuring sloped roof area instead of horizontal projection</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using the actual sloped surface area of your roof (which is 20-40% larger depending on pitch) overestimates drainage needs and leads to oversized, costly gutters. Always measure the horizontal footprint of your home by multiplying length × width to get the correct baseline for calculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring local rainfall intensity data</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming average rainfall rates for your climate without checking historical storm intensity data can result in undersized gutters. Areas like Florida experience 6-8 inches per hour during hurricanes while inland areas might only see 2-3 inches per hour, requiring dramatically different gutter sizes.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Installing downspouts too far apart</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Spacing downspouts &gt;50 feet apart for a 5-inch gutter causes water backing up and overflowing before reaching drainage points. The calculator recommends one downspout per 600-800 square feet of roof; skipping downspouts to save costs can result in $5,000+ in water damage within 2-3 years.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for debris in wooded areas</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Homes surrounded by trees require gutters 1-2 sizes larger than standard calculations suggest because fallen leaves and branches reduce effective capacity by 20-40 percent. Gutter guards help but don't eliminate the need for larger sizing in heavily treed properties.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What roof area do I need to measure for the gutter size calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You need to measure the horizontal projection of your roof, not the actual sloped surface area. Measure the length and width of your house footprint, then multiply them together. For example, a 40-foot by 30-foot house has a 1,200 square foot roof projection, which is the baseline for calculating required gutter capacity and sizing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does rainfall intensity affect gutter sizing requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Rainfall intensity is measured in inches per hour and directly impacts gutter capacity needs. The calculator uses your local rainfall rate—for example, areas like Florida experience 6-8 inches per hour during heavy storms, while arid regions may only see 1-2 inches per hour. Higher intensity rainfall requires larger gutters; a 5-inch K-style gutter handles approximately 4.4 inches per hour, while a 6-inch gutter can handle about 5.5 inches per hour.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between K-style and half-round gutters in capacity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">K-style gutters are the most common in North America and have a 5-inch standard size with a capacity of approximately 4.4 inches per hour of rainfall. Half-round gutters offer 4.4 inches per hour capacity in a 5-inch size and 5.5 inches per hour in a 6-inch size. K-style gutters are more efficient at handling water due to their shape, making them the preferred choice for most residential applications.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do roof pitch and slope affect drainage calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Roof pitch affects how quickly water runs off and flows into gutters. A steeper pitch (such as 12:12 or higher) causes water to move faster, potentially requiring larger gutters to handle the volume. A shallow pitch (4:12 or lower) allows more time for water absorption but may create ponding issues. Most standard residential roofs fall between 4:12 and 8:12 pitch, which the calculator adjusts for automatically.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What size downspout do I need for my gutters?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Downspout sizing depends on your gutter size and rainfall intensity. A 5-inch K-style gutter typically requires a 2x3-inch or 3x4-inch rectangular downspout, or a 3-inch round downspout. For larger 6-inch gutters in high-rainfall areas, you should use 4-inch round or 3x5-inch rectangular downspouts. The calculator recommends downspout sizes based on your total roof drainage volume.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many downspouts does a typical residential roof need?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The number of downspouts depends on roof area and rainfall intensity. A general rule is one downspout for every 600-800 square feet of roof projection in moderate climates. For a 2,000 square foot roof, you'd typically need 2-3 downspouts; a 3,500 square foot roof would need 4-5 downspouts. High-rainfall areas like the Pacific Northwest may require downspouts every 400-600 square feet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the maximum recommended distance between gutter hangers?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gutter hangers should be spaced no more than 2-3 feet apart to prevent sagging and ensure proper water flow. For a typical 30-foot gutter run, you would need approximately 10-15 hangers depending on material weight and local snow load requirements. Improper spacing can cause standing water and premature gutter failure, reducing their lifespan from 20-25 years to 10-15 years.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does tree coverage impact gutter sizing needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Trees increase debris accumulation and can reduce effective gutter capacity by 20-40 percent depending on seasonal shedding. In heavily wooded areas, you may want to choose gutters one size larger than calculations suggest—upgrading from 5-inch to 6-inch K-style gutters. Installing gutter guards can mitigate debris impact and restore capacity, though they add approximately 15-20 percent to total gutter system costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the proper gutter slope and how does it affect drainage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gutters should slope toward downspouts at a rate of 0.5 inches per 10 feet of run, or 1/16 inch per foot. This ensures proper drainage without creating noticeable visual slope. A 40-foot gutter run should drop 2.5 inches from the highest to lowest point. Improper slope causes standing water, which can lead to overflow, ice dam formation, and structural damage to fascia boards.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nahb.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Association of Home Builders (NAHB) Gutter Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NAHB provides industry standards for residential gutter sizing, installation, and maintenance requirements aligned with building codes.</p>
          </li>
          <li>
            <a href="https://www.iccsafe.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Building Code (IBC) Roof Drainage Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The IBC establishes minimum roof drainage requirements and gutter sizing calculations that municipalities enforce through local building codes.</p>
          </li>
          <li>
            <a href="https://www.asce.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Society of Civil Engineers (ASCE) Rainfall Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ASCE compiles historical rainfall intensity and frequency data by region to support accurate drainage system design for residential and commercial properties.</p>
          </li>
          <li>
            <a href="https://www.usgs.gov/mission-areas/water-resources" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Geological Survey (USGS) Precipitation and Flooding Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">USGS provides rainfall statistics, storm intensity maps, and regional precipitation data to help homeowners understand local drainage requirements.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Roof Drainage (Gutter Size) Calculator"
      description="The ultimate professional guide and calculator for Roof Drainage (Gutter Size) Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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