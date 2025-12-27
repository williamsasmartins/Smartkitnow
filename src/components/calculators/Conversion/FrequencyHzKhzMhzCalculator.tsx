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

const units = [
  { label: "Hertz (Hz)", value: "Hz", factor: 1 },
  { label: "Kilohertz (kHz)", value: "kHz", factor: 1e3 },
  { label: "Megahertz (MHz)", value: "MHz", factor: 1e6 },
];

export default function FrequencyHzKhzMhzCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("Hz");
  const [toUnit, setToUnit] = useState("kHz");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: "",
        label: "Enter a value...",
        formula: "Select units to see conversion factor",
      };
    }

    const from = units.find((u) => u.value === fromUnit);
    const to = units.find((u) => u.value === toUnit);

    if (!from || !to) {
      return {
        value: "",
        label: "Select valid units",
        formula: "Select units to see conversion factor",
      };
    }

    // Convert input value to base unit (Hz)
    const valueInHz = num * from.factor;
    // Convert base unit to target unit
    const convertedValue = valueInHz / to.factor;

    // Format result with up to 9 decimals, trimming trailing zeros
    const formattedValue = convertedValue
      .toLocaleString(undefined, {
        maximumFractionDigits: 9,
      })
      .replace(/\.?0+$/, "");

    // Formula text example: "1 kHz = 1000 Hz"
    const formulaText = `1 ${from.value} = ${
      from.factor / to.factor
    } ${to.value}`;

    return {
      value: formattedValue,
      label: `Value in ${to.label}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is frequency and why is it measured in Hz, kHz, and MHz?",
      answer:
        "Frequency represents how often a repeating event occurs per second, measured in Hertz (Hz). Kilohertz (kHz) and Megahertz (MHz) are multiples of Hertz used to express higher frequencies conveniently. These units are essential in fields like audio engineering and radio communications to describe signal oscillations accurately.",
    },
    {
      question: "How do I convert between Hz, kHz, and MHz accurately?",
      answer:
        "To convert between these units, multiply or divide by powers of 1,000 since 1 kHz equals 1,000 Hz and 1 MHz equals 1,000,000 Hz. This converter automates the process by converting your input to the base unit (Hz) and then to the desired unit, ensuring precise and reliable results. Always double-check your input and selected units to avoid errors.",
    },
    {
      question: "Why does the conversion factor change depending on the units selected?",
      answer:
        "The conversion factor depends on the relative sizes of the units involved. Since kHz and MHz are multiples of Hz by factors of 1,000 and 1,000,000 respectively, the factor reflects how many of one unit fit into another. Understanding this relationship helps in interpreting the formula and ensuring correct conversions.",
    },
    {
      question: "Can this tool be used for frequencies outside the Hz to MHz range?",
      answer:
        "This converter is specifically designed for Hz, kHz, and MHz units, which cover a broad range of frequencies commonly used in audio and radio applications. For frequencies outside this range, such as GHz or lower than Hz, specialized converters or tools should be used. Always ensure your frequency values and units are appropriate for your specific application.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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
            inputMode="decimal"
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
            // No additional action needed since conversion is live
          }}
          aria-label="Convert frequency units"
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
          Understanding Frequency: Hz ↔ kHz ↔ MHz
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Frequency is a fundamental physical quantity that measures how often a
          repeating event occurs per second, expressed in Hertz (Hz). In many
          scientific and engineering contexts, especially in audio and radio
          frequency applications, larger units like Kilohertz (kHz) and Megahertz
          (MHz) are used for convenience to represent thousands and millions of
          cycles per second respectively. Understanding these units and their
          relationships is essential for accurate measurement and communication of
          frequency values.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The Hertz unit is the base unit of frequency in the International System
          of Units (SI), named after the physicist Heinrich Hertz. Kilohertz and
          Megahertz are derived units, where 1 kHz equals 1,000 Hz and 1 MHz equals
          1,000,000 Hz. This hierarchical structure allows for easy scaling and
          conversion between different magnitudes of frequency.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To convert a frequency value, enter the numeric value in the input field,
          then select the unit you are converting from and the unit you want to
          convert to using the dropdown selectors. The conversion is calculated
          automatically and displayed below, along with the conversion factor used
          for transparency. Use the reset button to clear your input and start a new
          conversion at any time.
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

      {/* 8. REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          
          <li>
            <a href="https://www.nist.gov/search?s=Frequency%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Frequency Conversion - NIST
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Official guide and standards for Frequency Conversion from the National Institute of Standards and Technology.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Frequency%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Frequency Conversion - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Learn the math and science behind Frequency Conversion with free interactive lessons and videos from Khan Academy.
            </p>
          </li>
          <li>
            <a href="https://www.calculator.net/search?q=Frequency%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Frequency Conversion - Calculator.net
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Compare results and explore alternative calculation methods for Frequency Conversion on Calculator.net.
            </p>
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Frequency%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Frequency Conversion - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Detailed encyclopedia article covering the history, standards, and usage of Frequency Conversion.
            </p>
          </li>
        </ul>
      </section>

      <section id="factors" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Common Conversion Factors
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Hertz to Kilohertz
            </p>
            <p className="text-slate-500 text-sm">1 Hz = 0.001 kHz</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Kilohertz to Hertz
            </p>
            <p className="text-slate-500 text-sm">1 kHz = 1,000 Hz</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Kilohertz to Megahertz
            </p>
            <p className="text-slate-500 text-sm">1 kHz = 0.001 MHz</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Megahertz to Kilohertz
            </p>
            <p className="text-slate-500 text-sm">1 MHz = 1,000 kHz</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Hertz to Megahertz
            </p>
            <p className="text-slate-500 text-sm">1 Hz = 0.000001 MHz</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Megahertz to Hertz
            </p>
            <p className="text-slate-500 text-sm">1 MHz = 1,000,000 Hz</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Frequency: Hz ↔ kHz ↔ MHz"
      description="Convert frequency units. Switch between Hertz (Hz), Kilohertz (kHz), and Megahertz (MHz) for audio and electronics."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ FIX: VARIABLES MUST NOT BE EMPTY
      formula={{
        title: "Conversion Formula",
        formula: results.formula || "Select units to see conversion factor",
        variables: [
          {
            symbol: "Input",
            description: `Value in ${units.find((u) => u.value === fromUnit)?.label || fromUnit}`,
          },
          {
            symbol: "Result",
            description: `Value converted to ${units.find((u) => u.value === toUnit)?.label || toUnit}`,
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Convert 2500 Hz to kHz to understand how the units relate in practical terms.",
        steps: [
          {
            label: "1",
            explanation:
              "Start with the input value: 2500 Hz. Since 1 kHz equals 1000 Hz, divide 2500 by 1000.",
          },
          {
            label: "2",
            explanation:
              "Perform the division: 2500 ÷ 1000 = 2.5. This means 2500 Hz is equivalent to 2.5 kHz.",
          },
        ],
        result: "Therefore, 2500 Hz = 2.5 kHz.",
      }}
      relatedCalculators={[
        {
          title: "Speed: m/s ↔ km/h ↔ mph",
          url: "/conversion/speed-mps-kmph-mph",
          icon: "🔄",
        },
        {
          title: "Time: ms ↔ s ↔ min ↔ hr",
          url: "/conversion/time-ms-s-min-hr",
          icon: "📏",
        },
        {
          title: "Length: m ↔ ft ↔ in",
          url: "/conversion/length-m-ft-in",
          icon: "📏",
        },
        {
          title: "Energy: J ↔ cal ↔ kWh",
          url: "/conversion/energy-j-cal-kwh",
          icon: "🌡️",
        },
        {
          title: "Power: W ↔ hp",
          url: "/conversion/power-w-hp",
          icon: "📐",
        },
        {
          title: "Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB",
          url: "/conversion/bytes-b-kb-mb-gb-tb",
          icon: "💾",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Conversion" },
        { id: "how-to-use", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "factors", label: "Common Factors" },
        { id: "references", label: "References & Resources" },
]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}