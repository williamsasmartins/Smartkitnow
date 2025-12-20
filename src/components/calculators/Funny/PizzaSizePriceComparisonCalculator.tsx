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
  Globe, // Importado Globe para o seletor de unidade
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function roundToTwo(num: number) {
  return Math.round(num * 100) / 100;
}

export default function PizzaSizePriceComparisonCalculator() {
  // Inputs: size1, price1, size2, price2, unit
  const [inputs, setInputs] = useState({
    size1: "",
    price1: "",
    size2: "",
    price2: "",
    unit: "in", // Default to inches
  });

  const handleInputChange = useCallback((n: string, v: string) => {
    // Allow text update or unit change
    setInputs((p) => ({ ...p, [n]: v }));
  }, []);

  // Calculate area and price per square unit
  const results = useMemo(() => {
    const d1 = parseFloat(inputs.size1);
    const p1 = parseFloat(inputs.price1);
    const d2 = parseFloat(inputs.size2);
    const p2 = parseFloat(inputs.price2);
    const unitLabel = inputs.unit === "in" ? "sq inch" : "sq cm";

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
      // Only one pizza entered
      return {
        value: `$${roundToTwo(ppsq1)} / ${unitLabel}`,
        label: `Pizza #1's price per square ${inputs.unit === "in" ? "inch" : "cm"}`,
        subtext: `Your ${d1} ${inputs.unit} pizza costs about $${roundToTwo(ppsq1)} per ${unitLabel}. Geometry says: bigger pizza = better deal (usually).`,
        warning: null,
        formulaUsed: `Price per unit = Price ÷ (π × (Diameter ÷ 2)²)`,
      };
    }

    // Both pizzas entered, compare deals
    const area2 = Math.PI * (d2 / 2) * (d2 / 2);
    const ppsq2 = p2 / area2;

    let betterPizza = "";
    let emoji = <Meh className="inline-block w-5 h-5 text-yellow-500" />;

    if (ppsq1 < ppsq2) {
      betterPizza = `Pizza #1 (${d1} ${inputs.unit} at $${p1}) is the better deal!`;
      emoji = <Smile className="inline-block w-5 h-5 text-green-600" />;
    } else if (ppsq2 < ppsq1) {
      betterPizza = `Pizza #2 (${d2} ${inputs.unit} at $${p2}) is the better deal!`;
      emoji = <Smile className="inline-block w-5 h-5 text-green-600" />;
    } else {
      betterPizza = `Both pizzas cost the same per ${unitLabel}. Pizza gods are indecisive today.`;
      emoji = <Meh className="inline-block w-5 h-5 text-yellow-500" />;
    }

    return {
      value: (
        <>
          <span>
            Pizza #1: ${roundToTwo(ppsq1)} / {unitLabel}<br />
            Pizza #2: ${roundToTwo(ppsq2)} / {unitLabel}
          </span>
          <br />
          <span className="mt-3 font-semibold text-lg">
            {betterPizza} {emoji}
          </span>
        </>
      ),
      label: `Price per ${unitLabel} comparison`,
      subtext:
        "Because math + pizza = happiness. Remember: bigger isn't always better if price per area is sky-high.",
      warning: null,
      formulaUsed: `Price per unit = Price ÷ (π × (Diameter ÷ 2)²)`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Can I use this calculator for weird-shaped pizzas?",
      answer:
        "Ah, the rebellious pizza shapes! This calculator worships circles only — because π is a circle’s best friend. For squares, just use side² for area.",
    },
    {
      question: "Why does bigger pizza usually mean better deal?",
      answer:
        "No magic, just math. Area grows with the square of the radius, but price doesn’t always keep up. So, you get more pizza per dollar.",
    },
    {
      question: "Metric vs Imperial?",
      answer:
        "We support both! Use the selector at the top to switch between inches (Freedom Units) and centimeters (Science Units). The math works the same.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[180px]">
            <Globe className="mr-2 h-4 w-4" /> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in">Imperial (Inches)</SelectItem>
            <SelectItem value="cm">Metric (cm)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="size1" className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-red-600" />
            Diameter of Pizza #1 ({inputs.unit})
          </Label>
          <Input
            id="size1"
            type="number"
            placeholder={`E.g. ${inputs.unit === "in" ? "12" : "30"}`}
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
            type="number"
            placeholder="E.g. 15.99"
            value={inputs.price1}
            onChange={(e) => handleInputChange("price1", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="size2" className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-red-600" />
            Diameter of Pizza #2 ({inputs.unit})
          </Label>
          <Input
            id="size2"
            type="number"
            placeholder={`E.g. ${inputs.unit === "in" ? "16" : "40"}`}
            value={inputs.size2}
            onChange={(e) => handleInputChange("size2", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="price2" className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Price of Pizza #2 ($)
          </Label>
          <Input
            id="price2"
            type="number"
            placeholder="E.g. 22.5"
            value={inputs.price2}
            onChange={(e) => handleInputChange("price2", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ size1: "", price1: "", size2: "", price2: "", unit: "in" })}
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
          Understanding Pizza Math
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Ever stared at a pizza menu, wondering if two mediums really trump one large? Welcome to the
          ultimate pizza showdown! This calculator uses the sacred art of Geometry to figure out which 
          pizza gives you the most bang for your buck.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The formula is simple: calculate the area of each pizza (π × radius²), then divide the price
          by that area to get the price per square unit. Whether you use inches or centimeters, the math doesn't lie.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          1. <strong>Select your Unit:</strong> Are you team Imperial (inches) or team Metric (cm)? Choose wisely at the top.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          2. Enter the diameter and price of your first pizza.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          3. Optionally, enter a second pizza to compare. The calculator will declare a winner based on price per area.
        </p>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Pro Tips</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          - <strong>Go Big:</strong> A standard 16-inch pizza has roughly the same area as <em>four</em> 8-inch pizzas. Geometry is wild.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          - <strong>Crust Factor:</strong> Smaller pizzas mean more crust per bite. If you love crust, buy small. If you love toppings, buy large.
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
              Because pizza is basically a delicious circle.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Pizza Size/Price Comparison Calculator"
      description="Calculate price per square inch/cm to see if two medium pizzas are a better deal than one large. Metric and Imperial supported."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Price per Area = Price ÷ (π × (Diameter ÷ 2)²)",
        variables: [
          { symbol: "Price", description: "Cost in $" },
          { symbol: "Diameter", description: "Size in inches or cm" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Comparing a 12-inch pizza ($15) vs a 16-inch pizza ($22).",
        steps: [
          { label: "1", explanation: "12 inch area ≈ 113 sq in. ($0.13/in²)" },
          { label: "2", explanation: "16 inch area ≈ 201 sq in. ($0.11/in²)" },
          { label: "Winner", explanation: "The 16-inch pizza is cheaper per bite." },
        ],
        result: "Go for the Large.",
      }}
      relatedCalculators={[
        { title: "Ideal Egg Boiling Calculator", url: "/funny/ideal-egg-boiling-calculator", icon: "🍩" },
        { title: "Vacation Budget Reality Check", url: "/funny/vacation-budget-reality-check", icon: "🐈" },
        { title: "Zombie Survival Calculator", url: "/funny/zombie-survival-calculator", icon: "🧟" },
        { title: "Death by Caffeine (Max Safe Intake)", url: "/funny/death-by-caffeine", icon: "☕" },
        { title: "First-Date Awkwardness Meter", url: "/funny/first-date-awkwardness-meter", icon: "❤️" },
        { title: "BBQ 'Who Brings the Charcoal?' Splitter", url: "/funny/bbq-charcoal-splitter", icon: "🔥" },
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
