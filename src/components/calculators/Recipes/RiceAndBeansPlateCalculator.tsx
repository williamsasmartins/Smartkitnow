import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function RiceAndBeansPlateCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Rice%20and%20Beans%20Plate%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9118"
  );

  // --- DATA ---
  const title = "Rice and Beans Plate";
  const description = 'The iconic "Feijão com Arroz" foundation of Brazilian cuisine.';

  // INGREDIENTS
  const ingredients = [
    { name: "Long Grain White Rice", baseAmount: 200, unit: "g" },
    { name: "Black Beans (dried)", baseAmount: 250, unit: "g" },
    { name: "Water (for cooking rice)", baseAmount: 400, unit: "ml" },
    { name: "Water (for soaking beans)", baseAmount: 1000, unit: "ml" },
    { name: "Onion (medium, finely chopped)", baseAmount: 1, unit: "pc" },
    { name: "Garlic Cloves (minced)", baseAmount: 3, unit: "pcs" },
    { name: "Olive Oil", baseAmount: 2, unit: "tbsp" },
    { name: "Bay Leaf", baseAmount: 2, unit: "pcs" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black Pepper (freshly ground)", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh Cilantro (chopped, optional)", baseAmount: 2, unit: "tbsp" },
    { name: "Green Bell Pepper (small, diced)", baseAmount: 0.5, unit: "pc" },
    { name: "Vegetable Broth (optional, for beans)", baseAmount: 500, unit: "ml" },
    { name: "Lime Wedges (for serving)", baseAmount: 4, unit: "pcs" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "450",
    protein: "18g",
    carbs: "75g",
    fat: "6g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use canned beans instead of dried beans?",
      answer:
        "Yes, canned beans can be used to save time. Rinse them thoroughly before cooking and reduce the cooking time accordingly since canned beans are already cooked. Adjust seasoning as canned beans may contain added salt.",
    },
    {
      question: "What type of rice works best for this dish?",
      answer:
        "Long grain white rice is preferred for its fluffy texture and ability to stay separate when cooked. However, you can also use jasmine or basmati rice for a fragrant twist.",
    },
    {
      question: "How can I make this recipe vegan and gluten-free?",
      answer:
        "This recipe is naturally vegan and gluten-free as it uses plant-based ingredients without any gluten-containing additives. Just ensure your vegetable broth (if used) is gluten-free.",
    },
    {
      question: "Can I prepare the beans in a pressure cooker?",
      answer:
        "Absolutely! Using a pressure cooker significantly reduces the cooking time for dried beans. Soak the beans for at least 4 hours, then cook under pressure for about 20-25 minutes until tender.",
    },
    {
      question: "What are some good side dishes to serve with Rice and Beans Plate?",
      answer:
        "This dish pairs wonderfully with sautéed collard greens, fried plantains, fresh salads, or grilled meats. Adding a fresh lime wedge enhances the flavors beautifully.",
    },
    {
      question: "How do I store leftovers and how long do they last?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 3 days. Reheat gently on the stove or microwave. Beans tend to thicken when stored; add a splash of water when reheating if needed.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);
  const recipeJsonLd = getRecipeSchema({
    name: title,
    description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT1H",
    totalTime: "PT1H20M",
    recipeYield: `${servings} servings`,
    recipeCategory: "Main Course",
    recipeCuisine: "Brazilian",
    keywords: "rice and beans, feijao com arroz, brazilian cuisine, staple meal, vegetarian",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Soak black beans for at least 4 hours or overnight.",
      "Simmer beans with bay leaves and onion for 45-60 minutes until tender.",
      "Sauté rice with onion, garlic, and bell pepper, then simmer for 15-18 minutes.",
      "Season beans with sautéed garlic oil, salt, and pepper.",
      "Plate rice and beans together, garnish with cilantro and lime wedges."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Rice and Beans Plate"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 60m
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
            The Rice and Beans Plate, known as "Feijão com Arroz" in Brazil, is a
            beloved staple that forms the heart of Brazilian cuisine. This simple yet
            flavorful dish combines perfectly cooked white rice with tender black beans
            simmered in aromatic herbs and spices. It is a wholesome, comforting meal
            enjoyed across households and restaurants alike.
          </p>
          <p>
            Historically, rice and beans have been a dietary cornerstone in many Latin
            American countries due to their nutritional balance and affordability.
            The Brazilian version is particularly famous for its rich, slow-cooked beans
            infused with garlic, onions, and bay leaves, served alongside fluffy rice.
            This dish symbolizes community, tradition, and the vibrant flavors of
            Brazil’s culinary heritage.
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
              Soak and Prepare Beans
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the dried black beans thoroughly and soak them in 1000 ml of water
              for at least 4 hours or overnight. This helps reduce cooking time and
              improves digestibility.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Beans
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Drain the soaked beans and place them in a pot with fresh water or
              vegetable broth (about 500 ml). Add bay leaves and half the chopped
              onion. Bring to a boil, then reduce heat and simmer gently for 45-60
              minutes until beans are tender. Stir occasionally and add water if
              needed.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Rice
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the rice under cold water until water runs clear. In a separate
              pot, heat 1 tbsp olive oil and sauté the remaining onion, garlic, and
              diced green bell pepper until fragrant. Add the rice and stir to coat
              grains. Pour in 400 ml water, add salt, and bring to a boil. Cover and
              simmer on low heat for 15-18 minutes until water is absorbed and rice is
              fluffy.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Season the Beans
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a small pan, heat 1 tbsp olive oil and sauté minced garlic until
              golden. Add this garlic oil to the cooked beans along with black pepper
              and adjust salt to taste. Stir gently to combine and let simmer for 5
              more minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Plate and Garnish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the rice and beans side by side on a plate. Garnish with freshly
              chopped cilantro and lime wedges for squeezing over the dish. Enjoy warm
              as a hearty main or side.
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
            Soaking beans overnight not only reduces cooking time but also helps
            improve their texture and digestibility.
          </li>
          <li>
            Use fresh garlic and sauté it gently to avoid bitterness and bring out
            its natural sweetness.
          </li>
          <li>
            For extra flavor, cook beans with a smoked ham hock or bacon if not
            vegan.
          </li>
          <li>
            Rinsing rice before cooking removes excess starch and prevents clumping,
            resulting in fluffy grains.
          </li>
          <li>
            Adjust seasoning gradually and taste frequently to balance salt and spice
            levels perfectly.
          </li>
          <li>
            Leftover rice and beans can be transformed into delicious burritos or
            stuffed peppers.
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
              href="https://en.wikipedia.org/wiki/Feijoada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Feijoada and Brazilian Cuisine
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/Feijoada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Feijoada Overview
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/brazilian-black-beans-rice-feijao-com-arroz-recipe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: Feijão com Arroz Recipe
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