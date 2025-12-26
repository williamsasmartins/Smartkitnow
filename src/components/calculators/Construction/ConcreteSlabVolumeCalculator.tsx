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

export default function ConcreteSlabVolumeCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    length: "",
    width: "",
    depth: "", // thickness of slab
    waste: "10",
    price: "",
    materialSize: "standard" // standard bag size or volume unit
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * 1. Validate inputs (positive numbers)
   * 2. Calculate raw volume = length * width * depth
   * 3. Add waste percentage
   * 4. Convert volume to commercial units (e.g. bags of concrete mix)
   * 5. Calculate cost = qty * price per unit
   * 
   * Assumptions:
   * - Metric units: meters (m), volume in cubic meters (m³)
   * - Imperial units: feet (ft), volume in cubic feet (ft³)
   * - Standard concrete bag volume:
   *    - Metric: 25 kg bag yields approx 0.015 m³ concrete
   *    - Imperial: 80 lb bag yields approx 0.53 ft³ concrete
   * - Large/Heavy bags yield more volume (e.g. 40 kg or 90 lb bags)
   */

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const depth = parseFloat(inputs.depth);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);

    // Validate inputs
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
        details: "Please enter valid positive numbers for all fields.",
        wasteInfo: "",
        recommendation: "Ensure all inputs are positive numbers to get accurate results."
      };
    }

    // Calculate raw volume
    // Units: m³ or ft³ depending on input unit
    const rawVolume = length * width * depth;

    // Add waste margin
    const totalVolume = rawVolume * (1 + wastePercent / 100);

    // Determine volume per bag/unit based on materialSize and unit system
    // Standard bag volumes:
    // Metric standard: 25 kg bag ~ 0.015 m³
    // Metric large: 40 kg bag ~ 0.024 m³
    // Imperial standard: 80 lb bag ~ 0.53 ft³
    // Imperial large: 90 lb bag ~ 0.60 ft³

    let volumePerUnit = 0;
    let unitLabel = "bags";

    if (inputs.unit === "metric") {
      if (inputs.materialSize === "standard") {
        volumePerUnit = 0.015; // cubic meters per bag
      } else {
        volumePerUnit = 0.024; // large bag volume in m³
      }
      unitLabel = "bags";
    } else {
      if (inputs.materialSize === "standard") {
        volumePerUnit = 0.53; // cubic feet per bag
      } else {
        volumePerUnit = 0.60; // large bag volume in ft³
      }
      unitLabel = "bags";
    }

    // Calculate quantity of bags needed (round up)
    const qty = Math.ceil(totalVolume / volumePerUnit);

    // Calculate cost
    const cost = qty * pricePerUnit;

    // Format cost string with currency symbol based on locale (default $)
    const costFormatted = pricePerUnit > 0 ? `$${cost.toFixed(2)}` : "N/A";

    // Details string showing raw volume and total volume with waste
    const volumeUnit = inputs.unit === "metric" ? "m³" : "ft³";
    const details = `Raw volume: ${rawVolume.toFixed(3)} ${volumeUnit}, with waste: ${totalVolume.toFixed(3)} ${volumeUnit}`;

    // Waste info explanation
    const wasteInfo = `Includes ${wastePercent}% extra to account for spillage, uneven subgrade, and texture loss.`;

    // Recommendation for purchasing extra units beyond calculation
    const recommendation = `Purchase 1-2 extra bags beyond the estimate to cover unexpected needs or errors during pouring.`;

    return {
      qty: qty.toString(),
      unitLabel,
      cost: costFormatted,
      details,
      wasteInfo,
      recommendation
    };
  }, [inputs]);

  // 💡 RICH FAQ CONTENT GENERATION
  const faqs = [
    {
      question: "How do I accurately calculate the volume of a concrete slab?",
      answer:
        "Accurate volume calculation requires measuring the slab's length, width, and depth precisely. The volume is the product of these three dimensions, representing the total cubic space the concrete will fill. Industry standards emphasize measuring multiple points for depth to ensure uniformity and avoid underestimating material needs."
    },
    {
      question: "How does the waste factor affect my project?",
      answer:
        "The waste factor compensates for material lost due to spillage, uneven surfaces, and minor errors during mixing or pouring. In concrete projects, professionals typically add 10% waste for straightforward slabs, increasing to 15-20% for complex shapes or difficult access. This practice prevents costly delays caused by running out of material mid-pour."
    },
    {
      question: "What are common mistakes when measuring for concrete slabs?",
      answer:
        "A frequent mistake is measuring only wall-to-wall dimensions without accounting for subgrade irregularities or embedded fixtures. Additionally, failing to measure slab thickness consistently can lead to significant volume miscalculations. To avoid this, measure multiple points and subtract volumes for permanent obstacles like pipes or footings."
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
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={inputs.unit === "metric" ? "e.g. 5.5" : "e.g. 18"}
          />
        </div>
        <div className="space-y-2">
          <Label>Width ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder={inputs.unit === "metric" ? "e.g. 4.0" : "e.g. 12"}
          />
        </div>
        <div className="space-y-2">
          <Label>Depth / Thickness ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="0.001"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder={inputs.unit === "metric" ? "e.g. 0.15" : "e.g. 0.5"}
          />
        </div>
      </div>

      {/* Material & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Bag Size / Weight</Label>
          <Select value={inputs.materialSize} onValueChange={(v) => handleInputChange("materialSize", v)}>
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">
                Standard ({inputs.unit === "metric" ? "25 kg" : "80 lb"})
              </SelectItem>
              <SelectItem value="large">
                Large/Heavy ({inputs.unit === "metric" ? "40 kg" : "90 lb"})
              </SelectItem>
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
          <strong>Pro Tip:</strong> Use 5-10% for simple square slabs, and 15-20% for slabs with complex shapes or uneven subgrades.
        </p>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Hammer className="mr-2 h-5 w-5" /> Calculate Materials
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 dark:border-blue-900 shadow-md animate-in fade-in slide-in-from-bottom-2">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Estimated Materials
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.qty} <span className="text-2xl text-slate-400">{results.unitLabel}</span>
            </div>
            <div className="text-xl font-medium text-slate-700 dark:text-slate-300">
              Total Est. Cost: {results.cost}
            </div>

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
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Concrete Slab Volume Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Calculating the volume of a concrete slab is a fundamental step in any construction or renovation project involving concrete. This calculation determines the exact amount of concrete needed to create a slab with the desired dimensions, ensuring structural integrity and cost efficiency. Overestimating leads to wasted materials and increased expenses, while underestimating can cause project delays and compromise the slab’s strength.
          </p>
          <p>
            Concrete is a composite material composed primarily of cement, aggregates (sand and gravel), and water. Its density and curing properties directly affect the volume and weight of the material required. Understanding the slab’s thickness or depth is critical because even small variations can significantly impact the total volume. Additionally, factors such as reinforcement and subgrade preparation influence the final material needs and project success.
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
              <strong>Length & Width:</strong> Measure the longest points of the slab area using a tape measure or laser distance meter. For irregular shapes, divide the area into smaller rectangles or triangles, measure each separately, and sum their areas for accuracy.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">2</span>
            <span>
              <strong>Depth/Thickness:</strong> Measure the slab thickness at multiple points to account for any variations. Consistent thickness is essential for structural performance, so use a level or straightedge to verify uniformity before ordering materials.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">3</span>
            <span>
              <strong>Subtract Obstacles:</strong> Identify and subtract volumes occupied by permanent fixtures such as plumbing pipes, electrical conduits, or embedded footings. This prevents over-ordering concrete and reduces waste.
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
            <strong>1. Underestimating Waste:</strong> Many DIYers and even some contractors order exactly the calculated volume without adding a waste margin. This oversight can lead to running out of concrete mid-pour, causing cold joints and structural weaknesses. Always include at least 10% extra for spillage, uneven subgrade, and minor measurement errors.
          </p>
          <p>
            <strong>2. Ignoring Soil Compaction (for concrete):</strong> Proper soil compaction beneath the slab is critical to prevent settling and cracking. Failing to compact the subgrade can cause uneven slab thickness and volume discrepancies, leading to inaccurate material estimates and potential structural failure.
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
      title="Concrete Slab Volume Calculator"
      description="The ultimate guide and calculator for Concrete Slab Volume Calculator. Learn how to estimate materials, calculate costs, and avoid common mistakes in your project."
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