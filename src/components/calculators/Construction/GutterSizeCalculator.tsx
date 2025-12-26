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
      question: "What is the importance of gutter size in roof drainage?",
      answer:
        "Gutter size directly affects the system's ability to handle runoff water efficiently. An undersized gutter can overflow during heavy rain, causing water damage to the building's foundation and landscaping. Proper sizing ensures optimal drainage and protects the structure.",
    },
    {
      question: "How does rainfall intensity influence gutter sizing?",
      answer:
        "Rainfall intensity, measured in mm/hr or in/hr, determines the volume of water the gutter system must handle. Higher rainfall intensities require larger gutters or additional drainage components to prevent overflow and water damage.",
    },
    {
      question: "Why is it necessary to include a waste margin in gutter material calculations?",
      answer:
        "Including a waste margin accounts for cutting losses, installation errors, and unexpected adjustments. This ensures you order enough material to complete the job without delays or additional trips to suppliers.",
    },
    {
      question: "Can I use different gutter materials interchangeably?",
      answer:
        "Different materials like aluminum, steel, copper, and vinyl have varying durability, cost, and installation requirements. While sizing calculations remain similar, material choice impacts lifespan, maintenance, and aesthetics, so choose based on project needs.",
    },
    {
      question: "How does gutter slope affect drainage performance?",
      answer:
        "Gutter slope ensures water flows toward downspouts efficiently. A typical slope is about 0.5% (5mm per meter). Insufficient slope can cause standing water and debris buildup, while excessive slope may cause water to flow too quickly, leading to overflow.",
    },
    {
      question: "What are common mistakes when sizing gutters for roof drainage?",
      answer:
        "Common mistakes include ignoring rainfall intensity, underestimating roof area, not accounting for waste, and selecting gutters with insufficient capacity. These errors can lead to costly repairs and ineffective drainage.",
    },
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
      {/* 4. GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Roof
          Drainage (Gutter Size) Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Roof drainage systems are critical components of any building's
            infrastructure, designed to channel rainwater safely away from the
            roof and foundation. The gutter size calculator helps professionals
            determine the optimal gutter dimensions and material quantities
            based on roof area, rainfall intensity, and other factors.
          </p>
          <p>
            Precision in gutter sizing is essential to prevent overflow,
            water damage, and costly repairs. Undersized gutters can lead to
            pooling water, while oversized gutters may increase unnecessary
            costs. This calculator balances these factors to provide accurate
            material estimates.
          </p>
          <p>
            Various materials are used for gutters, including aluminum,
            steel, copper, and vinyl. Each material has unique properties,
            costs, and installation requirements. This tool allows you to
            select the material type to better estimate costs and quantities.
          </p>
          <p>
            By inputting your roof dimensions, local rainfall intensity, and
            preferred gutter size, you can quickly calculate the required
            gutter length, including a waste margin for installation losses.
            This ensures you order the right amount of material the first time.
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
            <strong>Tip:</strong> Always measure the roof area that drains into
            each gutter section separately for more accurate sizing.
          </li>
          <li>
            <strong>Did You Know?</strong> Copper gutters can last over 50 years
            and develop a beautiful patina, but they come at a higher upfront
            cost.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Adding a slight slope (about 0.5%)
            to gutters ensures efficient water flow and reduces debris buildup.
          </li>
          <li>
            <strong>Tip:</strong> Consider local rainfall data and potential
            climate changes when sizing gutters for long-term reliability.
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
            <strong>1. Ignoring Rainfall Intensity:</strong> Using average or
            outdated rainfall data can lead to undersized gutters that fail
            during heavy storms.
          </p>
          <p>
            <strong>2. Not Accounting for Waste:</strong> Failing to include a
            waste margin can result in insufficient material, causing delays and
            additional costs.
          </p>
          <p>
            <strong>3. Overlooking Gutter Slope:</strong> Installing gutters
            without proper slope can cause standing water and increase debris
            accumulation.
          </p>
          <p>
            <strong>4. Selecting Incompatible Materials:</strong> Using gutters
            that do not suit the building environment or climate can reduce
            lifespan and increase maintenance.
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
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}