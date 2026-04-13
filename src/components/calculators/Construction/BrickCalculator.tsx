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

export default function BrickCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "", // length of wall/area
    height: "", // height of wall
    thickness: "", // thickness of wall (usually brick width)
    waste: "10", // waste percentage
    price: "", // price per brick
    materialSize: "standard", // standard or large brick
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * 1. Convert inputs to meters if imperial
   * 2. Calculate volume of wall: Length * Height * Thickness (m³)
   * 3. Calculate volume of one brick (including mortar gap)
   * 4. Calculate bricks needed = wall volume / brick volume
   * 5. Add waste margin
   * 6. Calculate cost = bricks * price per brick
   */

  // Brick sizes in meters (including mortar gap ~10mm)
  // Standard brick: 215mm x 102.5mm x 65mm (nominal size with mortar)
  // Large brick: 230mm x 110mm x 76mm (nominal size with mortar)
  const brickSizes = {
    standard: { length: 0.215, width: 0.1025, height: 0.065 },
    large: { length: 0.230, width: 0.11, height: 0.076 },
  };

  const results = useMemo(() => {
    const {
      unit,
      length,
      height,
      thickness,
      waste,
      price,
      materialSize,
    } = inputs;

    // Validate inputs
    const l = parseFloat(length);
    const h = parseFloat(height);
    const t = parseFloat(thickness);
    const w = parseFloat(waste);
    const p = parseFloat(price);

    if (
      isNaN(l) ||
      isNaN(h) ||
      isNaN(t) ||
      isNaN(w) ||
      l <= 0 ||
      h <= 0 ||
      t <= 0 ||
      w < 0 ||
      w > 25
    ) {
      return {
        mainQty: "0 Bricks",
        cost: "$0.00",
        details: "Please enter valid positive dimensions and waste margin (0-25%).",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Convert imperial feet to meters if needed
    const lengthM = unit === "imperial" ? l * 0.3048 : l;
    const heightM = unit === "imperial" ? h * 0.3048 : h;
    const thicknessM = unit === "imperial" ? t * 0.3048 : t;

    // Wall volume in cubic meters
    const wallVolume = lengthM * heightM * thicknessM;

    // Brick volume in cubic meters
    const brick = brickSizes[materialSize] || brickSizes.standard;
    const brickVolume = brick.length * brick.width * brick.height;

    // Raw bricks needed (no waste)
    const rawBricks = wallVolume / brickVolume;

    // Add waste margin
    const totalBricks = Math.ceil(rawBricks * (1 + w / 100));

    // Cost calculation
    const totalCost = p && p > 0 ? totalBricks * p : 0;

    return {
      mainQty: `${totalBricks.toLocaleString()} Bricks`,
      cost: totalCost > 0 ? `$${totalCost.toFixed(2)}` : "Price not set",
      details: `Raw bricks needed: ${rawBricks.toFixed(0)} (before waste)`,
      wasteInfo: `+${w}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "How many bricks do I need per square meter?",
      answer:
        "The number of bricks per m² depends on the brick size and laying pattern. With standard UK bricks (215 × 102.5 × 65 mm including a 10 mm mortar joint) in stretcher bond, you need approximately 60 bricks per m² of wall face. English bond uses around 90 bricks/m² because every other course lays bricks across the full wall width. Flemish bond also uses around 80–90 bricks/m². For US modular bricks (203 × 102 × 67 mm nominal) in running bond, expect roughly 67 bricks/m².",
    },
    {
      question: "How do I subtract windows and doors from my brick count?",
      answer:
        "Measure the width and height of each opening (window or door) in meters, multiply to get the area (m²), then multiply by your bricks-per-m² figure. Subtract that number from your gross brick count. For example, a 1.2 m × 1.0 m window in stretcher bond removes 1.2 × 1.0 × 60 = 72 bricks. Do this for every opening before adding the waste margin, since waste applies only to the bricks you actually lay.",
    },
    {
      question: "What waste percentage should I use?",
      answer:
        "Use 5% for experienced professionals on straightforward rectangular walls, 10% for most DIY projects and standard residential builds, and 15% for complex shapes, diagonal cuts, herringbone patterns, or historic brick replacements where matching color lot is critical. Never use 0% — even perfect cuts produce breakage. Leftover bricks can be useful for future repairs, so erring slightly high is safer than running short mid-project.",
    },
    {
      question: "What is the standard brick size in different countries?",
      answer:
        "Brick dimensions vary by region. UK standard: 215 × 102.5 × 65 mm (work size), giving a nominal 225 × 112.5 × 75 mm with 10 mm mortar joints. US modular: 194 × 92 × 57 mm work size, nominal 203 × 102 × 67 mm. Australian standard: 230 × 110 × 76 mm. European DIN 105: 240 × 115 × 71 mm. Always confirm the exact dimensions with your supplier, as even small differences change your total by 5–15%.",
    },
    {
      question: "How do I calculate bricks for a cavity wall?",
      answer:
        "A cavity wall consists of two parallel single-leaf walls (called skins) separated by a gap of 50–100 mm. Calculate each skin independently using its face dimensions, then add them together. The outer skin is typically 102.5 mm thick (one brick laid on its side — stretcher position). The inner skin is usually blockwork rather than brick, but if both are brick, double your total. Add the cavity insulation separately — bricks do not fill the cavity.",
    },
    {
      question: "How much mortar do I need for my brick project?",
      answer:
        "As a rule of thumb, one 25 kg bag of pre-mixed mortar covers approximately 40–50 standard bricks when using a 10 mm joint. For 1,000 bricks you will need roughly 20–25 bags. A more precise method: calculate your mortar volume as approximately 20–25% of your total wall volume (the rest is solid brick). For sand and cement mixes, a 1:6 mix uses about 0.3 m³ of sand and 50 kg of cement per 1,000 bricks.",
    },
    {
      question: "What is the difference between stretcher bond, English bond, and Flemish bond?",
      answer:
        "Stretcher bond (running bond) lays bricks with only their long face (stretcher) visible — all joints are staggered by half a brick. It is the most common pattern for modern single-skin walls and uses the fewest bricks. English bond alternates full courses of stretchers with full courses of headers (bricks laid end-on), creating a very strong structural wall — used for load-bearing and retaining walls. Flemish bond alternates a stretcher and a header within every single course, giving a decorative herringbone-like appearance from the front and also excellent strength. Herringbone and basket-weave patterns are mainly used for paving and require 15–20% more bricks than stretcher bond.",
    },
    {
      question: "Can I use this calculator for garden walls, fireplaces, and retaining walls?",
      answer:
        "Yes, with adjustments. For garden walls, calculate the face area as normal and use single-skin thickness (102.5 mm) for low walls under 600 mm, and double-skin (215 mm) for taller walls for structural safety. For fireplaces, break the structure into rectangular sections (back wall, side walls, hearth) and sum them. For retaining walls, use the full volume method since the exposed face area does not equal the structural volume — these walls are often thicker at the base, so calculate each section at its average thickness.",
    },
    {
      question: "Why is it important to include a waste margin in brick calculations?",
      answer:
        "Bricks break during cutting, handling, and transport. Cuts around corners, window reveals, and door frames always produce offcuts that cannot be reused. Ordering exactly the right number means you will almost certainly run short, forcing a second order — and a second delivery means a different manufacturing batch, which can have a slightly different color. Professional bricklayers order 5% extra as standard; DIYers should order 10%. If your project uses special or reclaimed bricks, order 15% because finding matching stock later can be very difficult.",
    },
    {
      question: "What factors can cause discrepancies between calculated and actual brick quantities?",
      answer:
        "The most common causes are: (1) mortar joint thickness varying from the assumed 10 mm — thicker joints use fewer bricks, thinner joints use more; (2) irregular wall shapes with angles or curves that require more cuts; (3) brick size variation within a batch, especially with handmade or reclaimed bricks; (4) openings measured from the wrong reference point (finished opening vs. structural opening); and (5) corners — every external corner requires half-bricks to maintain the bond pattern, which increases offcut waste.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a single brick wall that is 10 feet long, 8 feet high, and one brick thick. You want to calculate how many standard bricks you need, including a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Convert dimensions to meters: Length = 10 ft × 0.3048 = 3.048 m, Height = 8 ft × 0.3048 = 2.438 m, Thickness = 1 brick ≈ 0.1025 m.",
      },
      {
        label: "2. Calculate Volume",
        explanation:
          "Wall volume = 3.048 × 2.438 × 0.1025 = 0.761 m³.",
      },
      {
        label: "3. Calculate Bricks Needed",
        explanation:
          "Standard brick volume = 0.215 × 0.1025 × 0.065 = 0.001435 m³. Bricks needed = 0.761 / 0.001435 ≈ 530 bricks.",
      },
      {
        label: "4. Add Waste",
        explanation:
          "Add 10% waste: 530 × 1.10 = 583 bricks (rounded up).",
      },
      {
        label: "5. Order",
        explanation:
          "Order approximately 583 standard bricks to complete the wall.",
      },
    ],
    result: "Final Order: 583 Standard Bricks",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Total Bricks = ⌈ (Length × Height × Thickness) / Brick Volume × (1 + Waste %) ⌉",
    variables: [
      { symbol: "Length", description: "Length of the wall (meters or feet)" },
      { symbol: "Height", description: "Height of the wall (meters or feet)" },
      { symbol: "Thickness", description: "Thickness of the wall (meters or feet)" },
      { symbol: "Brick Volume", description: "Volume of one brick including mortar (m³ or ft³)" },
      { symbol: "Waste %", description: "Waste margin as a decimal (e.g., 0.10 for 10%)" },
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
          <Label>Height</Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Thickness</Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
            value={inputs.thickness}
            onChange={(e) => handleInputChange("thickness", e.target.value)}
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Brick Size</Label>
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
          <Label>Price per Brick</Label>
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
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" /> How to Calculate How Many Bricks You Need
        </h2>
        <div className="space-y-4 leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Estimating bricks accurately is one of the most important steps before any masonry project. Order too few and you risk a mid-project delay — and a second delivery often means a different manufacturing batch with a slightly different color. Order too many and you are paying for material that sits in your yard. A good brick calculator bridges that gap by turning wall dimensions into a precise material list.
          </p>
          <p>
            The core math is straightforward: divide the volume of your wall by the volume of one brick (including its mortar joint), then add a waste margin for cuts and breakage. Where most DIYers go wrong is using the wrong brick dimensions, forgetting to subtract windows and doors, or picking an unrealistic waste percentage.
          </p>
          <p>
            This guide walks through every variable so you can use the calculator above with confidence — and understand exactly where each number comes from.
          </p>
        </div>
      </section>

      {/* BRICK SIZES TABLE */}
      <section id="brick-sizes" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Ruler className="w-6 h-6 text-blue-500" /> Standard Brick Sizes by Country
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Brick dimensions are not universal. Using the wrong size in your calculation can throw your estimate off by 10–20%. Below are the most common work-size dimensions (the actual brick, before mortar joints are added). Always confirm with your supplier, as manufacturers sometimes deviate slightly.
        </p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Country / Standard</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Length</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Width</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Height</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Bricks / m²*</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {[
                { country: "UK (BS EN 771-1)", l: "215 mm", w: "102.5 mm", h: "65 mm", bpm2: "~60" },
                { country: "US Modular", l: "194 mm", w: "92 mm", h: "57 mm", bpm2: "~67" },
                { country: "Australia (AS 4455)", l: "230 mm", w: "110 mm", h: "76 mm", bpm2: "~50" },
                { country: "Europe / DIN 105", l: "240 mm", w: "115 mm", h: "71 mm", bpm2: "~48" },
                { country: "South Africa", l: "222 mm", w: "106 mm", h: "73 mm", bpm2: "~52" },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-800/50"}>
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{row.country}</td>
                  <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{row.l}</td>
                  <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{row.w}</td>
                  <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{row.h}</td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-700 dark:text-blue-400">{row.bpm2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">* Bricks per m² calculated for stretcher bond with a 10 mm mortar joint on all faces.</p>
      </section>

      {/* WALL TYPES */}
      <section id="wall-types" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <HardHat className="w-6 h-6 text-blue-500" /> Wall Types and Thickness
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The thickness you enter into the calculator determines how many bricks go through the wall's depth. Different construction types require different thicknesses — choosing the wrong one is the single biggest cause of under-ordering.
        </p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Wall Type</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Thickness (mm)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Typical Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {[
                { type: "Single skin (half brick)", thick: "102.5 mm", use: "Garden walls under 600 mm, decorative dividers" },
                { type: "Single brick (full brick)", thick: "215 mm", use: "Most freestanding walls, internal load-bearing" },
                { type: "Cavity wall (outer skin only)", thick: "102.5 mm", use: "Outer leaf of modern insulated house walls" },
                { type: "Double brick (solid)", thick: "327.5 mm", use: "Retaining walls, heavy structural applications" },
                { type: "Piers / columns", thick: "215 × 215 mm", use: "Gate piers, pergola posts, structural supports" },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-800/50"}>
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{row.type}</td>
                  <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{row.thick}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* BOND PATTERNS */}
      <section id="bond-patterns" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Box className="w-6 h-6 text-blue-500" /> Brick Bond Patterns and How They Affect Quantity
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The pattern in which bricks are laid — called the bond — significantly affects how many bricks you need. Patterns that expose the short end of the brick (the header) require more bricks for the same face area. Here is how the most common bonds compare using UK standard bricks:
        </p>
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Bond Pattern</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Bricks / m²</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {[
                { bond: "Stretcher (Running) Bond", bpm2: "~60", use: "Modern single-skin walls — most common choice" },
                { bond: "Header Bond", bpm2: "~120", use: "Curved walls; bricks laid end-on for tight radius" },
                { bond: "English Bond", bpm2: "~90", use: "Strong structural and retaining walls" },
                { bond: "Flemish Bond", bpm2: "~80", use: "Decorative façades with classic appearance" },
                { bond: "Herringbone", bpm2: "~68–75", use: "Paving, garden paths, decorative floors" },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-800/50"}>
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{row.bond}</td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-700 dark:text-blue-400">{row.bpm2}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900 text-sm text-slate-700 dark:text-slate-300">
          <strong>Practical note:</strong> This calculator uses the volume method, which is accurate for most single-skin and double-skin walls. For herringbone or decorative paving, add 15% extra waste on top of the standard margin, as the diagonal cuts generate significantly more offcuts.
        </div>
      </section>

      {/* OPENINGS */}
      <section id="openings" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-blue-500" /> Subtracting Windows and Doors
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          The calculator works on the total gross wall dimensions — you need to manually subtract the area of any openings before entering your values, or deduct bricks after calculating.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          <strong>Method A (subtract area first):</strong> Measure the wall's total length and height. Measure each opening's width and height. Subtract the opening areas from the total wall area, then enter the net area as Length × Height with your wall thickness.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          <strong>Method B (deduct bricks after):</strong> Calculate bricks for the full gross wall. Then calculate bricks for each opening area separately (opening width × height × bricks/m²). Subtract the opening bricks from the gross total, then add your waste margin.
        </p>
        <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-900 text-sm text-slate-700 dark:text-slate-300">
          <strong>Example:</strong> A 6 m × 2.5 m wall with one 1.2 m × 1.0 m window. Gross area = 15 m². Opening area = 1.2 m². Net area = 13.8 m². At 60 bricks/m² (stretcher bond): 13.8 × 60 = 828 bricks before waste.
        </div>
      </section>

      {/* WASTE TABLE */}
      <section id="waste" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Info className="w-6 h-6 text-blue-500" /> Recommended Waste Margins
        </h2>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Project Type</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Recommended Waste</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {[
                { type: "Simple rectangular wall, professional bricklayer", waste: "5%", reason: "Minimal cuts, experienced handling" },
                { type: "Standard residential build, DIY", waste: "10%", reason: "Some cuts at corners, learning curve" },
                { type: "Complex shapes, angled walls", waste: "15%", reason: "Many diagonal cuts and offcuts" },
                { type: "Herringbone / decorative pattern", waste: "15–20%", reason: "Diagonal cuts waste up to 50% of each cut brick" },
                { type: "Reclaimed or handmade bricks", waste: "15–20%", reason: "Irregular sizes; matching replacement stock is hard" },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-800/50"}>
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{row.type}</td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-700 dark:text-blue-400">{row.waste}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* TIPS */}
      <section
        id="tips"
        className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <Lightbulb className="w-5 h-5 text-yellow-500" /> Pro Tips from Experienced Bricklayers
        </h3>
        <ul className="space-y-3 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>Buy from one batch.</strong> Order all bricks at once from the same delivery. Different batches have subtle color variation that is invisible per brick but very obvious in a finished wall.
          </li>
          <li>
            <strong>Mortar joint consistency matters.</strong> A 12 mm joint instead of 10 mm doesn't sound like much, but across 1,000 bricks it adds up to nearly 20 mm of extra height — enough to throw off window and door reveals.
          </li>
          <li>
            <strong>Store bricks on a pallet, covered.</strong> Bricks left on bare ground absorb moisture unevenly. Wet bricks create weak mortar bonds because they dilute the mix at the laying face.
          </li>
          <li>
            <strong>Always measure openings from the finished reveal, not the structural opening.</strong> The structural opening is typically 10–20 mm larger per side to allow for plaster or tile finishes.
          </li>
          <li>
            <strong>Did you know?</strong> The Great Wall of China used a mortar made from sticky rice mixed with lime — tests show it is still stronger than modern Portland cement mortars in compression.
          </li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes to Avoid
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Forgetting mortar joints in the brick size.</strong> Brick catalogues list the work size (the actual brick) not the coordinating size (brick + mortar). Always add 10 mm to each dimension when calculating volume per brick, or use the nominal size directly.
          </p>
          <p>
            <strong>2. Using the same thickness for a cavity wall's two skins.</strong> A cavity wall is two separate single-skin walls. Enter each skin separately — typically 102.5 mm each — and sum the results. Entering 205 mm as a single wall produces a very different (wrong) answer.
          </p>
          <p>
            <strong>3. Not subtracting openings.</strong> A wall with two standard windows and a door can have 3–5 m² of openings — that is up to 300 bricks you don't actually need.
          </p>
          <p>
            <strong>4. Applying waste after including openings in the gross count.</strong> Apply your waste margin only to the net brick count (after subtracting openings). Applying it to the gross count wastes money.
          </p>
          <p>
            <strong>5. Ignoring corners.</strong> Every external corner needs half-bricks to maintain the bond pattern. For a wall with four corners, add approximately 10–15 extra bricks per metre of wall height per corner.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-500" /> Frequently Asked Questions
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

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <li>
            <a href="https://www.brickdevelopment.org/technical-information/technical-data/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Brick Development Association — Technical Data
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Official UK industry body providing technical specifications for brick sizes, bond patterns, mortar mixes, and structural requirements under BS EN 771-1.
            </p>
          </li>
          <li>
            <a href="https://www.gobrick.com/think-brick/tools-resources/glossary" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Brick Industry Association (US) — Technical Notes on Brick Construction
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              The primary US industry resource for brick specifications, including modular sizes, mortar joint requirements, and bond patterns per ASTM standards.
            </p>
          </li>
          <li>
            <a href="https://www.thisoldhouse.com/masonry/21015708/how-to-lay-brick" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              This Old House — How to Lay Brick
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Step-by-step tutorial on brick laying technique from one of the most trusted names in home construction, including mortar mixing ratios and tool requirements.
            </p>
          </li>
          <li>
            <a href="https://www.homeadvisor.com/cost/masonry/brick-costs/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              HomeAdvisor — Brick and Masonry Cost Guide
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Real-world cost data for brick projects across the US, including average price per brick, labor costs per m², and total project estimates by wall type.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Brick Calculator"
      description="Calculate exactly how many bricks you need for any wall, garden, or construction project. Includes brick size tables by country, bond pattern guide, waste margin recommendations, and mortar estimation."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula} // 8. PASSING FORMULA
      example={example} // 9. PASSING EXAMPLE
      relatedCalculators={[]}
      onThisPage={[
        { id: "guide", label: "How to Calculate" },
        { id: "brick-sizes", label: "Brick Sizes by Country" },
        { id: "wall-types", label: "Wall Types & Thickness" },
        { id: "bond-patterns", label: "Bond Patterns" },
        { id: "openings", label: "Windows & Doors" },
        { id: "waste", label: "Waste Margins" },
        { id: "formula", label: "Formula" },
        { id: "example", label: "Example" },
        { id: "tips", label: "Pro Tips" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}