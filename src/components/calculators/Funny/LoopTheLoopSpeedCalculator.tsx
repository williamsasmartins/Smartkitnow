import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Lightbulb, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LoopTheLoopSpeedCalculator() {
  const [inputs, setInputs] = useState({ radius: "" });
  const handleInputChange = useCallback((n, v) => setInputs((p) => ({ ...p, [n]: v })), []);

  const results = useMemo(() => {
    const r = parseFloat(inputs.radius);
    if (!inputs.radius) {
      // Initial neutral state
      return { value: null };
    }
    if (isNaN(r) || r <= 0) {
      return {
        value: null,
        label: "Invalid input",
        subtext: "Radius must be a positive number",
        color: "text-red-600",
        icon: <RotateCcw />,
      };
    }

    // Physics formula:
    // Minimum speed v = sqrt(g * r)
    // g = 9.81 m/s² (acceleration due to gravity)
    const g = 9.81;
    const v = Math.sqrt(g * r);

    // Format speed with 2 decimals and unit m/s
    const formattedSpeed = `${v.toFixed(2)} m/s`;

    return {
      value: formattedSpeed,
      label: "Minimum Speed",
      subtext: `to complete the loop with radius ${r} meters`,
      color: "text-blue-600",
      icon: <Sparkles />,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do we use the formula v = √(g × r) for loop-the-loop speed?",
      answer:
        "This formula comes from the physics principle that the centripetal force needed to keep the car on the track at the top of the loop must be at least equal to the gravitational force. It ensures the car doesn't fall off the track.",
    },
    {
      question: "Can this calculator be used for loops of any size?",
      answer:
        "Yes, as long as the radius is positive and realistic. Extremely large or small loops might require additional considerations like friction and structural limits.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="radius" className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">
          Loop Radius (meters)
        </Label>
        <Input
          id="radius"
          type="number"
          min="0"
          step="any"
          placeholder="Enter loop radius in meters"
          value={inputs.radius}
          onChange={(e) => handleInputChange("radius", e.target.value)}
          aria-describedby="radius-desc"
        />
        <p id="radius-desc" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          The radius of the vertical loop in meters.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just trigger recalculation, inputs already update onChange
          }}
          aria-label="Calculate minimum speed"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ radius: "" })}
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
          Understanding Loop-the-Loop Speed Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Loop-the-Loop Speed Calculator helps you determine the minimum speed a car must have at the bottom of a vertical loop to safely complete the loop without falling. This calculation is based on fundamental physics principles involving centripetal force and gravity. By inputting the radius of the loop, you can quickly find the critical speed needed to maintain contact with the track at the loop's highest point. This is essential for designing safe roller coasters or physics experiments involving circular motion.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The concept of loop-the-loop physics was first studied in the 19th century to understand roller coaster dynamics. The minimum speed formula ensures that the normal force at the top of the loop is not zero, preventing the vehicle from losing contact and falling.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply enter the radius of the vertical loop in meters into the input field. The radius is the distance from the center of the loop to its edge. After entering a positive number, click the Calculate button to see the minimum speed required to complete the loop safely. If you want to try different loop sizes, use the Reset button to clear the input and start over.
        </p>
      </section>


      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Circular Motion and the Physics of Loop-the-Loop
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The loop-the-loop demonstrates centripetal acceleration and Newton's second law. At the top of the loop, gravity must provide at least the centripetal force needed to maintain circular motion: v^2/r &gt;= g. This gives the minimum speed at the loop top: v_min = sqrt(g x r). For a loop with 5-meter radius, minimum speed = sqrt(9.81 x 5) = 7.0 m/s (about 25 km/h). Below this speed, the normal force from the track would need to be negative to maintain the circular path, which is impossible: the rider would fall away from the track.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Real roller coasters apply this physics with safety factors. A loop with 10-meter radius requires minimum speed of sqrt(9.81 x 10) = 9.9 m/s at the top. Designers add 1.3-1.5x safety margins, increasing the required entry speed. Crucially, the minimum-speed relationship scales as sqrt(r): doubling the loop radius increases required speed by only 41%, not 100%. This is why modern coasters use larger teardrop-shaped loops rather than smaller circles: the larger radius requires proportionally less speed while providing a more comfortable rider experience.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The g-force at the bottom of the loop is the sum of weight support and centripetal force: g_experienced = v^2/(g x r) + 1. A roller coaster moving at 20 m/s through a 10-meter loop bottom experiences 5.1g. At the top: g_experienced = v^2/(g x r) - 1 (centripetal and weight forces partially cancel). This difference between top and bottom g-forces motivates the clothoid (Euler spiral) loop design used in modern coasters. By continuously varying the loop radius, the clothoid keeps g-forces more uniform throughout, reducing physical stress on riders while allowing higher overall speeds.
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
              href="https://en.wikipedia.org/wiki/Loop-the-loop"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Loop-the-Loop - Wikipedia <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Comprehensive overview of the physics and history of loop-the-loop motion.
            </p>
          </li>
          <li>
            <a
              href="https://hyperphysics.phy-astr.gsu.edu/hbase/circ.html#circon"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Circular Motion - HyperPhysics <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Detailed explanations of centripetal force and velocity in circular motion.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Loop-the-Loop Speed Calculator"
      description="Physics for fun. Calculate the minimum speed a car needs to successfully drive through a vertical loop-the-loop without falling."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "v = √(g × r)",
        variables: [
          { symbol: "v", description: "Minimum speed at bottom of loop (m/s)" },
          { symbol: "g", description: "Acceleration due to gravity (9.81 m/s²)" },
          { symbol: "r", description: "Radius of the loop (meters)" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Calculate the minimum speed needed to complete a loop with a radius of 5 meters.",
        steps: [
          {
            label: "1",
            explanation: "Identify the radius r = 5 meters and use g = 9.81 m/s².",
          },
          {
            label: "2",
            explanation: "Apply the formula v = √(g × r) = √(9.81 × 5) ≈ 7.0 m/s.",
          },
          {
            label: "3",
            explanation: "The car must have at least 7.0 m/s speed at the bottom to complete the loop safely.",
          },
        ],
        result: "Minimum speed = 7.0 m/s",
      }}
      relatedCalculators={[
        { title: "Donut Calculator", url: "/funny/donut-calculator", icon: "🍩" },
        { title: "Lost Socks Calculator", url: "/funny/lost-socks-calculator", icon: "🤪" },
        { title: "Rocks to Flood a Country Estimator", url: "/funny/rocks-to-flood-country", icon: "✈️" },
        { title: "Coffee Strength vs Productivity Score", url: "/funny/coffee-strength-vs-productivity-meme", icon: "☕" },
        { title: "Zombie Survival Calculator", url: "/funny/zombie-survival-calculator", icon: "🧟" },
        { title: "Ideal Egg Boiling Calculator", url: "/funny/ideal-egg-boiling-calculator", icon: "🤪" },
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