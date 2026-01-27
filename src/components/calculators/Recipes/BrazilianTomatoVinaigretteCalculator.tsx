import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function BrazilianTomatoVinaigretteCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Tomato%20Vinaigrette%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=941"
  );

  // --- DATA ---
  const title = "Brazilian Tomato Vinaigrette";
  const description = "Tangy tomato, onion, and bell pepper relish for barbecue.";

  // INGREDIENTS
  const ingredients = [
    { name: "Tomatoes, finely chopped", baseAmount: 400, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 150, unit: "g" },
    { name: "Green bell pepper, finely chopped", baseAmount: 100, unit: "g" },
    { name: "Red bell pepper, finely chopped", baseAmount: 100, unit: "g" },
    { name: "Fresh parsley, chopped", baseAmount: 15, unit: "g" },
    { name: "Fresh cilantro, chopped", baseAmount: 15, unit: "g" },
    { name: "Garlic clove, minced", baseAmount: 2, unit: "cloves" },
    { name: "Extra virgin olive oil", baseAmount: 60, unit: "ml" },
    { name: "White vinegar", baseAmount: 45, unit: "ml" },
    { name: "Lime juice", baseAmount: 15, unit: "ml" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black pepper, freshly ground", baseAmount: 1, unit: "tsp" },
    { name: "Sugar (optional)", baseAmount: 1, unit: "tsp" },
  ];

  // Approximate nutrition per serving (4 servings)
  const nutrition = {
    calories: "90",
    protein: "1g",
    carbs: "5g",
    fat: "8g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Brazilian Tomato Vinaigrette used for?",
      answer:
        "Brazilian Tomato Vinaigrette is a versatile condiment commonly served alongside grilled meats, especially barbecue (churrasco). It adds a fresh, tangy, and slightly spicy flavor that complements the smoky richness of grilled dishes. It can also be used as a salad dressing or a topping for sandwiches and rice dishes.",
    },
    {
      question: "Can I prepare the vinaigrette in advance?",
      answer:
        "Yes, you can prepare the vinaigrette a few hours or even a day ahead. Allowing it to rest in the refrigerator helps the flavors meld together beautifully. Just make sure to cover it tightly and bring it to room temperature before serving for the best taste.",
    },
    {
      question: "How do I adjust the spiciness of the vinaigrette?",
      answer:
        "The traditional recipe is mildly spicy due to the fresh peppers and black pepper. To increase spiciness, you can add finely chopped fresh chili peppers or a pinch of cayenne pepper. To reduce heat, omit the peppers or use milder bell peppers only.",
    },
    {
      question: "Is this vinaigrette gluten-free and vegan?",
      answer:
        "Yes, Brazilian Tomato Vinaigrette is naturally gluten-free and vegan, made entirely from fresh vegetables, herbs, and simple pantry ingredients like olive oil and vinegar.",
    },
    {
      question: "Can I substitute ingredients if I don’t have fresh herbs?",
      answer:
        "If fresh parsley or cilantro is unavailable, you can use dried herbs, but reduce the quantity to about one-third as dried herbs are more concentrated. Alternatively, fresh basil or chives can add a different but pleasant flavor profile.",
    },
    {
      question: "How long does the vinaigrette keep in the refrigerator?",
      answer:
        "Stored in an airtight container, the vinaigrette will keep fresh for up to 3-4 days in the refrigerator. Stir well before serving, as some separation may occur.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);
  const recipeJsonLd = getRecipeSchema({
    name: title,
    description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT0M",
    totalTime: "PT20M",
    recipeYield: `${servings} portions`,
    recipeCategory: "Condiment",
    recipeCuisine: "Brazilian",
    keywords: "brazilian tomato vinaigrette, vinagrete, brazilian barbecue side, salsa, churrasco condiment, tomato relish",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit === "cloves" ? "" : i.unit} ${i.name}`),
    recipeInstructions: [
      "Finely chop tomatoes, onions, peppers, and herbs; mince the garlic.",
      "Combine all vegetables, herbs, garlic, salt, pepper, and optional sugar in a bowl.",
      "Add olive oil, white vinegar, and lime juice; toss thoroughly.",
      "Let rest for 20 minutes at room temperature or chill before serving."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Tomato Vinaigrette"
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
            Brazilian Tomato Vinaigrette, known locally as "Vinagrete," is a
            vibrant and tangy relish made from fresh tomatoes, onions, bell
            peppers, and herbs, all finely chopped and tossed in a zesty
            vinaigrette dressing. This condiment is a staple accompaniment to
            Brazilian barbecue (churrasco), adding a refreshing contrast to
            smoky grilled meats with its bright acidity and crisp texture.
          </p>
          <p>
            The origins of Vinagrete trace back to Portuguese culinary
            influences blended with indigenous Brazilian ingredients. Over
            time, it has become a beloved classic across Brazil, celebrated
            for its simplicity, versatility, and ability to elevate any meal.
            Traditionally served chilled or at room temperature, it embodies
            the vibrant flavors and communal spirit of Brazilian dining.
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
              Prepare the Vegetables
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Finely chop the tomatoes, onions, green and red bell peppers,
              parsley, and cilantro. Mince the garlic cloves. Aim for small,
              uniform pieces to ensure even flavor distribution.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Combine Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, mix the chopped vegetables and herbs. Add the
              minced garlic, salt, black pepper, and sugar (if using). Stir to
              combine evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Liquids and Toss
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the extra virgin olive oil, white vinegar, and lime juice.
              Toss gently but thoroughly to coat all ingredients with the
              vinaigrette dressing.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Rest and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Let the vinaigrette rest for at least 20 minutes at room
              temperature or chill in the refrigerator for up to a few hours.
              Serve alongside grilled meats, rice, or as a fresh salad topping.
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
            Use ripe, firm tomatoes for the best texture and flavor; Roma or
            plum tomatoes work well.
          </li>
          <li>
            Adjust the acidity by balancing vinegar and lime juice to your
            preference.
          </li>
          <li>
            For a smoky twist, add a small amount of smoked paprika or chipotle
            powder.
          </li>
          <li>
            If you prefer a milder vinaigrette, soak the chopped onions in cold
            water for 10 minutes before mixing to reduce sharpness.
          </li>
          <li>
            Serve the vinaigrette fresh; it tastes best within 24 hours of
            preparation.
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
              href="https://www.saveur.com/article/Recipes/Brazilian-Tomato-Vinaigrette/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Brazilian Tomato Vinaigrette Recipe
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