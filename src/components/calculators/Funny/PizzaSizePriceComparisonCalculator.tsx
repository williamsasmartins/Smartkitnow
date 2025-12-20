import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function roundToTwo(num: number) {
  return Math.round(num * 100) / 100;
}

export default function PizzaSizePriceComparisonCalculator() {
  // Inputs: size1, price1, size2, price2 (optional)
  const [inputs, setInputs] = useState({
    size1: "",
    price1: "",
    size2: "",
    price2: "",
  });

  const handleInputChange = useCallback((n: string, v: string) => {
    // Only allow numbers and dot for price and size inputs
    if (/^\d*\.?\d*$/.test(v) || v === "") {
      setInputs((p) => ({ ...p, [n]: v }));
    }
  }, []);

  // Calculate area and price per square inch
  // Area = π * (diameter/2)^2
  // Price per sq inch = price / area
  // Compare two pizzas or just one pizza's price per sq inch

  const results = useMemo(() => {
    const d1 = parseFloat(inputs.size1);
    const p1 = parseFloat(inputs.price1);
    const d2 = parseFloat(inputs.size2);
    const p2 = parseFloat(inputs.price2);

    if (!d1 || !p1 || d1 <= 0 || p1 <= 0) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid size & price for Pizza #1. No pizza, no party.",
        warning: null,
        formulaUsed: null,
      };
    }

    const area1 = Math.PI * (d1 / 2) * (d1 / 2);
    const ppsq1 = p1 / area1;

    if ((!d2 && !p2) || d2 <= 0 || p2 <= 0) {
      // Only one pizza entered, just show price per sq inch
      return {
        value: `$${roundToTwo(ppsq1)} / sq inch`,
        label: `Pizza #1's price per square inch`,
        subtext: `Your ${d1}" pizza costs about $${roundToTwo(ppsq1)} per square inch. Geometry says: bigger pizza = better deal (usually).`,
        warning: null,
        formulaUsed: `Price per sq inch = Price ÷ (π × (Diameter ÷ 2)²)`,
      };
    }

    // Both pizzas entered, compare deals
    const area2 = Math.PI * (d2 / 2) * (d2 / 2);
    const ppsq2 = p2 / area2;

    let betterPizza = "";
    let emoji = <Meh className="inline-block w-5 h-5 text-yellow-500" />;

    if (ppsq1 < ppsq2) {
      betterPizza = `Pizza #1 (${d1}" at $${p1}) is the better deal!`;
      emoji = <Smile className="inline-block w-5 h-5 text-green-600" />;
    } else if (ppsq2 < ppsq1) {
      betterPizza = `Pizza #2 (${d2}" at $${p2}) is the better deal!`;
      emoji = <Smile className="inline-block w-5 h-5 text-green-600" />;
    } else {
      betterPizza = `Both pizzas cost the same per square inch. Pizza gods are indecisive today.`;
      emoji = <Meh className="inline-block w-5 h-5 text-yellow-500" />;
    }

    return {
      value: (
        <>
          <span>
            Pizza #1: ${roundToTwo(ppsq1)} / sq inch<br />
            Pizza #2: ${roundToTwo(ppsq2)} / sq inch
          </span>
          <br />
          <span className="mt-3 font-semibold text-lg">
            {betterPizza} {emoji}
          </span>
        </>
      ),
      label: "Price per square inch comparison",
      subtext:
        "Because math + pizza = happiness. Remember: bigger isn't always better if price per inch is sky-high.",
      warning: null,
      formulaUsed: `Price per sq inch = Price ÷ (π × (Diameter ÷ 2)²)`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Can I use this calculator for weird-shaped pizzas? Like, square or heart-shaped?",
      answer:
        "Ah, the rebellious pizza shapes! This calculator worships circles only — because π is a circle’s best friend. For squares, just use side² for area. For hearts... well, good luck measuring that slice. Geometry, am I right? (Source: Geometry, the pizza whisperer)",
    },
    {
      question: "Why does bigger pizza usually mean better deal? Is it magic?",
      answer:
        "No magic, just math. Area grows with the square of the radius, but price doesn’t always keep up. So, you get more pizza per dollar. It’s like buying in bulk, but tastier. (Source: Geometry, the pizza overlord)",
    },
    {
      question: "Can I enter toppings cost separately?",
      answer:
        "Nice try, but toppings are a wild card. This calculator sticks to base pizza size and price. For toppings, just add a mental surcharge — or better yet, eat more pizza to forget the math.",
    },
    {
      question: "What if I want to compare three pizzas? Or a pizza and a calzone?",
      answer:
        "Three pizzas? You’re a pizza champion! But this tool is a simple soul and only compares two. Calzones? That’s a different beast — try a calzone calculator (coming never).",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="size1" className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-red-600" />
            Diameter of Pizza #1 (inches)
          </Label>
          <Input
            id="size1"
            type="text"
            placeholder="E.g. 12"
            value={inputs.size1}
            onChange={(e) => handleInputChange("size1", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="price1" className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Price of Pizza #1 ($)
          </Label>
          <Input
            id="price1"
            type="text"
            placeholder="E.g. 15.99"
            value={inputs.price1}
            onChange={(e) => handleInputChange("price1", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="size2" className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-red-600" />
            Diameter of Pizza #2 (optional)
          </Label>
          <Input
            id="size2"
            type="text"
            placeholder="E.g. 16"
            value={inputs.size2}
            onChange={(e) => handleInputChange("size2", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="price2" className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Price of Pizza #2 (optional)
          </Label>
          <Input
            id="price2"
            type="text"
            placeholder="E.g. 22.5"
            value={inputs.price2}
            onChange={(e) => handleInputChange("price2", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No special action needed, results update automatically
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ size1: "", price1: "", size2: "", price2: "" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-yellow-50 to-red-100 dark:from-slate-900 dark:to-slate-950 border-yellow-300 shadow-lg">
          <CardContent className="p-8 text-center text-red-900 dark:text-white">
            <p className="text-4xl font-extrabold">{results.label}</p>
            <div className="mt-4 text-2xl">{results.value}</div>
            <p className="mt-3 italic text-sm text-red-700 dark:text-red-300">{results.subtext}</p>
            {results.warning && (
              <p className="mt-2 text-sm text-red-900 dark:text-red-400 flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
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
          Ever stared at a pizza menu, wondering if two mediums really trump one large? Welcome to the
          ultimate pizza showdown! This calculator uses the sacred art of Geometry (yes, that π stuff)
          to figure out which pizza gives you the most bang for your buck — or should we say, slice for
          your dollar. Because let’s face it, nobody wants to pay extra for crust fluff.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The formula is simple: calculate the area of each pizza (π × radius²), then divide the price
          by that area to get the price per square inch. Lower price per square inch = better deal.
          Science never tasted so delicious.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          1. Enter the diameter (in inches) and price ($) of your first pizza. This is your baseline
          slice of heaven.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          2. Optionally, enter the diameter and price of a second pizza to compare deals. Because
          sometimes, you want to justify ordering two pizzas instead of one.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          3. Hit Calculate and watch the magic happen. The calculator will tell you which pizza is
          the better deal, or if the pizza gods are undecided.
        </p>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Pro Tips</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          - Bigger pizzas usually win because area grows with the square of the radius. But beware of
          fancy toppings that sneakily hike up the price.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          - Don’t forget to factor in your appetite. Sometimes the “better deal” pizza just means
          more leftovers (or more slices to share, if you’re feeling generous).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          - Use this calculator to impress friends with your pizza math skills. Bonus points if you
          throw in some π jokes.
        </p>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Fun Reads</h2>
        <ul className="space-y-4">
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Area_of_a_circle"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Geometry: Area of a Circle <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Because pizza is basically a delicious circle, and math is the secret sauce.
            </p>
          </li>
          <li>
            <a
              href="https://www.seriouseats.com/2015/05/why-big-pizzas-are-cheaper-per-square-inch.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Serious Eats: Why Big Pizzas Are Cheaper <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A tasty read about pizza economics and the math behind your favorite deals.
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
        title: "The Math (Maybe)",
        formula: "Price per sq inch = Price ÷ (π × (Diameter ÷ 2)²)",
        variables: [
          { symbol: "Price", description: "Cost of the pizza in dollars" },
          { symbol: "Diameter", description: "Diameter of the pizza in inches" },
          { symbol: "π", description: "Pi, approximately 3.14159 (Geometry)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You want to know if a 12\" pizza for $15 or a 16\" pizza for $22 is the better deal.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate area of 12\" pizza: π × (12 ÷ 2)² = π × 6² = 113.1 sq inches.",
          },
          {
            label: "2",
            explanation: "Calculate price per sq inch: $15 ÷ 113.1 = $0.13 per sq inch.",
          },
          {
            label: "3",
            explanation:
              "Calculate area of 16\" pizza: π × (16 ÷ 2)² = π × 8² = 201.1 sq inches.",
          },
          {
            label: "4",
            explanation: "Calculate price per sq inch: $22 ÷ 201.1 = $0.11 per sq inch.",
          },
          {
            label: "5",
            explanation: "Compare: $0.11 &lt; $0.13, so the 16\" pizza is the better deal.",
          },
        ],
        result: "Go big or go home! The 16\" pizza wins.",
      }}
      relatedCalculators={[
        { title: "Ideal Egg Boiling Calculator", url: "/funny/ideal-egg-boiling-calculator", icon: "🍩" },
        { title: "Vacation Budget Reality Check", url: "/funny/vacation-budget-reality-check", icon: "🐈" },
        { title: "Black Hole Sun Impact Calculator", url: "/funny/black-hole-sun-impact", icon: "🧟" },
        { title: "Zombie Survival Calculator", url: "/funny/zombie-survival-calculator", icon: "🧟" },
        { title: "Death by Caffeine (Max Safe Intake)", url: "/funny/death-by-caffeine", icon: "☕" },
        { title: "First-Date Awkwardness Meter", url: "/funny/first-date-awkwardness-meter", icon: "❤️" },
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