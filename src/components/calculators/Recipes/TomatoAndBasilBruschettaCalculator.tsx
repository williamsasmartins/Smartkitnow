import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TomatoAndBasilBruschettaCalculator() {
  const [servings, setServings] = useState(4);

  // --- DATA ---
  const title = "Tomato and Basil Bruschetta";
  const description =
    "Toasted bread topped with fresh tomatoes, basil, garlic, and olive oil.";

  // INGREDIENTS: Use 'baseAmount' (number) for scaling
  const ingredients = [
    { name: "Ripe Tomatoes (chopped)", baseAmount: 500, unit: "g" },
    { name: "Fresh Basil Leaves (chopped)", baseAmount: 20, unit: "g" },
    { name: "Garlic Cloves (minced)", baseAmount: 2, unit: "cloves" },
    { name: "Extra Virgin Olive Oil", baseAmount: 60, unit: "ml" },
    { name: "Balsamic Vinegar", baseAmount: 15, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper (freshly ground)", baseAmount: 0.5, unit: "tsp" },
    { name: "French Baguette (sliced)", baseAmount: 1, unit: "loaf" },
    { name: "Parmesan Cheese (optional, grated)", baseAmount: 30, unit: "g" },
  ];

  const nutrition = {
    calories: "220",
    protein: "5g",
    carbs: "28g",
    fat: "9g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ ---
  const faqs = [
    {
      question: "Can I use other types of bread for bruschetta?",
      answer:
        "Yes, while a French baguette is traditional, ciabatta or sourdough also work well.",
    },
    {
      question: "How do I keep the bread from getting soggy?",
      answer:
        "Toast the bread slices until crisp and drizzle olive oil just before serving to maintain crunch.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT (Left Column) ---
  const widget = (
    <div className="space-y-6">
      {/* IMAGE */}
      <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 relative">
        <img
          src="https://pollinations.ai/p/Tomato%20and%20Basil%20Bruschetta%20food%20photography%2C%20michelin%20star%20plating%2C%208k%2C%20delicious%2C%20cinematic%20lighting?width=1200&height=675&nologo=true&seed=2997"
          alt="Tomato and Basil Bruschetta"
          className="w-full h-auto object-cover aspect-video"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <span className="text-white font-bold text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 15m | Cook: 20m
          </span>
        </div>
      </div>

      {/* INGREDIENTS */}
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
                className="h-6 w-6 p-0"
                onClick={() => setServings((s) => Math.max(1, s - 1))}
              >
                -
              </Button>
              <span className="w-4 text-center font-bold">{servings}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
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
                <TableRow key={i}>
                  <TableCell className="font-medium">{ing.name}</TableCell>
                  <TableCell className="text-right font-bold text-slate-600 dark:text-slate-400">
                    {getAmount(ing.baseAmount)} {ing.unit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* NUTRITION */}
      <Card className="bg-slate-50 dark:bg-slate-900/50">
        <CardContent className="p-4 grid grid-cols-4 gap-2 text-center text-sm">
          <div>
            <div className="font-bold">{nutrition.calories}</div>
            <span className="text-xs text-slate-500">Kcal</span>
          </div>
          <div>
            <div className="font-bold">{nutrition.protein}</div>
            <span className="text-xs text-slate-500">Prot</span>
          </div>
          <div>
            <div className="font-bold">{nutrition.carbs}</div>
            <span className="text-xs text-slate-500">Carb</span>
          </div>
          <div>
            <div className="font-bold">{nutrition.fat}</div>
            <span className="text-xs text-slate-500">Fat</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // --- EDITORIAL CONTENT (Right Column) ---
  const editorial = (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-4">About this Recipe</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p className="lead">
            Tomato and Basil Bruschetta is a classic Italian appetizer featuring
            toasted bread topped with a fresh mixture of ripe tomatoes, fragrant
            basil, garlic, and a drizzle of olive oil. It's simple, vibrant, and
            perfect for any occasion.
          </p>
          <p>
            Originating from the Italian region of Tuscany, bruschetta was
            traditionally served as a way to salvage stale bread by toasting it
            and topping it with flavorful ingredients. Over time, it has become a
            beloved starter worldwide, celebrated for its fresh ingredients and
            rustic charm.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-orange-500" /> Instructions
        </h2>
        <ol className="relative border-l border-slate-200 dark:border-slate-800 ml-3 space-y-8">
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              1
            </span>
            <h3 className="font-bold text-lg mb-1">Prepare the Tomato Mixture</h3>
            <p className="text-slate-600 dark:text-slate-400">
              In a bowl, combine chopped ripe tomatoes, minced garlic, chopped
              fresh basil, balsamic vinegar, olive oil, salt, and freshly ground
              black pepper. Mix gently and set aside to marinate for 10 minutes.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              2
            </span>
            <h3 className="font-bold text-lg mb-1">Toast the Bread</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Slice the baguette into 1/2-inch thick pieces. Toast or grill the
              slices until golden and crisp on both sides. Optionally, rub each
              slice with a cut garlic clove for extra flavor.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              3
            </span>
            <h3 className="font-bold text-lg mb-1">Assemble the Bruschetta</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Spoon the tomato mixture generously onto each toasted bread slice.
              Drizzle with a little more olive oil and sprinkle with grated
              Parmesan cheese if desired.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              4
            </span>
            <h3 className="font-bold text-lg mb-1">Serve Immediately</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Serve the bruschetta fresh to enjoy the crisp bread and vibrant
              tomato topping at their best.
            </p>
          </li>
        </ol>
      </section>

      <section className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-4 text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <Flame className="h-5 w-5" /> Chef's Tips
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-amber-900 dark:text-amber-100 text-sm">
          <li>
            Use the freshest, ripest tomatoes you can find for the best flavor
            and juiciness.
          </li>
          <li>
            Let the tomato mixture marinate for at least 10 minutes to allow
            flavors to meld.
          </li>
          <li>
            Toast the bread well to prevent sogginess when topped with the juicy
            tomato mixture.
          </li>
          <li>
            For a smoky twist, grill the bread slices over charcoal or a grill
            pan.
          </li>
          <li>
            Add a splash of good quality balsamic vinegar to enhance the
            brightness of the tomatoes.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="border-b pb-2">
              <h3 className="font-semibold">{f.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {f.answer}
              </p>
            </div>
          ))}
        </div>
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
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}