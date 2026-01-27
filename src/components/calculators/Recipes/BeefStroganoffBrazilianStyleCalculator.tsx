import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

import { getRecipeSchema } from "@/components/RecipeSchema";

export default function BeefStroganoffBrazilianStyleCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/BrazilianStyle%20Beef%20Stroganoff%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=988"
  );

  // --- DATA ---
  const title = "Brazilian-Style Beef Stroganoff";
  const description = "Creamy beef stew with mushrooms, corn, and heavy cream.";

  // INGREDIENTS
  const ingredients = [
    { name: "Beef sirloin, thinly sliced", baseAmount: 500, unit: "g" },
    { name: "White mushrooms, sliced", baseAmount: 200, unit: "g" },
    { name: "Yellow onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Tomato ketchup", baseAmount: 4, unit: "tbsp" },
    { name: "Dijon mustard", baseAmount: 1, unit: "tbsp" },
    { name: "Heavy cream", baseAmount: 200, unit: "ml" },
    { name: "Corn kernels (fresh or canned)", baseAmount: 100, unit: "g" },
    { name: "Butter", baseAmount: 2, unit: "tbsp" },
    { name: "Vegetable oil", baseAmount: 1, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper, freshly ground", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh parsley, chopped (for garnish)", baseAmount: 2, unit: "tbsp" },
    { name: "Cooked white rice (to serve)", baseAmount: 4, unit: "cups" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "480",
    protein: "38g",
    carbs: "18g",
    fat: "28g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cut of beef is best for Brazilian-Style Beef Stroganoff?",
      answer:
        "The best cut for this recipe is tender and quick-cooking, such as sirloin or filet mignon. These cuts remain juicy and tender when sliced thinly and cooked briefly, which is essential for the creamy texture of the stroganoff.",
    },
    {
      question: "Can I substitute heavy cream with a lighter alternative?",
      answer:
        "Yes, you can use half-and-half or a mixture of milk and sour cream as a lighter alternative. However, heavy cream provides the rich and silky texture characteristic of Brazilian stroganoff, so substitutes may slightly alter the creaminess.",
    },
    {
      question: "Why does Brazilian stroganoff include ketchup and mustard?",
      answer:
        "Ketchup and mustard add a subtle tangy sweetness and depth of flavor that differentiate Brazilian stroganoff from the traditional Russian version. They balance the creaminess and enrich the sauce with a unique savory profile.",
    },
    {
      question: "Is corn a traditional ingredient in Brazilian beef stroganoff?",
      answer:
        "Yes, corn kernels are commonly added in Brazilian recipes to provide a slight sweetness and texture contrast. It’s a distinctive ingredient that adds brightness and complements the creamy sauce.",
    },
    {
      question: "How should I serve Brazilian-Style Beef Stroganoff?",
      answer:
        "Traditionally, it is served over plain white rice, which soaks up the creamy sauce beautifully. Some also enjoy it with shoestring potatoes on the side for added crunch.",
    },
    {
      question: "Can I prepare this dish ahead of time?",
      answer:
        "While you can prepare the sauce and beef ahead, it’s best to combine and cook them just before serving to maintain the texture and freshness. Reheating may cause the cream to separate slightly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const recipeJsonLd = getRecipeSchema({
    name: title,
    description: description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT10M",
    totalTime: "PT30M",
    recipeYield: "4 servings",
    recipeCategory: "Main Course",
    recipeCuisine: "Brazilian",
    keywords: "beef stroganoff, brazilian stroganoff, creamy beef stew, comfort food, brazilian recipes",
    recipeIngredient: ingredients.map(ing => `${ing.baseAmount}${ing.unit} ${ing.name}`),
    recipeInstructions: [
      "Thinly slice the beef sirloin against the grain for tenderness. Clean and slice the mushrooms, finely chop the onion, and mince the garlic cloves.",
      "Heat the vegetable oil and 1 tablespoon of butter in a large pan over medium heat. Add the chopped onion and garlic, cooking until translucent and fragrant. Add the sliced mushrooms and cook until they release their moisture and begin to brown.",
      "Push the mushroom mixture to the side of the pan and add the remaining butter. Increase heat to medium-high and add the beef slices in a single layer. Sear quickly until browned but still tender, about 2-3 minutes per side.",
      "Stir in the ketchup, Dijon mustard, and corn kernels. Mix well to combine all flavors. Reduce heat to medium-low and pour in the heavy cream, stirring gently to create a smooth sauce.",
      "Let the stroganoff simmer gently for 5 minutes, allowing the sauce to thicken slightly and the flavors to meld. Garnish with fresh chopped parsley and serve immediately over hot cooked white rice."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian-Style Beef Stroganoff"
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
            Brazilian-Style Beef Stroganoff is a beloved comfort dish that
            combines tender strips of beef with a creamy, tangy sauce enriched
            by mushrooms, corn, and a unique blend of ketchup and mustard. This
            dish is a staple in Brazilian homes and restaurants, cherished for
            its rich flavors and satisfying texture. Served traditionally over
            white rice, it offers a perfect balance of savory, creamy, and
            slightly sweet notes.
          </p>
          <p>
            The origins of Brazilian stroganoff trace back to adaptations of the
            classic Russian Beef Stroganoff, introduced to Brazil by European
            immigrants. Over time, Brazilian cooks infused local tastes and
            ingredients, such as corn and tomato ketchup, creating a distinct
            version that has become a national favorite. Its quick preparation
            and comforting flavors make it a go-to recipe for family meals and
            special occasions alike.
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
              Prepare Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Thinly slice the beef sirloin against the grain for tenderness.
              Clean and slice the mushrooms, finely chop the onion, and mince
              the garlic cloves. Measure out the ketchup, mustard, cream, and
              corn kernels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté Aromatics and Mushrooms
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat the vegetable oil and 1 tablespoon of butter in a large pan
              over medium heat. Add the chopped onion and garlic, cooking until
              translucent and fragrant. Add the sliced mushrooms and cook until
              they release their moisture and begin to brown.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Beef
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Push the mushroom mixture to the side of the pan and add the
              remaining butter. Increase heat to medium-high and add the beef
              slices in a single layer. Sear quickly until browned but still
              tender, about 2-3 minutes per side.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Sauce Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the ketchup, Dijon mustard, and corn kernels. Mix well to
              combine all flavors. Reduce heat to medium-low and pour in the
              heavy cream, stirring gently to create a smooth sauce. Season
              with salt and freshly ground black pepper to taste.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Simmer and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Let the stroganoff simmer gently for 5 minutes, allowing the sauce
              to thicken slightly and the flavors to meld. Garnish with fresh
              chopped parsley and serve immediately over hot cooked white rice.
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
            For the best texture, slice the beef thinly and cook it quickly over
            high heat to avoid toughness.
          </li>
          <li>
            Use fresh mushrooms for a more pronounced earthy flavor; button or
            cremini mushrooms work well.
          </li>
          <li>
            Adjust the amount of ketchup and mustard to your taste, but keep the
            balance to preserve the authentic Brazilian flavor.
          </li>
          <li>
            If you prefer a thicker sauce, simmer a bit longer or add a small
            slurry of cornstarch mixed with water.
          </li>
          <li>
            Serve immediately after cooking to enjoy the creamy texture at its
            best; reheating may cause the cream to separate.
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
              href="https://en.wikipedia.org/wiki/Beef_stroganoff"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Beef Stroganoff
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.saveur.com/article/Recipes/Brazilian-Beef-Stroganoff/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Brazilian Beef Stroganoff Recipe
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
