import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function BrazilianSeafoodStewCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Seafood%20Stew%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4485"
  );

  // --- DATA ---
  const title = "Brazilian Seafood Stew";
  const description = "A medley of fresh seafood simmered in a fragrant broth.";

  // INGREDIENTS
  const ingredients = [
    { name: "White fish fillets (e.g., cod or snapper)", baseAmount: 400, unit: "g" },
    { name: "Shrimp, peeled and deveined", baseAmount: 200, unit: "g" },
    { name: "Squid rings", baseAmount: 150, unit: "g" },
    { name: "Olive oil", baseAmount: 3, unit: "tbsp" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 4, unit: "cloves" },
    { name: "Red bell pepper, sliced", baseAmount: 1, unit: "medium" },
    { name: "Tomatoes, chopped", baseAmount: 400, unit: "g" },
    { name: "Coconut milk", baseAmount: 400, unit: "ml" },
    { name: "Fish stock or water", baseAmount: 250, unit: "ml" },
    { name: "Fresh cilantro, chopped", baseAmount: 2, unit: "tbsp" },
    { name: "Lime juice", baseAmount: 1, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh chili (optional), sliced", baseAmount: 1, unit: "small" },
  ];

  // Nutrition estimates per serving (approximate)
  const nutrition = {
    calories: "350",
    protein: "35g",
    carbs: "10g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What types of seafood work best for this stew?",
      answer:
        "This stew is versatile and works well with firm white fish like cod, snapper, or sea bass, along with shrimp and squid. Fresh seafood ensures the best flavor and texture. You can also add scallops or mussels if desired.",
    },
    {
      question: "Can I make this stew spicy?",
      answer:
        "Absolutely! The recipe includes an optional fresh chili for heat. You can adjust the amount or add chili flakes or hot sauce to suit your spice preference. Brazilian cuisine often balances heat with creamy coconut milk.",
    },
    {
      question: "How do I store leftovers?",
      answer:
        "Store any leftovers in an airtight container in the refrigerator for up to 2 days. Reheat gently on the stove to avoid overcooking the seafood, which can become tough if overheated.",
    },
    {
      question: "Is this stew gluten-free?",
      answer:
        "Yes, this Brazilian Seafood Stew is naturally gluten-free as it contains no wheat or gluten-containing ingredients. Always check your fish stock or any packaged ingredients to ensure they are gluten-free.",
    },
    {
      question: "What can I serve with Brazilian Seafood Stew?",
      answer:
        "Traditionally, this stew is served with white rice or crusty bread to soak up the flavorful broth. You can also serve it alongside sautéed vegetables or a fresh green salad for a complete meal.",
    },
    {
      question: "Can I prepare this stew in advance?",
      answer:
        "You can prepare the base broth and vegetables a day ahead and refrigerate. Add the seafood just before serving to maintain its delicate texture and freshness.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);
  const recipeJsonLd = getRecipeSchema({
    name: title,
    description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT25M",
    totalTime: "PT45M",
    recipeYield: `${servings} servings`,
    recipeCategory: "Main Course",
    recipeCuisine: "Brazilian",
    keywords: "seafood stew, moqueca, brazilian cuisine, shrimp, fish",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Rinse seafood and cut fish into bite-sized pieces.",
      "Sauté onions, garlic, and red bell pepper in olive oil until softened.",
      "Add tomatoes and cook until breaking down, then stir in stock and coconut milk.",
      "Simmer the fish for 5 minutes, then add shrimp and squid for another 5-7 minutes.",
      "Season with salt, pepper, and lime juice, then garnish with cilantro and chili."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Seafood Stew"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 25m
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
            Brazilian Seafood Stew, known locally as "Moqueca," is a vibrant and aromatic dish
            that beautifully showcases the bounty of Brazil's coastal waters. This stew combines
            fresh fish, shrimp, and squid simmered gently in a fragrant broth of coconut milk,
            tomatoes, and herbs, creating a rich and comforting meal that is both hearty and
            refreshing.
          </p>
          <p>
            Originating from the northeastern state of Bahia, Moqueca reflects the cultural fusion
            of indigenous Brazilian, African, and Portuguese influences. Traditionally cooked in
            a clay pot called a "moqueca," this dish has become a beloved staple across Brazil,
            celebrated for its bold flavors and colorful presentation. The use of coconut milk and
            palm oil in Bahian versions adds a creamy texture and depth, while other regional
            variations incorporate local spices and ingredients.
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
              Rinse the fish fillets, shrimp, and squid rings under cold water and pat dry with
              paper towels. Cut the fish into bite-sized pieces and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté Aromatics</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a large pot over medium heat. Add chopped onions, garlic, and red
              bell pepper. Sauté until softened and fragrant, about 5 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Tomatoes and Simmer</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the chopped tomatoes and cook for 5 minutes until they start breaking down.
              Pour in the fish stock (or water) and coconut milk, then bring to a gentle simmer.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Seafood</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the fish pieces first and cook for 5 minutes. Then add shrimp and squid rings,
              cooking for another 5-7 minutes until all seafood is opaque and cooked through.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Finish and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Season with salt, black pepper, and lime juice. Stir in chopped cilantro and sliced
              chili if using. Serve hot with white rice or crusty bread.
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
            Use fresh, high-quality seafood for the best flavor and texture. Avoid overcooking to keep
            the seafood tender.
          </li>
          <li>
            If you can't find fish stock, use water with a splash of white wine or seafood bouillon
            for added depth.
          </li>
          <li>
            For a traditional Bahian touch, substitute olive oil with dendê (palm) oil, available in
            specialty stores.
          </li>
          <li>
            Adjust the thickness of the stew by adding more or less coconut milk and stock according
            to your preference.
          </li>
          <li>
            Garnish with fresh herbs like cilantro or parsley and a squeeze of lime to brighten the
            flavors just before serving.
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