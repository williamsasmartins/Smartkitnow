import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ArugulaAndParmesanSaladCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Arugula%20and%20Parmesan%20Salad%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4524"
  );

  // --- DATA ---
  const title = "Arugula and Parmesan Salad";
  const description = "Peppery arugula tossed with shaved Parmesan and lemon-olive oil dressing.";

  // INGREDIENTS
  const ingredients = [
    { name: "Fresh Arugula", baseAmount: 120, unit: "g" },
    { name: "Parmesan Cheese (shaved)", baseAmount: 50, unit: "g" },
    { name: "Extra Virgin Olive Oil", baseAmount: 3, unit: "tbsp" },
    { name: "Fresh Lemon Juice", baseAmount: 1.5, unit: "tbsp" },
    { name: "Garlic (minced)", baseAmount: 1, unit: "clove" },
    { name: "Salt", baseAmount: 0.5, unit: "tsp" },
    { name: "Freshly Ground Black Pepper", baseAmount: 0.25, unit: "tsp" },
    { name: "Cherry Tomatoes (halved)", baseAmount: 100, unit: "g" },
    { name: "Toasted Pine Nuts", baseAmount: 30, unit: "g" },
    { name: "Red Onion (thinly sliced)", baseAmount: 30, unit: "g" },
    { name: "Capers (optional)", baseAmount: 10, unit: "g" },
    { name: "Fresh Basil Leaves (for garnish)", baseAmount: 5, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: Math.round(
      (120 * 0.25 + 50 * 4.3 + 3 * 119 + 1.5 * 4 + 1 * 4 + 0.5 * 0 + 0.25 * 0 + 100 * 18 + 30 * 191 + 30 * 16 + 10 * 2 + 5 * 1) *
        (servings / 4)
    ),
    protein: `${((120 * 0.025 + 50 * 0.35 + 30 * 0.04 + 30 * 0.3) * (servings / 4)).toFixed(1)}g`,
    carbs: `${((120 * 0.038 + 100 * 0.04 + 30 * 0.04 + 30 * 0.04 + 10 * 0.5) * (servings / 4)).toFixed(1)}g`,
    fat: `${((50 * 0.28 + 3 * 13.5 + 30 * 20 + 1.5 * 0.1) * (servings / 4)).toFixed(1)}g`,
  };

  // --- LOGIC ---
  const getAmount = (base: number) => (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes arugula a great choice for this salad?",
      answer:
        "Arugula has a distinct peppery and slightly bitter flavor that adds a refreshing contrast to the creamy and salty Parmesan cheese. Its tender leaves also provide a delicate texture, making it ideal for light salads.",
    },
    {
      question: "Can I substitute Parmesan with another cheese?",
      answer:
        "Yes, you can substitute Parmesan with Pecorino Romano for a sharper, saltier flavor or with aged Asiago for a milder taste. However, Parmesan's nutty and savory profile pairs best with arugula and lemon dressing.",
    },
    {
      question: "How do I toast pine nuts properly?",
      answer:
        "To toast pine nuts, heat a dry skillet over medium heat and add the pine nuts in a single layer. Stir frequently for 3-5 minutes until they turn golden brown and release a nutty aroma. Be careful not to burn them as they toast quickly.",
    },
    {
      question: "Is this salad suitable for vegan diets?",
      answer:
        "Traditional Parmesan cheese is not vegan as it contains animal rennet. To make this salad vegan, substitute Parmesan with a plant-based cheese alternative or nutritional yeast, and ensure the dressing ingredients are vegan-friendly.",
    },
    {
      question: "How should I store leftovers to keep the salad fresh?",
      answer:
        "Store leftover salad components separately if possible. Keep the arugula and dressing apart to prevent wilting. Refrigerate in airtight containers and consume within 1-2 days for optimal freshness and flavor.",
    },
    {
      question: "Can I prepare this salad in advance?",
      answer:
        "You can prepare the dressing and chop ingredients ahead of time, but toss the arugula with the dressing just before serving to maintain its crispness and vibrant texture.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Arugula and Parmesan Salad"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            This Arugula and Parmesan Salad is a vibrant and refreshing dish that perfectly balances
            peppery greens with the rich, nutty flavor of shaved Parmesan cheese. Tossed in a simple
            lemon and olive oil dressing, it’s a quick and elegant salad that complements any meal or
            can be enjoyed on its own as a light lunch.
          </p>
          <p>
            The origins of this salad trace back to Italian cuisine, where fresh, high-quality
            ingredients are celebrated in their simplest forms. Arugula, known as "rucola" in Italy,
            has been a staple in Mediterranean diets for centuries, prized for its distinctive taste
            and nutritional benefits. Combining it with Parmesan, a cheese with a long history in
            Italian gastronomy, creates a dish that is both timeless and universally loved.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the arugula leaves thoroughly and spin dry or pat dry with paper towels. Thinly
              slice the red onion, halve the cherry tomatoes, mince the garlic, and shave the
              Parmesan cheese using a vegetable peeler.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Toast the Pine Nuts</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a dry skillet over medium heat, toast the pine nuts until golden and fragrant,
              stirring frequently to prevent burning. Set aside to cool.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Dressing</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a small bowl, whisk together the extra virgin olive oil, fresh lemon juice, minced
              garlic, salt, and freshly ground black pepper until emulsified.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Combine Salad Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, gently toss the arugula, cherry tomatoes, red onion, and capers (if
              using) with the dressing until evenly coated.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve and Garnish</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the salad to serving plates, sprinkle with toasted pine nuts and shaved
              Parmesan cheese, and garnish with fresh basil leaves. Serve immediately for best
              flavor and texture.
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
            Use fresh, young arugula leaves for a tender texture and milder peppery flavor. Older
            leaves can be tougher and more bitter.
          </li>
          <li>
            When shaving Parmesan, use a vegetable peeler to create thin, delicate ribbons that
            melt beautifully on the salad.
          </li>
          <li>
            If you prefer a creamier dressing, whisk in a teaspoon of Dijon mustard or a small dollop
            of honey to balance acidity.
          </li>
          <li>
            Toast pine nuts just before serving to preserve their crunch and nutty aroma.
          </li>
          <li>
            For added depth, sprinkle a few drops of balsamic glaze over the finished salad.
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