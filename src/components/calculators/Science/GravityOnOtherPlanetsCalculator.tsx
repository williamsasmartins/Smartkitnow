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
  RotateCcw,
  Info,
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
    earthWeight: "",
    planet: "Mars",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const earthWeightNum = parseFloat(inputs.earthWeight);
    const selectedPlanet = PLANETS.find((p) => p.name === inputs.planet);

    if (
      !inputs.earthWeight ||
      isNaN(earthWeightNum) ||
      earthWeightNum <= 0 ||
      !selectedPlanet
    ) {
      return {
        value: "Waiting...",
        label: "Enter valid inputs",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Calculation:
    // Weight on other planet = Earth weight * (g_planet / g_earth)
    // g_earth = 9.81 m/s² (constant)
    const gEarth = 9.81;
    const gPlanet = selectedPlanet.gravity;

    const weightOnPlanet = earthWeightNum * (gPlanet / gEarth);

    // Formatting:
    // If weight < 0.001 or > 10000, use scientific notation
    const displayVal =
      weightOnPlanet < 0.001 || weightOnPlanet > 10000
        ? weightOnPlanet.toExponential(4)
        : weightOnPlanet.toFixed(4);

    return {
      value: `${displayVal} kg`,
      label: `Your weight on ${selectedPlanet.name}`,
      subtext: `Based on gravity ${gPlanet.toFixed(2)} m/s²`,
      warning: null,
      formulaUsed: "Weight = Earth Weight × (g_planet / g_earth)",
    };
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why does my weight change on other planets?",
      answer:
        "Weight depends on the gravitational acceleration of the celestial body you are on. Since each planet has a different mass and radius, their surface gravity varies, causing your weight to change accordingly. Mass remains constant, but weight is the force exerted by gravity on that mass.",
    },
    {
      question: "Is my mass different on other planets?",
      answer:
        "No, your mass remains the same regardless of location. Mass is the amount of matter in your body and does not change. Weight, however, is the force due to gravity acting on your mass, so it varies with the planet's gravitational acceleration.",
    },
    {
      question:
        "Where is this gravity calculation applied in real-world science and engineering?",
      answer:
        "Understanding gravity on other planets is essential for space missions, astronaut training, and designing equipment for extraterrestrial environments. Engineers use these calculations to ensure safety and functionality of habitats, rovers, and suits. It also helps scientists study planetary atmospheres and geology.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="earthWeight" className="font-semibold">
            Your Weight on Earth (kg)
          </Label>
          <Input
            id="earthWeight"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 70"
            value={inputs.earthWeight}
            onChange={(e) => handleInputChange("earthWeight", e.target.value)}
            aria-describedby="earthWeightHelp"
          />
          <p
            id="earthWeightHelp"
            className="text-xs text-slate-500 dark:text-slate-400 mt-1"
          >
            Enter your weight on Earth in kilograms (kg).
          </p>
        </div>

        <div>
          <Label htmlFor="planet" className="font-semibold">
            Select a Planet
          </Label>
          <Select
            value={inputs.planet}
            onValueChange={(value) => handleInputChange("planet", value)}
          >
            <SelectTrigger id="planet" aria-label="Select planet">
              <SelectValue placeholder="Select a planet" />
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
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed; calculation is reactive
          }}
          aria-label="Calculate weight on selected planet"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ earthWeight: "", planet: "Mars" })}
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
              <strong>Science Fact:</strong> Weight is the force of gravity acting
              on your mass. Always ensure your input weight is in kilograms (kg)
              for accurate calculations.
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
          Understanding Gravity on Other Planets Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Gravity is the force that attracts objects with mass toward each other.
          On Earth, this force gives us our familiar weight. However, other planets
          have different masses and sizes, resulting in different gravitational
          accelerations. This calculator helps you understand how your weight would
          change if you were on another planet by comparing the surface gravity of
          that planet to Earth's gravity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tool is valuable for students, educators, and space enthusiasts who
          want to explore planetary science and understand the effects of gravity
          beyond Earth. It also provides insight into the challenges astronauts
          face when adapting to different gravitational environments.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember, your mass remains constant regardless of location, but your
          weight changes because it depends on the local gravitational acceleration.
          This calculator quantifies that change precisely.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula & Variables
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Weight_{planet} = Weight_{Earth} × (g_{planet} / g_{Earth})

Where:
  Weight_{planet} = Your weight on the selected planet (kg)
  Weight_{Earth} = Your weight on Earth (kg)
  g_{planet} = Gravitational acceleration on the selected planet (m/s²)
  g_{Earth} = Gravitational acceleration on Earth (9.81 m/s²)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Step-by-Step Example
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem to see how this calculator works:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> Your Earth weight is 70 kg, and you want to
            know your weight on Mars.
          </li>
          <li>
            <strong>Step 1:</strong> Identify the gravitational acceleration on Mars:
            3.71 m/s², and on Earth: 9.81 m/s².
          </li>
          <li>
            <strong>Step 2:</strong> Apply the formula:
            Weight<sub>Mars</sub> = 70 × (3.71 / 9.81) ≈ 26.46 kg.
          </li>
          <li>
            <strong>Result:</strong> You would weigh approximately 26.46 kg on Mars,
            significantly less than your Earth weight due to Mars' lower gravity.
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
      title="Gravity on Other Planets Calculator"
      description="Calculate gravity on other planets. See how much you would weigh on Mars, Jupiter, or the Moon compared to Earth."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula:
          "Weight_{planet} = Weight_{Earth} × (g_{planet} / g_{Earth})",
        variables: [
          {
            symbol: "Weight_{planet}",
            description: "Your weight on the selected planet (kg)",
          },
          {
            symbol: "Weight_{Earth}",
            description: "Your weight on Earth (kg)",
          },
          {
            symbol: "g_{planet}",
            description: "Gravitational acceleration on the selected planet (m/s²)",
          },
          {
            symbol: "g_{Earth}",
            description: "Gravitational acceleration on Earth (9.81 m/s²)",
          },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate your weight on Mars if your Earth weight is 70 kg.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify gravitational accelerations: Mars = 3.71 m/s², Earth = 9.81 m/s².",
          },
          {
            label: "2",
            explanation:
              "Apply formula: Weight_Mars = 70 × (3.71 / 9.81) ≈ 26.46 kg.",
          },
          {
            label: "3",
            explanation:
              "Interpret result: You weigh less on Mars due to lower gravity.",
          },
        ],
        result: "Your weight on Mars is approximately 26.46 kg.",
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