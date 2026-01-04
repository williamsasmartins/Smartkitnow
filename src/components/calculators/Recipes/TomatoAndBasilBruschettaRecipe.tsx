import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TomatoAndBasilBruschettaRecipeCalculator() {
  const [servings, setServings] = useState(4);

  // --- DATA ---
  const title = "Tomato and Basil Bruschetta";
  const description = "Toasted bread topped with fresh tomatoes, basil, garlic, and olive oil.";

  // INGREDIENTS: Use 'baseAmount' (number) for scaling logic
  const ingredients = [
    { name: "Ripe Tomatoes (chopped)", baseAmount: 400, unit: "g" },
    { name: "Fresh Basil Leaves", baseAmount: 15, unit: "g" },
    { name: "Garlic Cloves (minced)", baseAmount: 2, unit: "cloves" },
    { name: "Extra Virgin Olive Oil", baseAmount: 30, unit: "ml" },
    { name: "Balsamic Vinegar", baseAmount: 10, unit: "ml" },
    { name: "Salt", baseAmount: 2, unit: "g" },
    { name: "Black Pepper (freshly ground)", baseAmount: 1, unit: "g" },
    { name: "Ciabatta or Baguette Bread", baseAmount: 250, unit: "g" },
    { name: "Parmesan Cheese (optional, grated)", baseAmount: 20, unit: "g" },
  ];

  const nutrition = {
    calories: "210",
    protein: "5g",
    carbs: "25g",
    fat: "10g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ ---
  const faqs = [
    {
      question: "Can I use other types of bread for bruschetta?",
      answer:
        "Yes, rustic breads like sourdough or French baguette work well. Just ensure they are sliced thickly and toasted properly.",
    },
    {
      question: "How do I keep the bread from getting soggy?",
      answer:
        "Toast the bread slices until crisp and drizzle olive oil just before serving to maintain crunchiness.",
    },
    {
      question: "Can I prepare the tomato topping in advance?",
      answer:
        "Yes, prepare the tomato mixture up to 2 hours ahead and keep refrigerated. Add fresh basil just before serving for best flavor.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT (Left Column) ---
  const widget = (
    <div className="space-y-6">
      {/* 1. HERO IMAGE */}
      <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 relative group">
        <img
          src="https://pollinations.ai/p/Tomato%20and%20Basil%20Bruschetta%20food%20photography%2C%20michelin%20star%20plating%2C%208k%2C%20delicious%2C%20cinematic%20lighting%2C%20highly%20detailed?width=1200&height=675&nologo=true&seed=26973"
          alt="Tomato and Basil Bruschetta"
          className="w-full h-auto object-cover aspect-video transform transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <span className="text-white font-bold text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 15m | Cook: 20m
          </span>
        </div>
      </div>

      {/* 2. INGREDIENTS CARD */}
      <Card>
        <CardHeader className="pb-3 bg-slate-50 dark:bg-slate-900/50 border-b dark:border-slate-800">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-lg">
              <Utensils className="h-5 w-5 text-orange-500" /> Ingredients
            </span>

            {/* Servings Adjuster */}
            <div className="flex items-center gap-2 text-sm bg-white dark:bg-slate-800 border dark:border-slate-700 p-1.5 rounded-lg shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => setServings((s) => Math.max(1, s - 1))}
              >
                -
              </Button>
              <span className="w-6 text-center font-bold text-slate-700 dark:text-slate-200">
                {servings}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => setServings((s) => s + 1)}
              >
                +
              </Button>
              <Users className="h-3 w-3 text-slate-400 ml-1" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableBody>
              {ingredients.map((ing, i) => (
                <TableRow
                  key={i}
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/50"
                >
                  <TableCell className="font-medium text-slate-700 dark:text-slate-300">
                    {ing.name}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    {getAmount(ing.baseAmount)}{" "}
                    <span className="text-xs font-normal text-slate-500">
                      {ing.unit}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 3. NUTRITION SUMMARY */}
      <Card className="bg-slate-50 dark:bg-slate-900/30 border-dashed">
        <CardContent className="p-4 grid grid-cols-4 gap-2 text-center text-sm">
          <div className="p-2 bg-white dark:bg-slate-900 rounded border dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white">
              {nutrition.calories}
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Kcal
            </span>
          </div>
          <div className="p-2 bg-white dark:bg-slate-900 rounded border dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white">
              {nutrition.protein}
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Prot
            </span>
          </div>
          <div className="p-2 bg-white dark:bg-slate-900 rounded border dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white">
              {nutrition.carbs}
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Carb
            </span>
          </div>
          <div className="p-2 bg-white dark:bg-slate-900 rounded border dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white">
              {nutrition.fat}
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Fat
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // --- EDITORIAL CONTENT (Right Column) ---
  const editorial = (
    <div className="space-y-10">
      {/* INTRO */}
      <section>
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          About this Recipe
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed">
          <p className="lead">
            Experience the fresh, vibrant flavors of Italy with this classic
            Tomato and Basil Bruschetta. Crisp toasted bread topped with juicy
            tomatoes, fragrant basil, and a hint of garlic makes for a perfect
            appetizer or light snack.
          </p>
          <p>
            Originating from the Italian region of Tuscany, bruschetta was
            traditionally a way to salvage stale bread by toasting it and
            topping it with local ingredients. Today, it remains a beloved
            dish worldwide, celebrated for its simplicity and fresh flavors.
          </p>
        </div>
      </section>

      {/* STEPS */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b pb-2 border-slate-200 dark:border-slate-800">
          <ChefHat className="h-6 w-6 text-orange-500" /> Instructions
        </h2>
        <ol className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-10">
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              1
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Tomato Mixture
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              In a bowl, combine chopped ripe tomatoes, minced garlic, torn
              fresh basil leaves, balsamic vinegar, salt, and freshly ground
              black pepper. Drizzle with olive oil and gently mix to combine.
              Let it marinate for 10 minutes to meld flavors.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Toast the Bread
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Slice the ciabatta or baguette into 1cm thick slices. Toast them
              on a grill pan or in the oven until golden and crisp. Optionally,
              rub each slice with a cut garlic clove for extra aroma.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble and Serve
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Spoon the tomato mixture generously over each toasted bread slice.
              Drizzle with a little more olive oil and sprinkle with grated
              Parmesan cheese if desired. Serve immediately to enjoy the
              perfect balance of textures and flavors.
            </p>
          </li>
        </ol>
      </section>

      {/* TIPS */}
      <section className="bg-amber-50 dark:bg-amber-950/20 p-8 rounded-2xl border border-amber-100 dark:border-amber-900/50">
        <h3 className="font-bold text-xl mb-4 text-amber-900 dark:text-amber-100 flex items-center gap-2">
          <Flame className="h-5 w-5 text-amber-500" /> Chef's Secrets
        </h3>
        <ul className="space-y-3">
          <li className="flex gap-3 text-amber-800 dark:text-amber-200">
            <span className="text-amber-500 font-bold text-lg">•</span>
            <span>
              Use the freshest, ripest tomatoes available for the best flavor
              and juiciness.
            </span>
          </li>
          <li className="flex gap-3 text-amber-800 dark:text-amber-200">
            <span className="text-amber-500 font-bold text-lg">•</span>
            <span>
              Toast the bread just before serving to keep it crisp and avoid
              sogginess.
            </span>
          </li>
          <li className="flex gap-3 text-amber-800 dark:text-amber-200">
            <span className="text-amber-500 font-bold text-lg">•</span>
            <span>
              For a smoky twist, grill the bread slices over charcoal or a
              gas flame.
            </span>
          </li>
          <li className="flex gap-3 text-amber-800 dark:text-amber-200">
            <span className="text-amber-500 font-bold text-lg">•</span>
            <span>
              Add a pinch of chili flakes to the tomato mixture for a subtle
              heat.
            </span>
          </li>
        </ul>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800"
            >
              <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">
                {f.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">{f.answer}</p>
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