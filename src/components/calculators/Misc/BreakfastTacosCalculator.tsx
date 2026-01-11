import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BreakfastTacosCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Breakfast%20Tacos%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=306"
  );

  // --- DATA ---
  const title = "Breakfast Tacos";
  const description = "Tacos de café da manhã com ovos e recheios variados.";

  // INGREDIENTS
  const ingredients = [
    { name: "Corn Tortillas", baseAmount: 8, unit: "pieces" },
    { name: "Large Eggs", baseAmount: 6, unit: "pieces" },
    { name: "Chorizo Sausage", baseAmount: 200, unit: "g" },
    { name: "Shredded Cheddar Cheese", baseAmount: 100, unit: "g" },
    { name: "Diced Tomatoes", baseAmount: 150, unit: "g" },
    { name: "Chopped Onion", baseAmount: 80, unit: "g" },
    { name: "Fresh Cilantro", baseAmount: 15, unit: "g" },
    { name: "Sliced Avocado", baseAmount: 1, unit: "piece" },
    { name: "Lime Wedges", baseAmount: 2, unit: "pieces" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Olive Oil", baseAmount: 2, unit: "tbsp" },
    { name: "Sour Cream", baseAmount: 100, unit: "g" },
    { name: "Salsa Verde", baseAmount: 100, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutritionPerServing = {
    calories: 420,
    protein: "22g",
    carbs: "30g",
    fat: "25g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  const nutrition = {
    calories: (nutritionPerServing.calories * servings) / 4,
    protein: nutritionPerServing.protein,
    carbs: nutritionPerServing.carbs,
    fat: nutritionPerServing.fat,
  };

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I make breakfast tacos vegetarian?",
      answer:
        "Absolutely! You can substitute the chorizo with sautéed mushrooms, black beans, or plant-based sausage alternatives. Adding extra veggies like bell peppers and spinach can also enhance the flavor and nutrition.",
    },
    {
      question: "What type of tortillas work best for breakfast tacos?",
      answer:
        "Traditional corn tortillas are preferred for authentic flavor and texture, but you can also use flour tortillas if you prefer a softer, more pliable wrap. Warm the tortillas before assembling for the best taste and flexibility.",
    },
    {
      question: "How do I prevent the eggs from becoming rubbery?",
      answer:
        "Cook the eggs gently over medium-low heat, stirring frequently to create soft curds. Avoid overcooking by removing them from heat just before they look fully set, as they will continue to cook slightly from residual heat.",
    },
    {
      question: "Can I prepare breakfast tacos ahead of time?",
      answer:
        "You can prepare the fillings like chorizo, sautéed veggies, and chopped toppings in advance and store them separately. However, it's best to cook the eggs fresh and assemble the tacos just before serving to maintain optimal texture and flavor.",
    },
    {
      question: "What are some popular toppings for breakfast tacos?",
      answer:
        "Common toppings include shredded cheese, fresh cilantro, diced onions, salsa verde or roja, sliced avocado, sour cream, and lime wedges. Feel free to customize based on your taste preferences.",
    },
    {
      question: "How can I make the tacos spicier?",
      answer:
        "Add finely chopped jalapeños or serrano peppers to the egg mixture or use a spicy salsa. You can also sprinkle some cayenne pepper or hot sauce on top to increase the heat level.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Breakfast Tacos"
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
            <div className="font-bold text-lg">{Math.round(nutrition.calories)}</div>
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
            Breakfast tacos are a beloved morning staple in many parts of the southwestern United States and Mexico. Combining warm corn tortillas with fluffy eggs, spicy chorizo, fresh vegetables, and creamy toppings, these tacos offer a perfect balance of flavors and textures to start your day right.
          </p>
          <p>
            The origins of breakfast tacos trace back to Tex-Mex cuisine, where resourceful cooks combined readily available ingredients into a handheld, satisfying meal. Over time, this dish has evolved with countless regional variations, making it a versatile and customizable breakfast favorite enjoyed by many.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Chorizo</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat 1 tablespoon of olive oil in a skillet over medium heat. Add the chorizo sausage, breaking it apart with a spatula, and cook until browned and cooked through, about 5-7 minutes. Remove from the skillet and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté Vegetables</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In the same skillet, add the remaining olive oil and sauté the chopped onions until translucent, about 3 minutes. Add diced tomatoes and cook for another 2 minutes. Stir in chopped cilantro and remove from heat.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Eggs</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Crack the eggs into a bowl, season with salt and pepper, and whisk lightly. Pour into the skillet over medium-low heat and cook gently, stirring frequently, until soft scrambled and just set.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Warm the Tortillas</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat the corn tortillas on a dry skillet or griddle over medium heat for about 30 seconds per side until warm and pliable.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Assemble the Tacos</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Layer the scrambled eggs, cooked chorizo, sautéed vegetables, shredded cheese, and your favorite toppings such as avocado slices, sour cream, and salsa verde onto each tortilla. Serve immediately with lime wedges.
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
            Use fresh corn tortillas for the best texture and flavor; warming them properly prevents cracking when folding.
          </li>
          <li>
            For extra creaminess, add a dollop of Mexican crema or sour cream on top of the tacos.
          </li>
          <li>
            Customize the spice level by adding diced jalapeños or a dash of hot sauce to the eggs or toppings.
          </li>
          <li>
            To save time, cook the chorizo and sautéed veggies the night before and refrigerate; reheat gently before assembling.
          </li>
          <li>
            Garnish with fresh cilantro and a squeeze of lime juice to brighten the flavors and add freshness.
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
              href="https://en.wikipedia.org/wiki/Breakfast_taco"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Breakfast Taco
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/breakfast-tacos-recipe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: Breakfast Tacos Recipe
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