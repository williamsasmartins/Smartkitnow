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

export default function HalfLifeExponentialDecayCalculator() {
  /*
    Inputs:
    - Calculation Mode: "Remaining Quantity" or "Elapsed Time"
    - Initial Quantity (N0) [units: arbitrary, user-defined]
    - Half-Life (t½) [units: seconds, minutes, hours, days, years]
    - Time Elapsed (t) [units: same as half-life]
    - Remaining Quantity (N) [units: same as initial quantity]

    Formulas:
    - Remaining Quantity: N = N0 * 2^(-t / t½)
    - Elapsed Time: t = -t½ * log2(N / N0)

    We will allow user to select mode, then input relevant fields.
  */

  const [inputs, setInputs] = useState({
    mode: "remaining", // "remaining" or "elapsed"
    initialQuantity: "",
    halfLife: "",
    timeElapsed: "",
    remainingQuantity: "",
    unitQuantity: "",
    unitTime: "seconds",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Time units conversion to seconds for calculation
  const timeUnitToSeconds = useMemo(
    () => ({
      seconds: 1,
      minutes: 60,
      hours: 3600,
      days: 86400,
      years: 3.154e7, // average year in seconds (365.25 days)
    }),
    []
  );

  const results = useMemo(() => {
    const {
      mode,
      initialQuantity,
      halfLife,
      timeElapsed,
      remainingQuantity,
      unitQuantity,
      unitTime,
    } = inputs;

    // Parse inputs to numbers
    const N0 = parseFloat(initialQuantity);
    const tHalf = parseFloat(halfLife);
    const t = parseFloat(timeElapsed);
    const N = parseFloat(remainingQuantity);

    // Validate half-life and initial quantity
    if (isNaN(N0) || N0 <= 0) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: "Initial quantity must be a positive number.",
        formulaUsed: null,
      };
    }
    if (isNaN(tHalf) || tHalf <= 0) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: "Half-life must be a positive number.",
        formulaUsed: null,
      };
    }

    // Convert half-life to seconds for internal calc
    const tHalfSec = tHalf * (timeUnitToSeconds[unitTime] ?? 1);

    if (mode === "remaining") {
      // Calculate remaining quantity N = N0 * 2^(-t / t½)
      if (isNaN(t) || t < 0) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: "Elapsed time must be a non-negative number.",
          formulaUsed: null,
        };
      }
      // Convert elapsed time to seconds
      const tSec = t * (timeUnitToSeconds[unitTime] ?? 1);

      // Calculate decay factor
      const exponent = -tSec / tHalfSec;
      const remaining = N0 * Math.pow(2, exponent);

      // Format result with scientific notation if very small or large
      const formattedRemaining =
        remaining < 0.001 || remaining > 1e6
          ? remaining.toExponential(4)
          : remaining.toFixed(6).replace(/\.?0+$/, "");

      return {
        value: `${formattedRemaining} ${unitQuantity || ""}`.trim(),
        label: "Remaining Quantity",
        subtext: `Calculated using N = N₀ × 2^(-t / t½) with t in ${unitTime}`,
        warning: null,
        formulaUsed: "N = N₀ × 2^(-t / t½)",
      };
    } else if (mode === "elapsed") {
      // Calculate elapsed time t = -t½ * log2(N / N0)
      if (isNaN(N) || N <= 0) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: "Remaining quantity must be a positive number.",
          formulaUsed: null,
        };
      }
      if (N > N0) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: "Remaining quantity cannot be greater than initial quantity.",
          formulaUsed: null,
        };
      }

      // Calculate elapsed time in seconds
      const ratio = N / N0;
      const elapsedSec = -tHalfSec * (Math.log2(ratio));

      // Convert elapsed time back to selected unit
      const elapsedInUnit = elapsedSec / (timeUnitToSeconds[unitTime] ?? 1);

      // Format result
      const formattedElapsed =
        elapsedInUnit < 0.001 || elapsedInUnit > 1e6
          ? elapsedInUnit.toExponential(4)
          : elapsedInUnit.toFixed(6).replace(/\.?0+$/, "");

      return {
        value: `${formattedElapsed} ${unitTime}`,
        label: "Elapsed Time",
        subtext: `Calculated using t = -t½ × log₂(N / N₀)`,
        warning: null,
        formulaUsed: "t = -t½ × log₂(N / N₀)",
      };
    }

    return {
      value: "Waiting...",
      label: "",
      subtext: "",
      warning: null,
      formulaUsed: null,
    };
  }, [inputs, timeUnitToSeconds]);

  const faqs = [
    {
      question: "What is half-life in radioactive decay?",
      answer:
        "Half-life is the time required for a quantity of a radioactive substance to reduce to half its initial amount. It is a constant characteristic of each isotope and is used to describe the exponential decay process in nuclear physics and chemistry.",
    },
    {
      question: "How does exponential decay relate to half-life?",
      answer:
        "Exponential decay describes the process where the quantity decreases at a rate proportional to its current value. Half-life is the time interval in which the quantity halves, mathematically expressed as N = N₀ × 2^(-t / t½), linking time and remaining quantity.",
    },
    {
      question: "Can I calculate elapsed time if I know remaining quantity?",
      answer:
        "Yes, by rearranging the decay formula, elapsed time can be calculated as t = -t½ × log₂(N / N₀). This allows determination of how much time has passed given initial and remaining quantities.",
    },
    {
      question: "Why must units for time be consistent?",
      answer:
        "Consistency in time units ensures accurate calculations. Mixing units like seconds and hours without conversion leads to incorrect results. This calculator converts all time inputs internally to seconds for precision.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Mode Select */}
      <div>
        <Label htmlFor="mode" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-1">
          <FlaskConical className="w-5 h-5 text-blue-600" />
          Calculation Mode
        </Label>
        <Select
          value={inputs.mode}
          onValueChange={(val) => handleInputChange("mode", val)}
          id="mode"
          aria-label="Calculation Mode"
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="remaining" aria-label="Calculate Remaining Quantity">
              Remaining Quantity (N)
            </SelectItem>
            <SelectItem value="elapsed" aria-label="Calculate Elapsed Time">
              Elapsed Time (t)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Initial Quantity */}
      <div>
        <Label htmlFor="initialQuantity" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-1">
          <Scale className="w-5 h-5 text-green-600" />
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
        <p id="initialQuantityHelp" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter the starting amount of the substance.
        </p>
      </div>

      {/* Unit for Quantity */}
      <div>
        <Label htmlFor="unitQuantity" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-1">
          <Waves className="w-5 h-5 text-teal-600" />
          Unit for Quantity (optional)
        </Label>
        <Input
          id="unitQuantity"
          type="text"
          placeholder="e.g. grams, atoms"
          value={inputs.unitQuantity}
          onChange={(e) => handleInputChange("unitQuantity", e.target.value)}
          aria-describedby="unitQuantityHelp"
        />
        <p id="unitQuantityHelp" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Specify units like grams, atoms, or leave blank.
        </p>
      </div>

      {/* Half-Life */}
      <div>
        <Label htmlFor="halfLife" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-1">
          <Thermometer className="w-5 h-5 text-red-600" />
          Half-Life (t½)
        </Label>
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
        <p id="halfLifeHelp" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter the half-life duration.
        </p>
      </div>

      {/* Time Unit Select */}
      <div>
        <Label htmlFor="unitTime" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-1">
          <Orbit className="w-5 h-5 text-purple-600" />
          Time Unit
        </Label>
        <Select
          value={inputs.unitTime}
          onValueChange={(val) => handleInputChange("unitTime", val)}
          id="unitTime"
          aria-label="Time Unit"
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seconds">Seconds (s)</SelectItem>
            <SelectItem value="minutes">Minutes (min)</SelectItem>
            <SelectItem value="hours">Hours (h)</SelectItem>
            <SelectItem value="days">Days (d)</SelectItem>
            <SelectItem value="years">Years (yr)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conditional Inputs */}
      {inputs.mode === "remaining" && (
        <div>
          <Label htmlFor="timeElapsed" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-1">
            <Zap className="w-5 h-5 text-yellow-600" />
            Elapsed Time (t)
          </Label>
          <Input
            id="timeElapsed"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 10"
            value={inputs.timeElapsed}
            onChange={(e) => handleInputChange("timeElapsed", e.target.value)}
            aria-describedby="timeElapsedHelp"
          />
          <p id="timeElapsedHelp" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enter the elapsed time since start.
          </p>
        </div>
      )}

      {inputs.mode === "elapsed" && (
        <div>
          <Label htmlFor="remainingQuantity" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-1">
            <Atom className="w-5 h-5 text-indigo-600" />
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
          <p id="remainingQuantityHelp" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enter the remaining amount of the substance.
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state with same values
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate"
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
              timeElapsed: "",
              remainingQuantity: "",
              unitQuantity: "",
              unitTime: "seconds",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Waiting..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" aria-live="polite">
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
          Understanding Half-Life / Exponential Decay Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The half-life of a radioactive substance is the time it takes for half of the original quantity to decay. This process follows an exponential decay pattern, meaning the quantity decreases by a consistent fraction over equal time intervals. The calculator helps you determine either the remaining quantity after a certain elapsed time or the time elapsed given the remaining quantity, based on the half-life.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Exponential decay is characterized by the formula N = N₀ × 2<sup>-t / t½</sup>, where N₀ is the initial quantity, t is the elapsed time, and t½ is the half-life. This formula shows that the quantity halves every t½ units of time. Understanding this concept is crucial in fields such as nuclear physics, radiometric dating, and pharmacokinetics.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator also allows you to reverse the problem: if you know the remaining quantity, you can find out how much time has passed since the initial measurement using the formula t = -t½ × log₂(N / N₀). This is especially useful in dating archaeological finds or determining the age of radioactive samples.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Always ensure that the units for time are consistent throughout your inputs to get accurate results. The calculator supports common time units such as seconds, minutes, hours, days, and years, converting them internally for precise calculations.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Remaining Quantity:
N = N₀ × 2^{-t / t½}

Elapsed Time:
t = -t½ × log₂(N / N₀)

Where:
N₀ = Initial quantity (e.g., grams, atoms)
N = Remaining quantity after time t
t = Elapsed time
t½ = Half-life duration

Note:
- log₂ denotes logarithm base 2.
- Ensure units of time (t and t½) are consistent.`}
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
      title="Half-Life / Exponential Decay Calculator"
      description="Calculate radioactive half-life. Solve exponential decay problems to determine remaining quantity or elapsed time."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `N = N₀ × 2^{-t / t½}\nt = -t½ × log₂(N / N₀)`,
        variables: [
          { symbol: "N₀", description: "Initial quantity (e.g., grams, atoms)" },
          { symbol: "N", description: "Remaining quantity after time t" },
          { symbol: "t", description: "Elapsed time" },
          { symbol: "t½", description: "Half-life duration" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Suppose you start with 200 grams of a radioactive substance with a half-life of 5 years. You want to find out how much remains after 12 years.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the known values: N₀ = 200 grams, t½ = 5 years, t = 12 years.",
          },
          {
            label: "2",
            explanation:
              "Use the formula N = N₀ × 2^{-t / t½} to calculate the remaining quantity.",
          },
          {
            label: "3",
            explanation:
              "Calculate the exponent: -12 / 5 = -2.4, then compute 2^{-2.4} ≈ 0.189.",
          },
          {
            label: "4",
            explanation:
              "Multiply initial quantity by decay factor: 200 × 0.189 ≈ 37.8 grams remaining.",
          },
        ],
        result: "After 12 years, approximately 37.8 grams of the substance remains.",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Momentum & Impulse Calculator", url: "/science/momentum-impulse-calculator", icon: "🧪" },
        { title: "Force, Work & Energy Calculator", url: "/science/force-work-energy-calculator", icon: "🚀" },
        { title: "Heat Transfer (Conduction) Calculator", url: "/science/heat-transfer-conduction", icon: "🔥" },
        { title: "Molar Mass Calculator", url: "/science/molar-mass-calculator", icon: "🧪" },
        { title: "Thin Lens Solver", url: "/science/thin-lens-solver", icon: "🌈" },
        { title: "Blackbody Peak (Wien's Law) Estimator", url: "/science/blackbody-peak-wien-law-estimator", icon: "🧪" },
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