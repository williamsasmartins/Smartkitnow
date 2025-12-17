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

  // Calculation of heat transfer rate Q = k * A * ΔT / d
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
        label: "Enter valid positive inputs",
        subtext: "All inputs must be positive numbers.",
        warning: null,
        formulaUsed: null,
      };
    }

    // Calculation
    const Q = (k * A * deltaT) / d; // Watts (Joules per second)

    // Formatting output: use scientific notation if very large or very small
    const displayVal =
      Q >= 10000 || Q < 0.001 ? Q.toExponential(4) : Q.toFixed(4);

    return {
      value: `${displayVal} W`,
      label: "Heat Transfer Rate (Watts)",
      subtext:
        "Rate of heat transfer by conduction through the material surface area.",
      warning: null,
      formulaUsed: "Q = k × A × ΔT / d",
    };
  }, [inputs]);

  // FAQs
  const faqs = [
    {
      question: "What factors affect heat transfer by conduction?",
      answer:
        "Heat transfer by conduction depends primarily on the material's thermal conductivity (k), the surface area (A) through which heat is transferred, the temperature difference (ΔT) across the material, and the thickness (d) of the material. A higher thermal conductivity or temperature difference increases heat transfer, while a thicker material reduces it. These factors are critical in designing insulation and heat exchangers.",
    },
    {
      question: "Why is the thickness of the material important in conduction?",
      answer:
        "The thickness (d) of the material acts as a resistance to heat flow. According to Fourier's law, heat transfer rate is inversely proportional to thickness. Thicker materials reduce the rate of heat conduction, which is why insulation materials are designed to be thick enough to minimize heat loss or gain. This principle is widely applied in building construction and thermal engineering.",
    },
    {
      question: "Can this calculator be used for convection or radiation?",
      answer:
        "No, this calculator specifically computes heat transfer by conduction using Fourier's law. Convection and radiation involve different physical mechanisms and require separate formulas and considerations. For example, convection depends on fluid motion and heat transfer coefficients, while radiation depends on emissivity and temperature to the fourth power.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="k" className="flex items-center gap-1 font-semibold">
            <Waves className="w-4 h-4 text-blue-600" />
            Thermal Conductivity (k)
          </Label>
          <Input
            id="k"
            type="text"
            placeholder="e.g. 205"
            value={inputs.k}
            onChange={(e) => handleInputChange("k", e.target.value)}
            aria-describedby="k-help"
          />
          <p id="k-help" className="text-xs text-slate-500 mt-1">
            Watts per meter-Kelvin (W/(m·K))
          </p>
        </div>

        <div>
          <Label htmlFor="A" className="flex items-center gap-1 font-semibold">
            <Scale className="w-4 h-4 text-blue-600" />
            Cross-sectional Area (A)
          </Label>
          <Input
            id="A"
            type="text"
            placeholder="e.g. 0.5"
            value={inputs.A}
            onChange={(e) => handleInputChange("A", e.target.value)}
            aria-describedby="A-help"
          />
          <p id="A-help" className="text-xs text-slate-500 mt-1">
            Square meters (m²)
          </p>
        </div>

        <div>
          <Label
            htmlFor="deltaT"
            className="flex items-center gap-1 font-semibold"
          >
            <Thermometer className="w-4 h-4 text-blue-600" />
            Temperature Difference (ΔT)
          </Label>
          <Input
            id="deltaT"
            type="text"
            placeholder="e.g. 30"
            value={inputs.deltaT}
            onChange={(e) => handleInputChange("deltaT", e.target.value)}
            aria-describedby="deltaT-help"
          />
          <p id="deltaT-help" className="text-xs text-slate-500 mt-1">
            Kelvin (K) or Celsius (°C) difference
          </p>
        </div>

        <div>
          <Label htmlFor="d" className="flex items-center gap-1 font-semibold">
            <Scale className="w-4 h-4 text-blue-600" />
            Thickness (d)
          </Label>
          <Input
            id="d"
            type="text"
            placeholder="e.g. 0.01"
            value={inputs.d}
            onChange={(e) => handleInputChange("d", e.target.value)}
            aria-describedby="d-help"
          />
          <p id="d-help" className="text-xs text-slate-500 mt-1">
            Meters (m)
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger re-render, calculation is in useMemo
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate heat transfer rate"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              k: "",
              A: "",
              deltaT: "",
              d: "",
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
              <strong>Science Fact:</strong> Always ensure units are consistent,
              e.g., convert thickness from centimeters to meters before
              calculating.
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
          Heat transfer by conduction is the process where thermal energy is
          transferred through a material without the movement of the material
          itself. This occurs due to collisions and vibrations of particles
          within the substance. The rate of heat transfer depends on the
          material's thermal conductivity, the temperature difference across the
          material, the cross-sectional area, and the thickness of the material.
          This calculator helps quantify the heat transfer rate, which is
          essential in engineering applications such as designing insulation,
          heat exchangers, and electronic cooling systems.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In practical terms, conduction is why a metal spoon gets hot when its
          end is placed in a hot liquid, or why buildings require proper
          insulation to maintain temperature. Understanding and calculating
          conduction heat transfer enables engineers and scientists to optimize
          thermal management in various systems.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator assumes steady-state conditions and one-dimensional
          heat flow, which is a common simplification in many engineering
          problems. For more complex scenarios involving convection or radiation,
          different models and calculations are required.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula & Variables
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Q = \\frac{k \\times A \\times \\Delta T}{d}

Where:
  Q       = Heat transfer rate (Watts, W)
  k       = Thermal conductivity of the material (W/(m·K))
  A       = Cross-sectional area perpendicular to heat flow (m²)
  \\Delta T = Temperature difference across the material (K or °C)
  d       = Thickness of the material (m)

Note: Temperature difference \\Delta T can be in Kelvin or Celsius since it is a difference.`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Step-by-Step Example
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem to find the heat transfer rate through
          a copper plate.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> Thermal conductivity of copper k = 385 W/(m·K),
            area A = 0.1 m², temperature difference ΔT = 50 K, thickness d = 0.005 m.
          </li>
          <li>
            <strong>Step 1:</strong> Apply Fourier's law: Q = k × A × ΔT / d.
          </li>
          <li>
            <strong>Step 2:</strong> Calculate Q = 385 × 0.1 × 50 / 0.005 = 385,000
            W.
          </li>
          <li>
            <strong>Result:</strong> The heat transfer rate is 3.85 × 10<sup>5</sup>{" "}
            Watts.
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
      title="Heat Transfer (Conduction) Calculator"
      description="Calculate rate of heat transfer by conduction. Solve thermal conductivity problems using Fourier's law for engineering and physics."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Fourier's Law of Heat Conduction",
        formula: "Q = \\frac{k \\times A \\times \\Delta T}{d}",
        variables: [
          { symbol: "Q", description: "Heat transfer rate (Watts, W)" },
          {
            symbol: "k",
            description: "Thermal conductivity (W/(m·K))",
          },
          { symbol: "A", description: "Cross-sectional area (m²)" },
          {
            symbol: "ΔT",
            description: "Temperature difference across the material (K or °C)",
          },
          { symbol: "d", description: "Thickness of the material (m)" },
        ],
      }}
      example={{
        title: "Example: Heat Transfer through Copper Plate",
        scenario:
          "Calculate the heat transfer rate through a copper plate with k = 385 W/(m·K), A = 0.1 m², ΔT = 50 K, and d = 0.005 m.",
        steps: [
          {
            label: "1",
            explanation:
              "Apply Fourier's law: Q = k × A × ΔT / d.",
          },
          {
            label: "2",
            explanation:
              "Substitute values: Q = 385 × 0.1 × 50 / 0.005.",
          },
          {
            label: "3",
            explanation:
              "Calculate Q = 385,000 W or 3.85 × 10⁵ Watts.",
          },
        ],
        result: "Heat transfer rate Q = 3.85 × 10⁵ Watts.",
      }}
      relatedCalculators={[
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        {
          title: "Kinematics Equations (SUVAT)",
          url: "/science/kinematics-equations",
          icon: "🚀",
        },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
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