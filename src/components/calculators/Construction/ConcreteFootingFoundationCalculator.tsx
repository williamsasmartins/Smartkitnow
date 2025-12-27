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

export default function ConcreteFootingFoundationCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    width: "",
    depth: "",
    rebarRows: "0",
    waste: "10",
    price: "",
    materialSize: "standard", // standard or large bag size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Constants for bag yields (volume per bag in cubic meters or cubic feet)
  // Standard bag: 40 kg ~ 0.022 m3 (approx 0.78 ft3)
  // Large bag: 50 kg ~ 0.027 m3 (approx 0.95 ft3)
  const bagYieldMetric = {
    standard: 0.022,
    large: 0.027,
  };
  const bagYieldImperial = {
    standard: 0.78,
    large: 0.95,
  };

  const results = useMemo(() => {
    // Parse inputs
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const depth = parseFloat(inputs.depth);
    const rebarRows = parseInt(inputs.rebarRows);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerBag = parseFloat(inputs.price);
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
        mainQty: "0 Bags",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Calculate volume (m3 or ft3)
    let volume = length * width * depth;

    // Add volume for rebar rows (assuming each rebar row adds 0.01 m3 or 0.35 ft3)
    // This is an approximation to account for extra concrete around rebar
    const rebarVolumeAddMetric = 0.01; // m3 per row
    const rebarVolumeAddImperial = 0.35; // ft3 per row
    if (rebarRows > 0) {
      volume +=
        unit === "metric"
          ? rebarRows * rebarVolumeAddMetric
          : rebarRows * rebarVolumeAddImperial;
    }

    // Add waste margin
    const volumeWithWaste = volume * (1 + wastePercent / 100);

    // Calculate bags needed
    const bagYield =
      unit === "metric"
        ? bagYieldMetric[materialSize]
        : bagYieldImperial[materialSize];
    const bagsNeeded = Math.ceil(volumeWithWaste / bagYield);

    // Calculate cost if price given
    const cost =
      !isNaN(pricePerBag) && pricePerBag > 0
        ? `$${(bagsNeeded * pricePerBag).toFixed(2)}`
        : "$0.00";

    // Details string
    const details = `Raw volume: ${volume.toFixed(
      3
    )} ${unit === "metric" ? "m³" : "ft³"} + Waste: ${wastePercent}%`;

    return {
      mainQty: `${bagsNeeded} Bags`,
      cost,
      details,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [
    inputs.length,
    inputs.width,
    inputs.depth,
    inputs.rebarRows,
    inputs.waste,
    inputs.price,
    inputs.unit,
    inputs.materialSize,
  ]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question:
        "How do I accurately measure the dimensions for my concrete footing?",
      answer:
        "To get precise measurements, use a tape measure or laser distance measurer to record the length, width, and depth of the footing area. Always measure multiple points to account for any irregularities and use the smallest consistent depth to avoid underestimating material needs. Accurate measurements ensure you order the right amount of concrete and avoid costly shortages or excess.",
    },
    {
      question:
        "Why is it important to include a waste margin in concrete calculations?",
      answer:
        "Including a waste margin accounts for spillage, uneven surfaces, and slight miscalculations in volume. Concrete mixing and pouring can lead to some material loss, so adding typically 10% waste ensures you have enough material to complete the job without delays. Skipping this step might result in running out of concrete mid-pour, causing structural weaknesses or additional costs.",
    },
    {
      question:
        "What types of concrete bags are available and how do they affect calculations?",
      answer:
        "Concrete bags come in various sizes, commonly 40 kg (standard) and 50 kg (large). The volume yield per bag differs slightly, so selecting the correct bag size in the calculator is essential for accurate estimation. Larger bags reduce the number of bags needed but may be heavier and harder to handle. Knowing the bag size helps in ordering and logistics planning.",
    },
    {
      question:
        "How does the number of rebar rows influence the amount of concrete needed?",
      answer:
        "Rebar rows require additional concrete volume to properly encase the steel reinforcement. Each row adds a small but significant volume to the footing, which the calculator accounts for by adding an estimated volume per rebar row. This ensures the footing has adequate coverage and strength. Ignoring rebar volume can lead to underestimating concrete needs and compromise structural integrity.",
    },
    {
      question:
        "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, the calculator supports both metric (meters) and imperial (feet) units. Simply select your preferred unit system at the top. The calculations, bag yields, and outputs will adjust accordingly to provide accurate results based on your input units.",
    },
    {
      question:
        "How do I convert the calculated concrete volume into the number of bags required?",
      answer:
        "After calculating the total volume including waste, divide this volume by the volume yield of a single concrete bag (which depends on bag size and unit system). The result is rounded up to the nearest whole number since you can't purchase partial bags. This gives you the total number of bags to order for your project.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a concrete footing for a small shed foundation. You measure the footing to be 3 meters long, 0.5 meters wide, and 0.4 meters deep. You plan to use standard 40 kg concrete bags and want to include 2 rows of rebar for reinforcement. You also want to add a 10% waste margin to be safe.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate volume: 3 m × 0.5 m × 0.4 m = 0.6 m³ of concrete needed.",
      },
      {
        label: "2. Add Rebar Volume",
        explanation:
          "Add volume for 2 rebar rows: 2 × 0.01 m³ = 0.02 m³. Total volume = 0.62 m³.",
      },
      {
        label: "3. Add Waste Margin",
        explanation:
          "Add 10% waste: 0.62 m³ × 1.10 = 0.682 m³ total concrete volume.",
      },
      {
        label: "4. Calculate Bags",
        explanation:
          "Each standard bag yields 0.022 m³. Bags needed = 0.682 ÷ 0.022 ≈ 31 bags.",
      },
    ],
    result: "Final Order: 31 Bags of standard 40 kg concrete mix.",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Volume = Length × Width × Depth + (Rebar Rows × Rebar Volume) + Waste Margin",
    variables: [
      { symbol: "L", description: "Length of the footing area" },
      { symbol: "W", description: "Width of the footing area" },
      { symbol: "D", description: "Depth or thickness of the footing" },
      {
        symbol: "R",
        description:
          "Number of rebar rows (each adds approx. 0.01 m³ or 0.35 ft³ of concrete)",
      },
      {
        symbol: "Waste",
        description:
          "Waste margin percentage added to total volume to account for spillage and errors",
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

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="e.g. 3.0"
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
            placeholder="e.g. 0.5"
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
            placeholder="e.g. 0.4"
          />
        </div>
        <div className="space-y-2">
          <Label>Rebar Rows</Label>
          <Input
            type="number"
            min="0"
            step="1"
            value={inputs.rebarRows}
            onChange={(e) => handleInputChange("rebarRows", e.target.value)}
            placeholder="e.g. 2"
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Bag Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard 40 kg</SelectItem>
              <SelectItem value="large">Large 50 kg</SelectItem>
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
      {/* 4. GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Professional Guide: Concrete Footing & Foundation Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Concrete footings and foundations are critical components in any
            construction project, providing the essential support that transfers
            building loads safely to the ground. This calculator helps you
            accurately estimate the amount of concrete bags needed based on the
            dimensions of your footing and foundation. By inputting length,
            width, depth, and the number of rebar rows, you can quickly get a
            reliable material estimate.
          </p>
          <p>
            Precision in these calculations is vital. Underestimating concrete
            volume can cause costly delays and structural risks, while
            overestimating leads to wasted materials and increased expenses.
            Including a waste margin accounts for spillage, uneven surfaces, and
            measurement errors, ensuring you have enough concrete to complete
            your project without interruption.
          </p>
          <p>
            Concrete bags come in different sizes, typically standard 40 kg and
            large 50 kg bags, each yielding a specific volume of mixed concrete.
            This calculator adjusts the bag count based on your selected bag size
            and unit system (metric or imperial). Additionally, the number of
            rebar rows influences the volume by requiring extra concrete to
            encase the reinforcement properly.
          </p>
          <p>
            Use this tool to streamline your ordering process, reduce waste, and
            ensure your footing and foundation are built on a solid, well-planned
            base.
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
            <strong>Tip:</strong> Always measure twice and consider the smallest
            depth to avoid underestimating concrete volume.
          </li>
          <li>
            <strong>Did You Know?</strong> Adding rebar rows not only strengthens
            your footing but also slightly increases the concrete volume needed,
            which many contractors overlook.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering a few extra bags beyond
            the calculated amount can save time and money by preventing job site
            delays.
          </li>
          <li>
            <strong>Tip:</strong> When working in imperial units, convert all
            measurements carefully to avoid errors in volume calculation.
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
            <strong>1. Ignoring Waste Margin:</strong> Not including a waste
            percentage can lead to running out of concrete mid-pour, causing
            structural issues and costly delays.
          </p>
          <p>
            <strong>2. Incorrect Unit Conversion:</strong> Mixing metric and
            imperial units without proper conversion results in inaccurate volume
            calculations and material estimates.
          </p>
          <p>
            <strong>3. Forgetting Rebar Volume:</strong> Overlooking the extra
            concrete needed for rebar rows can cause underestimation and weak
            footing coverage.
          </p>
          <p>
            <strong>4. Using Average Dimensions:</strong> Using average instead
            of minimum depth measurements can underestimate concrete volume,
            risking structural integrity.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="scroll-mt-24">
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
            <a href="https://www.thisoldhouse.com/search?q=Concrete%20Footings" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Footings - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Concrete Footings from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Concrete%20Footings" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Footings - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Concrete Footings, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.concretenetwork.com/search.html?q=Concrete%20Footings" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Footings - Concrete Network
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              The leading source for concrete information, including design ideas, contractor directories, and technical guides for Concrete Footings.
            </p>
          </li>
          <li>
            <a href="https://www.cement.org/search-results?indexCatalogue=site-search&searchQuery=Concrete%20Footings&wordsMode=0" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Footings - Portland Cement Association
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Technical resources and industry standards for cement and concrete applications related to Concrete Footings.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Concrete Footing & Foundation Calculator"
      description="The ultimate professional guide and calculator for Concrete Footing & Foundation Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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