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
      {/* 4. GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Brick
          Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            A brick calculator is an essential tool for anyone involved in masonry or
            construction projects that require bricks. It helps estimate the number
            of bricks needed to build walls, fireplaces, patios, or other structures
            by calculating the volume of the area to be covered and dividing it by the
            volume of a single brick. This ensures you purchase the right amount of
            materials, saving time and money.
          </p>
          <p>
            Precision matters greatly in brick calculations. Overestimating bricks
            leads to unnecessary expenses and storage issues, while underestimating
            can cause project delays and additional orders. Including a waste margin
            accounts for breakage, cuts, and other unforeseen losses during
            construction, providing a buffer to complete your project smoothly.
          </p>
          <p>
            Bricks come in various sizes and types, commonly categorized as standard
            or large bricks. Standard bricks typically measure around 215mm × 102.5mm
            × 65mm including mortar, while large bricks are bigger. Selecting the
            correct brick size in the calculator is crucial for accurate estimates.
          </p>
          <p>
            This calculator supports both metric and imperial units, allowing you to
            input dimensions in meters or feet. It also lets you specify the waste
            percentage and price per brick to estimate total costs. By using this
            tool, you can plan your brick orders efficiently and avoid costly errors.
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
            <strong>Tip:</strong> Always measure twice and consider architectural
            features like windows or doors that reduce brick quantity.
          </li>
          <li>
            <strong>Did You Know?</strong> Mortar joints typically add about 10mm to
            brick dimensions, which is included in the brick volume for accurate
            calculations.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering 5-10% extra bricks beyond the
            waste margin can save you from last-minute shortages.
          </li>
          <li>
            <strong>Tip:</strong> Use consistent units throughout your project to
            avoid conversion errors.
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
            <strong>1. Incorrect Measurements:</strong> Using inaccurate length,
            height, or thickness values leads to wrong estimates. Always measure
            carefully and double-check.
          </p>
          <p>
            <strong>2. Ignoring Waste Margin:</strong> Not including a waste factor
            can cause shortages and project delays. Always add a reasonable waste
            percentage.
          </p>
          <p>
            <strong>3. Mixing Units:</strong> Switching between metric and imperial
            units without proper conversion causes calculation errors. Stick to one
            unit system.
          </p>
          <p>
            <strong>4. Overlooking Brick Size Variations:</strong> Different brick
            sizes affect quantity. Ensure you select the correct brick size in the
            calculator.
          </p>
          <p>
            <strong>5. Forgetting Architectural Features:</strong> Doors, windows,
            and openings reduce brick requirements. Subtract these areas from total
            wall volume.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
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
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">

          <li>
            <a href="https://www.thisoldhouse.com/search?q=Brickwork%20Calculation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Brickwork Calculation - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Brickwork Calculation from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Brickwork%20Calculation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Brickwork Calculation - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Brickwork Calculation, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.concretenetwork.com/search.html?q=Brickwork%20Calculation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Brickwork Calculation - Concrete Network
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              The leading source for concrete information, including design ideas, contractor directories, and technical guides for Brickwork Calculation.
            </p>
          </li>
          <li>
            <a href="https://www.cement.org/search-results?indexCatalogue=site-search&searchQuery=Brickwork%20Calculation&wordsMode=0" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Brickwork Calculation - Portland Cement Association
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Technical resources and industry standards for cement and concrete applications related to Brickwork Calculation.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Brick Calculator"
      description="The ultimate professional guide and calculator for Brick Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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