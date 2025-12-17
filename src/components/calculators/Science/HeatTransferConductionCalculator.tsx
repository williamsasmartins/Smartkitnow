import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, Thermometer, Scale, Waves, Info, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HeatTransferConductionCalculator() {
  /**
   * Inputs:
   * k: Thermal conductivity (W/m·K)
   * A: Cross-sectional area (m²)
   * deltaT: Temperature difference (K or °C)
   * L: Thickness/distance (m)
   */
  const [inputs, setInputs] = useState({
    k: "",
    A: "",
    deltaT: "",
    L: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points, empty string allowed for clearing
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const k = parseFloat(inputs.k);
    const A = parseFloat(inputs.A);
    const deltaT = parseFloat(inputs.deltaT);
    const L = parseFloat(inputs.L);

    // Validate inputs
    if (
      Number.isNaN(k) ||
      Number.isNaN(A) ||
      Number.isNaN(deltaT) ||
      Number.isNaN(L) ||
      k <= 0 ||
      A <= 0 ||
      L <= 0
    ) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning:
          "Please enter valid positive numbers for thermal conductivity, area, and thickness. Temperature difference can be any real number.",
        formulaUsed: "Q = (k × A × ΔT) / L",
      };
    }

    // Fourier's law for conduction: Q = (k * A * ΔT) / L
    // Q in Watts (J/s)
    const Q = (k * A * deltaT) / L;

    // Format result with scientific notation if very large or small
    const absQ = Math.abs(Q);
    const formattedQ =
      absQ !== 0 && (absQ < 0.001 || absQ > 1e5)
        ? Q.toExponential(4) + " W"
        : Q.toFixed(4) + " W";

    return {
      value: formattedQ,
      label: "Rate of heat transfer by conduction",
      subtext:
        "Q = Heat transfer rate (Watts, W = J/s), k = Thermal conductivity (W/m·K), A = Area (m²), ΔT = Temperature difference (K or °C), L = Thickness (m)",
      warning: null,
      formulaUsed: "Q = (k × A × ΔT) / L",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What does the Heat Transfer (Conduction) Calculator compute?",
      answer:
        "This calculator computes the rate of heat transfer through a material by conduction using Fourier's law. It requires the thermal conductivity, cross-sectional area, temperature difference, and thickness of the material to determine how much heat energy passes per second.",
    },
    {
      question: "Can I use temperature difference in Celsius or Kelvin?",
      answer:
        "Yes, the temperature difference ΔT can be entered in either Celsius or Kelvin since the difference is the same in both units. Just ensure consistency in units for accurate results.",
    },
    {
      question: "Why must thermal conductivity, area, and thickness be positive?",
      answer:
        "Thermal conductivity, area, and thickness represent physical quantities that cannot be zero or negative. Negative or zero values would not make physical sense and would invalidate the calculation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="k" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Thermometer className="w-5 h-5 text-blue-600" /> Thermal Conductivity (k)
          </Label>
          <Input
            id="k"
            type="text"
            placeholder="e.g. 205"
            value={inputs.k}
            onChange={(e) => handleInputChange("k", e.target.value)}
            aria-describedby="k-desc"
            className="mt-1"
          />
          <p id="k-desc" className="text-xs text-slate-500 mt-1">
            Watts per meter-Kelvin (W/m·K)
          </p>
        </div>

        <div>
          <Label htmlFor="A" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Scale className="w-5 h-5 text-blue-600" /> Cross-sectional Area (A)
          </Label>
          <Input
            id="A"
            type="text"
            placeholder="e.g. 0.01"
            value={inputs.A}
            onChange={(e) => handleInputChange("A", e.target.value)}
            aria-describedby="A-desc"
            className="mt-1"
          />
          <p id="A-desc" className="text-xs text-slate-500 mt-1">
            Square meters (m²)
          </p>
        </div>

        <div>
          <Label htmlFor="deltaT" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Waves className="w-5 h-5 text-blue-600" /> Temperature Difference (ΔT)
          </Label>
          <Input
            id="deltaT"
            type="text"
            placeholder="e.g. 50"
            value={inputs.deltaT}
            onChange={(e) => handleInputChange("deltaT", e.target.value)}
            aria-describedby="deltaT-desc"
            className="mt-1"
          />
          <p id="deltaT-desc" className="text-xs text-slate-500 mt-1">
            Kelvin (K) or Celsius (°C)
          </p>
        </div>

        <div>
          <Label htmlFor="L" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Info className="w-5 h-5 text-blue-600" /> Thickness / Distance (L)
          </Label>
          <Input
            id="L"
            type="text"
            placeholder="e.g. 0.005"
            value={inputs.L}
            onChange={(e) => handleInputChange("L", e.target.value)}
            aria-describedby="L-desc"
            className="mt-1"
          />
          <p id="L-desc" className="text-xs text-slate-500 mt-1">
            Meters (m)
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is reactive
          }}
          aria-label="Calculate heat transfer rate"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ k: "", A: "", deltaT: "", L: "" })}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Heat Transfer (Conduction) Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Heat transfer by conduction is the process where thermal energy moves through a material without the material itself moving. This occurs due to temperature differences within the material, causing heat to flow from the hotter region to the cooler one. The rate of heat transfer depends on the material's thermal conductivity, the cross-sectional area through which heat flows, the temperature difference, and the thickness of the material.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator uses Fourier's law of heat conduction to determine the heat transfer rate (Q) in Watts (Joules per second). It is widely used in engineering and physics to analyze thermal insulation, heat exchangers, and material properties. Understanding these principles helps in designing efficient thermal systems and managing energy consumption.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          When using this calculator, ensure all inputs are in consistent SI units: thermal conductivity in watts per meter-kelvin (W/m·K), area in square meters (m²), temperature difference in kelvin (K) or degrees Celsius (°C), and thickness in meters (m). Note that temperature difference in °C and K are equivalent for this calculation.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Q = (k × A × ΔT) / L

