import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function FreshCoconutWaterCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Coconut%20Water%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6453"
  );

  // --- DATA ---
  const title = "Coconut Water";
  const description = "Pure, chilled water served directly from a green coconut.";

  // INGREDIENTS
  const ingredients = [
    { name: "Fresh young green coconut water", baseAmount: 500, unit: "ml" },
    { name: "Ice cubes", baseAmount: 100, unit: "g" },
    { name: "Fresh mint leaves", baseAmount: 5, unit: "g" },
    { name: "Lime wedges", baseAmount: 2, unit: "pieces" },
    { name: "Honey or agave syrup (optional)", baseAmount: 10, unit: "ml" },
    { name: "Chia seeds (optional)", baseAmount: 5, unit: "g" },
    { name: "Fresh ginger slices", baseAmount: 3, unit: "g" },
    { name: "Sea salt pinch", baseAmount: 0.5, unit: "g" },
    { name: "Fresh pineapple chunks (optional)", baseAmount: 30, unit: "g" },
    { name: "Cucumber slices (optional)", baseAmount: 20, unit: "g" },
    { name: "Fresh basil leaves (optional)", baseAmount: 3, unit: "g" },
    { name: "Sparkling water (optional)", baseAmount: 100, unit: "ml" },
    { name: "Lemon zest (optional)", baseAmount: 1, unit: "g" },
    { name: "Edible flower petals (for garnish)", baseAmount: 1, unit: "g" },
  ];

  const nutrition = { calories: "19", protein: "0.7g", carbs: "4.5g", fat: "0.2g" };

  // --- LOGIC ---
  const getAmount = (base: number) => (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What are the health benefits of drinking fresh coconut water?",
      answer:
        "Fresh coconut water is a natural isotonic beverage rich in electrolytes such as potassium, magnesium, and calcium. It helps with hydration, supports heart health, aids digestion, and contains antioxidants that combat free radicals. It is low in calories and fat, making it a healthy alternative to sugary drinks.",
    },
    {
      question: "How do I select the best coconut for extracting water?",
      answer:
        "Choose young green coconuts that feel heavy for their size and have a smooth, unblemished outer shell. The water inside should be clear and slightly sweet. Avoid coconuts with cracks, mold, or a sour smell, as these indicate spoilage.",
    },
    {
      question: "Can I store fresh coconut water, and how long does it last?",
      answer:
        "Fresh coconut water is best consumed immediately for optimal flavor and nutrient retention. If storing, keep it refrigerated in an airtight container and consume within 24 to 48 hours. Avoid freezing as it can alter the taste and texture.",
    },
    {
      question: "Are there any variations or flavor enhancements recommended?",
      answer:
        "Yes, you can enhance coconut water by adding fresh lime or lemon juice, mint leaves, ginger slices, or a touch of natural sweeteners like honey or agave syrup. For a refreshing twist, mix with sparkling water or add chia seeds for texture and extra nutrients.",
    },
    {
      question: "Is coconut water suitable for all age groups and dietary needs?",
      answer:
        "Generally, coconut water is safe and beneficial for most people, including children and adults. It is naturally gluten-free, vegan, and low in calories. However, individuals with kidney problems or those on potassium-restricted diets should consult a healthcare professional before consuming large amounts.",
    },
    {
      question: "How does fresh coconut water compare to commercial packaged coconut water?",
      answer:
        "Fresh coconut water is free from preservatives, added sugars, and artificial flavors, offering a pure and natural taste. Commercial packaged coconut water may contain additives and undergo pasteurization, which can affect flavor and nutrient content. Fresh is always preferable when available.",
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
    keywords: "coconut water, fresh coconut water, brazilian drink, healthy hydration, electrolyte drink",
    recipeIngredient: ingredients.map(ing => `${getAmount(ing.baseAmount)}${ing.unit} ${ing.name}`),
    recipeInstructions: [
      "Use a sharp knife or cleaver to carefully slice the top of the young green coconut.",
      "Extract the water by pouring it through a fine mesh sieve into a clean container.",
      "Optionally stir in fresh mint leaves, lime wedges, or a touch of natural sweetener like honey.",
      "Add ice cubes to the coconut water or refrigerate for 30 minutes before serving.",
      "Serve immediately for maximum freshness and flavor."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Coconut Water"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 10m | Serve: Immediate
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
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setServings((s) => Math.max(1, s - 1))}>
                -
              </Button>
              <span className="w-6 text-center font-bold text-lg">{servings}</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setServings((s) => s + 1)}>
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
            Coconut water is nature’s refreshing gift, extracted from young, green coconuts before they mature into the familiar brown shell. This clear, slightly sweet liquid is prized for its hydrating properties and subtle tropical flavor. Served chilled and pure, it offers a revitalizing experience that is both simple and elegant.
          </p>
          <p>
            Historically, coconut water has been consumed for centuries in tropical regions across Asia, the Pacific Islands, and the Caribbean. It was traditionally used not only as a thirst quencher but also as a natural remedy for dehydration and electrolyte imbalance. Today, it enjoys global popularity as a natural sports drink and wellness elixir.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Coconut</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Using a sharp knife or cleaver, carefully slice the top of the young green coconut to expose the water inside. Alternatively, use a coconut opener tool for safety and precision.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Extract the Water</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the coconut water through a fine mesh sieve into a clean container to remove any bits of shell or husk.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Flavor Enhancements (Optional)</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in fresh mint leaves, lime wedges, or a small amount of honey or agave syrup to taste. For a textured drink, add chia seeds and let them soak for 5 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Chill and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add ice cubes to the coconut water or refrigerate for at least 30 minutes before serving. Garnish with edible flower petals or fresh basil leaves for an elegant presentation.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Enjoy Immediately</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Fresh coconut water is best enjoyed immediately to savor its natural sweetness and nutritional benefits.
            </p>
          </li>
        </ol>
      </section>

      <section className="bg-amber-50 dark:bg-amber-950/20 p-8 rounded-2xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-xl mb-4 text-amber-900 dark:text-amber-100 flex items-center gap-2">
          <Flame className="h-6 w-6 text-amber-500" /> Chef's Tips
        </h3>
        <ul className="list-disc pl-5 space-y-3 text-amber-900 dark:text-amber-100 text-base">
          <li>Use young green coconuts for the freshest and sweetest water; mature brown coconuts have less water and a different flavor profile.</li>
          <li>Chill coconuts in the refrigerator before opening to enhance the refreshing taste.</li>
          <li>For a sparkling twist, mix fresh coconut water with chilled sparkling water just before serving.</li>
          <li>Adding a pinch of sea salt can enhance the natural sweetness and balance flavors.</li>
          <li>Use a clean, sharp knife or specialized coconut opener to avoid accidents and preserve the coconut’s integrity.</li>
          <li>Consume fresh coconut water within 24 hours to enjoy maximum freshness and avoid fermentation.</li>
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
              href="https://en.wikipedia.org/wiki/Coconut_water"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Coconut Water
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5452229/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              NCBI: Nutritional and Health Benefits of Coconut Water
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.healthline.com/nutrition/coconut-water-benefits"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Healthline: Coconut Water Benefits and Uses
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