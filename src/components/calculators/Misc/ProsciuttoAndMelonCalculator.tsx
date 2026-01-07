import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ProsciuttoAndMelonCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Prosciutto%20and%20Melon%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4195"
  );

  // --- DATA ---
  const title = "Prosciutto and Melon";
  const description = "Sweet ripe melon wrapped in thin slices of salty prosciutto.";

  // INGREDIENTS
  const ingredients = [
    { name: "Cantaloupe Melon (ripe, peeled, and sliced)", baseAmount: 500, unit: "g" },
    { name: "Prosciutto di Parma (thinly sliced)", baseAmount: 200, unit: "g" },
    { name: "Fresh Mint Leaves", baseAmount: 10, unit: "g" },
    { name: "Extra Virgin Olive Oil", baseAmount: 15, unit: "ml" },
    { name: "Freshly Ground Black Pepper", baseAmount: 1, unit: "g" },
    { name: "Lemon Zest", baseAmount: 2, unit: "g" },
    { name: "Arugula (optional, for garnish)", baseAmount: 30, unit: "g" },
    { name: "Balsamic Glaze (optional)", baseAmount: 10, unit: "ml" },
    { name: "Sea Salt (to taste)", baseAmount: 1, unit: "g" },
    { name: "Toasted Pine Nuts (optional)", baseAmount: 15, unit: "g" },
    { name: "Fresh Basil Leaves (optional)", baseAmount: 5, unit: "g" },
    { name: "Lime Juice (freshly squeezed)", baseAmount: 10, unit: "ml" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "180",
    protein: "12g",
    carbs: "15g",
    fat: "8g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of melon is best for prosciutto and melon?",
      answer:
        "Cantaloupe melon is traditionally used due to its sweet, juicy flesh and firm texture that pairs beautifully with the salty prosciutto. However, honeydew or even ripe watermelon can be used as alternatives depending on your taste preference.",
    },
    {
      question: "Can I prepare prosciutto and melon in advance?",
      answer:
        "Yes, you can prepare the melon slices and wrap them with prosciutto a few hours ahead of serving. Keep them covered tightly in the refrigerator to maintain freshness. However, for the best texture and flavor, assemble just before serving.",
    },
    {
      question: "Are there any variations to the classic prosciutto and melon recipe?",
      answer:
        "Absolutely! Some variations include adding fresh herbs like mint or basil, drizzling with balsamic glaze or extra virgin olive oil, or serving with a bed of arugula. Toasted pine nuts or a squeeze of lime juice can also add interesting flavor contrasts.",
    },
    {
      question: "Is prosciutto and melon suitable for special diets?",
      answer:
        "Prosciutto and melon is naturally gluten-free and low in carbohydrates, making it suitable for gluten-free and low-carb diets. However, it contains pork and is not suitable for vegetarians or vegans.",
    },
    {
      question: "How should I store leftover prosciutto and melon?",
      answer:
        "Store leftovers in an airtight container in the refrigerator and consume within 24 hours. The melon may release some juice, so placing a paper towel at the bottom of the container can help absorb excess moisture and keep the prosciutto from becoming soggy.",
    },
    {
      question: "Can I substitute prosciutto with other cured meats?",
      answer:
        "While prosciutto is the classic choice, you can substitute it with other thinly sliced cured meats like Serrano ham or speck. Each will impart a slightly different flavor profile but still complement the sweetness of the melon nicely.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Prosciutto and Melon"
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
            Prosciutto and melon is a classic Italian antipasto that perfectly balances the sweet,
            juicy flavors of ripe melon with the salty, savory notes of thinly sliced prosciutto.
            This simple yet elegant dish has been enjoyed for centuries, especially during the warm
            summer months when melons are at their peak ripeness.
          </p>
          <p>
            The combination of textures and flavors creates a refreshing and satisfying starter that
            is both light and indulgent. Traditionally served chilled, prosciutto and melon is
            often garnished with fresh herbs or a drizzle of olive oil to enhance its natural
            flavors. It's a perfect dish for entertaining or a quick gourmet snack.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Melon</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Peel the cantaloupe melon, remove the seeds, and slice it into bite-sized wedges or
              cubes. Chill the melon slices in the refrigerator for at least 15 minutes before
              assembling.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Wrap with Prosciutto</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Take thin slices of prosciutto and gently wrap each melon piece. The prosciutto should
              cling lightly without overpowering the melon.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Garnishes</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Arrange the wrapped melon on a serving platter. Garnish with fresh mint or basil
              leaves, a sprinkle of lemon zest, and a few cracks of black pepper. Optionally, add
              arugula, toasted pine nuts, or a drizzle of balsamic glaze or olive oil.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve Chilled</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve immediately or keep chilled until ready to serve. This dish is best enjoyed fresh
              to appreciate the contrast of flavors and textures.
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
            Use the freshest and highest quality prosciutto you can find, as it greatly impacts the
            flavor.
          </li>
          <li>
            Chill the melon well before assembling to keep the dish refreshing and enhance the
            contrast with the salty prosciutto.
          </li>
          <li>
            Experiment with different melons like honeydew or watermelon for a unique twist on the
            classic.
          </li>
          <li>
            For an elegant presentation, use a melon baller to create uniform melon spheres before
            wrapping.
          </li>
          <li>
            Adding a light drizzle of aged balsamic glaze can add a subtle sweetness and acidity
            that complements the dish beautifully.
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