import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, Thermometer, Scale, Zap, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SpecificHeatQMcDeltaTCalculator() {
  const [inputs, setInputs] = useState({
    mass: "",
    specificHeat: "",
    deltaT: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const massNum = parseFloat(inputs.mass);
    const cNum = parseFloat(inputs.specificHeat);
    const deltaTNum = parseFloat(inputs.deltaT);

    if (
      isNaN(massNum) ||
      isNaN(cNum) ||
      isNaN(deltaTNum) ||
      massNum <= 0 ||
      cNum <= 0
    ) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning:
          massNum <= 0 || cNum <= 0
            ? "Mass and specific heat capacity must be &gt; 0."
            : null,
        formulaUsed: "q = mcΔT",
      };
    }

    // q = m * c * ΔT
    const q = massNum * cNum * deltaTNum; // Joules

    // Format q in scientific notation if very large or very small
    const absQ = Math.abs(q);
    const valueStr =
      absQ !== 0 && (absQ >= 1e5 || absQ < 1e-3)
        ? q.toExponential(4) + " J"
        : q.toFixed(4) + " J";

    return {
      value: valueStr,
      label: "Heat energy (q) in Joules",
      subtext:
        "q = m × c × ΔT, where m is mass (kg), c is specific heat capacity (J/kg·°C), ΔT is temperature change (°C)",
      warning: null,
      formulaUsed: "q = mcΔT",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is specific heat capacity?",
      answer:
        "Specific heat capacity is the amount of heat energy required to raise the temperature of one kilogram of a substance by one degree Celsius. It is a physical property that varies between materials and is measured in joules per kilogram per degree Celsius (J/kg·°C).",
    },
    {
      question: "Why must mass and specific heat be greater than zero?",
      answer:
        "Mass and specific heat capacity must be greater than zero because negative or zero values are physically meaningless in this context. Mass represents the amount of substance, and specific heat capacity quantifies energy needed for temperature change; both must be positive to calculate heat energy correctly.",
    },
    {
      question: "Can this calculator handle negative temperature changes?",
      answer:
        "Yes, the temperature change (ΔT) can be negative, representing a decrease in temperature. The calculator will compute the heat energy released or absorbed accordingly, with negative q indicating heat loss and positive q indicating heat gain.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="mass" className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            Mass (kg)
          </Label>
          <Input
            id="mass"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 2.5"
            value={inputs.mass}
            onChange={(e) => handleInputChange("mass", e.target.value)}
            aria-describedby="mass-desc"
          />
          <p id="mass-desc" className="text-xs text-slate-500 mt-1">
            Enter the mass of the substance in kilograms (kg). Must be &gt; 0.
          </p>
        </div>

        <div>
          <Label htmlFor="specificHeat" className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Specific Heat Capacity (J/kg·°C)
          </Label>
          <Input
            id="specificHeat"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 4186"
            value={inputs.specificHeat}
            onChange={(e) => handleInputChange("specificHeat", e.target.value)}
            aria-describedby="specificHeat-desc"
          />
          <p id="specificHeat-desc" className="text-xs text-slate-500 mt-1">
            Enter the specific heat capacity in joules per kilogram per degree Celsius (J/kg·°C). Must be &gt; 0.
          </p>
        </div>

        <div>
          <Label htmlFor="deltaT" className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-red-600" />
            Temperature Change ΔT (°C)
          </Label>
          <Input
            id="deltaT"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 25"
            value={inputs.deltaT}
            onChange={(e) => handleInputChange("deltaT", e.target.value)}
            aria-describedby="deltaT-desc"
          />
          <p id="deltaT-desc" className="text-xs text-slate-500 mt-1">
            Enter the temperature change in degrees Celsius (°C). Can be positive or negative.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is automatic on input change
          }}
          aria-label="Calculate heat energy"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              mass: "",
              specificHeat: "",
              deltaT: "",
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-atomic="true">
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
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Specific Heat Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Specific Heat Calculator is a fundamental tool in thermodynamics used to determine the amount of heat energy required to change the temperature of a substance. It uses the formula q = mcΔT, where <em>q</em> is the heat energy in joules, <em>m</em> is the mass in kilograms, <em>c</em> is the specific heat capacity in joules per kilogram per degree Celsius, and ΔT is the temperature change in degrees Celsius.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator is essential for students, educators, and professionals working with heat transfer, material properties, or energy calculations. It helps in understanding how different substances absorb or release heat when subjected to temperature changes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Note that the temperature change ΔT can be positive or negative, indicating heating or cooling respectively. The mass and specific heat capacity must always be positive values to ensure physically meaningful results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By accurately inputting these values, users can precisely calculate the heat energy involved in various scientific and engineering applications, promoting a deeper understanding of thermal processes.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`q = mcΔT

Where:
  q  = Heat energy (Joules, J)
  m  = Mass of the substance (kilograms, kg), m &gt; 0
  c  = Specific heat capacity (Joules per kilogram per degree Celsius, J/kg·°C), c &gt; 0
  ΔT = Temperature change (degrees Celsius, °C), can be positive or negative`}
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
      title="Specific Heat Calculator"
      description="Calculate heat energy (q=mcΔT). Determine the energy required to change the temperature of a substance based on specific heat capacity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "q = mcΔT",
        variables: [
          { symbol: "q", description: "Heat energy in Joules (J)" },
          { symbol: "m", description: "Mass of the substance in kilograms (kg), m &gt; 0" },
          { symbol: "c", description: "Specific heat capacity in J/kg·°C, c &gt; 0" },
          { symbol: "ΔT", description: "Temperature change in degrees Celsius (°C), can be positive or negative" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the heat energy required to raise the temperature of 3 kg of water by 20°C. The specific heat capacity of water is 4186 J/kg·°C.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the values: mass m = 3 kg, specific heat capacity c = 4186 J/kg·°C, temperature change ΔT = 20°C.",
          },
          {
            label: "2",
            explanation:
              "Apply the formula q = mcΔT: q = 3 × 4186 × 20.",
          },
          {
            label: "3",
            explanation:
              "Calculate the heat energy: q = 251,160 Joules.",
          },
        ],
        result: "The heat energy required is 251,160 J.",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Kinematics Equations Solver (SUVAT)", url: "/science/kinematics-suvat-solver", icon: "🚀" },
        { title: "Molality & Normality Converter", url: "/science/molality-normality-converter", icon: "🧪" },
        { title: "Stoichiometry & Limiting Reagent Solver", url: "/science/stoichiometry-limiting-reagent", icon: "🧪" },
        { title: "Wave Speed / Frequency / Wavelength", url: "/science/wave-speed-frequency-wavelength", icon: "🚀" },
        { title: "Projectile Motion Calculator", url: "/science/projectile-motion-calculator", icon: "🚀" },
        { title: "Percent Composition by Mass", url: "/science/percent-composition-by-mass", icon: "🧪" },
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