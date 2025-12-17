import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, Info, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BlackbodyPeakWienLawEstimatorCalculator() {
  // Inputs: User can input either Temperature (K) to get peak wavelength (m),
  // or Peak Wavelength (nm or m) to get Temperature (K).
  // We'll allow user to select input type and unit for wavelength.
  const [inputs, setInputs] = useState({
    inputType: "temperature", // "temperature" or "wavelength"
    temperature: "", // in Kelvin
    wavelength: "", // in nm or m depending on unit selected
    wavelengthUnit: "nm", // "nm" or "m"
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Constants
  // Wien's displacement constant b = 2.897771955 × 10⁻³ m·K (CODATA 2018)
  const WIEN_DISPLACEMENT_CONSTANT = 2.897771955e-3; // meters kelvin

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    // Parse inputs safely
    const temp = parseFloat(inputs.temperature);
    const wlRaw = parseFloat(inputs.wavelength);
    const wlUnit = inputs.wavelengthUnit;

    // Validation and warnings
    let warning = null;

    if (inputs.inputType === "temperature") {
      if (isNaN(temp) || temp <= 0) {
        return {
          value: "Waiting...",
          label: "Enter a valid temperature &gt; 0 K",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
      // Calculate peak wavelength λ_peak = b / T
      const lambdaPeakMeters = WIEN_DISPLACEMENT_CONSTANT / temp; // meters

      // Convert to nm if preferred
      const lambdaPeakDisplay =
        wlUnit === "nm" ? lambdaPeakMeters * 1e9 : lambdaPeakMeters;

      // Format output: scientific notation if very small or large
      const displayVal =
        lambdaPeakDisplay < 0.001 || lambdaPeakDisplay > 10000
          ? lambdaPeakDisplay.toExponential(4)
          : lambdaPeakDisplay.toFixed(4);

      const unitLabel = wlUnit === "nm" ? "nm" : "m";

      return {
        value: `${displayVal} ${unitLabel}`,
        label: "Peak Wavelength of Blackbody Radiation",
        subtext:
          "Calculated using Wien's Displacement Law: λ_peak = b / T, where b = 2.897771955 × 10⁻³ m·K",
        warning,
        formulaUsed: "λ_peak = b / T",
      };
    } else if (inputs.inputType === "wavelength") {
      if (isNaN(wlRaw) || wlRaw <= 0) {
        return {
          value: "Waiting...",
          label: "Enter a valid peak wavelength &gt; 0",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
      // Convert wavelength to meters if input is in nm
      const lambdaMeters = wlUnit === "nm" ? wlRaw * 1e-9 : wlRaw;

      // Calculate temperature T = b / λ_peak
      const temperatureKelvin = WIEN_DISPLACEMENT_CONSTANT / lambdaMeters;

      if (temperatureKelvin <= 0) {
        warning = "Calculated temperature is not physically valid.";
      }

      // Format output: scientific notation if very small or large
      const displayVal =
        temperatureKelvin < 0.001 || temperatureKelvin > 10000
          ? temperatureKelvin.toExponential(4)
          : temperatureKelvin.toFixed(2);

      return {
        value: `${displayVal} K`,
        label: "Temperature of Blackbody",
        subtext:
          "Calculated using Wien's Displacement Law: T = b / λ_peak, where b = 2.897771955 × 10⁻³ m·K",
        warning,
        formulaUsed: "T = b / λ_peak",
      };
    }

    return {
      value: "Waiting...",
      label: "Select input type and enter value",
      subtext: "",
      warning: null,
      formulaUsed: null,
    };
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is Wien's Displacement Law?",
      answer:
        "Wien's Displacement Law describes the relationship between the temperature of a blackbody and the wavelength at which it emits radiation most intensely. It states that the peak wavelength is inversely proportional to the temperature, allowing scientists to estimate temperature by measuring emitted light. This principle is fundamental in astrophysics and thermal physics.",
    },
    {
      question: "Where is Wien's Law applied in real life?",
      answer:
        "Wien's Law is crucial in astronomy for determining the surface temperatures of stars by analyzing their emitted spectra. It is also used in thermal imaging, incandescent light bulb design, and understanding heat radiation in engineering. This law helps in non-contact temperature measurements and studying cosmic microwave background radiation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="inputType" className="mb-1 font-semibold">
          Select Input Type
        </Label>
        <Select
          value={inputs.inputType}
          onValueChange={(val) => handleInputChange("inputType", val)}
        >
          <SelectTrigger id="inputType" className="w-full">
            <SelectValue placeholder="Select input type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="temperature">
              Temperature (Kelvin)
            </SelectItem>
            <SelectItem value="wavelength">
              Peak Wavelength
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {inputs.inputType === "temperature" && (
        <div>
          <Label htmlFor="temperature" className="mb-1 font-semibold">
            Temperature (Kelvin)
          </Label>
          <Input
            id="temperature"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 5800"
            value={inputs.temperature}
            onChange={(e) => handleInputChange("temperature", e.target.value)}
          />
          <p className="text-sm text-slate-500 mt-1">
            Enter temperature in Kelvin (K). Must be &gt; 0.
          </p>
        </div>
      )}

      {inputs.inputType === "wavelength" && (
        <>
          <div>
            <Label htmlFor="wavelength" className="mb-1 font-semibold">
              Peak Wavelength
            </Label>
            <Input
              id="wavelength"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 500"
              value={inputs.wavelength}
              onChange={(e) => handleInputChange("wavelength", e.target.value)}
            />
            <p className="text-sm text-slate-500 mt-1">
              Enter peak wavelength value. Must be &gt; 0.
            </p>
          </div>
          <div>
            <Label htmlFor="wavelengthUnit" className="mb-1 font-semibold">
              Unit
            </Label>
            <Select
              value={inputs.wavelengthUnit}
              onValueChange={(val) => handleInputChange("wavelengthUnit", val)}
            >
              <SelectTrigger id="wavelengthUnit" className="w-full">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nm">Nanometers (nm)</SelectItem>
                <SelectItem value="m">Meters (m)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No explicit calculation trigger needed; calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              inputType: "temperature",
              temperature: "",
              wavelength: "",
              wavelengthUnit: "nm",
            })
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
              <strong>Science Fact:</strong> Wien's Law helps astronomers
              determine star temperatures by measuring their color (peak
              wavelength). Always ensure units are consistent when calculating.
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
          Understanding Blackbody Peak (Wien's Law) Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Wien's Displacement Law is a fundamental principle in thermal physics
          and astrophysics that relates the temperature of a blackbody to the
          wavelength at which it emits radiation most intensely. A blackbody is
          an idealized physical object that absorbs all incident radiation and
          re-emits energy perfectly according to its temperature.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The law states that the peak wavelength (&lambda;<sub>peak</sub>)
          of the emitted radiation is inversely proportional to the absolute
          temperature (T) of the blackbody. This means hotter objects emit
          radiation with shorter peak wavelengths, shifting towards the blue
          end of the spectrum, while cooler objects peak at longer wavelengths,
          towards the red or infrared.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This estimator allows you to calculate either the peak wavelength if
          you know the temperature, or the temperature if you know the peak
          wavelength. It is widely used in astronomy to estimate star
          temperatures and in engineering for thermal radiation analysis.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula & Variables
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`λ_peak = b / T

or equivalently,

T = b / λ_peak

where:
  λ_peak = Peak wavelength of blackbody radiation (meters, m)
  T = Absolute temperature of the blackbody (Kelvin, K)
  b = Wien's displacement constant = 2.897771955 × 10⁻³ m·K`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Step-by-Step Example
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using Wien's Law: Find the peak
          wavelength emitted by the Sun, which has an approximate surface
          temperature of 5778 K.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> T = 5778 K, b = 2.897771955 × 10⁻³ m·K
          </li>
          <li>
            <strong>Step 1:</strong> Calculate λ_peak = b / T = 2.897771955 ×
            10⁻³ / 5778 ≈ 5.013 × 10⁻⁷ m
          </li>
          <li>
            <strong>Step 2:</strong> Convert meters to nanometers: 5.013 ×
            10⁻⁷ m = 501.3 nm
          </li>
          <li>
            <strong>Result:</strong> The Sun's peak emission wavelength is about
            501 nm, which is in the visible green portion of the spectrum.
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
      title="Blackbody Peak (Wien's Law) Estimator"
      description="Estimate peak wavelength of blackbody radiation. Use Wien's Displacement Law to find the temperature of stars and hot objects."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `λ_peak = b / T  or  T = b / λ_peak`,
        variables: [
          {
            symbol: "λ_peak",
            description: "Peak wavelength of blackbody radiation (meters, m)",
          },
          {
            symbol: "T",
            description: "Absolute temperature of the blackbody (Kelvin, K)",
          },
          {
            symbol: "b",
            description: "Wien's displacement constant = 2.897771955 × 10⁻³ m·K",
          },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the peak wavelength emitted by the Sun with surface temperature 5778 K.",
        steps: [
          {
            label: "1",
            explanation:
              "Use Wien's Law: λ_peak = b / T = 2.897771955 × 10⁻³ m·K / 5778 K",
          },
          {
            label: "2",
            explanation:
              "Calculate λ_peak ≈ 5.013 × 10⁻⁷ meters, convert to 501.3 nm",
          },
          {
            label: "3",
            explanation:
              "Interpret result: Sun's peak emission is in visible green light.",
          },
        ],
        result: "Peak wavelength ≈ 501.3 nm",
      }}
      relatedCalculators={[
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
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