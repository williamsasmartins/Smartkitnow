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

  // INGREDIENTS: Use 'baseAmount' (number)
  const ingredients = [
    { name: "Ripe Tomatoes (chopped)", baseAmount: 400, unit: "g" },
    { name: "Fresh Basil Leaves", baseAmount: 15, unit: "g" },
    { name: "Garlic Cloves (minced)", baseAmount: 2, unit: "cloves" },
    { name: "Extra Virgin Olive Oil", baseAmount: 60, unit: "ml" },
    { name: "Balsamic Vinegar", baseAmount: 15, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper (freshly ground)", baseAmount: 0.5, unit: "tsp" },
    { name: "Italian Bread (sliced)", baseAmount: 8, unit: "slices" },
    { name: "Parmesan Cheese (optional, grated)", baseAmount: 20, unit: "g" },
  ];

  const nutrition = {
    calories: "210",
    protein: "5g",
    carbs: "22g",
    fat: "12g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ ---
  const faqs = [
    {
      question: "Can I use other types of bread for bruschetta?",
      answer:
        "Yes, rustic Italian bread or a baguette works well. Just ensure it toasts nicely.",
    },
    {
      question: "How do I store leftover bruschetta topping?",
      answer:
        "Store the tomato and basil mixture in an airtight container in the fridge for up to 2 days.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 relative">
        <img
          src="https://pollinations.ai/p/Tomato%20and%20Basil%20Bruschetta%20food%20photography%2C%20michelin%20star%20plating%2C%208k%2C%20delicious%2C%20cinematic%20lighting?width=1200&height=675&nologo=true&seed=26973"
          alt="Tomato and Basil Bruschetta"
          className="w-full h-auto object-cover aspect-video"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <span className="text-white font-bold text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 15m | Cook: 5m
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

  // --- EDITORIAL CONTENT ---
  const editorial = (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-4">About this Recipe</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p className="lead">
            This classic Italian appetizer features toasted bread topped with a
            vibrant mixture of ripe tomatoes, fresh basil, garlic, and a drizzle
            of extra virgin olive oil. It's a fresh, flavorful starter perfect
            for any occasion.
          </p>
          <p>
            Bruschetta dates back to 15th-century Italy, originally created as a
            way to salvage stale bread by toasting it and topping it with
            simple, fresh ingredients. Over time, it has become a beloved dish
            worldwide, celebrated for its simplicity and deliciousness.
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
              fresh basil leaves, balsamic vinegar, salt, and freshly ground black
              pepper. Stir gently to mix and let it sit for 10 minutes to meld
              flavors.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              2
            </span>
            <h3 className="font-bold text-lg mb-1">Toast the Bread</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Lightly brush the bread slices with extra virgin olive oil on both
              sides. Toast them on a grill pan or in the oven until golden and
              crisp, about 2-3 minutes per side.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              3
            </span>
            <h3 className="font-bold text-lg mb-1">Assemble the Bruschetta</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Spoon the tomato mixture generously over each toasted bread slice.
              Drizzle with extra virgin olive oil and, if desired, sprinkle with
              grated Parmesan cheese.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              4
            </span>
            <h3 className="font-bold text-lg mb-1">Serve Immediately</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Serve the bruschetta immediately to enjoy the contrast of warm,
              crispy bread with the fresh, juicy tomato topping.
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
            Lightly rub the toasted bread with a cut garlic clove for an extra
            hint of garlic flavor.
          </li>
          <li>
            For a smoky twist, grill the bread slices over charcoal or a grill
            pan.
          </li>
          <li>
            If you prefer a milder garlic taste, sauté the minced garlic briefly
            in olive oil before mixing it with the tomatoes.
          </li>
          <li>
            Serve bruschetta as soon as assembled to keep the bread crisp and
            prevent sogginess.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="border-b pb-2">
              <h3 className="font-semibold">{f.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{f.answer}</p>
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