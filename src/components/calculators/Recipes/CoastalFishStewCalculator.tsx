import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function CoastalFishStewCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Fish%20Stew%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8372"
  );

  // --- DATA ---
  const title = "Brazilian Fish Stew";
  const description = "Moqueca prepared with white fish, peppers, and coconut milk.";

  // INGREDIENTS
  const ingredients = [
    { name: "White Fish Fillets (e.g., cod, snapper)", baseAmount: 500, unit: "g" },
    { name: "Lime Juice", baseAmount: 2, unit: "tbsp" },
    { name: "Sea Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Olive Oil", baseAmount: 3, unit: "tbsp" },
    { name: "Onion, thinly sliced", baseAmount: 1, unit: "medium" },
    { name: "Red Bell Pepper, sliced", baseAmount: 1, unit: "medium" },
    { name: "Yellow Bell Pepper, sliced", baseAmount: 1, unit: "medium" },
    { name: "Garlic Cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Tomatoes, chopped", baseAmount: 400, unit: "g" },
    { name: "Coconut Milk", baseAmount: 400, unit: "ml" },
    { name: "Fresh Cilantro, chopped", baseAmount: 0.5, unit: "cup" },
    { name: "Green Onions, chopped", baseAmount: 2, unit: "stalks" },
    { name: "Dendê Oil (Palm Oil) or extra olive oil", baseAmount: 2, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "38g",
    carbs: "12g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of fish is best for Brazilian Fish Stew?",
      answer:
        "Firm white fish such as cod, snapper, sea bass, or halibut work best for Moqueca. These fish hold their shape well during cooking and absorb the flavors of the stew without becoming mushy.",
    },
    {
      question: "Can I make this stew spicy?",
      answer:
        "Absolutely! Traditional Moqueca can be mildly spicy or quite hot depending on the region. You can add chopped fresh chili peppers or a pinch of cayenne pepper to the stew to increase heat according to your preference.",
    },
    {
      question: "What is dendê oil and can I substitute it?",
      answer:
        "Dendê oil, or palm oil, is a traditional ingredient in Bahian Moqueca that gives the stew its characteristic color and flavor. If unavailable, you can substitute with extra virgin olive oil, but the flavor and color will be less authentic.",
    },
    {
      question: "How do I store leftovers?",
      answer:
        "Store leftover stew in an airtight container in the refrigerator for up to 2 days. Reheat gently on the stove over low heat to avoid overcooking the fish. The flavors often deepen after resting overnight.",
    },
    {
      question: "Can I prepare this recipe ahead of time?",
      answer:
        "You can prepare the base sauce (onions, peppers, tomatoes, garlic, and coconut milk) a day ahead and refrigerate it. Add the fish and cook just before serving to ensure the fish remains tender and fresh.",
    },
    {
      question: "What should I serve with Brazilian Fish Stew?",
      answer:
        "Traditionally, Moqueca is served with white rice and farofa (toasted cassava flour). You can also serve it with crusty bread to soak up the delicious broth.",
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
    keywords: "fish stew, moqueca, brazilian cuisine, seafood, coconut milk, dende oil",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Marinate fish fillets with lime juice, salt, and pepper for 15 minutes.",
      "Sauté onions, bell peppers, and garlic in olive and dendê oil until fragrant.",
      "Add chopped tomatoes and simmer with coconut milk.",
      "Nestle fish fillets into the sauce and cook for 10-15 minutes until opaque.",
      "Garnish with fresh cilantro and green onions, then serve over rice."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Fish Stew"
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
            Brazilian Fish Stew, known locally as Moqueca, is a vibrant and aromatic dish
            that captures the essence of Brazil's coastal culinary traditions. This stew
            combines fresh white fish with colorful bell peppers, tomatoes, and creamy
            coconut milk, simmered gently to create a rich and flavorful broth. The
            addition of dendê oil, or palm oil, lends a distinctive golden hue and
            subtle earthiness that makes this dish truly unique.
          </p>
          <p>
            Originating from the northeastern state of Bahia, Moqueca reflects the
            cultural fusion of indigenous Brazilian, African, and Portuguese influences.
            Traditionally cooked in a clay pot, this stew is a celebration of fresh,
            local ingredients and bold flavors. It is often enjoyed with rice and farofa,
            making it a hearty and satisfying meal perfect for sharing with family and
            friends.
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
              Prepare the Fish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the white fish fillets and pat them dry. Marinate with lime juice,
              salt, and black pepper. Set aside for 15 minutes to allow the flavors to
              infuse.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté Aromatics and Vegetables
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil and dendê oil in a large pan over medium heat. Add sliced
              onions, red and yellow bell peppers, and garlic. Cook until softened and
              fragrant, about 5-7 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Tomatoes and Simmer
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the chopped tomatoes and cook for another 5 minutes until they
              begin to break down. Pour in the coconut milk and bring the mixture to a
              gentle simmer.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Fish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Gently nestle the marinated fish fillets into the simmering sauce. Cover
              and cook for 10-15 minutes, or until the fish is opaque and flakes easily
              with a fork.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Finish and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Sprinkle chopped cilantro and green onions over the stew. Serve hot with
              steamed white rice and farofa or crusty bread to soak up the delicious
              broth.
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
            Use fresh, firm white fish for the best texture and flavor. Avoid fish that
            flakes apart easily before cooking.
          </li>
          <li>
            If dendê oil is unavailable, extra virgin olive oil is a good substitute,
            but the stew will lack the characteristic color and aroma.
          </li>
          <li>
            Marinate the fish briefly with lime juice and salt to enhance its natural
            flavors without overpowering the stew.
          </li>
          <li>
            Cook the fish gently and avoid stirring too much once added to prevent it
            from breaking apart.
          </li>
          <li>
            For a smoky depth, try adding a small amount of smoked paprika or a chipotle
            pepper.
          </li>
          <li>
            Garnish generously with fresh cilantro and green onions to brighten the
            dish.
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
              href="https://en.wikipedia.org/wiki/Moqueca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Moqueca (Brazilian Fish Stew)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/Moqueca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Moqueca Culinary Reference
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