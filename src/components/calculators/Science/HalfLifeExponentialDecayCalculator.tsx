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
  // - initialQuantity (N0) in grams (or any unit)
  // - halfLife (t1/2) in seconds, minutes, hours, days, years (select)
  // - elapsedTime (t) in same units as halfLife
  // - output: remainingQuantity (N)

  // Units options for time
  const timeUnits = [
    { label: "Seconds", value: "s", factor: 1 },
    { label: "Minutes", value: "min", factor: 60 },
    { label: "Hours", value: "h", factor: 3600 },
    { label: "Days", value: "d", factor: 86400 },
    { label: "Years", value: "yr", factor: 31557600 }, // Average year (365.25 days)
  ];

  const [inputs, setInputs] = useState({
    initialQuantity: "",
    halfLife: "",
    elapsedTime: "",
    halfLifeUnit: "s",
    elapsedTimeUnit: "s",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculation logic in useMemo
  const results = useMemo(() => {
    const N0 = parseFloat(inputs.initialQuantity);
    const tHalf = parseFloat(inputs.halfLife);
    const t = parseFloat(inputs.elapsedTime);
    const halfLifeUnit = inputs.halfLifeUnit;
    const elapsedTimeUnit = inputs.elapsedTimeUnit;

    // Validation
    if (
      isNaN(N0) ||
      N0 <= 0 ||
      isNaN(tHalf) ||
      tHalf <= 0 ||
      isNaN(t) ||
      t < 0 ||
      !halfLifeUnit ||
      !elapsedTimeUnit
    ) {
      return {
        value: "Waiting...",
        label: "Enter valid positive numbers",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Convert halfLife and elapsedTime to seconds for consistency
    const halfLifeFactor = timeUnits.find((u) => u.value === halfLifeUnit)?.factor || 1;
    const elapsedTimeFactor = timeUnits.find((u) => u.value === elapsedTimeUnit)?.factor || 1;

    const tHalfSec = tHalf * halfLifeFactor;
    const tSec = t * elapsedTimeFactor;

    // Exponential decay formula:
    // N = N0 * (1/2)^(t / t1/2)
    // or equivalently:
    // N = N0 * exp(-λ t), where λ = ln(2)/t1/2

    const lambda = Math.log(2) / tHalfSec;
    const N = N0 * Math.exp(-lambda * tSec);

    // Format output: if very small or large, use scientific notation
    const displayVal =
      N > 10000 || N < 0.001 ? N.toExponential(4) : N.toFixed(4);

    return {
      value: `${displayVal} (same units as initial)`,
      label: "Remaining Quantity",
      subtext:
        `Calculated using half-life decay formula. Initial quantity: ${N0} units.`,
      warning: null,
      formulaUsed: "N = N₀ × (1/2)^(t / t₁/₂)",
    };
  }, [inputs, timeUnits]);

  // FAQs
  const faqs = [
    {
      question: "What is half-life and why is it important?",
      answer:
        "Half-life is the time required for a quantity to reduce to half its initial value. It is a fundamental concept in nuclear physics, chemistry, and pharmacology. Understanding half-life helps predict how substances decay or how drugs metabolize in the body, enabling safer and more effective applications.",
    },
    {
      question: "How is exponential decay applied in real-world scenarios?",
      answer:
        "Exponential decay models processes such as radioactive decay, cooling of objects, and drug elimination from the bloodstream. Engineers use it to assess material durability, while environmental scientists track pollutant degradation. This calculator helps visualize and quantify these decay processes accurately.",
    },
    {
      question: "Why must units be consistent when calculating decay?",
      answer:
        "Units must be consistent to ensure accurate calculations. Mixing units like seconds and hours without conversion leads to incorrect results. This calculator converts all time inputs to seconds internally, so users must select appropriate units for half-life and elapsed time.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="initialQuantity" className="mb-1 font-semibold">
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
          />
          <p className="text-sm text-slate-500 mt-1">Units: grams, moles, etc.</p>
        </div>

        <div>
          <Label htmlFor="halfLife" className="mb-1 font-semibold">
            Half-Life (t₁/₂)
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
            />
            <Select
              value={inputs.halfLifeUnit}
              onValueChange={(val) => handleInputChange("halfLifeUnit", val)}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {timeUnits.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-slate-500 mt-1">Time units</p>
        </div>

        <div>
          <Label htmlFor="elapsedTime" className="mb-1 font-semibold">
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
            />
            <Select
              value={inputs.elapsedTimeUnit}
              onValueChange={(val) => handleInputChange("elapsedTimeUnit", val)}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {timeUnits.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-slate-500 mt-1">Time units</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by setting state to current inputs (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              initialQuantity: "",
              halfLife: "",
              elapsedTime: "",
              halfLifeUnit: "s",
              elapsedTimeUnit: "s",
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
              <strong>Science Fact:</strong> Always ensure time units are consistent
              when calculating exponential decay. This calculator converts all time
              inputs to seconds internally for accuracy.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Half-Life / Exponential Decay Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Half-life is a fundamental concept in physics and chemistry describing the
          time it takes for a substance to reduce to half its initial quantity due to
          decay or transformation. This calculator helps you determine the remaining
          quantity of a substance after a given elapsed time, based on its half-life.
          The process follows an exponential decay pattern, meaning the quantity
          decreases by the same fraction over equal time intervals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This concept is widely applied in nuclear physics to understand radioactive
          decay, in pharmacology to model drug elimination, and in environmental
          science to track pollutant degradation. Accurately calculating remaining
          quantities is essential for safety, dosage planning, and environmental
          assessments.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculator requires consistent units for half-life and elapsed time,
          converting them internally to seconds to maintain precision. Always ensure
          your input quantities and units are compatible for meaningful results.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula & Variables
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`N = N₀ × (1/2)^(t / t₁/₂)

Where:
  N    = Remaining quantity (same units as initial)
  N₀   = Initial quantity
  t    = Elapsed time (seconds)
  t₁/₂ = Half-life (seconds)

Alternatively:
  N = N₀ × e^(−λt)
  λ = ln(2) / t₁/₂ (decay constant)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Step-by-Step Example
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using this calculator:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> Initial quantity N₀ = 200 grams, half-life t₁/₂ = 5 hours,
            elapsed time t = 12 hours.
          </li>
          <li>
            <strong>Step 1:</strong> Convert times to seconds internally (5 h = 18000 s, 12 h = 43200 s).
          </li>
          <li>
            <strong>Step 2:</strong> Calculate decay constant λ = ln(2) / 18000 ≈ 3.85×10⁻⁵ s⁻¹.
          </li>
          <li>
            <strong>Step 3:</strong> Calculate remaining quantity N = 200 × e^(−3.85×10⁻⁵ × 43200) ≈ 48.3 grams.
          </li>
          <li>
            <strong>Result:</strong> After 12 hours, approximately 48.3 grams remain.
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
      title="Half-Life / Exponential Decay Calculator"
      description="Calculate radioactive half-life. Solve exponential decay problems to determine remaining quantity or elapsed time."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `N = N₀ × (1/2)^(t / t₁/₂)`,
        variables: [
          { symbol: "N", description: "Remaining quantity (same units as initial)" },
          { symbol: "N₀", description: "Initial quantity" },
          { symbol: "t", description: "Elapsed time (seconds)" },
          { symbol: "t₁/₂", description: "Half-life (seconds)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the remaining quantity of a substance with initial 200 grams, half-life 5 hours, after 12 hours elapsed.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert half-life and elapsed time to seconds: 5 hours = 18000 s, 12 hours = 43200 s.",
          },
          {
            label: "2",
            explanation:
              "Calculate decay constant λ = ln(2) / 18000 ≈ 3.85×10⁻⁵ s⁻¹.",
          },
          {
            label: "3",
            explanation:
              "Calculate remaining quantity: N = 200 × e^(−3.85×10⁻⁵ × 43200) ≈ 48.3 grams.",
          },
        ],
        result: "Approximately 48.3 grams remain after 12 hours.",
      }}
      relatedCalculators={[
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        {
          title: "Kinematics Equations (SUVAT)",
          url: "/science/kinematics-equations",
          icon: "🚀",
        },
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