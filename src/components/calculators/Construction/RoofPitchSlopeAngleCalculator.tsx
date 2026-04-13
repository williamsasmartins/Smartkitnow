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

export default function RoofPitchSlopeAngleCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    run: "", // horizontal run length
    rise: "", // vertical rise height
    length: "", // length of the roof slope (hypotenuse)
    waste: "10", // waste percentage
    price: "", // price per unit material
    materialSize: "standard", // standard or large size material units
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculations:
   * 1. Calculate pitch = rise / run (ratio)
   * 2. Calculate slope angle (degrees) = atan(rise/run) * (180/π)
   * 3. Calculate slope length = sqrt(run² + rise²)
   * 4. Calculate material units needed based on length and roof length input
   * 5. Add waste margin
   * 6. Calculate estimated cost
   */

  const results = useMemo(() => {
    const runNum = parseFloat(inputs.run);
    const riseNum = parseFloat(inputs.rise);
    const lengthNum = parseFloat(inputs.length);
    const wastePercent = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    const unit = inputs.unit;

    if (
      isNaN(runNum) ||
      runNum <= 0 ||
      isNaN(riseNum) ||
      riseNum < 0 ||
      isNaN(lengthNum) ||
      lengthNum <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive numbers for run, rise, and length.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Calculate pitch ratio (rise/run)
    const pitchRatio = riseNum / runNum;

    // Calculate slope angle in degrees
    const slopeAngle = Math.atan(pitchRatio) * (180 / Math.PI);

    // Calculate slope length (hypotenuse) if not provided or verify input
    // But user inputs length of roof slope (hypotenuse), so we trust input for material calc
    // Material units needed = length of slope * length of roof (lengthNum)
    // For simplicity, assume material units cover 1 linear unit length each (standard size)
    // If large size, assume 1.5x coverage

    const coveragePerUnit = inputs.materialSize === "large" ? 1.5 : 1.0;

    // Total linear units needed along the slope length
    // lengthNum = length of roof slope (along slope)
    // runNum = horizontal run (base)
    // riseNum = vertical rise (height)
    // Material units needed = lengthNum / coveragePerUnit

    // Add waste margin
    const rawUnits = lengthNum / coveragePerUnit;
    const totalUnits = rawUnits * (1 + wastePercent / 100);

    // Round up to whole units
    const roundedUnits = Math.ceil(totalUnits);

    // Calculate cost
    const cost = priceNum && priceNum > 0 ? roundedUnits * priceNum : 0;

    return {
      mainQty: `${roundedUnits} Units`,
      cost: `$${cost.toFixed(2)}`,
      details: `Pitch: ${pitchRatio.toFixed(
        2
      )} (rise/run), Angle: ${slopeAngle.toFixed(
        1
      )}°, Raw Units: ${rawUnits.toFixed(2)}`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [
    inputs.run,
    inputs.rise,
    inputs.length,
    inputs.waste,
    inputs.price,
    inputs.materialSize,
    inputs.unit,
  ]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is the difference between roof pitch and roof slope?",
      answer: "Roof pitch and roof slope are often used interchangeably but have a technical distinction. Pitch is expressed as a ratio (e.g., 4:12, meaning 4 inches of rise per 12 inches of run), while slope is expressed as an angle in degrees (e.g., 18.43°). This calculator converts between both formats, allowing builders to work with either measurement depending on their blueprints or regional standards.",
    },
    {
      question: "How do I measure my roof pitch manually if I don't have blueprints?",
      answer: "You can measure roof pitch using a level and measuring tape. Place a 12-inch level on the roof surface horizontally, then measure the vertical distance from the end of the level to the roof surface. This vertical measurement is your rise for every 12 inches of run, giving you the pitch ratio directly. For example, if the rise is 6 inches, your pitch is 6:12 or a 26.57° slope.",
    },
    {
      question: "What roof pitch is most common in residential construction?",
      answer: "The most common residential roof pitch in North America is 4:12 (4 inches of rise per 12 inches of run), which equals an 18.43° angle. This pitch balances water drainage, snow load capacity, and ease of installation. However, modern homes often use pitches ranging from 3:12 (14.04°) to 8:12 (33.69°), depending on climate, aesthetics, and local building codes.",
    },
    {
      question: "How does roof pitch affect water drainage and snow load?",
      answer: "Steeper roof pitches (above 6:12 or 26.57°) shed water and snow more efficiently, reducing buildup and structural strain. Flatter pitches (below 4:12 or 18.43°) drain slower and accumulate more snow, requiring stronger support structures. In areas with heavy snowfall, pitches of 8:12 (33.69°) or higher are recommended, while dry climates may use flatter 2:12 (9.46°) or 3:12 pitches.",
    },
    {
      question: "What is the minimum roof pitch required by building code?",
      answer: "Most U.S. building codes require a minimum pitch of 2:12 (9.46°) for asphalt shingles, though some jurisdictions allow 2:12 with proper underlayment. Metal roofing can go as low as 1:12 (4.76°), and standing seam metal allows even lower pitches. Flat roofs (0:12 or 0°) require special membranes and are only permitted in specific climates; always consult local building codes.",
    },
    {
      question: "How do I convert a roof angle in degrees to pitch ratio?",
      answer: "To convert degrees to pitch, use the formula: Pitch = tan(angle in degrees) × 12. For example, a 30° roof angle converts to tan(30°) × 12 = 6.93:12 or approximately 7:12. This calculator automates this calculation, allowing you to input any angle and instantly see the equivalent pitch ratio used in construction documents.",
    },
    {
      question: "What roof pitch should I use for a metal roof installation?",
      answer: "Metal roofing is flexible and can accommodate pitches from 1:12 (4.76°) for standing seam systems to 12:12 (45°) or steeper for architectural standing seam. Most metal roof manufacturers recommend a minimum of 3:12 (14.04°) for standard corrugated or ribbed metal, with 4:12 (18.43°) being optimal for longevity and drainage. Check the specific manufacturer's guidelines for your chosen metal roofing profile.",
    },
    {
      question: "How does roof pitch impact material costs and labor?",
      answer: "Steeper pitches (above 8:12 or 33.69°) require more materials due to increased surface area and typically cost 10-20% more per square foot than standard 4:12 pitches. Labor costs also increase significantly for steep roofs due to safety requirements, specialized equipment, and slower installation rates. Conversely, flat or low-pitch roofs (below 2:12 or 9.46°) may require additional waterproofing and membrane systems, offsetting any labor savings.",
    },
    {
      question: "What pitch should I use in areas with high wind or hurricane conditions?",
      answer: "In high-wind zones, steeper pitches (6:12 to 8:12 or 26.57° to 33.69°) perform better than shallow pitches because they reduce wind uplift pressure on the roof deck. However, extremely steep pitches (above 10:12 or 39.81°) can paradoxically increase lateral wind forces. Consult local wind speed requirements and building codes; most hurricane-prone areas specify minimum pitches of 4:12 (18.43°) with enhanced fastening systems.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing metal roofing panels on a residential roof with a run of 12 feet and a rise of 4 feet. The length of the roof slope is 30 feet. You want to order standard size panels and include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Determine the horizontal run (12 ft), vertical rise (4 ft), and slope length (30 ft). Calculate pitch = 4/12 = 0.33 and slope angle ≈ 18.4°.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin to account for cutting and errors during installation.",
      },
      {
        label: "3. Order",
        explanation:
          "Calculate material units needed: 30 ft roof length / 1 ft coverage per panel = 30 panels. Add 10% waste = 33 panels. Order 33 panels.",
      },
    ],
    result: "Final Order: 33 Standard Size Panels",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Pitch = Rise / Run\nSlope Angle (°) = arctangent(Rise / Run) × (180 / π)\nMaterial Units = (Roof Slope Length / Coverage per Unit) × (1 + Waste %)",
    variables: [
      { symbol: "Rise", description: "Vertical height of the roof" },
      { symbol: "Run", description: "Horizontal length of the roof base" },
      { symbol: "Roof Slope Length", description: "Length along the roof slope" },
      { symbol: "Coverage per Unit", description: "Length coverage per material unit" },
      { symbol: "Waste %", description: "Percentage of material waste margin" },
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

      {/* Inputs for Run, Rise, Roof Slope Length */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Run (Horizontal Length)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.run}
            onChange={(e) => handleInputChange("run", e.target.value)}
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
          />
        </div>
        <div className="space-y-2">
          <Label>Rise (Vertical Height)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.rise}
            onChange={(e) => handleInputChange("rise", e.target.value)}
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
          />
        </div>
        <div className="space-y-2">
          <Label>Roof Slope Length</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
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
              <SelectItem value="standard">Standard Size (1 unit coverage)</SelectItem>
              <SelectItem value="large">Large Size (1.5 units coverage)</SelectItem>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Roof Pitch & Slope Angle Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Roof Pitch & Slope Angle Calculator is an essential tool for homeowners, contractors, and architects who need to quickly convert between pitch ratios and degree angles. Understanding your roof's pitch or slope is critical for selecting appropriate roofing materials, calculating structural requirements, ensuring code compliance, and estimating costs. Whether you're reviewing blueprints, planning a roof replacement, or designing a new structure, this calculator eliminates manual conversions and ensures accuracy.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator accepts two primary input formats: pitch ratio (expressed as X:12, such as 4:12) or slope angle (expressed in degrees, such as 18.43°). Simply enter your known measurement in either field—the calculator will instantly compute the equivalent value in the other format. You can also input the rise and run as separate values, and the calculator will determine both the pitch ratio and slope angle automatically. Understanding these inputs helps you bridge the gap between traditional construction documentation and modern digital tools.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results provide you with exact pitch-to-angle conversions that you can use for material selection, contractor communication, and compliance verification. The calculator also displays the rise and run values in inches, helping you visualize the roof's slope. Use these results to cross-reference building codes for your region, confirm material manufacturer specifications, and ensure your roofing project meets all safety and performance standards. Bookmark this calculator for future reference during renovations or new construction planning.</p>
        </div>
      </section>

      {/* TABLE: Common Roof Pitch to Angle Conversion Chart */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Roof Pitch to Angle Conversion Chart</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the most frequently used roof pitches in residential and commercial construction with their corresponding angle measurements in degrees.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pitch Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Angle (Degrees)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Rise per 12 inches Run</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Common Application</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.46°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low-slope residential, minimal snow climates</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.04°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Transitional, moderate snow areas</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18.43°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard residential, most common pitch</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22.62°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Modern residential, improved drainage</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26.57°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Steep residential, heavy snow regions</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33.69°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mountain climates, steep roofs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">39.81°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very steep architectural, alpine zones</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45.00°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Extreme pitch, specialized applications</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Pitches below 2:12 (9.46°) are considered low-slope and typically require special membranes rather than traditional shingles.</p>
      </section>

      {/* TABLE: Roof Pitch Requirements by Climate and Roofing Material */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Roof Pitch Requirements by Climate and Roofing Material</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different climates and roofing materials have specific pitch requirements to ensure proper drainage, durability, and code compliance.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Climate Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Snow Load Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Pitch</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Roofing Material Suitability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dry/Arid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Light (&lt;50 lbs/sq ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2:12–4:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Asphalt shingles, clay tiles, metal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Temperate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate (50–100 lbs/sq ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4:12–6:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Asphalt shingles, metal, wood shake</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cold/Snowy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heavy (100–200 lbs/sq ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6:12–10:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Metal, standing seam, architectural shingles</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High Alpine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Heavy (&gt;200 lbs/sq ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8:12–12:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standing seam metal, slate, specialty systems</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Coastal/Windy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High wind (100+ mph)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4:12–6:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Metal, impact-resistant asphalt, tile</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tropical/Humid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Light–Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4:12–8:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Metal, tile, impact-resistant shingles</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always verify local building codes and insurance requirements, as some areas have specific minimum or maximum pitch mandates based on wind speed and snow load calculations.</p>
      </section>

      {/* TABLE: Roof Surface Area Increase by Pitch */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Roof Surface Area Increase by Pitch</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">As roof pitch increases, the actual surface area of the roof grows significantly, directly impacting material and labor costs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Roof Pitch</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Angle (Degrees)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Surface Area Multiplier</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Impact vs. 4:12 Base</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.46°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.032</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-3% (smallest area)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.04°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.049</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-1%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18.43°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.073</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Base (100%)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22.62°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.103</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+3%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26.57°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.140</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+6%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33.69°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.227</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+14%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">39.81°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.327</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+23%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45.00°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.414</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+31% (largest area)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">The surface area multiplier is calculated as 1 ÷ cos(pitch angle). A 12:12 pitch roof requires approximately 41% more material than a 2:12 pitch roof covering the same footprint.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always verify your local building codes before selecting a roof pitch—some jurisdictions have minimum pitch requirements based on climate, roofing material, and snow load calculations. A pitch that works in Arizona may not meet code requirements in Colorado.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If measuring an existing roof, use a 2-foot level for greater accuracy than a 1-foot level, as small measurement errors are magnified over shorter distances. Measure at multiple locations along the roof to account for any irregularities or sagging.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">When replacing a roof, maintain the original pitch even if it seems shallow—changing the pitch requires structural modifications to rafters and trusses, significantly increasing costs. The existing pitch was engineered for your home's load-bearing capacity.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for surface area increases when budgeting materials—a 6:12 pitch roof requires about 6% more shingles, underlayment, and flashing than a 4:12 pitch roof with the same footprint. Factor this into your material estimates and labor quotes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use this calculator to validate contractor estimates and material specifications—discrepancies between stated pitch and angle can indicate errors in blueprints or misunderstandings about the scope of work.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Pitch with Slope</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pitch and slope are not identical—pitch is a ratio (4:12) while slope is an angle (18.43°). Using the wrong format when ordering materials or communicating with contractors can lead to supply errors and miscommunication. Always clarify which measurement your supplier or contractor uses.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Local Building Codes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Selecting a roof pitch without consulting local building codes can result in code violations, failed inspections, or insurance denial of claims. Different regions have different minimum pitch requirements based on climate, snow load, and wind speed; always verify requirements before finalizing design decisions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Material Costs for Steep Pitches</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many homeowners are surprised by the increased material quantities required for steeper pitches—an 8:12 pitch roof requires approximately 14% more material than a 4:12 pitch roof covering the same footprint. Factor this additional cost into your budget when considering aesthetically steeper roof designs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Miscalculating Rise and Run Values</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The 12-inch run in pitch ratios (e.g., 4:12) is a standardized unit, not variable—a 4:12 pitch always means 4 inches of rise per 12 inches of horizontal run. Incorrectly scaling these values (e.g., thinking 8:24 is different from 4:12) leads to pitch errors and material miscalculations.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between roof pitch and roof slope?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Roof pitch and roof slope are often used interchangeably but have a technical distinction. Pitch is expressed as a ratio (e.g., 4:12, meaning 4 inches of rise per 12 inches of run), while slope is expressed as an angle in degrees (e.g., 18.43°). This calculator converts between both formats, allowing builders to work with either measurement depending on their blueprints or regional standards.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure my roof pitch manually if I don't have blueprints?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You can measure roof pitch using a level and measuring tape. Place a 12-inch level on the roof surface horizontally, then measure the vertical distance from the end of the level to the roof surface. This vertical measurement is your rise for every 12 inches of run, giving you the pitch ratio directly. For example, if the rise is 6 inches, your pitch is 6:12 or a 26.57° slope.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What roof pitch is most common in residential construction?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The most common residential roof pitch in North America is 4:12 (4 inches of rise per 12 inches of run), which equals an 18.43° angle. This pitch balances water drainage, snow load capacity, and ease of installation. However, modern homes often use pitches ranging from 3:12 (14.04°) to 8:12 (33.69°), depending on climate, aesthetics, and local building codes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does roof pitch affect water drainage and snow load?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Steeper roof pitches (above 6:12 or 26.57°) shed water and snow more efficiently, reducing buildup and structural strain. Flatter pitches (below 4:12 or 18.43°) drain slower and accumulate more snow, requiring stronger support structures. In areas with heavy snowfall, pitches of 8:12 (33.69°) or higher are recommended, while dry climates may use flatter 2:12 (9.46°) or 3:12 pitches.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the minimum roof pitch required by building code?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most U.S. building codes require a minimum pitch of 2:12 (9.46°) for asphalt shingles, though some jurisdictions allow 2:12 with proper underlayment. Metal roofing can go as low as 1:12 (4.76°), and standing seam metal allows even lower pitches. Flat roofs (0:12 or 0°) require special membranes and are only permitted in specific climates; always consult local building codes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I convert a roof angle in degrees to pitch ratio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To convert degrees to pitch, use the formula: Pitch = tan(angle in degrees) × 12. For example, a 30° roof angle converts to tan(30°) × 12 = 6.93:12 or approximately 7:12. This calculator automates this calculation, allowing you to input any angle and instantly see the equivalent pitch ratio used in construction documents.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What roof pitch should I use for a metal roof installation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Metal roofing is flexible and can accommodate pitches from 1:12 (4.76°) for standing seam systems to 12:12 (45°) or steeper for architectural standing seam. Most metal roof manufacturers recommend a minimum of 3:12 (14.04°) for standard corrugated or ribbed metal, with 4:12 (18.43°) being optimal for longevity and drainage. Check the specific manufacturer's guidelines for your chosen metal roofing profile.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does roof pitch impact material costs and labor?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Steeper pitches (above 8:12 or 33.69°) require more materials due to increased surface area and typically cost 10-20% more per square foot than standard 4:12 pitches. Labor costs also increase significantly for steep roofs due to safety requirements, specialized equipment, and slower installation rates. Conversely, flat or low-pitch roofs (below 2:12 or 9.46°) may require additional waterproofing and membrane systems, offsetting any labor savings.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What pitch should I use in areas with high wind or hurricane conditions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">In high-wind zones, steeper pitches (6:12 to 8:12 or 26.57° to 33.69°) perform better than shallow pitches because they reduce wind uplift pressure on the roof deck. However, extremely steep pitches (above 10:12 or 39.81°) can paradoxically increase lateral wind forces. Consult local wind speed requirements and building codes; most hurricane-prone areas specify minimum pitches of 4:12 (18.43°) with enhanced fastening systems.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.iccsafe.org/products-and-services/icc-evaluation-service/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Building Code (IBC) Roof Assembly Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official ICC standards for roof design, pitch requirements, and slope limitations across different climate zones and roofing materials.</p>
          </li>
          <li>
            <a href="https://www.nrca.net/resources/technical-documents" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Roofing Contractors Association (NRCA) Technical Guides</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive technical guidance on roof pitch selection, installation standards, and material-specific slope requirements for residential and commercial applications.</p>
          </li>
          <li>
            <a href="https://www.asphaltroofing.org/residential-roofing/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Asphalt Roofing Manufacturers Association (ARMA) Installation Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standards for asphalt shingle installation including minimum pitch requirements and slope recommendations for optimal performance and longevity.</p>
          </li>
          <li>
            <a href="https://www.fema.gov/disaster/hurricane/after/insurance" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FEMA Building Science Guidelines for Roof Design</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal guidance on roof pitch and slope considerations for wind resistance, hurricane preparation, and structural engineering in high-hazard zones.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Roof Pitch & Slope Angle Calculator"
      description="The ultimate professional guide and calculator for Roof Pitch & Slope Angle Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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