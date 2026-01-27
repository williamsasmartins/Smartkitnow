import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

import { getRecipeSchema } from "@/components/RecipeSchema";

export default function BrazilianWhiteRiceCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Rice%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9132"
  );

  // --- DATA ---
  const title = "Brazilian Rice";
  const description = "Fluffy long-grain white rice sautéed with garlic and onions.";

  // INGREDIENTS
  const ingredients = [
    { name: "Long-grain white rice", baseAmount: 500, unit: "g" },
    { name: "Water", baseAmount: 750, unit: "ml" },
    { name: "Vegetable oil", baseAmount: 2, unit: "tbsp" },
    { name: "Garlic cloves, minced", baseAmount: 4, unit: "pcs" },
    { name: "Yellow onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Bay leaf", baseAmount: 1, unit: "leaf" },
    { name: "Fresh parsley, chopped", baseAmount: 2, unit: "tbsp" },
    { name: "Green peas (optional)", baseAmount: 100, unit: "g" },
    { name: "Carrot, diced (optional)", baseAmount: 1, unit: "medium" },
    { name: "Chicken broth (optional, substitute water)", baseAmount: 750, unit: "ml" },
    { name: "Butter (optional)", baseAmount: 1, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "210",
    protein: "4g",
    carbs: "45g",
    fat: "3g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of rice is best for Brazilian rice?",
      answer:
        "Long-grain white rice is preferred for Brazilian rice because it cooks up fluffy and separate, which is characteristic of the dish. Avoid short-grain or sticky rice varieties as they tend to clump together.",
    },
    {
      question: "Can I use broth instead of water?",
      answer:
        "Yes, substituting water with chicken or vegetable broth adds extra flavor and richness to the rice, making it more savory and aromatic. Just use the same quantity as water.",
    },
    {
      question: "How do I prevent the rice from sticking or burning?",
      answer:
        "Sautéing the rice in oil before adding water helps coat the grains and reduces sticking. Also, cook on low heat with a tight-fitting lid and avoid stirring once the water is added to prevent breaking the grains.",
    },
    {
      question: "Can I add vegetables to Brazilian rice?",
      answer:
        "Absolutely! Adding diced carrots, green peas, or corn is common and adds color, texture, and nutrition. Add them after sautéing the onions and garlic so they cook evenly with the rice.",
    },
    {
      question: "How long can I store leftover Brazilian rice?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 3-4 days. Reheat gently with a splash of water to restore moisture and fluffiness.",
    },
    {
      question: "Is Brazilian rice gluten-free?",
      answer:
        "Yes, Brazilian rice is naturally gluten-free as it primarily consists of rice, water, oil, and seasonings. Just ensure any added broth or ingredients are gluten-free.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const recipeJsonLd = getRecipeSchema({
    name: title,
    description: description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT18M",
    totalTime: "PT38M",
    recipeYield: "4 servings",
    recipeCategory: "Side Dish",
    recipeCuisine: "Brazilian",
    keywords: "brazilian rice, arroz branco, garlic rice, fluffy rice, brazilian food, side dish",
    recipeIngredient: ingredients.map(ing => `${ing.baseAmount}${ing.unit} ${ing.name}`),
    recipeInstructions: [
      "Rinse the long-grain white rice under cold water until the water runs clear to remove excess starch. Drain well and set aside.",
      "Heat the vegetable oil in a medium saucepan over medium heat. Add the minced garlic and chopped onion, sautéing until fragrant and translucent, about 3-4 minutes.",
      "Add the drained rice to the saucepan and stir continuously for 2-3 minutes until the rice is well coated with oil and slightly toasted.",
      "Pour in the water or broth, add salt and bay leaf, and stir once to combine. Bring to a boil over high heat.",
      "Once boiling, reduce heat to low, cover with a tight-fitting lid, and simmer for 15-18 minutes until the liquid is absorbed and rice is tender. Avoid lifting the lid during cooking.",
      "Remove from heat and let the rice rest, covered, for 5 minutes. Remove the bay leaf, then fluff the rice gently with a fork. Stir in chopped parsley and optional butter for extra flavor."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Rice"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 18m
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
            Brazilian Rice, or "Arroz Branco," is a staple side dish in Brazilian
            cuisine known for its fluffy texture and subtle savory flavor. This
            recipe highlights the traditional method of sautéing rice with garlic
            and onions before simmering it in water or broth, resulting in a
            perfectly cooked, aromatic rice that complements a wide variety of
            Brazilian meals.
          </p>
          <p>
            The origins of Brazilian rice trace back to Portuguese influences,
            combined with indigenous and African culinary traditions. Over time,
            it has evolved into a beloved everyday dish across Brazil, often
            served alongside beans, meats, and vegetables. Its simplicity and
            versatility make it a foundational element in Brazilian home cooking
            and festive occasions alike.
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
              Rinse and Prepare Rice
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the long-grain white rice under cold water until the water runs
              clear to remove excess starch. Drain well and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté Aromatics
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat the vegetable oil in a medium saucepan over medium heat. Add the
              minced garlic and chopped onion, sautéing until fragrant and translucent,
              about 3-4 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Toast the Rice
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the drained rice to the saucepan and stir continuously for 2-3
              minutes until the rice is well coated with oil and slightly toasted.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Liquid and Seasonings
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the water or broth, add salt and bay leaf, and stir once to
              combine. Bring to a boil over high heat.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Simmer and Cook
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Once boiling, reduce heat to low, cover with a tight-fitting lid, and
              simmer for 15-18 minutes until the liquid is absorbed and rice is tender.
              Avoid lifting the lid during cooking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Rest and Fluff
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove from heat and let the rice rest, covered, for 5 minutes. Remove
              the bay leaf, then fluff the rice gently with a fork. Stir in chopped
              parsley and optional butter for extra flavor.
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
            Rinsing the rice thoroughly before cooking removes excess starch and
            prevents clumping, resulting in fluffier grains.
          </li>
          <li>
            Toasting the rice in oil with garlic and onions adds a subtle nutty
            flavor and helps keep the grains separate.
          </li>
          <li>
            Use a tight-fitting lid during simmering to trap steam and cook the rice
            evenly without drying it out.
          </li>
          <li>
            Avoid stirring the rice while it cooks to prevent breaking the grains and
            making it mushy.
          </li>
          <li>
            Adding a bay leaf infuses a delicate aroma; remove it before serving to
            avoid bitterness.
          </li>
          <li>
            For a richer taste, finish with a small knob of butter or a drizzle of
            olive oil before fluffing.
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
              href="https://en.wikipedia.org/wiki/Brazilian_cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Brazilian Cuisine Overview
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/Brazilian-cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Brazilian Culinary Traditions
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