Where:
  Q     = Heat transfer rate (Watts, W = Joules/second)
  k     = Thermal conductivity of the material (W/m·K)
  A     = Cross-sectional area perpendicular to heat flow (m²)
  ΔT    = Temperature difference across the material (K or °C)
  L     = Thickness or distance heat travels through (m)

Note:
- ΔT &gt; 0 means heat flows from higher to lower temperature.
- Units must be consistent for accurate results.`}
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
      title="Heat Transfer (Conduction) Calculator"
      description="Calculate rate of heat transfer by conduction. Solve thermal conductivity problems using Fourier's law for engineering and physics."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Q = (k × A × ΔT) / L",
        variables: [
          { symbol: "Q", description: "Heat transfer rate (Watts, W = Joules/second)" },
          { symbol: "k", description: "Thermal conductivity (W/m·K)" },
          { symbol: "A", description: "Cross-sectional area (m²)" },
          { symbol: "ΔT", description: "Temperature difference (Kelvin or Celsius)" },
          { symbol: "L", description: "Thickness/distance heat travels (m)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the heat transfer rate through a 0.005 m thick aluminum plate (k = 205 W/m·K) with a cross-sectional area of 0.01 m² and a temperature difference of 50 °C.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify given values: k = 205 W/m·K, A = 0.01 m², ΔT = 50 °C, L = 0.005 m.",
          },
          {
            label: "2",
            explanation:
              "Apply Fourier's law: Q = (k × A × ΔT) / L = (205 × 0.01 × 50) / 0.005.",
          },
          {
            label: "3",
            explanation: "Calculate: Q = (205 × 0.01 × 50) / 0.005 = 20500 Watts.",
          },
        ],
        result: "The heat transfer rate is 20500 W (Watts).",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Uniform Circular Motion Calculator", url: "/science/uniform-circular-motion-centripetal", icon: "🚀" },
        { title: "Kinematics Equations Solver (SUVAT)", url: "/science/kinematics-suvat-solver", icon: "🚀" },
        { title: "Stoichiometry & Limiting Reagent Solver", url: "/science/stoichiometry-limiting-reagent", icon: "🧪" },
        { title: "Projectile Motion Calculator", url: "/science/projectile-motion-calculator", icon: "🚀" },
        { title: "Buffer (Henderson–Hasselbalch) Helper", url: "/science/buffer-henderson-hasselbalch-helper", icon: "🧪" },
        { title: "pH / pOH / [H+] Calculator", url: "/science/ph-poh-h-oh-calculator", icon: "🧪" },
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