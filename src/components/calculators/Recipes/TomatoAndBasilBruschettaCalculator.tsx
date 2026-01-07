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
    "https://image.pollinations.ai/prompt/Tomato%20and%20Basil%20Bruschetta%20food%20photography%20delicious%20close%20up?width=1280&height=720&nologo=true&seed=3945&model=flux"
  );

  // --- DATA ---
  const title = "Tomato and Basil Bruschetta";
  const description = "Toasted bread topped with fresh tomatoes, basil, garlic, and olive oil.";

  // INGREDIENTS
  const ingredients = [
    { name: "Ripe Tomatoes", baseAmount: 500, unit: "g" },
    { name: "Fresh Basil Leaves", baseAmount: 15, unit: "g" },
    { name: "Garlic Cloves", baseAmount: 2, unit: "cloves" },
    { name: "Extra Virgin Olive Oil", baseAmount: 60, unit: "ml" },
    { name: "Balsamic Vinegar", baseAmount: 15, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Ciabatta or Baguette Bread", baseAmount: 1, unit: "loaf" },
    { name: "Parmesan Cheese (optional)", baseAmount: 30, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "180",
    protein: "4g",
    carbs: "22g",
    fat: "8g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) => (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ ---
  const faqs = [
    {
      question: "Can I use other types of bread for bruschetta?",
      answer:
        "Yes, you can use any crusty bread like sourdough, French baguette, or even whole grain bread. Just make sure it toasts well.",
    },
    {
      question: "How do I store leftover bruschetta topping?",
      answer:
        "Store the tomato and basil mixture in an airtight container in the refrigerator for up to 2 days. Add fresh bread when ready to serve.",
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
          width={1280}
          height={720}
          className="w-full h-auto object-cover aspect-video transition-transform duration-700 group-hover:scale-105"
          onError={() => setImgSrc("https://loremflickr.com/1280/720/food,dish/all")}
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
            Tomato and Basil Bruschetta is a classic Italian antipasto that celebrates the fresh, vibrant flavors of ripe tomatoes,
            fragrant basil, and garlic. Served atop toasted bread, this simple yet delicious dish is perfect for summer gatherings or a
            light snack.
          </p>
          <p>
            Originating from the Italian region of Tuscany, bruschetta dates back to the 15th century when olive growers would toast
            bread to sample their freshly pressed oil. Over time, the recipe evolved to include toppings like tomatoes and herbs,
            becoming a beloved staple worldwide.
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
            <h3 className="font-bold text-lg mb-1">Prepare the Tomatoes</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Dice the ripe tomatoes into small pieces and place them in a mixing bowl. Remove excess seeds and juice to avoid sogginess.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              2
            </span>
            <h3 className="font-bold text-lg mb-1">Add Basil and Garlic</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Finely chop fresh basil leaves and mince the garlic cloves. Add both to the tomatoes along with salt, black pepper, and
              balsamic vinegar.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              3
            </span>
            <h3 className="font-bold text-lg mb-1">Mix with Olive Oil</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Drizzle extra virgin olive oil over the mixture and gently toss to combine. Let it sit for 10 minutes to allow flavors to
              meld.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              4
            </span>
            <h3 className="font-bold text-lg mb-1">Toast the Bread</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Slice the ciabatta or baguette into 1/2-inch thick pieces. Toast them until golden and crisp, either in a toaster oven or on
              a grill pan.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              5
            </span>
            <h3 className="font-bold text-lg mb-1">Assemble and Serve</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Spoon the tomato mixture generously onto each toasted bread slice. Optionally, sprinkle with shaved Parmesan cheese and
              serve immediately.
            </p>
          </li>
        </ol>
      </section>

      <section className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-4 text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <Flame className="h-5 w-5" /> Chef's Tips
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-amber-900 dark:text-amber-100 text-sm">
          <li>Use the freshest, ripest tomatoes for the best flavor and texture.</li>
          <li>Lightly rub the toasted bread with a cut garlic clove for extra aroma.</li>
          <li>Let the tomato mixture rest for a few minutes to enhance the flavors before serving.</li>
          <li>If you prefer, add a pinch of red chili flakes for a subtle heat.</li>
          <li>Serve bruschetta immediately after assembling to keep the bread crisp.</li>
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
            <a href="https://en.wikipedia.org/wiki/Bruschetta" target="_blank" rel="noreferrer" className="hover:underline">
              Wikipedia: Bruschetta
            </a>
          </li>
          <li>
            <ExternalLink className="inline h-3 w-3 mr-1" />{" "}
            <a href="https://www.seriouseats.com/classic-bruschetta-recipe" target="_blank" rel="noreferrer" className="hover:underline">
              Serious Eats: Classic Bruschetta Recipe
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