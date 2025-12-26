import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Ruler, Hammer, HardHat, Box, DollarSign, RotateCcw, Info, CheckCircle2, AlertTriangle, BookOpen } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ConcreteFootingFoundationCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    length: "",
    width: "",
    depth: "", // or height/thickness
    waste: "10",
    price: "",
    materialSize: "standard"
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const depth = parseFloat(inputs.depth);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);
    const unit = inputs.unit;
    const materialSize = inputs.materialSize;

    // Validation
    if (
      isNaN(length) || length <= 0 ||
      isNaN(width) || width <= 0 ||
      isNaN(depth) || depth <= 0 ||
      isNaN(wastePercent) || wastePercent < 0 ||
      isNaN(pricePerUnit) || pricePerUnit < 0
    ) {
      return {
        qty: "0",
        unitLabel: "Units",
        cost: "$0.00",
        details: "Raw: 0.00",
        wasteInfo: `Includes ${wastePercent || 10}% for cuts/spills`,
        recommendation: "Please enter valid positive numbers for all fields."
      };
    }

    // Convert all to meters if imperial
    // 1 foot = 0.3048 meters
    let lengthM = length;
    let widthM = width;
    let depthM = depth;
    if (unit === "imperial") {
      lengthM = length * 0.3048;
      widthM = width * 0.3048;
      depthM = depth * 0.3048;
    }

    // Calculate raw volume in cubic meters
    // Volume = length * width * depth
    const rawVolumeM3 = lengthM * widthM * depthM;

    // Add waste margin
    const volumeWithWasteM3 = rawVolumeM3 * (1 + wastePercent / 100);

    // Concrete density approx 2400 kg/m3 (not needed here but for info)
    // Commercial unit conversion:
    // For concrete, common packaging:
    // - Bags: 25kg or 40kg bags (standard)
    // - Cubic meters for ready-mix
    // Here, we assume "units" as bags of concrete mix.
    // Let's define standard bag volume:
    // A 25kg bag yields approx 0.0175 m3 of concrete
    // A 40kg bag yields approx 0.028 m3 of concrete
    // We'll use 25kg bag for "standard", 40kg for "large"

    const bagVolumeM3 = materialSize === "large" ? 0.028 : 0.0175;

    // Calculate number of bags needed (round up)
    const bagsNeeded = Math.ceil(volumeWithWasteM3 / bagVolumeM3);

    // Calculate total cost
    const totalCost = bagsNeeded * pricePerUnit;

    // Format outputs
    const qty = bagsNeeded.toString();
    const unitLabel = materialSize === "large" ? "40kg Bags" : "25kg Bags";
    const cost = totalCost.toLocaleString(undefined, { style: "currency", currency: "USD" });

    // Details string with raw volume and volume with waste
    const details = `Raw Volume: ${rawVolumeM3.toFixed(3)} m³ | With Waste: ${volumeWithWasteM3.toFixed(3)} m³`;

    // Waste info explanation
    const wasteInfo = `Includes ${wastePercent}% extra to cover spillage, uneven subgrade, and texture loss during pouring.`;

    // Recommendation
    const recommendation = `Purchase at least 1-2 extra bags beyond the estimate to accommodate unforeseen adjustments or errors.`;

    return {
      qty,
      unitLabel,
      cost,
      details,
      wasteInfo,
      recommendation
    };
  }, [inputs]);

  // 💡 RICH FAQ CONTENT GENERATION
  const faqs = [
    {
      question: "What is the importance of accurately calculating concrete volume for footings and foundations?",
      answer:
        "Accurately calculating concrete volume is critical to ensure the structural integrity of footings and foundations. Underestimating volume can lead to insufficient support, causing settlement or cracking, while overestimating results in wasted materials and increased costs. Industry standards require precise volume calculations to comply with building codes and to optimize resource use, ensuring safety and cost-efficiency."
    },
    {
      question: "How does the waste factor affect my concrete footing project?",
      answer:
        "The waste factor accounts for material lost due to spillage, uneven subgrades, and cutting during placement. Concrete is a fluid material that can spill or be unevenly distributed, so adding a waste margin—typically around 10%—ensures you have enough material to complete the job without delays. For complex shapes or difficult pours, increasing the waste factor to 15-20% helps accommodate additional losses and adjustments."
    },
    {
      question: "What are common mistakes when measuring for concrete footings and foundations?",
      answer:
        "A frequent mistake is measuring only the visible surface area without accounting for depth variations or subgrade irregularities. Another error is neglecting to subtract the volume occupied by embedded fixtures like pipes or conduits, which can lead to over-ordering. To avoid these issues, measure length, width, and depth carefully at multiple points, and adjust calculations for any permanent obstructions."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Ruler className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (Meters)</SelectItem>
            <SelectItem value="imperial">Imperial (Feet)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Length</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={inputs.unit === "metric" ? "e.g. 5.5 (meters)" : "e.g. 18 (feet)"}
          />
        </div>
        <div className="space-y-2">
          <Label>Width</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder={inputs.unit === "metric" ? "e.g. 0.4 (meters)" : "e.g. 1.3 (feet)"}
          />
        </div>
        <div className="space-y-2">
          <Label>Depth / Thickness</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder={inputs.unit === "metric" ? "e.g. 0.5 (meters)" : "e.g. 1.6 (feet)"}
          />
        </div>
      </div>

      {/* Material & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Item Size/Weight</Label>
          <Select value={inputs.materialSize} onValueChange={(v) => handleInputChange("materialSize", v)}>
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (25kg Bags)</SelectItem>
              <SelectItem value="large">Large/Heavy (40kg Bags)</SelectItem>
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

      {/* Waste Slider */}
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
        <p className="text-xs text-slate-500">
          <strong>Pro Tip:</strong> Use 5-10% for simple rectangular footings, and 15-20% for complex shapes or uneven terrain.
        </p>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Hammer className="mr-2 h-5 w-5" /> Calculate Materials
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 dark:border-blue-900 shadow-md animate-in fade-in slide-in-from-bottom-2">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Estimated Materials</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.qty} <span className="text-2xl text-slate-400">{results.unitLabel}</span>
            </div>
            <div className="text-xl font-medium text-slate-700 dark:text-slate-300">Total Est. Cost: {results.cost}</div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400 text-left">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" /> <span>{results.details}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> <span>{results.wasteInfo}</span>
              </div>
            </div>
            <p className="mt-4 text-sm italic text-slate-500 bg-slate-100 dark:bg-slate-800 p-2 rounded">
              "{results.recommendation}"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* 1. COMPREHENSIVE GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Concrete Footing & Foundation Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Concrete footings and foundations form the essential base of any structure, transferring loads safely to the ground and preventing settlement or movement. Calculating the precise volume of concrete required for these elements is critical to ensure structural integrity, avoid costly delays, and minimize waste. This calculator helps contractors and DIYers estimate the amount of concrete needed based on the dimensions of the footing or foundation, factoring in waste and pricing for accurate budgeting.
          </p>
          <p>
            The materials involved primarily include concrete mix, which is typically sold in bags of fixed weights such as 25kg or 40kg. Concrete density and yield vary depending on the mix design and bag size, affecting the volume each bag produces. Understanding these properties allows for converting raw volume calculations into the number of bags or commercial units required, ensuring you order the correct quantity for your project.
          </p>
        </div>
      </section>

      {/* 2. STEP-BY-STEP MEASUREMENT */}
      <section id="how-to-measure" className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <Ruler className="w-5 h-5 text-indigo-500" /> How to Measure Correctly
        </h3>
        <ul className="space-y-3 text-slate-600 dark:text-slate-300">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">1</span>
            <span>
              <strong>Length & Width:</strong> Measure the longest points of the footing or foundation area. If the shape is irregular, divide it into smaller rectangles or triangles, measure each separately, and sum the areas for accuracy.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">2</span>
            <span>
              <strong>Depth/Thickness:</strong> This dimension is crucial for calculating volume. Use a tape measure or laser level to check depth at multiple points to ensure consistency. Variations in depth can significantly affect the total volume and material requirements.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">3</span>
            <span>
              <strong>Subtract Obstacles:</strong> Account for permanent fixtures such as plumbing pipes, electrical conduits, or embedded steel that occupy volume within the footing. Subtracting these volumes prevents over-ordering and reduces waste.
            </span>
          </li>
        </ul>
      </section>

      {/* 3. COMMON MISTAKES (HIGH VALUE) */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes to Avoid
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Underestimating Waste:</strong> Many beginners order exactly the calculated amount of concrete without adding a waste margin. This oversight can cause project delays when additional material is needed due to spillage, uneven subgrades, or texture loss. Always add at least 10% waste to your calculations to ensure a smooth pour.
          </p>
          <p>
            <strong>2. Ignoring Soil Compaction and Preparation:</strong> Proper soil compaction and preparation beneath footings are essential to prevent settling and cracking. Failing to compact soil or not accounting for subgrade variations can lead to uneven footing thickness, affecting volume calculations and structural performance. Always inspect and prepare the site thoroughly before pouring concrete.
          </p>
        </div>
      </section>

      {/* 4. DETAILED FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Concrete Footing & Foundation Calculator"
      description="The ultimate guide and calculator for Concrete Footing & Foundation Calculator. Learn how to estimate materials, calculate costs, and avoid common mistakes in your project."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      relatedCalculators={[
        { title: "Concrete Calculator", url: "/construction/concrete-slab-volume", icon: "🏗️" },
        { title: "Flooring Calculator", url: "/construction/hardwood-plank-quantity", icon: "🪵" },
        { title: "Paint Calculator", url: "/construction/paint-coverage-gallons", icon: "🎨" }
      ]}
      onThisPage={[
        { id: "guide", label: "Complete Guide" },
        { id: "how-to-measure", label: "How to Measure" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "faq", label: "FAQ" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}