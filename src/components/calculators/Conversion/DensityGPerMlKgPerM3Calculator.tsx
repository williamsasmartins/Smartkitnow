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
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("g/mL");
  const [toUnit, setToUnit] = useState("kg/m³");

  // 2. LOGIC
  // Conversion factors between units:
  // 1 g/mL = 1000 kg/m³
  // So conversion:
  // g/mL to kg/m³: multiply by 1000
  // kg/m³ to g/mL: divide by 1000
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: "",
        label: "Enter a value...",
        formula: "Select units",
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
      // fallback, should never happen with current units
      result = 0;
      formulaText = "Conversion not supported";
    }

    return {
      value: result.toLocaleString(undefined, {
        maximumFractionDigits: 6,
      }),
      label: `Value in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is density and why is it important?",
      answer:
        "Density is a physical property that measures the mass of a substance per unit volume, typically expressed in units like grams per milliliter or kilograms per cubic meter. It is crucial in fields such as chemistry, physics, and engineering because it helps identify substances and predict their behavior under different conditions. Understanding density allows scientists and engineers to design materials and processes efficiently and safely.",
    },
    {
      question: "Why do we convert between g/mL and kg/m³?",
      answer:
        "Grams per milliliter (g/mL) and kilograms per cubic meter (kg/m³) are both units used to express density but in different measurement systems and scales. Converting between these units is essential for consistency when working across scientific disciplines or industries that prefer one unit over the other. This conversion ensures accurate communication, calculation, and comparison of density values worldwide.",
    },
    {
      question: "How do I use this density converter effectively?",
      answer:
        "To use this converter, enter the numeric value of the density you want to convert in the input field. Then select the unit of the value you entered (either g/mL or kg/m³) in the 'From' dropdown, and select the unit you want to convert to in the 'To' dropdown. Finally, click the 'Convert' button to see the converted result along with the conversion factor used.",
    },
    {
      question: "Are there any limitations to this conversion tool?",
      answer:
        "This tool is designed specifically for converting density values between grams per milliliter and kilograms per cubic meter, which are directly related by a factor of 1000. It does not support other density units or complex conversions involving temperature or pressure changes. For more advanced conversions, specialized tools or formulas considering those factors should be used.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const units = [
    { value: "g/mL", label: "grams per milliliter (g/mL)" },
    { value: "kg/m³", label: "kilograms per cubic meter (kg/m³)" },
  ];

  const widget = (
    <div className="space-y-6">
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
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">
              To
            </Label>
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
            // No extra action needed, conversion is reactive
          }}
          disabled={val.trim() === "" || isNaN(parseFloat(val))}
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
      {results.value !== "" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Converted Result
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
          Understanding Density: g/mL ↔ kg/m³
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Density is a fundamental physical property that quantifies the mass of
          a substance per unit volume. It is commonly expressed in units such as
          grams per milliliter (g/mL) and kilograms per cubic meter (kg/m³),
          which are widely used in scientific and engineering disciplines. Being
          able to convert accurately between these units is essential for
          consistency in measurements and calculations across various fields.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The relationship between g/mL and kg/m³ is straightforward: 1 g/mL is
          exactly equal to 1000 kg/m³. This is because 1 gram equals 0.001
          kilograms and 1 milliliter equals 0.000001 cubic meters, making the
          conversion factor 1000. Understanding this conversion helps in
          interpreting density data correctly, whether in laboratory settings or
          industrial applications.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this density converter, start by entering the numeric value of
          the density you wish to convert in the input field. Next, select the
          unit of the value you entered from the 'From' dropdown menu, choosing
          either grams per milliliter (g/mL) or kilograms per cubic meter
          (kg/m³). Then, select the desired output unit from the 'To' dropdown,
          and click the 'Convert' button to see the converted result displayed
          below along with the conversion factor used.
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
              Density Conversion Between g/mL and kg/m³
            </p>
            <p className="text-slate-500 text-sm">
              1 gram per milliliter (g/mL) = 1000 kilograms per cubic meter
              (kg/m³)
            </p>
            <p className="text-slate-500 text-sm">
              1 kilogram per cubic meter (kg/m³) = 0.001 grams per milliliter
              (g/mL)
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
          "Convert a density of 2.5 g/mL to kilograms per cubic meter (kg/m³).",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the conversion factor: 1 g/mL = 1000 kg/m³.",
          },
          {
            label: "2",
            explanation:
              "Multiply the input value by the conversion factor: 2.5 × 1000 = 2500.",
          },
          {
            label: "3",
            explanation:
              "The result is 2500 kg/m³, which is the equivalent density.",
          },
        ],
        result: "2.5 g/mL = 2500 kg/m³",
      }}
      relatedCalculators={[
        {
          title: "Work & Potential Energy",
          url: "/conversion/work-potential-energy",
          icon: "🔄",
        },
        {
          title: "Temperature: °C ↔ °F ↔ K",
          url: "/conversion/temperature-c-f-k",
          icon: "🌡️",
        },
        { title: "Frame Rate: fps ↔ Hz", url: "/conversion/frame-rate-fps-hz", icon: "⚖️" },
        {
          title: "Checksum & Hash Quick Tools",
          url: "/conversion/checksum-hash-quick-tools",
          icon: "🌡️",
        },
        {
          title: "Clock Time & Timezone Shift",
          url: "/conversion/clock-time-timezone-shift",
          icon: "📐",
        },
        {
          title: "Fuel Economy: L/100km ↔ mpg",
          url: "/conversion/fuel-economy-l-per-100km-mpg",
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