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

export default function TileAreaGroutCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters, cm) or imperial (feet, inches)
    length: "",
    width: "",
    groutWidth: "", // grout joint width (mm or inches)
    groutDepth: "", // grout joint depth (mm or inches)
    waste: "10", // waste margin %
    price: "",
    materialSize: "standard", // standard or large tile size for grout yield
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * 1. Calculate tile area = length * width (converted to consistent units)
   * 2. Calculate grout volume = groutWidth * groutDepth * total grout length
   *    Total grout length = number of grout joints * grout length per joint
   *    Approximate grout length = (length / tile size + 1) * width + (width / tile size + 1) * length
   *    But since tile size varies, we simplify by calculating grout volume per m² or ft² based on grout joint size.
   *
   * For simplicity, this calculator estimates grout volume based on area and grout joint dimensions.
   * Then converts volume to bags/units based on grout yield per unit.
   */

  // Tile sizes in meters or feet for grout joint count estimation
  const tileSizes = {
    standard: { metric: 0.3, imperial: 1 }, // 30cm or 12 inches (1 ft)
    large: { metric: 0.6, imperial: 2 }, // 60cm or 24 inches (2 ft)
  };

  // Grout yield per bag/unit in liters (typical grout bag yields ~5 liters)
  const groutYieldPerUnitLiters = 5;

  // Unit conversion helpers
  const toMeters = (val: number, unit: string) => {
    if (unit === "metric") return val; // assume meters input
    // imperial input assumed feet, convert feet to meters
    return val * 0.3048;
  };
  const toMillimeters = (val: number, unit: string) => {
    if (unit === "metric") return val * 1000; // meters to mm
    // imperial input assumed inches, convert inches to mm
    return val * 25.4;
  };
  const toLiters = (cubicMeters: number) => cubicMeters * 1000;

  const results = useMemo(() => {
    const {
      unit,
      length,
      width,
      groutWidth,
      groutDepth,
      waste,
      price,
      materialSize,
    } = inputs;

    // Validate inputs
    if (
      !length ||
      !width ||
      !groutWidth ||
      !groutDepth ||
      Number(length) <= 0 ||
      Number(width) <= 0 ||
      Number(groutWidth) <= 0 ||
      Number(groutDepth) <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${waste}% Waste included`,
      };
    }

    // Convert length and width to meters
    const lengthM = unit === "metric" ? Number(length) : Number(length) * 0.3048; // ft to m
    const widthM = unit === "metric" ? Number(width) : Number(width) * 0.3048; // ft to m

    // Calculate area in m²
    const areaM2 = lengthM * widthM;

    // Convert grout width and depth to meters
    // Inputs are mm (metric) or inches (imperial)
    const groutWidthM =
      unit === "metric" ? Number(groutWidth) / 1000 : Number(groutWidth) * 0.0254;
    const groutDepthM =
      unit === "metric" ? Number(groutDepth) / 1000 : Number(groutDepth) * 0.0254;

    // Estimate number of grout joints along length and width
    const tileSizeM = tileSizes[materialSize][unit];
    const jointsAlongLength = Math.floor(lengthM / tileSizeM) + 1;
    const jointsAlongWidth = Math.floor(widthM / tileSizeM) + 1;

    // Total grout length = vertical + horizontal joints (in meters)
    const totalGroutLengthM =
      jointsAlongLength * widthM + jointsAlongWidth * lengthM;

    // Grout volume = groutWidth * groutDepth * totalGroutLength (cubic meters)
    const groutVolumeM3 = groutWidthM * groutDepthM * totalGroutLengthM;

    // Add waste margin
    const wasteFactor = 1 + Number(waste) / 100;
    const groutVolumeWithWasteM3 = groutVolumeM3 * wasteFactor;

    // Convert volume to liters
    const groutVolumeLiters = toLiters(groutVolumeWithWasteM3);

    // Calculate units needed (bags)
    const unitsNeeded = Math.ceil(groutVolumeLiters / groutYieldPerUnitLiters);

    // Calculate cost if price given
    const cost =
      price && Number(price) > 0
        ? `$${(unitsNeeded * Number(price)).toFixed(2)}`
        : "$0.00";

    return {
      mainQty: `${unitsNeeded} Bag${unitsNeeded > 1 ? "s" : ""}`,
      cost,
      details: `Grout Volume (incl. waste): ${groutVolumeLiters.toFixed(
        2
      )} liters`,
      wasteInfo: `+${waste}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is the Tile Area & Grout Calculator used for?",
      answer:
        "The Tile Area & Grout Calculator helps professionals and DIYers estimate the amount of grout material needed to fill the joints between tiles for a given tiled surface. By inputting the dimensions of the tiled area and grout joint sizes, users can accurately calculate grout volume, account for waste, and estimate costs, ensuring efficient material ordering and reducing project delays.",
    },
    {
      question:
        "Why is it important to include a waste margin when calculating grout quantities?",
      answer:
        "Including a waste margin accounts for material lost due to spillage, mixing errors, surface absorption, and cutting irregularities. Typically, a 10% waste factor is recommended to ensure you have enough grout to complete the job without running short. Skipping this step can lead to ordering insufficient grout, causing delays and additional costs.",
    },
    {
      question:
        "How do tile size and grout joint dimensions affect grout quantity calculations?",
      answer:
        "Tile size determines the number of grout joints per unit area, while grout joint width and depth define the volume of grout needed per joint. Larger tiles mean fewer joints and less grout, whereas wider or deeper grout joints increase the grout volume required. Accurate input of these parameters is essential for precise grout quantity estimation.",
    },
    {
      question:
        "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, the calculator supports both metric (meters, millimeters) and imperial (feet, inches) units. It automatically converts inputs to consistent units internally to provide accurate results regardless of the measurement system you use.",
    },
    {
      question:
        "How do I estimate the cost of grout using this calculator?",
      answer:
        "After calculating the number of grout bags needed, enter the price per bag in the calculator. It will multiply the quantity by the unit price to provide an estimated total cost. This helps with budgeting and procurement planning.",
    },
    {
      question:
        "What types of grout materials can this calculator help estimate?",
      answer:
        "This calculator is generic and can be used for cementitious grout, epoxy grout, or other grout types. However, grout yield per bag may vary by product, so adjust the price and yield parameters accordingly for the most accurate estimates.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are tiling a bathroom floor measuring 3 meters by 2 meters using standard 30cm tiles with grout joints 5mm wide and 8mm deep. You want to add a 10% waste margin and grout costs $15 per bag.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate area: 3m × 2m = 6m². Tile size: 0.3m (standard). Grout joint width: 5mm (0.005m), depth: 8mm (0.008m).",
      },
      {
        label: "2. Calculate Grout Volume",
        explanation:
          "Number of joints along length: floor(3/0.3)+1 = 11. Along width: floor(2/0.3)+1 = 8. Total grout length = (11 × 2) + (8 × 3) = 22 + 24 = 46m. Grout volume = 0.005 × 0.008 × 46 = 0.00184 m³ = 1.84 liters.",
      },
      {
        label: "3. Add Waste",
        explanation:
          "Add 10% waste: 1.84 × 1.1 = 2.02 liters total grout volume needed.",
      },
      {
        label: "4. Order",
        explanation:
          "Each grout bag yields 5 liters. Bags needed = ceil(2.02 / 5) = 1 bag. Estimated cost = 1 × $15 = $15.",
      },
    ],
    result: "Final Order: 1 Bag, Estimated Cost: $15",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Grout Volume = Grout Width × Grout Depth × Total Grout Length\n" +
      "Total Grout Length = (Number of Joints Along Length × Width) + (Number of Joints Along Width × Length)\n" +
      "Number of Joints Along Length = floor(Length / Tile Size) + 1\n" +
      "Number of Joints Along Width = floor(Width / Tile Size) + 1\n" +
      "Units Needed = ceil((Grout Volume × (1 + Waste %)) / Grout Yield per Unit)",
    variables: [
      { symbol: "Length", description: "Length of tiled area" },
      { symbol: "Width", description: "Width of tiled area" },
      { symbol: "Tile Size", description: "Size of one tile (length or width)" },
      { symbol: "Grout Width", description: "Width of grout joint" },
      { symbol: "Grout Depth", description: "Depth of grout joint" },
      { symbol: "Waste %", description: "Waste margin percentage" },
      { symbol: "Grout Yield per Unit", description: "Volume of grout per bag/unit" },
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
            <SelectItem value="metric">Metric (m, mm)</SelectItem>
            <SelectItem value="imperial">Imperial (ft, in)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DYNAMIC INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="e.g. 3"
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
            placeholder="e.g. 2"
          />
        </div>
        <div className="space-y-2">
          <Label>
            Grout Joint Width ({inputs.unit === "metric" ? "mm" : "inches"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.groutWidth}
            onChange={(e) => handleInputChange("groutWidth", e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
        <div className="space-y-2">
          <Label>
            Grout Joint Depth ({inputs.unit === "metric" ? "mm" : "inches"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.groutDepth}
            onChange={(e) => handleInputChange("groutDepth", e.target.value)}
            placeholder="e.g. 8"
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tile Size</Label>
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
      {/* 4. GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Tile
          Area & Grout Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The Tile Area & Grout Calculator is an essential tool for anyone
            involved in tiling projects, whether you're a professional
            contractor or a DIY enthusiast. It helps you accurately estimate the
            amount of grout material required to fill the joints between tiles
            over a given area. By inputting the dimensions of your tiled surface
            and the size of the grout joints, you can avoid costly overordering
            or frustrating shortages.
          </p>
          <p>
            Precision in grout estimation matters because grout is not only a
            finishing material but also critical for the durability and
            waterproofing of tiled surfaces. Using too little grout can lead to
            weak joints and water damage, while ordering too much results in
            wasted materials and increased costs.
          </p>
          <p>
            This calculator supports both metric and imperial units, allowing
            you to work in meters and millimeters or feet and inches,
            depending on your preference or project requirements. It also
            factors in a waste margin to cover spillage, mixing losses, and
            cutting waste.
          </p>
          <p>
            Different tile sizes affect grout quantity because larger tiles have
            fewer grout joints per area, reducing grout volume. The calculator
            lets you select between standard and large tile sizes to adjust the
            grout joint count accordingly.
          </p>
          <p>
            Whether you are working with cementitious grout, epoxy grout, or
            other types, this calculator provides a reliable estimate of the
            grout volume and number of bags needed, helping you plan your
            material purchases efficiently.
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
            <strong>Tip:</strong> Always measure your tiled area twice to ensure
            accuracy before ordering grout. Small errors in length or width can
            significantly affect material estimates.
          </li>
          <li>
            <strong>Did You Know?</strong> The typical grout bag yields about 5
            liters of grout volume, but this can vary by product. Check your
            grout packaging for exact yield information.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Adding a 10% waste margin is a
            standard practice to avoid running out of grout mid-project, but
            experienced installers sometimes increase this margin for complex
            layouts or textured tiles.
          </li>
          <li>
            <strong>Tip:</strong> When working with large format tiles, grout
            joints are often wider and deeper, so adjust your grout joint
            dimensions accordingly for accurate calculations.
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
            <strong>1. Underestimating grout joint dimensions:</strong> Many
            users forget to measure the actual width and depth of grout joints,
            leading to underordering grout. Always measure grout joints on
            sample tiles or consult manufacturer specs.
          </p>
          <p>
            <strong>2. Ignoring waste margin:</strong> Skipping the waste factor
            can cause you to run out of grout mid-job, causing delays and
            additional costs.
          </p>
          <p>
            <strong>3. Mixing unit systems:</strong> Inputting length in feet but
            grout joint in millimeters without switching units will produce
            incorrect results. Always select the correct unit system.
          </p>
          <p>
            <strong>4. Not rounding up material units:</strong> Grout is sold in
            whole bags, so always round up your calculated quantity to the next
            whole number.
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
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">

          <li>
            <a href="https://www.thisoldhouse.com/search?q=Tile%20Installation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Tile Installation - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Tile Installation from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Tile%20Installation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Tile Installation - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Tile Installation, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.finehomebuilding.com/?s=Tile%20Installation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Tile Installation - Fine Homebuilding
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Expert articles and detailed construction techniques for Tile Installation from professional builders and craftsmen.
            </p>
          </li>
          <li>
            <a href="https://www.constructconnect.com/blog/search?term=Tile%20Installation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Tile Installation - ConstructConnect
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Construction industry insights, cost data, and project management tips relevant to Tile Installation.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Tile Area & Grout Calculator"
      description="The ultimate professional guide and calculator for Tile Area & Grout Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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