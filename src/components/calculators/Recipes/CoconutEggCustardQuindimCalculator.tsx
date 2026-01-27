import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function CoconutEggCustardQuindimCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Coconut%20Egg%20Custard%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1574"
  );

  // --- DATA ---
  const title = "Coconut Egg Custard";
  const description = "Bright yellow, glossy dessert made from yolks and coconut.";

  // INGREDIENTS
  const ingredients = [
    { name: "Egg yolks", baseAmount: 12, unit: "pcs" },
    { name: "Granulated sugar", baseAmount: 250, unit: "g" },
    { name: "Fresh coconut milk", baseAmount: 200, unit: "ml" },
    { name: "Water", baseAmount: 100, unit: "ml" },
    { name: "Unsalted butter (melted)", baseAmount: 50, unit: "g" },
    { name: "Vanilla extract", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1, unit: "pinch" },
    { name: "Desiccated coconut (optional, for topping)", baseAmount: 20, unit: "g" },
    { name: "Lime zest (optional)", baseAmount: 1, unit: "tsp" },
    { name: "Powdered sugar (for dusting)", baseAmount: 5, unit: "g" },
    { name: "Butter (for greasing molds)", baseAmount: 10, unit: "g" },
    { name: "Water (for bain-marie)", baseAmount: 500, unit: "ml" },
  ];

  const nutrition = {
    calories: "320",
    protein: "7g",
    carbs: "45g",
    fat: "12g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the difference between Coconut Egg Custard and Quindim?",
      answer:
        "Coconut Egg Custard is a creamy, custard-based dessert flavored with coconut milk, while Quindim is a Brazilian baked dessert made primarily from egg yolks, sugar, and shredded coconut, resulting in a glossy, bright yellow custard with a coconut topping. Both share similar ingredients but differ in texture and preparation methods.",
    },
    {
      question: "Can I use canned coconut milk instead of fresh coconut milk?",
      answer:
        "Yes, canned coconut milk can be used as a substitute for fresh coconut milk. However, fresh coconut milk tends to have a lighter, fresher flavor, while canned coconut milk is richer and thicker. If using canned, consider diluting it slightly with water to achieve the desired consistency.",
    },
    {
      question: "How do I prevent the custard from curdling during baking?",
      answer:
        "To prevent curdling, bake the custard gently in a bain-marie (water bath) at a low temperature (around 160°C/320°F). Avoid overbaking and stirring the custard mixture excessively. Also, temper the eggs by gradually mixing in the warm coconut milk to avoid sudden temperature changes.",
    },
    {
      question: "Can I prepare Coconut Egg Custard ahead of time?",
      answer:
        "Yes, you can prepare the custard mixture ahead and refrigerate it for up to 24 hours before baking. After baking, the custard can be stored covered in the refrigerator for 2-3 days. Reheat gently if desired, but it is best enjoyed chilled or at room temperature.",
    },
    {
      question: "What molds are best for baking this custard?",
      answer:
        "Traditional Quindim is baked in small, individual, fluted molds or ramekins that are well-greased with butter to allow easy unmolding. Silicone molds can also be used. Ensure molds are properly prepared to prevent sticking and maintain the custard’s glossy finish.",
    },
    {
      question: "Is Coconut Egg Custard gluten-free?",
      answer:
        "Yes, this recipe is naturally gluten-free as it contains no wheat or gluten-containing ingredients. However, always check ingredient labels, especially for vanilla extract or other flavorings, to ensure they are gluten-free.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);
  const recipeJsonLd = getRecipeSchema({
    name: title,
    description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT40M",
    totalTime: "PT60M",
    recipeYield: `${servings} portions`,
    recipeCategory: "Dessert",
    recipeCuisine: "Brazilian",
    keywords: "quindim, coconut egg custard, brazilian sweets, yolk dessert, tropical custard, traditional recipe",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Whisk egg yolks and sugar until smooth; add coconut milk, butter, and flavorings.",
      "Strain the mixture through a fine sieve into buttered molds.",
      "Place molds in a hot water bath (bain-marie).",
      "Bake at 160°C (320°F) for 35-40 minutes until set but slightly jiggly.",
      "Cool to room temperature, refrigerate for 2+ hours, then unmold and serve."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Coconut Egg Custard"
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
            Coconut Egg Custard, also known as Quindim in Brazilian cuisine, is a
            luscious dessert that combines the rich creaminess of egg yolks with the
            tropical sweetness of coconut milk. Its bright yellow, glossy surface
            and smooth texture make it visually striking and irresistibly delicious.
          </p>
          <p>
            Originating from Portuguese colonial influences in Brazil, Quindim has
            become a beloved traditional treat, often served at celebrations and
            family gatherings. The recipe showcases the harmony between simple
            ingredients and precise technique, resulting in a dessert that is both
            elegant and comforting.
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
              Prepare the custard base
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, whisk together the egg yolks and granulated sugar until
              the mixture is smooth and pale. Gradually add the fresh coconut milk,
              melted butter, vanilla extract, lime zest (if using), and a pinch of salt,
              whisking continuously to combine all ingredients evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Strain and prepare molds
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Strain the custard mixture through a fine sieve to remove any lumps or
              chalaza. Generously butter individual fluted molds or ramekins to ensure
              easy unmolding later.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Fill molds and prepare bain-marie
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the strained custard evenly into the prepared molds. Place the molds
              in a deep baking dish and pour hot water into the dish until it reaches
              halfway up the sides of the molds, creating a bain-marie.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bake the custard
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bake in a preheated oven at 160°C (320°F) for 35-40 minutes, or until the
              custard is set but still slightly jiggly in the center. Avoid overbaking
              to maintain a creamy texture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cool and unmold
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the molds from the water bath and let them cool to room temperature.
              Refrigerate for at least 2 hours before unmolding. To unmold, run a thin
              knife around the edges and invert onto serving plates.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Garnish and serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Optionally sprinkle desiccated coconut or powdered sugar on top before
              serving. Enjoy this tropical custard as a delightful dessert or snack.
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
            Use room temperature eggs to ensure a smooth custard mixture and prevent
            curdling.
          </li>
          <li>
            Straining the custard mixture is essential to remove any coagulated bits
            and achieve a silky texture.
          </li>
          <li>
            Baking in a water bath helps regulate temperature and prevents the custard
            from cracking or drying out.
          </li>
          <li>
            Avoid opening the oven door frequently during baking to maintain stable
            heat.
          </li>
          <li>
            For a more intense coconut flavor, toast some shredded coconut and sprinkle
            on top before serving.
          </li>
          <li>
            If you prefer a firmer custard, bake a few minutes longer but watch closely
            to avoid drying.
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
              href="https://en.wikipedia.org/wiki/Quindim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Quindim
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/quindim-brazilian-coconut-egg-custard-3029339"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Quindim Recipe & History
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