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

function toCm(value: number, unit: string) {
  // Convert input size to cm (base unit)
  if (unit === "in") return value * 2.54;
  return value; // cm
}

function toInches(value: number, unit: string) {
  // Convert input size to inches (for display if needed)
  if (unit === "cm") return value / 2.54;
  return value; // in
}

function formatPrice(value: number) {
  // Format price with 2 decimals and $ sign (can be extended for global currency)
  return `$${value.toFixed(2)}`;
}

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
    (n, v) => setInputs((p) => ({ ...p, [n]: v })),
    []
  );

  // Calculate areas, price per unit area, and compare
  const results = useMemo(() => {
    const d1 = parseFloat(inputs.diameter1);
    const p1 = parseFloat(inputs.price1);
    const d2 = parseFloat(inputs.diameter2);
    const p2 = parseFloat(inputs.price2);

    if (
      isNaN(d1) ||
      isNaN(p1) ||
      isNaN(d2) ||
      isNaN(p2) ||
      d1 <= 0 ||
      p1 <= 0 ||
      d2 <= 0 ||
      p2 <= 0
    ) {
      return {
        value: null,
        label: null,
        subtext: "Fill in all fields with positive numbers, or the pizza gods get sad.",
        warning: null,
        formulaUsed: "Area = π × (diameter ÷ 2)²; Price per cm² = Price ÷ Area",
      };
    }

    // Convert diameters to cm base unit
    const d1cm = toCm(d1, inputs.unit);
    const d2cm = toCm(d2, inputs.unit);

    // Calculate areas in cm²
    const area1 = Math.PI * (d1cm / 2) ** 2;
    const area2 = Math.PI * (d2cm / 2) ** 2;

    // Price per cm²
    const pricePerCm2_1 = p1 / area1;
    const pricePerCm2_2 = p2 / area2;

    // Determine better deal
    let betterDeal = "";
    let emoji = "";
    let warning = null;

    if (pricePerCm2_1 < pricePerCm2_2) {
      betterDeal = `Pizza 1 is the better deal! ${pricePerCm2_1.toFixed(
        4
      )} per cm² vs ${pricePerCm2_2.toFixed(4)}`;
      emoji = "🍕";
    } else if (pricePerCm2_1 > pricePerCm2_2) {
      betterDeal = `Pizza 2 wins the price war! ${pricePerCm2_2.toFixed(
        4
      )} per cm² vs ${pricePerCm2_1.toFixed(4)}`;
      emoji = "🔥";
    } else {
      betterDeal = `Tie! Both pizzas cost exactly the same per cm². How boring.`;
      emoji = "😐";
    }

    // Funny warning if difference is tiny
    const diff = Math.abs(pricePerCm2_1 - pricePerCm2_2);
    if (diff < 0.0001) {
      warning =
        "Warning: The difference is so small, you might as well flip a coin or just eat both.";
    }

    // Show price per square inch too for fun (if unit is cm, convert)
    const area1In = area1 / (2.54 * 2.54);
    const area2In = area2 / (2.54 * 2.54);
    const pricePerIn2_1 = p1 / area1In;
    const pricePerIn2_2 = p2 / area2In;

    return {
      value: (
        <>
          <div className="text-2xl font-semibold mb-2">{emoji} Best Deal:</div>
          <div className="text-lg font-bold">{betterDeal}</div>
          <div className="mt-3 text-sm text-slate-700 dark:text-slate-300">
            Pizza 1: {formatPrice(p1)} for {d1}
            {inputs.unit} diameter (~{area1.toFixed(1)} cm² /{" "}
            {area1In.toFixed(1)} in²)
            <br />
            Price per cm²: {pricePerCm2_1.toFixed(4)}, per in²:{" "}
            {pricePerIn2_1.toFixed(4)}
            <br />
            Pizza 2: {formatPrice(p2)} for {d2}
            {inputs.unit} diameter (~{area2.toFixed(1)} cm² /{" "}
            {area2In.toFixed(1)} in²)
            <br />
            Price per cm²: {pricePerCm2_2.toFixed(4)}, per in²:{" "}
            {pricePerIn2_2.toFixed(4)}
          </div>
        </>
      ),
      label: "Price per unit area comparison",
      subtext:
        warning ||
        "Calculated using the sacred geometry of circles and a sprinkle of pizza magic.",
      warning,
      formulaUsed:
        "Area = π × (diameter ÷ 2)²; Price per unit area = Price ÷ Area (cm² or in²)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why compare price per square inch/cm instead of just price?",
      answer:
        "Because a bigger pizza isn’t always a better deal. You want to know how much pizza you get for each dollar. Geometry helps you avoid pizza buyer's remorse.",
    },
    {
      question: "Can I use this calculator for weird-shaped pizzas?",
      answer:
        "If your pizza is shaped like a perfect circle, this calculator is your best friend. For other shapes, well... you might need a protractor or just trust your gut (and appetite).",
    },
    {
      question: "Why the unit selector? Can’t you just pick one?",
      answer:
        "We live in a world divided by the Metric and Imperial empires. Choose your side wisely — or just pick the one you understand without Googling.",
    },
    {
      question: "What if the prices or diameters are zero or negative?",
      answer:
        "Then you’re either dreaming of free pizza or trying to break math. Please enter positive numbers, or the pizza gods will frown upon you.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector Example */}
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
        >
          <SelectTrigger className="w-[160px]">
            <Globe className="mr-2 h-4 w-4" />{" "}
            <SelectValue>
              {inputs.unit === "cm"
                ? "Metric (cm) - The sensible choice"
                : "Imperial (in) - Freedom Units!"}
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
          placeholder={`e.g. 30 ${inputs.unit}`}
          value={inputs.diameter1}
          onChange={(e) => handleInputChange("diameter1", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="price1" className="font-semibold">
          Pizza 1 Price (your currency)
        </Label>
        <Input
          id="price1"
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g. 12.99"
          value={inputs.price1}
          onChange={(e) => handleInputChange("price1", e.target.value)}
        />
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
          placeholder={`e.g. 40 ${inputs.unit}`}
          value={inputs.diameter2}
          onChange={(e) => handleInputChange("diameter2", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="price2" className="font-semibold">
          Pizza 2 Price (your currency)
        </Label>
        <Input
          id="price2"
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g. 18.99"
          value={inputs.price2}
          onChange={(e) => handleInputChange("price2", e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            /* Just trigger recalculation by updating state with same values */
            setInputs((p) => ({ ...p }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ unit: "cm", diameter1: "", price1: "", diameter2: "", price2: "" })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            {typeof results.value === "string" ? (
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
            ) : (
              results.value
            )}
            <p className="mt-4 text-sm italic text-slate-700 dark:text-slate-400">
              {results.subtext}
            </p>
            {results.warning && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400 font-semibold">
                ⚠️ {results.warning}
              </p>
            )}
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
          Ever stared at two pizza options and wondered, "Which one gives me more
          bang for my buck?" This calculator solves that age-old dilemma by
          comparing the price per square unit of pizza area. Because pizza is
          circular, we use the sacred geometry of circles (yes, π is involved)
          to figure out how much pizza you actually get for your money.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Whether you measure in centimeters (the sensible metric) or inches (the
          freedom units), this tool converts everything behind the scenes to make
          sure you get a fair comparison. No more guessing or trusting the pizza
          guy's sales pitch!
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Follow these simple steps to become the pizza price guru among your
          friends:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Select your preferred unit system: Metric (cm) or Imperial (inches).
            Choose wisely, or just pick what your pizza box says.
          </li>
          <li>
            Enter the diameter of Pizza 1 and its price. Don’t forget the decimal
            points — pizza is serious business.
          </li>
          <li>
            Enter the diameter and price for Pizza 2. Maybe it’s a different size,
            or maybe it’s just a sneaky deal.
          </li>
          <li>Hit Calculate and watch the magic happen.</li>
          <li>
            Read the results to see which pizza gives you more pizza per dollar.
            Spoiler: Bigger isn’t always better.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Pro Tips
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Because we care about your pizza experience, here are some tips:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Always double-check the units on your pizza box. You don’t want to
            accidentally compare a 30 cm pizza to a 30 inch pizza. That’s a lot of
            pizza.
          </li>
          <li>
            Remember that toppings and crust thickness can affect your satisfaction,
            but this calculator focuses purely on size and price.
          </li>
          <li>
            If you’re ordering more than two pizzas, just compare them pairwise or
            use this tool multiple times. Your stomach will thank you.
          </li>
          <li>
            Use the reset button to clear inputs and avoid leftover pizza math
            confusion.
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
              Because pizza is basically a delicious circle, math helps us figure
              out how much you’re really getting.
            </p>
          </li>
          <li>
            <a
              href="https://www.cdc.gov/prepyourhealth/ready.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC Preparedness <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Always be prepared — for pizza emergencies and zombie apocalypses.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Pizza Size/Price Comparison Calculator"
      description="Solve the ultimate dinner dilemma. Calculate price per square inch/cm to see if two medium pizzas are a better deal than one large."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Area = π × (diameter ÷ 2)²; Price per unit area = Price ÷ Area",
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
          "You have two pizzas: a 30 cm pizza for $12 and a 40 cm pizza for $18. Which is the better deal?",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate area of each pizza: Area = π × (diameter ÷ 2)²",
          },
          {
            label: "2",
            explanation: "Calculate price per cm²: Price ÷ Area",
          },
          {
            label: "3",
            explanation:
              "Compare the price per cm² values to find the better deal.",
          },
        ],
        result:
          "The 40 cm pizza has a lower price per cm², so it’s the better deal.",
      }}
      relatedCalculators={[
        {
          title: "Meetings Wasted-Time Counter",
          url: "/funny/meetings-wasted-time-counter",
          icon: "💻",
        },
        {
          title: "Nickels to Crush Calculator",
          url: "/funny/nickels-to-crush-calculator",
          icon: "🤪",
        },
        {
          title: "Rocks to Flood a Country Estimator",
          url: "/funny/rocks-to-flood-country",
          icon: "✈️",
        },
        {
          title: "Pizza Slices per Person & Regret Index",
          url: "/funny/pizza-slices-per-person-regret-index",
          icon: "🍕",
        },
        {
          title: "Crinkle Crankle Wall Brick Saver",
          url: "/funny/crinkle-crankle-wall-brick-saver",
          icon: "🤪",
        },
        {
          title: "Plant Watering Procrastination Index",
          url: "/funny/plant-watering-procrastination-index",
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