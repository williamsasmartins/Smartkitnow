import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Ruler, Hammer, HardHat, Box, DollarSign, Info, CheckCircle2, AlertTriangle, BookOpen } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ConcreteFootingFoundationCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial", // default to imperial for footings
    length: "",
    width: "",
    depth: "",
    rebarRows: "1",
    waste: "10",
    price: "",
    materialSize: "standard",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation assumptions:
   * - Concrete volume = Length x Width x Depth
   * - Waste factor applied as percentage increase
   * - Concrete bag volume:
   *    * Standard bag (80 lb) covers ~0.6 cu ft of concrete
   *    * Large bag (90 lb) covers ~0.7 cu ft of concrete
   * - Rebar rows do not affect concrete volume but can be shown for info
   */

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const depth = parseFloat(inputs.depth);
    const wastePercent = parseFloat(inputs.waste);
    const rebarRows = parseInt(inputs.rebarRows, 10);
    const pricePerUnit = parseFloat(inputs.price);
    const unit = inputs.unit;
    const materialSize = inputs.materialSize;

    if (
      isNaN(length) ||
      isNaN(width) ||
      isNaN(depth) ||
      length <= 0 ||
      width <= 0 ||
      depth <= 0 ||
      isNaN(wastePercent) ||
      wastePercent < 0 ||
      isNaN(rebarRows) ||
      rebarRows < 0
    ) {
      return {
        mainQty: "0 Bags",
        cost: "$0.00",
        details: "Invalid input values",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Convert all inputs to feet if metric
    // Metric inputs assumed meters, convert to feet (1 m = 3.28084 ft)
    let lengthFt = length;
    let widthFt = width;
    let depthFt = depth;
    if (unit === "metric") {
      lengthFt = length * 3.28084;
      widthFt = width * 3.28084;
      depthFt = depth * 3.28084;
    }

    // Calculate volume in cubic feet
    const volumeCuFt = lengthFt * widthFt * depthFt;

    // Add waste margin
    const volumeWithWaste = volumeCuFt * (1 + wastePercent / 100);

    // Bag volume based on material size
    // Standard bag ~0.6 cu ft, Large bag ~0.7 cu ft
    const bagVolume = materialSize === "large" ? 0.7 : 0.6;

    // Calculate bags needed, round up to whole bags
    const bagsNeeded = Math.ceil(volumeWithWaste / bagVolume);

    // Calculate cost if price per unit is provided
    const cost = !isNaN(pricePerUnit) && pricePerUnit > 0 ? `$${(bagsNeeded * pricePerUnit).toFixed(2)}` : "$0.00";

    // Details string showing raw volume and bags calculation
    const details = `Raw Volume: ${volumeCuFt.toFixed(2)} cu ft | With Waste: ${volumeWithWaste.toFixed(
      2
    )} cu ft | Bags Needed: ${bagsNeeded}`;

    return {
      mainQty: `${bagsNeeded} Bags`,
      cost,
      details,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- CONTENT GENERATION ---

  const faqs = [
    {
      question: "How do I determine the correct depth for my concrete footing?",
      answer:
        "The footing depth depends on local frost line requirements and soil conditions. Typically, footings should extend below the frost line to prevent heaving. Consult local building codes or a structural engineer to determine the minimum depth required for your area.",
    },
    {
      question: "Why do I need to include a waste factor in my calculations?",
      answer:
        "Concrete waste accounts for spillage, over-excavation, uneven subgrade, and minor miscalculations. Including a waste factor (usually 5-10%) ensures you purchase enough material to complete the job without delays.",
    },
    {
      question: "How does the number of rebar rows affect the concrete volume?",
      answer:
        "Rebar rows do not affect the volume of concrete needed but impact structural strength. The calculator includes rebar rows as an input for planning reinforcement but does not change concrete quantity estimates.",
    },
    {
      question: "Can I use this calculator for slab foundations or just footings?",
      answer:
        "This calculator is optimized for footing and foundation calculations where length, width, and depth define the concrete volume. For slab foundations, which are usually large flat areas, a slab-specific calculator might be more appropriate.",
    },
    {
      question: "What is the difference between standard and large concrete bags?",
      answer:
        "Standard concrete bags typically weigh 80 lbs and yield about 0.6 cubic feet of mixed concrete. Large bags weigh around 90 lbs and yield approximately 0.7 cubic feet. Choosing the correct bag size affects the number of bags needed and cost estimation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Example Project",
    scenario:
      "You want to build a concrete footing for a small shed measuring 10 feet long, 2 feet wide, and 1.5 feet deep with 2 rows of rebar for reinforcement. You plan to use standard 80 lb concrete bags and want to include a 10% waste margin.",
    steps: [
      {
        label: "1. Calculate Volume",
        explanation: "10 ft (length) × 2 ft (width) × 1.5 ft (depth) = 30 cubic feet of concrete needed.",
      },
      {
        label: "2. Add Waste",
        explanation: "30 cu ft + 10% waste = 30 × 1.10 = 33 cubic feet total concrete volume.",
      },
      {
        label: "3. Convert to Bags",
        explanation: "Each standard bag covers ~0.6 cu ft, so 33 ÷ 0.6 = 55 bags needed.",
      },
      {
        label: "4. Consider Rebar",
        explanation:
          "2 rows of rebar are planned for reinforcement; this does not affect concrete volume but is important for structural integrity.",
      },
    ],
    result: "Total: 55 Bags of Standard 80 lb Concrete",
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
            <SelectItem value="metric">Metric (meters)</SelectItem>
            <SelectItem value="imperial">Imperial (feet)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* INPUTS adapted to Concrete Footing & Foundation Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="e.g. 10"
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
            placeholder="e.g. 2"
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
            placeholder="e.g. 1.5"
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
          <Label>Item Size</Label>
          <Select value={inputs.materialSize} onValueChange={(v) => handleInputChange("materialSize", v)}>
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (80 lb bag)</SelectItem>
              <SelectItem value="large">Large (90 lb bag)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Bag ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            placeholder="e.g. 5.50"
          />
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
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">Professional Guide to Concrete Footing & Foundation Calculator</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Concrete footings and foundations are critical structural elements that transfer building loads safely to the ground.
            Accurate estimation of concrete volume and materials is essential to avoid costly delays or shortages on site.
          </p>
          <p>
            When calculating concrete volume, always measure length, width, and depth carefully, and convert units consistently.
            Including a waste margin of 5-10% is standard practice to account for spillage, uneven subgrade, and minor miscalculations.
          </p>
          <p>
            The number of rebar rows does not affect the volume of concrete but is vital for structural reinforcement.
            Ensure you follow engineering specifications or local building codes for rebar placement and spacing.
          </p>
          <p>
            Choosing the right bag size affects both the number of bags and cost. Standard 80 lb bags yield about 0.6 cubic feet of concrete,
            while larger 90 lb bags yield approximately 0.7 cubic feet. Factor this into your budgeting and ordering.
          </p>
        </div>
      </section>
      <section id="faq">
        <h2 className="text-2xl font-bold mb-4">FAQ</h2>
        <div className="space-y-4">
          {faqs.map(({ question, answer }, i) => (
            <div key={i} className="prose prose-slate dark:prose-invert">
              <h3 className="font-semibold">{question}</h3>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Concrete Footing & Foundation Calculator"
      description="Professional calculator for Concrete Footing & Foundation Calculator. Includes material estimation, waste factors, and cost analysis."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example} // <--- PASSING THE EXAMPLE HERE
      relatedCalculators={[]}
      onThisPage={[
        { id: "guide", label: "Guide" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}