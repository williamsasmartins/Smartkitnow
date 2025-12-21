import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Lightbulb, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function NickelsToCrushCalculator() {
  /**
   * Inputs:
   * - crushForce: The force required to crush the object (in pounds-force, lbf)
   * - nickelWeight: Weight of one nickel (default 0.176 ounces)
   * - gravity: Gravity acceleration (default 32.174 ft/s², standard)
   * 
   * Formula:
   * Number of nickels = Crush Force (lbf) / Weight per nickel (lbf)
   * 
   * Since weight is force, we can directly divide crush force by nickel weight force.
   * 
   * Note: 1 ounce-force = 1/16 lbf (since 1 lbf = 16 ounces-force)
   * So, nickelWeight in ounces-force must be converted to lbf by dividing by 16.
   */

  const [inputs, setInputs] = useState({
    crushForce: "", // in lbf
    nickelWeightOz: "0.176", // default weight of nickel in ounces
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const crushForceNum = parseFloat(inputs.crushForce);
    const nickelWeightOzNum = parseFloat(inputs.nickelWeightOz);

    // Initial state safety: if inputs empty or invalid, return neutral state
    if (
      !inputs.crushForce ||
      !inputs.nickelWeightOz ||
      isNaN(crushForceNum) ||
      isNaN(nickelWeightOzNum) ||
      crushForceNum <= 0 ||
      nickelWeightOzNum <= 0
    ) {
      return { value: null };
    }

    // Convert nickel weight from ounces-force to pounds-force
    // 1 lbf = 16 ounces-force
    const nickelWeightLbf = nickelWeightOzNum / 16;

    // Calculate number of nickels needed to crush
    const nickelsNeeded = crushForceNum / nickelWeightLbf;

    // Format number with commas, rounded up to nearest whole number
    const nickelsRounded = Math.ceil(nickelsNeeded);

    return {
      value: nickelsRounded.toLocaleString("en-US"),
      label: "Nickels Needed to Crush",
      subtext: `Based on a crush force of ${crushForceNum.toLocaleString(
        "en-US"
      )} lbf and nickel weight of ${nickelWeightOzNum} oz-force`,
      color: "text-blue-600",
      icon: <Sparkles className="mx-auto h-12 w-12 text-blue-600" />,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the 'Nickels to Crush' calculator?",
      answer:
        "This calculator estimates how many U.S. nickels stacked on top of an object would exert enough force to crush it. It uses the object's crush force and the weight of a nickel to determine the count.",
    },
    {
      question: "Why do we use pounds-force and ounces-force?",
      answer:
        "Pounds-force (lbf) and ounces-force are units of force, representing weight under Earth's gravity. This calculator uses these units to relate the object's crush force to the weight of nickels.",
    },
    {
      question: "Can I change the weight of the nickel?",
      answer:
        "Yes, you can adjust the nickel weight if you want to simulate different coins or conditions. The default is 0.176 ounces-force, the standard weight of a U.S. nickel.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="crushForce">Crush Force Required (lbf)</Label>
          <Input
            id="crushForce"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 5000"
            value={inputs.crushForce}
            onChange={(e) => handleInputChange("crushForce", e.target.value)}
          />
          <p className="text-sm text-slate-500 mt-1">
            Enter the force required to crush the object in pounds-force (lbf).
          </p>
        </div>
        <div>
          <Label htmlFor="nickelWeightOz">Weight of One Nickel (oz-force)</Label>
          <Input
            id="nickelWeightOz"
            type="text"
            inputMode="decimal"
            value={inputs.nickelWeightOz}
            onChange={(e) => handleInputChange("nickelWeightOz", e.target.value)}
          />
          <p className="text-sm text-slate-500 mt-1">
            Default is 0.176 oz-force (standard U.S. nickel weight).
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special calculation needed here since useMemo updates automatically
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ crushForce: "", nickelWeightOz: "0.176" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value !== null && (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">{results.icon}</div>
            <p className={`text-5xl font-extrabold ${results.color}`}>
              {results.value}
            </p>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
              {results.label}
            </p>
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
          Understanding Nickels to Crush Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Nickels to Crush Calculator estimates how many U.S. nickels stacked on top of an object would exert enough force to crush it. This is based on the object's crush force, measured in pounds-force (lbf), and the weight of a single nickel. By dividing the total force required by the weight of one nickel, you get the number of nickels needed to reach that force. This fun yet practical tool helps visualize force in everyday terms.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
              Did You Know?
            </h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            A U.S. nickel weighs exactly 5 grams, which is approximately 0.176 ounces. When stacked, nickels can exert significant force due to their combined weight, making them a surprisingly effective way to visualize pressure and crushing forces in everyday objects.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use the Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, enter the crush force required to break or deform your object in pounds-force (lbf). You can adjust the weight of a single nickel if needed, but the default value reflects the standard U.S. nickel weight. Click "Calculate" to see how many nickels stacked would generate enough force to crush the object. Use the reset button to clear inputs and start over.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-6">
          {faqs.map(({ question, answer }, i) => (
            <div key={i}>
              <dt className="font-semibold text-lg text-slate-900 dark:text-slate-100">{question}</dt>
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
              href="https://www.usmint.gov/learn/coin-and-medal-programs/coin-specifications"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              U.S. Mint Coin Specifications <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official weight and specifications for U.S. coins.
            </p>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Pound-force"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Pound-force - Wikipedia <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Explanation of pounds-force as a unit of force.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Nickels to Crush Calculator"
      description="Hydraulic press simulator. Calculate how many nickels stacked on top of an object would be heavy enough to crush it."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "N = F / W",
        variables: [
          { symbol: "N", description: "Number of nickels needed to crush the object" },
          { symbol: "F", description: "Crush force required (pounds-force, lbf)" },
          { symbol: "W", description: "Weight of one nickel (pounds-force, lbf)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Suppose an object requires 5000 pounds-force to crush. Using the standard nickel weight, calculate how many nickels are needed.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert nickel weight from ounces-force to pounds-force: 0.176 oz ÷ 16 = 0.011 pounds-force.",
          },
          {
            label: "2",
            explanation:
              "Divide crush force by nickel weight: 5000 lbf ÷ 0.011 lbf ≈ 454,545 nickels.",
          },
          {
            label: "3",
            explanation:
              "Round up to the nearest whole number: 454,545 nickels needed to crush the object.",
          },
        ],
        result: "454,545 nickels",
      }}
      relatedCalculators={[
        { title: "Lost Socks Calculator", url: "/funny/lost-socks-calculator", icon: "🤪" },
        { title: "Dog Zoomies Energy Release Meter", url: "/funny/dog-zoomies-energy-meter", icon: "🐈" },
        { title: "Pizza Slices per Person & Regret Index", url: "/funny/pizza-slices-per-person-regret-index", icon: "🍕" },
        { title: "Life Value Estimator (Worth in Tacos)", url: "/funny/life-value-in-tacos", icon: "🍩" },
        { title: "Crinkle Crankle Wall Brick Saver", url: "/funny/crinkle-crankle-wall-brick-saver", icon: "🤪" },
        { title: "Penguin Slap Power Calculator", url: "/funny/penguin-slap-power", icon: "🐈" },
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