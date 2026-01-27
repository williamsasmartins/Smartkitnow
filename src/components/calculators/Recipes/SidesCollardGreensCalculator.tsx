import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function SidesCollardGreensCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/BrazilianStyle%20Collard%20Greens%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6622"
  );

  // --- DATA ---
  const title = "Brazilian-Style Collard Greens";
  const description = "Traditionally served with feijoada, flash-fried with garlic.";

  // INGREDIENTS
  const ingredients = [
    { name: "Collard Greens (chopped)", baseAmount: 500, unit: "g" },
    { name: "Garlic (minced)", baseAmount: 4, unit: "cloves" },
    { name: "Olive Oil", baseAmount: 3, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Red Pepper Flakes", baseAmount: 0.25, unit: "tsp" },
    { name: "Lemon Juice", baseAmount: 1, unit: "tbsp" },
    { name: "Onion (finely chopped)", baseAmount: 0.5, unit: "medium" },
    { name: "Bacon (optional, diced)", baseAmount: 100, unit: "g" },
    { name: "Water", baseAmount: 50, unit: "ml" },
    { name: "Olive Oil for frying", baseAmount: 2, unit: "tbsp" },
    { name: "Fresh Parsley (chopped)", baseAmount: 2, unit: "tbsp" },
    { name: "Smoked Paprika", baseAmount: 0.5, unit: "tsp" },
  ];

  // Nutrition estimates per 4 servings (approximate)
  const nutrition = {
    calories: "220",
    protein: "8g",
    carbs: "10g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes Brazilian-style collard greens different from other preparations?",
      answer:
        "Brazilian-style collard greens are typically thinly sliced and flash-fried with garlic and olive oil, often served alongside feijoada. This method preserves their vibrant color and imparts a slightly crispy texture, distinguishing them from the slow-cooked or steamed versions common in other cuisines.",
    },
    {
      question: "Can I substitute collard greens with other leafy greens?",
      answer:
        "While collard greens have a unique texture and slightly bitter flavor, you can substitute them with kale or Swiss chard. However, cooking times and flavor profiles will vary, so adjust seasoning and cooking accordingly.",
    },
    {
      question: "Is it necessary to add bacon to this recipe?",
      answer:
        "Bacon adds a smoky, savory depth to the dish, but it is optional. For a vegetarian version, simply omit the bacon and consider adding a splash of smoked paprika or liquid smoke to replicate some of the smoky flavor.",
    },
    {
      question: "How do I properly clean and prepare collard greens?",
      answer:
        "Collard greens often have grit and dirt trapped in their leaves. Rinse each leaf thoroughly under cold running water, then soak them in a bowl of cold water for a few minutes. Remove the tough stems by slicing them out before chopping the leaves thinly.",
    },
    {
      question: "Can I prepare this dish ahead of time?",
      answer:
        "It's best served fresh to retain its vibrant color and texture. However, you can prepare the greens and garlic mixture ahead and store it refrigerated for up to 24 hours. Reheat gently in a skillet with a little olive oil before serving.",
    },
    {
      question: "What dishes pair well with Brazilian-style collard greens?",
      answer:
        "Traditionally, these collard greens are served with feijoada, a rich black bean and pork stew. They also complement grilled meats, rice dishes, and other hearty Brazilian fare, providing a fresh, garlicky contrast.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);
  const recipeJsonLd = getRecipeSchema({
    name: title,
    description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT10M",
    totalTime: "PT30M",
    recipeYield: `${servings} portions`,
    recipeCategory: "Side Dish",
    recipeCuisine: "Brazilian",
    keywords: "couve a mineira, brazilian collard greens, flash-fried greens, garlic collard greens, feijoada side, healthy side",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Wash, de-stem, and thinly slice collard greens into ribbons.",
      "Sauté diced bacon (if using) in olive oil until crispy.",
      "Add onion and garlic to the pan and cook until fragrant.",
      "Add greens and a splash of water, then flash-fry over high heat for 3-5 minutes.",
      "Season with salt, pepper, paprika, and lemon juice; serve immediately."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian-Style Collard Greens"
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
            Brazilian-Style Collard Greens, or "Couve à Mineira," is a beloved side dish
            in Brazil, especially popular as an accompaniment to feijoada, the country's
            iconic black bean and pork stew. This recipe features thinly sliced collard
            greens flash-fried with garlic and olive oil, resulting in a vibrant,
            flavorful, and slightly crispy vegetable dish that balances the richness of
            heavier mains.
          </p>
          <p>
            The tradition of preparing collard greens in this manner dates back to
            Brazilian home kitchens, where simplicity and bold flavors come together.
            Collard greens are a staple green in Brazil, prized for their hearty texture
            and nutritional benefits. This preparation method preserves their bright
            color and delivers a garlicky punch that complements a variety of dishes.
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
              Prepare the Collard Greens
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the collard greens thoroughly under cold water to remove any grit.
              Remove the tough stems by slicing along each leaf's rib, then stack and
              roll the leaves tightly. Slice into very thin ribbons (chiffonade) and set
              aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Bacon (Optional)
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large skillet over medium heat, cook the diced bacon until crispy.
              Remove with a slotted spoon and set aside, leaving the rendered fat in the
              pan.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté Aromatics
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add olive oil to the skillet (or use the bacon fat if prepared). Sauté the
              finely chopped onion until translucent, then add the minced garlic and
              cook until fragrant, about 1-2 minutes. Be careful not to burn the garlic.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Flash-Fry the Collard Greens
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Increase the heat to medium-high and add the sliced collard greens to the
              skillet. Toss quickly to coat with the oil and aromatics. Add water to
              help steam and soften the greens slightly. Cook for 3-5 minutes until
              tender but still bright green.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Season and Finish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Season with salt, black pepper, red pepper flakes, and smoked paprika.
              Stir in the cooked bacon (if using) and fresh parsley. Finish with a
              squeeze of fresh lemon juice for brightness. Serve immediately.
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
            Use a sharp knife to slice the collard greens thinly; this ensures even
            cooking and a tender texture.
          </li>
          <li>
            Flash-frying over high heat keeps the greens vibrant and slightly crisp,
            avoiding a mushy texture.
          </li>
          <li>
            Adding a splash of water while cooking helps steam the greens gently,
            softening them without losing color.
          </li>
          <li>
            For a smoky flavor without bacon, try adding smoked paprika or a drop of
            liquid smoke.
          </li>
          <li>
            Serve immediately after cooking to enjoy the best texture and flavor.
          </li>
          <li>
            Leftovers can be reheated gently in a skillet with a little olive oil to
            refresh the flavors.
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
              href="https://en.wikipedia.org/wiki/Feijoada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Feijoada - Brazil's National Dish
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/collard-greens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Collard Greens Overview
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/brazilian-collard-greens-couve-a-mineira-recipe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: Brazilian Collard Greens Recipe
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
      jsonLd={[faqJsonLd, recipeJsonLd]}
      hideLegalDisclaimer={true}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}