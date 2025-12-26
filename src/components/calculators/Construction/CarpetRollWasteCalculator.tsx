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

export default function CarpetRollWasteCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "", // length of the room/area
    width: "", // width of the room/area
    rollWidth: "4", // width of carpet roll (meters or feet)
    waste: "10", // waste percentage
    price: "", // price per roll unit
    materialSize: "standard", // standard or large roll size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion helpers
  const toMeters = (val: number) =>
    inputs.unit === "imperial" ? val * 0.3048 : val;
  const toFeet = (val: number) =>
    inputs.unit === "metric" ? val / 0.3048 : val;

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const rollWidthNum = parseFloat(inputs.rollWidth);
    const wastePercent = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);

    if (
      isNaN(lengthNum) ||
      isNaN(widthNum) ||
      isNaN(rollWidthNum) ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      rollWidthNum <= 0
    ) {
      return {
        mainQty: "0 Rolls",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Convert all to meters internally for calculation
    const lengthM = toMeters(lengthNum);
    const widthM = toMeters(widthNum);
    const rollWidthM = toMeters(rollWidthNum);

    // Calculate total carpet length needed (in meters)
    // Carpet is sold in rolls of fixed width (rollWidthM)
    // We calculate how many strips of rollWidth are needed to cover width
    // Then multiply strips by length to get total length of carpet needed
    const stripsNeeded = Math.ceil(widthM / rollWidthM);
    const totalLengthNeeded = stripsNeeded * lengthM;

    // Add waste margin
    const totalLengthWithWaste =
      totalLengthNeeded * (1 + wastePercent / 100);

    // Rolls needed (round up)
    // Each roll is sold in fixed length units (standard or large)
    // We'll define standard roll length:
    // Standard roll length: 25 meters (metric) or 82 feet (imperial)
    // Large roll length: 30 meters (metric) or 98 feet (imperial)
    const standardRollLengthM = inputs.materialSize === "standard" ? 25 : 30;

    // Rolls needed
    const rollsNeeded = Math.ceil(totalLengthWithWaste / standardRollLengthM);

    // Cost calculation
    const totalCost =
      !isNaN(priceNum) && priceNum > 0
        ? rollsNeeded * priceNum
        : 0;

    // Format outputs
    const unitLabel = inputs.unit === "metric" ? "meters" : "feet";
    const rollLengthLabel =
      inputs.unit === "metric"
        ? `${standardRollLengthM} meters`
        : `${Math.round(standardRollLengthM / 0.3048)} feet`;

    return {
      mainQty: `${rollsNeeded} Roll${rollsNeeded > 1 ? "s" : ""}`,
      cost: `$${totalCost.toFixed(2)}`,
      details: `Total carpet length needed: ${totalLengthNeeded.toFixed(
        2
      )} ${unitLabel} (without waste). Roll length: ${rollLengthLabel}.`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [
    inputs.length,
    inputs.width,
    inputs.rollWidth,
    inputs.waste,
    inputs.price,
    inputs.materialSize,
    inputs.unit,
  ]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question:
        "How do I determine the correct carpet roll width for my project?",
      answer:
        "Carpet rolls come in standard widths, typically 4 meters (13 feet) or 5 meters (16 feet) in metric and imperial systems respectively. Measure the width of your room and select a roll width that minimizes seams. Using a wider roll reduces the number of seams and waste, but may cost more. Always confirm the roll width with your supplier before ordering.",
    },
    {
      question:
        "Why is it important to include a waste margin when calculating carpet rolls?",
      answer:
        "Including a waste margin accounts for cutting errors, pattern matching, seams, and future repairs. Typically, a 10% waste margin is recommended to ensure you have enough material. Underestimating waste can lead to ordering insufficient carpet, causing delays and additional costs.",
    },
    {
      question:
        "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, the calculator supports both metric (meters) and imperial (feet) units. Simply select your preferred unit system, and input your dimensions accordingly. The calculations internally convert units to maintain accuracy and provide results consistent with your selection.",
    },
    {
      question:
        "How do different carpet roll sizes affect the quantity I need to order?",
      answer:
        "Carpet rolls come in standard and large sizes, typically differing in length. Larger rolls reduce the number of joints and seams but may be more expensive or harder to handle. This calculator allows you to select the roll size, which affects the total number of rolls needed based on your project's dimensions.",
    },
    {
      question:
        "What should I do if my room has an irregular shape or multiple areas?",
      answer:
        "For irregular shapes or multiple rooms, break down the area into rectangular sections and calculate the carpet needed for each separately. Sum the total lengths and widths, then add waste margin accordingly. This ensures more precise ordering and reduces excess material.",
    },
    {
      question:
        "How do I estimate the cost of carpet rolls using this calculator?",
      answer:
        "Enter the price per roll unit in the calculator along with your project dimensions and waste margin. The calculator multiplies the number of rolls needed by the price per roll to give you an estimated total cost. Remember to verify prices with your supplier as they can vary based on material and roll size.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing carpet in a rectangular room measuring 6 meters by 5 meters. You have carpet rolls that are 4 meters wide and 25 meters long (standard size). You want to include a 10% waste margin and the price per roll is $150.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Room width is 5 m, roll width is 4 m, so you need 2 strips (ceil(5/4) = 2). Total length needed is 2 strips × 6 m length = 12 m.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste: 12 m × 1.10 = 13.2 m total carpet length needed.",
      },
      {
        label: "3. Order",
        explanation:
          "Each roll is 25 m long, so rolls needed = ceil(13.2 / 25) = 1 roll.",
      },
    ],
    result: "Final Order: 1 Roll, Estimated Cost: $150.00",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Rolls Needed = ⎡ (Ceil(Room Width / Roll Width) × Room Length × (1 + Waste %)) / Roll Length ⎤",
    variables: [
      { symbol: "Room Width", description: "Width of the area to carpet" },
      { symbol: "Room Length", description: "Length of the area to carpet" },
      { symbol: "Roll Width", description: "Width of one carpet roll" },
      { symbol: "Waste %", description: "Waste margin percentage (e.g., 0.10 for 10%)" },
      { symbol: "Roll Length", description: "Length of one carpet roll" },
      { symbol: "⎡x⎤", description: "Ceiling function (round up to next integer)" },
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
          <Label>Length of Area</Label>
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
          <Label>Width of Area</Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Carpet Roll Width</Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
            value={inputs.rollWidth}
            onChange={(e) => handleInputChange("rollWidth", e.target.value)}
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Roll Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Roll (25 m / 82 ft)</SelectItem>
              <SelectItem value="large">Large Roll (30 m / 98 ft)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Roll</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              type="number"
              min={0}
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
          Professional Guide: Carpet Roll & Waste Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The Carpet Roll & Waste Calculator is a specialized tool designed to
            help contractors, installers, and DIY enthusiasts accurately estimate
            the amount of carpet material required for a given space. By inputting
            the dimensions of the area and the width of the carpet roll, users can
            determine how many rolls to order, factoring in an appropriate waste
            margin to cover cutting, seams, and potential errors.
          </p>
          <p>
            Precision in carpet estimation is crucial to avoid costly over-ordering
            or under-ordering. Too little carpet can delay projects and increase
            expenses due to rush orders, while excess material ties up capital and
            storage space. This calculator ensures you get the right quantity the
            first time.
          </p>
          <p>
            Carpet rolls come in various widths and lengths, typically standardized
            by manufacturers. Common roll widths include 4 meters (approximately 13
            feet) and 5 meters (approximately 16 feet). Roll lengths vary, with
            standard sizes around 25 meters (82 feet) and larger rolls up to 30
            meters (98 feet). Selecting the correct roll size impacts the number of
            rolls needed and the amount of waste generated.
          </p>
          <p>
            This calculator supports both metric and imperial units, making it
            versatile for projects worldwide. By adjusting the waste margin slider,
            users can customize the safety buffer based on project complexity and
            installation conditions.
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
            <strong>Tip 1:</strong> Always measure your room dimensions at multiple
            points to account for irregularities or uneven walls.
          </li>
          <li>
            <strong>Tip 2:</strong> When possible, choose a carpet roll width that
            closely matches your room width to minimize seams and waste.
          </li>
          <li>
            <strong>Did You Know?</strong> Carpet rolls are often sold by length,
            but the width is fixed, so calculating strips needed is key to
            accurate estimation.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Adding a 10-15% waste margin is
            standard, but complex patterns or diagonal installations may require
            more.
          </li>
          <li>
            <strong>Tip 3:</strong> Keep leftover carpet rolls for future repairs
            or patching to maintain color and texture consistency.
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
            <strong>1. Underestimating Waste:</strong> Failing to include an
            adequate waste margin can lead to insufficient carpet, causing delays
            and additional costs.
          </p>
          <p>
            <strong>2. Ignoring Roll Width:</strong> Not accounting for the carpet
            roll width when calculating strips can result in ordering too little
            material.
          </p>
          <p>
            <strong>3. Mixing Units:</strong> Inputting dimensions in mixed units
            (e.g., length in feet and width in meters) without converting leads to
            incorrect calculations.
          </p>
          <p>
            <strong>4. Not Confirming Roll Sizes:</strong> Carpet roll sizes can
            vary by supplier; always verify roll dimensions before ordering.
          </p>
          <p>
            <strong>5. Overlooking Room Shape:</strong> Complex or irregular room
            shapes require breaking down the area into sections for accurate
            estimation.
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
      title="Carpet Roll & Waste Calculator"
      description="The ultimate professional guide and calculator for Carpet Roll & Waste Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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