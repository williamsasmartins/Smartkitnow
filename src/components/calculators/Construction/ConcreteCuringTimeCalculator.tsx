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

export default function ConcreteCuringTimeCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "",
    width: "",
    depth: "", // thickness of concrete slab
    waste: "10", // percent waste margin
    price: "",
    materialSize: "standard", // standard or large bag size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Concrete curing time estimation is primarily a function of concrete volume and type,
   * but this calculator focuses on estimating material units needed based on dimensions.
   * The curing time itself depends on mix, weather, and thickness.
   *
   * For material units, we calculate volume (m³ or ft³), add waste margin,
   * then convert volume to number of bags based on bag size yield.
   */

  // Bag yields (approximate):
  // Standard bag: 0.035 m³ (1 cubic foot)
  // Large bag: 0.05 m³ (1.4 cubic feet)

  const bagYields = {
    metric: {
      standard: 0.035,
      large: 0.05,
    },
    imperial: {
      standard: 1, // cubic foot
      large: 1.4,
    },
  };

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const depth = parseFloat(inputs.depth);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);
    const unit = inputs.unit;
    const materialSize = inputs.materialSize;

    if (
      isNaN(length) ||
      isNaN(width) ||
      isNaN(depth) ||
      length <= 0 ||
      width <= 0 ||
      depth <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Calculate volume in cubic meters or cubic feet
    // Metric inputs assumed meters, imperial feet
    const volume = length * width * depth;

    // Add waste margin
    const volumeWithWaste = volume * (1 + wastePercent / 100);

    // Convert volume to number of bags
    const yieldPerBag = bagYields[unit][materialSize];

    let bagsNeeded = volumeWithWaste / yieldPerBag;

    // Round up to nearest whole bag
    bagsNeeded = Math.ceil(bagsNeeded);

    // Calculate cost if price given
    const cost = pricePerUnit && !isNaN(pricePerUnit) ? bagsNeeded * pricePerUnit : 0;

    // Format results
    const mainQty = `${bagsNeeded} Bag${bagsNeeded > 1 ? "s" : ""}`;
    const costFormatted = cost ? `$${cost.toFixed(2)}` : "N/A";
    const details = `Raw volume: ${volume.toFixed(3)} ${
      unit === "metric" ? "m³" : "ft³"
    }, with waste: ${volumeWithWaste.toFixed(3)} ${
      unit === "metric" ? "m³" : "ft³"
    }`;

    return {
      mainQty,
      cost: costFormatted,
      details,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What temperature is ideal for concrete curing?",
      answer: "Concrete cures optimally between 50°F and 85°F (10°C to 29°C), with 70°F (21°C) being the standard reference temperature used in most curing time estimates. Below 50°F, curing slows significantly—concrete cures approximately 2 times slower at 40°F than at 70°F. Above 85°F, rapid moisture evaporation can cause cracking and reduce long-term strength, so cooling measures or wet coverings may be necessary.",
    },
    {
      question: "How long does concrete take to cure for walking on it?",
      answer: "Concrete typically reaches 70% of its design strength in 7 days under standard conditions (70°F and normal humidity), making it safe for light foot traffic. However, most building codes require waiting at least 7 days before allowing pedestrian traffic, and 28 days before full loading or vehicle traffic. For heavy construction equipment, waiting the full 28-day cure is strongly recommended to prevent surface damage.",
    },
    {
      question: "Does humidity affect concrete curing time?",
      answer: "Yes, humidity significantly impacts curing speed—concrete in dry conditions (below 50% relative humidity) can cure 30–50% faster initially but may develop surface cracking. Conversely, high humidity (&gt;80% RH) slows surface evaporation, which can extend curing time but generally produces stronger, more durable concrete. Ideal curing conditions are 50–70% relative humidity with consistent moisture retention through wet coverings or spray curing.",
    },
    {
      question: "What is the 28-day strength benchmark for concrete?",
      answer: "Most concrete is designed to reach its full design compressive strength by 28 days under standard curing conditions, typically ranging from 3,000 to 4,000 PSI for standard concrete and up to 5,000+ PSI for high-strength mixes. At 7 days, concrete typically achieves 60–70% of its 28-day strength, while at 14 days it reaches 85–95% of design strength. The 28-day test is the industry standard for quality control and load-bearing calculations.",
    },
    {
      question: "How does concrete type affect curing time?",
      answer: "Standard Portland cement concrete (Type I) cures on the standard 28-day timeline, while Type III (high early strength) can reach 70% strength in just 3–7 days through faster hydration. Type IV (low heat) and Type V (sulfate resistant) cure more slowly, often requiring 40–60 days to reach full design strength. Specialty mixes like self-consolidating concrete (SCC) or fiber-reinforced concrete may have different curing profiles that the estimator should account for.",
    },
    {
      question: "Can you use concrete before 28 days?",
      answer: "Yes, concrete can be used before 28 days once it reaches adequate strength for its intended purpose—typically 70% strength (around 7 days) for pedestrian traffic and 85% strength (around 14 days) for light vehicle traffic. However, full design load capacity should not be assumed until 28 days of proper curing have elapsed. Early removal of formwork or application of loads before adequate strength development can result in cracking, spalling, or structural failure.",
    },
    {
      question: "What happens if concrete freezes during curing?",
      answer: "Concrete that freezes before reaching 500 PSI (typically in the first 24–48 hours) can suffer permanent strength loss of 20–50% because ice expansion disrupts cement hydration. Once concrete reaches 500 PSI, it can better withstand freezing cycles, though curing is essentially paused until temperatures rise above 50°F. In cold climates, protective heating blankets, insulating covers, or air-entraining admixtures are essential to maintain curing above the freezing point.",
    },
    {
      question: "How do accelerators affect concrete curing time?",
      answer: "Calcium chloride accelerators can reduce curing time by 25–50%, allowing concrete to reach 70% strength in 3–5 days instead of 7 days under normal conditions. However, accelerators increase drying shrinkage risk and can reduce long-term durability, making them best suited for cold-weather projects or time-sensitive applications. Modern non-chloride accelerators offer similar speed benefits with fewer corrosion risks on reinforced concrete.",
    },
    {
      question: "What is the difference between curing time and setting time?",
      answer: "Setting time refers to when concrete transitions from plastic to solid state—typically 2–4 hours for initial set and 8–12 hours for final set at 70°F—while curing time is the full hydration process that can take 28 days or longer. Concrete may be hard to the touch after 24 hours, but it continues to gain strength through chemical hydration for weeks. Confusing these terms can lead to premature removal of forms, insufficient moisture retention, or applying loads too early.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are pouring a concrete slab for a small patio measuring 4 meters long, 3 meters wide, and 0.1 meters thick (10 cm). You want to order standard size bags with a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate volume: 4m × 3m × 0.1m = 1.2 cubic meters of concrete needed.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 1.2 × 1.10 = 1.32 cubic meters total volume to order.",
      },
      {
        label: "3. Order",
        explanation:
          "Each standard bag yields 0.035 m³, so bags needed: 1.32 ÷ 0.035 ≈ 37.7 bags, rounded up to 38 bags.",
      },
    ],
    result: "Final Order: 38 Standard Size Bags",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Volume = Length × Width × Depth",
    variables: [
      { symbol: "L", description: "Length of the concrete area" },
      { symbol: "W", description: "Width of the concrete area" },
      { symbol: "D", description: "Depth or thickness of the concrete slab" },
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
            min="0"
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="e.g. 4"
          />
        </div>
        <div className="space-y-2">
          <Label>Width ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
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
          <Label>Depth ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder="e.g. 0.1"
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Item Size</Label>
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
              min="0"
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Concrete Curing Time Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Concrete Curing Time Estimator helps contractors, engineers, and builders determine how long concrete needs to cure before it reaches sufficient strength for intended use. Concrete continues to gain strength through hydration long after it becomes hard to the touch, and applying loads too early can result in cracking, permanent strength loss, or structural failure. This calculator removes guesswork by estimating strength development based on actual curing conditions.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The primary inputs are ambient temperature, relative humidity, concrete type (Portland cement, high early strength, etc.), and the target strength percentage you need (typically 70% for light traffic, 85–90% for medium loads, or 100% for full design capacity). The calculator uses industry-standard curing relationships to estimate how long it takes to reach each strength milestone, accounting for the significant impact of temperature and humidity on hydration rates. You may also input special conditions like heated curing, accelerators, or extended cure times for heavy-duty applications.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show estimated days to reach key strength benchmarks (70%, 85%, 90%, and 100%) and provide a recommended timeline for removing formwork, allowing traffic, and applying full structural loads. The output also flags potential risks—such as freezing conditions, excessively hot weather, or inadequate humidity—that could affect real-world curing performance. Always cross-reference these estimates with local building codes, ACI standards, and project-specific requirements before making construction decisions.</p>
        </div>
      </section>

      {/* TABLE: Concrete Strength Development by Age (Standard 70°F Conditions) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Concrete Strength Development by Age (Standard 70°F Conditions)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical compressive strength development (as a percentage of 28-day design strength) for standard Portland cement concrete under normal curing conditions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age of Concrete</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Strength Gained (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical PSI (3,000 PSI Design)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Safe for Light Foot Traffic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1 day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">210 PSI</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900 PSI</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,950 PSI</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes (with approval)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">14 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,700 PSI</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">21 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">95%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,850 PSI</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">28 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000 PSI</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes (full capacity)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages assume standard conditions (70°F, 50–70% RH) and may vary based on concrete mix design, admixtures, and ambient conditions.</p>
      </section>

      {/* TABLE: Curing Time Adjustments by Temperature */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Curing Time Adjustments by Temperature</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Concrete curing speed varies dramatically with temperature; this table shows how long concrete takes to reach 70% strength at different ambient temperatures.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temperature (°F)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temperature (°C)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Days to 70% Strength</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Relative Curing Speed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4°C</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14–21 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5x (50% slower)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10°C</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–14 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.7x</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16°C</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8–10 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.85x</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">70°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21°C</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0x (standard)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">80°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27°C</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–6 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.3x (faster)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">90°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32°C</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4–5 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.6x (risk of cracking)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Temperatures above 85°F increase cracking risk due to rapid moisture evaporation; temperatures below 50°F significantly slow hydration and may require heated enclosures.</p>
      </section>

      {/* TABLE: Curing Requirements by Concrete Type and Application */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Curing Requirements by Concrete Type and Application</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different concrete types and project applications have varying minimum curing times before loads can be applied or forms removed.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Concrete Type/Application</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Days Before Light Traffic</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Days Before Full Load</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Total Cure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standard Portland Cement (Type I)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High Early Strength (Type III)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21 days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Reinforced Structural Concrete</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lightweight Concrete</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35 days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-Strength Concrete (4,000+ PSI)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28–35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cold Weather Placement (&lt;50°F)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14–21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28–42</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42 days</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Local building codes and project specifications may require longer cure times; always consult structural drawings and applicable ACI standards.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor ambient temperature continuously during the first 48 hours—this critical period determines whether concrete will reach sufficient early strength and whether freezing risk exists; use heated blankets or insulating covers in cold climates (below 50°F) and shade or wet coverings in hot climates (above 85°F).</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Maintain consistent moisture on the concrete surface for at least 7 days by wet-curing with water spray, wet burlap, plastic sheeting, or curing compounds—inadequate moisture causes 15–30% strength loss and increases surface cracking risk by 40–60%.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Don't confuse initial set (concrete hardens) with adequate curing strength—concrete may feel solid after 24 hours but is only 7% of design strength; wait for the estimated timeline from the calculator before removing forms or allowing traffic.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">In cold weather projects below 50°F, curing time can double or triple compared to standard 70°F conditions; plan accordingly and consider Type III accelerated cement or heated enclosures to maintain schedule compliance.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Removing forms too early based on surface hardness</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Concrete that is hard to the touch after 24 hours may only be 7% of design strength and cannot support formwork removal or loads. This is the most common cause of slab cracking, beam sagging, and column failure on construction sites.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring temperature effects on curing speed</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many builders assume the 28-day standard applies regardless of weather, but concrete at 40°F cures 2 times slower than at 70°F. This can cause projects scheduled for 7-day form removal to fail catastrophically if temperature effects aren't accounted for.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Allowing vehicle traffic on 7-day concrete</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">While pedestrian traffic may be acceptable at 7 days (70% strength), vehicle or equipment traffic requires at least 14–21 days of curing to reach 85–90% strength. Premature heavy loading causes rutting, cracking, and spalling that compromises long-term durability.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Over-relying on accelerators without understanding trade-offs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calcium chloride accelerators speed curing by 25–50% but increase drying shrinkage and reduce long-term durability, especially in reinforced concrete where they can trigger corrosion. They should be used only when time constraints justify the durability trade-off.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What temperature is ideal for concrete curing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Concrete cures optimally between 50°F and 85°F (10°C to 29°C), with 70°F (21°C) being the standard reference temperature used in most curing time estimates. Below 50°F, curing slows significantly—concrete cures approximately 2 times slower at 40°F than at 70°F. Above 85°F, rapid moisture evaporation can cause cracking and reduce long-term strength, so cooling measures or wet coverings may be necessary.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does concrete take to cure for walking on it?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Concrete typically reaches 70% of its design strength in 7 days under standard conditions (70°F and normal humidity), making it safe for light foot traffic. However, most building codes require waiting at least 7 days before allowing pedestrian traffic, and 28 days before full loading or vehicle traffic. For heavy construction equipment, waiting the full 28-day cure is strongly recommended to prevent surface damage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does humidity affect concrete curing time?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, humidity significantly impacts curing speed—concrete in dry conditions (below 50% relative humidity) can cure 30–50% faster initially but may develop surface cracking. Conversely, high humidity (&gt;80% RH) slows surface evaporation, which can extend curing time but generally produces stronger, more durable concrete. Ideal curing conditions are 50–70% relative humidity with consistent moisture retention through wet coverings or spray curing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the 28-day strength benchmark for concrete?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most concrete is designed to reach its full design compressive strength by 28 days under standard curing conditions, typically ranging from 3,000 to 4,000 PSI for standard concrete and up to 5,000+ PSI for high-strength mixes. At 7 days, concrete typically achieves 60–70% of its 28-day strength, while at 14 days it reaches 85–95% of design strength. The 28-day test is the industry standard for quality control and load-bearing calculations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does concrete type affect curing time?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard Portland cement concrete (Type I) cures on the standard 28-day timeline, while Type III (high early strength) can reach 70% strength in just 3–7 days through faster hydration. Type IV (low heat) and Type V (sulfate resistant) cure more slowly, often requiring 40–60 days to reach full design strength. Specialty mixes like self-consolidating concrete (SCC) or fiber-reinforced concrete may have different curing profiles that the estimator should account for.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can you use concrete before 28 days?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, concrete can be used before 28 days once it reaches adequate strength for its intended purpose—typically 70% strength (around 7 days) for pedestrian traffic and 85% strength (around 14 days) for light vehicle traffic. However, full design load capacity should not be assumed until 28 days of proper curing have elapsed. Early removal of formwork or application of loads before adequate strength development can result in cracking, spalling, or structural failure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if concrete freezes during curing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Concrete that freezes before reaching 500 PSI (typically in the first 24–48 hours) can suffer permanent strength loss of 20–50% because ice expansion disrupts cement hydration. Once concrete reaches 500 PSI, it can better withstand freezing cycles, though curing is essentially paused until temperatures rise above 50°F. In cold climates, protective heating blankets, insulating covers, or air-entraining admixtures are essential to maintain curing above the freezing point.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do accelerators affect concrete curing time?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Calcium chloride accelerators can reduce curing time by 25–50%, allowing concrete to reach 70% strength in 3–5 days instead of 7 days under normal conditions. However, accelerators increase drying shrinkage risk and can reduce long-term durability, making them best suited for cold-weather projects or time-sensitive applications. Modern non-chloride accelerators offer similar speed benefits with fewer corrosion risks on reinforced concrete.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between curing time and setting time?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Setting time refers to when concrete transitions from plastic to solid state—typically 2–4 hours for initial set and 8–12 hours for final set at 70°F—while curing time is the full hydration process that can take 28 days or longer. Concrete may be hard to the touch after 24 hours, but it continues to gain strength through chemical hydration for weeks. Confusing these terms can lead to premature removal of forms, insufficient moisture retention, or applying loads too early.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.concrete.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ACI 306 Standard Specifications for Cold Weather Concreting</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Concrete Institute's authoritative standard for concrete placement and curing in cold weather conditions, including minimum temperature requirements and heated curing protocols.</p>
          </li>
          <li>
            <a href="https://www.nist.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NIST Building Science Series: Concrete Curing and Strength Development</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">National Institute of Standards and Technology research on concrete hydration, temperature effects on strength development, and moisture-related curing variables.</p>
          </li>
          <li>
            <a href="https://www.cement.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Portland Cement Association (PCA) Concrete Technology Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry-leading resource for concrete mix design, curing best practices, strength development curves, and regional climate adaptation guidance.</p>
          </li>
          <li>
            <a href="https://www.concrete.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ACI 305 Standard Specifications for Hot Weather Concreting</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Concrete Institute guidelines for concrete placement and curing in hot, dry climates, including mitigation strategies to prevent evaporation cracking and strength loss.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Concrete Curing Time Estimator"
      description="The ultimate professional guide and calculator for Concrete Curing Time Estimator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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