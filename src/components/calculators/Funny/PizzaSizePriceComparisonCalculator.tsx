import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Smile, Frown, Meh, Ghost, Skull, Coffee, Utensils, Gamepad2, Cat, Dog, Zap, Heart, Calculator, Info, RotateCcw, AlertTriangle, BookOpen, ExternalLink, Flame, Clock, Ticket, Plane, Globe, Sparkles, Lightbulb } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function areaOfCircle(diameter: number) {
  const radius = diameter / 2;
  return Math.PI * radius * radius;
}

export default function PizzaSizePriceComparisonCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    pizza1Diameter: "",
    pizza1Price: "",
    pizza2Diameter: "",
    pizza2Price: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Convert inputs to numbers safely
  const pizza1DiameterNum = parseFloat(inputs.pizza1Diameter);
  const pizza1PriceNum = parseFloat(inputs.pizza1Price);
  const pizza2DiameterNum = parseFloat(inputs.pizza2Diameter);
  const pizza2PriceNum = parseFloat(inputs.pizza2Price);

  // Conversion factor for inches to cm and vice versa
  // 1 inch = 2.54 cm
  const inchToCm = 2.54;

  // Normalize diameters to inches internally for consistent area calculation
  const pizza1DiameterInches = inputs.unit === "metric" && !isNaN(pizza1DiameterNum) ? pizza1DiameterNum / inchToCm : pizza1DiameterNum;
  const pizza2DiameterInches = inputs.unit === "metric" && !isNaN(pizza2DiameterNum) ? pizza2DiameterNum / inchToCm : pizza2DiameterNum;

  const results = useMemo(() => {
    // Validate inputs
    if (
      isNaN(pizza1DiameterInches) || pizza1DiameterInches <= 0 ||
      isNaN(pizza1PriceNum) || pizza1PriceNum <= 0 ||
      isNaN(pizza2DiameterInches) || pizza2DiameterInches <= 0 ||
      isNaN(pizza2PriceNum) || pizza2PriceNum <= 0
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "text-slate-500",
        icon: <Info />,
      };
    }

    // Calculate areas in square inches
    const area1 = areaOfCircle(pizza1DiameterInches);
    const area2 = areaOfCircle(pizza2DiameterInches);

    // Price per square inch
    const ppsi1 = pizza1PriceNum / area1;
    const ppsi2 = pizza2PriceNum / area2;

    // Determine which pizza is better value
    let betterPizza = "";
    let betterPrice = 0;
    let color = "text-green-600";
    let icon = <Smile />;
    let subtext = "";

    if (ppsi1 < ppsi2) {
      betterPizza = "Pizza 1";
      betterPrice = ppsi1;
      subtext = `Pizza 1 offers more pizza for your dollar!`;
    } else if (ppsi2 < ppsi1) {
      betterPizza = "Pizza 2";
      betterPrice = ppsi2;
      subtext = `Pizza 2 is the tastier bargain!`;
    } else {
      betterPizza = "Both pizzas";
      betterPrice = ppsi1;
      subtext = `Both pizzas offer the same value per square inch.`;
      color = "text-yellow-600";
      icon = <Meh />;
    }

    // Format price per square inch to 3 decimals
    const formattedPrice = betterPrice.toFixed(3);

    return {
      value: `$${formattedPrice}`,
      label: `Best Value: ${betterPizza}`,
      subtext,
      color,
      icon,
    };
  }, [pizza1DiameterInches, pizza1PriceNum, pizza2DiameterInches, pizza2PriceNum]);

  const faqs = [
    {
      question: "Why does pizza size affect the price per square inch so much?",
      answer:
        "Pizza pricing isn’t just about the diameter; it’s about the area, which grows with the square of the radius. This means a 16-inch pizza isn’t just twice as big as an 8-inch, it’s actually four times the area! Understanding this geometric truth helps you spot the best deals and avoid paying more for less pizza. It’s a delicious lesson in math that can save your wallet and your appetite.",
    },
    {
      question: "How did the Margherita pizza get its name and why is it so iconic?",
      answer:
        "Legend has it that in 1889, Queen Margherita of Savoy visited Naples and was served a pizza resembling the Italian flag with red tomatoes, white mozzarella, and green basil. This patriotic pie was named after her and became a symbol of Italian pride and culinary simplicity. The Margherita remains a timeless classic, reminding us that sometimes the simplest combinations are the most satisfying.",
    },
    {
      question: "Can I trust price per square inch as the only factor to choose a pizza?",
      answer:
        "While price per square inch is a handy metric for value, it doesn’t capture everything. Quality of ingredients, crust style, toppings, and even the ambiance of the pizzeria all play a role in your pizza experience. Think of this calculator as your savvy shopping sidekick, not the final judge. After all, pizza is as much about joy and flavor as it is about math.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Globe className="mr-2 h-4 w-4" /> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (cm)</SelectItem>
            <SelectItem value="imperial">Imperial (inches)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pizza 1 Inputs */}
      <div>
        <Label htmlFor="pizza1Diameter" className="font-semibold">
          Pizza 1 Diameter ({inputs.unit === "metric" ? "cm" : "inches"})
        </Label>
        <Input
          id="pizza1Diameter"
          type="number"
          min="0"
          step="any"
          placeholder={inputs.unit === "metric" ? "e.g. 30" : "e.g. 12"}
          value={inputs.pizza1Diameter}
          onChange={(e) => handleInputChange("pizza1Diameter", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="pizza1Price" className="font-semibold">
          Pizza 1 Price ($)
        </Label>
        <Input
          id="pizza1Price"
          type="number"
          min="0"
          step="any"
          placeholder="e.g. 15.99"
          value={inputs.pizza1Price}
          onChange={(e) => handleInputChange("pizza1Price", e.target.value)}
        />
      </div>

      {/* Pizza 2 Inputs */}
      <div>
        <Label htmlFor="pizza2Diameter" className="font-semibold">
          Pizza 2 Diameter ({inputs.unit === "metric" ? "cm" : "inches"})
        </Label>
        <Input
          id="pizza2Diameter"
          type="number"
          min="0"
          step="any"
          placeholder={inputs.unit === "metric" ? "e.g. 25" : "e.g. 10"}
          value={inputs.pizza2Diameter}
          onChange={(e) => handleInputChange("pizza2Diameter", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="pizza2Price" className="font-semibold">
          Pizza 2 Price ($)
        </Label>
        <Input
          id="pizza2Price"
          type="number"
          min="0"
          step="any"
          placeholder="e.g. 12.49"
          value={inputs.pizza2Price}
          onChange={(e) => handleInputChange("pizza2Price", e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              unit: "metric",
              pizza1Diameter: "",
              pizza1Price: "",
              pizza2Diameter: "",
              pizza2Price: "",
            })
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
          Understanding Pizza Size/Price Comparison Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you compare two pizzas by calculating the price per square inch, a clever way to find out which pizza gives you more bang for your buck. Since pizza size is a circle, the area grows with the square of the radius, not just the diameter, meaning bigger pizzas often offer better value. By entering the diameter and price of each pizza, you get a clear, easy-to-understand comparison that cuts through marketing tricks and helps you make an informed choice. It’s like having a pizza-savvy friend who’s also a math whiz!
        </p>

        {/* TRIVIA BOX - AI MUST FILL THIS */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Norway tops the global pizza charts, consuming the most pizza per capita—talk about a nation united by cheese and crust! Meanwhile, the Margherita pizza, born in Naples in 1889, was created to honor Queen Margherita with toppings representing the Italian flag. This calculator taps into centuries of pizza passion and geometry to help you slice through the confusion and find the tastiest deal.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply select your preferred unit system—metric for centimeters or imperial for inches—then enter the diameter and price for each pizza. The calculator instantly computes the price per square inch for both pizzas, revealing which one offers the better deal. If you’re unsure about the units, remember that 1 inch equals 2.54 centimeters, so you can switch and adjust accordingly. Hit “Calculate” to see the magic happen, or “Reset” to start fresh with new numbers.
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
            <a href="https://www.nationalgeographic.com/culture/article/pizza-history" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              National Geographic: The History of Pizza <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A fascinating dive into the origins and cultural journey of pizza from Naples to global fame.
            </p>
          </li>
          <li>
            <a href="https://www.statista.com/statistics/1129931/pizza-consumption-per-capita-by-country/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Statista: Pizza Consumption Per Capita by Country <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Explore which countries love pizza the most, with Norway leading the pack in per capita consumption.
            </p>
          </li>
          <li>
            <a href="https://www.mathsisfun.com/geometry/circle-area.html" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Math Is Fun: Area of a Circle <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Learn the geometric principles behind calculating the area of a circle, the key to understanding pizza size.
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
        formula: "Area = π × (Diameter ÷ 2)²; Price per square inch = Price ÷ Area",
        variables: [
          { symbol: "π", description: "Pi, approximately 3.1416" },
          { symbol: "Diameter", description: "The width of the pizza across its center" },
          { symbol: "Area", description: "The total surface area of the pizza" },
          { symbol: "Price", description: "Cost of the pizza in dollars" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Compare a 12-inch pizza priced at $15 and a 16-inch pizza priced at $20.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the area of each pizza: Area = π × (Diameter ÷ 2)². For 12-inch: π × 6² ≈ 113.1 sq in. For 16-inch: π × 8² ≈ 201.1 sq in.",
          },
          {
            label: "2",
            explanation:
              "Calculate price per square inch: $15 ÷ 113.1 ≈ $0.133 and $20 ÷ 201.1 ≈ $0.099.",
          },
          {
            label: "3",
            explanation:
              "The 16-inch pizza offers better value at about 9.9 cents per square inch versus 13.3 cents for the 12-inch.",
          },
        ],
        result: "Choose the 16-inch pizza for more pizza per dollar spent!",
      }}
      relatedCalculators={[
        { title: "BBQ 'Who Brings the Charcoal?' Splitter", url: "/funny/bbq-charcoal-splitter", icon: "🍩" },
        { title: "Dog Zoomies Energy Release Meter", url: "/funny/dog-zoomies-energy-meter", icon: "🐈" },
        { title: "Nickels to Crush Calculator", url: "/funny/nickels-to-crush-calculator", icon: "🤪" },
        { title: "Netflix 'Just One More Episode' Timer", url: "/funny/netflix-one-more-episode-timer", icon: "🤪" },
        { title: "Crinkle Crankle Wall Brick Saver", url: "/funny/crinkle-crankle-wall-brick-saver", icon: "🤪" },
        { title: "Vacation Budget Reality Check", url: "/funny/vacation-budget-reality-check", icon: "🐈" },
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