import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, Thermometer, Info, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BlackbodyPeakWienLawEstimatorCalculator() {
  // Inputs: Temperature (K) or Wavelength (nm) - user chooses which to input
  const [inputs, setInputs] = useState<{ mode: "temperature" | "wavelength"; temperature?: string; wavelength?: string }>({
    mode: "temperature",
    temperature: "",
    wavelength: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Constants
  const WIEN_CONSTANT = 2.8977729e-3; // Wien's displacement constant in meters kelvin (m·K)

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const mode = inputs.mode;
    const tempStr = inputs.temperature?.trim() || "";
    const waveStr = inputs.wavelength?.trim() || "";

    // Validation helpers
    const isPositiveNumber = (val: string) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    };

    if (mode === "temperature") {
      if (!isPositiveNumber(tempStr)) {
        return {
          value: "Waiting...",
          label: "Enter a valid temperature &gt; 0",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
      const T = Number(tempStr); // Kelvin
      // Wien's Law: λ_peak = b / T
      // λ_peak in meters, convert to nanometers (1 m = 1e9 nm)
      const lambdaPeak_m = WIEN_CONSTANT / T;
      const lambdaPeak_nm = lambdaPeak_m * 1e9;

      // Format output: use scientific notation if very small or large
      const displayVal =
        lambdaPeak_nm < 0.001 || lambdaPeak_nm > 10000
          ? lambdaPeak_nm.toExponential(4)
          : lambdaPeak_nm.toFixed(4);

      return {
        value: `${displayVal} nm`,
        label: "Peak Wavelength",
        subtext: `Calculated using Wien's Displacement Law with temperature ${T} K`,
        warning: null,
        formulaUsed: "λ_peak = b / T",
      };
    } else {
      // mode === "wavelength"
      if (!isPositiveNumber(waveStr)) {
        return {
          value: "Waiting...",
          label: "Enter a valid wavelength &gt; 0",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
      const lambda_nm = Number(waveStr);
      // Convert nm to meters
      const lambda_m = lambda_nm / 1e9;
      // Wien's Law rearranged: T = b / λ_peak
      const T = WIEN_CONSTANT / lambda_m;

      // Format output: use scientific notation if very small or large
      const displayVal = T < 0.001 || T > 10000 ? T.toExponential(4) : T.toFixed(2);

      return {
        value: `${displayVal} K`,
        label: "Temperature",
        subtext: `Calculated using Wien's Displacement Law with wavelength ${lambda_nm} nm`,
        warning: null,
        formulaUsed: "T = b / λ_peak",
      };
    }
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is Wien's Displacement Law used for?",
      answer:
        "Wien's Displacement Law is fundamental in astrophysics and thermal physics. It allows scientists to determine the temperature of stars and other hot objects by measuring the peak wavelength of their emitted radiation. This law is also used in designing thermal cameras and understanding blackbody radiation in laboratory settings.",
    },
    {
      question: "Why must temperature be in Kelvin for Wien's Law?",
      answer:
        "Temperature must be in Kelvin because Wien's Displacement Law is derived from absolute temperature scales. Using Celsius or Fahrenheit would yield incorrect results since these scales do not start at absolute zero. Kelvin ensures the physical accuracy of the relationship between temperature and peak wavelength.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div>
        <Label htmlFor="mode" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-blue-600" /> Select Input Mode
        </Label>
        <Select
          value={inputs.mode}
          onValueChange={(val) => setInputs({ mode: val as "temperature" | "wavelength", temperature: "", wavelength: "" })}
          id="mode"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose input mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="temperature">Temperature (Kelvin)</SelectItem>
            <SelectItem value="wavelength">Peak Wavelength (Nanometers)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      {inputs.mode === "temperature" && (
        <div>
          <Label htmlFor="temperature" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-red-600" /> Temperature (Kelvin)
          </Label>
          <Input
            id="temperature"
            type="number"
            min="0"
            step="any"
            placeholder="e.g., 5778"
            value={inputs.temperature || ""}
            onChange={(e) => handleInputChange("temperature", e.target.value)}
            aria-describedby="temperature-help"
          />
          <p id="temperature-help" className="text-xs text-slate-500 mt-1">
            Enter temperature in Kelvin (K). Must be &gt; 0.
          </p>
        </div>
      )}

      {inputs.mode === "wavelength" && (
        <div>
          <Label htmlFor="wavelength" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Waves className="w-5 h-5 text-purple-600" /> Peak Wavelength (Nanometers)
          </Label>
          <Input
            id="wavelength"
            type="number"
            min="0"
            step="any"
            placeholder="e.g., 500"
            value={inputs.wavelength || ""}
            onChange={(e) => handleInputChange("wavelength", e.target.value)}
            aria-describedby="wavelength-help"
          />
          <p id="wavelength-help" className="text-xs text-slate-500 mt-1">
            Enter peak wavelength in nanometers (nm). Must be &gt; 0.
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed; calculation is reactive
          }}
          aria-label="Calculate Blackbody Peak or Temperature"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ mode: inputs.mode, temperature: "", wavelength: "" })}
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
              <strong>Science Fact:</strong> Wien's Law helps astronomers estimate star temperatures by measuring their color (peak wavelength). Always ensure temperature is in Kelvin and wavelength in nanometers for accurate results.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Blackbody Peak (Wien&apos;s Law) Estimator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Wien&apos;s Displacement Law describes the relationship between the temperature of a blackbody and the wavelength at which it emits radiation most intensely. Specifically, the peak wavelength (&lambda;<sub>peak</sub>) is inversely proportional to the absolute temperature (T) of the object. This law is crucial in physics and astronomy for determining the temperature of stars and other hot objects by analyzing their emitted light spectrum.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The law applies to idealized blackbodies, which absorb all incident radiation and emit a characteristic spectrum dependent only on temperature. Real objects approximate blackbody behavior, allowing practical applications in thermal imaging, astrophysics, and material science. Understanding this relationship helps scientists infer physical properties of distant celestial bodies without direct contact.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          In engineering, Wien&apos;s Law assists in designing sensors and instruments that detect thermal radiation. It also plays a role in climate science, where the Earth&apos;s radiation spectrum is analyzed. The estimator tool here allows users to input either temperature or peak wavelength to find the corresponding value using Wien&apos;s Law.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`λ_peak = b / T

Where:
  λ_peak = Peak wavelength of emitted radiation (meters)
  b = Wien's displacement constant ≈ 2.8977729 × 10⁻³ m·K
  T = Absolute temperature of the blackbody (Kelvin)

Rearranged:
  T = b / λ_peak`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let&apos;s solve a real-world problem: Estimate the peak wavelength of radiation emitted by the Sun, which has an approximate surface temperature of 5778 K.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Given:</strong> Temperature, T = 5778 K</li>
          <li><strong>Step 1:</strong> Use Wien&apos;s Law: λ_peak = b / T = 2.8977729×10⁻³ m·K / 5778 K</li>
          <li><strong>Step 2:</strong> Calculate λ_peak ≈ 5.015 × 10⁻⁷ meters</li>
          <li><strong>Step 3:</strong> Convert meters to nanometers: 5.015 × 10⁻⁷ m × 10⁹ nm/m = 501.5 nm</li>
          <li><strong>Result:</strong> The Sun&apos;s peak emission wavelength is approximately 501.5 nm, which is in the visible light spectrum (green light).</li>
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
      title="Blackbody Peak (Wien's Law) Estimator"
      description="Estimate peak wavelength of blackbody radiation. Use Wien's Displacement Law to find the temperature of stars and hot objects."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "λ_peak = b / T",
        variables: [
          { symbol: "λ_peak", description: "Peak wavelength of emitted radiation (meters)" },
          { symbol: "b", description: "Wien's displacement constant ≈ 2.8977729 × 10⁻³ m·K" },
          { symbol: "T", description: "Absolute temperature of the blackbody (Kelvin)" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Estimating the peak wavelength of the Sun's radiation given its surface temperature.",
        steps: [
          { label: "1", explanation: "Identify the temperature: T = 5778 K." },
          { label: "2", explanation: "Apply Wien's Law: λ_peak = b / T." },
          { label: "3", explanation: "Calculate λ_peak and convert to nanometers." },
        ],
        result: "The Sun's peak wavelength is approximately 501.5 nm, in the visible spectrum.",
      }}
      relatedCalculators={[
        { title: "Orbital Period", url: "/science/orbital-period", icon: "Orbit" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "Waves" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "FlaskConical" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "Zap" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "Atom" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "FlaskConical" },
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