import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CappuccinoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Cappuccino%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6487"
  );

  // --- DATA ---
  const title = "Cappuccino";
  const description = "Espresso with steamed milk and thick foam, dusted with cocoa.";

  // INGREDIENTS
  const ingredients = [
    { name: "Espresso Coffee (freshly brewed)", baseAmount: 60, unit: "ml" },
    { name: "Whole Milk", baseAmount: 120, unit: "ml" },
    { name: "Milk Foam", baseAmount: 60, unit: "ml" },
    { name: "Cocoa Powder (for dusting)", baseAmount: 1, unit: "g" },
    { name: "Sugar (optional)", baseAmount: 5, unit: "g" },
    { name: "Water (for espresso machine)", baseAmount: 30, unit: "ml" },
    { name: "Coffee Beans (for espresso)", baseAmount: 18, unit: "g" },
    { name: "Vanilla Extract (optional)", baseAmount: 2, unit: "ml" },
    { name: "Cinnamon Powder (optional garnish)", baseAmount: 1, unit: "g" },
    { name: "Chocolate Shavings (optional garnish)", baseAmount: 3, unit: "g" },
    { name: "Cup (standard cappuccino size)", baseAmount: 1, unit: "piece" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "120",
    protein: "6g",
    carbs: "8g",
    fat: "7g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the ideal milk temperature for a cappuccino?",
      answer:
        "The ideal milk temperature for steaming is between 55°C to 65°C (130°F to 150°F). This range ensures the milk is hot enough to develop sweetness and texture without scalding, which can cause a burnt taste.",
    },
    {
      question: "How do I create the perfect milk foam for cappuccino?",
      answer:
        "Use cold whole milk and steam it with a steam wand just below the surface to introduce microbubbles. The goal is a velvety, dense foam about 1 to 1.5 cm thick. Avoid large bubbles by keeping the wand angle steady and not over-aerating.",
    },
    {
      question: "Can I use non-dairy milk for cappuccino?",
      answer:
        "Yes, many non-dairy milks like oat, almond, or soy can be steamed and frothed, but results vary. Oat milk tends to froth best and has a creamy texture closest to whole milk. Experiment to find your preferred option.",
    },
    {
      question: "What is the difference between a cappuccino and a latte?",
      answer:
        "A cappuccino typically has equal parts espresso, steamed milk, and milk foam (1:1:1), resulting in a stronger coffee flavor and thicker foam. A latte has more steamed milk and less foam, making it creamier and milder.",
    },
    {
      question: "How should I store coffee beans for the best espresso?",
      answer:
        "Store coffee beans in an airtight container away from light, heat, and moisture. Use them within 2-3 weeks of roasting for optimal freshness. Grinding just before brewing preserves flavor and aroma.",
    },
    {
      question: "Is it necessary to dust cappuccino with cocoa powder?",
      answer:
        "Dusting with cocoa powder is traditional and adds a subtle chocolate aroma and flavor, enhancing the overall experience. However, it is optional and can be replaced with cinnamon or left plain based on preference.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Cappuccino"
          width="1280"
          height="720"
          className="w-full h-auto object-cover aspect-video transition-transform duration-700 group-hover:scale-105"
          onError={() =>
            setImgSrc(
              "https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=1280&auto=format&fit=crop"
            )
          }
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <span className="text-white font-bold text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 10m | Cook: 5m
          </span>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 bg-slate-50 dark:bg-slate-900/50">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-lg">
              <Utensils className="h-5 w-5 text-orange-500" /> Ingredients
            </span>
            <div className="flex items-center gap-2 text-sm bg-white dark:bg-slate-800 border p-1 rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setServings((s) => Math.max(1, s - 1))}
                aria-label="Decrease servings"
              >
                -
              </Button>
              <span className="w-6 text-center font-bold text-lg">{servings}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setServings((s) => s + 1)}
                aria-label="Increase servings"
              >
                +
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableBody>
              {ingredients.map((ing, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium text-base">{ing.name}</TableCell>
                  <TableCell className="text-right font-bold text-base text-slate-700 dark:text-slate-200">
                    {getAmount(ing.baseAmount)} {ing.unit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-slate-50 dark:bg-slate-900/50">
        <CardContent className="p-4 grid grid-cols-4 gap-2 text-center text-base">
          <div>
            <div className="font-bold text-lg">{nutrition.calories}</div>
            <span className="font-bold uppercase text-slate-500">Kcal</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.protein}</div>
            <span className="font-bold uppercase text-slate-500">Prot</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.carbs}</div>
            <span className="font-bold uppercase text-slate-500">Carb</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.fat}</div>
            <span className="font-bold uppercase text-slate-500">Fat</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // --- EDITORIAL CONTENT ---
  const editorial = (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          About this Recipe
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            The cappuccino is a classic Italian coffee beverage that artfully
            combines a shot of rich espresso with steamed milk and a thick layer
            of velvety milk foam. Traditionally served in a 150-180 ml cup, it
            offers a perfect balance of bold coffee flavor and creamy texture,
            often finished with a dusting of cocoa powder for an aromatic touch.
          </p>
          <p>
            Originating in Italy in the early 20th century, the cappuccino's name
            is derived from the Capuchin friars, whose brown robes resembled the
            coffee's color. Over decades, it has become a global symbol of
            sophisticated coffee culture, enjoyed in cafés worldwide and
            celebrated for its harmonious blend of flavors and textures.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ChefHat className="h-8 w-8 text-orange-500" /> Instructions
        </h2>
        <ol className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-10">
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              1
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Espresso
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Grind fresh coffee beans to a fine consistency (about 18 grams for
              a double shot). Tamp evenly and brew a 60 ml shot of espresso using
              an espresso machine. Pour the espresso into your cappuccino cup.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Steam the Milk
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour cold whole milk into a steaming pitcher. Insert the steam wand
              just below the surface and turn on steam to introduce air, creating
              microfoam. Heat milk to 60°C (140°F), then submerge wand deeper to
              heat evenly without adding more air.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Pour and Layer
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Swirl the milk pitcher to integrate foam and milk. Pour steamed
              milk gently over the espresso, holding back foam with a spoon. Then
              spoon the thick milk foam on top to create a distinct layer.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Garnish and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Lightly dust the foam with cocoa powder or cinnamon for aroma and
              visual appeal. Serve immediately with a small spoon and optional
              sugar on the side.
            </p>
          </li>
        </ol>
      </section>

      <section className="bg-amber-50 dark:bg-amber-950/20 p-8 rounded-2xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-xl mb-4 text-amber-900 dark:text-amber-100 flex items-center gap-2">
          <Flame className="h-6 w-6 text-amber-500" /> Chef's Tips
        </h3>
        <ul className="list-disc pl-5 space-y-3 text-amber-900 dark:text-amber-100 text-base">
          <li>
            Use fresh, high-quality coffee beans and grind just before brewing
            for the best espresso flavor.
          </li>
          <li>
            Whole milk produces the creamiest foam, but experiment with oat milk
            for a great dairy-free alternative.
          </li>
          <li>
            Practice steaming milk to achieve microfoam with a smooth,
velvety texture—avoid large bubbles.
          </li>
          <li>
            Preheat your cup by rinsing with hot water to keep your cappuccino
            warm longer.
          </li>
          <li>
            Experiment with dusting toppings like cinnamon or chocolate shavings
            to personalize your cappuccino.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">FAQ</h2>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i} className="border-b pb-4 last:border-0">
              <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
                {f.question}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                {f.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="h-6 w-6" /> References
        </h3>
        <ul className="space-y-3 text-base text-slate-700 dark:text-slate-300">
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://en.wikipedia.org/wiki/Italian_cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: History of this Dish
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/Italian-cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Culinary Reference
            </a>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      hideLegalDisclaimer={true}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}