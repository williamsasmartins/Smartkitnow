import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, Thermometer, Scale, Info, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HeatTransferConductionCalculator() {
  // Inputs: k (thermal conductivity), A (area), ΔT (temperature difference), d (thickness)
  const [inputs, setInputs] = useState({
    k: "", // W/(m·K)
    A: "", // m²
    deltaT: "", // K or °C difference
    d: "", // m
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Constants (for reference, not directly used here)
  // g = 9.81 m/s²
  // c = 2.998e8 m/s
  // R = 8.314 J/(mol·K)

  // Calculation using Fourier's Law of Heat Conduction:
  // Q = (k * A * ΔT) / d
  // Units: Watts (Joules per second)

  const results = useMemo(() => {
    const k = parseFloat(inputs.k);
    const A = parseFloat(inputs.A);
    const deltaT = parseFloat(inputs.deltaT);
    const d = parseFloat(inputs.d);

    // Validation
    if (
      isNaN(k) || k <= 0 ||
      isNaN(A) || A <= 0 ||
      isNaN(deltaT) || deltaT <= 0 ||
      isNaN(d) || d <= 0
    ) {
      return {
        value: "Waiting...",
        label: "Enter valid positive numbers for all inputs",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Calculation
    const Q = (k * A * deltaT) / d; // Watts (J/s)

    // Formatting result: use scientific notation if very large or small
    const displayVal =
      Q > 10000 || Q < 0.001 ? Q.toExponential(4) : Q.toFixed(4);

    return {
      value: `${displayVal} W`,
      label: "Rate of Heat Transfer (Q)",
      subtext:
        "Heat transfer rate by conduction in Watts (Joules per second).",
      warning: null,
      formulaUsed: "Q = (k × A × ΔT) / d",
    };
  }, [inputs]);

  // FAQs
  const faqs = [
    {
      question: "What is heat conduction and where is it applied?",
      answer:
        "Heat conduction is the transfer of thermal energy through a material without the material itself moving. It occurs due to temperature differences within solids or between solids in contact. This principle is essential in engineering applications such as designing insulation for buildings, heat exchangers, and electronic devices to manage heat flow efficiently.",
    },
    {
      question: "Why must the thickness (d) be greater than zero in calculations?",
      answer:
        "The thickness (d) represents the distance heat travels through the material. If d were zero or negative, it would imply no physical barrier or an invalid scenario, leading to infinite or undefined heat transfer rates. Ensuring d &gt; 0 maintains physical realism and mathematical correctness in the conduction formula.",
    },
    {
      question: "Can this calculator be used for convection or radiation heat transfer?",
      answer:
        "No, this calculator specifically applies Fourier's law for conduction, which involves heat transfer through direct molecular interaction in solids. Convection and radiation involve different mechanisms and require other formulas and parameters, such as fluid velocity for convection or emissivity and temperature to the fourth power for radiation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="k" className="flex items-center gap-1 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <Thermometer className="w-4 h-4 text-blue-600" /> Thermal Conductivity (k)
          </Label>
          <Input
            id="k"
            type="text"
            placeholder="W/(m·K)"
            value={inputs.k}
            onChange={(e) => handleInputChange("k", e.target.value)}
            aria-describedby="k-desc"
          />
          <p id="k-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Thermal conductivity in Watts per meter-Kelvin (W/(m·K)), e.g., 205 for copper.
          </p>
        </div>

        <div>
          <Label htmlFor="A" className="flex items-center gap-1 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <Scale className="w-4 h-4 text-blue-600" /> Cross-sectional Area (A)
          </Label>
          <Input
            id="A"
            type="text"
            placeholder="m²"
            value={inputs.A}
            onChange={(e) => handleInputChange("A", e.target.value)}
            aria-describedby="A-desc"
          />
          <p id="A-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Area perpendicular to heat flow in square meters (m²).
          </p>
        </div>

        <div>
          <Label htmlFor="deltaT" className="flex items-center gap-1 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <Waves className="w-4 h-4 text-blue-600" /> Temperature Difference (ΔT)
          </Label>
          <Input
            id="deltaT"
            type="text"
            placeholder="K or °C"
            value={inputs.deltaT}
            onChange={(e) => handleInputChange("deltaT", e.target.value)}
            aria-describedby="deltaT-desc"
          />
          <p id="deltaT-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Temperature difference across the material in Kelvin or Celsius (K or °C).
          </p>
        </div>

        <div>
          <Label htmlFor="d" className="flex items-center gap-1 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <Scale className="w-4 h-4 text-blue-600" /> Thickness (d)
          </Label>
          <Input
            id="d"
            type="text"
            placeholder="m"
            value={inputs.d}
            onChange={(e) => handleInputChange("d", e.target.value)}
            aria-describedby="d-desc"
          />
          <p id="d-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Thickness of the material in meters (m), must be &gt; 0.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate heat transfer rate"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ k: "", A: "", deltaT: "", d: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Waiting..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
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
              <strong>Science Fact:</strong> Always ensure units are consistent. For example, convert thickness from centimeters to meters before calculation.
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
          Understanding Heat Transfer (Conduction) Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Heat transfer by conduction is the process where thermal energy moves through a solid material due to a temperature gradient. This occurs without any bulk movement of the material itself. The rate of heat transfer depends on the material's thermal conductivity, the cross-sectional area through which heat flows, the temperature difference across the material, and the thickness of the material. This calculator uses Fourier's law to quantify this rate precisely.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding conduction is crucial in many real-world applications such as designing thermal insulation in buildings, managing heat in electronic devices, and engineering heat exchangers in industrial processes. Accurate calculations help engineers optimize materials and dimensions to achieve desired thermal performance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember, conduction is only one mode of heat transfer; convection and radiation involve different mechanisms and require separate analysis. This tool focuses solely on conduction through solids or stationary fluids.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Q = (k × A × ΔT) / d

Where:
  Q     = Rate of heat transfer (Watts, W or Joules per second)
  k     = Thermal conductivity of the material (W/(m·K))
  A     = Cross-sectional area perpendicular to heat flow (m²)
  ΔT    = Temperature difference across the material (Kelvin or °C)
  d     = Thickness of the material (m)

Note:
- Ensure all units are consistent.
- ΔT can be in °C or K since it is a difference.`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem to find the heat transfer rate through a copper plate.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Given:</strong> Thermal conductivity of copper, k = 205 W/(m·K); Area, A = 0.5 m²; Temperature difference, ΔT = 30 °C; Thickness, d = 0.01 m.</li>
          <li><strong>Step 1:</strong> Substitute values into Fourier's law: Q = (205 × 0.5 × 30) / 0.01.</li>
          <li><strong>Step 2:</strong> Calculate numerator: 205 × 0.5 × 30 = 3075.</li>
          <li><strong>Step 3:</strong> Divide by thickness: 3075 / 0.01 = 307500 Watts.</li>
          <li><strong>Result:</strong> The heat transfer rate Q is 307,500 W (or 3.075 × 10<sup>5</sup> W).</li>
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
      title="Heat Transfer (Conduction) Calculator"
      description="Calculate rate of heat transfer by conduction. Solve thermal conductivity problems using Fourier's law for engineering and physics."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Q = (k × A × ΔT) / d",
        variables: [
          { symbol: "Q", description: "Rate of heat transfer (Watts, W)" },
          { symbol: "k", description: "Thermal conductivity (W/(m·K))" },
          { symbol: "A", description: "Cross-sectional area (m²)" },
          { symbol: "ΔT", description: "Temperature difference (K or °C)" },
          { symbol: "d", description: "Thickness of material (m)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the heat transfer rate through a copper plate with k = 205 W/(m·K), area = 0.5 m², ΔT = 30 °C, and thickness = 0.01 m.",
        steps: [
          {
            label: "1",
            explanation:
              "Substitute values into the formula: Q = (205 × 0.5 × 30) / 0.01.",
          },
          {
            label: "2",
            explanation: "Calculate numerator: 205 × 0.5 × 30 = 3075.",
          },
          {
            label: "3",
            explanation: "Divide by thickness: 3075 / 0.01 = 307500 Watts.",
          },
        ],
        result: "The heat transfer rate Q is 307,500 W (or 3.075 × 10⁵ W).",
      }}
      relatedCalculators={[
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
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