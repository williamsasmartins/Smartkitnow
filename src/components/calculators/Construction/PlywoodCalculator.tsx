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

export default function PlywoodCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    width: "",
    waste: "10", // waste percentage
    price: "",
    materialSize: "standard", // standard or large sheet size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Constants for sheet sizes in meters and feet
  // Standard plywood sheet sizes:
  // Metric standard: 1.22m x 2.44m (4ft x 8ft)
  // Large size: 1.52m x 3.05m (5ft x 10ft)
  const sheetSizes = {
    metric: {
      standard: { length: 2.44, width: 1.22 }, // meters
      large: { length: 3.05, width: 1.52 },
    },
    imperial: {
      standard: { length: 8, width: 4 }, // feet
      large: { length: 10, width: 5 },
    },
  };

  // Calculate required sheets based on inputs
  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const wastePercent = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    if (
      isNaN(lengthNum) ||
      lengthNum <= 0 ||
      isNaN(widthNum) ||
      widthNum <= 0 ||
      isNaN(wastePercent) ||
      wastePercent < 0 ||
      wastePercent > 25
    ) {
      return {
        mainQty: "0 Sheets",
        cost: "$0.00",
        details: "Invalid input values",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Get sheet size for selected unit and material size
    const sheet = sheetSizes[inputs.unit][inputs.materialSize];

    // Calculate total area needed
    // length and width are area dimensions to cover (floor, wall, etc)
    // area = length * width
    const totalArea = lengthNum * widthNum;

    // Calculate number of sheets needed without waste
    const sheetArea = sheet.length * sheet.width;

    let sheetsNeeded = totalArea / sheetArea;

    // Add waste margin
    sheetsNeeded *= 1 + wastePercent / 100;

    // Round up to nearest whole sheet
    const sheetsRounded = Math.ceil(sheetsNeeded);

    // Calculate cost if price per sheet is provided
    const cost = priceNum && priceNum > 0 ? sheetsRounded * priceNum : 0;

    return {
      mainQty: `${sheetsRounded} Sheet${sheetsRounded > 1 ? "s" : ""}`,
      cost: cost > 0 ? `$${cost.toFixed(2)}` : "N/A",
      details: `Raw sheets needed: ${sheetsNeeded.toFixed(2)}`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "How do I calculate the number of plywood sheets I need?",
      answer: "To calculate plywood sheets needed, measure your total square footage and divide by the area of one sheet. Standard 4'×8' plywood sheets cover 32 square feet each, so a 400 square foot project would require approximately 12.5 sheets (rounded to 13). Always round up to account for waste and cutting losses, which typically amount to 5-10% of your total material.",
    },
    {
      question: "What is the standard size of a plywood sheet?",
      answer: "The most common plywood sheet size is 4 feet wide by 8 feet long (4'×8'), which equals 32 square feet per sheet. Other available sizes include 4'×10' (40 sq ft) and 4'×6' (24 sq ft), though these are less commonly stocked. Half sheets measuring 2'×8' (16 sq ft) are also available at most building supply stores for smaller projects.",
    },
    {
      question: "How much does a sheet of plywood weigh?",
      answer: "A standard 4'×8' sheet of 3/4-inch plywood typically weighs between 48-55 pounds, while 1/2-inch plywood weighs 35-42 pounds. The exact weight varies based on the plywood grade and wood species used. For structural calculations or transportation planning, always check the manufacturer's specifications for the specific product you're purchasing.",
    },
    {
      question: "What waste factor should I use when calculating plywood?",
      answer: "Industry standard recommends adding 5-10% waste to your plywood calculations to account for cutting, mistakes, and damaged pieces. For complex layouts with many angles or detailed cuts, increase this to 10-15%. For simple rectangular projects with minimal cutting, 5% waste is typically sufficient to ensure you have enough material to complete the project.",
    },
    {
      question: "How do I measure my area for the plywood calculator?",
      answer: "Measure the length and width of each section in feet, then multiply to get square footage. For example, a wall measuring 16 feet wide by 8 feet tall equals 128 square feet. Break complex shapes into rectangles, calculate each separately, then add all sections together for your total square footage before entering into the calculator.",
    },
    {
      question: "What plywood thickness should I use for my project?",
      answer: "Common plywood thicknesses are 1/4-inch (underlayment), 3/8-inch (walls), 1/2-inch (subfloors), and 3/4-inch (structural/heavy-duty applications). Building codes typically require 1/2-inch minimum for subfloors spanning 16-inch joist spacing and 3/4-inch for 24-inch spacing. Always verify local building codes and consult structural requirements for your specific application.",
    },
    {
      question: "Should I account for door and window openings in my calculation?",
      answer: "Yes, subtract the square footage of large openings like doors and windows from your total area to avoid purchasing excess material. A standard 36-inch door opening is 3 feet wide by 6.75 feet tall (approximately 20 square feet), while a typical window is 3'×4' (12 square feet). However, if openings are smaller than one sheet, still purchase full sheets as you cannot use partial sheets elsewhere.",
    },
    {
      question: "What is the cost difference between plywood grades?",
      answer: "As of 2024-2025, CDX plywood (construction grade) costs approximately $35-45 per sheet, BC plywood runs $50-65 per sheet, and AC plywood (premium exterior) ranges from $70-95 per sheet depending on location and supplier. Prices fluctuate based on lumber market conditions, with typical variance of 15-20% seasonally. Always get current quotes from local suppliers as prices vary significantly by region.",
    },
    {
      question: "How do I convert plywood coverage to linear feet?",
      answer: "To convert square footage to linear feet of plywood coverage, divide your total square feet by the width of coverage you need. For example, if you need 128 square feet of coverage and each sheet is 4 feet wide, you'd need 32 linear feet of material (128 ÷ 4 = 32). This is useful when calculating materials for applications like siding or continuous wall coverage where linear measurement is more practical.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a plywood subfloor for a room measuring 5 meters by 4 meters using standard metric plywood sheets (1.22m x 2.44m). You want to include a 10% waste margin to account for cutting and fitting.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate the total area: 5m × 4m = 20 square meters.",
      },
      {
        label: "2. Calculate Sheets Needed",
        explanation:
          "Each standard sheet covers 1.22m × 2.44m = 2.9768 square meters. Sheets needed without waste: 20 ÷ 2.9768 ≈ 6.72 sheets.",
      },
      {
        label: "3. Add Waste",
        explanation:
          "Add 10% waste margin: 6.72 × 1.10 = 7.39 sheets.",
      },
      {
        label: "4. Order",
        explanation:
          "Round up to nearest whole sheet: 8 sheets to order.",
      },
    ],
    result: "Final Order: 8 Standard Sheets",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Sheets Needed = (Area to Cover) / (Sheet Area) × (1 + Waste Percentage)",
    variables: [
      { symbol: "Area to Cover", description: "Length × Width of the project area" },
      { symbol: "Sheet Area", description: "Length × Width of one plywood sheet" },
      { symbol: "Waste Percentage", description: "Additional percentage to cover waste (e.g., 0.10 for 10%)" },
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
            placeholder={`e.g. ${inputs.unit === "metric" ? "5" : "16"}`}
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
            placeholder={`e.g. ${inputs.unit === "metric" ? "4" : "13"}`}
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sheet Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">
                Standard ({inputs.unit === "metric" ? "1.22m x 2.44m" : "4ft x 8ft"})
              </SelectItem>
              <SelectItem value="large">
                Large ({inputs.unit === "metric" ? "1.52m x 3.05m" : "5ft x 10ft"})
              </SelectItem>
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Plywood Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Plywood Calculator helps you determine exactly how many sheets of plywood you need for your construction or renovation project. Whether you're building a subfloor, wall sheathing, roof deck, or other structural application, this tool eliminates guesswork and helps you purchase the right quantity of material. Accurate calculations prevent both material waste and costly project delays from running short.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your project's total square footage—measure the length and width of each section in feet and multiply them together. You'll also specify your desired plywood sheet size (the standard 4'×8' is most common), thickness (typically 1/2-inch to 3/4-inch for structural work), and your waste factor (industry standard is 5-10%). The calculator then divides your total square footage by the coverage per sheet and applies your waste percentage.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show the total number of sheets needed, total square footage of material, estimated weight, and cost projection based on current market pricing. Use the sheet count to purchase your materials and the weight estimate for transportation planning. The cost range provides a ballpark budget, but always confirm current prices with local suppliers since plywood prices fluctuate seasonally and by region, with typical variations of 10-20% throughout the year.</p>
        </div>
      </section>

      {/* TABLE: Standard Plywood Sheet Sizes and Coverage */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Standard Plywood Sheet Sizes and Coverage</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the most common plywood dimensions available and their corresponding square footage per sheet.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dimension</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Square Feet</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight (3/4" CDX)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Range (2024-2025)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4' × 6'</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$26–$34</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4' × 8'</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$35–$45</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4' × 10'</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$44–$56</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2' × 8' (half sheet)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$18–$23</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Prices vary by region, supplier, and market conditions. Weight shown is for standard CDX construction-grade plywood at 3/4-inch thickness.</p>
      </section>

      {/* TABLE: Plywood Thickness and Application Guide */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Plywood Thickness and Application Guide</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different thicknesses serve different purposes; this table matches thickness to common construction applications.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Thickness</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Common Uses</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Joist Spacing</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Cost/Sheet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1/4"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Underlayment, backing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$18–$26</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3/8"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Walls, siding base</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12–16 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$24–$32</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1/2"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Subfloors, roofing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$28–$38</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5/8"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Structural subfloors</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$32–$42</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3/4"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heavy-duty structural</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$35–$48</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Joist spacing requirements follow standard building codes for residential applications. Consult local codes for specific requirements.</p>
      </section>

      {/* TABLE: Plywood Grade Ratings and Characteristics */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Plywood Grade Ratings and Characteristics</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Plywood grades indicate surface quality and intended use; this table compares the most common grades available.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Grade</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Appearance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best For</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Durability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">CDX</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rough, knots visible</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Construction, structural</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Interior/protected exterior</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">BC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">One smooth side</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Walls, subflooring</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Interior/protected exterior</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">AC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Both sides finished</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Shelving, cabinets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Interior use</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">ACX</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Both sides finished</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exterior siding, trim</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exterior/weather resistant</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Marine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High-quality veneer</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Boats, wet environments</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maximum durability</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">CDX is the most economical choice for structural work; AC and ACX grades cost 50–100% more but offer better appearance.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always add at least 5-10% waste factor to your calculations to account for cutting mistakes, damaged pieces, and edge losses. For complex layouts with angled cuts or detailed designs, increase this to 10-15% to ensure you don't run short mid-project.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Purchase your plywood from the same supplier and as close to the project start date as possible, since prices can fluctuate 15-20% seasonally. Spring (March-May) typically sees higher prices due to increased building activity, while winter months often offer better deals.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Stack and store plywood flat on level ground with adequate air circulation underneath to prevent warping and moisture absorption. Never store plywood outdoors without protection, as weather exposure can degrade the material and increase swelling, making installation difficult.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">For subfloor applications, verify local building codes for required thickness based on your joist spacing—most jurisdictions require minimum 1/2-inch for 16-inch spacing and 3/4-inch for 24-inch spacing. Undersized material can lead to squeaking floors, code violations, and structural issues.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to subtract window and door openings</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many DIYers calculate full wall area without deducting large openings, resulting in purchasing 10-20% more material than necessary. While small openings (&lt;4 sq ft) shouldn't be subtracted since you can't use the waste, large doors and windows should definitely be removed from your total area calculation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for waste and cutting losses</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating exact square footage without adding waste factor leads to running short, especially on complex projects with many angles or cuts. The industry standard 5-10% waste factor accounts for mistakes, damaged edges, and trim pieces that don't fit perfectly—skipping this is one of the most common reasons projects stall mid-construction.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Choosing the wrong plywood thickness</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using 1/2-inch plywood for 24-inch joist spacing violates building codes and causes floor squeaking and structural deflection over time. Always verify your local building code requirements—most jurisdictions require 3/4-inch minimum for 24-inch spacing, adding approximately $10-15 per sheet to your budget.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring plywood grade requirements for the application</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Purchasing exterior-grade (ACX) plywood for interior walls wastes $20-40 per sheet, while using interior CDX plywood outdoors causes rot and delamination within 2-3 years. Match your grade to your specific application: CDX for protected interior/structural work, and ACX/Marine grades only for exterior exposure.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the number of plywood sheets I need?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To calculate plywood sheets needed, measure your total square footage and divide by the area of one sheet. Standard 4'×8' plywood sheets cover 32 square feet each, so a 400 square foot project would require approximately 12.5 sheets (rounded to 13). Always round up to account for waste and cutting losses, which typically amount to 5-10% of your total material.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard size of a plywood sheet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The most common plywood sheet size is 4 feet wide by 8 feet long (4'×8'), which equals 32 square feet per sheet. Other available sizes include 4'×10' (40 sq ft) and 4'×6' (24 sq ft), though these are less commonly stocked. Half sheets measuring 2'×8' (16 sq ft) are also available at most building supply stores for smaller projects.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does a sheet of plywood weigh?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A standard 4'×8' sheet of 3/4-inch plywood typically weighs between 48-55 pounds, while 1/2-inch plywood weighs 35-42 pounds. The exact weight varies based on the plywood grade and wood species used. For structural calculations or transportation planning, always check the manufacturer's specifications for the specific product you're purchasing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What waste factor should I use when calculating plywood?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Industry standard recommends adding 5-10% waste to your plywood calculations to account for cutting, mistakes, and damaged pieces. For complex layouts with many angles or detailed cuts, increase this to 10-15%. For simple rectangular projects with minimal cutting, 5% waste is typically sufficient to ensure you have enough material to complete the project.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure my area for the plywood calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure the length and width of each section in feet, then multiply to get square footage. For example, a wall measuring 16 feet wide by 8 feet tall equals 128 square feet. Break complex shapes into rectangles, calculate each separately, then add all sections together for your total square footage before entering into the calculator.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What plywood thickness should I use for my project?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Common plywood thicknesses are 1/4-inch (underlayment), 3/8-inch (walls), 1/2-inch (subfloors), and 3/4-inch (structural/heavy-duty applications). Building codes typically require 1/2-inch minimum for subfloors spanning 16-inch joist spacing and 3/4-inch for 24-inch spacing. Always verify local building codes and consult structural requirements for your specific application.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I account for door and window openings in my calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, subtract the square footage of large openings like doors and windows from your total area to avoid purchasing excess material. A standard 36-inch door opening is 3 feet wide by 6.75 feet tall (approximately 20 square feet), while a typical window is 3'×4' (12 square feet). However, if openings are smaller than one sheet, still purchase full sheets as you cannot use partial sheets elsewhere.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the cost difference between plywood grades?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">As of 2024-2025, CDX plywood (construction grade) costs approximately $35-45 per sheet, BC plywood runs $50-65 per sheet, and AC plywood (premium exterior) ranges from $70-95 per sheet depending on location and supplier. Prices fluctuate based on lumber market conditions, with typical variance of 15-20% seasonally. Always get current quotes from local suppliers as prices vary significantly by region.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I convert plywood coverage to linear feet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To convert square footage to linear feet of plywood coverage, divide your total square feet by the width of coverage you need. For example, if you need 128 square feet of coverage and each sheet is 4 feet wide, you'd need 32 linear feet of material (128 ÷ 4 = 32). This is useful when calculating materials for applications like siding or continuous wall coverage where linear measurement is more practical.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.apawood.org/plywood-standards" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">APA – The Engineered Wood Association Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official standards and specifications for plywood grades, sizes, and performance ratings used in construction.</p>
          </li>
          <li>
            <a href="https://www.iccsafe.org/products-and-services/i-codes/2024-i-codes/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Building Code (IBC) Residential Section</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Current building code requirements for plywood thickness, spacing, and structural applications in residential construction.</p>
          </li>
          <li>
            <a href="https://www.nahb.org/research-and-economics/housing-research/research-base/building-science" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Association of Home Builders Construction Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Best practices and recommendations for plywood selection, installation, and material specifications in home construction projects.</p>
          </li>
          <li>
            <a href="https://www.fs.usda.gov/research/pubs/psw_gtr249" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Lumber Price Index – Forest Service Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Government lumber pricing data and historical trends for construction materials including plywood market analysis.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Plywood Calculator"
      description="The ultimate professional guide and calculator for Plywood Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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