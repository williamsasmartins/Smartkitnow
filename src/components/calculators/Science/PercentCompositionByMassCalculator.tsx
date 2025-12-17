import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, FlaskConical, Zap, Orbit, Thermometer, Scale, Waves, Info, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type ElementMass = {
  element: string;
  mass: number | "";
};

export default function PercentCompositionByMassCalculator() {
  // Allow up to 5 elements for input
  const [elements, setElements] = useState<ElementMass[]>([
    { element: "", mass: "" },
    { element: "", mass: "" },
    { element: "", mass: "" },
    { element: "", mass: "" },
    { element: "", mass: "" },
  ]);

  const handleElementChange = useCallback(
    (index: number, field: "element" | "mass", value: string) => {
      setElements((prev) => {
        const newArr = [...prev];
        if (field === "mass") {
          // Convert to number or empty string if invalid
          const num = value === "" ? "" : Number(value);
          newArr[index][field] = isNaN(num) || num < 0 ? "" : num;
        } else {
          newArr[index][field] = value;
        }
        return newArr;
      });
    },
    []
  );

  // Calculation logic in useMemo
  const results = useMemo(() => {
    // Filter out empty or invalid entries
    const validElements = elements.filter(
      (el) => el.element.trim() !== "" && typeof el.mass === "number" && el.mass > 0
    );

    if (validElements.length === 0) {
      return {
        value: "Waiting...",
        label: "Enter element names and masses",
        subtext: "",
        warning: null,
        formulaUsed: null,
        percentages: null,
      };
    }

    // Sum total mass
    const totalMass = validElements.reduce((acc, el) => acc + el.mass, 0);

    if (totalMass === 0) {
      return {
        value: "Waiting...",
        label: "Total mass must be &gt; 0",
        subtext: "",
        warning: "Total mass cannot be zero. Please enter valid masses.",
        formulaUsed: null,
        percentages: null,
      };
    }

    // Calculate percent composition by mass for each element
    // % composition = (mass of element / total mass) * 100
    const percentages = validElements.map((el) => {
      const percent = (el.mass / totalMass) * 100;
      // Format: if very small or large, use exponential notation
      const displayPercent =
        percent < 0.001 || percent > 10000 ? percent.toExponential(4) : percent.toFixed(4);
      return {
        element: el.element,
        percent: displayPercent,
      };
    });

    // Format total mass nicely
    const displayTotalMass =
      totalMass < 0.001 || totalMass > 10000 ? totalMass.toExponential(4) : totalMass.toFixed(4);

    return {
      value: `${displayTotalMass} g`,
      label: "Total Mass of Compound",
      subtext: "Sum of all element masses in grams",
      warning: null,
      formulaUsed: "Percent Composition by Mass: % Element = (Mass of Element / Total Mass) × 100",
      percentages,
    };
  }, [elements]);

  // FAQs
  const faqs = [
    {
      question: "Why is percent composition by mass important in chemistry?",
      answer:
        "Percent composition by mass helps chemists understand the relative amounts of each element in a compound. This information is crucial for determining empirical formulas, analyzing purity, and preparing chemical reactions accurately. It also aids in quality control in industrial processes and pharmaceuticals.",
    },
    {
      question: "How is percent composition by mass used in real-world applications?",
      answer:
        "This calculation is essential in fields like materials science, pharmacology, and environmental science. For example, it helps engineers design alloys with specific properties, pharmacists formulate medications with precise dosages, and environmental scientists analyze pollutant compositions. Accurate percent composition ensures safety and effectiveness in these applications.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget JSX
  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {elements.map((el, i) => (
          <Card key={i} className="border border-slate-300 dark:border-slate-700 p-4">
            <CardContent className="space-y-2">
              <Label htmlFor={`element-${i}`} className="font-semibold flex items-center gap-2">
                Element {i + 1} <Atom className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id={`element-${i}`}
                type="text"
                placeholder="Element symbol (e.g. H)"
                value={el.element}
                maxLength={2}
                onChange={(e) => handleElementChange(i, "element", e.target.value.toUpperCase())}
                spellCheck={false}
                autoComplete="off"
              />
              <Label htmlFor={`mass-${i}`} className="font-semibold flex items-center gap-2 mt-2">
                Mass (grams) <Scale className="w-4 h-4 text-green-600" />
              </Label>
              <Input
                id={`mass-${i}`}
                type="number"
                min="0"
                step="any"
                placeholder="Mass in grams"
                value={el.mass === "" ? "" : String(el.mass)}
                onChange={(e) => handleElementChange(i, "mass", e.target.value)}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit calculation trigger needed; useMemo updates automatically
            // But we can validate inputs here if needed
          }}
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setElements([
              { element: "", mass: "" },
              { element: "", mass: "" },
              { element: "", mass: "" },
              { element: "", mass: "" },
              { element: "", mass: "" },
            ])
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Waiting..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
              {results.warning && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Percent Composition List */}
          {results.percentages && (
            <Card className="border border-slate-300 dark:border-slate-700 p-6">
              <CardContent>
                <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-purple-600" /> Percent Composition by Mass
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                  {results.percentages.map(({ element, percent }, i) => (
                    <li key={i}>
                      <strong>{element}</strong>: {percent}%
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Science Fact:</strong> Percent composition by mass is fundamental in determining
              empirical formulas and analyzing compound purity in chemistry labs.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Percent Composition by Mass
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Percent composition by mass expresses the relative amount of each element in a chemical
          compound as a percentage of the compound's total mass. It is calculated by dividing the
          mass of a specific element by the total mass of the compound, then multiplying by 100.
          This concept is essential for chemists to understand the makeup of compounds and to
          determine empirical formulas. The percentages always sum to 100%, reflecting the whole
          compound.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculation is widely used in analytical chemistry, quality control, and material
          science. For example, in pharmaceuticals, knowing the percent composition ensures correct
          dosages of active ingredients. In environmental science, it helps analyze pollutant
          compositions. Understanding these percentages also aids in stoichiometric calculations for
          reactions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Always ensure that masses are measured accurately and consistently in grams. If masses
          are given in other units, convert them to grams before calculating percent composition.
          Remember, the formula requires total mass &gt; 0 to avoid division errors.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`% Element = (Mass of Element / Total Mass of Compound) × 100

Where:
  % Element = Percent composition by mass of the element (%)
  Mass of Element = Mass of the specific element in grams (g)
  Total Mass of Compound = Sum of masses of all elements in grams (g)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem to find the percent composition by mass of water (H₂O).
          Suppose you have 2 grams of hydrogen and 16 grams of oxygen in a sample.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> Mass of hydrogen = 2 g, Mass of oxygen = 16 g
          </li>
          <li>
            <strong>Step 1:</strong> Calculate total mass = 2 g + 16 g = 18 g
          </li>
          <li>
            <strong>Step 2:</strong> Calculate percent hydrogen = (2 / 18) × 100 = 11.11%
          </li>
          <li>
            <strong>Step 3:</strong> Calculate percent oxygen = (16 / 18) × 100 = 88.89%
          </li>
          <li>
            <strong>Result:</strong> Water is 11.11% hydrogen and 88.89% oxygen by mass.
          </li>
        </ul>
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Percent Composition by Mass"
      description="Calculate Percent Composition by Mass. Determine the percentage of each element within a chemical compound."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "% Element = (Mass of Element / Total Mass of Compound) × 100",
        variables: [
          { symbol: "% Element", description: "Percent composition by mass of the element (%)" },
          { symbol: "Mass of Element", description: "Mass of the specific element in grams (g)" },
          { symbol: "Total Mass of Compound", description: "Sum of masses of all elements in grams (g)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the percent composition by mass of hydrogen and oxygen in water, given 2 g hydrogen and 16 g oxygen.",
        steps: [
          { label: "1", explanation: "Calculate total mass: 2 g + 16 g = 18 g" },
          { label: "2", explanation: "Calculate % hydrogen: (2 / 18) × 100 = 11.11%" },
          { label: "3", explanation: "Calculate % oxygen: (16 / 18) × 100 = 88.89%" },
        ],
        result: "Water is 11.11% hydrogen and 88.89% oxygen by mass.",
      }}
      relatedCalculators={[
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "formula", label: "Formula" },
        { id: "example", label: "Example" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}