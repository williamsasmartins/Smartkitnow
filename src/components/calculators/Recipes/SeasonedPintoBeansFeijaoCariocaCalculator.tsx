import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SeasonedPintoBeansFeijaoCariocaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Seasoned%20Pinto%20Beans%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=340"
  );

  // --- DATA ---
  const title = "Seasoned Pinto Beans";
  const description = "Popular pinto beans cooked with traditional Brazilian spices.";

  // INGREDIENTS
  const ingredients = [
    { name: "Pinto Beans (Feijão Carioca)", baseAmount: 500, unit: "g" },
    { name: "Water", baseAmount: 1200, unit: "ml" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Bay Leaves", baseAmount: 2, unit: "leaves" },
    { name: "Smoked Paprika", baseAmount: 1, unit: "tsp" },
    { name: "Ground Cumin", baseAmount: 1, unit: "tsp" },
    { name: "Fresh Cilantro, chopped", baseAmount: 15, unit: "g" },
    { name: "Olive Oil", baseAmount: 2, unit: "tbsp" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh Lime Juice", baseAmount: 1, unit: "tbsp" },
    { name: "Chopped Tomatoes (optional)", baseAmount: 150, unit: "g" },
    { name: "Green Chili (optional), finely chopped", baseAmount: 1, unit: "small" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "280",
    protein: "18g",
    carbs: "45g",
    fat: "5g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use canned pinto beans instead of dried beans?",
      answer:
        "Yes, canned pinto beans can be used to save time. Rinse them well before cooking and adjust the cooking time accordingly, as canned beans require less cooking. However, dried beans provide a better texture and flavor when properly soaked and cooked.",
    },
    {
      question: "How long should I soak the pinto beans before cooking?",
      answer:
        "Soaking pinto beans for at least 6 to 8 hours or overnight helps reduce cooking time and improves digestibility. If you're short on time, a quick soak method involves boiling the beans for 2 minutes, then letting them soak for 1 hour before cooking.",
    },
    {
      question: "What spices are essential for authentic Brazilian seasoned pinto beans?",
      answer:
        "Traditional Brazilian seasoned pinto beans often include bay leaves, garlic, onions, cumin, and smoked paprika. Fresh cilantro and lime juice are added at the end for brightness. These spices create a rich, earthy, and slightly smoky flavor profile characteristic of Feijão Carioca.",
    },
    {
      question: "Can I make this recipe vegan or vegetarian?",
      answer:
        "Absolutely! This recipe is naturally vegan and vegetarian as it uses plant-based ingredients. To enhance flavor, you can add vegetable broth instead of water or include sautéed vegetables like bell peppers and carrots.",
    },
    {
      question: "How do I store leftover seasoned pinto beans?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 4 days. Pinto beans also freeze well; portion them into freezer-safe containers and freeze for up to 3 months. Reheat gently on the stove or microwave, adding a splash of water if needed.",
    },
    {
      question: "What dishes pair well with seasoned pinto beans?",
      answer:
        "Seasoned pinto beans pair wonderfully with rice, grilled meats, sautéed greens, and fresh salads. They are a staple side dish in Brazilian cuisine and complement dishes like feijoada, churrasco, and farofa.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Seasoned Pinto Beans"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 90m
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
            Seasoned Pinto Beans, or Feijão Carioca, is a beloved staple in Brazilian
            cuisine. This hearty dish features tender pinto beans simmered slowly with
            aromatic spices, fresh herbs, and a touch of acidity to brighten the flavors.
            It is often served alongside rice and complements a variety of traditional
            Brazilian meals.
          </p>
          <p>
            Pinto beans have been cultivated in Brazil for centuries, becoming a dietary
            cornerstone due to their affordability, nutrition, and versatility. The
            seasoning blend used in this recipe reflects the rich cultural influences
            of Brazil, combining indigenous ingredients with Portuguese and African
            culinary traditions.
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
              Soak the Beans
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the pinto beans thoroughly and soak them in cold water for at least 6
              hours or overnight. This softens the beans and reduces cooking time.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Aromatics
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large pot, heat olive oil over medium heat. Sauté the chopped onion,
              garlic, and optional green chili until softened and fragrant, about 5
              minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Beans
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Drain the soaked beans and add them to the pot along with water, bay leaves,
              smoked paprika, cumin, and chopped tomatoes if using. Bring to a boil,
              then reduce heat and simmer gently, partially covered, for about 1 to 1.5
              hours or until beans are tender.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Season and Finish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add salt and black pepper to taste during the last 15 minutes of cooking.
              Remove bay leaves, stir in fresh cilantro and lime juice just before
              serving to add brightness and freshness.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Enjoy
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the seasoned pinto beans hot alongside steamed rice, grilled meats,
              or sautéed vegetables for a comforting and nutritious meal.
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
            For a creamier texture, mash some of the beans against the side of the pot
            during the last 10 minutes of cooking.
          </li>
          <li>
            Adding a smoked ham hock or bacon can deepen the flavor, but keep it
            vegetarian by using smoked paprika and vegetable broth.
          </li>
          <li>
            If you prefer a thicker sauce, simmer uncovered for the last 20 minutes to
            reduce excess liquid.
          </li>
          <li>
            Fresh lime juice added at the end brightens the dish and balances the earthiness
            of the beans.
          </li>
          <li>
            Store leftovers with a drizzle of olive oil on top to keep beans moist and
            flavorful.
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
              href="https://en.wikipedia.org/wiki/Feijão"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Feijão (Brazilian Beans)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/Brazilian-cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Brazilian Cuisine Overview
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