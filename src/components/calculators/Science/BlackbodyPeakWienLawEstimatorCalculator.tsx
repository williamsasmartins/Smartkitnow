import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, Thermometer, Scale, AlertTriangle, RotateCcw } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const relatedCalculators = [
  { title: "Buffer (Henderson–Hasselbalch) Helper", url: "/science/buffer-henderson-hasselbalch-helper", icon: "🧪" },
  { title: "Force, Work & Energy Calculator", url: "/science/force-work-energy-calculator", icon: "🚀" },
  { title: "Percent Composition by Mass", url: "/science/percent-composition-by-mass", icon: "🧪" },
  { title: "Uniform Circular Motion Calculator", url: "/science/uniform-circular-motion-centripetal", icon: "🚀" },
  { title: "Molality & Normality Converter", url: "/science/molality-normality-converter", icon: "🧪" },
  { title: "Thin Lens Solver", url: "/science/thin-lens-solver", icon: "🌈" },
];

export default function BlackbodyPeakWienLawEstimatorCalculator() {
  /**
   * Inputs:
   * - temperature: number (Kelvin)
   * - wavelength: number (meters)
   * - mode: "peakWavelength" or "temperature"
   * 
   * Calculation:
   * Wien's displacement law: λ_peak * T = b
   * where b = 2.8977729e-3 m·K (Wien's displacement constant)
   * 
   * If mode = "peakWavelength", input temperature, output peak wavelength.
   * If mode = "temperature", input wavelength, output temperature.
   */

  const [inputs, setInputs] = useState({
    mode: "peakWavelength",
    temperature: "",
    wavelength: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const b = 2.8977729e-3; // Wien's displacement constant in m·K

    // Parse inputs safely
    const tempNum = parseFloat(inputs.temperature);
    const waveNum = parseFloat(inputs.wavelength);
    const mode = inputs.mode;

    // Validation and calculation
    if (mode === "peakWavelength") {
      // Calculate peak wavelength from temperature
      if (isNaN(tempNum) || tempNum <= 0) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: tempNum <= 0 ? "Temperature must be &gt; 0 K" : null,
          formulaUsed: "λ_peak = b / T",
        };
      }
      const lambdaPeak = b / tempNum; // meters

      // Format result in nm if small enough, else m
      let displayValue: string;
      let unit: string;
      if (lambdaPeak < 1e-6) {
        // Convert to nm
        displayValue = (lambdaPeak * 1e9).toExponential(4);
        unit = "nm";
      } else {
        displayValue = lambdaPeak.toExponential(4);
        unit = "m";
      }

      return {
        value: `${displayValue} ${unit}`,
        label: "Peak Wavelength of Blackbody Radiation",
        subtext: `Calculated using Wien's displacement constant b = ${b.toExponential(7)} m·K`,
        warning: null,
        formulaUsed: "λ_peak = b / T",
      };
    } else if (mode === "temperature") {
      // Calculate temperature from wavelength
      if (isNaN(waveNum) || waveNum <= 0) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: waveNum <= 0 ? "Wavelength must be &gt; 0 m" : null,
          formulaUsed: "T = b / λ_peak",
        };
      }
      const temperature = b / waveNum; // Kelvin

      return {
        value: `${temperature.toExponential(4)} K`,
        label: "Temperature of Blackbody",
        subtext: `Calculated using Wien's displacement constant b = ${b.toExponential(7)} m·K`,
        warning: null,
        formulaUsed: "T = b / λ_peak",
      };
    }

    return {
      value: "Waiting...",
      label: "",
      subtext: "",
      warning: null,
      formulaUsed: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Wien's displacement law?",
      answer:
        "Wien's displacement law states that the wavelength at which the emission of a blackbody spectrum is maximum is inversely proportional to its absolute temperature. Mathematically, λ_peak × T = b, where b is Wien's displacement constant. This law helps estimate the temperature of stars and other hot objects by measuring their peak emission wavelength.",
    },
    {
      question: "Why must temperature be greater than zero Kelvin?",
      answer:
        "Temperature in Wien's law must be greater than 0 K because absolute zero is the lowest possible temperature where particles have minimal thermal motion. At or below 0 K, the physical assumptions behind blackbody radiation and Wien's law break down, making calculations invalid or meaningless.",
    },
    {
      question: "Can I use this calculator for any wavelength unit?",
      answer:
        "This calculator expects wavelength input in meters (m). If you have wavelength in nanometers (nm), convert it by multiplying by 1e-9 before input. The calculator outputs peak wavelength in meters or nanometers depending on the magnitude for clarity.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Mode selector */}
      <div>
        <Label htmlFor="mode" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-1">
          <Scale className="w-5 h-5 text-blue-600" /> Calculation Mode
        </Label>
        <Select
          value={inputs.mode}
          onValueChange={(value) => handleInputChange("mode", value)}
          id="mode"
          aria-label="Select calculation mode"
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="peakWavelength" aria-label="Calculate peak wavelength from temperature">
              Calculate Peak Wavelength (λ_peak) from Temperature (T)
            </SelectItem>
            <SelectItem value="temperature" aria-label="Calculate temperature from peak wavelength">
              Calculate Temperature (T) from Peak Wavelength (λ_peak)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      {inputs.mode === "peakWavelength" && (
        <div>
          <Label htmlFor="temperature" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-1">
            <Thermometer className="w-5 h-5 text-red-600" /> Temperature (Kelvin, K)
          </Label>
          <Input
            id="temperature"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 5800"
            value={inputs.temperature}
            onChange={(e) => handleInputChange("temperature", e.target.value)}
            aria-describedby="temperature-help"
          />
          <p id="temperature-help" className="text-sm text-slate-500 mt-1">
            Enter temperature in Kelvin (K). Must be &gt; 0.
          </p>
        </div>
      )}

      {inputs.mode === "temperature" && (
        <div>
          <Label htmlFor="wavelength" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-1">
            <Waves className="w-5 h-5 text-purple-600" /> Peak Wavelength (meters, m)
          </Label>
          <Input
            id="wavelength"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 5.0e-7"
            value={inputs.wavelength}
            onChange={(e) => handleInputChange("wavelength", e.target.value)}
            aria-describedby="wavelength-help"
          />
          <p id="wavelength-help" className="text-sm text-slate-500 mt-1">
            Enter peak wavelength in meters (m). Must be &gt; 0.
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          aria-label="Calculate result"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ mode: "peakWavelength", temperature: "", wavelength: "" })}
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
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">{results.formulaUsed || "Calculated Result"}</p>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Blackbody Peak (Wien's Law) Estimator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Wien's displacement law is a fundamental principle in physics that relates the temperature of a blackbody to the wavelength at which it emits radiation most intensely. Specifically, the product of the absolute temperature (T) and the peak wavelength (λ_peak) is a constant, known as Wien's displacement constant. This relationship allows scientists to estimate the temperature of stars and other hot objects by measuring their peak emission wavelength.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The law is expressed mathematically as λ_peak × T = b, where b ≈ 2.8977729 × 10<sup>-3</sup> m·K. This means that as the temperature of an object increases, the peak wavelength of its emitted radiation shifts toward shorter wavelengths. For example, hotter stars emit peak radiation in the ultraviolet or visible spectrum, while cooler objects peak in the infrared.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This estimator tool helps you calculate either the peak wavelength given a temperature or the temperature given a peak wavelength. It is essential in astrophysics, thermal imaging, and material science for understanding thermal radiation properties.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`λ_peak × T = b

