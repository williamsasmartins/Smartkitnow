import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function GarlicShrimpBrazilianStyleCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Garlic%20Shrimp%20BrazilianStyle%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3573"
  );

  // --- DATA ---
  const title = "Garlic Shrimp (Brazilian-Style)";
  const description = "Pan-seared tiger shrimp with extra garlic and fresh parsley.";

  // INGREDIENTS
  const ingredients = [
    { name: "Tiger Shrimp (peeled, deveined)", baseAmount: 500, unit: "g" },
    { name: "Garlic (minced)", baseAmount: 8, unit: "cloves" },
    { name: "Olive Oil", baseAmount: 3, unit: "tbsp" },
    { name: "Butter", baseAmount: 2, unit: "tbsp" },
    { name: "Fresh Parsley (chopped)", baseAmount: 3, unit: "tbsp" },
    { name: "Lemon Juice (freshly squeezed)", baseAmount: 2, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper (freshly ground)", baseAmount: 0.5, unit: "tsp" },
    { name: "Red Pepper Flakes (optional)", baseAmount: 0.25, unit: "tsp" },
    { name: "White Wine (dry)", baseAmount: 50, unit: "ml" },
    { name: "Green Onions (sliced)", baseAmount: 2, unit: "tbsp" },
    { name: "Fresh Cilantro (chopped)", baseAmount: 2, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "280",
    protein: "30g",
    carbs: "3g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of shrimp is best for this recipe?",
      answer:
        "For authentic Brazilian-style garlic shrimp, tiger shrimp or large white shrimp are ideal due to their firm texture and ability to hold up well during quick pan-searing. Fresh or thawed shrimp work best to ensure optimal flavor and texture.",
    },
    {
      question: "Can I prepare this recipe without butter?",
      answer:
        "Yes, you can substitute butter with additional olive oil or a plant-based butter alternative if you prefer a dairy-free version. However, butter adds a rich flavor and silky texture that complements the garlic and shrimp beautifully.",
    },
    {
      question: "How do I prevent the shrimp from overcooking?",
      answer:
        "Shrimp cook very quickly, usually within 2-3 minutes per side. To avoid overcooking, use medium-high heat and watch for the shrimp to turn pink and opaque. Remove them promptly from the pan once cooked to maintain tenderness.",
    },
    {
      question: "What can I serve alongside Brazilian-style garlic shrimp?",
      answer:
        "This dish pairs wonderfully with white rice, crusty bread to soak up the garlicky sauce, or a fresh green salad. You can also serve it with Brazilian sides like farofa (toasted cassava flour) or sautéed vegetables for a complete meal.",
    },
    {
      question: "Is it possible to make this recipe spicy?",
      answer:
        "Absolutely! Adding red pepper flakes or finely chopped fresh chili peppers during cooking will give the dish a pleasant heat. Adjust the amount to your spice tolerance to enhance the flavor without overpowering the garlic.",
    },
    {
      question: "Can I prepare this recipe ahead of time?",
      answer:
        "While the shrimp are best served immediately after cooking for optimal texture and flavor, you can prepare the garlic butter sauce and chopped herbs in advance. Cook the shrimp just before serving to maintain their juiciness.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Garlic Shrimp (Brazilian-Style)"
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
            Garlic Shrimp (Brazilian-Style) is a vibrant and aromatic dish that
            highlights the bold flavors of fresh garlic, succulent tiger shrimp,
            and zesty lemon juice. This pan-seared recipe is quick to prepare,
            making it perfect for a flavorful weeknight dinner or an impressive
            appetizer for guests. The generous use of garlic and fresh herbs
            creates a rich, savory sauce that perfectly complements the natural
            sweetness of the shrimp.
          </p>
          <p>
            Originating from Brazil’s coastal regions, this dish reflects the
            country’s love for seafood and bold seasonings. Brazilian cuisine is
            known for its fusion of indigenous, African, and Portuguese influences,
            and garlic shrimp is a testament to this culinary heritage. Traditionally
            served with rice or crusty bread, it embodies the warmth and vibrancy
            of Brazilian home cooking.
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
              Prepare the Shrimp
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the tiger shrimp under cold water and pat dry with paper towels.
              Season them lightly with salt and freshly ground black pepper. Set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté Garlic and Aromatics
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil and butter in a large skillet over medium heat. Add
              the minced garlic and sauté gently until fragrant and golden, about 1-2 minutes.
              Avoid burning the garlic to prevent bitterness.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Shrimp
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Increase heat to medium-high and add the shrimp to the skillet in a
              single layer. Cook for 2-3 minutes per side until shrimp turn pink and
              opaque. Avoid overcrowding the pan to ensure even cooking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Deglaze and Finish the Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the white wine and lemon juice, scraping the bottom of the pan
              to release any browned bits. Let the sauce simmer for 1-2 minutes until
              slightly reduced. Stir in chopped parsley, green onions, and cilantro.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve Immediately
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the shrimp and sauce to a serving dish. Garnish with extra
              parsley if desired. Serve hot with rice, bread, or your favorite side.
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
            Use fresh, high-quality shrimp for the best texture and flavor. Frozen
            shrimp can be used but thaw completely and pat dry to avoid excess moisture.
          </li>
          <li>
            To intensify the garlic flavor, lightly crush the garlic cloves before
            mincing to release more oils.
          </li>
          <li>
            Avoid overcrowding the pan when cooking shrimp; cook in batches if necessary
            to ensure even searing.
          </li>
          <li>
            If you prefer a creamier sauce, add a splash of heavy cream or coconut milk
            after deglazing with wine.
          </li>
          <li>
            Garnish with fresh herbs like cilantro and parsley for a bright, fresh finish.
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
              href="https://www.saveur.com/article/Recipes/Brazilian-Garlic-Shrimp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Brazilian Garlic Shrimp Recipe
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