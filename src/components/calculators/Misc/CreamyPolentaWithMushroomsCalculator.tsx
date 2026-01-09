import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CreamyPolentaWithMushroomsCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Creamy%20Polenta%20with%20Mushrooms%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2237"
  );

  // --- DATA ---
  const title = "Creamy Polenta with Mushrooms";
  const description = "Smooth cornmeal polenta topped with sautéed mushrooms.";

  // INGREDIENTS
  const ingredients = [
    { name: "Polenta (cornmeal)", baseAmount: 500, unit: "g" },
    { name: "Mixed mushrooms (cremini, shiitake, oyster)", baseAmount: 300, unit: "g" },
    { name: "Vegetable broth", baseAmount: 1.2, unit: "L" },
    { name: "Heavy cream", baseAmount: 200, unit: "ml" },
    { name: "Parmesan cheese, grated", baseAmount: 100, unit: "g" },
    { name: "Unsalted butter", baseAmount: 50, unit: "g" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Fresh thyme leaves", baseAmount: 2, unit: "tsp" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black pepper, freshly ground", baseAmount: 1, unit: "tsp" },
    { name: "Fresh parsley, chopped (for garnish)", baseAmount: 2, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "12g",
    carbs: "45g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of polenta is best for this recipe?",
      answer:
        "For the creamiest texture, use medium or coarse ground polenta. Instant polenta can be used for convenience but may result in a less creamy consistency.",
    },
    {
      question: "Can I use other types of mushrooms?",
      answer:
        "Absolutely! Feel free to use button mushrooms, portobello, or chanterelles. A mix of mushrooms adds depth of flavor and texture.",
    },
    {
      question: "How do I store leftovers?",
      answer:
        "Store leftover polenta in an airtight container in the refrigerator for up to 3 days. Reheat gently with a splash of broth or cream to restore creaminess.",
    },
    {
      question: "Is this recipe suitable for vegetarians?",
      answer:
        "Yes, this recipe is vegetarian-friendly. To make it vegan, substitute butter and Parmesan with plant-based alternatives.",
    },
    {
      question: "Can I prepare polenta ahead of time?",
      answer:
        "You can prepare polenta ahead and reheat it with a bit of broth or cream. However, freshly made polenta has the best texture and flavor.",
    },
    {
      question: "What wine pairs well with creamy polenta and mushrooms?",
      answer:
        "A medium-bodied white wine like Chardonnay or a light red such as Pinot Noir complements the earthy mushrooms and creamy polenta beautifully.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Creamy Polenta with Mushrooms"
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
            Creamy Polenta with Mushrooms is a comforting Italian-inspired dish that
            combines the smooth, velvety texture of slow-cooked cornmeal with the
            earthy richness of sautéed mushrooms. This recipe is perfect for a cozy
            dinner, offering a luxurious mouthfeel and deep umami flavors that
            satisfy both vegetarians and meat-eaters alike.
          </p>
          <p>
            Polenta has been a staple in Northern Italian cuisine for centuries,
            originally a humble peasant food made from boiled cornmeal. Over time,
            it evolved into a versatile base for many dishes, often enriched with
            butter, cream, and cheese. The addition of mushrooms brings a forest
            aroma and hearty texture, making this dish a beloved classic in
            contemporary kitchens worldwide.
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
              Prepare the Broth and Polenta
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large saucepan, bring the vegetable broth to a gentle boil. Slowly
              whisk in the polenta to avoid lumps. Reduce heat to low and cook,
              stirring frequently, until the polenta thickens and becomes creamy,
              about 25-30 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté the Mushrooms
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              While the polenta cooks, heat olive oil and half the butter in a large
              skillet over medium heat. Add minced garlic and sauté until fragrant.
              Add mushrooms and thyme, cooking until golden and tender, about 8-10
              minutes. Season with salt and pepper.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Enrich the Polenta
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir the remaining butter, heavy cream, and grated Parmesan cheese into
              the polenta. Adjust seasoning with salt and pepper to taste. Keep warm
              on low heat, stirring occasionally.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spoon the creamy polenta onto plates and top generously with the sautéed
              mushrooms. Garnish with chopped fresh parsley and an extra sprinkle of
              Parmesan if desired. Serve immediately for best texture and flavor.
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
            Use a heavy-bottomed pot to cook polenta evenly and prevent scorching.
          </li>
          <li>
            Stir polenta frequently during cooking to achieve a smooth, creamy
            texture.
          </li>
          <li>
            For extra depth, deglaze the mushroom pan with a splash of white wine or
            sherry before finishing.
          </li>
          <li>
            If polenta thickens too much after resting, loosen it with a bit of warm
            broth or cream when reheating.
          </li>
          <li>
            Experiment with different mushroom varieties to customize flavor and
            texture.
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