import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TomatoAndBasilBruschettaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Tomato%20and%20Basil%20Bruschetta%2C%20plated%20food%20dish%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3599"
  );

  // --- DATA ---
  const title = "Tomato and Basil Bruschetta";
  const description = "Toasted bread topped with fresh tomatoes, basil, garlic, and olive oil.";

  // INGREDIENTS
  const ingredients = [
    { name: "Ripe Tomatoes (chopped)", baseAmount: 500, unit: "g" },
    { name: "Fresh Basil Leaves", baseAmount: 15, unit: "g" },
    { name: "Garlic Cloves (minced)", baseAmount: 2, unit: "cloves" },
    { name: "Extra Virgin Olive Oil", baseAmount: 30, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Balsamic Vinegar (optional)", baseAmount: 10, unit: "ml" },
    { name: "French Baguette (sliced)", baseAmount: 1, unit: "loaf" },
    { name: "Parmesan Cheese (grated, optional)", baseAmount: 20, unit: "g" },
  ];

  const nutrition = {
    calories: "180",
    protein: "5g",
    carbs: "22g",
    fat: "8g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ ---
  const faqs = [
    {
      question: "Can I use other types of bread for bruschetta?",
      answer:
        "Yes, you can use ciabatta, sourdough, or any crusty bread you prefer. Just make sure to toast it well.",
    },
    {
      question: "How do I store leftover bruschetta toppings?",
      answer:
        "Store the tomato and basil mixture in an airtight container in the refrigerator for up to 2 days. Toast fresh bread before serving again.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Tomato and Basil Bruschetta"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 15m | Cook: 20m
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
            Tomato and Basil Bruschetta is a classic Italian appetizer featuring
            toasted bread topped with a fresh mixture of ripe tomatoes, fragrant
            basil, garlic, and olive oil. It's a simple yet flavorful dish that
            celebrates the vibrant tastes of summer.
          </p>
          <p>
            Originating from the Italian region of Tuscany, bruschetta was
            traditionally served as a way to salvage stale bread by toasting it
            and topping it with local ingredients. Over time, it has become a
            beloved starter enjoyed worldwide.
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
              In a bowl, combine the chopped tomatoes, minced garlic, chopped fresh
              basil leaves, olive oil, salt, black pepper, and balsamic vinegar (if
              using). Mix gently and let it sit for 10 minutes to allow flavors to
              meld.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              2
            </span>
            <h3 className="font-bold text-lg mb-1">Toast the Bread</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Slice the baguette into 1/2-inch thick pieces. Toast them on a grill,
              in a toaster oven, or under a broiler until golden and crispy on both
              sides.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              3
            </span>
            <h3 className="font-bold text-lg mb-1">Assemble the Bruschetta</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Spoon the tomato mixture generously onto each toasted bread slice.
              Optionally, sprinkle grated Parmesan cheese on top for extra flavor.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              4
            </span>
            <h3 className="font-bold text-lg mb-1">Serve Immediately</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Serve the bruschetta fresh to enjoy the crisp bread and vibrant
              topping at their best.
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
            Use the freshest, ripest tomatoes you can find for the best flavor.
          </li>
          <li>
            Lightly rub the toasted bread with a cut garlic clove for an extra
            garlicky aroma.
          </li>
          <li>
            If you prefer a milder garlic flavor, sauté the garlic in olive oil
            before mixing it with the tomatoes.
          </li>
          <li>
            Drizzle a little extra olive oil over the assembled bruschetta just
            before serving for added richness.
          </li>
          <li>
            For a gluten-free option, substitute the baguette with gluten-free
            bread or crispbread.
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

      <section className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5" /> References
        </h3>
        <ul className="space-y-2 text-sm text-slate-500">
          <li>
            <ExternalLink className="inline h-3 w-3 mr-1" />{" "}
            <a
              href="https://en.wikipedia.org/wiki/Bruschetta"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Wikipedia: Bruschetta
            </a>
          </li>
          <li>
            <ExternalLink className="inline h-3 w-3 mr-1" />{" "}
            <a
              href="https://www.bonappetit.com/recipe/classic-bruschetta"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Bon Appétit: Classic Bruschetta Recipe
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