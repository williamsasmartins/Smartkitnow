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

export default function SpecificHeatQMcDeltaTCalculator() {
  // Inputs: mass (m), specific heat capacity (c), temperature change (ΔT)
  // Units: mass in grams or kilograms, c in J/(g·°C) or J/(kg·°C), ΔT in °C
  // We'll allow unit selection for mass and specific heat capacity to avoid unit mismatch

  const [inputs, setInputs] = useState({
    mass: "", // numeric string
    massUnit: "g", // "g" or "kg"
    specificHeat: "", // numeric string
    specificHeatUnit: "J/g°C", // "J/g°C" or "J/kg°C"
    deltaT: "", // numeric string (°C)
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Constants (for reference, not used directly here)
  // g = 9.81 m/s²
  // c (speed of light) = 2.998e8 m/s
  // R = 8.314 J/mol·K

  // Calculation: q = m * c * ΔT
  // Convert mass and specific heat units to consistent base units (kg and J/kg°C) for calculation

  const results = useMemo(() => {
    const mRaw = parseFloat(inputs.mass);
    const cRaw = parseFloat(inputs.specificHeat);
    const deltaTRaw = parseFloat(inputs.deltaT);

    // Validation
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

    // Convert mass to kg
    const massKg = inputs.massUnit === "g" ? mRaw / 1000 : mRaw;

    // Convert specific heat to J/kg°C
    // If input is J/g°C, multiply by 1000 to get J/kg°C
    const specificHeatJperKgC =
      inputs.specificHeatUnit === "J/g°C" ? cRaw * 1000 : cRaw;

    // Calculate heat energy q in Joules
    const q = massKg * specificHeatJperKgC * deltaTRaw;

    // Format output: use scientific notation if q > 10000 or q < 0.001 (absolute value)
    const absQ = Math.abs(q);
    const displayVal =
      absQ > 10000 || (absQ !== 0 && absQ < 0.001)
        ? q.toExponential(4)
        : q.toFixed(4);

    // Label with units
    const label = "Heat Energy (q)";
    const subtext = "in Joules (J)";

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

  // FAQs
  const faqs = [
    {
      question: "What is specific heat capacity and why is it important?",
      answer:
        "Specific heat capacity is the amount of heat required to raise the temperature of one unit mass of a substance by one degree Celsius. It is crucial in understanding how different materials respond to heat, which is essential in fields like engineering, meteorology, and environmental science. Knowing specific heat helps in designing heating and cooling systems efficiently.",
    },
    {
      question: "Why do we need to convert units when calculating heat energy?",
      answer:
        "Unit conversion ensures consistency and accuracy in calculations. Since specific heat capacity and mass can be expressed in different units (e.g., grams vs kilograms), converting them to compatible units prevents errors. This is especially important in scientific calculations where precise results are necessary for safety and effectiveness.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="mass" className="flex items-center gap-1 mb-1 font-semibold text-slate-700 dark:text-slate-300">
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
              value={inputs.massUnit}
              onValueChange={(val) => handleInputChange("massUnit", val)}
              aria-label="Mass unit"
              className="w-24"
            >
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="g">grams (g)</SelectItem>
                <SelectItem value="kg">kilograms (kg)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-slate-500 mt-1">Mass of the substance</p>
        </div>

        <div>
          <Label htmlFor="specificHeat" className="flex items-center gap-1 mb-1 font-semibold text-slate-700 dark:text-slate-300">
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
              value={inputs.specificHeatUnit}
              onValueChange={(val) => handleInputChange("specificHeatUnit", val)}
              aria-label="Specific heat unit"
              className="w-32"
            >
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="J/g°C">J/g°C</SelectItem>
                <SelectItem value="J/kg°C">J/kg°C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-slate-500 mt-1">Heat capacity per unit mass</p>
        </div>

        <div>
          <Label htmlFor="deltaT" className="flex items-center gap-1 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <Zap className="w-4 h-4 text-yellow-500" /> Temperature Change (ΔT)
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
          <p className="text-xs text-slate-500 mt-1">Change in temperature (°C)</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via state update, no extra logic needed
            setInputs((prev) => ({ ...prev }));
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

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Science Fact:</strong> Always check your units (e.g., convert grams to kg for physics formulas). Specific heat capacity units must match the mass units for accurate results.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Specific Heat Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Specific heat capacity is a fundamental physical property that describes how much heat energy is required to change the temperature of a substance. This calculator uses the formula <code>q = m × c × ΔT</code>, where <em>q</em> is the heat energy in Joules, <em>m</em> is the mass of the substance, <em>c</em> is the specific heat capacity, and <em>ΔT</em> is the temperature change in degrees Celsius. Understanding this relationship is essential in many scientific and engineering applications.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tool helps students, educators, and professionals calculate the heat energy involved in heating or cooling substances. It is widely used in chemistry labs to determine energy changes during reactions, in physics for thermodynamics studies, and in engineering to design heating and cooling systems.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Always ensure that the units for mass and specific heat capacity are consistent. For example, if mass is in grams, specific heat should be in J/g°C; if mass is in kilograms, specific heat should be in J/kg°C. This calculator allows you to select units accordingly and performs the necessary conversions internally.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`q = m × c × ΔT

Where:
  q   = Heat energy (Joules, J)
  m   = Mass of the substance (kilograms, kg or grams, g)
  c   = Specific heat capacity (J/kg°C or J/g°C)
  ΔT  = Temperature change (degrees Celsius, °C)

Note:
- Ensure units of mass and specific heat capacity correspond.
- If mass is in grams and c in J/g°C, no conversion needed.
- If mass is in kilograms and c in J/kg°C, no conversion needed.
- Mixing units requires conversion for accurate calculation.`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using this calculator:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Given:</strong> A 500 g sample of water is heated, and its temperature increases by 25°C. The specific heat capacity of water is 4.18 J/g°C.</li>
          <li><strong>Step 1:</strong> Convert mass to kilograms if needed. Here, mass is 500 g, so we keep it as is since specific heat is in J/g°C.</li>
          <li><strong>Step 2:</strong> Calculate heat energy: q = m × c × ΔT = 500 g × 4.18 J/g°C × 25°C = 52250 J.</li>
          <li><strong>Result:</strong> The heat energy required to raise the temperature is 52250 Joules.</li>
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
      title="Specific Heat Calculator"
      description="Calculate heat energy (q=mcΔT). Determine the energy required to change the temperature of a substance based on specific heat capacity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "q = m × c × ΔT",
        variables: [
          { symbol: "q", description: "Heat energy in Joules (J)" },
          { symbol: "m", description: "Mass of the substance (grams or kilograms)" },
          { symbol: "c", description: "Specific heat capacity (J/g°C or J/kg°C)" },
          { symbol: "ΔT", description: "Temperature change (degrees Celsius, °C)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the heat energy required to raise the temperature of 500 g of water by 25°C, given water's specific heat capacity is 4.18 J/g°C.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the known values: mass = 500 g, specific heat capacity = 4.18 J/g°C, temperature change = 25°C.",
          },
          {
            label: "2",
            explanation:
              "Use the formula q = m × c × ΔT to calculate heat energy.",
          },
          {
            label: "3",
            explanation:
              "Calculate q = 500 × 4.18 × 25 = 52250 Joules.",
          },
        ],
        result: "Heat energy required is 52250 Joules (J).",
      }}
      relatedCalculators={[
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
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