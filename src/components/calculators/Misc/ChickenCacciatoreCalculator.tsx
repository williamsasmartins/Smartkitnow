import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ChickenCacciatoreCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Chicken%20Cacciatore%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=7564"
  );

  // --- DATA ---
  const title = "Chicken Cacciatore";
  const description = "Braised chicken with tomatoes, peppers, onions, and herbs.";

  // INGREDIENTS
  const ingredients = [
    { name: "Chicken thighs (bone-in, skin-on)", baseAmount: 800, unit: "g" },
    { name: "Olive oil", baseAmount: 3, unit: "tbsp" },
    { name: "Yellow onion, sliced", baseAmount: 1, unit: "medium" },
    { name: "Red bell pepper, sliced", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 4, unit: "cloves" },
    { name: "Canned diced tomatoes", baseAmount: 400, unit: "g" },
    { name: "Tomato paste", baseAmount: 2, unit: "tbsp" },
    { name: "Dry white wine", baseAmount: 120, unit: "ml" },
    { name: "Chicken broth", baseAmount: 120, unit: "ml" },
    { name: "Dried oregano", baseAmount: 1, unit: "tsp" },
    { name: "Dried basil", baseAmount: 1, unit: "tsp" },
    { name: "Fresh rosemary, chopped", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black pepper", baseAmount: 1, unit: "tsp" },
    { name: "Fresh parsley, chopped (for garnish)", baseAmount: 2, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "38g",
    carbs: "10g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cut of chicken is best for Chicken Cacciatore?",
      answer:
        "Chicken thighs, especially bone-in and skin-on, are preferred for Chicken Cacciatore because they stay moist and tender during braising, and the skin adds flavor and richness to the sauce. However, chicken breasts can be used for a leaner option but may require careful cooking to avoid drying out.",
    },
    {
      question: "Can I make Chicken Cacciatore in a slow cooker?",
      answer:
        "Yes, Chicken Cacciatore adapts well to slow cooking. Brown the chicken and sauté the vegetables first for best flavor, then combine all ingredients in the slow cooker and cook on low for 6-8 hours or on high for 3-4 hours until the chicken is tender and the sauce is rich.",
    },
    {
      question: "What can I serve with Chicken Cacciatore?",
      answer:
        "Chicken Cacciatore pairs beautifully with a variety of sides such as creamy polenta, buttery mashed potatoes, crusty Italian bread, or cooked pasta like pappardelle or spaghetti to soak up the delicious sauce.",
    },
    {
      question: "How do I store and reheat leftovers?",
      answer:
        "Store leftover Chicken Cacciatore in an airtight container in the refrigerator for up to 3 days. Reheat gently on the stovetop over low heat or in the microwave until warmed through. The flavors often deepen after resting overnight.",
    },
    {
      question: "Can I substitute fresh herbs for dried herbs in this recipe?",
      answer:
        "Yes, fresh herbs can be used instead of dried herbs. Use about three times the amount of fresh herbs compared to dried to maintain the same flavor intensity. Add fresh herbs towards the end of cooking to preserve their bright flavors.",
    },
    {
      question: "Is Chicken Cacciatore gluten-free?",
      answer:
        "This recipe is naturally gluten-free as it uses whole ingredients without any wheat-based thickeners or additives. Always check labels on canned tomatoes and broth to ensure they are gluten-free if you have sensitivities.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Chicken Cacciatore"
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
            Chicken Cacciatore, meaning "hunter-style chicken" in Italian, is a
            rustic and hearty dish featuring braised chicken simmered with
            tomatoes, bell peppers, onions, garlic, and aromatic herbs. This
            comforting meal is beloved for its rich flavors and tender meat,
            perfect for family dinners or special occasions.
          </p>
          <p>
            Originating from the Italian countryside, particularly Tuscany and
            Sicily, Chicken Cacciatore was traditionally prepared by hunters
            using locally available ingredients. The dish showcases the Italian
            philosophy of simple, fresh ingredients combined to create deeply
            satisfying flavors.
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
              Prepare the Chicken
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pat the chicken thighs dry with paper towels and season generously
              with salt and pepper. This helps achieve a crispy skin and flavorful
              meat.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Brown the Chicken
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a large skillet or Dutch oven over medium-high heat.
              Add chicken skin-side down and brown until golden and crisp, about 5-7
              minutes per side. Remove and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté Vegetables
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In the same pan, add sliced onions, red bell peppers, and garlic.
              Cook until softened and fragrant, about 5 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Deglaze and Add Liquids
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in tomato paste and cook for 1 minute. Pour in white wine to
              deglaze the pan, scraping up browned bits. Add diced tomatoes and
              chicken broth, then stir in oregano, basil, rosemary, salt, and pepper.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Simmer the Chicken
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Return the chicken to the pan, skin-side up, nestling it into the sauce.
              Cover and simmer gently over low heat for 30-40 minutes until the chicken
              is cooked through and tender.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Garnish and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Sprinkle freshly chopped parsley over the dish before serving. Enjoy
              with your choice of sides such as pasta, polenta, or crusty bread.
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
            For extra depth, marinate the chicken in white wine and herbs for 1-2
            hours before cooking.
          </li>
          <li>
            Browning the chicken well is key to developing rich flavors in the sauce.
          </li>
          <li>
            Use good quality canned tomatoes for a vibrant and balanced sauce.
          </li>
          <li>
            If you prefer a thicker sauce, remove the lid during the last 10 minutes
            of cooking to reduce the liquid.
          </li>
          <li>
            Leftovers taste even better the next day as the flavors meld beautifully.
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
