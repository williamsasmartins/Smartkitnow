import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function BrazilianBlackBeansCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Black%20Beans%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1701"
  );

  // --- DATA ---
  const title = "Brazilian Black Beans";
  const description = "Creamy seasoned black beans, the staple of every Brazilian meal.";

  // INGREDIENTS
  const ingredients = [
    { name: "Dried Black Beans", baseAmount: 500, unit: "g" },
    { name: "Water", baseAmount: 1500, unit: "ml" },
    { name: "Olive Oil", baseAmount: 3, unit: "tbsp" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic Cloves, minced", baseAmount: 4, unit: "cloves" },
    { name: "Bay Leaves", baseAmount: 2, unit: "leaves" },
    { name: "Smoked Bacon, diced", baseAmount: 100, unit: "g" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Cumin Powder", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh Cilantro, chopped", baseAmount: 2, unit: "tbsp" },
    { name: "Green Chili, sliced (optional)", baseAmount: 1, unit: "small" },
    { name: "Orange Juice", baseAmount: 50, unit: "ml" },
    { name: "Sugar", baseAmount: 0.5, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "320",
    protein: "21g",
    carbs: "45g",
    fat: "7g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the best way to soak black beans for this recipe?",
      answer:
        "For optimal texture and digestibility, soak dried black beans in cold water for at least 8 hours or overnight. This helps reduce cooking time and improves the beans' softness. If short on time, a quick soak method involves boiling the beans for 2 minutes, then letting them sit covered for 1 hour before cooking.",
    },
    {
      question: "Can I make Brazilian black beans without smoked bacon?",
      answer:
        "Absolutely! While smoked bacon adds a rich, smoky depth typical in traditional recipes, you can omit it for a vegetarian version. To compensate, consider adding smoked paprika or liquid smoke for that smoky flavor. Also, sautéing the onions and garlic in olive oil with a pinch of smoked spices enhances the taste.",
    },
    {
      question: "How do I achieve the creamy texture typical of Brazilian black beans?",
      answer:
        "The creamy texture comes from slow cooking the beans until they start to break down naturally. Using a heavy-bottomed pot and simmering gently helps. Additionally, mashing a few beans against the pot's side during cooking releases starches that thicken the broth, creating that signature creamy consistency.",
    },
    {
      question: "What dishes pair well with Brazilian black beans?",
      answer:
        "Brazilian black beans are traditionally served with white rice, collard greens, farofa (toasted cassava flour), and slices of orange. They also complement grilled meats like picanha or chicken and can be used as a hearty base for stews or feijoada, Brazil’s famous black bean stew with pork.",
    },
    {
      question: "Can I prepare this recipe in a slow cooker or Instant Pot?",
      answer:
        "Yes! For a slow cooker, soak the beans overnight and cook on low for 6-8 hours with all ingredients. For an Instant Pot, use the 'Bean/Chili' setting and cook soaked beans for about 25-30 minutes under pressure. Adjust seasoning after cooking, as flavors intensify differently in these appliances.",
    },
    {
      question: "How should I store leftovers and reheat Brazilian black beans?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 4 days. When reheating, add a splash of water or broth to loosen the beans and warm gently on the stove over low heat, stirring occasionally to prevent sticking. You can also freeze portions for up to 3 months; thaw overnight in the fridge before reheating.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);
  const recipeJsonLd = getRecipeSchema({
    name: title,
    description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT1H30M",
    totalTime: "PT1H50M",
    recipeYield: `${servings} servings`,
    recipeCategory: "Side Dish",
    recipeCuisine: "Brazilian",
    keywords: "black beans, feijao preto, brazilian cuisine, staple food, creamy beans",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Rinse and soak dried black beans for 8-12 hours or overnight.",
      "Sauté diced bacon in a large pot until crispy, then sauté onion, garlic, and chili.",
      "Add drained beans, water, bay leaves, cumin, salt, pepper, and sugar to the pot.",
      "Simmer gently for 1 to 1.5 hours until beans are tender and creamy.",
      "Stir in orange juice and garnish with fresh cilantro before serving."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Black Beans"
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
            Brazilian Black Beans, or "Feijão Preto," are a cornerstone of Brazilian cuisine,
            cherished for their rich, creamy texture and deep, smoky flavor. This dish is
            traditionally served alongside white rice, creating a comforting and hearty meal
            that is both nutritious and satisfying. The slow simmering of black beans with
            aromatic ingredients like garlic, onion, and smoked bacon infuses the beans with
            layers of flavor, making it a beloved staple in homes and restaurants alike.
          </p>
          <p>
            The origins of black beans in Brazil trace back to indigenous peoples and the
            influence of Portuguese colonization, which introduced new cooking techniques and
            ingredients. Over centuries, this humble legume evolved into a national symbol,
            especially prominent in the iconic feijoada stew. Today, Brazilian Black Beans
            represent not only sustenance but also cultural heritage, bringing families
            together around the table.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Soak the Beans</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the dried black beans thoroughly under cold water. Place them in a large
              bowl and cover with at least 3 times their volume of cold water. Soak for 8 to 12
              hours or overnight to soften and reduce cooking time.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare Aromatics</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large pot, heat olive oil over medium heat. Add diced smoked bacon and cook
              until crispy. Remove bacon and set aside. In the same pot, sauté chopped onion,
              minced garlic, and sliced green chili (if using) until fragrant and translucent.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Beans</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Drain the soaked beans and add them to the pot with the sautéed aromatics. Pour
              in water and add bay leaves, cumin, salt, pepper, and sugar. Bring to a boil,
              then reduce heat to low and simmer gently, partially covered, for about 1 to 1.5
              hours or until beans are tender and creamy.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Finish and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the reserved crispy bacon and orange juice to brighten the flavors. Adjust
              seasoning to taste. Garnish with freshly chopped cilantro before serving hot with
              white rice and your favorite Brazilian sides.
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
            For a richer flavor, cook the beans low and slow, stirring occasionally to prevent
            sticking and mashing a few beans against the pot to thicken the broth naturally.
          </li>
          <li>
            Adding a splash of orange juice at the end balances the earthiness of the beans and
            adds a subtle brightness to the dish.
          </li>
          <li>
            If you prefer a vegetarian version, replace bacon with smoked paprika and sautéed
            mushrooms for umami depth.
          </li>
          <li>
            Use fresh herbs like cilantro or parsley as garnish to add freshness and color.
          </li>
          <li>
            Leftover beans can be blended into a creamy dip or spread, perfect for appetizers.
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
              href="https://en.wikipedia.org/wiki/Feijoada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Feijoada - Brazilian Black Bean Stew
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/feijoada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Feijoada and Brazilian Cuisine
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/brazilian-black-beans-feijao-preto-recipe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: Brazilian Black Beans Recipe
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