Where:
  λ_peak = Peak wavelength of blackbody radiation (meters, m)
  T = Absolute temperature of the blackbody (Kelvin, K)
  b = Wien's displacement constant ≈ 2.8977729 × 10⁻³ m·K

Rearranged formulas:
  λ_peak = b / T
  T = b / λ_peak

Note:
  - Temperature T must be &gt; 0 K.
  - Wavelength λ_peak must be &gt; 0 m.`}
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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">

          <li>
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Wien's%20Displacement%20Law" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Wien's Displacement Law - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              A comprehensive encyclopedia article providing an in-depth overview of Wien's Displacement Law, including historical context, mathematical derivations, and key applications.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Wien's%20Displacement%20Law" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Wien's Displacement Law - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Watch free educational video tutorials and complete interactive practice exercises on Wien's Displacement Law at Khan Academy, perfect for visual learners.
            </p>
          </li>
          <li>
            <a href="https://www.physicsclassroom.com/search?q=Wien's%20Displacement%20Law" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Wien's Displacement Law - The Physics Classroom
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Explore student-friendly tutorials, interactives, and concept builders related to Wien's Displacement Law designed to improve understanding of physics principles.
            </p>
          </li>
          <li>
            <a href="http://hyperphysics.phy-astr.gsu.edu/hbase/hph.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Wien's Displacement Law - HyperPhysics
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Navigate the HyperPhysics concept map to find concise summaries and calculation examples for Wien's Displacement Law.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Blackbody Peak (Wien's Law) Estimator"
      description="Estimate peak wavelength of blackbody radiation. Use Wien's Displacement Law to find the temperature of stars and hot objects."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "λ_peak × T = b",
        variables: [
          { symbol: "λ_peak", description: "Peak wavelength of blackbody radiation (meters, m)" },
          { symbol: "T", description: "Absolute temperature of the blackbody (Kelvin, K)" },
          { symbol: "b", description: "Wien's displacement constant ≈ 2.8977729 × 10⁻³ m·K" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the peak wavelength of a blackbody at temperature 5800 K (approximate surface temperature of the Sun).",
        steps: [
          {
            label: "1",
            explanation: "Identify the temperature T = 5800 K.",
          },
          {
            label: "2",
            explanation: "Use Wien's displacement law: λ_peak = b / T.",
          },
          {
            label: "3",
            explanation: `Calculate λ_peak = 2.8977729 × 10⁻³ m·K / 5800 K ≈ 4.996 × 10⁻⁷ m (or 499.6 nm).`,
          },
          {
            label: "4",
            explanation: "Interpret the result: The Sun's peak emission is near 500 nm, in the visible light spectrum.",
          },
        ],
        result: "Peak wavelength ≈ 4.996 × 10⁻⁷ meters (499.6 nm).",
      }}
      relatedCalculators={relatedCalculators}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "formula", label: "Formula" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References & Resources" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}