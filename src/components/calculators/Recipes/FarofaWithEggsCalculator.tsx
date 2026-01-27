import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function FarofaWithEggsCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Farofa%20with%20Eggs%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=7885"
  );

  // --- DATA ---
  const title = "Farofa with Eggs";
  const description = "Moist version of farofa featuring scrambled eggs and herbs.";

  // INGREDIENTS
  const ingredients = [
    { name: "Cassava Flour (Farinha de Mandioca)", baseAmount: 250, unit: "g" },
    { name: "Eggs", baseAmount: 4, unit: "large" },
    { name: "Butter", baseAmount: 3, unit: "tbsp" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 2, unit: "cloves" },
    { name: "Green onions (scallions), chopped", baseAmount: 3, unit: "stalks" },
    { name: "Fresh parsley, chopped", baseAmount: 2, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Olive oil", baseAmount: 1, unit: "tbsp" },
    { name: "Optional: Bacon, diced", baseAmount: 100, unit: "g" },
    { name: "Optional: Red bell pepper, diced", baseAmount: 0.5, unit: "medium" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "320",
    protein: "12g",
    carbs: "30g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    servings === 1 && base < 1
      ? (base * (servings / 4)).toFixed(2).replace(/\.?0+$/, "")
      : (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is farofa and how is it traditionally served?",
      answer:
        "Farofa is a traditional Brazilian side dish made primarily from toasted cassava flour. It is often served alongside meats, rice, beans, and stews to add texture and flavor. The toasted flour has a slightly nutty taste and can be mixed with various ingredients such as eggs, bacon, onions, and herbs to enhance its flavor.",
    },
    {
      question: "Can I substitute cassava flour with another type of flour?",
      answer:
        "Cassava flour is unique in texture and flavor, providing the characteristic crunch and earthiness to farofa. While you can experiment with alternatives like cornmeal or breadcrumbs, the taste and texture will differ significantly. For an authentic farofa experience, cassava flour is recommended.",
    },
    {
      question: "How do I prevent the eggs from overcooking in the farofa?",
      answer:
        "To keep the eggs moist and tender, scramble them gently over medium-low heat and remove them from the pan as soon as they set but are still soft. Then, fold them into the toasted cassava flour mixture off the heat. This prevents the eggs from drying out and keeps the farofa moist.",
    },
    {
      question: "Can I make farofa with eggs vegan or vegetarian?",
      answer:
        "Yes! To make a vegan version, omit the eggs and replace butter with plant-based oils like olive oil or coconut oil. You can add sautéed mushrooms, tofu scramble, or tempeh for protein and texture. Also, ensure any optional ingredients like bacon are omitted or substituted with vegan alternatives.",
    },
    {
      question: "How should I store leftover farofa with eggs?",
      answer:
        "Store leftover farofa in an airtight container in the refrigerator for up to 2 days. Because of the eggs, it’s best consumed fresh or within this timeframe. Reheat gently in a pan over low heat to avoid drying it out, adding a splash of water or oil if needed.",
    },
    {
      question: "What dishes pair well with farofa with eggs?",
      answer:
        "Farofa with eggs pairs wonderfully with grilled meats such as steak, chicken, or pork. It also complements Brazilian staples like feijoada (black bean stew), barbecued sausages, and rice and beans. Its crunchy texture and savory flavor add contrast and depth to many dishes.",
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
    keywords: "farofa com ovos, egg farofa, brazilian side dish, toasted cassava flour, moist farofa, traditional recipe",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Dice onion, garlic, and herbs. Lightly beat eggs with salt and pepper.",
      "Sauté onions and garlic in butter/oil (and bacon if using) until soft.",
      "Add cassava flour and toast over medium-low heat for 5-7 minutes until golden.",
      "In a separate pan, gently scramble eggs until just set but still moist.",
      "Fold scrambled eggs and fresh herbs into the toasted flour mixture; serve immediately."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Farofa with Eggs"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Farofa with Eggs is a beloved Brazilian side dish that combines the nutty crunch of toasted cassava flour with the rich, moist texture of scrambled eggs. This version elevates the traditional farofa by incorporating fresh herbs, sautéed onions, and optional ingredients like bacon or bell peppers, creating a flavorful accompaniment perfect for grilled meats, stews, and rice dishes.
          </p>
          <p>
            Originating from Brazil’s diverse culinary heritage, farofa has roots in indigenous cassava preparation methods and African influences. The addition of eggs adds protein and moisture, making it a hearty and satisfying dish. Farofa is a staple at Brazilian barbecues (churrascos) and family meals, cherished for its versatility and comforting taste.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Finely chop the onion, garlic, green onions, parsley, and optional bell pepper. If using bacon, dice it into small pieces. Crack the eggs into a bowl and lightly beat them with a pinch of salt and pepper.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook Bacon and Vegetables</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large skillet, heat the olive oil over medium heat. Add the diced bacon and cook until crispy. Remove bacon and set aside, leaving the rendered fat in the pan. Add butter, then sauté onion, garlic, and bell pepper (if using) until soft and fragrant, about 5 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Toast Cassava Flour</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Lower the heat to medium-low and add the cassava flour to the skillet. Stir continuously to toast the flour evenly, about 5-7 minutes, until it turns golden and aromatic. Be careful not to burn it.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Scramble the Eggs</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a separate non-stick pan, melt a small amount of butter over medium-low heat. Pour in the beaten eggs and gently scramble until just set but still moist. Remove from heat immediately to avoid overcooking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Combine and Finish</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the scrambled eggs, cooked bacon, green onions, and parsley to the toasted cassava flour mixture. Stir gently to combine and warm through. Season with salt and pepper to taste. Serve immediately as a flavorful side dish.
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
            Use fresh cassava flour for the best flavor and texture; store it in an airtight container to keep it crisp.
          </li>
          <li>
            Toast the cassava flour slowly over medium-low heat to avoid burning and to develop a rich, nutty aroma.
          </li>
          <li>
            For extra flavor, add diced bacon or smoked sausage, but keep it optional for a vegetarian-friendly dish.
          </li>
          <li>
            Scramble the eggs gently and remove them from heat while still slightly runny to keep the farofa moist and tender.
          </li>
          <li>
            Garnish with fresh herbs like parsley and green onions to add brightness and freshness.
          </li>
          <li>
            Serve farofa warm as a side to grilled meats, stews, or rice dishes to add texture and flavor contrast.
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
              href="https://en.wikipedia.org/wiki/Farofa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Farofa
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.saveur.com/article/Recipes/Brazilian-Farofa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Brazilian Farofa Recipe
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