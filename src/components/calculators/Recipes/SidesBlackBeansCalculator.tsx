import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SidesBlackBeansCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Seasoned%20Black%20Beans%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=133"
  );

  // --- DATA ---
  const title = "Seasoned Black Beans";
  const description = "Daily essential bowl of slow-cooked seasoned black beans.";

  // INGREDIENTS
  const ingredients = [
    { name: "Dried Black Beans", baseAmount: 500, unit: "g" },
    { name: "Water", baseAmount: 1200, unit: "ml" },
    { name: "Yellow Onion, finely chopped", baseAmount: 150, unit: "g" },
    { name: "Garlic Cloves, minced", baseAmount: 4, unit: "cloves" },
    { name: "Olive Oil", baseAmount: 2, unit: "tbsp" },
    { name: "Ground Cumin", baseAmount: 1, unit: "tsp" },
    { name: "Dried Oregano", baseAmount: 1, unit: "tsp" },
    { name: "Bay Leaf", baseAmount: 1, unit: "leaf" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Red Chili Flakes (optional)", baseAmount: 0.25, unit: "tsp" },
    { name: "Fresh Cilantro, chopped (for garnish)", baseAmount: 15, unit: "g" },
    { name: "Lime Juice (freshly squeezed)", baseAmount: 1, unit: "tbsp" },
    { name: "Vegetable Broth (optional, to replace water)", baseAmount: 1200, unit: "ml" },
  ];

  // Nutrition per 4 servings (approximate)
  const nutrition = {
    calories: "320",
    protein: "21g",
    carbs: "55g",
    fat: "5g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use canned black beans instead of dried beans?",
      answer:
        "Yes, canned black beans can be used for convenience. Rinse them thoroughly to remove excess sodium and reduce cooking time by skipping the soaking and long simmering steps. Adjust seasoning accordingly as canned beans may already contain salt.",
    },
    {
      question: "How do I store leftover seasoned black beans?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 4 days. You can also freeze cooked beans for up to 3 months. When reheating, add a splash of water or broth to maintain moisture and heat gently to avoid drying out.",
    },
    {
      question: "What are some common variations to this recipe?",
      answer:
        "You can add smoked paprika or chipotle powder for a smoky flavor, include diced tomatoes for a richer sauce, or stir in sautéed bell peppers and jalapeños for extra heat and texture. Experiment with fresh herbs like parsley or oregano to suit your taste.",
    },
    {
      question: "Is it necessary to soak dried black beans before cooking?",
      answer:
        "Soaking dried black beans for 6-8 hours or overnight helps reduce cooking time and improves digestibility by breaking down complex sugars. However, if short on time, you can cook them unsoaked but expect longer simmering and slightly firmer texture.",
    },
    {
      question: "How can I make this recipe vegan and gluten-free?",
      answer:
        "This recipe is naturally vegan and gluten-free as it uses plant-based ingredients and no gluten-containing additives. Just ensure any broth used is gluten-free and avoid cross-contamination if you have severe allergies.",
    },
    {
      question: "What dishes pair well with seasoned black beans?",
      answer:
        "Seasoned black beans complement rice dishes, tacos, burritos, grilled meats, roasted vegetables, and salads. They also work well as a hearty side for Latin American, Caribbean, and Southwestern cuisines.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Seasoned Black Beans"
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
            Seasoned Black Beans are a staple side dish in many Latin American and Caribbean cuisines. This recipe features slow-cooked black beans simmered with aromatic spices and fresh ingredients to create a rich, hearty, and flavorful bowl that complements a wide variety of meals. The beans are tender yet hold their shape, infused with the warmth of cumin, oregano, and garlic, balanced by the brightness of fresh lime and cilantro.
          </p>
          <p>
            Black beans have been cultivated for thousands of years in the Americas and have played an essential role in traditional diets due to their high protein and fiber content. This recipe draws inspiration from classic Cuban and Mexican preparations, where black beans are often seasoned simply but thoughtfully to highlight their natural earthiness and create a comforting, nutritious side dish.
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
              Rinse the dried black beans thoroughly under cold water. Place them in a large bowl and cover with plenty of water. Soak for at least 6 hours or overnight to reduce cooking time and improve digestibility. Drain and rinse before cooking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté Aromatics</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large pot, heat olive oil over medium heat. Add the finely chopped onion and sauté until translucent, about 5 minutes. Stir in the minced garlic and cook for another 1-2 minutes until fragrant.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Beans and Spices</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the soaked and drained black beans to the pot. Stir in ground cumin, dried oregano, bay leaf, salt, black pepper, and red chili flakes if using. Mix well to coat the beans with the spices.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Simmer the Beans</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in water or vegetable broth and bring to a boil. Reduce heat to low, cover partially, and simmer gently for about 50-60 minutes or until beans are tender but not mushy. Stir occasionally and add more liquid if necessary.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Finish and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove from heat and discard the bay leaf. Stir in fresh lime juice and chopped cilantro for brightness. Adjust seasoning with salt and pepper to taste. Serve warm as a side dish or over rice.
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
            For a creamier texture, mash some of the beans gently with the back of a spoon during the last 10 minutes of cooking.
          </li>
          <li>
            Adding a splash of vinegar or a bit of dark chocolate at the end can deepen the flavor complexity.
          </li>
          <li>
            Use homemade or low-sodium broth to control salt levels and enhance flavor.
          </li>
          <li>
            If short on time, use a pressure cooker or Instant Pot to reduce cooking time significantly.
          </li>
          <li>
            Garnish with diced fresh tomatoes or avocado slices for added freshness and texture.
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
              href="https://en.wikipedia.org/wiki/Black_bean"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Black Bean
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.bonappetit.com/story/how-to-cook-black-beans"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Bon Appétit: How to Cook Black Beans Perfectly
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