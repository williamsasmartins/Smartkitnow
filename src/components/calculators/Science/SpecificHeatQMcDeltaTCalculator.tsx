import { useState, useMemo, useCallback } from "react";
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
// ⚠️ SAFE ICONS ONLY
import {
  Atom,
  FlaskConical,
  Zap,
  Orbit,
  Thermometer,
  Scale,
  Waves,
  Info,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SpecificHeatQMcDeltaTCalculator() {
  // Inputs: mass (m), specific heat capacity (c), temperature change (ΔT)
  // Units: mass in grams or kilograms, c in J/g°C or J/kg°C, ΔT in °C
  // We will allow user to select mass unit and specific heat unit for clarity.
  // Internally convert mass to kg and c to J/kg°C for calculation.

  const [inputs, setInputs] = useState({
    mass: "",
    massUnit: "g",
    specificHeat: "",
    specificHeatUnit: "J/g°C",
    deltaT: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    // Parse inputs as floats
    const mRaw = parseFloat(inputs.mass);
    const cRaw = parseFloat(inputs.specificHeat);
    const deltaTRaw = parseFloat(inputs.deltaT);

    // Validate inputs presence and positivity where applicable
    if (
      isNaN(mRaw) ||
      isNaN(cRaw) ||
      isNaN(deltaTRaw) ||
      mRaw <= 0 ||
      cRaw <= 0
    ) {
      return {
        value: "Waiting...",
        label: "Enter valid positive values",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Convert mass to kg if input is in grams
    const massKg = inputs.massUnit === "g" ? mRaw / 1000 : mRaw;

    // Convert specific heat to J/kg°C if input is in J/g°C
    const specificHeatJperKgC =
      inputs.specificHeatUnit === "J/g°C" ? cRaw * 1000 : cRaw;

    // Calculate heat energy q = m * c * ΔT (Joules)
    const q = massKg * specificHeatJperKgC * deltaTRaw;

    // Format output: use scientific notation if > 10,000 or < 0.001 (except zero)
    const absQ = Math.abs(q);
    const displayVal =
      absQ > 10000 || (absQ < 0.001 && absQ !== 0)
        ? q.toExponential(4)
        : q.toFixed(4);

    // Label and subtext
    const label = "Heat Energy (q)";
    const subtext = "Joules (J)";

    // Formula used
    const formulaUsed = "q = m × c × ΔT";

    return {
      value: `${displayVal} J`,
      label,
      subtext,
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  // FAQs (60-90 words each)
  const faqs = [
    {
      question: "What is specific heat capacity and why is it important?",
      answer:
        "Specific heat capacity is the amount of heat required to raise the temperature of one unit mass of a substance by one degree Celsius. It is crucial in understanding how different materials respond to heat, which is essential in fields like engineering, meteorology, and chemistry. Knowing specific heat helps in designing heating and cooling systems efficiently.",
    },
    {
      question:
        "Why do we sometimes use grams and sometimes kilograms in heat calculations?",
      answer:
        "The choice between grams and kilograms depends on the scale of the problem and the units of specific heat capacity provided. Specific heat is often given per gram or per kilogram. To maintain consistency and accuracy, mass and specific heat units must match. Converting units properly ensures correct calculation of heat energy.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="mass" className="flex items-center gap-1 mb-1">
            <Scale className="w-4 h-4 text-blue-600" /> Mass (m)
          </Label>
          <div className="flex gap-2">
            <Input
              id="mass"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 500"
              value={inputs.mass}
              onChange={(e) => handleInputChange("mass", e.target.value)}
              aria-describedby="mass-unit"
            />
            <Select
              onValueChange={(val) => handleInputChange("massUnit", val)}
              value={inputs.massUnit}
              aria-label="Mass unit"
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="g">grams (g)</SelectItem>
                <SelectItem value="kg">kilograms (kg)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label
            htmlFor="specificHeat"
            className="flex items-center gap-1 mb-1"
          >
            <Thermometer className="w-4 h-4 text-red-600" /> Specific Heat (c)
          </Label>
          <div className="flex gap-2">
            <Input
              id="specificHeat"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 4.18"
              value={inputs.specificHeat}
              onChange={(e) => handleInputChange("specificHeat", e.target.value)}
              aria-describedby="specificHeat-unit"
            />
            <Select
              onValueChange={(val) => handleInputChange("specificHeatUnit", val)}
              value={inputs.specificHeatUnit}
              aria-label="Specific heat unit"
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="J/g°C">J/g°C</SelectItem>
                <SelectItem value="J/kg°C">J/kg°C</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="deltaT" className="flex items-center gap-1 mb-1">
            <Zap className="w-4 h-4 text-yellow-600" /> Temperature Change (ΔT)
          </Label>
          <Input
            id="deltaT"
            type="number"
            step="any"
            placeholder="e.g. 25"
            value={inputs.deltaT}
            onChange={(e) => handleInputChange("deltaT", e.target.value)}
            aria-describedby="deltaT-unit"
          />
          <p className="text-xs text-slate-500 mt-1">°C (Celsius)</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed; calculation is reactive
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
              massUnit: "g",
              specificHeat: "",
              specificHeatUnit: "J/g°C",
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Science Fact:</strong> Always ensure units are consistent.
              For example, convert grams to kilograms if specific heat is given in
              J/kg°C to avoid calculation errors.
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
          Understanding Specific Heat Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Specific heat capacity is a fundamental physical property that
          describes how much heat energy is required to raise the temperature
          of a substance. This calculator uses the formula q = m × c × ΔT, where
          q is the heat energy in Joules, m is the mass of the substance, c is
          the specific heat capacity, and ΔT is the temperature change. It is
          essential to use consistent units and understand that temperature
          change is the difference between final and initial temperatures.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This science is widely applied in engineering, environmental science,
          and chemistry. For example, engineers use specific heat to design
          heating and cooling systems, while chemists use it to understand
          reaction energetics. Accurate calculations help in energy efficiency
          and safety considerations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember, temperature differences must be expressed in degrees
          Celsius or Kelvin (since the difference is the same), and mass units
          must align with the specific heat units to ensure correct results.
          This tool helps students and professionals alike to quickly compute
          heat energy for various substances.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula & Variables
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`q = m × c × ΔT

Where:
  q     = Heat energy (Joules, J)
  m     = Mass of the substance (kilograms, kg or grams, g)
  c     = Specific heat capacity (J/kg°C or J/g°C)
  ΔT    = Temperature change (°C)

Note:
- If mass is in grams and specific heat in J/g°C, units are consistent.
- If mass is in kilograms and specific heat in J/kg°C, units are consistent.
- Always convert units to match before calculation.`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Step-by-Step Example
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using the specific heat formula:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> 500 grams of water, specific heat capacity
            4.18 J/g°C, temperature increase of 25°C.
          </li>
          <li>
            <strong>Step 1:</strong> Convert mass to kilograms if needed (here,
            500 g = 0.5 kg). Since specific heat is given in J/g°C, keep mass in
            grams for consistency.
          </li>
          <li>
            <strong>Step 2:</strong> Calculate heat energy: q = m × c × ΔT = 500
            × 4.18 × 25 = 52250 Joules.
          </li>
          <li>
            <strong>Result:</strong> 52,250 Joules of energy is required to raise
            the temperature of 500 g of water by 25°C.
          </li>
        </ul>
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
        formula: "q = m × c × ΔT",
        variables: [
          { symbol: "q", description: "Heat energy (Joules, J)" },
          { symbol: "m", description: "Mass of the substance (kg or g)" },
          {
            symbol: "c",
            description:
              "Specific heat capacity (J/kg°C or J/g°C, depending on units)",
          },
          { symbol: "ΔT", description: "Temperature change (°C)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the heat energy required to raise the temperature of 500 grams of water by 25°C, given the specific heat capacity of water is 4.18 J/g°C.",
        steps: [
          {
            label: "1",
            explanation:
              "Use the formula q = m × c × ΔT with m = 500 g, c = 4.18 J/g°C, and ΔT = 25°C.",
          },
          {
            label: "2",
            explanation:
              "Calculate q = 500 × 4.18 × 25 = 52250 Joules.",
          },
          {
            label: "3",
            explanation:
              "The energy required is 52,250 Joules.",
          },
        ],
        result: "52,250 Joules (J)",
      }}
      relatedCalculators={[
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
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