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
// ⚠️ FULL FUNNY ICON IMPORT
import {
  Smile,
  Frown,
  Meh,
  Ghost,
  Skull,
  Coffee,
  Utensils,
  Gamepad2,
  Cat,
  Dog,
  Zap,
  Heart,
  Calculator,
  Info,
  RotateCcw,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Flame,
  Clock,
  Ticket,
  Plane,
  Globe,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PizzaSizePriceComparisonCalculator() {
  // ⚠️ STATE: Must include 'unit' if applicable
  const [inputs, setInputs] = useState({
    unit: "cm",
    diameter1: "",
    price1: "",
    diameter2: "",
    price2: "",
  });
  const handleInputChange = useCallback(
    (n, v) =>
      setInputs((p) => ({
        ...p,
        [n]: v,
      })),
    []
  );

  // Helper: convert diameter to cm (base unit)
  // 1 inch = 2.54 cm
  const diameter1Cm = useMemo(() => {
    const d = parseFloat(inputs.diameter1);
    if (isNaN(d) || d <= 0) return null;
    return inputs.unit === "in" ? d * 2.54 : d;
  }, [inputs.diameter1, inputs.unit]);

  const diameter2Cm = useMemo(() => {
    const d = parseFloat(inputs.diameter2);
    if (isNaN(d) || d <= 0) return null;
    return inputs.unit === "in" ? d * 2.54 : d;
  }, [inputs.diameter2, inputs.unit]);

  const price1Num = useMemo(() => {
    const p = parseFloat(inputs.price1);
    if (isNaN(p) || p <= 0) return null;
    return p;
  }, [inputs.price1]);

  const price2Num = useMemo(() => {
    const p = parseFloat(inputs.price2);
    if (isNaN(p) || p <= 0) return null;
    return p;
  }, [inputs.price2]);

  // Calculate areas and price per square cm
  // Area = π * (r)^2
  // Price per sq cm = price / area
  const results = useMemo(() => {
    if (
      diameter1Cm === null ||
      diameter2Cm === null ||
      price1Num === null ||
      price2Num === null
    ) {
      return {
        value: null,
        label: null,
        subtext: "Fill in all fields with positive numbers, please 🍕",
        warning: null,
        formulaUsed: "Area = π × (diameter/2)²; Price per cm² = Price ÷ Area",
      };
    }

    const area1 = Math.PI * (diameter1Cm / 2) ** 2;
    const area2 = Math.PI * (diameter2Cm / 2) ** 2;

    const pricePerCm2_1 = price1Num / area1;
    const pricePerCm2_2 = price2Num / area2;

    // Determine which pizza is better deal (lower price per cm²)
    let betterPizza = "";
    let betterPrice = 0;
    let worsePrice = 0;
    let ratio = 0;

    if (pricePerCm2_1 < pricePerCm2_2) {
      betterPizza = "Pizza 1";
      betterPrice = pricePerCm2_1;
      worsePrice = pricePerCm2_2;
    } else if (pricePerCm2_2 < pricePerCm2_1) {
      betterPizza = "Pizza 2";
      betterPrice = pricePerCm2_2;
      worsePrice = pricePerCm2_1;
    } else {
      betterPizza = "Both pizzas";
      betterPrice = pricePerCm2_1;
      worsePrice = pricePerCm2_2;
    }

    ratio = worsePrice / betterPrice;

    // Fun messages based on ratio
    let subtext = "";
    let warning = null;

    if (betterPizza === "Both pizzas") {
      subtext = "Tie game! Your wallet can relax... for now.";
    } else if (ratio > 1.5) {
      subtext = `Whoa! ${betterPizza} is a steal — over 50% cheaper per square cm! 🍕💰`;
      warning = (
        <AlertTriangle className="inline-block h-4 w-4 text-yellow-600 mr-1" />
      );
    } else if (ratio > 1.1) {
      subtext = `${betterPizza} edges out the competition. Your taste buds approve.`;
    } else {
      subtext = `Close call! ${betterPizza} is slightly better value. Choose your fighter.`;
    }

    // Format price per sq cm nicely
    const formatPrice = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });

    return {
      value: (
        <>
          {betterPizza} wins! <br />
          {formatPrice(betterPrice)} per cm&lt;sup&gt;2&lt;/sup&gt;
          {warning}
        </>
      ),
      label: "Best Value Pizza",
      subtext,
      warning,
      formulaUsed:
        "Area = π × (diameter/2)²; Price per cm² = Price ÷ Area (cm base unit)",
    };
  }, [diameter1Cm, diameter2Cm, price1Num, price2Num]);

  const faqs = [
    {
      question: "Why do I need to compare pizza sizes with math? Can't I just eyeball it?",
      answer:
        "Sure, you can eyeball it — but remember, the area grows with the square of the diameter, not linearly. That means a 16-inch pizza isn't just twice as big as an 8-inch, it's FOUR times the pizza. Math saves your hunger and wallet! 🍕📐",
    },
    {
      question: "Why do you convert everything to cm? I'm a proud inch user!",
      answer:
        "Ah, the classic Metric vs. Freedom Units debate. We convert to cm internally because math loves consistency. But hey, you get to pick your units — we just keep the math neat behind the scenes. 🇺🇸➡️🌍",
    },
    {
      question: "Can I compare more than two pizzas?",
      answer:
        "Right now, this calculator is a tag-team for two pizzas. But if you want a pizza party with more contenders, stay tuned — or grab a calculator and some extra cheese!",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
          aria-label="Select your unit system"
        >
          <SelectTrigger className="w-[180px]">
            <Globe className="mr-2 h-4 w-4" />{" "}
            <SelectValue>
              {inputs.unit === "cm"
                ? "Metric (cm) - The sensible choice"
                : "Imperial (in) - Freedom Units, y'all!"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cm">Metric (cm)</SelectItem>
            <SelectItem value="in">Imperial (inches)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pizza 1 Inputs */}
      <div>
        <Label htmlFor="diameter1" className="font-semibold">
          Pizza 1 Diameter ({inputs.unit})
        </Label>
        <Input
          id="diameter1"
          type="number"
          min="0"
          step="0.1"
          placeholder={`e.g. ${inputs.unit === "cm" ? "30" : "12"}`}
          value={inputs.diameter1}
          onChange={(e) => handleInputChange("diameter1", e.target.value)}
          aria-describedby="diameter1-desc"
        />
        <p
          id="diameter1-desc"
          className="text-xs text-slate-500 dark:text-slate-400"
        >
          Enter the diameter of your first pizza.
        </p>
      </div>
      <div>
        <Label htmlFor="price1" className="font-semibold">
          Pizza 1 Price (USD)
        </Label>
        <Input
          id="price1"
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g. 15.99"
          value={inputs.price1}
          onChange={(e) => handleInputChange("price1", e.target.value)}
          aria-describedby="price1-desc"
        />
        <p
          id="price1-desc"
          className="text-xs text-slate-500 dark:text-slate-400"
        >
          How much does Pizza 1 cost? (No, not in hugs)
        </p>
      </div>

      {/* Pizza 2 Inputs */}
      <div>
        <Label htmlFor="diameter2" className="font-semibold">
          Pizza 2 Diameter ({inputs.unit})
        </Label>
        <Input
          id="diameter2"
          type="number"
          min="0"
          step="0.1"
          placeholder={`e.g. ${inputs.unit === "cm" ? "40" : "16"}`}
          value={inputs.diameter2}
          onChange={(e) => handleInputChange("diameter2", e.target.value)}
          aria-describedby="diameter2-desc"
        />
        <p
          id="diameter2-desc"
          className="text-xs text-slate-500 dark:text-slate-400"
        >
          Enter the diameter of your second pizza.
        </p>
      </div>
      <div>
        <Label htmlFor="price2" className="font-semibold">
          Pizza 2 Price (USD)
        </Label>
        <Input
          id="price2"
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g. 21.99"
          value={inputs.price2}
          onChange={(e) => handleInputChange("price2", e.target.value)}
          aria-describedby="price2-desc"
        />
        <p
          id="price2-desc"
          className="text-xs text-slate-500 dark:text-slate-400"
        >
          How much does Pizza 2 cost? (We accept cash, card, and pizza jokes)
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {}}
          aria-label="Calculate pizza value"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ unit: "cm", diameter1: "", price1: "", diameter2: "", price2: "" })
          }
          className="flex-1 h-11"
          aria-label="Reset all inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center text-blue-900 dark:text-white">
            <p className="text-5xl font-extrabold">{results.value}</p>
            <p className="mt-3 text-lg font-semibold">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Pizza Size/Price Comparison Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Ever stared at two pizzas and wondered, "Which one is actually the
          better deal?" This calculator solves that eternal dinner dilemma by
          comparing the price per square centimeter (or inch, if you're feeling
          rebellious). Because pizza is a circle, and circles have math —{" "}
          <em>πr²</em> to be exact — bigger diameter means exponentially more
          pizza, not just a little more.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          So, whether you're a metric loyalist or a freedom-unit enthusiast, this
          tool converts your inputs to a common base unit and tells you which
          pizza gives you the most bang for your buck (and belly).
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Follow these simple steps to become the pizza price comparison champ:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Select your preferred unit system: Metric (cm) or Imperial (inches).
            Because pizza sizes come in all shapes and units.
          </li>
          <li>
            Enter the diameter and price of your first pizza. No guessing —
            eyeballs are not calculators.
          </li>
          <li>
            Enter the diameter and price of your second pizza. Yes, you can
            compare a medium with a large. We won't judge.
          </li>
          <li>
            Hit Calculate and watch the magic happen. The calculator will tell
            you which pizza is the better value per square unit.
          </li>
          <li>
            Bask in your newfound pizza wisdom and order accordingly. Your wallet
            and stomach will thank you.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Pro Tips
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Because pizza is serious business, here are some tips to maximize your
          cheesy gains:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Always double-check your units. Mixing cm and inches is like mixing
            pineapple and pepperoni — controversial and messy.
          </li>
          <li>
            Remember that crust thickness and toppings don't factor into this
            calculator. So if you love extra cheese, you might want to adjust
            your order accordingly.
          </li>
          <li>
            Use this calculator to impress friends at pizza parties. Bonus points
            if you bring a protractor.
          </li>
          <li>
            If the prices are close, consider taste, delivery time, or your
            favorite pizza place's loyalty program. Math can't solve everything.
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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References
        </h2>
        <ul className="space-y-4">
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Area_of_a_circle"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              The Geometry of Circles <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The classic math behind why pizza size matters more than you think.
            </p>
          </li>
          <li>
            <a
              href="https://www.cdc.gov/prepyourhealth/zombies.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC Preparedness: Zombies <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Because every calculator needs a fun, unexpected reference.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Pizza Size/Price Comparison Calculator"
      description="Solve the ultimate dinner dilemma. Calculate price per square inch to see if two medium pizzas are a better deal than one large."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Area = π × (diameter/2)²; Price per unit area = Price ÷ Area",
        variables: [
          { symbol: "π", description: "Pi, approximately 3.14159" },
          { symbol: "diameter", description: "Diameter of the pizza" },
          { symbol: "Area", description: "Surface area of the pizza" },
          { symbol: "Price", description: "Cost of the pizza" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You want to know if a 12-inch pizza for $15 or a 16-inch pizza for $22 is the better deal.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the area of each pizza: Area = π × (diameter/2)²",
          },
          {
            label: "2",
            explanation:
              "Calculate price per square inch: Price ÷ Area",
          },
          {
            label: "3",
            explanation:
              "Compare the two values. Lower price per square inch means better deal.",
          },
        ],
        result:
          "The 16-inch pizza has a lower price per square inch, so it's the better value.",
      }}
      relatedCalculators={[
        {
          title: "Netflix 'Just One More Episode' Timer",
          url: "/funny/netflix-one-more-episode-timer",
          icon: "🤪",
        },
        {
          title: "Ideal Egg Boiling Calculator",
          url: "/funny/ideal-egg-boiling-calculator",
          icon: "🤪",
        },
        {
          title: "Plant Watering Procrastination Index",
          url: "/funny/plant-watering-procrastination-index",
          icon: "🤪",
        },
        {
          title: "Donut Calculator",
          url: "/funny/donut-calculator",
          icon: "🍩",
        },
        {
          title: "Coffee Addiction Meter",
          url: "/funny/coffee-addiction-meter",
          icon: "☕",
        },
        {
          title: "Lost Socks Calculator",
          url: "/funny/lost-socks-calculator",
          icon: "🤪",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Pro Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}