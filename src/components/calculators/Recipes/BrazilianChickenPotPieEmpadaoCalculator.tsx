import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function BrazilianChickenPotPieEmpadaoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Chicken%20Pot%20Pie%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6702"
  );

  // --- DATA ---
  const title = "Brazilian Chicken Pot Pie";
  const description = "Flaky, buttery crust filled with creamy shredded chicken.";

  // INGREDIENTS
  const ingredients = [
    { name: "Shredded Chicken Breast", baseAmount: 500, unit: "g" },
    { name: "All-Purpose Flour", baseAmount: 300, unit: "g" },
    { name: "Unsalted Butter", baseAmount: 150, unit: "g" },
    { name: "Whole Milk", baseAmount: 200, unit: "ml" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic Cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Green Olives, sliced", baseAmount: 100, unit: "g" },
    { name: "Hard-Boiled Eggs, chopped", baseAmount: 3, unit: "eggs" },
    { name: "Tomato Paste", baseAmount: 2, unit: "tbsp" },
    { name: "Chicken Broth", baseAmount: 250, unit: "ml" },
    { name: "Parsley, chopped", baseAmount: 15, unit: "g" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Egg Yolk (for brushing)", baseAmount: 1, unit: "egg" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "520",
    protein: "38g",
    carbs: "40g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Empadão and how is it different from other pot pies?",
      answer:
        "Empadão is a traditional Brazilian savory pie characterized by its flaky, buttery crust and rich, creamy filling, often made with shredded chicken. Unlike typical American pot pies that use a puff pastry or biscuit topping, Empadão uses a dough similar to shortcrust pastry, resulting in a tender yet crisp crust. The filling often includes unique Brazilian ingredients like green olives and hard-boiled eggs, giving it a distinctive flavor profile.",
    },
    {
      question: "Can I prepare the dough in advance?",
      answer:
        "Yes, the dough can be prepared up to 24 hours in advance. Wrap it tightly in plastic wrap and refrigerate. Before using, let it sit at room temperature for about 15 minutes to soften slightly, making it easier to roll out.",
    },
    {
      question: "How do I store leftovers and how long do they last?",
      answer:
        "Store any leftover Empadão in an airtight container in the refrigerator for up to 3 days. To reheat, warm it in a preheated oven at 180°C (350°F) for about 15-20 minutes to maintain the crust’s crispness. Avoid microwaving as it can make the crust soggy.",
    },
    {
      question: "Can I substitute chicken with other proteins?",
      answer:
        "Absolutely! While shredded chicken is traditional, you can substitute with shredded beef, ground meat, or even a mix of vegetables for a vegetarian version. Adjust seasoning accordingly to complement the chosen protein or vegetables.",
    },
    {
      question: "What are some common variations or additions to the filling?",
      answer:
        "Common variations include adding diced hearts of palm, peas, corn, or even cream cheese to enrich the filling. Some recipes incorporate a splash of white wine or coconut milk for added depth. Feel free to customize based on your taste preferences!",
    },
    {
      question: "How do I achieve a perfectly flaky crust?",
      answer:
        "Use cold butter and cold liquids when making the dough to prevent the butter from melting prematurely. Handle the dough minimally and avoid overworking it. Chilling the dough before rolling out also helps develop a tender, flaky texture.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);
  const recipeJsonLd = getRecipeSchema({
    name: title,
    description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT40M",
    totalTime: "PT1H",
    recipeYield: `${servings} servings`,
    recipeCategory: "Main Course",
    recipeCuisine: "Brazilian",
    keywords: "chicken pot pie, empadao de frango, brazilian cuisine, savory pie, flaky crust",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Knead flour, cold butter, milk, and salt until a smooth dough forms, then chill for 30 minutes.",
      "Sauté onion, garlic, chicken, tomato paste, and broth until thick.",
      "Stir in olives, hard-boiled eggs, and parsley, then let cool.",
      "Line a dish with half the dough, add filling, cover with remaining dough, and brush with egg yolk.",
      "Bake at 180°C (350°F) for 35-40 minutes until golden brown."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Chicken Pot Pie"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 40m
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
            Brazilian Chicken Pot Pie, known locally as Empadão de Frango, is a beloved comfort
            food that combines a flaky, buttery crust with a rich, creamy filling of shredded
            chicken, olives, and hard-boiled eggs. This hearty dish is perfect for family meals
            or special occasions, offering a delightful balance of textures and flavors that
            showcase the warmth of Brazilian home cooking.
          </p>
          <p>
            The origins of Empadão trace back to Portuguese culinary traditions, adapted over
            centuries in Brazil with local ingredients and flavors. It reflects the fusion of
            European techniques with Brazilian tastes, making it a staple in many households.
            The use of green olives and hard-boiled eggs in the filling adds a distinctive
            savory depth, while the buttery crust provides a satisfying contrast to the creamy
            interior.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Dough</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine the all-purpose flour and a pinch of salt. Cut the cold
              unsalted butter into small cubes and incorporate it into the flour using your
              fingertips until the mixture resembles coarse crumbs. Gradually add cold milk and
              knead gently until a smooth dough forms. Wrap in plastic and refrigerate for at
              least 30 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Filling</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a skillet, sauté the chopped onion and minced garlic in a bit of butter until
              translucent. Add shredded chicken, tomato paste, and chicken broth. Simmer until
              the mixture thickens slightly. Stir in sliced green olives, chopped hard-boiled
              eggs, and chopped parsley. Season with salt and black pepper to taste. Remove
              from heat and let cool.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Assemble the Empadão</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat the oven to 180°C (350°F). Divide the dough into two portions. Roll out
              one portion and line a greased baking dish with it. Fill with the chicken mixture,
              then roll out the second portion and cover the filling, sealing the edges well.
              Brush the top with beaten egg yolk for a golden finish.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Bake</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bake in the preheated oven for 35-40 minutes or until the crust is golden brown
              and crisp. Remove from oven and let rest for 10 minutes before slicing and
              serving.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve and Enjoy</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve warm as a main dish accompanied by a fresh green salad or steamed vegetables.
              Empadão also pairs wonderfully with a chilled white wine or a light Brazilian beer.
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
            Use cold butter and cold liquids when making the dough to ensure a flaky crust.
          </li>
          <li>
            Don’t overwork the dough; handle it gently to keep it tender and flaky.
          </li>
          <li>
            Adding a splash of chicken broth to the filling helps keep it moist and flavorful.
          </li>
          <li>
            Brush the crust with egg yolk mixed with a teaspoon of water for a shiny, golden
            finish.
          </li>
          <li>
            Let the pie rest for a few minutes after baking to allow the filling to set,
            making it easier to slice.
          </li>
          <li>
            Customize the filling by adding diced hearts of palm or cream cheese for extra
            richness.
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
              href="https://www.saveur.com/article/Recipes/Brazilian-Chicken-Pot-Pie-Empadao/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Brazilian Chicken Pot Pie (Empadão) Recipe
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