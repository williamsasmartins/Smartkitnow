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
import {
  ArrowRightLeft,
  Calculator,
  RotateCcw,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FuelEconomyLPer100kmMpgCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("L/100km");
  const [toUnit, setToUnit] = useState("mpg(US)");

  // 2. LOGIC
  // Conversion formulas:
  // L/100km to mpg(US): mpg = 235.214583 / L/100km
  // mpg(US) to L/100km: L/100km = 235.214583 / mpg
  // mpg(UK) uses a different factor: 282.480936

  // We'll support two mpg units: mpg(US) and mpg(UK)
  // Conversion factors:
  // 1 L/100km = 235.214583 mpg(US)
  // 1 L/100km = 282.480936 mpg(UK)

  const conversionFactors = {
    "L/100km": {
      "mpg(US)": (val: number) => 235.214583 / val,
      "mpg(UK)": (val: number) => 282.480936 / val,
      "L/100km": (val: number) => val,
    },
    "mpg(US)": {
      "L/100km": (val: number) => 235.214583 / val,
      "mpg(UK)": (val: number) => (val * 282.480936) / 235.214583,
      "mpg(US)": (val: number) => val,
    },
    "mpg(UK)": {
      "L/100km": (val: number) => 282.480936 / val,
      "mpg(US)": (val: number) => (val * 235.214583) / 282.480936,
      "mpg(UK)": (val: number) => val,
    },
  };

  // Formula text for display
  const formulaTexts = {
    "L/100km→mpg(US)": "mpg(US) = 235.214583 ÷ L/100km",
    "mpg(US)→L/100km": "L/100km = 235.214583 ÷ mpg(US)",
    "L/100km→mpg(UK)": "mpg(UK) = 282.480936 ÷ L/100km",
    "mpg(UK)→L/100km": "L/100km = 282.480936 ÷ mpg(UK)",
    "mpg(US)→mpg(UK)": "mpg(UK) = mpg(US) × 282.480936 ÷ 235.214583",
    "mpg(UK)→mpg(US)": "mpg(US) = mpg(UK) × 235.214583 ÷ 282.480936",
    "same": "No conversion needed",
  };

  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0)
      return {
        value: 0,
        label: "Enter a positive value...",
        formula: "Select units and enter a valid number",
      };

    if (fromUnit === toUnit) {
      return {
        value: num.toLocaleString(undefined, { maximumFractionDigits: 4 }),
        label: `Value in ${toUnit}`,
        formula: formulaTexts["same"],
      };
    }

    const convertFunc = conversionFactors[fromUnit]?.[toUnit];
    if (!convertFunc) {
      return {
        value: 0,
        label: "Conversion not supported",
        formula: "N/A",
      };
    }

    const result = convertFunc(num);
    const formulaKey = `${fromUnit}→${toUnit}`;
    const formulaText = formulaTexts[formulaKey] || "Conversion formula";

    return {
      value: result.toLocaleString(undefined, { maximumFractionDigits: 4 }),
      label: `Value in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why are there different mpg units (US vs UK)?",
      answer:
        "The difference between US and UK mpg units arises from the different gallon definitions used in each country. The US gallon is smaller (3.785 liters) compared to the UK gallon (4.546 liters), which means a vehicle rated at the same mpg number will have different fuel consumption implications depending on the gallon standard. This distinction is important when comparing fuel economy internationally to ensure accurate understanding and comparisons.",
    },
    {
      question: "Why is fuel economy expressed as L/100km in some countries and mpg in others?",
      answer:
        "Fuel economy is expressed as liters per 100 kilometers (L/100km) primarily in countries using the metric system, as it directly measures fuel consumed over a fixed distance. In contrast, miles per gallon (mpg) is used in countries like the United States and the United Kingdom, which use the imperial system, measuring distance per unit of fuel. Both units provide useful information but from inverse perspectives: L/100km indicates fuel used, while mpg indicates distance traveled per fuel unit.",
    },
    {
      question: "How accurate is this conversion tool for real-world fuel economy?",
      answer:
        "This conversion tool provides precise mathematical conversions between fuel economy units based on standard definitions of gallons and kilometers. However, real-world fuel economy can vary due to driving habits, vehicle condition, and environmental factors, so the converted values should be considered estimates rather than exact measurements. For practical purposes, this tool helps compare and understand fuel consumption ratings across different unit systems effectively.",
    },
    {
      question: "Can I convert values less than 1 or very large values using this tool?",
      answer:
        "Yes, this tool supports converting any positive numeric value, including those less than 1 or very large numbers, as long as they are valid inputs. The conversion formulas are mathematically sound for all positive values, ensuring accurate results regardless of scale. However, extremely small or large values might be less common in typical fuel economy contexts but are still handled correctly by the calculator.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const units = [
    { value: "L/100km", label: "Liters per 100 km (L/100km)" },
    { value: "mpg(US)", label: "Miles per Gallon (US)" },
    { value: "mpg(UK)", label: "Miles per Gallon (UK)" },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">Value</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Enter number..."
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ArrowRightLeft className="mb-3 text-slate-400" />
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">To</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting val to current val (no-op)
            setVal((v) => v);
          }}
          aria-label="Convert fuel economy units"
        >
          <Calculator className="mr-2 h-4 w-4" /> Convert
        </Button>
        <Button
          variant="outline"
          onClick={() => setVal("")}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset input"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Converted Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              <p className="text-xs text-slate-500 mt-4 font-mono bg-white/50 dark:bg-black/20 inline-block px-3 py-1 rounded">
                Factor: {results.formula}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Fuel Economy: L/100km ↔ mpg
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Fuel economy is a critical metric that indicates how efficiently a vehicle uses fuel to travel a certain distance. Different regions use different units to express fuel economy, with Liters per 100 kilometers (L/100km) commonly used in metric countries and miles per gallon (mpg) used in the United States and the United Kingdom. Understanding how to convert between these units allows consumers and professionals to compare vehicle efficiency accurately across different measurement systems.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The L/100km unit measures fuel consumption directly, indicating how many liters of fuel are needed to travel 100 kilometers. Conversely, mpg measures how many miles a vehicle can travel on one gallon of fuel, which is an inverse relationship to L/100km. This calculator facilitates precise conversions between these units, including distinctions between US and UK gallons, ensuring clarity and accuracy in fuel economy comparisons.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this converter, enter the numeric value of the fuel economy you want to convert in the input field. Next, select the unit of the value you entered from the "From" dropdown menu, and then select the unit you want to convert to from the "To" dropdown menu. Finally, click the "Convert" button to see the converted result displayed clearly below, along with the formula used for the conversion.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="factors" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Common Conversion Factors
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Liters per 100 km to Miles per Gallon (US)
            </p>
            <p className="text-slate-500 text-sm">
              1 L/100km = 235.214583 mpg (US)
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Liters per 100 km to Miles per Gallon (UK)
            </p>
            <p className="text-slate-500 text-sm">
              1 L/100km = 282.480936 mpg (UK)
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Miles per Gallon (US) to Miles per Gallon (UK)
            </p>
            <p className="text-slate-500 text-sm">
              1 mpg (US) = 0.832674 mpg (UK)
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fuel Economy: L/100km ↔ mpg"
      description="Convert fuel consumption ratings. Switch between Liters per 100km (L/100km) and Miles Per Gallon (MPG) for vehicle efficiency."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ FIX: VARIABLES MUST NOT BE EMPTY
      formula={{
        title: "Conversion Formula",
        formula: results.formula || "Select units",
        variables: [
          {
            symbol: "Input",
            description: "Value in " + fromUnit,
          },
          {
            symbol: "Result",
            description: "Value converted to " + toUnit,
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Convert a fuel economy rating of 8.5 L/100km to miles per gallon (US).",
        steps: [
          {
            label: "1",
            explanation:
              "Use the formula mpg(US) = 235.214583 ÷ L/100km. Substitute 8.5 for L/100km.",
          },
          {
            label: "2",
            explanation:
              "Calculate 235.214583 ÷ 8.5 = 27.6747 mpg (US). This means the vehicle travels approximately 27.67 miles per gallon.",
          },
        ],
        result: "27.6747 mpg (US)",
      }}
      relatedCalculators={[
        {
          title: "Length: m ↔ ft ↔ in",
          url: "/conversion/length-m-ft-in",
          icon: "📏",
        },
        {
          title: "Torque: N·m ↔ lbf·ft",
          url: "/conversion/torque-nm-lbfft",
          icon: "📏",
        },
        {
          title: "Currency: FX quick convert",
          url: "/conversion/currency-fx-quick-convert",
          icon: "⚖️",
        },
        {
          title: "Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB",
          url: "/conversion/bytes-b-kb-mb-gb-tb",
          icon: "💾",
        },
        {
          title: "Area: m² ↔ ft²",
          url: "/conversion/area-m2-ft2",
          icon: "📐",
        },
        {
          title: "Compression Ratio & Size",
          url: "/conversion/compression-ratio-size",
          icon: "⏱️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Conversion" },
        { id: "how-to-use", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "factors", label: "Common Factors" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}