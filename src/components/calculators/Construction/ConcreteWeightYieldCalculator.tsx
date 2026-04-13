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

export default function ConcreteWeightYieldCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "",
    width: "",
    depth: "", // thickness or height of concrete slab
    waste: "10", // percentage waste margin
    price: "",
    materialSize: "standard", // standard or large bag size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Constants for calculation:
   * Concrete density approx 2400 kg/m³ (150 lb/ft³)
   * Standard bag yields:
   * - Standard bag: 0.03 m³ (1 cubic foot) per 40 kg bag (approx)
   * - Large bag: 0.05 m³ (1.75 cubic feet) per 60 kg bag (approx)
   *
   * For simplicity:
   * Metric:
   * - Density: 2400 kg/m³
   * - Standard bag volume: 0.03 m³
   * - Large bag volume: 0.05 m³
   *
   * Imperial:
   * - Density: 150 lb/ft³
   * - Standard bag volume: 1 ft³
   * - Large bag volume: 1.75 ft³
   */

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

    // Calculate volume
    // Metric: m x m x m = m³
    // Imperial: ft x ft x ft = ft³
    const volume = length * width * depth;

    // Add waste margin
    const volumeWithWaste = volume * (1 + wastePercent / 100);

    // Bag volume based on material size and unit
    let bagVolume = 0;
    if (unit === "metric") {
      bagVolume = materialSize === "standard" ? 0.03 : 0.05; // m³ per bag
    } else {
      bagVolume = materialSize === "standard" ? 1 : 1.75; // ft³ per bag
    }

    // Calculate number of bags needed, round up to next whole bag
    const bagsNeeded = Math.ceil(volumeWithWaste / bagVolume);

    // Calculate cost if price per unit provided
    const cost =
      !isNaN(pricePerUnit) && pricePerUnit > 0
        ? `$${(bagsNeeded * pricePerUnit).toFixed(2)}`
        : "N/A";

    // Calculate raw volume without waste for details
    const rawVolumeStr =
      unit === "metric"
        ? `${volume.toFixed(3)} m³`
        : `${volume.toFixed(3)} ft³`;

    return {
      mainQty: `${bagsNeeded} Bags`,
      cost,
      details: `Raw Volume: ${rawVolumeStr}`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [
    inputs.length,
    inputs.width,
    inputs.depth,
    inputs.waste,
    inputs.price,
    inputs.unit,
    inputs.materialSize,
  ]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "How much does a cubic yard of concrete weigh?",
      answer: "A standard cubic yard of concrete weighs approximately 3,600 to 4,050 pounds (1.8 to 2.0 tons), depending on the mix design and aggregate density. Most ready-mix concrete suppliers use 3,700 to 3,900 pounds per cubic yard as the standard benchmark. Air content, water-to-cement ratio, and aggregate type can cause variations of up to 5% in total weight.",
    },
    {
      question: "What is the difference between concrete yield and concrete weight?",
      answer: "Concrete yield refers to the volume of finished concrete produced from a given batch of materials, typically measured in cubic yards per mix. Concrete weight measures the total mass of that finished concrete, usually expressed in pounds or tons per cubic yard. Understanding both metrics is essential for accurate material ordering and truck load calculations, as yield affects volume coverage while weight determines structural load capacity.",
    },
    {
      question: "How do I calculate the weight of concrete needed for a slab?",
      answer: "Multiply the length × width × depth (in feet) to get cubic feet, then divide by 27 to convert to cubic yards. Multiply the cubic yards by 3,700 pounds (standard weight per cubic yard) to get total weight in pounds, or divide by 2,000 for tons. For example, a 10×20-foot slab at 4 inches deep equals 24.7 cubic yards, weighing approximately 91,500 pounds or 45.75 tons.",
    },
    {
      question: "Does the type of aggregate affect concrete weight?",
      answer: "Yes, aggregate selection significantly impacts concrete weight. Normal-weight concrete using river gravel and sand averages 3,700–3,900 pounds per cubic yard, while lightweight concrete with expanded clay or shale may weigh only 2,400–3,000 pounds per cubic yard. Heavyweight concrete using barite or iron ore aggregates can exceed 4,500 pounds per cubic yard, making aggregate type one of the most important variables in weight calculation.",
    },
    {
      question: "How many bags of concrete mix make one cubic yard?",
      answer: "One cubic yard of concrete requires approximately 45 to 60 bags of 80-pound premixed concrete, or 36 to 50 bags of 94-pound bags, depending on desired strength and mix proportions. The most common benchmark is 45–50 bags of 80-pound concrete per cubic yard for standard 4,000 PSI concrete. Using premixed bags is more suitable for small projects under 1 cubic yard rather than large pours, where ready-mix trucks are more economical.",
    },
    {
      question: "What factors cause variation in concrete yield?",
      answer: "Key factors affecting yield include water content, air entrainment (typically 4–7% for freeze-thaw protection), aggregate gradation, and admixtures used. Excess water can reduce yield by 2–5% while increasing weight inconsistently, whereas air entrainment intentionally reduces yield but improves durability. Temperature, mixing time, and material moisture content also play roles, which is why quality control testing is essential for precision projects.",
    },
    {
      question: "How much does reinforced concrete weigh compared to standard concrete?",
      answer: "Reinforced concrete (with rebar or mesh) weighs slightly more than standard concrete due to the steel reinforcement, adding approximately 50–150 pounds per cubic yard depending on rebar density and spacing. For example, typical concrete slab reinforced with #4 rebar on 12-inch centers adds roughly 75 pounds per cubic yard. This additional weight is usually minor (1–3%) compared to base concrete weight but is essential to include in structural load calculations.",
    },
    {
      question: "What is the relationship between PSI and concrete weight?",
      answer: "Concrete weight and PSI (pounds per square inch compressive strength) are not directly proportional; a heavier mix does not necessarily mean higher strength. However, strength is influenced by water-to-cement ratio and curing conditions rather than aggregate weight alone. A 4,000 PSI mix and a 6,000 PSI mix may weigh nearly the same (both ~3,700 lbs/cy) if they use similar aggregates but different cement content and hydration protocols.",
    },
    {
      question: "How do I account for waste and over-order in concrete calculations?",
      answer: "Industry standard practice is to add 5–10% overage to calculated concrete volume to account for spillage, uneven subgrades, and measurement errors. For a project requiring 50 cubic yards, ordering 52.5 to 55 cubic yards is recommended to ensure adequate coverage. This buffer is particularly important for slabs, where subgrade settling and surface irregularities can consume more material than flat calculations suggest.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a concrete slab for a small patio measuring 4 meters long, 3 meters wide, and 0.15 meters deep. You want to order standard size concrete bags and include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate volume: 4 m × 3 m × 0.15 m = 1.8 m³ of concrete needed.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 1.8 m³ × 1.10 = 1.98 m³ total volume to order.",
      },
      {
        label: "3. Order",
        explanation:
          "Each standard bag yields 0.03 m³, so divide total volume by bag volume: 1.98 ÷ 0.03 = 66 bags. Order 66 bags to cover the project.",
      },
    ],
    result: "Final Order: 66 Standard Bags of Concrete",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Volume = Length × Width × Depth",
    variables: [
      { symbol: "L", description: "Length of the area" },
      { symbol: "W", description: "Width of the area" },
      { symbol: "D", description: "Depth or Thickness of concrete" },
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
            placeholder="e.g. 4"
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
            placeholder="e.g. 3"
          />
        </div>
        <div className="space-y-2">
          <Label>Depth ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder="e.g. 0.15"
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
          <Label>Price per Bag</Label>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Concrete Weight & Yield Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Concrete Weight & Yield Calculator is designed to help contractors, engineers, and DIY builders accurately estimate the weight and volume of concrete needed for construction projects. By inputting basic project dimensions and concrete mix specifications, you can quickly determine material quantities, truck load requirements, and structural load estimates. This tool eliminates guesswork and reduces costly over-ordering or material shortages on job sites.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator requires three key inputs: (1) project dimensions (length, width, and depth in feet or inches), (2) concrete type or mix design (standard, lightweight, or heavyweight), and (3) any reinforcement specifications if applicable. The concrete type selection directly influences the weight-per-cubic-yard baseline used in calculations—standard concrete at 3,700 lbs/cy versus lightweight at 2,700 lbs/cy will produce significantly different results. Understanding your specific mix requirements before entering data ensures accuracy.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator outputs total cubic yards needed, total weight in pounds and tons, and often provides breakdowns by truck load capacity (typically 10–12 cubic yards per ready-mix truck). Use these results to coordinate with concrete suppliers, plan staging areas, and verify that existing structures or foundations can support the applied loads. Cross-reference calculated weight against structural plans and building codes to ensure compliance, especially for elevated slabs or specialty applications.</p>
        </div>
      </section>

      {/* TABLE: Concrete Weight by Type and Mix Design */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Concrete Weight by Type and Mix Design</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the typical weight ranges for various concrete mix types used in residential, commercial, and specialized applications.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Concrete Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight per Cubic Yard (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight per Cubic Yard (tons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Common Applications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Normal-Weight Concrete (Standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,700–3,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.85–1.95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Driveways, patios, foundations, floors</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Air-Entrained Concrete (4–6% air)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,400–3,700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.70–1.85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Outdoor slabs, freeze-thaw regions</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lightweight Concrete (expanded clay)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,400–3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.20–1.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Non-structural fills, roofing decks</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Self-Consolidating Concrete (SCC)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,650–3,850</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.83–1.93</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Intricate forms, high-rise applications</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-Strength Concrete (6,000+ PSI)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,700–3,950</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.85–1.98</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Bridge decks, parking structures</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Heavyweight Concrete (barite/iron)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,500–5,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.25–2.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Radiation shielding, ballast walls</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Weights vary based on aggregate source, water content, and regional cement standards. Always verify with local suppliers for project-specific mix designs.</p>
      </section>

      {/* TABLE: Concrete Yield Calculations by Cubic Yard Volume */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Concrete Yield Calculations by Cubic Yard Volume</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how to estimate finished concrete volume and material weight for common project sizes.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Project Dimensions</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Cubic Feet</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cubic Yards Needed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight at 3,700 lbs/cy</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight in Tons</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4"×10×10 ft slab</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,588 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.29</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4"×20×20 ft slab</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">133.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.94</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18,278 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.14</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4"×30×30 ft slab</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">41,107 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20.55</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6"×15×25 ft slab</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">225</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.33</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30,811 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.41</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8"×40×50 ft driveway</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,333.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">49.38</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">182,706 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">91.35</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Typical sidewalk (4"×3×50 ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6,845 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.42</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Cubic yards = (length × width × depth in feet) ÷ 27. All weight calculations use 3,700 lbs/cy baseline; actual weight varies by mix design.</p>
      </section>

      {/* TABLE: Bags of Concrete Mix Required per Cubic Yard */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Bags of Concrete Mix Required per Cubic Yard</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the number of pre-mixed concrete bags needed to achieve one cubic yard, by bag weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bag Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bags per Cubic Yard</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Mix Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">67–74 bags</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,680–2,960 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not recommended; excessive mixing labor</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50–56 bags</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000–3,360 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Small patios, repair patches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">80 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45–50 bags</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,600–4,000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Most common for DIY projects</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">94 lbs (Type I/II cement)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36–40 bags</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,384–3,760 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Larger DIY projects, better coverage</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">110 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32–35 bags</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,520–3,850 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Professional use, specialized mixes</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Bag counts vary based on desired slump, water content, and aggregate grading. Premixed bags are most economical for projects &lt;2 cubic yards.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always add 5–10% overage to your calculated concrete volume to account for spillage, subgrade settling, and uneven surfaces—a 50 cubic yard project should order 52.5–55 cubic yards to avoid running short mid-pour.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Verify the specific weight-per-cubic-yard value with your local ready-mix concrete supplier before finalizing orders, as regional aggregate sources and mix designs can vary by 100–200 pounds per cubic yard.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">For projects with reinforcement (rebar or welded wire mesh), add 50–150 pounds per cubic yard to account for steel weight, and document this in load calculations to comply with structural engineering requirements.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Request concrete delivery tickets that specify actual weight (not just volume) from your supplier; this provides verification data for quality assurance and helps resolve disputes if overages or shortages occur.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing cubic feet with cubic yards</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many builders mistakenly calculate in cubic feet then forget to divide by 27 to convert to cubic yards, resulting in calculations that are 27 times too large. Always convert final cubic feet to cubic yards (÷27) before multiplying by weight-per-cubic-yard figures to avoid massive over-ordering.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using incorrect slab depth in calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Entering slab depth in inches without converting to decimal feet (e.g., entering '4' instead of '0.33' for 4 inches) leads to wildly inflated volume and weight estimates. Always convert inches to decimal feet: 4 inches = 0.33 feet, 6 inches = 0.5 feet, 8 inches = 0.67 feet.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring air entrainment in freeze-thaw regions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Neglecting to select air-entrained concrete for outdoor slabs in cold climates results in underestimated volume, as air-entrained mixes (4–6% air) weigh 200–300 pounds less per cubic yard than standard concrete. In northern regions, always specify air entrainment to prevent spalling and scaling damage.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for subgrade irregularities</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating concrete for perfectly level, flat subgrades is unrealistic; actual site conditions often require 10% extra material to fill low spots and accommodate uneven ground. Failure to add this buffer commonly results in short pours that require expensive emergency material deliveries.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does a cubic yard of concrete weigh?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A standard cubic yard of concrete weighs approximately 3,600 to 4,050 pounds (1.8 to 2.0 tons), depending on the mix design and aggregate density. Most ready-mix concrete suppliers use 3,700 to 3,900 pounds per cubic yard as the standard benchmark. Air content, water-to-cement ratio, and aggregate type can cause variations of up to 5% in total weight.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between concrete yield and concrete weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Concrete yield refers to the volume of finished concrete produced from a given batch of materials, typically measured in cubic yards per mix. Concrete weight measures the total mass of that finished concrete, usually expressed in pounds or tons per cubic yard. Understanding both metrics is essential for accurate material ordering and truck load calculations, as yield affects volume coverage while weight determines structural load capacity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the weight of concrete needed for a slab?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Multiply the length × width × depth (in feet) to get cubic feet, then divide by 27 to convert to cubic yards. Multiply the cubic yards by 3,700 pounds (standard weight per cubic yard) to get total weight in pounds, or divide by 2,000 for tons. For example, a 10×20-foot slab at 4 inches deep equals 24.7 cubic yards, weighing approximately 91,500 pounds or 45.75 tons.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the type of aggregate affect concrete weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, aggregate selection significantly impacts concrete weight. Normal-weight concrete using river gravel and sand averages 3,700–3,900 pounds per cubic yard, while lightweight concrete with expanded clay or shale may weigh only 2,400–3,000 pounds per cubic yard. Heavyweight concrete using barite or iron ore aggregates can exceed 4,500 pounds per cubic yard, making aggregate type one of the most important variables in weight calculation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many bags of concrete mix make one cubic yard?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">One cubic yard of concrete requires approximately 45 to 60 bags of 80-pound premixed concrete, or 36 to 50 bags of 94-pound bags, depending on desired strength and mix proportions. The most common benchmark is 45–50 bags of 80-pound concrete per cubic yard for standard 4,000 PSI concrete. Using premixed bags is more suitable for small projects under 1 cubic yard rather than large pours, where ready-mix trucks are more economical.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors cause variation in concrete yield?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Key factors affecting yield include water content, air entrainment (typically 4–7% for freeze-thaw protection), aggregate gradation, and admixtures used. Excess water can reduce yield by 2–5% while increasing weight inconsistently, whereas air entrainment intentionally reduces yield but improves durability. Temperature, mixing time, and material moisture content also play roles, which is why quality control testing is essential for precision projects.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does reinforced concrete weigh compared to standard concrete?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Reinforced concrete (with rebar or mesh) weighs slightly more than standard concrete due to the steel reinforcement, adding approximately 50–150 pounds per cubic yard depending on rebar density and spacing. For example, typical concrete slab reinforced with #4 rebar on 12-inch centers adds roughly 75 pounds per cubic yard. This additional weight is usually minor (1–3%) compared to base concrete weight but is essential to include in structural load calculations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the relationship between PSI and concrete weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Concrete weight and PSI (pounds per square inch compressive strength) are not directly proportional; a heavier mix does not necessarily mean higher strength. However, strength is influenced by water-to-cement ratio and curing conditions rather than aggregate weight alone. A 4,000 PSI mix and a 6,000 PSI mix may weigh nearly the same (both ~3,700 lbs/cy) if they use similar aggregates but different cement content and hydration protocols.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for waste and over-order in concrete calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Industry standard practice is to add 5–10% overage to calculated concrete volume to account for spillage, uneven subgrades, and measurement errors. For a project requiring 50 cubic yards, ordering 52.5 to 55 cubic yards is recommended to ensure adequate coverage. This buffer is particularly important for slabs, where subgrade settling and surface irregularities can consume more material than flat calculations suggest.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.concrete.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Concrete Institute (ACI) 211.1 Standard Practice for Selecting Proportions for Normal, Heavyweight, and Mass Concrete</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official ACI guidance on concrete mix design, proportioning, and material specifications for accurate yield and strength calculations.</p>
          </li>
          <li>
            <a href="https://www.nrmca.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NRMCA (National Ready Mixed Concrete Association) Concrete Specifications</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standards for ready-mix concrete delivery, weight verification, and quality control specifications used by concrete suppliers nationwide.</p>
          </li>
          <li>
            <a href="https://www.astm.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASTM C94 Standard Specification for Ready-Mixed Concrete</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal material standards for concrete composition, measurement, and acceptance criteria that ensure consistency across projects.</p>
          </li>
          <li>
            <a href="https://www.cement.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Portland Cement Association (PCA) Concrete Basics</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive technical reference on concrete properties, mix design factors, and weight calculations for construction professionals.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Concrete Weight & Yield Calculator"
      description="The ultimate professional guide and calculator for Concrete Weight & Yield Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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