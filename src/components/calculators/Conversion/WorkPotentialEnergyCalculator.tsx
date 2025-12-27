import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft, Calculator, RotateCcw } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const units = [
  { label: "Joule (J)", value: "J" },
  { label: "Kilojoule (kJ)", value: "kJ" },
  { label: "Calorie (cal)", value: "cal" },
  { label: "Kilocalorie (kcal)", value: "kcal" },
  { label: "Electronvolt (eV)", value: "eV" },
  { label: "Foot-pound force (ft·lbf)", value: "ftlbf" },
];

const conversionToJoule: Record<string, number> = {
  J: 1,
  kJ: 1000,
  cal: 4.184,
  kcal: 4184,
  eV: 1.60218e-19,
  ftlbf: 1.35582,
};

export default function WorkPotentialEnergyCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("J");
  const [toUnit, setToUnit] = useState("kJ");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: "",
        label: "Enter a valid number",
        formula: "Select units to see conversion factor",
      };
    }
    if (!(fromUnit in conversionToJoule) || !(toUnit in conversionToJoule)) {
      return {
        value: "",
        label: "Select valid units",
        formula: "Select units to see conversion factor",
      };
    }

    // Convert input value to Joules
    const valueInJoule = num * conversionToJoule[fromUnit];
    // Convert Joules to target unit
    const resultValue = valueInJoule / conversionToJoule[toUnit];

    // Format result with up to 6 decimals, trimming trailing zeros
    const formattedResult = resultValue.toLocaleString(undefined, {
      maximumFractionDigits: 6,
    });

    // Formula text: 1 fromUnit = X toUnit
    const factor = conversionToJoule[fromUnit] / conversionToJoule[toUnit];
    const formattedFactor =
      factor < 0.000001
        ? factor.toExponential(3)
        : factor.toLocaleString(undefined, { maximumFractionDigits: 6 });

    const formulaText = `1 ${fromUnit} = ${formattedFactor} ${toUnit}`;

    return {
      value: formattedResult,
      label: `Value in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between work and potential energy?",
      answer:
        "Work is the energy transferred by a force acting over a distance, while potential energy is the stored energy an object possesses due to its position or configuration. Both are measured in joules and are closely related in physics, especially in mechanical systems. Understanding their distinction helps in analyzing energy transformations in various scenarios.",
    },
    {
      question: "Why are there different units for work and energy?",
      answer:
        "Different units exist because work and energy are used across various scientific fields and practical applications, each with its own historical and contextual preferences. For example, calories are common in nutrition, electronvolts in atomic physics, and foot-pounds in engineering. Converting between these units ensures consistency and accuracy in calculations.",
    },
    {
      question: "How does gravitational potential energy relate to work done?",
      answer:
        "Gravitational potential energy represents the work done against gravity to elevate an object to a certain height. When an object is lifted, work is performed on it, increasing its potential energy by an amount equal to the work done. This relationship is fundamental in mechanics and energy conservation principles.",
    },
    {
      question: "Can this converter be used for kinetic energy calculations?",
      answer:
        "While this converter focuses on work and potential energy units, kinetic energy shares the same units and can be converted similarly. However, the calculator does not compute kinetic energy values directly but can assist in converting kinetic energy results between units. For kinetic energy calculations, you would need to input the computed energy value and convert units as needed.",
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
            // No special action needed, conversion is reactive
          }}
          aria-label="Convert values"
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
          Understanding Work & Potential Energy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Work and potential energy are fundamental concepts in physics that describe energy transfer and storage. Work is done when a force moves an object over a distance, transferring energy to or from the object. Potential energy, on the other hand, is the energy stored within an object due to its position, such as an object elevated in a gravitational field.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          These concepts are interconnected; for example, lifting an object does work on it, increasing its gravitational potential energy. Understanding these principles allows scientists and engineers to analyze mechanical systems, energy conservation, and the behavior of objects under forces. This calculator helps convert between various units used to quantify work and potential energy, facilitating accurate calculations in different contexts.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Converter</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter the numerical value of work or potential energy you want to convert in the input field. Then select the unit of the value you entered from the "From" dropdown and the unit you want to convert to from the "To" dropdown. The converted result will be displayed instantly below, along with the conversion factor used.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Use the "Convert" button to confirm the conversion or the "Reset" button to clear the input and start over. This tool supports common units such as joules, calories, electronvolts, and foot-pounds, making it versatile for academic, scientific, and engineering purposes. Always ensure the units selected correspond to the type of energy or work you are calculating for accurate results.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
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
            <a href="https://www.engineeringtoolbox.com/index.html?q=Work%20and%20Energy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Work and Energy - Engineering ToolBox
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Comprehensive technical resources, formulas, and data for Work and Energy from the Engineering ToolBox.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Work%20and%20Energy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Work and Energy - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Learn the math and science behind Work and Energy with free interactive lessons and videos from Khan Academy.
            </p>
          </li>
          <li>
            <a href="https://www.calculator.net/search?q=Work%20and%20Energy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Work and Energy - Calculator.net
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Compare results and explore alternative calculation methods for Work and Energy on Calculator.net.
            </p>
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Work%20and%20Energy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Work and Energy - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Detailed encyclopedia article covering the history, standards, and usage of Work and Energy.
            </p>
          </li>
        </ul>
      </section>

      <section id="factors" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Common Conversion Factors</h2>
        <ul className="space-y-4">
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">1 Kilojoule (kJ) = 1000 Joules (J)</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">1 Calorie (cal) = 4.184 Joules (J)</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">1 Kilocalorie (kcal) = 4184 Joules (J)</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">1 Electronvolt (eV) = 1.60218 × 10⁻¹⁹ Joules (J)</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">1 Foot-pound force (ft·lbf) = 1.35582 Joules (J)</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Work & Potential Energy"
      description="Calculate work and gravitational potential energy. Convert between related mechanical units to solve physics equations."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ FIX: VARIABLES MUST NOT BE EMPTY
      formula={{
        title: "Conversion Formula",
        formula: results.formula || "Select units to see conversion factor",
        variables: [
          { symbol: "Input", description: `Value in ${fromUnit}` },
          { symbol: "Result", description: `Value converted to ${toUnit}` },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Calculate the equivalent of 500 calories (cal) in joules (J) to understand the energy content in scientific units.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the input value and units: 500 cal. Select 'cal' as the 'From' unit and 'J' as the 'To' unit.",
          },
          {
            label: "2",
            explanation:
              "Use the conversion factor: 1 cal = 4.184 J. Multiply 500 by 4.184 to convert to joules.",
          },
          {
            label: "3",
            explanation:
              "Calculate the result: 500 × 4.184 = 2092 joules. This is the equivalent energy in joules.",
          },
        ],
        result: "500 cal = 2092 J",
      }}
      relatedCalculators={[
        { title: "Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB", url: "/conversion/bytes-b-kb-mb-gb-tb", icon: "💾" },
        { title: "Length: m ↔ ft ↔ in", url: "/conversion/length-m-ft-in", icon: "📏" },
        { title: "Time: ms ↔ s ↔ min ↔ hr", url: "/conversion/time-ms-s-min-hr", icon: "⚖️" },
        { title: "Paper Size: A-series ↔ US", url: "/conversion/paper-size-a-series-us", icon: "🌡️" },
        { title: "Pressure: Pa ↔ bar ↔ psi", url: "/conversion/pressure-pa-bar-psi", icon: "📐" },
        { title: "Frequency: Hz ↔ kHz ↔ MHz", url: "/conversion/frequency-hz-khz-mhz", icon: "⏱️" },
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