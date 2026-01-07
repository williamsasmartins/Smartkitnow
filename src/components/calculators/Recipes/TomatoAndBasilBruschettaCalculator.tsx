import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TomatoAndBasilBruschettaCalculator() {
  const [servings, setServings] = useState(4);

  // --- DATA ---
  const title = "Tomato and Basil Bruschetta";
  const description = "Toasted bread topped with fresh tomatoes, basil, garlic, and olive oil.";

  // INGREDIENTS: Metric (g/ml) is standard.
  const ingredients = [
    { name: "Ripe Tomatoes (chopped)", baseAmount: 500, unit: "g" },
    { name: "Fresh Basil Leaves", baseAmount: 15, unit: "g" },
    { name: "Garlic Cloves (minced)", baseAmount: 3, unit: "cloves" },
    { name: "Extra Virgin Olive Oil", baseAmount: 60, unit: "ml" },
    { name: "Balsamic Vinegar", baseAmount: 15, unit: "ml" },
    { name: "Salt", baseAmount: 5, unit: "g" },
    { name: "Black Pepper (freshly ground)", baseAmount: 2, unit: "g" },
    { name: "Ciabatta or Baguette Bread", baseAmount: 250, unit: "g" },
    { name: "Parmesan Cheese (optional, shaved)", baseAmount: 30, unit: "g" },
    { name: "Fresh Oregano (optional)", baseAmount: 5, unit: "g" },
  ];

  // Estimated nutrition per serving (4 servings)
  const nutrition = {
    calories: "220",
    protein: "5g",
    carbs: "28g",
    fat: "10g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (SEO RICH) ---
  const faqs = [
    {
      question: "Can I freeze this dish?",
      answer:
        "Freezing bruschetta is not recommended as the fresh tomatoes and bread lose their texture and become soggy upon thawing. For best results, prepare fresh and consume within a day or two.",
    },
    {
      question: "What is the best wine pairing?",
      answer:
        "A light, crisp white wine like Pinot Grigio or a medium-bodied red such as Chianti pairs beautifully with tomato and basil bruschetta. These wines complement the fresh acidity of the tomatoes and the herbal notes of basil.",
    },
    {
      question: "Is this recipe authentic?",
      answer:
        "Yes, this recipe reflects the traditional Italian bruschetta from the Tuscany region, where toasted bread is topped with fresh tomatoes, basil, garlic, and olive oil. It celebrates simple, fresh ingredients typical of Italian cuisine.",
    },
    {
      question: "Can I use other types of bread?",
      answer:
        "While ciabatta or baguette is preferred for its texture and crust, you can use other rustic breads like sourdough or country loaf. The key is to have a sturdy bread that crisps well when toasted.",
    },
    {
      question: "How do I keep the bread from getting soggy?",
      answer:
        "To prevent sogginess, toast the bread slices until crisp and drizzle olive oil just before serving. Also, serve the tomato mixture on top right before eating to maintain the crunch.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group">
        <img
          src="https://pollinations.ai/p/Tomato%20and%20Basil%20Bruschetta%20on%20a%20rustic%20table%2C%20food%20photography%2C%20michelin%20star%20plating%2C%208k%2C%20cinematic%20lighting%2C%20steam%20rising%2C%20highly%20detailed?width=1280&height=720&model=flux&nologo=true&seed=1235"
          alt="Tomato and Basil Bruschetta"
          width="1280"
          height="720"
          loading="lazy"
          className="w-full h-auto object-cover aspect-video transform transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
          <span className="text-white font-bold text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 15m
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
              >
                -
              </Button>
              <span className="w-6 text-center font-bold text-lg">{servings}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setServings((s) => s + 1)}
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
                <TableRow
                  key={i}
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors"
                >
                  <TableCell className="font-medium text-slate-700 dark:text-slate-200">
                    {ing.name}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900 dark:text-slate-100">
                    {getAmount(ing.baseAmount)}{" "}
                    <span className="text-xs font-normal text-slate-500 ml-1">
                      {ing.unit}
                    </span>
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
            Tomato and Basil Bruschetta is a vibrant celebration of fresh, sun-ripened tomatoes combined with fragrant basil and garlic, all atop perfectly toasted bread. This dish delights the senses with its bright colors, fresh aromas, and the satisfying crunch of rustic bread, evoking the essence of a warm Italian summer.
          </p>
          <p>
            Originating from the Tuscany region of Italy in the mid-15th century, bruschetta was traditionally a way for farmers to salvage stale bread by toasting it and topping it with local ingredients. Over centuries, it has evolved into a beloved antipasto, symbolizing Italian simplicity and the joy of fresh, quality produce.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Tomato Mixture</h3>
            <p className="text-slate-600 dark:text-slate-300">
              <strong>Chop</strong> the ripe tomatoes into small pieces and place them in a bowl. <strong>Minced</strong> garlic and torn fresh basil leaves are added next. <strong>Drizzle</strong> with extra virgin olive oil and balsamic vinegar, then season with salt and freshly ground black pepper. Mix gently and let it marinate for 10 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Toast the Bread</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Slice the ciabatta or baguette into 1 cm thick slices. <strong>Toast</strong> the bread slices on a grill pan or in the oven until golden and crisp on both sides. Optionally, rub the toasted bread with a cut garlic clove for extra flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Assemble the Bruschetta</h3>
            <p className="text-slate-600 dark:text-slate-300">
              <strong>Spoon</strong> the tomato and basil mixture generously over each toasted bread slice. <strong>Drizzle</strong> a little more olive oil on top for richness.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Optional Garnishes</h3>
            <p className="text-slate-600 dark:text-slate-300">
              For an extra touch, <strong>sprinkle</strong> shaved Parmesan cheese or fresh oregano leaves on top. This adds depth and a subtle savory note to the dish.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve Immediately</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Bruschetta is best enjoyed fresh. <strong>Serve</strong> immediately to preserve the crispness of the bread and the vibrant flavors of the tomato topping.
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
              Use the ripest, in-season tomatoes for the freshest flavor and natural sweetness that defines authentic bruschetta.
            </span>
          </li>
          <li className="flex gap-3 text-amber-800 dark:text-amber-200">
            <span className="text-amber-500 font-bold text-lg">✓</span>
            <span>
              Toast the bread until just golden and still warm to create a perfect contrast with the cool, juicy tomato topping.
            </span>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid gap-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800"
            >
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
              href="https://www.bonappetit.com/recipe/classic-bruschetta"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-blue-500"
            >
              Classic Bruschetta Recipe - Bon Appétit
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