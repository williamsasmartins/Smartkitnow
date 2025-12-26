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

export default function HardwoodPlankQuantityCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters, cm) or imperial (feet, inches)
    length: "", // length of the floor area
    width: "", // width of the floor area
    plankLength: "", // length of one hardwood plank
    plankWidth: "", // width of one hardwood plank
    waste: "10", // waste percentage
    price: "", // price per plank unit
    materialSize: "standard", // standard or large plank size (affects calculation)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Helper: convert all inputs to meters for calculation
  // Metric: length and width in meters or cm (assumed meters)
  // Imperial: length and width in feet (convert to meters)
  // Plank dimensions also converted accordingly
  const toMeters = (value: number, unit: string) => {
    if (unit === "metric") return value; // assume meters input
    // imperial feet to meters
    return value * 0.3048;
  };

  // Calculate total floor area in square meters
  // Calculate area covered by one plank in square meters
  // Calculate number of planks needed = total area / plank area
  // Add waste margin
  // Round up to whole planks

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const plankLengthNum = parseFloat(inputs.plankLength);
    const plankWidthNum = parseFloat(inputs.plankWidth);
    const wasteNum = parseInt(inputs.waste);
    const priceNum = parseFloat(inputs.price);

    if (
      !lengthNum ||
      !widthNum ||
      !plankLengthNum ||
      !plankWidthNum ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      plankLengthNum <= 0 ||
      plankWidthNum <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Convert all to meters
    const floorLengthM = toMeters(lengthNum, inputs.unit);
    const floorWidthM = toMeters(widthNum, inputs.unit);
    const plankLengthM = toMeters(plankLengthNum, inputs.unit);
    const plankWidthM = toMeters(plankWidthNum, inputs.unit);

    // Calculate floor area (m²)
    const floorArea = floorLengthM * floorWidthM;

    // Calculate plank coverage area (m²)
    const plankArea = plankLengthM * plankWidthM;

    if (plankArea === 0) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Plank area cannot be zero.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Base quantity without waste
    const baseQty = floorArea / plankArea;

    // Add waste margin
    const totalQty = baseQty * (1 + wasteNum / 100);

    // Round up to whole planks
    const roundedQty = Math.ceil(totalQty);

    // Calculate cost if price is provided
    const totalCost =
      priceNum && priceNum > 0 ? (roundedQty * priceNum).toFixed(2) : null;

    return {
      mainQty: `${roundedQty} Planks`,
      cost: totalCost ? `$${totalCost}` : "Price not set",
      details: `Floor Area: ${floorArea.toFixed(
        2
      )} m², Plank Area: ${plankArea.toFixed(4)} m², Raw Qty: ${baseQty.toFixed(
        2
      )}`,
      wasteInfo: `+${wasteNum}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is a Hardwood Plank Quantity Calculator and why use it?",
      answer:
        "A Hardwood Plank Quantity Calculator is a tool designed to help contractors, builders, and DIY enthusiasts accurately estimate the number of hardwood planks required to cover a given floor area. By inputting the dimensions of the floor and the size of the planks, the calculator determines the total quantity needed, factoring in waste and cuts. This ensures efficient material ordering, reduces costs, and minimizes leftover waste.",
    },
    {
      question:
        "Why is precision important when calculating hardwood plank quantities?",
      answer:
        "Precision in calculating hardwood plank quantities is crucial because underestimating can lead to project delays and additional costs due to last-minute orders, while overestimating results in unnecessary material expenses and waste. Accurate calculations help maintain budget control, ensure timely project completion, and promote sustainable use of resources by minimizing excess material.",
    },
    {
      question: "What types of hardwood materials can this calculator handle?",
      answer:
        "This calculator is versatile and can handle various hardwood plank types, including solid hardwood, engineered hardwood, and laminate flooring planks. It accommodates different plank sizes, whether standard or large formats, allowing users to input custom plank dimensions to suit the specific material being used.",
    },
    {
      question:
        "How does the waste percentage affect the total quantity of hardwood planks?",
      answer:
        "The waste percentage accounts for extra material needed to cover cutting losses, mistakes, and fitting around obstacles. Typically, a 5-10% waste margin is added to the base quantity to ensure there are enough planks to complete the job without shortages. Increasing the waste percentage raises the total quantity ordered, providing a safety buffer but potentially increasing costs if set too high.",
    },
    {
      question:
        "Can I use this calculator for both metric and imperial measurement systems?",
      answer:
        "Yes, the calculator supports both metric (meters) and imperial (feet) units. Users can select their preferred measurement system, and the calculator will automatically convert dimensions as needed to perform accurate calculations.",
    },
    {
      question:
        "How do plank size variations impact the quantity calculation?",
      answer:
        "Plank size directly affects how many planks are needed to cover a floor area. Larger planks cover more area per unit, reducing the total quantity required, while smaller planks increase the quantity. This calculator allows input of custom plank dimensions to reflect the actual size of the material, ensuring precise quantity estimations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing hardwood flooring in a living room measuring 5 meters by 4 meters. You are using standard hardwood planks that are 1.2 meters long and 0.15 meters wide. You want to include a 10% waste margin to account for cuts and mistakes.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate the floor area: 5 m × 4 m = 20 m². Calculate plank area: 1.2 m × 0.15 m = 0.18 m².",
      },
      {
        label: "2. Calculate Base Quantity",
        explanation:
          "Divide floor area by plank area: 20 m² ÷ 0.18 m² ≈ 111.11 planks needed without waste.",
      },
      {
        label: "3. Add Waste Margin",
        explanation:
          "Add 10% waste: 111.11 × 1.10 ≈ 122.22 planks. Round up to 123 planks.",
      },
      {
        label: "4. Order",
        explanation:
          "Order 123 hardwood planks to ensure full coverage with waste included.",
      },
    ],
    result: "Final Order: 123 Planks",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Total Planks Needed = ⌈ (Floor Length × Floor Width) / (Plank Length × Plank Width) × (1 + Waste Percentage) ⌉",
    variables: [
      { symbol: "Floor Length", description: "Length of the floor area" },
      { symbol: "Floor Width", description: "Width of the floor area" },
      { symbol: "Plank Length", description: "Length of one hardwood plank" },
      { symbol: "Plank Width", description: "Width of one hardwood plank" },
      {
        symbol: "Waste Percentage",
        description:
          "Additional percentage to cover cutting waste and mistakes (expressed as decimal, e.g., 0.10 for 10%)",
      },
      {
        symbol: "⌈ ⌉",
        description: "Ceiling function to round up to the nearest whole plank",
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
            <SelectItem value="metric">Metric (meters)</SelectItem>
            <SelectItem value="imperial">Imperial (feet)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DYNAMIC INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Floor Length ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
        <div className="space-y-2">
          <Label>Floor Width ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder="e.g. 4"
          />
        </div>
        <div className="space-y-2">
          <Label>Plank Length ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.plankLength}
            onChange={(e) => handleInputChange("plankLength", e.target.value)}
            placeholder="e.g. 1.2"
          />
        </div>
        <div className="space-y-2">
          <Label>Plank Width ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.plankWidth}
            onChange={(e) => handleInputChange("plankWidth", e.target.value)}
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
          <Label>Price per Plank</Label>
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Hardwood
          Plank Quantity Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The Hardwood Plank Quantity Calculator is an essential tool for anyone
            planning to install hardwood flooring. It helps you accurately estimate
            the number of hardwood planks required to cover your floor area based on
            your specific dimensions and plank sizes. This calculator takes the guesswork
            out of ordering materials, ensuring you purchase the right amount without
            costly overages or shortages.
          </p>
          <p>
            Precision matters greatly in flooring projects. Ordering too few planks
            can delay your project and increase costs due to expedited orders or
            mismatched batches. Conversely, ordering too many planks leads to wasted
            materials and unnecessary expenses. This calculator incorporates a waste
            margin to cover cutting losses and mistakes, giving you a realistic quantity
            to order.
          </p>
          <p>
            Hardwood flooring comes in various types and sizes, including solid hardwood,
            engineered hardwood, and laminate planks. Each type may have different
            dimensions and installation requirements. This tool allows you to input
            custom plank lengths and widths, accommodating standard and large plank
            sizes alike.
          </p>
          <p>
            Whether you prefer metric or imperial units, this calculator supports both,
            converting measurements as needed to provide accurate results. By using
            this calculator, you can confidently plan your hardwood flooring project,
            optimize your budget, and reduce waste.
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
            <strong>Tip:</strong> Always measure your floor area at multiple points and
            use the largest measurement to avoid underestimating the required planks.
          </li>
          <li>
            <strong>Did You Know?</strong> Larger plank sizes can reduce installation
            time but may increase waste if your floor has many corners or irregular
            shapes.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Adding a 10% waste margin is standard,
            but for complex layouts or diagonal installations, consider increasing waste
            to 15% or more.
          </li>
          <li>
            <strong>Tip:</strong> When ordering, check if your supplier sells hardwood
            planks by the box or by individual pieces to better estimate costs.
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
            <strong>1. Underestimating Waste:</strong> Not including enough waste margin
            can cause shortages mid-project, leading to delays and extra costs.
          </p>
          <p>
            <strong>2. Ignoring Plank Dimensions:</strong> Using default plank sizes
            without measuring your actual material can result in inaccurate quantity
            calculations.
          </p>
          <p>
            <strong>3. Mixing Units:</strong> Inputting dimensions in mixed units (e.g.,
            feet and meters) without converting can cause calculation errors.
          </p>
          <p>
            <strong>4. Forgetting to Round Up:</strong> Always round up the total planks
            needed; flooring cannot be ordered in fractions.
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Hardwood Plank Quantity Calculator"
      description="The ultimate professional guide and calculator for Hardwood Plank Quantity Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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