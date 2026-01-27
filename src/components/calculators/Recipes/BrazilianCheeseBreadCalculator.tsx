import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

import { getRecipeSchema } from "@/components/RecipeSchema";

export default function BrazilianCheeseBreadCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Cheese%20Bread%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3120"
  );

  // --- DATA ---
  const title = "Brazilian Cheese Bread";
  const description = "Classic chewy Pão de Queijo made with cassava flour and cheese.";

  // INGREDIENTS
  const ingredients = [
    { name: "Tapioca Flour (Cassava Starch)", baseAmount: 250, unit: "g" },
    { name: "Whole Milk", baseAmount: 120, unit: "ml" },
    { name: "Vegetable Oil", baseAmount: 60, unit: "ml" },
    { name: "Large Eggs", baseAmount: 2, unit: "pcs" },
    { name: "Grated Parmesan Cheese", baseAmount: 150, unit: "g" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Water", baseAmount: 120, unit: "ml" },
    { name: "Butter (optional, for richness)", baseAmount: 30, unit: "g" },
    { name: "Mozzarella Cheese (optional, for extra chewiness)", baseAmount: 100, unit: "g" },
    { name: "Garlic Powder (optional)", baseAmount: 0.5, unit: "tsp" },
    { name: "Black Pepper (optional)", baseAmount: 0.25, unit: "tsp" },
  ];

  // Nutrition per 4 servings approx.
  const nutrition = {
    calories: "320",
    protein: "10g",
    carbs: "40g",
    fat: "12g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    servings % 1 === 0
      ? (base * (servings / 4)).toFixed(0)
      : (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes Brazilian cheese bread chewy and airy?",
      answer:
        "The unique texture of Pão de Queijo comes from tapioca flour, which is naturally gluten-free and gives the bread its characteristic chewiness and airy interior. The combination of eggs and cheese also contributes to the softness and flavor.",
    },
    {
      question: "Can I use other types of cheese besides Parmesan?",
      answer:
        "Yes, you can substitute or combine Parmesan with other cheeses like mozzarella, Minas cheese, or cheddar for different flavor profiles and textures. Mozzarella adds extra chewiness, while Minas cheese is traditional in Brazil.",
    },
    {
      question: "Is tapioca flour the same as cassava flour?",
      answer:
        "Tapioca flour and cassava flour come from the cassava root but are processed differently. Tapioca flour is a starch extracted from cassava, while cassava flour includes the whole root. For this recipe, tapioca flour (also called tapioca starch) is preferred for the right texture.",
    },
    {
      question: "Can I make Brazilian cheese bread vegan or dairy-free?",
      answer:
        "Traditional Pão de Queijo relies heavily on cheese and eggs for texture and flavor, making vegan versions challenging. However, some recipes use vegan cheese substitutes and flax or chia eggs, but results may vary and the texture might be different.",
    },
    {
      question: "How should I store leftover Brazilian cheese bread?",
      answer:
        "Store leftovers in an airtight container at room temperature for up to 2 days. To reheat, warm them in an oven or toaster oven to restore crispness. Avoid microwaving as it can make them rubbery.",
    },
    {
      question: "Can I freeze Brazilian cheese bread dough or baked bread?",
      answer:
        "Yes, you can freeze baked Pão de Queijo after cooling completely. Reheat from frozen in the oven. Freezing dough is less common but possible; thaw completely before baking for best results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const recipeJsonLd = getRecipeSchema({
    name: title,
    description: description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT15M",
    totalTime: "PT35M",
    recipeYield: "4 servings",
    recipeCategory: "Appetizer",
    recipeCuisine: "Brazilian",
    keywords: "pao de queijo, brazilian cheese bread, gluten free bread, cassava flour recipe",
    recipeIngredient: ingredients.map(ing => `${ing.baseAmount}${ing.unit} ${ing.name}`),
    recipeInstructions: [
      "In a medium saucepan, combine the milk, water, vegetable oil, butter (if using), and salt. Heat over medium until it just begins to boil, then remove from heat immediately.",
      "Pour the hot liquid mixture over the tapioca flour in a large bowl. Stir vigorously with a wooden spoon until the mixture is smooth and forms a sticky dough. Let it cool for about 10 minutes.",
      "Beat the eggs lightly and add them to the dough along with the grated Parmesan cheese (and mozzarella if using). Mix thoroughly until the dough is smooth and elastic.",
      "Preheat your oven to 200°C (390°F). Using wet hands or a spoon, form small balls (about 3-4 cm diameter) from the dough and place them on a baking sheet lined with parchment paper.",
      "Bake for 15-20 minutes or until the cheese breads puff up and turn golden on top. Remove from oven and let cool slightly before serving."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Cheese Bread"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 15m
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
                    {ing.unit === "pcs"
                      ? Math.round(Number(getAmount(ing.baseAmount)))
                      : getAmount(ing.baseAmount)}{" "}
                    {ing.unit}
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
            Brazilian Cheese Bread, or Pão de Queijo, is a beloved gluten-free snack originating from
            the state of Minas Gerais in Brazil. Known for its chewy texture and cheesy flavor, this
            bread is made primarily from tapioca flour, which gives it a unique elasticity and
            lightness. It is a staple at breakfast tables and snack times across Brazil, enjoyed
            fresh and warm.
          </p>
          <p>
            The recipe dates back to the 18th century when African slaves in Brazil adapted local
            ingredients to create this bread. Tapioca flour, derived from cassava root, was a
            readily available starch, and cheese was added to enrich the dough. Over time, Pão de
            Queijo has become an iconic Brazilian comfort food, celebrated worldwide for its simple
            ingredients and irresistible taste.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the liquid mixture</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a medium saucepan, combine the milk, water, vegetable oil, butter (if using), and salt.
              Heat over medium until it just begins to boil, then remove from heat immediately.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Mix in tapioca flour</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the hot liquid mixture over the tapioca flour in a large bowl. Stir vigorously with a wooden spoon
              until the mixture is smooth and forms a sticky dough. Let it cool for about 10 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add eggs and cheese</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Beat the eggs lightly and add them to the dough along with the grated Parmesan cheese (and mozzarella if using).
              Mix thoroughly until the dough is smooth and elastic. You can use a stand mixer with a paddle attachment for ease.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Shape the dough</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your oven to 200°C (390°F). Using wet hands or a spoon, form small balls (about 3-4 cm diameter) from the dough
              and place them on a baking sheet lined with parchment paper, spaced about 3 cm apart.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Bake</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bake for 15-20 minutes or until the cheese breads puff up and turn golden on top. Remove from oven and let cool slightly before serving.
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
            Use freshly grated Parmesan cheese for the best flavor and meltability; pre-grated cheese often contains anti-caking agents that affect texture.
          </li>
          <li>
            If the dough feels too dry or crumbly, add a tablespoon of milk or water at a time until it reaches a sticky, pliable consistency.
          </li>
          <li>
            Wet your hands before shaping the dough balls to prevent sticking and to create smooth surfaces.
          </li>
          <li>
            For a richer flavor, substitute part of the vegetable oil with melted butter.
          </li>
          <li>
            Serve warm for the best texture and flavor; Pão de Queijo tends to harden as it cools.
          </li>
          <li>
            Experiment with different cheeses like Minas or cheddar to customize the taste.
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
              href="https://en.wikipedia.org/wiki/P%C3%A3o_de_queijo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Pão de Queijo
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.saveur.com/article/Recipes/Brazilian-Cheese-Bread-Pao-de-Queijo/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Authentic Brazilian Cheese Bread Recipe
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
