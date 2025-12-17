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

const ELEMENTS = [
  { symbol: "H", name: "Hydrogen", atomicMass: 1.0079 },
  { symbol: "C", name: "Carbon", atomicMass: 12.0107 },
  { symbol: "N", name: "Nitrogen", atomicMass: 14.0067 },
  { symbol: "O", name: "Oxygen", atomicMass: 15.999 },
  { symbol: "Na", name: "Sodium", atomicMass: 22.9897 },
  { symbol: "Cl", name: "Chlorine", atomicMass: 35.453 },
  { symbol: "S", name: "Sulfur", atomicMass: 32.065 },
  { symbol: "K", name: "Potassium", atomicMass: 39.0983 },
  { symbol: "Ca", name: "Calcium", atomicMass: 40.078 },
  { symbol: "Fe", name: "Iron", atomicMass: 55.845 },
  // Add more elements as needed
];

export default function PercentCompositionByMassCalculator() {
  /**
   * inputs structure:
   * {
   *   compound: string (optional, not used here),
   *   elements: [
   *     { symbol: string, atomicMass: number, count: number }
   *   ]
   * }
   * 
   * We'll allow user to input up to 4 elements with their counts.
   */

  const [inputs, setInputs] = useState({
    elements: [
      { symbol: "", atomicMass: 0, count: "" },
      { symbol: "", atomicMass: 0, count: "" },
      { symbol: "", atomicMass: 0, count: "" },
      { symbol: "", atomicMass: 0, count: "" },
    ],
  });

  // Handle element symbol change: update symbol and atomicMass
  const handleElementSymbolChange = useCallback((index, symbol) => {
    const element = ELEMENTS.find((el) => el.symbol === symbol);
    setInputs((prev) => {
      const newElements = [...prev.elements];
      newElements[index] = {
        symbol,
        atomicMass: element ? element.atomicMass : 0,
        count: newElements[index].count,
      };
      return { elements: newElements };
    });
  }, []);

  // Handle count change (number of atoms)
  const handleCountChange = useCallback((index, value) => {
    // Allow only positive integers or empty string
    if (value === "" || /^[0-9]*$/.test(value)) {
      setInputs((prev) => {
        const newElements = [...prev.elements];
        newElements[index] = {
          ...newElements[index],
          count: value,
        };
        return { elements: newElements };
      });
    }
  }, []);

  // Calculate results in useMemo
  const results = useMemo(() => {
    // Filter valid elements (symbol selected and count > 0)
    const validElements = inputs.elements.filter(
      (el) => el.symbol && el.atomicMass > 0 && el.count !== "" && Number(el.count) > 0
    );

    if (validElements.length === 0) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "Percent Composition by Mass Formula",
      };
    }

    // Calculate total molar mass of compound
    const totalMass = validElements.reduce((sum, el) => sum + el.atomicMass * Number(el.count), 0);

    if (totalMass === 0) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: "Total molar mass cannot be zero.",
        formulaUsed: "Percent Composition by Mass Formula",
      };
    }

    // Calculate percent composition for each element
    // Format: "ElementSymbol: XX.XX %"
    const compositions = validElements.map((el) => {
      const percent = (el.atomicMass * Number(el.count) * 100) / totalMass;
      return `${el.symbol}: ${percent.toFixed(2)} %`;
    });

    return {
      value: compositions.join(" | "),
      label: "Percent Composition by Mass of each element",
      subtext: `Total molar mass = ${totalMass.toFixed(4)} g/mol`,
      warning: null,
      formulaUsed: "Percent Composition by Mass Formula",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is percent composition by mass?",
      answer:
        "Percent composition by mass is the percentage by mass of each element in a chemical compound. It helps to understand the relative amounts of elements present, calculated by dividing the mass of each element by the total molar mass of the compound and multiplying by 100.",
    },
    {
      question: "Why is percent composition important in chemistry?",
      answer:
        "Percent composition is crucial for determining empirical formulas, analyzing compounds, and verifying purity. It provides insight into the elemental makeup of substances, which is essential for chemical reactions and stoichiometric calculations.",
    },
    {
      question: "How do I calculate percent composition by mass?",
      answer:
        "To calculate percent composition, first find the molar mass of each element multiplied by its number of atoms in the compound. Then, sum these to get the total molar mass. Finally, divide each element's mass contribution by the total molar mass and multiply by 100 to get the percentage.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {inputs.elements.map((el, i) => (
          <Card key={i} className="border-blue-300 dark:border-blue-700 shadow-sm">
            <CardContent className="space-y-3">
              <Label htmlFor={`element-symbol-${i}`} className="flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-300">
                <Atom className="w-5 h-5" /> Element #{i + 1}
              </Label>
              <Select
                onValueChange={(value) => handleElementSymbolChange(i, value)}
                value={el.symbol}
                id={`element-symbol-${i}`}
                aria-label={`Select element symbol for element ${i + 1}`}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select element" />
                </SelectTrigger>
                <SelectContent>
                  {ELEMENTS.map((element) => (
                    <SelectItem key={element.symbol} value={element.symbol}>
                      {element.symbol} - {element.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Label htmlFor={`element-count-${i}`} className="flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-300 mt-2">
                <Scale className="w-5 h-5" /> Number of atoms
              </Label>
              <Input
                id={`element-count-${i}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g. 2"
                value={el.count}
                onChange={(e) => handleCountChange(i, e.target.value)}
                aria-describedby={`element-count-desc-${i}`}
              />
              <p id={`element-count-desc-${i}`} className="text-xs text-slate-500 dark:text-slate-400">
                Enter the number of atoms of {el.symbol || "this element"} in the compound.
              </p>
              {el.symbol && el.atomicMass > 0 && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Atomic mass: {el.atomicMass.toFixed(4)} g/mol
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is reactive
          }}
          aria-label="Calculate percent composition by mass"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              elements: [
                { symbol: "", atomicMass: 0, count: "" },
                { symbol: "", atomicMass: 0, count: "" },
                { symbol: "", atomicMass: 0, count: "" },
                { symbol: "", atomicMass: 0, count: "" },
              ],
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Waiting..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white break-words">{results.value}</p>
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
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Percent Composition by Mass</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Percent composition by mass is a fundamental concept in chemistry that describes the relative amount of each element present in a chemical compound. It is expressed as a percentage, representing the mass of a particular element divided by the total molar mass of the compound, multiplied by 100. This measurement helps chemists understand the makeup of substances and is essential for determining empirical formulas and analyzing chemical reactions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          For example, water (H<sub>2</sub>O) consists of hydrogen and oxygen atoms. By calculating the percent composition by mass, we can determine that oxygen contributes approximately 88.81% of the mass, while hydrogen contributes about 11.19%. This information is crucial for stoichiometric calculations and verifying compound purity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding percent composition also aids in comparing different compounds and predicting their properties. It is a stepping stone to more advanced topics such as molecular formulas, reaction yields, and chemical analysis techniques.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Percent Composition by Mass (%) = (Mass of element in 1 mole of compound / Molar mass of compound) × 100

Where:
  Mass of element in 1 mole of compound = atomic mass of element × number of atoms of element
  Molar mass of compound = sum of (atomic mass × number of atoms) for all elements in compound

Symbolically:
  % Composition of element X = ( (A_X × n_X) / M ) × 100

Where:
  A_X = atomic mass of element X (g/mol)
  n_X = number of atoms of element X in the compound
  M = molar mass of the compound (g/mol)
`}
        </pre>
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
        formula: `Percent Composition by Mass (%) = (Mass of element / Total molar mass) × 100`,
        variables: [
          { symbol: "A_X", description: "Atomic mass of element X (g/mol)" },
          { symbol: "n_X", description: "Number of atoms of element X in the compound" },
          { symbol: "M", description: "Molar mass of the compound (g/mol)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the percent composition by mass of carbon and hydrogen in methane (CH₄). Atomic masses: C = 12.0107 g/mol, H = 1.0079 g/mol.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the molar mass of methane: (1 × 12.0107) + (4 × 1.0079) = 16.0423 g/mol.",
          },
          {
            label: "2",
            explanation:
              "Calculate percent composition of carbon: (12.0107 / 16.0423) × 100 = 74.87%.",
          },
          {
            label: "3",
            explanation:
              "Calculate percent composition of hydrogen: (4.0316 / 16.0423) × 100 = 25.13%.",
          },
        ],
        result: "Methane consists of 74.87% carbon and 25.13% hydrogen by mass.",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Gravity on Other Planets Calculator", url: "/science/gravity-on-other-planets-calculator", icon: "🪐" },
        { title: "Ideal Gas Law Calculator", url: "/science/ideal-gas-law-pv-nrt", icon: "🧪" },
        { title: "Wave Speed / Frequency / Wavelength", url: "/science/wave-speed-frequency-wavelength", icon: "🚀" },
        { title: "Orbital Period (Kepler) Estimator", url: "/science/orbital-period-kepler-estimator", icon: "🪐" },
        { title: "Momentum & Impulse Calculator", url: "/science/momentum-impulse-calculator", icon: "🧪" },
        { title: "Escape Velocity Calculator", url: "/science/escape-velocity-calculator", icon: "🧪" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "formula", label: "Formula" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}