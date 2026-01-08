import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CapreseSaladCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Caprese%20Salad%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8471"
  );

  const title = "Caprese Salad";
  const description =
    "Layers of fresh mozzarella, ripe tomatoes, and basil drizzled with olive oil and balsamic.";

  const ingredients = [
    { name: "Fresh Mozzarella Cheese", baseAmount: 250, unit: "g" },
    { name: "Ripe Tomatoes", baseAmount: 300, unit: "g" },
    { name: "Fresh Basil Leaves", baseAmount: 20, unit: "g" },
    { name: "Extra Virgin Olive Oil", baseAmount: 30, unit: "ml" },
    { name: "Balsamic Vinegar", baseAmount: 15, unit: "ml" },
    { name: "Sea Salt", baseAmount: 1, unit: "tsp" },
    { name: "Freshly Ground Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Optional: Arugula", baseAmount: 50, unit: "g" },
    { name: "Optional: Pine Nuts", baseAmount: 15, unit: "g" },
    { name: "Optional: Garlic Clove (minced)", baseAmount: 1, unit: "clove" },
  ];

  const nutrition = {
    calories: "220",
    protein: "12g",
    carbs: "4g",
    fat: "18g",
  };

  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  const faqs = [
    {
      question: "What is the best type of tomato to use for Caprese Salad?",
      answer:
        "For Caprese Salad, ripe, juicy tomatoes with a balance of sweetness and acidity work best. Heirloom tomatoes or vine-ripened beefsteak tomatoes are excellent choices because they offer vibrant flavor and a meaty texture that complements the creamy mozzarella.",
    },
    {
      question: "Can I substitute fresh mozzarella with other cheeses?",
      answer:
        "While fresh mozzarella is traditional and provides the signature creamy texture, you can experiment with burrata for an even creamier experience or bocconcini for smaller bite-sized pieces. Avoid aged or hard cheeses as they will alter the salad’s delicate balance.",
    },
    {
      question: "How should I store leftover Caprese Salad?",
      answer:
        "Caprese Salad is best enjoyed fresh. If you have leftovers, store them in an airtight container in the refrigerator for up to 1 day. To maintain freshness, keep the dressing separate and add it just before serving to prevent sogginess.",
    },
    {
      question: "Is it necessary to use balsamic vinegar in the salad?",
      answer:
        "Balsamic vinegar adds a sweet and tangy depth that beautifully complements the creamy mozzarella and fresh tomatoes. However, if you prefer a lighter taste, you can omit it or substitute with a drizzle of aged balsamic glaze for a more concentrated flavor.",
    },
    {
      question: "Can Caprese Salad be made vegan or dairy-free?",
      answer:
        "Yes! To make a vegan or dairy-free version, substitute fresh mozzarella with plant-based cheese alternatives such as cashew-based mozzarella or tofu marinated in lemon juice and herbs. The rest of the ingredients remain the same, preserving the fresh and vibrant flavors.",
    },
    {
      question: "What wine pairs well with Caprese Salad?",
      answer:
        "A crisp, light white wine like Pinot Grigio or Sauvignon Blanc pairs wonderfully with Caprese Salad. Their acidity complements the tomatoes and cuts through the richness of the mozzarella, enhancing the overall dining experience.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Caprese Salad"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 10m | Cook: 0m
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

  const editorial = (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          About this Recipe
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Caprese Salad is a classic Italian dish that celebrates the simplicity
            and freshness of its ingredients. Originating from the island of Capri,
            this salad is a vibrant combination of ripe tomatoes, creamy fresh
            mozzarella, and aromatic basil leaves, all drizzled with high-quality
            extra virgin olive oil and a touch of balsamic vinegar. Its colors
            represent the Italian flag, making it not only delicious but also
            visually appealing.
          </p>
          <p>
            This salad is perfect as a light appetizer or a refreshing side dish,
            especially during the summer months when tomatoes and basil are at their
            peak. The balance of flavors and textures—from the juicy tomatoes to the
            silky mozzarella and fragrant basil—makes Caprese Salad a timeless and
            beloved recipe worldwide.
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
              Wash the tomatoes and basil leaves thoroughly. Slice the tomatoes and
              fresh mozzarella into even, approximately 1/4-inch thick slices to
              ensure balanced layering.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Layer the Salad
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              On a serving platter or individual plates, alternate slices of tomato
              and mozzarella, slightly overlapping each piece. Tuck fresh basil
              leaves between the layers for aroma and color.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Season and Dress
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Drizzle extra virgin olive oil and balsamic vinegar evenly over the
              salad. Sprinkle sea salt and freshly ground black pepper to taste.
              Optionally, add minced garlic or pine nuts for extra flavor and texture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve Fresh
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve immediately at room temperature to enjoy the full flavors and
              textures. Caprese Salad pairs beautifully with crusty bread or as a
              side to grilled meats and seafood.
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
            Use the freshest mozzarella you can find, ideally from a local cheese
            shop or fresh mozzarella packed in water for the best texture and flavor.
          </li>
          <li>
            Let the salad sit for 5-10 minutes after dressing to allow the flavors to
            meld, but avoid letting it sit too long to prevent sogginess.
          </li>
          <li>
            For a beautiful presentation, arrange the slices in a circular pattern or
            in rows, alternating tomato and mozzarella.
          </li>
          <li>
            If using balsamic vinegar, consider reducing it to a glaze for a sweeter,
            thicker drizzle that adds visual appeal.
          </li>
          <li>
            Experiment with adding a sprinkle of flaky sea salt like Maldon for a
            delicate crunch.
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

