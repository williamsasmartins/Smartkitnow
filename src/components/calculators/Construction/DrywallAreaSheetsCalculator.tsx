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
  Truck,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DrywallAreaSheetsCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    height: "",
    waste: "10",
    price: "",
    sheetSize: "4x8", // standard drywall sheet sizes
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Sheet sizes in feet and meters for conversion
  const sheetSizes = {
    "4x8": { ft: { width: 4, height: 8 }, m: { width: 1.22, height: 2.44 } },
    "4x10": { ft: { width: 4, height: 10 }, m: { width: 1.22, height: 3.05 } },
    "4x12": { ft: { width: 4, height: 12 }, m: { width: 1.22, height: 3.66 } },
  };

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const heightNum = parseFloat(inputs.height);
    const wasteNum = parseInt(inputs.waste);
    const priceNum = parseFloat(inputs.price);

    if (
      isNaN(lengthNum) ||
      lengthNum <= 0 ||
      isNaN(heightNum) ||
      heightNum <= 0 ||
      isNaN(wasteNum) ||
      wasteNum < 0 ||
      isNaN(priceNum) ||
      priceNum < 0
    ) {
      return null;
    }

    // Get sheet dimensions based on unit and selected sheet size
    const sheetDim = sheetSizes[inputs.sheetSize];
    if (!sheetDim) return null;

    const sheetWidth = inputs.unit === "metric" ? sheetDim.m.width : sheetDim.ft.width;
    const sheetHeight = inputs.unit === "metric" ? sheetDim.m.height : sheetDim.ft.height;

    // Calculate total wall area (length * height)
    const area = lengthNum * heightNum; // in sq meters or sq feet

    // Calculate sheet area
    const sheetArea = sheetWidth * sheetHeight;

    // Calculate number of sheets needed without waste
    const sheetsNeededRaw = area / sheetArea;

    // Add waste factor
    const sheetsNeededWithWaste = sheetsNeededRaw * (1 + wasteNum / 100);

    // Round up to whole sheets (can't buy partial sheets)
    const sheetsToBuy = Math.ceil(sheetsNeededWithWaste);

    // Calculate total cost
    const totalCost = sheetsToBuy * priceNum;

    return {
      qty: `${sheetsToBuy} Sheets`,
      cost: `$${totalCost.toFixed(2)}`,
      details: `Wall Area: ${area.toFixed(2)} ${
        inputs.unit === "metric" ? "m²" : "ft²"
      }, Sheet Size: ${inputs.sheetSize} ft`,
      wasteInfo: `Includes ${wasteNum}% waste for cuts and errors`,
      feedback:
        sheetsToBuy <= 5
          ? "Perfect for small rooms or DIY projects."
          : sheetsToBuy <= 20
          ? "Suitable for medium-sized rooms or multiple walls."
          : "Large project - consider ordering extra sheets for safety.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Does this calculator include waste for cuts and mistakes?",
      answer:
        "Yes, you can adjust the waste/overage percentage to account for spills, cuts, and errors. The default is 10%.",
    },
    {
      question: "Can I use this calculator for ceilings as well as walls?",
      answer:
        "Absolutely! Just enter the length and height (or width) of the ceiling area you want to cover.",
    },
    {
      question: "What sheet sizes are available for selection?",
      answer:
        "You can select from standard drywall sheet sizes: 4x8, 4x10, and 4x12 feet (or their metric equivalents).",
    },
    {
      question: "Should I include door and window openings in my measurements?",
      answer:
        "It's best to subtract the area of doors and windows from your total wall area to avoid overestimating materials.",
    },
    {
      question: "Does the price per unit include taxes and delivery?",
      answer:
        "No, the price per unit is the material cost only. Taxes, delivery, and other fees should be calculated separately.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
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
            <SelectItem value="metric">Metric (Meters)</SelectItem>
            <SelectItem value="imperial">Imperial (Feet)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dimensions Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label>Height ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Sheet Size & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Drywall Sheet Size</Label>
          <Select
            value={inputs.sheetSize}
            onValueChange={(v) => handleInputChange("sheetSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4x8">4 ft x 8 ft (1.22m x 2.44m)</SelectItem>
              <SelectItem value="4x10">4 ft x 10 ft (1.22m x 3.05m)</SelectItem>
              <SelectItem value="4x12">4 ft x 12 ft (1.22m x 3.66m)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Sheet</Label>
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

      {/* Waste Slider */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between">
          <Label>Waste / Overage Factor</Label>
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
          Accounts for spills, cuts, and errors. Industry standard is 10%.
        </p>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {}}
        // Calculation is automatic on input change, button is for UX
      >
        <Hammer className="mr-2 h-5 w-5" /> Calculate Materials
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 dark:border-blue-900 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              You Need To Buy
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.qty}
            </div>
            <div className="text-xl font-medium text-slate-700 dark:text-slate-300">
              Est. Cost: {results.cost}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center">
                <Info className="w-3 h-3 mr-1" /> {results.details}
              </span>
              <span className="flex items-center text-amber-600">
                <Truck className="w-3 h-3 mr-1" /> {results.wasteInfo}
              </span>
            </div>
            <p className="mt-3 text-sm italic text-slate-600 dark:text-slate-400">
              {results.feedback}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-10">
      <section id="how-to">
        <h2 className="text-2xl font-bold mb-4">
          How to Calculate for Drywall Area & Sheets Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Accurate drywall estimation prevents costly shortages or excess
            waste. Follow these steps:
          </p>
          <ol>
            <li>
              <strong>Measure the length</strong> of the wall or ceiling in
              meters or feet.
            </li>
            <li>
              <strong>Measure the height</strong> of the wall or ceiling.
            </li>
            <li>
              <strong>Subtract openings</strong> such as doors and windows from
              the total area if possible.
            </li>
            <li>
              <strong>Select your drywall sheet size</strong> (commonly 4x8 ft).
            </li>
            <li>
              <strong>Enter the price per sheet</strong> to estimate your budget.
            </li>
            <li>
              <strong>Adjust the waste factor</strong> to cover cuts, errors,
              and damaged sheets.
            </li>
            <li>
              <strong>Calculate</strong> to get the total sheets needed and
              estimated cost.
            </li>
          </ol>
          <p>
            Remember, it's better to have a few extra sheets than to run short
            during installation.
          </p>
        </div>
      </section>

      <section
        id="tips"
        className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900"
      >
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <HardHat className="w-5 h-5" /> Professional Tips
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          • Use full sheets where possible to minimize waste. Cut sheets only
          when necessary. <br />
          • Always order at least 10% extra sheets to cover mistakes, damaged
          sheets, and future repairs. <br />
          • Measure walls carefully, including corners and irregular shapes.{" "}
          <br />
          • For ceilings, consider the layout of joists to minimize visible
          seams. <br />
          • Store drywall sheets flat and dry to prevent warping before
          installation.
        </p>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b pb-4">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
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
      title="Drywall Area & Sheets Calculator"
      description="Calculate number of drywall sheets for walls and ceilings with waste and cost estimation."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to", label: "How to Measure" },
        { id: "tips", label: "Pro Tips" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}