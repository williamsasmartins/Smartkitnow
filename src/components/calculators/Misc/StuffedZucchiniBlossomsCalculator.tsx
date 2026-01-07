import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function StuffedZucchiniBlossomsCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Stuffed%20Zucchini%20Blossoms%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3220"
  );

  // --- DATA ---
  const title = "Stuffed Zucchini Blossoms";
  const description = "Delicate zucchini flowers stuffed with cheese and herbs, then lightly battered and fried.";

  // INGREDIENTS
  const ingredients = [
    { name: "Zucchini Blossoms", baseAmount: 16, unit: "pieces" },
    { name: "Ricotta Cheese", baseAmount: 250, unit: "g" },
    { name: "Mozzarella Cheese (diced)", baseAmount: 100, unit: "g" },
    { name: "Parmesan Cheese (grated)", baseAmount: 50, unit: "g" },
    { name: "Fresh Basil Leaves (chopped)", baseAmount: 10, unit: "g" },
    { name: "Fresh Parsley (chopped)", baseAmount: 10, unit: "g" },
    { name: "Lemon Zest", baseAmount: 1, unit: "tsp" },
    { name: "Garlic (minced)", baseAmount: 1, unit: "clove" },
    { name: "All-Purpose Flour", baseAmount: 100, unit: "g" },
    { name: "Sparkling Water (cold)", baseAmount: 150, unit: "ml" },
    { name: "Egg (large)", baseAmount: 1, unit: "piece" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper (freshly ground)", baseAmount: 0.5, unit: "tsp" },
    { name: "Olive Oil (for frying)", baseAmount: 500, unit: "ml" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "320",
    protein: "15g",
    carbs: "18g",
    fat: "20g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use other types of cheese for stuffing?",
      answer:
        "Absolutely! While ricotta and mozzarella provide a creamy and melty texture, you can experiment with goat cheese, feta, or even cream cheese to add different flavors and consistencies to the stuffing.",
    },
    {
      question: "How do I clean zucchini blossoms without damaging them?",
      answer:
        "Gently open each blossom and remove the pistil inside using your fingers or a small knife. Rinse them carefully under cold water and pat dry with paper towels. Handle them delicately as they are very fragile.",
    },
    {
      question: "What is the best batter for frying zucchini blossoms?",
      answer:
        "A light batter made from all-purpose flour, cold sparkling water, and a bit of egg creates a crispy, airy coating. The sparkling water helps to keep the batter light and crunchy after frying.",
    },
    {
      question: "Can I bake stuffed zucchini blossoms instead of frying?",
      answer:
        "Yes, baking is a healthier alternative. Preheat your oven to 375°F (190°C), place the stuffed blossoms on a baking sheet, brush with olive oil, and bake for about 15-20 minutes until golden and cooked through.",
    },
    {
      question: "How do I store leftover stuffed zucchini blossoms?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 2 days. Reheat them gently in a skillet or oven to maintain crispiness. Avoid microwaving as it can make the batter soggy.",
    },
    {
      question: "Are zucchini blossoms available year-round?",
      answer:
        "Zucchini blossoms are typically in season during the summer months when zucchinis are abundant. However, some specialty markets may carry them year-round depending on your location.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Stuffed Zucchini Blossoms"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 10m
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
        <CardContent className="p-4 grid grid-cols-4 gap-2 text-center text-sm">
          <div>
            <div className="font-bold text-lg">{nutrition.calories}</div>
            <span className="text-xs font-bold uppercase text-slate-500">Kcal</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.protein}</div>
            <span className="text-xs font-bold uppercase text-slate-500">Prot</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.carbs}</div>
            <span className="text-xs font-bold uppercase text-slate-500">Carb</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.fat}</div>
            <span className="text-xs font-bold uppercase text-slate-500">Fat</span>
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
            Stuffed zucchini blossoms are a celebrated delicacy in Italian cuisine,
            cherished for their delicate texture and subtle floral flavor. This recipe
            combines fresh zucchini flowers with a creamy blend of ricotta, mozzarella,
            and aromatic herbs, creating a harmonious balance of taste and texture.
          </p>
          <p>
            Lightly battered and fried to golden perfection, these blossoms offer a
            crispy exterior that contrasts beautifully with the soft, savory filling.
            Perfect as an appetizer or a light snack, this dish highlights the beauty
            of seasonal ingredients and traditional cooking techniques.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Blossoms</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Gently open each zucchini blossom and carefully remove the pistil inside.
              Rinse the blossoms under cold water and pat dry with paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Filling</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a bowl, combine ricotta, diced mozzarella, grated Parmesan, chopped basil,
              parsley, lemon zest, minced garlic, salt, and pepper. Mix until smooth and well blended.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Stuff the Blossoms</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Carefully fill each blossom with about 1 tablespoon of the cheese mixture.
              Twist the petals gently to close and secure the filling inside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Batter</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a bowl, whisk together flour, egg, salt, and cold sparkling water until
              smooth and slightly thick. The batter should coat the back of a spoon.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Fry the Blossoms</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a deep pan to 180°C (350°F). Dip each stuffed blossom into
              the batter, letting excess drip off, then fry until golden and crisp, about 2-3 minutes.
              Drain on paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve warm as an appetizer or snack, optionally garnished with fresh herbs
              and a squeeze of lemon juice.
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
            Use fresh, organic zucchini blossoms for the best flavor and texture.
          </li>
          <li>
            Keep the batter cold by placing the bowl over ice; this helps achieve a
            crispier fry.
          </li>
          <li>
            Fry in small batches to maintain the oil temperature and ensure even cooking.
          </li>
          <li>
            If you can’t find sparkling water, cold soda water or very cold still water
            can be used, but sparkling water is preferred for lightness.
          </li>
          <li>
            Serve immediately for the best texture; leftovers can be reheated in a
            toaster oven to regain crispiness.
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