import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export default function JointCompoundAmountCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet/inches
    length: "",
    width: "",
    depth: "", // thickness of joint compound layer
    waste: "10", // percent
    price: "",
    materialSize: "standard", // standard or large bag size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * 1. Convert inputs to consistent units (meters for metric, feet for imperial)
   * 2. Calculate volume = length * width * depth (in cubic meters or cubic feet)
   * 3. Convert volume to joint compound quantity in bags:
   *    - Standard bag yield: ~0.011 cubic meters (11 liters) per 18.1 kg bag (40 lbs)
   *    - Large bag yield: ~0.022 cubic meters (22 liters) per 36.3 kg bag (80 lbs)
   * 4. Add waste percentage
   * 5. Calculate cost if price per bag is provided
   */

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const depthNum = parseFloat(inputs.depth);
    const wastePercent = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    const isMetric = inputs.unit === "metric";

    if (
      isNaN(lengthNum) ||
      isNaN(widthNum) ||
      isNaN(depthNum) ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      depthNum <= 0
    ) {
      return {
        mainQty: "0 Bags",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Convert all dimensions to meters if metric, or feet if imperial
    // For metric: inputs are in meters (m)
    // For imperial: inputs are in feet (ft)
    // Depth is thickness of joint compound layer (e.g. 0.005 m = 5 mm or 1/16 inch)

    // Calculate volume in cubic meters or cubic feet
    const volume = lengthNum * widthNum * depthNum;

    // Bag yields:
    // Standard bag (18.1 kg / 40 lbs) covers approx 11 liters = 0.011 m³
    // Large bag (36.3 kg / 80 lbs) covers approx 22 liters = 0.022 m³
    // For imperial, convert yields to cubic feet:
    // 1 cubic meter = 35.3147 cubic feet
    // So standard bag yield in cubic feet = 0.011 * 35.3147 ≈ 0.3885 ft³
    // Large bag yield in cubic feet = 0.022 * 35.3147 ≈ 0.777 ft³

    let bagYield = 0.011; // default standard bag yield in m³
    if (inputs.materialSize === "large") {
      bagYield = 0.022;
    }
    if (!isMetric) {
      bagYield *= 35.3147; // convert to cubic feet
    }

    // Calculate raw bags needed
    const rawBags = volume / bagYield;

    // Add waste margin
    const totalBags = rawBags * (1 + wastePercent / 100);

    // Round up to nearest whole bag
    const bagsRounded = Math.ceil(totalBags);

    // Calculate cost if price provided
    const cost = priceNum && priceNum > 0 ? (bagsRounded * priceNum).toFixed(2) : null;

    return {
      mainQty: `${bagsRounded} Bag${bagsRounded > 1 ? "s" : ""}`,
      cost: cost ? `$${cost}` : "Price not set",
      details: `Raw quantity: ${rawBags.toFixed(2)} bags`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What thickness of joint compound should I use for taping and finishing drywall joints?",
      answer:
        "Typically, joint compound is applied in thin layers ranging from 1/16 inch (about 1.5 mm) to 1/8 inch (about 3 mm) thickness per coat. Multiple coats are applied with drying time in between. The thickness you input should reflect the total thickness of all coats combined for accurate material estimation.",
    },
    {
      question: "How do I convert measurements between metric and imperial units for this calculator?",
      answer:
        "If you measure in feet and inches, select the imperial unit option and enter your dimensions in feet (decimals allowed, e.g., 2.5 ft). For metric, enter dimensions in meters (e.g., 0.5 m). The calculator automatically converts bag yields accordingly to provide accurate results.",
    },
    {
      question: "Why is it important to include a waste percentage in the calculation?",
      answer:
        "Including a waste margin accounts for material lost due to spillage, uneven application, mixing errors, or surface texture variations. A typical waste factor is 10%, but it can be adjusted based on job complexity or contractor experience to avoid underordering.",
    },
    {
      question: "What are the differences between standard and large size joint compound bags?",
      answer:
        "Standard bags usually weigh about 18.1 kg (40 lbs) and cover approximately 11 liters (0.011 m³) of volume. Large bags weigh around 36.3 kg (80 lbs) and cover roughly double the volume. Choosing the correct bag size affects how many bags you need to order and can impact cost and handling.",
    },
    {
      question: "Can I use this calculator for other types of drywall finishing materials?",
      answer:
        "This calculator is specifically designed for joint compound (drywall mud). Other materials like setting-type compounds, plaster, or texture coatings have different densities and coverage rates, so separate calculations or specialized tools are recommended for those.",
    },
    {
      question: "How accurate is this calculator for real-world projects?",
      answer:
        "While this calculator provides a solid estimate based on standard yields and inputs, actual usage can vary due to surface conditions, application technique, and drying shrinkage. Always consider ordering a bit extra and consult with your supplier or contractor for large or critical projects.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are finishing drywall in a room where you need to apply joint compound over taped seams. The area to cover measures 5 meters in length, 3 meters in width, and you plan a total compound thickness of 0.005 meters (5 mm). You want to include a 10% waste margin and use standard size bags priced at $15 each.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Calculate volume: 5 m × 3 m × 0.005 m = 0.075 cubic meters of joint compound needed.",
      },
      {
        label: "2. Waste",
        explanation: "Add 10% waste: 0.075 × 1.10 = 0.0825 cubic meters total volume.",
      },
      {
        label: "3. Order",
        explanation:
          "Divide total volume by bag yield (0.011 m³ per standard bag): 0.0825 ÷ 0.011 ≈ 7.5 bags. Round up to 8 bags.",
      },
    ],
    result: "Final Order: 8 Standard Bags, Estimated Cost: $120.00",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Volume = Length × Width × Depth",
    variables: [
      { symbol: "L", description: "Length of the area (meters or feet)" },
      { symbol: "W", description: "Width of the area (meters or feet)" },
      { symbol: "D", description: "Depth or thickness of joint compound layer (meters or feet)" },
    ],
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
            placeholder="e.g. 5"
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
          <Label>Depth / Thickness ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder={inputs.unit === "metric" ? "e.g. 0.005 (5 mm)" : "e.g. 0.016 (1/16 ft)"}
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
              <SelectItem value="standard">Standard Size (18.1 kg / 40 lbs)</SelectItem>
              <SelectItem value="large">Large Size (36.3 kg / 80 lbs)</SelectItem>
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
      {/* 4. GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Joint Compound Amount Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Joint compound, often called drywall mud, is a critical material used to finish drywall installations by filling joints, covering screws, and creating a smooth surface ready for painting or wallpapering. Accurately estimating the amount of joint compound needed for a project helps avoid costly delays, waste, and underordering.
          </p>
          <p>
            Precision matters because applying too little joint compound can lead to visible seams and imperfections, while ordering too much results in unnecessary expense and material waste. Factors such as the size of the area, thickness of application, and number of coats all influence the total volume of compound required.
          </p>
          <p>
            There are different types and sizes of joint compound bags available, typically standard 18.1 kg (40 lbs) bags and larger 36.3 kg (80 lbs) bags. Each size covers a specific volume, and choosing the right size can optimize handling and cost efficiency. This calculator helps you convert your project dimensions into the number of bags needed, factoring in waste and pricing.
          </p>
          <p>
            Using this calculator, professionals and DIYers alike can quickly determine the quantity of joint compound required for any drywall finishing job, ensuring smooth, professional results with minimal waste.
          </p>
        </div>
      </section>

      {/* 5. TIPS / DID YOU KNOW */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <Lightbulb className="w-5 h-5 text-yellow-500" /> Pro Tips & Curiosities
        </h3>
        <ul className="space-y-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>Tip:</strong> Always measure your drywall joints and seams carefully and consider the total thickness of all coats you plan to apply, including taping, topping, and finishing layers.
          </li>
          <li>
            <strong>Did You Know?</strong> Joint compound shrinks slightly as it dries, so applying multiple thin coats rather than one thick coat improves finish quality and reduces cracking.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Adding a 10% to 15% waste margin helps cover unexpected losses from mixing, spillage, or surface texture variations, preventing last-minute shortages.
          </li>
          <li>
            <strong>Tip:</strong> For large projects, consider ordering a mix of standard and large bags to optimize labor and storage space.
          </li>
        </ul>
      </section>

      {/* 6. MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes to Avoid
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Underestimating Thickness:</strong> Many users forget to input the total thickness of all joint compound layers combined, leading to underordering and project delays.
          </p>
          <p>
            <strong>2. Ignoring Waste Factor:</strong> Skipping the waste margin can cause shortages due to spillage, uneven surfaces, or mixing errors. Always include at least 10% waste.
          </p>
          <p>
            <strong>3. Mixing Units:</strong> Entering dimensions in mixed units (e.g., feet and meters) without switching the unit selector causes incorrect calculations. Always ensure all inputs match the selected unit system.
          </p>
          <p>
            <strong>4. Incorrect Bag Size Selection:</strong> Using the wrong bag size setting will miscalculate the number of bags needed. Confirm the bag size you intend to purchase before calculating.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
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
      title="Joint Compound Amount Calculator"
      description="The ultimate professional guide and calculator for Joint Compound Amount Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}