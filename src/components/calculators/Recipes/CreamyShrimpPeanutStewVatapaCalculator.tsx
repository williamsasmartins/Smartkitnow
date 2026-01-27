import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function CreamyShrimpPeanutStewVatapaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Creamy%20Shrimp%20and%20Peanut%20Stew%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6005"
  );

  // --- DATA ---
  const title = "Creamy Shrimp and Peanut Stew";
  const description = "Thick Afro-Brazilian paste made from bread, shrimp, and peanuts.";

  // INGREDIENTS
  const ingredients = [
    { name: "Raw Shrimp, peeled and deveined", baseAmount: 500, unit: "g" },
    { name: "Peanut Butter (smooth or chunky)", baseAmount: 150, unit: "g" },
    { name: "Stale White Bread, crust removed and soaked", baseAmount: 100, unit: "g" },
    { name: "Coconut Milk (full fat)", baseAmount: 400, unit: "ml" },
    { name: "Palm Oil (or substitute with vegetable oil)", baseAmount: 60, unit: "ml" },
    { name: "Onion, finely chopped", baseAmount: 150, unit: "g" },
    { name: "Garlic Cloves, minced", baseAmount: 4, unit: "cloves" },
    { name: "Fresh Tomatoes, chopped", baseAmount: 200, unit: "g" },
    { name: "Red Bell Pepper, chopped", baseAmount: 100, unit: "g" },
    { name: "Scotch Bonnet Pepper, deseeded and chopped", baseAmount: 1, unit: "piece" },
    { name: "Fresh Cilantro (coriander), chopped", baseAmount: 15, unit: "g" },
    { name: "Fish Stock or Water", baseAmount: 300, unit: "ml" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Ground Black Pepper", baseAmount: 1, unit: "tsp" },
  ];

  // Nutrition estimates per serving (approximate)
  const nutrition = {
    calories: "480",
    protein: "35g",
    carbs: "25g",
    fat: "28g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Vatapá and where does it originate from?",
      answer:
        "Vatapá is a traditional Afro-Brazilian dish originating from the northeastern state of Bahia. It is a creamy, rich stew made primarily from bread, shrimp, peanuts, and coconut milk, reflecting the fusion of African, Indigenous, and Portuguese culinary influences in Brazil.",
    },
    {
      question: "Can I substitute shrimp with other proteins in this stew?",
      answer:
        "Yes, while shrimp is traditional, you can substitute it with other seafood like crab or fish, or even chicken for a different twist. However, the flavor profile will vary, so adjust seasoning accordingly.",
    },
    {
      question: "How do I store leftovers and how long do they last?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 3 days. Reheat gently on the stove to avoid curdling the coconut milk. Vatapá can also be frozen for up to one month; thaw overnight in the fridge before reheating.",
    },
    {
      question: "Is it possible to make Vatapá vegan or vegetarian?",
      answer:
        "Absolutely! You can omit the shrimp and use vegetable stock instead of fish stock. Adding mushrooms or tofu can provide texture and protein. Ensure the peanut butter and other ingredients are free from animal products.",
    },
    {
      question: "What dishes pair well with Creamy Shrimp and Peanut Stew?",
      answer:
        "Vatapá is traditionally served with white rice and acarajé (black-eyed pea fritters). It also pairs wonderfully with steamed vegetables, fried plantains, or as a filling for tapioca crepes.",
    },
    {
      question: "How spicy is this stew and can I adjust the heat?",
      answer:
        "The stew has a moderate heat level from the scotch bonnet pepper, which can be quite spicy. You can adjust the heat by reducing or omitting the pepper or substituting with milder chili varieties to suit your taste.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);
  const recipeJsonLd = getRecipeSchema({
    name: title,
    description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT30M",
    totalTime: "PT50M",
    recipeYield: `${servings} servings`,
    recipeCategory: "Main Course",
    recipeCuisine: "Brazilian",
    keywords: "shrimp stew, vatapa, brazilian cuisine, peanut stew, afro-brazilian",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Soak stale bread in water or coconut milk until soft, and rinse shrimp.",
      "Sauté onions, garlic, and peppers in palm oil until fragrant.",
      "Blend soaked bread, peanut butter, and coconut milk until smooth.",
      "Add the blended mixture and tomatoes to the pan and simmer for 15-20 minutes.",
      "Add shrimp and cook until pink, then season with salt, pepper, and cilantro."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Creamy Shrimp and Peanut Stew"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 30m
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
            Creamy Shrimp and Peanut Stew, known as Vatapá, is a luscious and
            aromatic dish that beautifully marries the rich flavors of shrimp,
            peanuts, and coconut milk. This thick stew is beloved in Afro-Brazilian
            cuisine, especially in Bahia, where it is often enjoyed during festive
            occasions and family gatherings. The combination of creamy peanut
            butter and the subtle sweetness of coconut milk creates a velvety
            texture that coats tender shrimp and soft bread, resulting in a
            comforting and deeply satisfying meal.
          </p>
          <p>
            Vatapá’s origins trace back to the African diaspora in Brazil, blending
            indigenous Brazilian ingredients with African culinary traditions and
            Portuguese influences. Traditionally, it was prepared by enslaved
            Africans using accessible ingredients like peanuts and seafood,
            evolving into a celebrated dish that represents cultural resilience
            and fusion. Today, Vatapá remains a symbol of Bahia’s rich heritage,
            often served alongside acarajé or white rice, offering a taste of
            history and community in every bite.
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
              Prepare the Bread and Shrimp
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Tear the stale white bread into small pieces and soak it in a little
              warm water or coconut milk until soft. Meanwhile, rinse the shrimp,
              pat dry, and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté Aromatics and Peppers
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat the palm oil in a large pan over medium heat. Add the chopped
              onions, garlic, red bell pepper, and scotch bonnet pepper. Cook until
              softened and fragrant, about 5-7 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Blend Bread and Peanuts
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a blender or food processor, combine the soaked bread, peanut
              butter, and coconut milk. Blend until smooth and creamy. Add this
              mixture to the sautéed aromatics in the pan.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Simmer the Stew
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the chopped tomatoes and fish stock (or water) to the pan. Stir
              well and bring to a gentle simmer. Cook for 15-20 minutes, stirring
              occasionally to prevent sticking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Shrimp and Season
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the shrimp to the stew and cook until they turn pink and opaque,
              about 5-7 minutes. Season with salt, black pepper, and chopped
              cilantro. Adjust seasoning to taste.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Enjoy
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the creamy shrimp and peanut stew hot, ideally over steamed
              white rice or with traditional sides like acarajé. Enjoy the rich,
              comforting flavors of this Afro-Brazilian classic.
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
            Use palm oil for authentic flavor and vibrant color, but substitute
            with vegetable or peanut oil if unavailable.
          </li>
          <li>
            Soaking the bread well is crucial to achieve the stew’s creamy texture.
            Avoid using fresh bread as it won’t absorb liquids properly.
          </li>
          <li>
            Adjust the heat by controlling the amount of scotch bonnet pepper or
            removing the seeds to reduce spiciness.
          </li>
          <li>
            For a smoother stew, blend the peanut butter and bread mixture until
            completely creamy before adding to the pan.
          </li>
          <li>
            Fresh cilantro added at the end brightens the stew and adds a fresh
            herbal note.
          </li>
          <li>
            Leftovers taste even better the next day as the flavors meld further.
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
              href="https://en.wikipedia.org/wiki/Vatap%C3%A1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Vatapá
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
      jsonLd={[faqJsonLd, recipeJsonLd]}
      hideLegalDisclaimer={true}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}