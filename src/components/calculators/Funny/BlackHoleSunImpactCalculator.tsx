import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Lightbulb, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BlackHoleSunImpactCalculator() {
  // Inputs: mass of sun (fixed), mass of black hole (optional), or just assume same mass black hole
  // But per problem: "What would happen to Earth's orbit if the sun instantly turned into a black hole of the same mass?"
  // So inputs: none needed for mass, but maybe allow user to input distance from sun (Earth's average distance)
  // and mass of sun (default to solar mass), or just keep it fixed and show impact on Earth's orbit velocity and gravity.

  // For simplicity, input: Distance from sun in AU (default 1 AU), mass of sun in solar masses (default 1)
  // But per rules, no unit selector because distance is physical measurement, so yes, add unit selector for distance (AU or km)
  // But instructions say only add unit selector if physical measurement. Distance is physical, so yes.

  // However, instructions say only add unit selector if calculator uses physical measurements (Distance, Weight).
  // Distance is physical, so add unit selector for distance: AU or km.

  // But the original instructions say "Do NOT add it for Money, Time, or Counters."
  // So distance is physical, so yes add unit selector.

  // Let's do distance input with unit selector (AU or km).

  // Constants:
  // G = gravitational constant = 6.67430e-11 m^3 kg^-1 s^-2
  // Mass of sun = 1.989e30 kg
  // Earth orbit radius = 1 AU = 1.496e11 m
  // Orbital velocity v = sqrt(G*M/r)
  // If sun turns into black hole of same mass, gravity at distance r remains same, so orbit remains stable.
  // But sun no longer emits light, so Earth is plunged into darkness and cold.

  // So calculator can show:
  // - Orbital velocity (km/s)
  // - Gravitational force on Earth (N)
  // - Impact summary

  // Inputs:
  // Distance from black hole (default 1 AU)
  // Unit selector: AU or km

  // Output:
  // Orbital velocity (km/s)
  // Gravitational force (N)
  // Summary text

  // Formula:
  // v = sqrt(G * M / r)
  // F = G * M * m / r^2 (m = mass of Earth = 5.972e24 kg)

  // Let's implement.

  const G = 6.67430e-11; // m^3 kg^-1 s^-2
  const M_sun = 1.989e30; // kg
  const m_earth = 5.972e24; // kg
  const AU_in_m = 1.496e11; // meters

  const [inputs, setInputs] = useState({
    distance: "",
    unit: "AU",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const distanceRaw = inputs.distance.trim();
    if (!distanceRaw) {
      return {
        value: null,
        label: "",
        subtext: "",
        color: "",
        icon: null,
      };
    }
    const distanceNum = Number(distanceRaw);
    if (isNaN(distanceNum) || distanceNum <= 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        color: "",
        icon: null,
      };
    }

    // Convert distance to meters
    let distanceMeters = 0;
    if (inputs.unit === "AU") {
      distanceMeters = distanceNum * AU_in_m;
    } else if (inputs.unit === "km") {
      distanceMeters = distanceNum * 1000;
    } else {
      // default fallback
      distanceMeters = distanceNum * AU_in_m;
    }

    // Calculate orbital velocity in m/s
    const orbitalVelocity = Math.sqrt((G * M_sun) / distanceMeters); // m/s

    // Calculate gravitational force on Earth in Newtons
    const gravitationalForce = (G * M_sun * m_earth) / (distanceMeters * distanceMeters); // N

    // Format outputs
    const velocityKmS = orbitalVelocity / 1000;
    const velocityStr = velocityKmS.toFixed(2) + " km/s";
    const forceStr = gravitationalForce.toExponential(2) + " N";

    return {
      value: velocityStr,
      label: "Earth's Orbital Velocity",
      subtext: `Gravitational force on Earth: ${forceStr}`,
      color: "text-blue-600",
      icon: <Sparkles className="mx-auto h-12 w-12 text-blue-600" />,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What happens to Earth's orbit if the Sun becomes a black hole?",
      answer:
        "If the Sun instantly turned into a black hole of the same mass, Earth's orbit would remain stable because gravity depends on mass and distance, which remain unchanged. However, the Earth would lose sunlight, causing catastrophic cooling and darkness.",
    },
    {
      question: "Why does the Earth's orbit not collapse into the black hole?",
      answer:
        "Gravity depends on mass and distance, not the object's state. Since the black hole has the same mass as the Sun, the gravitational pull at Earth's distance remains the same, so Earth's orbit stays intact.",
    },
    {
      question: "Can we survive if the Sun becomes a black hole?",
      answer:
        "No, without sunlight, Earth's surface temperature would plummet, making it impossible for most life forms to survive. The black hole itself emits no light or heat.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="distance" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Distance from Black Hole (Earth's orbit radius)
        </Label>
        <div className="flex gap-2">
          <Input
            id="distance"
            type="number"
            min="0"
            step="any"
            placeholder="1"
            value={inputs.distance}
            onChange={(e) => handleInputChange("distance", e.target.value)}
            aria-describedby="distance-desc"
          />
          <select
            aria-label="Distance unit"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            value={inputs.unit}
            onChange={(e) => handleInputChange("unit", e.target.value)}
          >
            <option value="AU">AU (Astronomical Unit)</option>
            <option value="km">Kilometers</option>
          </select>
        </div>
        <p id="distance-desc" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter the distance from the black hole. 1 AU ≈ 149.6 million km (Earth's average distance from the Sun).
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          aria-label="Calculate impact"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ distance: "", unit: "AU" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">{results.icon}</div>
            <p className={`text-5xl font-extrabold ${results.color}`}>{results.value}</p>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">{results.label}</p>
            <p className="mt-2 text-sm italic text-slate-500">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Black Hole Sun Impact Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator explores the hypothetical scenario where the Sun instantly transforms into a black hole of the same mass. While the gravitational pull on Earth would remain unchanged, ensuring Earth's orbit stays stable, the loss of sunlight would have devastating effects on our planet's climate and life. By inputting the distance from the black hole, you can see how Earth's orbital velocity and gravitational force would be calculated in this scenario.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Although black holes are known for their immense gravity, if the Sun were replaced by a black hole of the same mass, Earth's orbit would not change. This is because gravity depends on mass and distance, not on the object's visible size or state.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply enter the distance from the black hole in either astronomical units (AU) or kilometers. The default value corresponds to Earth's average distance from the Sun (1 AU). Click "Calculate" to see Earth's orbital velocity and the gravitational force exerted on it in this scenario. Use the reset button to clear inputs and start over.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <dl className="space-y-6">
          {faqs.map(({ question, answer }, i) => (
            <div key={i}>
              <dt className="font-semibold text-lg text-slate-800 dark:text-slate-200">{question}</dt>
              <dd className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">{answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="space-y-4 list-disc list-inside text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://www.nasa.gov/audience/forstudents/5-8/features/nasa-knows/what-is-a-black-hole-58.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              NASA: What is a Black Hole? <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An accessible explanation of black holes and their properties by NASA.
            </p>
          </li>
          <li>
            <a
              href="https://www.space.com/20881-black-holes-facts-formation-discovery-sdcmp.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Space.com: Black Hole Facts <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Detailed facts about black holes, their formation, and effects on surrounding space.
            </p>
          </li>
          <li>
            <a
              href="https://physics.stackexchange.com/questions/15460/what-would-happen-if-the-sun-were-instantly-replaced-by-a-black-hole-of-the-same"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Physics Stack Exchange: Sun replaced by black hole <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Community discussion on the gravitational effects if the Sun became a black hole.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Black Hole Sun Impact Calculator"
      description="Apocalypse calculator. What would happen to Earth's orbit if the sun instantly turned into a black hole of the same mass?"
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "v = √(G × M / r)",
        variables: [
          { symbol: "v", description: "Orbital velocity of Earth (m/s)" },
          { symbol: "G", description: "Gravitational constant (6.67430×10⁻¹¹ m³·kg⁻¹·s⁻²)" },
          { symbol: "M", description: "Mass of the black hole (kg)" },
          { symbol: "r", description: "Distance from the black hole (m)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate Earth's orbital velocity if the Sun becomes a black hole of the same mass and Earth remains at 1 AU distance.",
        steps: [
          {
            label: "1",
            explanation: "Use the formula v = √(G × M / r) with G = 6.67430×10⁻¹¹, M = 1.989×10³⁰ kg, r = 1.496×10¹¹ m.",
          },
          {
            label: "2",
            explanation: "Calculate the value inside the square root and then take the square root to find v.",
          },
          {
            label: "3",
            explanation: "Resulting orbital velocity is approximately 29.78 km/s, same as Earth's current orbital velocity.",
          },
        ],
        result: "Earth's orbital velocity remains about 29.78 km/s, indicating stable orbit despite Sun's transformation.",
      }}
      relatedCalculators={[
        { title: "Coffee Addiction Meter", url: "/funny/coffee-addiction-meter", icon: "☕" },
        { title: "Pizza Slices per Person & Regret Index", url: "/funny/pizza-slices-per-person-regret-index", icon: "🍕" },
        { title: "Commit Message Quality Judge", url: "/funny/commit-message-quality-judge", icon: "🤪" },
        { title: "Keyboard Clicks per Day Estimator", url: "/funny/keyboard-clicks-per-day", icon: "💻" },
        { title: "Calculator Word Generator (Upside-Down)", url: "/funny/calculator-word-generator-upside-down", icon: "🤪" },
        { title: "Love Meter (Name Compatibility)", url: "/funny/love-meter", icon: "❤️" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}