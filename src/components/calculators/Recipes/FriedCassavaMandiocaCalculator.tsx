import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function FriedCassavaMandiocaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Fried%20Cassava%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1938"
  );

  // --- DATA ---
  const title = "Fried Cassava";
  const description = "Boiled and then deep-fried cassava batons, a perfect side.";

  // INGREDIENTS
  const ingredients = [
    { name: "Cassava (Mandioca), peeled and cut into batons", baseAmount: 500, unit: "g" },
    { name: "Water (for boiling)", baseAmount: 1500, unit: "ml" },
    { name: "Salt (for boiling water)", baseAmount: 1, unit: "tsp" },
    { name: "Vegetable oil (for deep frying)", baseAmount: 500, unit: "ml" },
    { name: "Garlic cloves, minced", baseAmount: 2, unit: "pcs" },
    { name: "Fresh parsley, chopped", baseAmount: 2, unit: "tbsp" },
    { name: "Black pepper, freshly ground", baseAmount: 0.5, unit: "tsp" },
    { name: "Paprika (optional)", baseAmount: 0.5, unit: "tsp" },
    { name: "Lime wedges (for serving)", baseAmount: 4, unit: "pcs" },
    { name: "Chili flakes (optional)", baseAmount: 0.25, unit: "tsp" },
    { name: "Onion powder", baseAmount: 0.5, unit: "tsp" },
    { name: "Cornstarch (for extra crispiness)", baseAmount: 1, unit: "tbsp" },
    { name: "Salt (to taste after frying)", baseAmount: 1, unit: "tsp" },
  ];

  // Nutrition estimates per 4 servings (approximate)
  const nutrition = {
    calories: "650",
    protein: "3g",
    carbs: "70g",
    fat: "40g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the best type of cassava to use for frying?",
      answer:
        "The best cassava for frying is fresh, firm, and free from any dark spots or bruises. Choose mature cassava roots with a firm texture and white flesh. Avoid cassava that feels soft or has a strong odor, as it may be spoiled or contain higher levels of cyanogenic compounds.",
    },
    {
      question: "Why do I need to boil cassava before frying?",
      answer:
        "Boiling cassava before frying ensures it cooks evenly and becomes tender inside while allowing the exterior to crisp up during frying. It also helps remove any residual toxins naturally present in raw cassava, making it safe to eat.",
    },
    {
      question: "Can I bake cassava instead of deep frying?",
      answer:
        "Yes, baking is a healthier alternative to deep frying. After boiling, toss the cassava batons with a little oil and your preferred seasonings, then bake in a preheated oven at 220°C (425°F) for about 25-30 minutes, turning halfway through until golden and crispy.",
    },
    {
      question: "How do I store leftover fried cassava?",
      answer:
        "Store leftover fried cassava in an airtight container in the refrigerator for up to 2 days. To reheat, bake in the oven or air fryer to restore crispiness rather than microwaving, which can make them soggy.",
    },
    {
      question: "What dipping sauces pair well with fried cassava?",
      answer:
        "Fried cassava pairs wonderfully with a variety of dips such as garlic aioli, spicy mayo, chimichurri, or even a simple squeeze of lime with salt and chili flakes. These enhance the flavor and complement the crispy texture.",
    },
    {
      question: "Is cassava gluten-free?",
      answer:
        "Yes, cassava is naturally gluten-free, making it an excellent carbohydrate option for those with gluten intolerance or celiac disease. However, always check any added ingredients or coatings for gluten if you have dietary restrictions.",
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
    recipeYield: `${servings} portions`,
    recipeCategory: "Appetizer",
    recipeCuisine: "Brazilian",
    keywords: "fried cassava, mandioca frita, brazilian snack, yuca, appetizer, fried root vegetable",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Peel cassava and cut into batons; rinse under cold water.",
      "Boil in salted water for 15-20 minutes until tender; drain and cool.",
      "Toss with garlic, parsley, spices, and cornstarch.",
      "Heat oil to 180°C (350°F) and fry batons for 3-5 minutes until golden.",
      "Drain on paper towels and serve hot with lime wedges."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Fried Cassava"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Fried Cassava, also known as mandioca frita in Brazil, is a beloved side dish made by boiling cassava root until tender and then deep-frying it to achieve a crispy golden exterior. This dish offers a delightful contrast of textures and a subtly sweet, nutty flavor that pairs perfectly with a variety of main courses. It is a staple in many Latin American, African, and Caribbean cuisines, celebrated for its simplicity and satisfying crunch.
          </p>
          <p>
            Cassava, or manioc, has been cultivated for thousands of years and is a vital carbohydrate source in tropical regions. Traditionally, cassava was prepared by indigenous peoples in South America, and over time, frying it became a popular method to enhance its flavor and texture. Today, fried cassava is enjoyed worldwide, often served with dips, sauces, or simply seasoned with salt and lime.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Cassava</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Peel the cassava roots carefully, removing the thick brown skin and the pinkish layer beneath. Cut the peeled cassava into batons or sticks about 1-2 cm thick. Rinse under cold water to remove excess starch.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Boil the Cassava</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large pot, bring water to a boil and add salt. Add the cassava pieces and cook for 15-20 minutes or until tender when pierced with a fork but not falling apart. Drain well and let cool slightly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Season and Coat</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Toss the boiled cassava with minced garlic, chopped parsley, black pepper, paprika, onion powder, and cornstarch for extra crispiness. Adjust salt to taste.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Deep Fry</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil in a deep pan or fryer to 180°C (350°F). Fry cassava batons in batches until golden brown and crispy, about 3-5 minutes per batch. Remove with a slotted spoon and drain on paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Sprinkle with additional salt if needed and chili flakes for a spicy kick. Serve hot with lime wedges on the side for squeezing over the cassava.
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
            To ensure extra crispiness, pat the boiled cassava dry thoroughly before seasoning and frying to avoid oil splatter and sogginess.
          </li>
          <li>
            Use a thermometer to maintain oil temperature around 180°C (350°F) for even frying and to prevent greasy cassava.
          </li>
          <li>
            For a smoky flavor, add a pinch of smoked paprika or chipotle powder to the seasoning mix.
          </li>
          <li>
            Leftover fried cassava can be reheated in an air fryer or oven to regain crispiness without drying out.
          </li>
          <li>
            Experiment with dipping sauces like garlic aioli, spicy ketchup, or chimichurri to complement the cassava’s natural sweetness.
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
              href="https://en.wikipedia.org/wiki/Cassava"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Cassava
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/plant/cassava"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Cassava Plant Overview
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/fried-cassava-recipe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: How to Make Fried Cassava
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