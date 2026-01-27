import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function ShrimpStewMoquecaDeCamaraoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Shrimp%20Stew%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8484"
  );

  // --- DATA ---
  const title = "Brazilian Shrimp Stew";
  const description = "Succulent shrimp cooked in a fragrant palm oil and coconut sauce.";

  // INGREDIENTS
  const ingredients = [
    { name: "Shrimp (peeled and deveined)", baseAmount: 500, unit: "g" },
    { name: "Palm oil (Dendê oil)", baseAmount: 3, unit: "tbsp" },
    { name: "Coconut milk", baseAmount: 400, unit: "ml" },
    { name: "Onion (medium, sliced)", baseAmount: 1, unit: "pc" },
    { name: "Red bell pepper (sliced)", baseAmount: 1, unit: "pc" },
    { name: "Tomatoes (ripe, chopped)", baseAmount: 3, unit: "pcs" },
    { name: "Garlic cloves (minced)", baseAmount: 3, unit: "pcs" },
    { name: "Fresh cilantro (chopped)", baseAmount: 15, unit: "g" },
    { name: "Lime juice", baseAmount: 1, unit: "tbsp" },
    { name: "Fish stock or water", baseAmount: 200, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Green chili (optional, sliced)", baseAmount: 1, unit: "pc" },
    { name: "Olive oil", baseAmount: 1, unit: "tbsp" },
  ];

  // Nutrition per serving approx (4 servings)
  const nutrition = {
    calories: "350",
    protein: "30g",
    carbs: "10g",
    fat: "20g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Moqueca de Camarão?",
      answer:
        "Moqueca de Camarão is a traditional Brazilian shrimp stew originating from the coastal regions of Bahia and Espírito Santo. It features shrimp cooked in a rich, aromatic sauce made with palm oil, coconut milk, tomatoes, and fresh herbs, delivering a vibrant and flavorful dish.",
    },
    {
      question: "Can I substitute palm oil if I can't find it?",
      answer:
        "Palm oil (dendê oil) is essential for authentic flavor and color in Moqueca. However, if unavailable, you can substitute with a mix of olive oil and annatto oil or use extra virgin olive oil alone, though the dish will have a milder taste and less vibrant color.",
    },
    {
      question: "How do I prevent the shrimp from becoming rubbery?",
      answer:
        "To keep shrimp tender, avoid overcooking. Add the shrimp towards the end of the cooking process and simmer just until they turn pink and opaque, usually 3-5 minutes depending on size.",
    },
    {
      question: "Can I make this dish ahead of time?",
      answer:
        "Moqueca is best enjoyed fresh to preserve the texture of the shrimp and the brightness of the sauce. However, you can prepare the sauce base a day ahead and refrigerate it. Add and cook the shrimp just before serving.",
    },
    {
      question: "What side dishes pair well with Brazilian Shrimp Stew?",
      answer:
        "Traditionally, Moqueca is served with white rice and farofa (toasted cassava flour). You can also serve it with crusty bread to soak up the delicious sauce or a simple green salad for a balanced meal.",
    },
    {
      question: "Is Moqueca spicy?",
      answer:
        "Moqueca can be mildly spicy depending on the amount of chili used. The recipe includes an optional green chili for a gentle heat, but you can adjust or omit it according to your spice preference.",
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
    keywords: "shrimp stew, moqueca de camarao, brazilian cuisine, seafood, coconut milk, dende oil",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Sauté onions, bell peppers, and garlic in olive and palm oil until fragrant.",
      "Add chopped tomatoes and green chili, then simmer until tomatoes break down.",
      "Pour in coconut milk and stock, then simmer for 10 minutes.",
      "Add shrimp and cook for 3-5 minutes until pink and opaque.",
      "Finish with fresh cilantro and lime juice, then serve."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Shrimp Stew"
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
            Moqueca de Camarão, or Brazilian Shrimp Stew, is a vibrant and aromatic dish that
            beautifully showcases the flavors of Brazil’s coastal cuisine. This stew combines fresh
            shrimp with a luscious sauce made from palm oil, coconut milk, tomatoes, and fragrant
            herbs, resulting in a rich and comforting meal that is both hearty and refreshing.
          </p>
          <p>
            Originating from the northeastern state of Bahia, Moqueca reflects the cultural fusion
            of indigenous Brazilian, African, and Portuguese influences. The use of dendê (palm oil)
            and coconut milk is a hallmark of Bahian cooking, lending the stew its distinctive
            color and depth. Traditionally cooked in a clay pot, this dish has become a beloved
            staple across Brazil and beyond.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Peel and devein the shrimp if not already done. Slice the onion, bell pepper, and
              green chili (if using). Chop the tomatoes and cilantro. Mince the garlic cloves.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté Aromatics</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil and palm oil in a large pan over medium heat. Add the sliced onions,
              bell pepper, and garlic. Cook until softened and fragrant, about 5 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Tomatoes and Simmer</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the chopped tomatoes and green chili. Cook for 5-7 minutes until the tomatoes
              break down and form a sauce.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Liquids and Season</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the coconut milk and fish stock or water. Season with salt and black pepper.
              Bring to a gentle simmer and cook for 10 minutes to meld the flavors.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Shrimp</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the shrimp to the simmering sauce and cook for 3-5 minutes until they turn pink
              and opaque. Avoid overcooking to keep them tender.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Finish and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in fresh cilantro and lime juice. Adjust seasoning if needed. Serve hot with
              white rice and farofa or crusty bread.
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
            Use fresh, high-quality shrimp for the best texture and flavor. Wild-caught is preferred.
          </li>
          <li>
            If you want a smoky depth, lightly char the bell peppers before adding them to the stew.
          </li>
          <li>
            Adjust the amount of palm oil carefully; too much can overpower the dish, but too little
            loses the authentic flavor.
          </li>
          <li>
            For a vegetarian version, substitute shrimp with firm tofu or hearts of palm and use
            vegetable stock.
          </li>
          <li>
            Serve immediately after cooking to enjoy the shrimp at their tender best.
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
              Wikipedia: Moqueca
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.brazil.org.za/brazilian-food.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Brazil.org.za: Brazilian Food & Cuisine
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