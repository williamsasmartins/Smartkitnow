import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ShrimpScampiCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Shrimp%20Scampi%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1970"
  );

  // --- DATA ---
  const title = "Shrimp Scampi";
  const description = "Shrimp sautéed in garlic, butter, white wine, and lemon.";

  // INGREDIENTS
  const ingredients = [
    { name: "Large Shrimp (peeled and deveined)", baseAmount: 500, unit: "g" },
    { name: "Unsalted Butter", baseAmount: 60, unit: "g" },
    { name: "Extra Virgin Olive Oil", baseAmount: 2, unit: "tbsp" },
    { name: "Garlic (minced)", baseAmount: 4, unit: "cloves" },
    { name: "Dry White Wine", baseAmount: 120, unit: "ml" },
    { name: "Fresh Lemon Juice", baseAmount: 30, unit: "ml" },
    { name: "Red Pepper Flakes", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh Parsley (chopped)", baseAmount: 15, unit: "g" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper (freshly ground)", baseAmount: 0.5, unit: "tsp" },
    { name: "Spaghetti or Linguine (optional)", baseAmount: 320, unit: "g" },
    { name: "Grated Parmesan Cheese (optional)", baseAmount: 30, unit: "g" },
  ];

  // Nutrition values per 4 servings (approximate)
  const nutrition = {
    calories: "520",
    protein: "45g",
    carbs: "30g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of shrimp is best for Shrimp Scampi?",
      answer:
        "Large or jumbo shrimp that are peeled and deveined work best for Shrimp Scampi. Fresh or high-quality frozen shrimp can be used, but ensure they are properly thawed and patted dry to get a good sear.",
    },
    {
      question: "Can I make Shrimp Scampi without wine?",
      answer:
        "Yes, if you prefer not to use wine, you can substitute it with low-sodium chicken broth or seafood stock. This will maintain the moisture and add flavor, though the taste will be slightly different.",
    },
    {
      question: "How do I prevent the shrimp from becoming rubbery?",
      answer:
        "Shrimp cook very quickly, usually 2-3 minutes per side. Overcooking causes them to become tough and rubbery. Cook shrimp just until they turn pink and opaque, then remove them promptly from the heat.",
    },
    {
      question: "Is Shrimp Scampi traditionally served with pasta?",
      answer:
        "Yes, Shrimp Scampi is often served over linguine or spaghetti to soak up the flavorful garlic butter sauce. However, it can also be served with crusty bread or over rice for a lighter or gluten-free option.",
    },
    {
      question: "Can I prepare Shrimp Scampi ahead of time?",
      answer:
        "While the sauce can be prepared ahead, shrimp are best cooked fresh to maintain their texture and flavor. You can prep ingredients in advance and cook the shrimp just before serving for optimal taste.",
    },
    {
      question: "What wine pairs well with Shrimp Scampi?",
      answer:
        "A crisp, dry white wine such as Sauvignon Blanc, Pinot Grigio, or Chardonnay pairs beautifully with Shrimp Scampi, complementing the garlic and lemon flavors without overpowering the dish.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Shrimp Scampi"
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
            Shrimp Scampi is a classic Italian-American dish that features succulent shrimp sautéed in a luscious sauce of garlic, butter, white wine, and fresh lemon juice. This dish is beloved for its bright, vibrant flavors and quick preparation time, making it a perfect weeknight dinner or an elegant meal for guests.
          </p>
          <p>
            Originating from Italian coastal cuisine, "scampi" traditionally refers to langoustines, but in the U.S., it has come to mean shrimp prepared in this style. The dish combines simple, fresh ingredients to create a rich yet light sauce that perfectly complements the natural sweetness of the shrimp.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Shrimp</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the shrimp under cold water and pat dry with paper towels. If not already done, peel and devein the shrimp, leaving the tails on or off as preferred.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté Garlic and Red Pepper Flakes</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large skillet, melt the butter with olive oil over medium heat. Add the minced garlic and red pepper flakes, cooking gently until fragrant but not browned, about 1-2 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Shrimp</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the shrimp to the skillet in a single layer. Cook for 2-3 minutes on each side until they turn pink and opaque. Avoid overcrowding the pan to ensure even cooking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Deglaze and Finish the Sauce</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the white wine and lemon juice, scraping the bottom of the pan to release any browned bits. Let the sauce simmer for 2-3 minutes to reduce slightly and meld the flavors.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Parsley and Season</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the chopped parsley, salt, and freshly ground black pepper. Taste and adjust seasoning as needed. Remove from heat.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve immediately over cooked pasta or with crusty bread. Optionally, sprinkle with grated Parmesan cheese for extra richness.
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
            Use fresh garlic for the best flavor; avoid pre-minced garlic which can taste bitter when cooked.
          </li>
          <li>
            Pat shrimp dry before cooking to ensure a nice sear and prevent steaming.
          </li>
          <li>
            If you prefer a thicker sauce, add a teaspoon of cornstarch slurry to the pan after deglazing and simmer until thickened.
          </li>
          <li>
            For a richer flavor, finish the sauce with a splash of heavy cream or a knob of cold butter off the heat.
          </li>
          <li>
            Customize the heat level by adjusting the amount of red pepper flakes or omitting them altogether.
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
              href="https://en.wikipedia.org/wiki/Italian_cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: History of this Dish
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/Italian-cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Culinary Reference
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
