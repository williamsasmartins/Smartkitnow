import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

import { getRecipeSchema } from "@/components/RecipeSchema";

export default function AcaiBowlCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Acai%20Bowl%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=27"
  );

  // --- DATA ---
  const title = "Acai Bowl";
  const description = "Frozen mashed açaí fruit served with granola and fruits.";

  // INGREDIENTS
  const ingredients = [
    { name: "Frozen Açaí Puree", baseAmount: 500, unit: "g" },
    { name: "Banana (ripe)", baseAmount: 2, unit: "pcs" },
    { name: "Strawberries", baseAmount: 150, unit: "g" },
    { name: "Blueberries", baseAmount: 100, unit: "g" },
    { name: "Granola", baseAmount: 120, unit: "g" },
    { name: "Chia Seeds", baseAmount: 20, unit: "g" },
    { name: "Honey or Agave Syrup", baseAmount: 30, unit: "ml" },
    { name: "Almond Milk (unsweetened)", baseAmount: 100, unit: "ml" },
    { name: "Coconut Flakes", baseAmount: 15, unit: "g" },
    { name: "Fresh Mint Leaves", baseAmount: 5, unit: "g" },
    { name: "Lime Juice", baseAmount: 10, unit: "ml" },
    { name: "Peanut Butter (optional)", baseAmount: 30, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: Math.round(350 * (servings / 4)).toString(),
    protein: (6 * (servings / 4)).toFixed(1) + "g",
    carbs: (55 * (servings / 4)).toFixed(1) + "g",
    fat: (10 * (servings / 4)).toFixed(1) + "g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is an açaí bowl?",
      answer:
        "An açaí bowl is a smoothie bowl made primarily from frozen and mashed açaí berries, a fruit native to the Amazon rainforest. It's typically topped with granola, fresh fruits, seeds, and other nutritious ingredients, making it a popular and healthy breakfast or snack option.",
    },
    {
      question: "How do I keep the açaí bowl from melting too quickly?",
      answer:
        "To keep your açaí bowl from melting quickly, use frozen açaí puree and blend it with just enough liquid to achieve a thick consistency. Serve immediately after preparation and keep it chilled until ready to eat. Using frozen fruits as toppings can also help maintain the cold temperature longer.",
    },
    {
      question: "Can I substitute the almond milk with other liquids?",
      answer:
        "Absolutely! You can substitute almond milk with any plant-based milk like oat, soy, or coconut milk, or even dairy milk if preferred. The choice of liquid will slightly affect the flavor and texture, so choose one that complements the açaí and your dietary preferences.",
    },
    {
      question: "Is the açaí bowl suitable for vegans?",
      answer:
        "Yes, the traditional açaí bowl is vegan-friendly, especially when sweetened with agave syrup or maple syrup instead of honey. Always check the ingredients of your granola and toppings to ensure they don't contain any animal products.",
    },
    {
      question: "What are some popular toppings for an açaí bowl?",
      answer:
        "Popular toppings include granola, sliced bananas, strawberries, blueberries, chia seeds, coconut flakes, nuts, peanut butter, and fresh mint leaves. These toppings add texture, flavor, and nutritional value to the bowl.",
    },
    {
      question: "Can I prepare the açaí bowl in advance?",
      answer:
        "It's best to prepare the açaí base in advance and store it frozen. However, toppings should be added fresh just before serving to maintain their texture and freshness. Prepping ingredients ahead can save time during busy mornings.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const recipeJsonLd = getRecipeSchema({
    name: title,
    description: description,
    image: imgSrc,
    prepTime: "PT10M",
    cookTime: "PT0M",
    totalTime: "PT10M",
    recipeYield: "4 servings",
    recipeCategory: "Breakfast",
    recipeCuisine: "Brazilian",
    keywords: "acai bowl, açaí na tigela, breakfast bowl, healthy breakfast, brazilian food, superfood",
    recipeIngredient: ingredients.map(ing => `${ing.baseAmount}${ing.unit} ${ing.name}`),
    recipeInstructions: [
      "In a high-speed blender, combine the frozen açaí puree, ripe bananas, almond milk, and lime juice. Blend until smooth and thick, adding more almond milk if necessary to reach a creamy consistency.",
      "Pour the blended açaí mixture into serving bowls. Arrange sliced strawberries, blueberries, banana slices, and granola on top in an appealing pattern.",
      "Sprinkle chia seeds, coconut flakes, and fresh mint leaves over the bowl. Drizzle honey or agave syrup for added sweetness if desired.",
      "Enjoy your fresh açaí bowl right away to experience the best texture and flavor. Optionally, add a spoonful of peanut butter for extra richness."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Acai Bowl"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 10m | Cook: 0m
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
                    {ing.unit === "pcs"
                      ? getAmount(ing.baseAmount)
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          About this Recipe
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            The açaí bowl is a vibrant and refreshing dish that has taken the
            world by storm as a nutritious and delicious breakfast or snack
            option. Originating from Brazil, this bowl features frozen açaí
            berries blended into a thick smoothie base, topped with an array of
            fresh fruits, crunchy granola, and superfood seeds. Its creamy
            texture and naturally sweet flavor make it a perfect energizing
            start to your day.
          </p>
          <p>
            Historically, açaí berries have been a staple food for indigenous
            communities in the Amazon rainforest for centuries, prized for their
            antioxidant properties and rich nutrient profile. The modern açaí
            bowl was popularized in the 1990s in Brazil and quickly spread
            internationally, becoming a symbol of healthy eating and vibrant
            tropical flavors.
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
              Prepare the Açaí Base
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a high-speed blender, combine the frozen açaí puree, ripe
              bananas, almond milk, and lime juice. Blend until smooth and
              thick, adding more almond milk if necessary to reach a creamy
              consistency.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble the Bowl
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the blended açaí mixture into serving bowls. Arrange sliced
              strawberries, blueberries, banana slices, and granola on top in
              an appealing pattern.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Superfood Toppings
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Sprinkle chia seeds, coconut flakes, and fresh mint leaves over
              the bowl. Drizzle honey or agave syrup for added sweetness if
              desired.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve Immediately
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Enjoy your fresh açaí bowl right away to experience the best
              texture and flavor. Optionally, add a spoonful of peanut butter
              for extra richness.
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
            Use frozen açaí puree packets for convenience and consistent
            texture.
          </li>
          <li>
            Blend the base just until smooth to maintain a thick, spoonable
            consistency.
          </li>
          <li>
            Customize toppings seasonally to keep the bowl fresh and exciting.
          </li>
          <li>
            For extra protein, add a scoop of plant-based protein powder to the
            blend.
          </li>
          <li>
            If you prefer a sweeter bowl, adjust the honey or agave syrup to
            taste.
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
              href="https://en.wikipedia.org/wiki/Açaí_palm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Açaí Palm
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.healthline.com/nutrition/acai-berry-benefits"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Healthline: Açaí Berry Benefits
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
