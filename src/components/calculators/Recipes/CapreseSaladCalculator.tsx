import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CapreseSaladCalculator() {
  const [servings, setServings] = useState(4);

  // --- DATA ---
  const title = "Caprese Salad";
  const description = "Layers of fresh mozzarella, ripe tomatoes, and basil drizzled with olive oil and balsamic.";

  // INGREDIENTS: Metric (g/ml) is standard.
  const ingredients = [
    { name: "Fresh Mozzarella Cheese", baseAmount: 250, unit: "g" },
    { name: "Ripe Tomatoes", baseAmount: 300, unit: "g" },
    { name: "Fresh Basil Leaves", baseAmount: 20, unit: "g" },
    { name: "Extra Virgin Olive Oil", baseAmount: 30, unit: "ml" },
    { name: "Balsamic Vinegar", baseAmount: 15, unit: "ml" },
    { name: "Sea Salt", baseAmount: 2, unit: "g" },
    { name: "Freshly Ground Black Pepper", baseAmount: 1, unit: "g" },
    { name: "Arugula (optional)", baseAmount: 50, unit: "g" },
    { name: "Garlic (optional)", baseAmount: 1, unit: "clove" },
    { name: "Pine Nuts (optional)", baseAmount: 15, unit: "g" },
    { name: "Capers (optional)", baseAmount: 10, unit: "g" },
  ];

  // Estimated nutrition per serving (4 servings)
  const nutrition = {
    calories: "220",
    protein: "12g",
    carbs: "5g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) => (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (SEO RICH) ---
  const faqs = [
    {
      question: "Can I freeze this dish?",
      answer:
        "Freezing Caprese Salad is not recommended as the fresh tomatoes and mozzarella lose their texture and become watery upon thawing. To enjoy the best flavor and texture, serve it fresh or store in the refrigerator for up to 24 hours.",
    },
    {
      question: "What is the best wine pairing?",
      answer:
        "A light, crisp white wine like Pinot Grigio or a dry Rosé pairs beautifully with Caprese Salad, complementing the fresh basil and creamy mozzarella. For red wine lovers, a Chianti with moderate tannins enhances the tomato's acidity without overpowering the dish.",
    },
    {
      question: "Is this recipe authentic?",
      answer:
        "Yes, Caprese Salad originates from the Campania region of Italy, particularly the island of Capri, dating back to the 1920s. The authentic recipe emphasizes fresh, high-quality ingredients arranged simply to reflect the colors of the Italian flag.",
    },
    {
      question: "Can I substitute fresh mozzarella?",
      answer:
        "While fresh mozzarella is traditional, burrata or bocconcini can be used as substitutes for a creamier texture. Avoid using low-moisture mozzarella as it lacks the delicate flavor and softness essential to this salad.",
    },
    {
      question: "How do I store leftovers?",
      answer:
        "Store leftovers in an airtight container in the refrigerator and consume within 24 hours to maintain freshness. To prevent sogginess, keep the dressing separate and add just before serving.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group">
        <img
          src="https://pollinations.ai/p/Caprese%20Salad%20on%20a%20rustic%20table%2C%20food%20photography%2C%20michelin%20star%20plating%2C%208k%2C%20cinematic%20lighting%2C%20steam%20rising%2C%20highly%20detailed?width=1280&height=720&model=flux&nologo=true&seed=4092"
          alt="Caprese Salad"
          width="1280"
          height="720"
          loading="lazy"
          className="w-full h-auto object-cover aspect-video transform transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
          <span className="text-white font-bold text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 0m
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
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setServings((s) => Math.max(1, s - 1))}>
                -
              </Button>
              <span className="w-6 text-center font-bold text-lg">{servings}</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setServings((s) => s + 1)}>
                +
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableBody>
              {ingredients.map((ing, i) => (
                <TableRow key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                  <TableCell className="font-medium text-slate-700 dark:text-slate-200">{ing.name}</TableCell>
                  <TableCell className="text-right font-bold text-slate-900 dark:text-slate-100">
                    {getAmount(ing.baseAmount)} <span className="text-xs font-normal text-slate-500 ml-1">{ing.unit}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-slate-50 dark:bg-slate-900/50 border-dashed">
        <CardContent className="p-4 grid grid-cols-4 gap-2 text-center text-sm">
          <div className="p-2 bg-white dark:bg-slate-950 rounded shadow-sm">
            <div className="font-bold text-slate-900 dark:text-white">{nutrition.calories}</div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Kcal</span>
          </div>
          <div className="p-2 bg-white dark:bg-slate-950 rounded shadow-sm">
            <div className="font-bold text-slate-900 dark:text-white">{nutrition.protein}</div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Prot</span>
          </div>
          <div className="p-2 bg-white dark:bg-slate-950 rounded shadow-sm">
            <div className="font-bold text-slate-900 dark:text-white">{nutrition.carbs}</div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Carb</span>
          </div>
          <div className="p-2 bg-white dark:bg-slate-950 rounded shadow-sm">
            <div className="font-bold text-slate-900 dark:text-white">{nutrition.fat}</div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Fat</span>
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
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed">
          <p className="lead">
            Caprese Salad is a celebration of simplicity and freshness, where the vibrant colors and flavors of Italy come alive on your plate. Imagine the creamy softness of fresh mozzarella paired with juicy, sun-ripened tomatoes, fragrant basil leaves, and a drizzle of golden olive oil, creating a dish that is as visually stunning as it is delicious.
          </p>
          <p>
            Originating from the island of Capri in the Campania region of Italy during the 1920s, this salad was designed to represent the Italian flag with its red tomatoes, white mozzarella, and green basil. It has since become a beloved classic worldwide, embodying the essence of Italian culinary tradition and the Mediterranean lifestyle.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 border-b pb-4 border-slate-200 dark:border-slate-800">
          <ChefHat className="h-8 w-8 text-orange-500" /> Instructions
        </h2>
        <ol className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-10">
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              1
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Ingredients</h3>
            <p className="text-slate-600 dark:text-slate-300">
              **Slice** the fresh mozzarella and ripe tomatoes into even, approximately 0.5 cm thick slices. **Rinse** the basil leaves gently and pat dry to preserve their vibrant color and aroma.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Arrange the Salad</h3>
            <p className="text-slate-600 dark:text-slate-300">
              On a large serving plate, **alternate** slices of tomato and mozzarella, slightly overlapping them in a circular or linear pattern. **Tuck** fresh basil leaves between the slices for bursts of herbal freshness.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Season the Salad</h3>
            <p className="text-slate-600 dark:text-slate-300">
              **Sprinkle** sea salt and freshly ground black pepper evenly over the salad to enhance the natural flavors. Optionally, add a few capers or pine nuts for texture and tang.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Drizzle with Dressing</h3>
            <p className="text-slate-600 dark:text-slate-300">
              **Drizzle** extra virgin olive oil generously over the salad, followed by a light splash of balsamic vinegar. This adds richness and a subtle sweet acidity that balances the dish.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve Immediately</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Caprese Salad is best enjoyed fresh. **Serve** immediately at room temperature to savor the full flavors and textures of this iconic Italian dish.
            </p>
          </li>
        </ol>
      </section>

      <section className="bg-amber-50 dark:bg-amber-950/20 p-8 rounded-2xl border border-amber-100 dark:border-amber-900/50 shadow-sm">
        <h3 className="font-bold text-xl mb-6 text-amber-900 dark:text-amber-100 flex items-center gap-2">
          <Flame className="h-6 w-6 text-amber-500" /> Chef's Secrets
        </h3>
        <ul className="space-y-4">
          <li className="flex gap-3 text-amber-800 dark:text-amber-200">
            <span className="text-amber-500 font-bold text-lg">✓</span>
            <span>
              Use the freshest mozzarella you can find, ideally from a local Italian deli or fresh mozzarella packed in water, to ensure creamy texture and authentic flavor.
            </span>
          </li>
          <li className="flex gap-3 text-amber-800 dark:text-amber-200">
            <span className="text-amber-500 font-bold text-lg">✓</span>
            <span>
              For an extra layer of flavor, lightly toast pine nuts and sprinkle them on top just before serving to add a delightful crunch.
            </span>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid gap-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{f.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REFERENCES SECTION */}
      <section className="border-t pt-8 mt-12 border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
          <BookOpen className="h-5 w-5 text-blue-500" /> References & Further Reading
        </h3>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li className="flex items-center gap-2">
            <ExternalLink className="h-3 w-3" />
            <a
              href="https://en.wikipedia.org/wiki/Italian_cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-blue-500"
            >
              History of Italian Cuisine - Wikipedia
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-3 w-3" />
            <a
              href="https://www.colosseum-rome-tickets.com/history-of-italian-food/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-blue-500"
            >
              Culinary History of Rome
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-3 w-3" />
            <a
              href="https://www.bonappetit.com/recipe/caprese-salad"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-blue-500"
            >
              Caprese Salad Recipe - Bon Appétit
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
      hideLegalDisclaimer={true} // Oculta o aviso financeiro
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}