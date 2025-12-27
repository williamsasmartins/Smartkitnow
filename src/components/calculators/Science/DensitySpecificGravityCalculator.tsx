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

export default function DensitySpecificGravityCalculator() {
  const [inputs, setInputs] = useState({
    mass: "",
    volume: "",
    fluidDensity: "",
    calculateFor: "density", // or "specificGravity"
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const g = 9.81; // m/s², gravitational acceleration (not directly needed here but scientific constant)
    const { mass, volume, fluidDensity, calculateFor } = inputs;

    // Parse inputs to floats
    const m = parseFloat(mass);
    const v = parseFloat(volume);
    const fd = parseFloat(fluidDensity);

    // Validation and warnings
    if (
      (mass !== "" && (isNaN(m) || m <= 0)) ||
      (volume !== "" && (isNaN(v) || v <= 0)) ||
      (fluidDensity !== "" && (isNaN(fd) || fd <= 0))
    ) {
      return {
        value: "Invalid input",
        label: "",
        subtext: null,
        warning: "Please enter positive numeric values only.",
        formulaUsed: null,
      };
    }

    if (calculateFor === "density") {
      if (mass === "" || volume === "") {
        return {
          value: "Waiting...",
          label: "",
          subtext: null,
          warning: null,
          formulaUsed: null,
        };
      }
      // Density = mass / volume
      const density = m / v; // kg/m³
      return {
        value: density.toExponential(4) + " kg/m³",
        label: "Density (ρ)",
        subtext: "Density is mass divided by volume.",
        warning: null,
        formulaUsed: "ρ = m / V",
      };
    } else if (calculateFor === "specificGravity") {
      if (mass === "" || volume === "" || fluidDensity === "") {
        return {
          value: "Waiting...",
          label: "",
          subtext: null,
          warning: null,
          formulaUsed: null,
        };
      }
      // Density of substance
      const density = m / v; // kg/m³
      // Specific Gravity = density_substance / density_fluid (dimensionless)
      if (fd === 0) {
        return {
          value: "Invalid input",
          label: "",
          subtext: null,
          warning: "Fluid density must be greater than zero.",
          formulaUsed: null,
        };
      }
      const specificGravity = density / fd;
      return {
        value: specificGravity.toFixed(4),
        label: "Specific Gravity (SG)",
        subtext: "Ratio of substance density to fluid density (dimensionless).",
        warning: null,
        formulaUsed: "SG = ρ_substance / ρ_fluid",
      };
    }

    return {
      value: "Waiting...",
      label: "",
      subtext: null,
      warning: null,
      formulaUsed: null,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between density and specific gravity?",
      answer:
        "Density is the mass of a substance per unit volume, expressed in units like kg/m³. Specific gravity is a dimensionless ratio comparing the density of a substance to the density of a reference fluid, typically water at 4°C. Unlike density, specific gravity has no units and indicates whether a substance is heavier or lighter than the reference fluid.",
    },
    {
      question: "Why is specific gravity dimensionless?",
      answer:
        "Specific gravity is the ratio of two densities with the same units, so the units cancel out. This makes specific gravity a pure number without units, which simplifies comparisons of material densities relative to a reference fluid.",
    },
    {
      question: "Can I use this calculator for gases?",
      answer:
        "Yes, you can calculate the density of gases by entering their mass and volume. However, specific gravity calculations require the density of the reference fluid (usually air or another gas) for accurate comparison.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="calculateFor" className="flex items-center gap-2 mb-2 font-semibold text-slate-900 dark:text-slate-100">
          <Scale className="w-5 h-5 text-blue-600" />
          Calculate for:
        </Label>
        <Select
          value={inputs.calculateFor}
          onValueChange={(value) => handleInputChange("calculateFor", value)}
          aria-label="Select calculation type"
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="density" aria-label="Calculate Density">
              Density (kg/m³)
            </SelectItem>
            <SelectItem value="specificGravity" aria-label="Calculate Specific Gravity">
              Specific Gravity (dimensionless)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="mass" className="flex items-center gap-2 mb-2 font-semibold text-slate-900 dark:text-slate-100">
          <FlaskConical className="w-5 h-5 text-green-600" />
          Mass (kg)
        </Label>
        <Input
          id="mass"
          type="number"
          min="0"
          step="any"
          placeholder="Enter mass in kilograms"
          value={inputs.mass}
          onChange={(e) => handleInputChange("mass", e.target.value)}
          aria-describedby="mass-desc"
        />
        <p id="mass-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Mass of the substance in kilograms (kg).
        </p>
      </div>

      <div>
        <Label htmlFor="volume" className="flex items-center gap-2 mb-2 font-semibold text-slate-900 dark:text-slate-100">
          <Scale className="w-5 h-5 text-purple-600" />
          Volume (m³)
        </Label>
        <Input
          id="volume"
          type="number"
          min="0"
          step="any"
          placeholder="Enter volume in cubic meters"
          value={inputs.volume}
          onChange={(e) => handleInputChange("volume", e.target.value)}
          aria-describedby="volume-desc"
        />
        <p id="volume-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Volume of the substance in cubic meters (m³).
        </p>
      </div>

      {inputs.calculateFor === "specificGravity" && (
        <div>
          <Label htmlFor="fluidDensity" className="flex items-center gap-2 mb-2 font-semibold text-slate-900 dark:text-slate-100">
            <Waves className="w-5 h-5 text-cyan-600" />
            Fluid Density (kg/m³)
          </Label>
          <Input
            id="fluidDensity"
            type="number"
            min="0"
            step="any"
            placeholder="Enter reference fluid density"
            value={inputs.fluidDensity}
            onChange={(e) => handleInputChange("fluidDensity", e.target.value)}
            aria-describedby="fluidDensity-desc"
          />
          <p id="fluidDensity-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Density of the reference fluid (e.g., water at 4°C = 1000 kg/m³).
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              mass: "",
              volume: "",
              fluidDensity: "",
              calculateFor: "density",
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Density / Specific Gravity Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Density is a fundamental physical property that describes how much mass is contained in a given volume of a substance. It is expressed as mass per unit volume, typically in kilograms per cubic meter (kg/m³). Specific gravity, on the other hand, is a dimensionless quantity that compares the density of a substance to the density of a reference fluid, usually water at 4°C. This ratio helps scientists and engineers understand whether a material will float or sink in the fluid.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator allows you to compute either the density of a substance by inputting its mass and volume or the specific gravity by additionally providing the density of the reference fluid. Accurate inputs are essential for meaningful results, and units must be consistent to avoid errors.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding these concepts is crucial in fields such as material science, chemistry, and engineering, where the behavior of substances under different conditions is analyzed. For example, knowing the specific gravity of a liquid can help determine its purity or concentration.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember, density values can vary with temperature and pressure, so always consider the conditions under which measurements are taken for precise scientific work.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Density (ρ) = mass (m) / volume (V)
ρ = m / V

Specific Gravity (SG) = density of substance (ρ_substance) / density of reference fluid (ρ_fluid)
SG = ρ_substance / ρ_fluid

Where:
  ρ = Density (kg/m³)
  m = Mass (kg)
  V = Volume (m³)
  SG = Specific Gravity (dimensionless)
`}
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
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Density%20and%20Specific%20Gravity" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Density and Specific Gravity - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              A comprehensive encyclopedia article providing an in-depth overview of Density and Specific Gravity, including historical context, mathematical derivations, and key applications.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Density%20and%20Specific%20Gravity" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Density and Specific Gravity - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Watch free educational video tutorials and complete interactive practice exercises on Density and Specific Gravity at Khan Academy, perfect for visual learners.
            </p>
          </li>
          <li>
            <a href="https://www.physicsclassroom.com/search?q=Density%20and%20Specific%20Gravity" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Density and Specific Gravity - The Physics Classroom
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Explore student-friendly tutorials, interactives, and concept builders related to Density and Specific Gravity designed to improve understanding of physics principles.
            </p>
          </li>
          <li>
            <a href="http://hyperphysics.phy-astr.gsu.edu/hbase/hph.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Density and Specific Gravity - HyperPhysics
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Navigate the HyperPhysics concept map to find concise summaries and calculation examples for Density and Specific Gravity.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Density / Specific Gravity Calculator"
      description="Calculate Density and Specific Gravity. Determine the mass-to-volume ratio of solids, liquids, and gases."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `Density (ρ) = m / V\nSpecific Gravity (SG) = ρ_substance / ρ_fluid`,
        variables: [
          { symbol: "ρ", description: "Density (kg/m³)" },
          { symbol: "m", description: "Mass (kg)" },
          { symbol: "V", description: "Volume (m³)" },
          { symbol: "SG", description: "Specific Gravity (dimensionless)" },
          { symbol: "ρ_fluid", description: "Density of reference fluid (kg/m³)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the density and specific gravity of a liquid sample with a mass of 2.5 kg and a volume of 0.002 m³. The density of water (reference fluid) is 1000 kg/m³.",
        steps: [
          {
            label: "1",
            explanation: "Calculate density: ρ = m / V = 2.5 kg / 0.002 m³ = 1250 kg/m³.",
          },
          {
            label: "2",
            explanation:
              "Calculate specific gravity: SG = ρ_substance / ρ_fluid = 1250 kg/m³ / 1000 kg/m³ = 1.25 (dimensionless).",
          },
        ],
        result: "Density = 1250 kg/m³, Specific Gravity = 1.25",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Percent Composition by Mass", url: "/science/percent-composition-by-mass", icon: "🧪" },
        { title: "Buffer (Henderson–Hasselbalch) Helper", url: "/science/buffer-henderson-hasselbalch-helper", icon: "🧪" },
        { title: "Wave Speed / Frequency / Wavelength", url: "/science/wave-speed-frequency-wavelength", icon: "🚀" },
        { title: "Molar Mass Calculator", url: "/science/molar-mass-calculator", icon: "🧪" },
        { title: "Force, Work & Energy Calculator", url: "/science/force-work-energy-calculator", icon: "🚀" },
        { title: "Thin Lens Solver", url: "/science/thin-lens-solver", icon: "🌈" },
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