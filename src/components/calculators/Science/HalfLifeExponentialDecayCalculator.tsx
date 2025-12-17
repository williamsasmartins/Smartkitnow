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

export default function HalfLifeExponentialDecayCalculator() {
  // Inputs:
  // - initialQuantity (N0) in grams or any unit (user-defined)
  // - halfLife (T1/2) in seconds, minutes, hours, days, years (select)
  // - elapsedTime (t) in same units as halfLife
  // - output: remainingQuantity (N) or elapsedTime (t) depending on calculation mode

  // Calculation modes:
  // 1. Calculate Remaining Quantity (N) given N0, T1/2, t
  // 2. Calculate Elapsed Time (t) given N0, T1/2, N

  // We'll add a select to choose calculation mode.

  const [inputs, setInputs] = useState({
    mode: "remaining", // "remaining" or "elapsed"
    initialQuantity: "",
    halfLife: "",
    elapsedTime: "",
    remainingQuantity: "",
    halfLifeUnit: "years",
    elapsedTimeUnit: "years",
  });

  const timeUnits = [
    { label: "Seconds", value: "seconds", factor: 1 },
    { label: "Minutes", value: "minutes", factor: 60 },
    { label: "Hours", value: "hours", factor: 3600 },
    { label: "Days", value: "days", factor: 86400 },
    { label: "Years", value: "years", factor: 31557600 }, // Average year (365.25 days)
  ];

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Helper: convert time input to seconds for calculation
  const convertToSeconds = useCallback(
    (val: string, unit: string) => {
      const num = parseFloat(val);
      if (isNaN(num) || num < 0) return null;
      const unitObj = timeUnits.find((u) => u.value === unit);
      if (!unitObj) return null;
      return num * unitObj.factor;
    },
    [timeUnits]
  );

  // Helper: convert seconds back to selected unit for display
  const convertFromSeconds = useCallback(
    (val: number, unit: string) => {
      const unitObj = timeUnits.find((u) => u.value === unit);
      if (!unitObj) return val;
      return val / unitObj.factor;
    },
    [timeUnits]
  );

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    // Parse inputs
    const N0 = parseFloat(inputs.initialQuantity);
    const halfLifeVal = parseFloat(inputs.halfLife);
    const elapsedTimeVal = parseFloat(inputs.elapsedTime);
    const remainingQuantityVal = parseFloat(inputs.remainingQuantity);

    // Validate half-life
    if (isNaN(halfLifeVal) || halfLifeVal <= 0) {
      return {
        value: "Waiting...",
        label: "Enter valid half-life &gt; 0",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Convert half-life to seconds
    const halfLifeSec = convertToSeconds(inputs.halfLife, inputs.halfLifeUnit);
    if (halfLifeSec === null) {
      return {
        value: "Waiting...",
        label: "Invalid half-life unit or value",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Constants
    // Decay constant lambda = ln(2) / T1/2
    const ln2 = Math.log(2);
    const lambda = ln2 / halfLifeSec;

    if (inputs.mode === "remaining") {
      // Calculate remaining quantity N given N0, T1/2, t
      if (isNaN(N0) || N0 <= 0) {
        return {
          value: "Waiting...",
          label: "Enter valid initial quantity &gt; 0",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
      if (isNaN(elapsedTimeVal) || elapsedTimeVal < 0) {
        return {
          value: "Waiting...",
          label: "Enter valid elapsed time &ge; 0",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
      // Convert elapsed time to seconds
      const tSec = convertToSeconds(inputs.elapsedTime, inputs.elapsedTimeUnit);
      if (tSec === null) {
        return {
          value: "Waiting...",
          label: "Invalid elapsed time unit or value",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }

      // N = N0 * (1/2)^(t / T1/2) = N0 * e^(-lambda * t)
      const N = N0 * Math.exp(-lambda * tSec);

      // Format output quantity with scientific notation if needed
      const displayN =
        N !== 0 && (N >= 10000 || N < 0.001)
          ? N.toExponential(4)
          : N.toFixed(4);

      return {
        value: `${displayN} units`,
        label: "Remaining Quantity (N)",
        subtext:
          `Calculated using elapsed time (${elapsedTimeVal} ${inputs.elapsedTimeUnit}) and half-life (${halfLifeVal} ${inputs.halfLifeUnit}).`,
        warning: null,
        formulaUsed: "N = N₀ × (1/2)^(t / T₁/₂) = N₀ × e^(−λt)",
      };
    } else {
      // mode === "elapsed"
      // Calculate elapsed time t given N0, T1/2, N
      if (isNaN(N0) || N0 <= 0) {
        return {
          value: "Waiting...",
          label: "Enter valid initial quantity &gt; 0",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
      if (isNaN(remainingQuantityVal) || remainingQuantityVal <= 0) {
        return {
          value: "Waiting...",
          label: "Enter valid remaining quantity &gt; 0",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
      if (remainingQuantityVal > N0) {
        return {
          value: "Error",
          label: "Remaining quantity cannot exceed initial quantity",
          subtext: "",
          warning:
            "Remaining quantity (N) must be less than or equal to initial quantity (N₀).",
          formulaUsed: null,
        };
      }

      // t = (ln(N₀ / N)) / λ
      const ratio = N0 / remainingQuantityVal;
      if (ratio <= 0) {
        return {
          value: "Error",
          label: "Invalid ratio N₀ / N",
          subtext: "",
          warning: "Ratio N₀ / N must be &gt; 0.",
          formulaUsed: null,
        };
      }
      const tSec = Math.log(ratio) / lambda;

      // Convert seconds back to selected elapsedTimeUnit for display
      const tInUnit = convertFromSeconds(tSec, inputs.elapsedTimeUnit);

      const displayT =
        tInUnit !== 0 && (tInUnit >= 10000 || tInUnit < 0.001)
          ? tInUnit.toExponential(4)
          : tInUnit.toFixed(4);

      return {
        value: `${displayT} ${inputs.elapsedTimeUnit}`,
        label: "Elapsed Time (t)",
        subtext:
          `Calculated using initial quantity (${N0} units), remaining quantity (${remainingQuantityVal} units), and half-life (${halfLifeVal} ${inputs.halfLifeUnit}).`,
        warning: null,
        formulaUsed: "t = (ln(N₀ / N)) / λ",
      };
    }
  }, [
    inputs,
    convertToSeconds,
    convertFromSeconds,
  ]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is half-life and why is it important?",
      answer:
        "Half-life is the time required for a quantity to reduce to half its initial value. It is a fundamental concept in radioactive decay, pharmacokinetics, and chemical reactions. Understanding half-life helps scientists predict how substances diminish over time, which is crucial for applications like radiometric dating, nuclear medicine, and environmental safety.",
    },
    {
      question: "How does exponential decay apply in real-world scenarios?",
      answer:
        "Exponential decay describes processes where the rate of decrease is proportional to the current amount. This applies to radioactive isotopes losing activity, drug concentration decreasing in the bloodstream, and even cooling of hot objects. Engineers, chemists, and physicists use exponential decay models to design safe nuclear reactors, optimize drug dosages, and analyze natural phenomena.",
    },
    {
      question: "Why must units be consistent in half-life calculations?",
      answer:
        "Consistency in units ensures accurate calculations. Mixing units like seconds and years without conversion leads to incorrect results. This calculator converts all time inputs to seconds internally, allowing precise computation regardless of user input units. Always verify units when performing scientific calculations to maintain reliability.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Mode selector */}
      <div>
        <Label htmlFor="mode" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Atom className="w-5 h-5 text-blue-600" /> Calculation Mode
        </Label>
        <Select
          id="mode"
          value={inputs.mode}
          onValueChange={(val) => setInputs((prev) => ({
            ...prev,
            mode: val,
            // Reset dependent inputs on mode change
            elapsedTime: "",
            remainingQuantity: "",
          }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="remaining">Calculate Remaining Quantity (N)</SelectItem>
            <SelectItem value="elapsed">Calculate Elapsed Time (t)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Initial Quantity */}
      <div>
        <Label htmlFor="initialQuantity" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          Initial Quantity (N₀)
        </Label>
        <Input
          id="initialQuantity"
          type="number"
          min="0"
          step="any"
          placeholder="e.g. 100"
          value={inputs.initialQuantity}
          onChange={(e) => handleInputChange("initialQuantity", e.target.value)}
          aria-describedby="initialQuantityHelp"
        />
        <p id="initialQuantityHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter the initial amount of substance (any units).
        </p>
      </div>

      {/* Half-life input */}
      <div>
        <Label htmlFor="halfLife" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          Half-Life (T₁/₂)
        </Label>
        <div className="flex gap-2">
          <Input
            id="halfLife"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 5"
            value={inputs.halfLife}
            onChange={(e) => handleInputChange("halfLife", e.target.value)}
            aria-describedby="halfLifeHelp"
          />
          <Select
            value={inputs.halfLifeUnit}
            onValueChange={(val) => handleInputChange("halfLifeUnit", val)}
            aria-label="Half-life time unit"
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeUnits.map((unit) => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p id="halfLifeHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter the half-life duration &mdash; time for substance to reduce by half.
        </p>
      </div>

      {/* Conditional inputs based on mode */}
      {inputs.mode === "remaining" ? (
        <div>
          <Label htmlFor="elapsedTime" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            Elapsed Time (t)
          </Label>
          <div className="flex gap-2">
            <Input
              id="elapsedTime"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 10"
              value={inputs.elapsedTime}
              onChange={(e) => handleInputChange("elapsedTime", e.target.value)}
              aria-describedby="elapsedTimeHelp"
            />
            <Select
              value={inputs.elapsedTimeUnit}
              onValueChange={(val) => handleInputChange("elapsedTimeUnit", val)}
              aria-label="Elapsed time unit"
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeUnits.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p id="elapsedTimeHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the elapsed time since start of decay.
          </p>
        </div>
      ) : (
        <div>
          <Label htmlFor="remainingQuantity" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            Remaining Quantity (N)
          </Label>
          <Input
            id="remainingQuantity"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 25"
            value={inputs.remainingQuantity}
            onChange={(e) => handleInputChange("remainingQuantity", e.target.value)}
            aria-describedby="remainingQuantityHelp"
          />
          <p id="remainingQuantityHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the remaining amount of substance after decay.
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
          aria-label="Calculate half-life or exponential decay"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              mode: "remaining",
              initialQuantity: "",
              halfLife: "",
              elapsedTime: "",
              remainingQuantity: "",
              halfLifeUnit: "years",
              elapsedTimeUnit: "years",
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
              <strong>Science Fact:</strong> Always ensure time units are consistent. This calculator converts all times internally to seconds for precise exponential decay calculations.
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
          Understanding Half-Life / Exponential Decay Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Half-life is a fundamental concept in physics and chemistry describing the time it takes for a quantity to reduce to half its initial value due to exponential decay. This process is common in radioactive decay, chemical reactions, and even biological systems. The exponential decay calculator helps determine either the remaining quantity after a certain elapsed time or the elapsed time given initial and remaining quantities.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Exponential decay follows the principle that the rate of decay is proportional to the current amount, leading to a rapid decrease initially that slows over time. This calculator uses precise constants and unit conversions to ensure accurate results, making it a reliable tool for students, educators, and professionals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Applications of half-life calculations include radiometric dating to estimate the age of archaeological finds, determining drug dosage schedules in medicine, and assessing the safety and lifespan of nuclear materials. Understanding and calculating half-life is essential for interpreting natural and engineered decay processes.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`N = N₀ × (1/2)^{t / T₁/₂} = N₀ × e^{−λt}

Where:
  N₀ = Initial quantity (units)
  N = Remaining quantity after time t (units)
  t = Elapsed time (seconds)
  T₁/₂ = Half-life (seconds)
  λ = Decay constant = ln(2) / T₁/₂

Alternatively, to find elapsed time t:

t = (ln(N₀ / N)) / λ`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using the half-life calculator:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> An initial radioactive sample of 200 grams with a half-life of 3 years. Calculate the remaining quantity after 5 years.
          </li>
          <li>
            <strong>Step 1:</strong> Convert half-life and elapsed time to seconds (3 years ≈ 94,672,800 seconds, 5 years ≈ 157,788,000 seconds).
          </li>
          <li>
            <strong>Step 2:</strong> Calculate decay constant λ = ln(2) / T₁/₂ ≈ 7.33 × 10⁻⁹ s⁻¹.
          </li>
          <li>
            <strong>Step 3:</strong> Calculate remaining quantity: N = 200 × e^(−7.33×10⁻⁹ × 157,788,000) ≈ 200 × 0.313 = 62.6 grams.
          </li>
          <li>
            <strong>Result:</strong> After 5 years, approximately 62.6 grams of the sample remains.
          </li>
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
      title="Half-Life / Exponential Decay Calculator"
      description="Calculate radioactive half-life. Solve exponential decay problems to determine remaining quantity or elapsed time."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `N = N₀ × (1/2)^{t / T₁/₂} = N₀ × e^{−λt}\n\nWhere λ = ln(2) / T₁/₂`,
        variables: [
          { symbol: "N₀", description: "Initial quantity (units)" },
          { symbol: "N", description: "Remaining quantity after time t (units)" },
          { symbol: "t", description: "Elapsed time (seconds)" },
          { symbol: "T₁/₂", description: "Half-life (seconds)" },
          { symbol: "λ", description: "Decay constant = ln(2) / T₁/₂" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the remaining quantity of a 200 gram radioactive sample after 5 years, given a half-life of 3 years.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert half-life and elapsed time to seconds: 3 years ≈ 94,672,800 seconds, 5 years ≈ 157,788,000 seconds.",
          },
          {
            label: "2",
            explanation:
              "Calculate decay constant λ = ln(2) / T₁/₂ ≈ 7.33 × 10⁻⁹ s⁻¹.",
          },
          {
            label: "3",
            explanation:
              "Calculate remaining quantity: N = 200 × e^(−λ × t) ≈ 62.6 grams.",
          },
        ],
        result: "After 5 years, approximately 62.6 grams of the sample remains.",
      }}
      relatedCalculators={[
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
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