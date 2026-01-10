import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function EspressoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Espresso%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2620"
  );

  // --- DATA ---
  const title = "Espresso";
  const description = "Strong concentrated coffee brewed under pressure.";

  // INGREDIENTS
  const ingredients = [
    { name: "Freshly ground espresso coffee beans", baseAmount: 18, unit: "g" },
    { name: "Filtered water", baseAmount: 36, unit: "ml" },
    { name: "Optional: Sugar", baseAmount: 0, unit: "g" },
    { name: "Optional: Milk (for macchiato or latte)", baseAmount: 0, unit: "ml" },
    { name: "Optional: Cocoa powder (for dusting)", baseAmount: 0, unit: "g" },
    { name: "Optional: Vanilla extract (few drops)", baseAmount: 0, unit: "ml" },
    { name: "Optional: Cinnamon (pinch)", baseAmount: 0, unit: "g" },
    { name: "Optional: Coffee crema (natural)", baseAmount: 0, unit: "ml" },
    { name: "Optional: Espresso shot garnish (chocolate shavings)", baseAmount: 0, unit: "g" },
    { name: "Optional: Ice cubes (for iced espresso)", baseAmount: 0, unit: "pcs" },
    { name: "Optional: Espresso machine cleaning solution", baseAmount: 0, unit: "ml" },
    { name: "Optional: Demineralized water (for machine)", baseAmount: 0, unit: "ml" },
  ];

  const nutrition = { calories: "5", protein: "0.3g", carbs: "1g", fat: "0g" };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes a perfect espresso shot?",
      answer:
        "A perfect espresso shot balances the right grind size, tamping pressure, water temperature (around 90-96°C), and extraction time (typically 25-30 seconds). The result is a rich, concentrated coffee with a thick crema on top.",
    },
    {
      question: "Can I use pre-ground coffee for espresso?",
      answer:
        "While pre-ground coffee can be used, freshly grinding beans just before brewing ensures maximum aroma and flavor. Espresso requires a very fine and consistent grind, which is best achieved with a burr grinder.",
    },
    {
      question: "How do I clean my espresso machine?",
      answer:
        "Regular cleaning involves backflushing with a cleaning solution, descaling to remove mineral buildup, and daily rinsing of portafilters and baskets. Proper maintenance ensures consistent taste and prolongs machine life.",
    },
    {
      question: "What is the difference between espresso and regular coffee?",
      answer:
        "Espresso is brewed by forcing hot water under high pressure through finely ground coffee, resulting in a concentrated shot with crema. Regular coffee is typically brewed by drip or pour-over methods, producing a lighter, less concentrated cup.",
    },
    {
      question: "How can I make espresso-based drinks like cappuccino or latte?",
      answer:
        "Start with a standard espresso shot, then add steamed milk for a latte or steamed milk with a thick milk foam layer for a cappuccino. The milk texture and temperature are key to creating the perfect balance.",
    },
    {
      question: "Is espresso healthier than regular coffee?",
      answer:
        "Espresso contains similar antioxidants and caffeine levels per volume compared to regular coffee but is consumed in smaller quantities. It is low in calories unless sugar or milk is added.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Espresso"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 5m | Brew: 0.5m
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
                    {ing.baseAmount === 0 ? "-" : getAmount(ing.baseAmount)} {ing.unit}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Espresso is a concentrated form of coffee served in shots and is the base for many coffee drinks. It is brewed by forcing a small amount of nearly boiling water under pressure through finely-ground coffee beans. This process extracts rich flavors and oils, resulting in a bold, aromatic, and intense coffee experience with a characteristic layer of crema on top.
          </p>
          <p>
            Originating in Italy in the early 20th century, espresso revolutionized coffee culture worldwide. Its invention is credited to Angelo Moriondo and later perfected by Luigi Bezzera and Desiderio Pavoni. Today, espresso is a symbol of Italian culinary artistry and is enjoyed globally both as a standalone beverage and as the foundation for drinks like cappuccinos, lattes, and macchiatos.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Grind the Coffee Beans</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Use a burr grinder to grind fresh coffee beans to a fine consistency, similar to table salt. For a single espresso shot, use about 18 grams of coffee.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Portafilter</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the ground coffee into the portafilter basket and tamp it evenly with firm pressure to create a smooth, compact puck.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Brew the Espresso</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Lock the portafilter into the espresso machine group head. Start the extraction, forcing hot water at 90-96°C through the coffee at 9 bars of pressure for about 25-30 seconds, yielding approximately 36 ml of espresso.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve Immediately</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the espresso into a pre-warmed demitasse cup and serve immediately to enjoy the full aroma and flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Optional: Customize Your Espresso</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add sugar, milk, or spices like cinnamon or cocoa powder according to your preference. For espresso-based drinks, steam milk separately and combine as desired.
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
            Use freshly roasted, high-quality Arabica beans for the best flavor and aroma.
          </li>
          <li>
            Consistency in grind size and tamping pressure is crucial for balanced extraction.
          </li>
          <li>
            Preheat your cup to maintain the espresso’s temperature longer.
          </li>
          <li>
            Clean your espresso machine regularly to avoid off-flavors and ensure longevity.
          </li>
          <li>
            Experiment with extraction time and coffee dose to find your preferred taste profile.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">FAQ</h2>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i} className="border-b pb-4 last:border-0">
              <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">{f.question}</h3>
              <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">{f.answer}</p>
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
              href="https://en.wikipedia.org/wiki/Espresso"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Espresso
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.ncausa.org/About-Coffee/How-to-Brew-Coffee/Espresso"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              National Coffee Association: How to Brew Espresso
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