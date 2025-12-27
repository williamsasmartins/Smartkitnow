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

const AREA_UNITS = [
  { value: "m2", label: "Square meters (m²)" },
  { value: "ft2", label: "Square feet (ft²)" },
];

const CONVERSION_FACTORS: Record<string, number> = {
  // base unit: m²
  m2: 1,
  ft2: 0.09290304, // 1 ft² = 0.09290304 m²
};

export default function AreaM2Ft2Calculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("m2");
  const [toUnit, setToUnit] = useState("ft2");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: "",
        label: "Enter a value to convert",
        formula: "Select units",
      };
    }
    if (fromUnit === toUnit) {
      return {
        value: num.toLocaleString(undefined, { maximumFractionDigits: 6 }),
        label: `Result in ${AREA_UNITS.find((u) => u.value === toUnit)?.label}`,
        formula: `1 ${AREA_UNITS.find((u) => u.value === fromUnit)?.label} = 1 ${AREA_UNITS.find((u) => u.value === toUnit)?.label}`,
      };
    }

    // Convert input to m² first
    const valInM2 = num * CONVERSION_FACTORS[fromUnit];
    // Convert m² to target unit
    const resultNum = valInM2 / CONVERSION_FACTORS[toUnit];

    // Formula text
    const formulaText = `1 ${AREA_UNITS.find((u) => u.value === fromUnit)?.label} = ${(CONVERSION_FACTORS[fromUnit] / CONVERSION_FACTORS[toUnit]).toFixed(6)} ${AREA_UNITS.find((u) => u.value === toUnit)?.label}`;

    return {
      value: resultNum.toLocaleString(undefined, { maximumFractionDigits: 6 }),
      label: `Result in ${AREA_UNITS.find((u) => u.value === toUnit)?.label}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why is it important to convert between square meters and square feet accurately?",
      answer:
        "Accurate conversion between square meters and square feet is essential in fields like real estate, construction, and land surveying to ensure precise measurements and avoid costly mistakes. Since these units are used in different regions globally, converting correctly helps maintain consistency and clarity in communication. This precision also supports legal and financial transactions involving property and space.",
    },
    {
      question: "How do I know which unit to use for my area measurement?",
      answer:
        "The choice between square meters and square feet typically depends on your location and industry standards. Square meters are the standard unit of area in most countries using the metric system, while square feet are commonly used in the United States and some other countries. Understanding your audience and the context of your measurement will guide you in selecting the appropriate unit.",
    },
    {
      question: "Can I convert other area units using this tool?",
      answer:
        "This specific tool is designed for converting between square meters and square feet only, ensuring high precision for these common units. For other area units like acres, hectares, or square yards, you would need a different converter tailored to those units. However, the principles of conversion remain similar, involving multiplying or dividing by the correct conversion factors.",
    },
    {
      question: "What is the formula used to convert square meters to square feet?",
      answer:
        "The formula to convert square meters to square feet is to multiply the area value in square meters by 10.7639, since one square meter equals approximately 10.7639 square feet. Conversely, to convert square feet to square meters, you multiply by 0.092903. These conversion factors are derived from the relationship between meters and feet in linear measurements, squared for area.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">Value</Label>
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
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AREA_UNITS.map((unit) => (
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
                {AREA_UNITS.map((unit) => (
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
            // No special action needed, conversion is live
          }}
          aria-label="Convert area units"
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
      {val !== "" && results.value !== "" && (
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
          Understanding Area: m² ↔ ft²
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Area measurement is a fundamental concept in many fields such as real estate, architecture, and land surveying. Square meters (m²) and square feet (ft²) are two of the most commonly used units for measuring area, with square meters being the standard in the metric system and square feet used primarily in the imperial system. Understanding how to accurately convert between these units is essential for clear communication and precise calculations across different regions and industries.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This conversion tool provides a reliable and easy way to switch between square meters and square feet, ensuring that you can work confidently with area measurements regardless of the unit system. By entering a value and selecting the units you want to convert from and to, you can obtain instant and accurate results. This helps avoid errors and misunderstandings when dealing with property sizes, floor plans, or any other area-related data.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this converter, simply enter the numerical value of the area you want to convert in the input field. Then, select the unit of the value you entered from the "From" dropdown menu and choose the desired output unit from the "To" dropdown menu. Once you click the "Convert" button, the tool will display the converted area value along with the conversion factor used.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          If you want to clear your input and start over, use the "Reset" button to quickly erase the current value. This interface is designed to be intuitive and responsive, providing immediate feedback and ensuring that you can perform conversions efficiently without confusion. The conversion factor shown helps you understand the relationship between the units you are converting.
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
            <a href="https://www.nist.gov/search?s=Area%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Area Conversion - NIST
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Official guide and standards for Area Conversion from the National Institute of Standards and Technology.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Area%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Area Conversion - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Learn the math and science behind Area Conversion with free interactive lessons and videos from Khan Academy.
            </p>
          </li>
          <li>
            <a href="https://www.calculator.net/search?q=Area%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Area Conversion - Calculator.net
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Compare results and explore alternative calculation methods for Area Conversion on Calculator.net.
            </p>
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Area%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Area Conversion - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Detailed encyclopedia article covering the history, standards, and usage of Area Conversion.
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
              Square meters to square feet
            </p>
            <p className="text-slate-500 text-sm">
              1 m² = 10.7639 ft²
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Square feet to square meters
            </p>
            <p className="text-slate-500 text-sm">
              1 ft² = 0.092903 m²
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Area: m² ↔ ft²"
      description="Calculate area conversions for real estate and land. Convert square meters to square feet (m² to sq ft) and other area units accurately."
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
            description: `Value in ${AREA_UNITS.find((u) => u.value === fromUnit)?.label}`,
          },
          {
            symbol: "Result",
            description: `Value converted to ${AREA_UNITS.find((u) => u.value === toUnit)?.label}`,
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "You want to convert 50 square meters to square feet to understand the size in imperial units.",
        steps: [
          {
            label: "1",
            explanation:
              "Enter 50 in the input field, select 'Square meters (m²)' as the 'From' unit, and 'Square feet (ft²)' as the 'To' unit.",
          },
          {
            label: "2",
            explanation:
              "Click the 'Convert' button to perform the calculation using the conversion factor 1 m² = 10.7639 ft².",
          },
          {
            label: "3",
            explanation:
              "The result will display as 538.195 square feet, showing the equivalent area in the selected unit.",
          },
        ],
        result: "50 m² = 538.195 ft²",
      }}
      relatedCalculators={[
        {
          title: "Length: m ↔ ft ↔ in",
          url: "/conversion/length-m-ft-in",
          icon: "📏",
        },
        {
          title: "Work & Potential Energy",
          url: "/conversion/work-potential-energy",
          icon: "📏",
        },
        {
          title: "Speed: m/s ↔ km/h ↔ mph",
          url: "/conversion/speed-mps-kmph-mph",
          icon: "⚖️",
        },
        {
          title: "Time: ms ↔ s ↔ min ↔ hr",
          url: "/conversion/time-ms-s-min-hr",
          icon: "🌡️",
        },
        {
          title: "Bits: b ↔ kb ↔ Mb ↔ Gb",
          url: "/conversion/bits-b-kb-mb-gb",
          icon: "💾",
        },
        {
          title: "Shoe Size: EU ↔ US ↔ UK",
          url: "/conversion/shoe-size-eu-us-uk",
          icon: "⏱️",
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