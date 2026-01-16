import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HeartsOfPalmSaladCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Hearts%20of%20Palm%20Salad%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=338"
  );

  // --- DATA ---
  const title = "Hearts of Palm Salad";
  const description = "A refreshing salad featuring tender, premium hearts of palm.";

  // INGREDIENTS
  const ingredients = [
    { name: "Hearts of Palm (sliced)", baseAmount: 500, unit: "g" },
    { name: "Cherry Tomatoes (halved)", baseAmount: 200, unit: "g" },
    { name: "Cucumber (diced)", baseAmount: 150, unit: "g" },
    { name: "Red Onion (thinly sliced)", baseAmount: 50, unit: "g" },
    { name: "Avocado (cubed)", baseAmount: 1, unit: "medium" },
    { name: "Fresh Cilantro (chopped)", baseAmount: 15, unit: "g" },
    { name: "Lime Juice", baseAmount: 30, unit: "ml" },
    { name: "Extra Virgin Olive Oil", baseAmount: 45, unit: "ml" },
    { name: "Honey", baseAmount: 10, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper (freshly ground)", baseAmount: 0.5, unit: "tsp" },
    { name: "Crumbled Feta Cheese (optional)", baseAmount: 100, unit: "g" },
    { name: "Toasted Pine Nuts", baseAmount: 30, unit: "g" },
    { name: "Fresh Basil Leaves (for garnish)", baseAmount: 10, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "220",
    protein: "5g",
    carbs: "12g",
    fat: "17g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What are hearts of palm and where can I buy them?",
      answer:
        "Hearts of palm are the tender inner core of certain palm tree varieties, prized for their delicate flavor and crisp texture. They are commonly sold canned or jarred in most grocery stores, specialty food markets, or Latin American stores. Fresh hearts of palm can sometimes be found at farmers' markets or gourmet stores.",
    },
    {
      question: "Can I substitute hearts of palm with another ingredient?",
      answer:
        "While hearts of palm have a unique texture and flavor, you can substitute them with artichoke hearts or white asparagus for a similar tender and slightly tangy bite. However, the salad’s signature taste will be slightly different.",
    },
    {
      question: "How do I store leftovers of this salad?",
      answer:
        "Store any leftover salad in an airtight container in the refrigerator for up to 2 days. To maintain freshness, keep the dressing separate and toss just before serving to avoid sogginess.",
    },
    {
      question: "Is this salad suitable for vegan diets?",
      answer:
        "This salad is naturally vegan if you omit the optional crumbled feta cheese. The rest of the ingredients are plant-based, making it a fresh and healthy vegan option.",
    },
    {
      question: "Can I prepare this salad in advance?",
      answer:
        "Yes, you can prepare the ingredients in advance and store them separately. However, it’s best to combine and dress the salad just before serving to preserve the crispness and freshness of the hearts of palm and avocado.",
    },
    {
      question: "What wine pairs well with Hearts of Palm Salad?",
      answer:
        "A crisp, light white wine such as Sauvignon Blanc or a dry Rosé pairs beautifully with this salad, complementing the fresh citrus notes and creamy avocado without overpowering the delicate hearts of palm.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Hearts of Palm Salad"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          About this Recipe
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Hearts of Palm Salad is a light, refreshing dish that highlights the
            tender, slightly nutty flavor of hearts of palm. This salad combines
            crisp vegetables, creamy avocado, and a zesty lime dressing to create
            a perfect balance of textures and flavors. Ideal for warm weather or as
            a sophisticated starter, it’s both nutritious and visually appealing.
          </p>
          <p>
            The hearts of palm have been enjoyed for centuries in tropical regions,
            particularly in Central and South America. Traditionally harvested from
            the inner core of certain palm trees, they have become a gourmet
            ingredient worldwide. This salad reflects a modern twist on classic
            Latin American flavors, emphasizing freshness and simplicity.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Drain and slice the hearts of palm into 1/2-inch pieces. Halve the
              cherry tomatoes, dice the cucumber, thinly slice the red onion, and
              cube the avocado. Chop the fresh cilantro and basil leaves.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Make the Dressing
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a small bowl, whisk together lime juice, extra virgin olive oil,
              honey, salt, and freshly ground black pepper until emulsified.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Combine Salad Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, gently toss the hearts of palm, cherry tomatoes,
              cucumber, red onion, avocado, and cilantro with the dressing until
              evenly coated.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Plate and Garnish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the salad to serving plates. Sprinkle with crumbled feta
              cheese (if using), toasted pine nuts, and fresh basil leaves for an
              aromatic finish.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve Immediately
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the salad fresh to enjoy the crisp textures and vibrant flavors.
              This dish pairs well with grilled seafood or as a light lunch on its
              own.
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
            For the best texture, use fresh hearts of palm if available; canned
            hearts of palm work well but rinse them to remove excess brine.
          </li>
          <li>
            Toast pine nuts gently in a dry skillet over medium heat until golden
            and fragrant to add a delightful crunch.
          </li>
          <li>
            Adjust the honey in the dressing to balance the acidity of the lime juice
            according to your taste preference.
          </li>
          <li>
            To keep avocado from browning, toss it with a little lime juice before
            mixing into the salad.
          </li>
          <li>
            This salad can be served chilled or at room temperature, but avoid
            refrigerating after dressing to maintain freshness.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">FAQ</h2>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i} className="border-b pb-4 last:border-0">
              <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
                {f.question}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                {f.answer}
              </p>
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
              href="https://en.wikipedia.org/wiki/Hearts_of_palm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Hearts of Palm
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.bonappetit.com/recipe/hearts-of-palm-salad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Bon Appétit: Hearts of Palm Salad Recipe
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