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

export default function DensityGPerMlKgPerM3Calculator() {
  // 1. STATE (CONVERTER PATTERN)
  // Units: g/mL and kg/m³
  // Default fromUnit: g/mL, toUnit: kg/m³
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("g/mL");
  const [toUnit, setToUnit] = useState("kg/m³");

  // 2. LOGIC ENGINE
  // Conversion logic:
  // 1 g/mL = 1000 kg/m³
  // So:
  // g/mL to kg/m³: multiply by 1000
  // kg/m³ to g/mL: divide by 1000
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: 0,
        label: "Enter a valid number...",
        formula: "",
      };
    }

    let result = 0;
    let formulaText = "";

    if (fromUnit === toUnit) {
      result = num;
      formulaText = `1 ${fromUnit} = 1 ${toUnit}`;
    } else if (fromUnit === "g/mL" && toUnit === "kg/m³") {
      result = num * 1000;
      formulaText = `1 g/mL = 1000 kg/m³`;
    } else if (fromUnit === "kg/m³" && toUnit === "g/mL") {
      result = num / 1000;
      formulaText = `1 kg/m³ = 0.001 g/mL`;
    } else {
      // Fallback (should not happen)
      result = 0;
      formulaText = "";
    }

    return {
      value: result.toLocaleString("en-US", {
        maximumFractionDigits: 6,
      }),
      label: `Result in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is density and why is it important?",
      answer:
        "Density is a physical property defined as mass per unit volume. It helps identify substances and is crucial in fields like chemistry, physics, and engineering to predict material behavior and design processes.",
    },
    {
      question: "Why convert between g/mL and kg/m³?",
      answer:
        "Grams per milliliter (g/mL) and kilograms per cubic meter (kg/m³) are common density units in different contexts. Converting between them ensures consistency in calculations and communication across scientific and industrial disciplines.",
    },
    {
      question: "How precise is this conversion?",
      answer:
        "The conversion factor between g/mL and kg/m³ is exact: 1 g/mL equals exactly 1000 kg/m³, based on the metric system definitions of mass and volume units.",
    },
    {
      question: "Can I convert other density units here?",
      answer:
        "This tool specifically converts between g/mL and kg/m³. For other units, please use dedicated converters designed for those units to ensure accuracy.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* INPUT SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">
            Value
          </Label>
          <Input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Enter number..."
            min="0"
            step="any"
          />
        </div>

        {/* Unit Selectors */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">
              From
            </Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="g/mL">grams per milliliter (g/mL)</SelectItem>
                <SelectItem value="kg/m³">kilograms per cubic meter (kg/m³)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ArrowRightLeft className="mb-3 text-slate-400 cursor-pointer" onClick={() => {
            // Swap units and recalc
            setFromUnit(toUnit);
            setToUnit(fromUnit);
          }} title="Swap units" />
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">
              To
            </Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="g/mL">grams per milliliter (g/mL)</SelectItem>
                <SelectItem value="kg/m³">kilograms per cubic meter (kg/m³)</SelectItem>
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
            // Just triggers recalculation by setting val to itself
            setVal((v) => v);
          }}
          aria-label="Convert density units"
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
      {val !== "" && !isNaN(parseFloat(val)) && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Converted Value
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
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
          Understanding Density: g/mL ↔ kg/m³ Conversion
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Density is a fundamental physical property that expresses the mass of a substance per unit volume. It is widely used in science and engineering to characterize materials and predict their behavior under various conditions. The units grams per milliliter (g/mL) and kilograms per cubic meter (kg/m³) are both metric units commonly used to measure density, but in different contexts.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Grams per milliliter is often used in chemistry and laboratory settings for liquids and small samples, while kilograms per cubic meter is more common in engineering, physics, and large-scale applications. Understanding how to convert between these units accurately is essential for ensuring consistency and precision in calculations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This converter tool simplifies the process by providing a precise, bidirectional conversion between g/mL and kg/m³. Since these units are directly related by a factor of 1000, the conversion is straightforward but critical for avoiding errors in scientific work.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this converter, simply enter the numeric value of the density you want to convert in the input field. Then select the unit you are converting from and the unit you want to convert to using the dropdown selectors. The tool supports conversion between grams per milliliter (g/mL) and kilograms per cubic meter (kg/m³).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Click the "Convert" button to see the converted value instantly. You can also use the swap icon between the unit selectors to quickly switch the conversion direction. If you want to start over, use the "Reset" button to clear the input.
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
              1 g/mL = 1000 kg/m³
            </p>
            <p className="text-slate-500 text-sm">
              This factor is derived from the metric definitions of grams, kilograms, milliliters, and cubic meters. Since 1 mL = 1 cm³ and 1 kg = 1000 g, the conversion factor between g/mL and kg/m³ is exactly 1000.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 kg/m³ = 0.001 g/mL
            </p>
            <p className="text-slate-500 text-sm">
              This is the inverse of the above factor, used when converting from kilograms per cubic meter back to grams per milliliter.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Density: g/mL ↔ kg/m³"
      description="Calculate density conversions. Transform grams per milliliter to kilograms per cubic meter for chemistry and physics calculations."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA
      formula={{
        title: "Conversion Formula",
        formula: results.formula || "Select units to see formula",
        variables: [{ symbol: "x", description: "Input Value" }],
      }}
      example={{
        title: "Example Conversion",
        scenario:
          "Convert 2.5 g/mL to kg/m³ to understand the density in engineering units.",
        steps: [
          {
            label: "1",
            explanation:
              "Multiply the value in g/mL by 1000 to convert to kg/m³.",
          },
          {
            label: "2",
            explanation: "2.5 g/mL × 1000 = 2500 kg/m³.",
          },
        ],
        result: "The density is 2500 kg/m³.",
      }}
      relatedCalculators={[
        {
          title: "Clock Time & Timezone Shift",
          url: "/conversion/clock-time-timezone-shift",
          icon: "🔄",
        },
        {
          title: "Binary ↔ Decimal prefixes (KiB ↔ KB)",
          url: "/conversion/binary-decimal-prefixes",
          icon: "📏",
        },
        {
          title: "Period ↔ Frequency",
          url: "/conversion/period-frequency",
          icon: "⚖️",
        },
        {
          title: "Checksum & Hash Quick Tools",
          url: "/conversion/checksum-hash-quick-tools",
          icon: "🌡️",
        },
        {
          title: "Torque: N·m ↔ lbf·ft",
          url: "/conversion/torque-nm-lbfft",
          icon: "📐",
        },
        {
          title: "Transfer Speed: Mbps ↔ MB/s",
          url: "/conversion/transfer-speed-mbps-mbs",
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