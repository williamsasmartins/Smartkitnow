import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, Orbit, Info, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const G = 6.67430e-11; // gravitational constant in m^3 kg^-1 s^-2

export default function OrbitalPeriodKeplerEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    semiMajorAxis: "", // in meters
    centralMass: "", // in kilograms
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const a = parseFloat(inputs.semiMajorAxis);
    const M = parseFloat(inputs.centralMass);

    if (isNaN(a) || isNaN(M) || a <= 0 || M <= 0) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    // Kepler's Third Law for orbital period T:
    // T = 2π * sqrt(a^3 / (G * M))
    // a in meters, M in kg, G in m^3 kg^-1 s^-2
    // T in seconds

    const numerator = Math.pow(a, 3);
    const denominator = G * M;
    const periodSeconds = 2 * Math.PI * Math.sqrt(numerator / denominator);

    // Format period in seconds, but also convert to hours/days if large
    let displayValue: string;
    let label: string;
    let subtext: string | null = null;

    if (periodSeconds < 60) {
      displayValue = periodSeconds.toExponential(4) + " s";
      label = "Orbital Period (seconds)";
    } else if (periodSeconds < 3600) {
      const minutes = periodSeconds / 60;
      displayValue = minutes.toExponential(4) + " min";
      label = "Orbital Period (minutes)";
      subtext = `≈ ${(periodSeconds).toExponential(4)} seconds`;
    } else if (periodSeconds < 86400) {
      const hours = periodSeconds / 3600;
      displayValue = hours.toExponential(4) + " hr";
      label = "Orbital Period (hours)";
      subtext = `≈ ${(periodSeconds).toExponential(4)} seconds`;
    } else {
      const days = periodSeconds / 86400;
      displayValue = days.toExponential(4) + " days";
      label = "Orbital Period (days)";
      subtext = `≈ ${(periodSeconds).toExponential(4)} seconds`;
    }

    return {
      value: displayValue,
      label,
      subtext,
      warning: null,
      formulaUsed: "T = 2π √(a³ / GM)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the orbital period?",
      answer:
        "The orbital period is the time taken for a planet, satellite, or any object to complete one full orbit around a central body. It depends on the distance from the central mass and the mass of that body, as described by Kepler's Third Law.",
    },
    {
      question: "Why do we use the semi-major axis in the calculation?",
      answer:
        "The semi-major axis is the average distance between the orbiting object and the central body, representing the longest radius of an elliptical orbit. Kepler's Third Law uses this value to accurately estimate the orbital period.",
    },
    {
      question: "Can this calculator be used for elliptical orbits?",
      answer:
        "Yes, this calculator estimates the orbital period assuming the orbit is elliptical, using the semi-major axis as the key distance parameter. For highly elliptical orbits, this provides an average orbital period.",
    },
    {
      question: "What units should I use for inputs?",
      answer:
        "Enter the semi-major axis in meters (m) and the central mass in kilograms (kg). The output orbital period will be displayed in seconds, minutes, hours, or days depending on the magnitude.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="semiMajorAxis" className="flex items-center gap-2 mb-1 font-semibold text-slate-900 dark:text-slate-100">
          <Orbit className="w-5 h-5 text-blue-600" /> Semi-Major Axis (a) in meters (m)
        </Label>
        <Input
          id="semiMajorAxis"
          type="text"
          placeholder="e.g. 1.496e11 (Earth-Sun distance)"
          value={inputs.semiMajorAxis}
          onChange={(e) => handleInputChange("semiMajorAxis", e.target.value)}
          aria-describedby="semiMajorAxisHelp"
        />
        <p id="semiMajorAxisHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Distance from the central body to orbiting object (semi-major axis).
        </p>
      </div>

      <div>
        <Label htmlFor="centralMass" className="flex items-center gap-2 mb-1 font-semibold text-slate-900 dark:text-slate-100">
          <Atom className="w-5 h-5 text-blue-600" /> Central Mass (M) in kilograms (kg)
        </Label>
        <Input
          id="centralMass"
          type="text"
          placeholder="e.g. 1.989e30 (Mass of the Sun)"
          value={inputs.centralMass}
          onChange={(e) => handleInputChange("centralMass", e.target.value)}
          aria-describedby="centralMassHelp"
        />
        <p id="centralMassHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Mass of the central body being orbited.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is automatic on input change
          }}
          aria-label="Calculate orbital period"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ semiMajorAxis: "", centralMass: "" })}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Orbital Period (Kepler) Estimator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The orbital period is the time required for an object, such as a planet or satellite, to complete one full orbit around a central massive body like a star or planet. This period depends primarily on the size of the orbit and the mass of the central body. Using Kepler's Third Law, we can estimate this period precisely by considering the semi-major axis of the orbit and the gravitational constant.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Kepler's Third Law states that the square of the orbital period (T) is proportional to the cube of the semi-major axis (a) of the orbit, divided by the mass (M) of the central body. This relationship allows scientists and engineers to predict orbital periods for satellites, planets, and other celestial bodies with remarkable accuracy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This estimator uses the precise gravitational constant (G = 6.67430 × 10⁻¹¹ m³·kg⁻¹·s⁻²) to calculate the orbital period in seconds, which is then converted into more human-readable units such as minutes, hours, or days depending on the magnitude. Understanding this fundamental concept is crucial for fields like astronomy, aerospace engineering, and space mission planning.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Always ensure that the inputs are in the correct SI units: meters for distance and kilograms for mass. Using other units without conversion will lead to incorrect results.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`T = 2π × √(a³ / (G × M))

Where:
  T = Orbital period (seconds)
  a = Semi-major axis (meters)
  G = Gravitational constant = 6.67430 × 10⁻¹¹ m³·kg⁻¹·s⁻²
  M = Mass of the central body (kilograms)

Note:
- The semi-major axis (a) is the average distance between the orbiting object and the central mass.
- The formula assumes the orbiting mass is negligible compared to the central mass.`}
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
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Kepler's%20Laws%20Orbital%20Period" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Kepler's Laws Orbital Period - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              A comprehensive encyclopedia article providing an in-depth overview of Kepler's Laws Orbital Period, including historical context, mathematical derivations, and key applications.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Kepler's%20Laws%20Orbital%20Period" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Kepler's Laws Orbital Period - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Watch free educational video tutorials and complete interactive practice exercises on Kepler's Laws Orbital Period at Khan Academy, perfect for visual learners.
            </p>
          </li>
          <li>
            <a href="https://www.nasa.gov/search/?q=Kepler's%20Laws%20Orbital%20Period" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Kepler's Laws Orbital Period - NASA
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Discover official NASA articles, missions, and scientific data related to Kepler's Laws Orbital Period, exploring how these concepts apply to space exploration.
            </p>
          </li>
          <li>
            <a href="https://www.space.com/search?searchTerm=Kepler's%20Laws%20Orbital%20Period" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Kepler's Laws Orbital Period - Space.com
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Read the latest news, guides, and educational articles about Kepler's Laws Orbital Period from Space.com experts.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Orbital Period (Kepler) Estimator"
      description="Estimate Orbital Period using Kepler's Laws. Calculate the time it takes for a planet or satellite to orbit a massive body."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "T = 2π × √(a³ / (G × M))",
        variables: [
          { symbol: "T", description: "Orbital period (seconds)" },
          { symbol: "a", description: "Semi-major axis (meters)" },
          { symbol: "G", description: "Gravitational constant (6.67430 × 10⁻¹¹ m³·kg⁻¹·s⁻²)" },
          { symbol: "M", description: "Mass of the central body (kilograms)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the orbital period of Earth around the Sun. The average distance (semi-major axis) is approximately 1.496 × 10¹¹ meters, and the mass of the Sun is about 1.989 × 10³⁰ kilograms.",
        steps: [
          {
            label: "1",
            explanation:
              "Input the semi-major axis a = 1.496e11 m and central mass M = 1.989e30 kg into the calculator.",
          },
          {
            label: "2",
            explanation:
              "The calculator applies Kepler's Third Law to compute the orbital period T.",
          },
          {
            label: "3",
            explanation:
              "The result is approximately 3.1557e7 seconds, which converts to about 365.25 days, matching Earth's orbital period.",
          },
        ],
        result: "Orbital Period ≈ 3.1557 × 10⁷ seconds ≈ 365.25 days",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Kinematics Equations Solver (SUVAT)", url: "/science/kinematics-suvat-solver", icon: "🚀" },
        { title: "Molality & Normality Converter", url: "/science/molality-normality-converter", icon: "🧪" },
        { title: "Projectile Motion Calculator", url: "/science/projectile-motion-calculator", icon: "🚀" },
        { title: "Escape Velocity Calculator", url: "/science/escape-velocity-calculator", icon: "🧪" },
        { title: "Molarity / Moles / Volume Calculator", url: "/science/molarity-moles-volume", icon: "🧪" },
        { title: "Molar Mass Calculator", url: "/science/molar-mass-calculator", icon: "🧪" },
      ]}
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