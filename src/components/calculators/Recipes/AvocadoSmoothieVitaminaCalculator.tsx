import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function AvocadoSmoothieVitaminaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Avocado%20Smoothie%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1403"
  );

  // --- DATA ---
  const title = "Avocado Smoothie";
  const description =
    "Creamy dessert-like drink made with avocado and milk, blended to perfection for a refreshing and nutritious treat.";

  // INGREDIENTS
  const ingredients = [
    { name: "Ripe Avocado", baseAmount: 300, unit: "g" },
    { name: "Whole Milk", baseAmount: 400, unit: "ml" },
    { name: "Sweetened Condensed Milk", baseAmount: 100, unit: "ml" },
    { name: "Ice Cubes", baseAmount: 150, unit: "g" },
    { name: "Honey", baseAmount: 30, unit: "g" },
    { name: "Lime Juice", baseAmount: 15, unit: "ml" },
    { name: "Vanilla Extract", baseAmount: 5, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "g" },
    { name: "Chia Seeds (optional)", baseAmount: 10, unit: "g" },
    { name: "Mint Leaves (for garnish)", baseAmount: 5, unit: "g" },
    { name: "Banana (optional, for extra creaminess)", baseAmount: 100, unit: "g" },
    { name: "Greek Yogurt (optional, for protein boost)", baseAmount: 100, unit: "g" },
  ];

  const nutrition = {
    calories: "320",
    protein: "6g",
    carbs: "28g",
    fat: "20g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use almond milk instead of whole milk?",
      answer:
        "Yes, almond milk or any other plant-based milk can be used as a substitute for whole milk. It will slightly alter the flavor and creaminess but still result in a delicious smoothie suitable for lactose-intolerant individuals.",
    },
    {
      question: "How do I know when an avocado is ripe enough for the smoothie?",
      answer:
        "A ripe avocado should yield slightly to gentle pressure without feeling mushy. The skin color typically darkens, and the fruit should feel heavy for its size. Using ripe avocados ensures a creamy texture and rich flavor in the smoothie.",
    },
    {
      question: "Can I prepare this smoothie in advance?",
      answer:
        "It's best to consume avocado smoothies fresh to prevent browning and loss of flavor. However, you can prepare it up to 2 hours in advance if stored in an airtight container in the refrigerator. Adding a little lime juice helps slow oxidation.",
    },
    {
      question: "What are some variations to enhance the flavor?",
      answer:
        "You can add ingredients like banana for extra creaminess, spinach for a green boost, or protein powder for added nutrition. Spices like cinnamon or nutmeg also complement the avocado's flavor nicely.",
    },
    {
      question: "Is this smoothie suitable for weight loss diets?",
      answer:
        "While avocado smoothies are nutrient-dense and provide healthy fats, they are also calorie-rich. Moderation is key, and adjusting portion sizes or ingredients like sweetened condensed milk can make it more weight-loss friendly.",
    },
    {
      question: "Why add salt to a sweet smoothie?",
      answer:
        "A small pinch of salt enhances the overall flavor by balancing sweetness and bringing out the natural taste of the avocado and other ingredients, making the smoothie more flavorful and rounded.",
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
    recipeYield: `${servings} servings`,
    recipeCategory: "Drink",
    recipeCuisine: "Brazilian",
    keywords: "avocado smoothie, vitamina de abacate, brazilian drink, healthy smoothie, creamy avocado",
    recipeIngredient: ingredients.map(ing => `${getAmount(ing.baseAmount)}${ing.unit} ${ing.name}`),
    recipeInstructions: [
      "Cut the ripe avocados in half, remove the pit, and scoop the flesh into a blender.",
      "Pour in the whole milk, sweetened condensed milk, honey, vanilla extract, and lime juice.",
      "Add ice cubes to chill the smoothie.",
      "Blend all ingredients on high speed until the mixture is smooth and creamy. Adjust sweetness or thickness by adding more honey or milk as needed.",
      "Pour the smoothie into glasses and garnish with fresh mint leaves or a sprinkle of chia seeds. Serve immediately."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Avocado Smoothie"
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
            The Avocado Smoothie is a luscious, creamy beverage that combines the rich texture of ripe avocados with the subtle sweetness of condensed milk and the freshness of lime juice. This smoothie is a perfect blend of nutrition and indulgence, offering a dessert-like experience that is both satisfying and refreshing. Ideal for breakfast, a snack, or a healthy dessert, it provides healthy fats, vitamins, and minerals in every sip.
          </p>
          <p>
            Originating from tropical regions where avocados are abundant, this smoothie has become popular worldwide due to its unique flavor and health benefits. Traditionally enjoyed in Latin American countries, it has evolved with modern twists such as the addition of vanilla extract and optional chia seeds for added texture and nutrition.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Avocado</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cut the ripe avocados in half, remove the pit, and scoop the flesh into a blender. Ensure the avocado is ripe for the best creamy texture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Liquids and Sweeteners</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the whole milk, sweetened condensed milk, honey, vanilla extract, and lime juice. These ingredients balance the richness of the avocado with sweetness and a hint of acidity.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Ice and Optional Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add ice cubes to chill the smoothie. If desired, add banana for extra creaminess, Greek yogurt for protein, or chia seeds for texture and nutrition.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Blend Until Smooth</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Blend all ingredients on high speed until the mixture is smooth and creamy. Adjust sweetness or thickness by adding more honey or milk as needed.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve and Garnish</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the smoothie into glasses and garnish with fresh mint leaves or a sprinkle of chia seeds. Serve immediately for the best flavor and texture.
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
            Use ripe avocados for the creamiest texture; underripe avocados will result in a gritty smoothie.
          </li>
          <li>
            Adding a small pinch of salt enhances the sweetness and balances the flavors beautifully.
          </li>
          <li>
            For a vegan version, substitute whole milk and condensed milk with coconut milk and coconut cream.
          </li>
          <li>
            To make it more refreshing, add a few fresh mint leaves to the blender.
          </li>
          <li>
            If you prefer a thinner smoothie, increase the milk quantity or reduce the amount of avocado.
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
              href="https://en.wikipedia.org/wiki/Avocado"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Avocado
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.healthline.com/nutrition/avocado-benefits"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Healthline: Avocado Nutrition and Benefits
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