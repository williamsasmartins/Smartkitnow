import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function SugarcaneJuiceCaldoDeCanaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Sugarcane%20Juice%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2853"
  );

  // --- DATA ---
  const title = "Sugarcane Juice";
  const description = "Sweet, fresh juice pressed from raw sugarcane stalks.";

  // INGREDIENTS
  const ingredients = [
    { name: "Fresh Sugarcane Stalks", baseAmount: 500, unit: "g" },
    { name: "Fresh Lime Juice", baseAmount: 30, unit: "ml" },
    { name: "Cold Water", baseAmount: 100, unit: "ml" },
    { name: "Ice Cubes", baseAmount: 150, unit: "g" },
    { name: "Mint Leaves (optional)", baseAmount: 5, unit: "g" },
    { name: "Ginger (fresh, peeled)", baseAmount: 10, unit: "g" },
    { name: "Honey or Cane Sugar (optional)", baseAmount: 15, unit: "g" },
    { name: "Salt (a pinch)", baseAmount: 1, unit: "g" },
    { name: "Lemon Slices (for garnish)", baseAmount: 2, unit: "slices" },
    { name: "Chopped Ice (for serving)", baseAmount: 100, unit: "g" },
    { name: "Fresh Basil Leaves (optional)", baseAmount: 3, unit: "g" },
    { name: "Black Pepper (a pinch)", baseAmount: 0.5, unit: "g" },
  ];

  // Nutrition values are approximate per 250ml serving
  const nutrition = {
    calories: "90",
    protein: "0.2g",
    carbs: "22g",
    fat: "0g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the best way to extract juice from sugarcane?",
      answer:
        "The best way to extract juice from sugarcane is by using a mechanical sugarcane juicer or crusher. These machines efficiently press the fibrous stalks to release fresh juice without losing flavor or nutrients. If unavailable, you can peel and chop the sugarcane into small pieces and blend with water, then strain through a fine sieve or cheesecloth to separate the juice from the pulp.",
    },
    {
      question: "How should sugarcane juice be stored to maintain freshness?",
      answer:
        "Sugarcane juice is highly perishable and should be consumed fresh for the best taste and nutritional benefits. If storing, keep it in an airtight container in the refrigerator and consume within 24 hours. Adding a few drops of lemon or lime juice can help slow oxidation and preserve freshness.",
    },
    {
      question: "Can sugarcane juice be consumed by people with diabetes?",
      answer:
        "Sugarcane juice contains natural sugars and carbohydrates, so people with diabetes should consume it in moderation and monitor their blood sugar levels. It is advisable to consult a healthcare professional before including sugarcane juice regularly in a diabetic diet.",
    },
    {
      question: "What are the health benefits of drinking sugarcane juice?",
      answer:
        "Sugarcane juice is rich in antioxidants, vitamins, and minerals such as calcium, magnesium, potassium, and iron. It helps in hydration, boosts energy, supports liver function, and may aid digestion. Additionally, its natural sugars provide a quick energy boost without processed additives.",
    },
    {
      question: "Are there any common additives or flavorings used in sugarcane juice recipes?",
      answer:
        "Yes, common additives include fresh lime or lemon juice to add tanginess and balance sweetness, ginger for a spicy kick, mint or basil leaves for freshness, and a pinch of salt to enhance flavor. Some recipes also use honey or cane sugar to adjust sweetness according to taste.",
    },
    {
      question: "Is sugarcane juice safe for children and pregnant women?",
      answer:
        "Generally, fresh sugarcane juice is safe for children and pregnant women when consumed in moderation and prepared hygienically. However, it is important to ensure the juice is fresh and free from contamination to avoid any risk of foodborne illness. Consulting a healthcare provider is recommended if there are any concerns.",
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
    keywords: "sugarcane juice, caldo de cana, garapa, brazilian juice, fresh juice, natural energy",
    recipeIngredient: ingredients.map(ing => `${getAmount(ing.baseAmount)}${ing.unit} ${ing.name}`),
    recipeInstructions: [
      "Thoroughly wash and peel tough outer layer of sugarcane stalks.",
      "Extract juice using a sugarcane juicer or by blending chopped pieces with water and straining.",
      "Stir in lime juice, grated ginger, and a pinch of salt to taste.",
      "Add ice cubes or crushed ice to the juice and stir well.",
      "Garnish with mind or basil and lemon slices. Serve immediately."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Sugarcane Juice"
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
            Sugarcane juice, known as "caldo de cana" in Portuguese and "garapa" in Spanish, is a
            refreshing and naturally sweet beverage extracted from freshly pressed sugarcane stalks.
            Celebrated for its vibrant flavor and hydrating qualities, this juice is a popular street
            drink in tropical regions around the world. Its natural sweetness and subtle grassy notes
            make it a perfect thirst quencher on hot days.
          </p>
          <p>
            Historically, sugarcane cultivation dates back thousands of years to Southeast Asia and
            the Indian subcontinent, where it was prized not only for sugar production but also for
            its juice. The tradition of drinking fresh sugarcane juice spread globally through trade
            and colonization, becoming a beloved staple in countries such as Brazil, India, Egypt,
            and the Caribbean. Today, it remains a symbol of natural refreshment and cultural heritage.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Sugarcane</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Wash the sugarcane stalks thoroughly to remove any dirt. Peel off the tough outer
              layer using a sharp knife or vegetable peeler. Cut the peeled stalks into small pieces
              that fit your juicer or blender.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Extract the Juice</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              If using a sugarcane juicer, feed the pieces through the machine to extract fresh juice.
              If using a blender, blend the sugarcane pieces with cold water until smooth, then strain
              through a fine sieve or cheesecloth to separate the juice from the pulp.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Flavorings</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in fresh lime juice, peeled and grated ginger, and a pinch of salt to enhance the
              flavor. Optionally, add honey or cane sugar if you prefer a sweeter taste. Mix well.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Chill and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add ice cubes or crushed ice to the juice and stir well. Garnish with fresh mint or basil
              leaves and lemon slices. Serve immediately for the freshest taste.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Clean Up</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Clean your juicer or blender promptly to prevent sugarcane residue from hardening.
              Store any leftover juice in an airtight container in the refrigerator and consume within 24 hours.
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
            Use freshly peeled sugarcane for the sweetest and most aromatic juice; older stalks can
            be fibrous and less juicy.
          </li>
          <li>
            Adding a small pinch of salt balances the sweetness and enhances the overall flavor profile.
          </li>
          <li>
            For a spicy twist, add a small amount of freshly grated ginger or a dash of black pepper.
          </li>
          <li>
            Always serve sugarcane juice chilled with plenty of ice to maximize refreshment.
          </li>
          <li>
            If you don’t have a sugarcane juicer, blending and straining is a good alternative but may
            yield less juice and more pulp.
          </li>
          <li>
            Consume sugarcane juice fresh as it oxidizes quickly and can ferment if left out at room temperature.
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
              href="https://en.wikipedia.org/wiki/Sugarcane_juice"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Sugarcane Juice
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/sugarcane"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Sugarcane Overview
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.healthline.com/nutrition/sugarcane-juice-benefits"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Healthline: Benefits of Sugarcane Juice
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