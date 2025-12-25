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
import { Separator } from "@/components/ui/separator";
import {
  Ruler,
  Hammer,
  HardHat,
  Box,
  DollarSign,
  Calculator,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type Unit = "metric" | "imperial";

const SHEET_SIZES = {
  metric: [
    { label: "1200 x 2400 mm (4x8 ft)", width: 1.2, height: 2.4, value: "1200x2400" },
    { label: "1200 x 3000 mm (4x10 ft)", width: 1.2, height: 3.0, value: "1200x3000" },
  ],
  imperial: [
    { label: "4 x 8 ft (1219 x 2438 mm)", width: 4, height: 8, value: "4x8" },
    { label: "4 x 12 ft (1219 x 3658 mm)", width: 4, height: 12, value: "4x12" },
  ],
};

export default function DrywallSheetCountCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric" as Unit,
    length: "", // room length
    width: "", // room width
    height: "", // room height
    waste: "10", // default 10%
    price: "", // price per sheet
    sheetSize: "", // selected drywall sheet size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Convert feet to meters and vice versa helper
  const ftToM = (ft: number) => ft * 0.3048;
  const mToFt = (m: number) => m / 0.3048;

  // Calculate drywall sheet count and cost
  const results = useMemo(() => {
    const {
      unit,
      length,
      width,
      height,
      waste,
      price,
      sheetSize,
    } = inputs;

    // Validate inputs
    const lengthNum = parseFloat(length);
    const widthNum = parseFloat(width);
    const heightNum = parseFloat(height);
    const wasteNum = parseFloat(waste);
    const priceNum = parseFloat(price);

    if (
      isNaN(lengthNum) ||
      lengthNum <= 0 ||
      isNaN(widthNum) ||
      widthNum <= 0 ||
      isNaN(heightNum) ||
      heightNum <= 0 ||
      isNaN(wasteNum) ||
      wasteNum < 0 ||
      wasteNum > 100 ||
      !sheetSize
    ) {
      return {
        qty: "0 Sheets",
        cost: "$0.00",
        details: "Enter valid dimensions and select sheet size.",
        feedback: "Please fill all required fields correctly.",
      };
    }

    // Get selected sheet dimensions in meters
    let sheetWidthM = 0;
    let sheetHeightM = 0;

    const sheetOptions = SHEET_SIZES[unit];
    const selectedSheet = sheetOptions.find((s) => s.value === sheetSize);
    if (!selectedSheet) {
      return {
        qty: "0 Sheets",
        cost: "$0.00",
        details: "Select a valid drywall sheet size.",
        feedback: "Invalid sheet size selected.",
      };
    }

    if (unit === "metric") {
      sheetWidthM = selectedSheet.width;
      sheetHeightM = selectedSheet.height;
    } else {
      // imperial inputs are in feet, convert to meters for calculation
      sheetWidthM = ftToM(selectedSheet.width);
      sheetHeightM = ftToM(selectedSheet.height);
    }

    // Calculate total wall area (4 walls) + ceiling area
    // Walls: 2*(L+W)*H
    // Ceiling: L*W
    // All in meters squared

    let roomLengthM = lengthNum;
    let roomWidthM = widthNum;
    let roomHeightM = heightNum;

    if (unit === "imperial") {
      roomLengthM = ftToM(lengthNum);
      roomWidthM = ftToM(widthNum);
      roomHeightM = ftToM(heightNum);
    }

    const wallArea = 2 * (roomLengthM + roomWidthM) * roomHeightM;
    const ceilingArea = roomLengthM * roomWidthM;
    const totalArea = wallArea + ceilingArea;

    // Calculate sheets needed without waste
    const sheetArea = sheetWidthM * sheetHeightM;
    const baseSheets = totalArea / sheetArea;

    // Add waste factor
    const sheetsWithWaste = baseSheets * (1 + wasteNum / 100);

    // Round up to whole sheets
    const totalSheets = Math.ceil(sheetsWithWaste);

    // Calculate cost if price is valid
    const totalCost =
      !isNaN(priceNum) && priceNum > 0 ? totalSheets * priceNum : 0;

    // Format cost
    const costFormatted = totalCost.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    // Format area in m² or ft² for display
    const areaDisplay =
      unit === "metric"
        ? `${totalArea.toFixed(2)} m²`
        : `${(totalArea * 10.7639).toFixed(2)} ft²`;

    return {
      qty: `${totalSheets} Sheets`,
      cost: costFormatted,
      details: `Raw area: ${areaDisplay}, Sheet area: ${sheetArea.toFixed(
        2
      )} m², Waste: ${wasteNum}%`,
      feedback: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do I need to include a waste factor?",
      answer:
        "Waste accounts for material loss due to cutting, mistakes, and damage. Typically, 5-10% waste is recommended.",
    },
    {
      question: "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, you can select your preferred unit system and input dimensions accordingly.",
    },
    {
      question: "How do I select the drywall sheet size?",
      answer:
        "Choose from standard drywall sheet sizes available in your selected unit system.",
    },
    {
      question: "What does the estimated cost represent?",
      answer:
        "It is the total cost based on the number of sheets needed multiplied by the price per sheet you enter.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit selection */}
      <div className="space-y-2">
        <Label>
          <Ruler className="inline mr-1 mb-1" size={16} />
          Unit System
        </Label>
        <Select
          value={inputs.unit}
          onValueChange={(val) => {
            // Reset sheet size on unit change
            setInputs((prev) => ({
              ...prev,
              unit: val as Unit,
              sheetSize: "",
            }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select unit system" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (meters, mm)</SelectItem>
            <SelectItem value="imperial">Imperial (feet, inches)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dimensions inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>
            <HardHat className="inline mr-1 mb-1" size={16} />
            Length ({inputs.unit === "metric" ? "m" : "ft"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={`Room length in ${inputs.unit === "metric" ? "meters" : "feet"}`}
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>
            <HardHat className="inline mr-1 mb-1" size={16} />
            Width ({inputs.unit === "metric" ? "m" : "ft"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={`Room width in ${inputs.unit === "metric" ? "meters" : "feet"}`}
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>
            <HardHat className="inline mr-1 mb-1" size={16} />
            Height ({inputs.unit === "metric" ? "m" : "ft"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={`Room height in ${inputs.unit === "metric" ? "meters" : "feet"}`}
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
          />
        </div>
      </div>

      {/* Sheet size selection */}
      <div className="space-y-2">
        <Label>
          <Box className="inline mr-1 mb-1" size={16} />
          Drywall Sheet Size
        </Label>
        <Select
          value={inputs.sheetSize}
          onValueChange={(val) => handleInputChange("sheetSize", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select drywall sheet size" />
          </SelectTrigger>
          <SelectContent>
            {SHEET_SIZES[inputs.unit].map((sheet) => (
              <SelectItem key={sheet.value} value={sheet.value}>
                {sheet.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Waste factor input */}
      <div className="space-y-2">
        <Label>
          <Calculator className="inline mr-1 mb-1" size={16} />
          Waste Percentage (%)
        </Label>
        <Input
          type="number"
          min={0}
          max={100}
          step="1"
          value={inputs.waste}
          onChange={(e) => handleInputChange("waste", e.target.value)}
          placeholder="Recommended 5-10%"
        />
      </div>

      {/* Price per sheet input */}
      <div className="space-y-2">
        <Label>
          <DollarSign className="inline mr-1 mb-1" size={16} />
          Price per Sheet (USD)
        </Label>
        <Input
          type="number"
          min={0}
          step="0.01"
          value={inputs.price}
          onChange={(e) => handleInputChange("price", e.target.value)}
          placeholder="Enter price per drywall sheet"
        />
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 flex items-center justify-center"
        onClick={() => {}}
        type="button"
      >
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.qty}
            </div>
            <div className="text-xl font-medium mb-2">Est. Cost: {results.cost}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{results.details}</div>
            {results.feedback && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                {results.feedback}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-10">
      <section id="how-to">
        <h2 className="text-2xl font-bold mb-4">How to use this calculator</h2>
        <p>
          Enter the room dimensions (length, width, and height) in your preferred unit system (metric or imperial).
          Select the drywall sheet size you plan to use. Input the waste percentage to account for material loss
          during installation (typically 5-10%). Finally, enter the price per drywall sheet to get an estimated total cost.
          Click "Calculate" to see the number of drywall sheets needed and the estimated cost.
        </p>
      </section>
      <section id="faq">
        <h2 className="text-2xl font-bold mb-4">FAQ</h2>
        {faqs.map(({ question, answer }, i) => (
          <div key={i} className="mb-4">
            <h3 className="font-semibold">{question}</h3>
            <p>{answer}</p>
          </div>
        ))}
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Drywall Sheet Count Calculator"
      description="Calculate the number of standard drywall sheets needed to cover walls and ceilings based on room dimensions."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      relatedCalculators={[]} // Empty for now to avoid broken links
      onThisPage={[
        { id: "how-to", label: "How to Use" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}