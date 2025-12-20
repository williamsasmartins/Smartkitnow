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
  Sparkles,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PizzaSizePriceComparisonCalculator() {
  // Inputs:
  // - unit: metric or imperial
  // - pizza1Size (diameter)
  // - pizza1Price
  // - pizza2Size (diameter)
  // - pizza2Price
  // We compare price per square inch (or cm), lower is better.

  const [inputs, setInputs] = useState({
    unit: "metric",
    pizza1Size: "",
    pizza1Price: "",
    pizza2Size: "",
    pizza2Price: "",
  });

  const handleInputChange = useCallback(
    (n, v) => setInputs((p) => ({ ...p, [n]: v })),
    []
  );

  // Conversion helpers
  // Metric base unit: cm, Imperial base unit: inch
  // 1 inch = 2.54 cm
  const toCm = (val: number) => val * 2.54;
  const toInch = (val: number) => val / 2.54;

  // Calculate area of pizza given diameter in cm or inch
  // area = π * (r^2)
  // We convert all to inches internally for price per square inch calculation
  // because pizza deals are usually compared in inches.
  // But since user can select metric or imperial, we convert accordingly.

  const results = useMemo(() => {
    const {
      unit,
      pizza1Size: p1sRaw,
      pizza1Price: p1pRaw,
      pizza2Size: p2sRaw,
      pizza2Price: p2pRaw,
    } = inputs;

    // Parse inputs to floats
    const p1s = parseFloat(p1sRaw);
    const p1p = parseFloat(p1pRaw);
    const p2s = parseFloat(p2sRaw);
    const p2p = parseFloat(p2pRaw);

    // Validate inputs
    if (
      isNaN(p1s) ||
      isNaN(p1p) ||
      isNaN(p2s) ||
      isNaN(p2p) ||
      p1s <= 0 ||
      p1p <= 0 ||
      p2s <= 0 ||
      p2p <= 0
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "",
        icon: null,
      };
    }

    // Convert diameters to inches for area calculation
    const p1DiameterInch = unit === "metric" ? p1s / 2.54 : p1s;
    const p2DiameterInch = unit === "metric" ? p2s / 2.54 : p2s;

    // Calculate areas in square inches
    const p1Area = Math.PI * (p1DiameterInch / 2) ** 2;
    const p2Area = Math.PI * (p2DiameterInch / 2) ** 2;

    // Price per square inch
    const p1PricePerSqIn = p1p / p1Area;
    const p2PricePerSqIn = p2p / p2Area;

    // Determine which pizza is better deal (lower price per sq inch)
    // Also compare combined price of two pizzas vs one pizza for fun

    // We'll compare:
    // - Single pizza 1 price per sq inch
    // - Single pizza 2 price per sq inch
    // - Two pizza 2 combined price per sq inch (assuming buying 2 of pizza 2)

    // For comedy, let's assume pizza 2 is medium and pizza 1 is large.
    // So user can see if two mediums beat one large.

    const twoP2Area = p2Area * 2;
    const twoP2Price = p2p * 2;
    const twoP2PricePerSqIn = twoP2Price / twoP2Area;

    // Find best deal among these three options
    // We'll report the best deal and a snarky comment

    // Options:
    // 1: One large (pizza1)
    // 2: One medium (pizza2)
    // 3: Two mediums (pizza2 x 2)

    // We'll find the lowest price per sq inch among these three

    const deals = [
      {
        label: `One ${unit === "metric" ? "large" : "large"} pizza`,
        pricePerSqIn: p1PricePerSqIn,
        totalPrice: p1p,
        totalArea: p1Area,
      },
      {
        label: `One ${unit === "metric" ? "medium" : "medium"} pizza`,
        pricePerSqIn: p2PricePerSqIn,
        totalPrice: p2p,
        totalArea: p2Area,
      },
      {
        label: `Two ${unit === "metric" ? "medium" : "medium"} pizzas`,
        pricePerSqIn: twoP2PricePerSqIn,
        totalPrice: twoP2Price,
        totalArea: twoP2Area,
      },
    ];

    // Sort deals by pricePerSqIn ascending
    deals.sort((a, b) => a.pricePerSqIn - b.pricePerSqIn);

    const bestDeal = deals[0];

    // Determine if deal is good or bad based on price per sq inch thresholds
    // Typical pizza price per sq inch ranges roughly 0.05 to 0.20 $
    // We'll say:
    // < 0.08 = Good (green)
    // 0.08 - 0.15 = Meh (orange)
    // > 0.15 = Bad (red)

    let color = "";
    let icon = null;
    let subtext = "";

    if (bestDeal.pricePerSqIn < 0.08) {
      color = "text-green-600";
      icon = <Smile className="mx-auto h-12 w-12" />;
      subtext = "You just found a pizza deal that would make a starving raccoon weep tears of joy.";
    } else if (bestDeal.pricePerSqIn < 0.15) {
      color = "text-orange-600";
      icon = <Meh className="mx-auto h-12 w-12" />;
      subtext = "Not bad, but your wallet might still be crying in the corner.";
    } else {
      color = "text-red-600";
      icon = <Skull className="mx-auto h-12 w-12" />;
      subtext = "That price per square inch could summon a pizza-eating zombie apocalypse.";
    }

    // Format price per sq inch to 3 decimals
    const formattedPricePerSqIn = bestDeal.pricePerSqIn.toFixed(3);

    // Compose result value and label
    const value = `$${formattedPricePerSqIn} / sq in`;
    const label = `Best deal: ${bestDeal.label}`;

    return {
      value,
      label,
      subtext,
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why compare price per square inch? Isn't bigger always better?",
      answer:
        "Ah, the classic 'bigger is better' myth. Sometimes, two mediums can outsmart one large — like a pizza ninja squad.",
    },
    {
      question: "Can I use this calculator for other round foods?",
      answer:
        "Sure! Just pretend it's pizza and enjoy the delicious math. Donuts, pies, frisbees... your call.",
    },
    {
      question: "Why only $ and no other currency?",
      answer:
        "Because $ is the universal symbol of pizza dreams and broken diets worldwide.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector (if needed) */}
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
        >
          <SelectTrigger className="w-[140px]">
            <Globe className="mr-2 h-4 w-4" /> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric</SelectItem>
            <SelectItem value="imperial">Imperial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pizza1Size" className="mb-1 block font-semibold">
            Pizza 1 Diameter ({inputs.unit === "metric" ? "cm" : "inch"})
          </Label>
          <Input
            id="pizza1Size"
            type="number"
            min="0"
            step="any"
            placeholder={`E.g. ${inputs.unit === "metric" ? "30" : "12"}`}
            value={inputs.pizza1Size}
            onChange={(e) => handleInputChange("pizza1Size", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="pizza1Price" className="mb-1 block font-semibold">
            Pizza 1 Price ($)
          </Label>
          <Input
            id="pizza1Price"
            type="number"
            min="0"
            step="any"
            placeholder="E.g. 15.99"
            value={inputs.pizza1Price}
            onChange={(e) => handleInputChange("pizza1Price", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="pizza2Size" className="mb-1 block font-semibold">
            Pizza 2 Diameter ({inputs.unit === "metric" ? "cm" : "inch"})
          </Label>
          <Input
            id="pizza2Size"
            type="number"
            min="0"
            step="any"
            placeholder={`E.g. ${inputs.unit === "metric" ? "25" : "10"}`}
            value={inputs.pizza2Size}
            onChange={(e) => handleInputChange("pizza2Size", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="pizza2Price" className="mb-1 block font-semibold">
            Pizza 2 Price ($)
          </Label>
          <Input
            id="pizza2Price"
            type="number"
            min="0"
            step="any"
            placeholder="E.g. 9.99"
            value={inputs.pizza2Price}
            onChange={(e) => handleInputChange("pizza2Price", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        {/* Calculate button triggers no special action because results are dynamic */}
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No-op: calculation is dynamic on input change
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ unit: "metric", pizza1Size: "", pizza1Price: "", pizza2Size: "", pizza2Price: "" })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
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
          Understanding Pizza Size/Price Comparison Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Ever stared at two pizzas and wondered, "Is two mediums really better than one large?" This calculator solves that age-old
          mystery by comparing price per square inch. Because math is the only way to win arguments with your pizza-loving friends.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter the diameter and price of two different pizzas. Select your preferred unit system (Metric or Imperial). Hit Calculate and watch
          the magic happen. The calculator will tell you which pizza deal is the MVP and throw in a snarky comment for good measure.
        </p>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Pro Tips
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          <ul className="list-disc list-inside space-y-2">
            <li>Always double-check your inputs. No one likes a pizza calculator that lies.</li>
            <li>Remember, price per square inch doesn't account for toppings. So if you want extra cheese, your wallet might cry.</li>
            <li>Use the reset button to clear your pizza-induced regrets and start fresh.</li>
          </ul>
        </p>
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
              href="https://www.seriouseats.com/how-to-calculate-pizza-value-price-per-square-inch"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Serious Eats: How to Calculate Pizza Value <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A deep dive into pizza math and why size matters more than you think.
            </p>
          </li>
          <li>
            <a
              href="https://www.washingtonpost.com/news/wonk/wp/2015/07/15/how-to-get-the-best-deal-on-pizza/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Washington Post: How to Get the Best Deal on Pizza <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Spoiler alert: bigger isn't always better.
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
        formula:
          "Price per square inch = Price ÷ (π × (Diameter ÷ 2)²)",
        variables: [
          { label: "Price", description: "Cost of the pizza in $" },
          { label: "Diameter", description: "Diameter of the pizza in inches or cm" },
          { label: "π", description: "Pi, approximately 3.1416" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You have a large pizza 14 inches for $15 and a medium pizza 10 inches for $9. Is two mediums better than one large?",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate area of large: π × (14 ÷ 2)² ≈ 153.94 sq in",
          },
          {
            label: "2",
            explanation:
              "Calculate price per sq in for large: $15 ÷ 153.94 ≈ $0.097",
          },
          {
            label: "3",
            explanation:
              "Calculate area of medium: π × (10 ÷ 2)² ≈ 78.54 sq in",
          },
          {
            label: "4",
            explanation:
              "Calculate price per sq in for medium: $9 ÷ 78.54 ≈ $0.115",
          },
          {
            label: "5",
            explanation:
              "Calculate price per sq in for two mediums: $18 ÷ (78.54 × 2) ≈ $0.115",
          },
          {
            label: "6",
            explanation:
              "Compare: large ($0.097) vs two mediums ($0.115). Large wins!",
          },
        ],
        result:
          "The large pizza is the better deal by price per square inch. Time to feast like a king!",
      }}
      relatedCalculators={[
        {
          title: "First-Date Awkwardness Meter",
          url: "/funny/first-date-awkwardness-meter",
          icon: "❤️",
        },
        { title: "Donut Calculator", url: "/funny/donut-calculator", icon: "🍩" },
        {
          title: "Loop-the-Loop Speed Calculator",
          url: "/funny/loop-the-loop-speed-calculator",
          icon: "✈️",
        },
        { title: "Cat 'Ignore-o-Meter'", url: "/funny/cat-ignore-o-meter", icon: "🐈" },
        {
          title: "Love Meter (Name Compatibility)",
          url: "/funny/love-meter",
          icon: "❤️",
        },
        {
          title: "Vacation Budget Reality Check",
          url: "/funny/vacation-budget-reality-check",
          icon: "🐈",
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