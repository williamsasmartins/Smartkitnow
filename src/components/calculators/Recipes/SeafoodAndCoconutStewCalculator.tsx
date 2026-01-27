import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function SeafoodAndCoconutStewCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Seafood%20and%20Coconut%20Stew%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=659"
  );

  // --- DATA ---
  const title = "Brazilian Seafood and Coconut Stew";
  const description = "Light and creamy shrimp stew with a strong coconut presence.";

  // INGREDIENTS
  const ingredients = [
    { name: "Shrimp (peeled and deveined)", baseAmount: 500, unit: "g" },
    { name: "Fresh fish fillets (e.g., cod or snapper)", baseAmount: 300, unit: "g" },
    { name: "Coconut milk", baseAmount: 400, unit: "ml" },
    { name: "Onion (finely chopped)", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves (minced)", baseAmount: 4, unit: "cloves" },
    { name: "Tomatoes (ripe, chopped)", baseAmount: 3, unit: "medium" },
    { name: "Bell pepper (red or yellow, sliced)", baseAmount: 1, unit: "medium" },
    { name: "Fresh cilantro (chopped)", baseAmount: 15, unit: "g" },
    { name: "Palm oil (dendê oil) or olive oil", baseAmount: 3, unit: "tbsp" },
    { name: "Lime juice", baseAmount: 2, unit: "tbsp" },
    { name: "Fish stock or water", baseAmount: 250, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh chili (optional, finely chopped)", baseAmount: 1, unit: "small" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "380",
    protein: "35g",
    carbs: "10g",
    fat: "20g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What types of seafood work best for this stew?",
      answer:
        "This stew is versatile and works well with a variety of seafood. Shrimp and firm white fish like cod, snapper, or sea bass are ideal because they hold their texture well during cooking. You can also add scallops or mussels for extra flavor and variety.",
    },
    {
      question: "Can I make this stew dairy-free?",
      answer:
        "Absolutely! This recipe is naturally dairy-free since it uses coconut milk for creaminess instead of dairy products. Just ensure that any additional ingredients or stock you use are also dairy-free.",
    },
    {
      question: "How can I adjust the spice level?",
      answer:
        "The recipe includes fresh chili as an optional ingredient. To make it milder, omit the chili or reduce the amount. For more heat, add extra fresh chili or a pinch of cayenne pepper. Remember to adjust gradually to suit your taste.",
    },
    {
      question: "What can I serve with Brazilian Seafood and Coconut Stew?",
      answer:
        "Traditionally, this stew is served with white rice to soak up the flavorful sauce. You can also serve it with crusty bread, farofa (toasted cassava flour), or a simple green salad for a complete meal.",
    },
    {
      question: "How do I store leftovers?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 2 days. Reheat gently on the stove over low heat to prevent the coconut milk from curdling. Avoid freezing as the texture of the seafood and coconut milk may change.",
    },
    {
      question: "Can I prepare this stew in advance?",
      answer:
        "You can prepare the base sauce (onions, garlic, tomatoes, and peppers) a day ahead and refrigerate it. Add the seafood and coconut milk just before cooking to ensure the seafood remains tender and fresh.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);
  const recipeJsonLd = getRecipeSchema({
    name: title,
    description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT10M",
    totalTime: "PT30M",
    recipeYield: `${servings} servings`,
    recipeCategory: "Main Course",
    recipeCuisine: "Brazilian",
    keywords: "seafood stew, coconut stew, moqueca, brazilian cuisine, shrimp, fish",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Rinse seafood and pat dry, cutting fish into bite-sized pieces.",
      "Sauté onion, garlic, and bell pepper in palm oil until softened.",
      "Add tomatoes and chili, then simmer with fish stock.",
      "Add seafood and coconut milk, season, and simmer for 8-10 minutes.",
      "Finish with cilantro and lime juice, and serve hot with rice."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Seafood and Coconut Stew"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          About this Recipe
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Brazilian Seafood and Coconut Stew, known locally as "Moqueca," is a vibrant,
            aromatic dish that beautifully combines the bounty of the sea with the creamy,
            tropical richness of coconut milk. This stew is a celebration of Brazil's coastal
            culinary heritage, blending fresh shrimp, fish, and vegetables simmered in a
            fragrant sauce infused with palm oil, garlic, and fresh herbs.
          </p>
          <p>
            Originating from the northeastern state of Bahia, Moqueca reflects the fusion of
            indigenous Brazilian, African, and Portuguese influences. The use of dendê (palm)
            oil and coconut milk is characteristic of Bahian cuisine, imparting a unique
            depth and creaminess to the stew. Traditionally cooked in clay pots, this dish
            is both comforting and exotic, perfect for sharing with family and friends.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Seafood</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the shrimp and fish fillets under cold water and pat dry with paper towels.
              If needed, cut the fish into bite-sized pieces. Set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté Aromatics</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat the palm oil or olive oil in a large pot over medium heat. Add the chopped onion,
              garlic, and bell pepper. Cook, stirring occasionally, until softened and fragrant,
              about 5 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Tomatoes and Simmer</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the chopped tomatoes and fresh chili (if using). Cook for another 5 minutes,
              allowing the tomatoes to break down. Pour in the fish stock or water and bring to a simmer.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Seafood and Coconut Milk</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Gently add the shrimp and fish pieces to the pot. Pour in the coconut milk and season
              with salt and black pepper. Cover and simmer gently for 8-10 minutes, or until the seafood
              is cooked through and tender.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Finish and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the chopped cilantro and lime juice just before serving. Adjust seasoning to taste.
              Serve hot with steamed white rice or crusty bread to soak up the delicious sauce.
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
            Use fresh, high-quality seafood for the best flavor and texture. Avoid overcooking the
            shrimp and fish to keep them tender.
          </li>
          <li>
            If you can't find palm oil (dendê), use a good quality extra virgin olive oil, but note
            the flavor will be different from traditional Bahian moqueca.
          </li>
          <li>
            For a smoky depth, try adding a small amount of smoked paprika or a dash of liquid smoke.
          </li>
          <li>
            To make the stew more vibrant, add diced fresh tomatoes and bell peppers just before
            serving as a garnish.
          </li>
          <li>
            Leftovers taste great the next day as the flavors meld, but always reheat gently to
            preserve the coconut milk's creaminess.
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
              href="https://en.wikipedia.org/wiki/Moqueca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Moqueca (Brazilian Seafood Stew)
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