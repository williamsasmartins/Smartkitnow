import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import {
  Atom,
  FlaskConical,
  Zap,
  Orbit,
  Thermometer,
  Scale,
  Waves,
  Info,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const PLANETS = [
  {
    name: "Mercury",
    gravity: 3.7, // m/s²
  },
  {
    name: "Venus",
    gravity: 8.87,
  },
  {
    name: "Earth",
    gravity: 9.81,
  },
  {
    name: "Moon",
    gravity: 1.62,
  },
  {
    name: "Mars",
    gravity: 3.71,
  },
  {
    name: "Jupiter",
    gravity: 24.79,
  },
  {
    name: "Saturn",
    gravity: 10.44,
  },
  {
    name: "Uranus",
    gravity: 8.69,
  },
  {
    name: "Neptune",
    gravity: 11.15,
  },
  {
    name: "Pluto",
    gravity: 0.62,
  },
];

export default function GravityOnOtherPlanetsCalculator() {
  const [inputs, setInputs] = useState({
    mass: "",
    planet: "Mars",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const massNum = parseFloat(inputs.mass);
    if (
      isNaN(massNum) ||
      massNum <= 0 ||
      !inputs.planet ||
      !PLANETS.find((p) => p.name === inputs.planet)
    ) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    const planetData = PLANETS.find((p) => p.name === inputs.planet);
    const gEarth = 9.81; // m/s², precise constant
    const gPlanet = planetData.gravity;

    // Weight on Earth: W = m * gEarth (N)
    // Weight on planet: Wp = m * gPlanet (N)
    // Weight ratio = gPlanet / gEarth

    const weightEarth = massNum * gEarth; // Newtons
    const weightPlanet = massNum * gPlanet; // Newtons

    // Format numbers with 4 decimals or scientific notation if very large/small
    const formatNum = (num: number) => {
      if (num === 0) return "0";
      if (Math.abs(num) < 0.001 || Math.abs(num) > 100000) {
        return num.toExponential(4);
      }
      return num.toFixed(4);
    };

    const weightEarthStr = `${formatNum(weightEarth)} N`;
    const weightPlanetStr = `${formatNum(weightPlanet)} N`;
    const ratio = gPlanet / gEarth;
    const ratioStr = ratio.toFixed(4);

    return {
      value: weightPlanetStr,
      label: `Weight on ${planetData.name}`,
      subtext: `Compared to Earth weight: ${(ratio * 100).toFixed(
        2
      )}% (${weightEarthStr} on Earth)`,
      warning: null,
      formulaUsed: "W = m × g",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why does gravity vary on different planets?",
      answer:
        "Gravity depends on a planet's mass and radius. Larger or denser planets exert stronger gravitational pull, making you weigh more, while smaller or less dense planets have weaker gravity, making you weigh less.",
    },
    {
      question: "Can I use this calculator for moons or dwarf planets?",
      answer:
        "Yes! The calculator includes gravity values for the Moon and Pluto, a dwarf planet. You can select them to see how your weight changes on these celestial bodies.",
    },
    {
      question: "Why is weight different from mass?",
      answer:
        "Mass is the amount of matter in an object and remains constant everywhere. Weight is the force exerted by gravity on that mass and varies depending on the gravitational acceleration of the planet or moon.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="mass" className="flex items-center gap-2 mb-1 font-semibold">
          <Scale className="w-5 h-5 text-blue-600" />
          Mass (kg)
        </Label>
        <Input
          id="mass"
          type="number"
          min="0"
          step="any"
          placeholder="Enter your mass in kilograms"
          value={inputs.mass}
          onChange={(e) => handleInputChange("mass", e.target.value)}
          aria-describedby="mass-desc"
        />
        <p id="mass-desc" className="text-sm text-slate-500 mt-1">
          Your mass remains constant regardless of location.
        </p>
      </div>

      <div>
        <Label htmlFor="planet" className="flex items-center gap-2 mb-1 font-semibold">
          <Orbit className="w-5 h-5 text-blue-600" />
          Select Planet or Moon
        </Label>
        <Select
          value={inputs.planet}
          onValueChange={(value) => handleInputChange("planet", value)}
          aria-label="Select planet or moon"
          id="planet"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a planet or moon" />
          </SelectTrigger>
          <SelectContent>
            {PLANETS.map((planet) => (
              <SelectItem key={planet.name} value={planet.name}>
                {planet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          aria-label="Calculate weight on selected planet"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ mass: "", planet: "Mars" })}
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
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Gravity on Other Planets Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Gravity is the force that attracts objects with mass toward each other. On Earth, this force gives us weight and keeps us grounded. However, gravity varies across different planets and moons due to differences in their mass and size. This calculator helps you understand how much you would weigh on other celestial bodies by applying the formula W = m × g, where &quot;W&quot; is weight, &quot;m&quot; is mass, and &quot;g&quot; is gravitational acceleration.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Since your mass remains constant regardless of location, your weight changes depending on the gravity of the planet or moon you are on. For example, you would weigh less on the Moon because its gravity (1.62 m/s²) is much weaker than Earth’s (9.81 m/s²). Conversely, on Jupiter, with gravity of 24.79 m/s², you would weigh significantly more.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is educational and precise, using scientifically accurate gravity values for various planets and moons in our solar system. It allows you to explore and compare gravitational effects easily, deepening your understanding of planetary physics and the nature of weight.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`W = m × g

Where:
  W = Weight (Newtons, N)
  m = Mass (kilograms, kg)
  g = Gravitational acceleration (meters per second squared, m/s²)

Note:
- g varies by planet or moon.
- On Earth, g = 9.81 m/s² (standard gravity).
- Weight changes with g, but mass remains constant.`}
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
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Surface%20Gravity%20of%20Planets" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Surface Gravity of Planets - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              A comprehensive encyclopedia article providing an in-depth overview of Surface Gravity of Planets, including historical context, mathematical derivations, and key applications.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Surface%20Gravity%20of%20Planets" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Surface Gravity of Planets - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Watch free educational video tutorials and complete interactive practice exercises on Surface Gravity of Planets at Khan Academy, perfect for visual learners.
            </p>
          </li>
          <li>
            <a href="https://www.nasa.gov/search/?q=Surface%20Gravity%20of%20Planets" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Surface Gravity of Planets - NASA
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Discover official NASA articles, missions, and scientific data related to Surface Gravity of Planets, exploring how these concepts apply to space exploration.
            </p>
          </li>
          <li>
            <a href="https://www.space.com/search?searchTerm=Surface%20Gravity%20of%20Planets" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Surface Gravity of Planets - Space.com
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Read the latest news, guides, and educational articles about Surface Gravity of Planets from Space.com experts.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Gravity on Other Planets Calculator"
      description="Calculate gravity on other planets. See how much you would weigh on Mars, Jupiter, or the Moon compared to Earth."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "W = m × g",
        variables: [
          { symbol: "W", description: "Weight in Newtons (N)" },
          { symbol: "m", description: "Mass in kilograms (kg)" },
          { symbol: "g", description: "Gravitational acceleration in m/s²" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate your weight on Mars if your mass is 70 kg.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify your mass: 70 kg.",
          },
          {
            label: "2",
            explanation:
              "Find Mars gravity: 3.71 m/s².",
          },
          {
            label: "3",
            explanation:
              "Calculate weight: W = 70 × 3.71 = 259.7 N.",
          },
        ],
        result:
          "Your weight on Mars would be approximately 259.7 Newtons, which is about 37.8% of your Earth weight.",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        {
          title: "Specific Heat Calculator",
          url: "/science/specific-heat-q-mc-delta-t",
          icon: "🔥",
        },
        {
          title: "Percent Composition by Mass",
          url: "/science/percent-composition-by-mass",
          icon: "🧪",
        },
        {
          title: "Kinematics Equations Solver (SUVAT)",
          url: "/science/kinematics-suvat-solver",
          icon: "🚀",
        },
        {
          title: "Molarity / Moles / Volume Calculator",
          url: "/science/molarity-moles-volume",
          icon: "🧪",
        },
        {
          title: "Percent Yield & Theoretical Yield",
          url: "/science/percent-yield-theoretical-yield",
          icon: "🧪",
        },
        {
          title: "Blackbody Peak (Wien's Law) Estimator",
          url: "/science/blackbody-peak-wien-law-estimator",
          icon: "🧪",
        },
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