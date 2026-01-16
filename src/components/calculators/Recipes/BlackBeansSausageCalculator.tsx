import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BlackBeansSausageCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Black%20Beans%20with%20Sausage%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=7042"
  );

  // --- DATA ---
  const title = "Black Beans with Sausage";
  const description = "Hearty black beans simmered with smoked calabresa sausage.";

  // INGREDIENTS
  const ingredients = [
    { name: "Black beans (dry)", baseAmount: 250, unit: "g" },
    { name: "Calabresa sausage (smoked, sliced)", baseAmount: 200, unit: "g" },
    { name: "Yellow onion (medium, diced)", baseAmount: 1, unit: "pc" },
    { name: "Garlic cloves (minced)", baseAmount: 4, unit: "cloves" },
    { name: "Green bell pepper (diced)", baseAmount: 1, unit: "pc" },
    { name: "Carrot (medium, diced)", baseAmount: 1, unit: "pc" },
    { name: "Tomato paste", baseAmount: 2, unit: "tbsp" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Bay leaves", baseAmount: 2, unit: "leaves" },
    { name: "Smoked paprika", baseAmount: 1, unit: "tsp" },
    { name: "Ground cumin", baseAmount: 1, unit: "tsp" },
    { name: "Chicken or vegetable broth", baseAmount: 750, unit: "ml" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh cilantro (chopped, optional)", baseAmount: 2, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "28g",
    carbs: "35g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use canned black beans instead of dry beans?",
      answer:
        "Yes, canned black beans can be used to save time. Rinse and drain them well before adding to the recipe. Reduce the cooking time since canned beans are already cooked, and adjust the broth quantity accordingly to avoid excess liquid.",
    },
    {
      question: "What type of sausage works best for this recipe?",
      answer:
        "Traditionally, smoked calabresa sausage is used for its robust flavor and slight spiciness. However, you can substitute with other smoked sausages like andouille or chorizo depending on your preference. Avoid fresh sausages as they may alter the flavor profile.",
    },
    {
      question: "How do I make this dish vegetarian or vegan?",
      answer:
        "To make a vegetarian or vegan version, omit the sausage and use vegetable broth instead of chicken broth. You can add smoked paprika and liquid smoke to mimic the smoky flavor. Adding mushrooms or smoked tofu can also provide a savory depth.",
    },
    {
      question: "Can I prepare this recipe in a slow cooker?",
      answer:
        "Absolutely! Soak the dry black beans overnight, then combine all ingredients in the slow cooker. Cook on low for 6-8 hours or on high for 3-4 hours until beans are tender and flavors meld beautifully.",
    },
    {
      question: "How should I store leftovers and how long do they last?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 4 days. The flavors often deepen after a day. You can also freeze portions for up to 3 months. Reheat gently on the stove or microwave, adding a splash of broth if needed.",
    },
    {
      question: "What side dishes pair well with Black Beans with Sausage?",
      answer:
        "This hearty dish pairs wonderfully with steamed white rice, crusty bread, or cornbread. A fresh green salad or sautéed greens like kale or collard greens complement the richness and add balance to the meal.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Black Beans with Sausage"
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
            Black Beans with Sausage is a comforting and hearty dish that combines the rich,
            earthy flavors of black beans with the smoky, spicy notes of calabresa sausage.
            This recipe is perfect for a satisfying weeknight meal or a cozy weekend dinner.
            The beans are slow-simmered to tender perfection, absorbing the savory essence of
            the sausage and aromatic vegetables.
          </p>
          <p>
            The origins of this dish trace back to Brazilian and Portuguese culinary traditions,
            where black beans are a staple ingredient. Calabresa sausage, a smoked pork sausage
            with roots in Italy, was introduced to Brazil and became a beloved addition to many
            bean stews. This fusion of flavors reflects the rich cultural tapestry of Brazilian
            cuisine, celebrated for its bold and comforting dishes.
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
              Rinse the dry black beans thoroughly and soak them in cold water for at least 6 hours
              or overnight. This helps reduce cooking time and improves digestibility.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Sausage and Vegetables</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Slice the calabresa sausage into thin rounds. Dice the onion, bell pepper, and carrot.
              Mince the garlic cloves.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté Aromatics and Sausage</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a large pot over medium heat. Add the sausage slices and cook until
              browned and slightly crispy. Remove and set aside. In the same pot, add onion, garlic,
              bell pepper, and carrot. Sauté until softened and fragrant, about 5-7 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Beans and Seasonings</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Drain the soaked beans and add them to the pot along with tomato paste, bay leaves,
              smoked paprika, cumin, salt, and black pepper. Stir well to combine.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Simmer the Beans</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the broth and bring the mixture to a boil. Reduce heat to low, cover, and simmer
              gently for about 50-60 minutes or until the beans are tender. Stir occasionally and add
              water or broth if needed to maintain desired consistency.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Finish and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Return the cooked sausage to the pot and stir to combine. Adjust seasoning to taste.
              Garnish with chopped fresh cilantro if desired. Serve hot with rice or crusty bread.
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
            Soaking the beans overnight not only reduces cooking time but also helps improve
            digestibility and texture.
          </li>
          <li>
            Browning the sausage first adds a deep smoky flavor and renders fat that enhances the
            dish.
          </li>
          <li>
            Use homemade or low-sodium broth to control salt levels and boost flavor naturally.
          </li>
          <li>
            For a thicker stew, mash some of the cooked beans against the pot’s side and stir.
          </li>
          <li>
            Leftovers taste even better the next day as the flavors continue to meld.
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
              Wikipedia: Feijoada (Brazilian Black Bean Stew)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/sausage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Sausage Overview
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