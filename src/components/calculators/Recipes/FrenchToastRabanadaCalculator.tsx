import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function FrenchToastRabanadaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/French%20Toast%20BrazilianStyle%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=955"
  );

  // --- DATA ---
  const title = "French Toast (Brazilian-Style)";
  const description = "Traditional Christmas deep-fried sugary cinnamon bread.";

  // INGREDIENTS
  const ingredients = [
    { name: "French Bread (preferably a baguette or similar)", baseAmount: 500, unit: "g" },
    { name: "Whole Milk", baseAmount: 500, unit: "ml" },
    { name: "Granulated Sugar", baseAmount: 150, unit: "g" },
    { name: "Eggs", baseAmount: 4, unit: "large" },
    { name: "Ground Cinnamon", baseAmount: 2, unit: "tsp" },
    { name: "Vanilla Extract", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 0.5, unit: "tsp" },
    { name: "Vegetable Oil (for frying)", baseAmount: 500, unit: "ml" },
    { name: "Butter (optional, for frying)", baseAmount: 30, unit: "g" },
    { name: "Powdered Sugar (for dusting)", baseAmount: 50, unit: "g" },
    { name: "Ground Cinnamon (for dusting)", baseAmount: 1, unit: "tsp" },
    { name: "Orange Zest (optional)", baseAmount: 1, unit: "tsp" },
    { name: "Sweetened Condensed Milk (optional, for serving)", baseAmount: 100, unit: "ml" },
  ];

  // Nutrition estimates per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "9g",
    carbs: "55g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    servings === 1 && base < 1
      ? (base * (servings / 4)).toFixed(2)
      : (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes Brazilian-style French Toast (Rabanada) different from traditional French toast?",
      answer:
        "Rabanada is typically deep-fried rather than pan-fried, giving it a crispier exterior. It is also coated generously with a cinnamon-sugar mixture after frying, and often served during Christmas in Brazil. The use of condensed milk or orange zest as accompaniments adds a unique Brazilian twist.",
    },
    {
      question: "Can I use other types of bread for Rabanada?",
      answer:
        "Yes, while traditional Rabanada uses slightly stale French bread or baguette for better absorption without falling apart, you can also use brioche or challah. The key is to use bread that is firm enough to hold the custard mixture without becoming too soggy.",
    },
    {
      question: "How do I prevent the Rabanada from becoming greasy when deep-frying?",
      answer:
        "Ensure the oil temperature is maintained between 170°C to 180°C (340°F to 355°F). If the oil is too cool, the bread will absorb more oil and become greasy. Use a thermometer to monitor the temperature and fry in small batches to avoid temperature drops.",
    },
    {
      question: "Can I bake Rabanada instead of deep-frying it?",
      answer:
        "Yes, baking is a healthier alternative. After soaking the bread in the custard, place it on a greased baking sheet and bake at 190°C (375°F) for about 15-20 minutes, flipping halfway through, until golden and crisp. However, the texture will be less crispy compared to deep-frying.",
    },
    {
      question: "How should I store leftover Rabanada?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 2 days. To reheat, use an oven or toaster oven to restore crispiness rather than microwaving, which can make it soggy.",
    },
    {
      question: "Is Rabanada traditionally served with any toppings or sauces?",
      answer:
        "Traditionally, Rabanada is dusted with cinnamon sugar and sometimes drizzled with sweetened condensed milk. Some regions also serve it with fruit preserves, honey, or fresh fruit to complement the rich flavors.",
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
    recipeCategory: "Dessert",
    recipeCuisine: "Brazilian",
    keywords: "rabanada, brazilian french toast, christmas dessert, deep fried bread, cinnamon sugar",
    recipeIngredient: ingredients.map(ing => `${ing.baseAmount}${ing.unit} ${ing.name}`),
    recipeInstructions: [
      "Slice French bread into 2-3 cm thick pieces. Use slightly stale bread.",
      "Whisk eggs, milk, sugar, cinnamon, vanilla, orange zest, and salt in a bowl.",
      "Dip bread slices into the custard, soaking for 20-30 seconds per side.",
      "Heat oil (with optional butter) to 170-180°C (340-355°F).",
      "Fry soaked slices in batches until golden brown (2-3 minutes per side). Drain on paper towels.",
      "While warm, coat with a mixture of powdered sugar and cinnamon. Serve immediately."
    ]
  });


  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="French Toast (Brazilian-Style)"
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
            Rabanada, the Brazilian-style French toast, is a beloved holiday treat traditionally served during Christmas. This recipe features thick slices of slightly stale French bread soaked in a rich custard of milk, eggs, sugar, cinnamon, and vanilla, then deep-fried to golden perfection. The result is a crispy exterior with a soft, custardy interior, dusted generously with cinnamon sugar and often accompanied by sweetened condensed milk or fresh fruit.
          </p>
          <p>
            Originating from Portuguese culinary traditions, Rabanada has become a festive staple in Brazil, symbolizing warmth, family, and celebration. Its preparation and presentation vary across regions, but the essence remains the same: a comforting, indulgent dish that brings people together during the holiday season.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Bread</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Slice the French bread into 2-3 cm thick pieces. Slightly stale bread works best as it absorbs the custard without falling apart. Set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Custard Mixture</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, whisk together the eggs, milk, granulated sugar, ground cinnamon, vanilla extract, orange zest (if using), and salt until fully combined.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Soak the Bread</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Dip each bread slice into the custard mixture, allowing it to soak for about 20-30 seconds per side. Avoid soaking too long to prevent sogginess.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Heat the Oil</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a deep frying pan or pot, heat vegetable oil to 170-180°C (340-355°F). Add butter if desired for extra flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Fry the Bread</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Fry the soaked bread slices in batches until golden brown and crispy, about 2-3 minutes per side. Remove and drain on paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Coat with Cinnamon Sugar</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              While still warm, roll or sprinkle the fried bread slices with a mixture of powdered sugar and ground cinnamon.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              7
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve warm, optionally drizzled with sweetened condensed milk or accompanied by fresh fruit for an authentic Brazilian experience.
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
            Use slightly stale bread for better absorption without it falling apart. Fresh bread tends to get too soggy.
          </li>
          <li>
            Maintain consistent oil temperature to ensure crispy, non-greasy Rabanada. Use a thermometer for accuracy.
          </li>
          <li>
            For extra flavor, add a teaspoon of orange zest to the custard mixture to brighten the taste.
          </li>
          <li>
            If you prefer a lighter version, bake the soaked bread slices instead of frying, but expect a different texture.
          </li>
          <li>
            Serve immediately after coating with cinnamon sugar for the best texture and flavor.
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
              href="https://en.wikipedia.org/wiki/Rabanada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Rabanada (Brazilian French Toast)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.tasteatlas.com/rabanada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              TasteAtlas: Rabanada Recipe and History
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