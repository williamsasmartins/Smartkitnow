import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function PassionFruitJuiceCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Passion%20Fruit%20Juice%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8482"
  );

  // --- DATA ---
  const title = "Passion Fruit Juice";
  const description = "Intense, vitamin-rich tropical juice from Maracujá.";

  // INGREDIENTS
  const ingredients = [
    { name: "Passion Fruit Pulp (fresh or frozen)", baseAmount: 500, unit: "g" },
    { name: "Filtered Water", baseAmount: 1000, unit: "ml" },
    { name: "Granulated Sugar", baseAmount: 150, unit: "g" },
    { name: "Fresh Lime Juice", baseAmount: 30, unit: "ml" },
    { name: "Mint Leaves (optional)", baseAmount: 10, unit: "g" },
    { name: "Ice Cubes", baseAmount: 200, unit: "g" },
    { name: "Honey (optional, for sweetness)", baseAmount: 20, unit: "g" },
    { name: "Salt Pinch", baseAmount: 1, unit: "g" },
    { name: "Chia Seeds (optional)", baseAmount: 15, unit: "g" },
    { name: "Sparkling Water (optional, for fizz)", baseAmount: 200, unit: "ml" },
    { name: "Fresh Orange Juice (optional)", baseAmount: 50, unit: "ml" },
    { name: "Ginger Juice (freshly grated)", baseAmount: 10, unit: "ml" },
    { name: "Vanilla Extract (optional)", baseAmount: 5, unit: "ml" },
    { name: "Coconut Water (optional, for tropical twist)", baseAmount: 100, unit: "ml" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "110",
    protein: "1g",
    carbs: "27g",
    fat: "0g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the best way to extract passion fruit pulp?",
      answer:
        "The best way to extract passion fruit pulp is to cut the fruit in half and scoop out the seeds and juice with a spoon. For easier juicing, you can strain the pulp through a fine mesh sieve to separate the juice from the seeds, depending on your texture preference.",
    },
    {
      question: "Can I use frozen passion fruit pulp instead of fresh?",
      answer:
        "Yes, frozen passion fruit pulp works well and is often more convenient. Just thaw it completely before use. The flavor remains vibrant and fresh, making it an excellent substitute when fresh fruit is out of season.",
    },
    {
      question: "How can I adjust the sweetness of the juice?",
      answer:
        "You can adjust sweetness by varying the amount of granulated sugar or honey. Start with less and add gradually to taste. Using fresh lime juice also balances sweetness with acidity, enhancing the overall flavor profile.",
    },
    {
      question: "Is it possible to make this juice carbonated?",
      answer:
        "Absolutely! For a refreshing twist, replace part or all of the filtered water with sparkling water just before serving. This adds a delightful fizz without overpowering the natural passion fruit flavor.",
    },
    {
      question: "What are some health benefits of passion fruit juice?",
      answer:
        "Passion fruit juice is rich in vitamins A and C, antioxidants, and dietary fiber (if seeds are included). It supports immune health, improves digestion, and provides hydration with a delicious tropical taste.",
    },
    {
      question: "Can I prepare this juice in advance?",
      answer:
        "Yes, you can prepare passion fruit juice up to 24 hours in advance. Store it in an airtight container in the refrigerator. Stir well before serving, as natural separation may occur.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);
  const recipeJsonLd = getRecipeSchema({
    name: title,
    description: description,
    image: imgSrc,
    prepTime: "PT10M",
    cookTime: "PT5M",
    totalTime: "PT15M",
    recipeYield: `${servings} servings`,
    recipeCategory: "Drink",
    recipeCuisine: "Brazilian",
    keywords: "passion fruit juice, suco de maracujá, brazilian juice, tropical drink, refreshing beverage",
    recipeIngredient: ingredients.map(ing => `${getAmount(ing.baseAmount)}${ing.unit} ${ing.name}`),
    recipeInstructions: [
      "Scoop out the passion fruit pulp and strain through a sieve if seeds aren't desired.",
      "Combine pulp, water, sugar, and lime juice in a pitcher and stir until sugar dissolves.",
      "Optionally add coconut water, orange juice, or ginger juice for extra flavor complexity.",
      "Add ice and stir well. For a sparkling twist, add sparkling water just before serving.",
      "Store refrigerated and serve chilled, stirring before consumption if separation occurs."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Passion Fruit Juice"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 10m | Cook: 5m
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
            Passion Fruit Juice is a vibrant and refreshing tropical beverage made
            from the pulp of the Maracujá fruit. Known for its intense aroma and
            tangy-sweet flavor, this juice is packed with vitamins and antioxidants,
            making it both delicious and nutritious. Perfect for hot days or as a
            revitalizing drink anytime, it combines natural sweetness with a hint of
            citrus to awaken the palate.
          </p>
          <p>
            The passion fruit, native to South America, has been enjoyed for centuries
            by indigenous peoples and later embraced worldwide for its unique taste
            and health benefits. Traditionally consumed fresh or as a juice, it has
            become a staple in tropical cuisines and beverages, celebrated for its
            versatility and exotic flair.
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
              Prepare the Passion Fruit Pulp
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cut the passion fruits in half and scoop out the pulp with a spoon. If
              you prefer a smoother juice, strain the pulp through a fine mesh sieve
              to remove seeds, or leave them in for added texture and fiber.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Mix Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large pitcher, combine the passion fruit pulp, filtered water,
              granulated sugar, fresh lime juice, and a pinch of salt. Stir well
              until the sugar dissolves completely. Add honey or vanilla extract if
              using, to enhance sweetness and aroma.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Optional Flavors
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              For a tropical twist, stir in coconut water or fresh orange juice.
              Add freshly grated ginger juice for a subtle spicy note. Mint leaves
              can be muddled or added whole for freshness.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Chill and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add ice cubes and stir well. For a sparkling version, add sparkling
              water just before serving to maintain fizz. Garnish with mint leaves or
              a slice of lime for presentation.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Enjoy Fresh
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve immediately for the best flavor and nutritional benefits. If
              storing, keep refrigerated and consume within 24 hours. Stir before
              serving as natural separation may occur.
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
            Use ripe passion fruits with wrinkled skin for the sweetest and most
            aromatic pulp.
          </li>
          <li>
            If you prefer a pulpier texture, blend the pulp lightly before mixing with
            water.
          </li>
          <li>
            Adjust sweetness gradually; passion fruit has natural tartness that pairs
            well with balanced sugar levels.
          </li>
          <li>
            For a refreshing summer drink, freeze the juice into ice cubes and blend
            into a slushy.
          </li>
          <li>
            Adding a pinch of salt enhances the natural flavors and balances acidity.
          </li>
          <li>
            Experiment with herbs like basil or cilantro for unique flavor profiles.
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
              href="https://en.wikipedia.org/wiki/Passion_fruit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Passion Fruit
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.healthline.com/nutrition/passion-fruit-benefits"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Healthline: Passion Fruit Benefits
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/plant/passionflower"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Passionflower Plant
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