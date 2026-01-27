import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function BrazilianStyleCollardGreensCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/BrazilianStyle%20Collard%20Greens%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=697"
  );

  // --- DATA ---
  const title = "Brazilian-Style Collard Greens";
  const description = "Finely shredded kale or collards sautéed with garlic and oil.";

  // INGREDIENTS
  const ingredients = [
    { name: "Collard greens (washed and finely shredded)", baseAmount: 500, unit: "g" },
    { name: "Garlic cloves (minced)", baseAmount: 4, unit: "cloves" },
    { name: "Olive oil", baseAmount: 3, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper (freshly ground)", baseAmount: 0.5, unit: "tsp" },
    { name: "Lemon juice (freshly squeezed)", baseAmount: 1, unit: "tbsp" },
    { name: "Red pepper flakes (optional)", baseAmount: 0.25, unit: "tsp" },
    { name: "Onion (small, finely chopped)", baseAmount: 1, unit: "small" },
    { name: "Water or vegetable broth", baseAmount: 60, unit: "ml" },
    { name: "Bacon (optional, diced)", baseAmount: 100, unit: "g" },
    { name: "Olive oil for bacon (if using)", baseAmount: 1, unit: "tbsp" },
    { name: "Fresh parsley (chopped, for garnish)", baseAmount: 2, unit: "tbsp" },
    { name: "Sugar (optional, to balance bitterness)", baseAmount: 0.5, unit: "tsp" },
  ];

  // Nutrition estimates per 4 servings (approximate)
  const nutrition = {
    calories: "180",
    protein: "8g",
    carbs: "10g",
    fat: "12g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What are the best greens to use for Brazilian-style collard greens?",
      answer:
        "Traditionally, collard greens are used in Brazilian cuisine for this dish due to their sturdy texture and slightly bitter flavor. You can also substitute with kale or other hearty leafy greens if collards are unavailable, but the texture and taste will vary slightly.",
    },
    {
      question: "Can I make this recipe vegan or vegetarian?",
      answer:
        "Absolutely! To make it vegan or vegetarian, simply omit the bacon. You can enhance the flavor by adding smoked paprika or liquid smoke to mimic the smoky taste. Using vegetable broth instead of water also adds depth.",
    },
    {
      question: "How do I prevent the collard greens from becoming too bitter?",
      answer:
        "Collard greens naturally have some bitterness. To balance this, finely shred the greens and sauté them with garlic and a pinch of sugar. Adding a splash of lemon juice at the end brightens the flavor and reduces bitterness.",
    },
    {
      question: "Can I prepare this dish ahead of time?",
      answer:
        "Yes, Brazilian-style collard greens can be made a day in advance and reheated gently on the stove. The flavors often deepen overnight. Store in an airtight container in the refrigerator for up to 3 days.",
    },
    {
      question: "What dishes pair well with Brazilian-style collard greens?",
      answer:
        "This dish is a classic side for Brazilian feijoada (black bean stew) and grilled meats. It also pairs wonderfully with rice, beans, and roasted or fried plantains for a complete and authentic Brazilian meal.",
    },
    {
      question: "How finely should I shred the collard greens?",
      answer:
        "Shred the collard greens into thin ribbons, about 1/4 inch wide or less. This ensures even cooking and a tender texture without large chewy pieces, which is characteristic of the Brazilian preparation style.",
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
    keywords: "brazilian collard greens, couve a mineira, sautéed kale, brazilian side dish, feijoada side, garlic collard greens",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit === "small" ? "" : i.unit} ${i.name}`),
    recipeInstructions: [
      "Remove stems from collard greens and shred leaves finely into thin ribbons.",
      "Sauté diced bacon in olive oil until crispy; remove and set aside.",
      "Sauté minced garlic and onion in the skillet until fragrant.",
      "Add shredded greens and broth/water; cover and cook for 5-7 minutes until tender.",
      "Season with salt, pepper, sugar, and lemon juice; stir in bacon and parsley."
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
            Brazilian-Style Collard Greens, or "Couve à Mineira," is a beloved side
            dish in Brazilian cuisine, known for its vibrant green color, tender
            texture, and rich garlic flavor. This recipe features finely shredded
            collard greens sautéed with garlic and olive oil, often enhanced with
            a touch of bacon for smoky depth. It’s a simple yet flavorful dish that
            perfectly complements hearty mains like feijoada or grilled meats.
          </p>
          <p>
            The tradition of sautéing collard greens in Brazil traces back to the
            country's Portuguese colonial roots, where leafy greens were a staple
            for sustenance and nutrition. Over time, the dish evolved with local
            ingredients and cooking techniques, becoming a symbol of Brazilian
            home cooking and comfort food. Its preparation emphasizes quick cooking
            to preserve the greens' vibrant color and nutrients while infusing
            them with aromatic garlic and subtle seasoning.
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
              Remove the tough stems from the collard greens and finely shred the
              leaves into thin ribbons, about 1/4 inch wide. Rinse thoroughly under
              cold water and drain well.
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
              In a large skillet, heat 1 tablespoon of olive oil over medium heat.
              Add diced bacon and cook until crispy and browned. Remove bacon with a
              slotted spoon and set aside, leaving the rendered fat in the pan.
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
              Add the minced garlic and finely chopped onion to the skillet. Sauté
              over medium heat until fragrant and translucent, about 2-3 minutes,
              being careful not to burn the garlic.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add the Collard Greens
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the shredded collard greens to the skillet. Stir well to coat with
              the garlic and onion mixture. Pour in the water or vegetable broth,
              cover, and cook for 5-7 minutes, stirring occasionally, until the
              greens are tender but still vibrant.
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
              Remove the lid and stir in salt, black pepper, red pepper flakes (if
              using), and sugar to balance bitterness. Return the cooked bacon to
              the pan and mix well. Finish with a squeeze of fresh lemon juice and
              sprinkle chopped parsley on top before serving.
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
            Use fresh, firm collard greens for the best texture and flavor. Wilted
            or yellowing leaves will affect the dish's quality.
          </li>
          <li>
            Finely shredding the greens ensures they cook evenly and absorb the
            garlic-infused oil beautifully.
          </li>
          <li>
            If you prefer a smoky flavor without bacon, try adding smoked paprika or
            a dash of liquid smoke.
          </li>
          <li>
            Avoid overcooking the greens to preserve their vibrant color and
            nutrients; they should be tender but still bright green.
          </li>
          <li>
            Serve immediately for best taste, but leftovers reheat well and develop
            deeper flavors.
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
              href="https://www.tasteatlas.com/couve-a-mineira"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              TasteAtlas: Couve à Mineira (Brazilian Collard Greens)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.brazil.org.za/brazilian-food.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Brazil.org.za: Brazilian Food and Cuisine
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