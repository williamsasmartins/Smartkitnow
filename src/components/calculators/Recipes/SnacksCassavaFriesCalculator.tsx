import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function SnacksCassavaFriesCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Cassava%20Fries%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8407"
  );

  // --- DATA ---
  const title = "Cassava Fries";
  const description = "Starchy fries served with dipping sauces or just salt.";

  // INGREDIENTS
  const ingredients = [
    { name: "Cassava (peeled and cut into fries)", baseAmount: 500, unit: "g" },
    { name: "Vegetable oil (for frying)", baseAmount: 500, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Garlic powder", baseAmount: 0.5, unit: "tsp" },
    { name: "Paprika", baseAmount: 0.5, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.25, unit: "tsp" },
    { name: "Fresh parsley (chopped)", baseAmount: 1, unit: "tbsp" },
    { name: "Water (for boiling)", baseAmount: 1000, unit: "ml" },
    { name: "Lemon wedges (for serving)", baseAmount: 4, unit: "pcs" },
    { name: "Optional: chili powder", baseAmount: 0.25, unit: "tsp" },
    { name: "Optional: ketchup or aioli (for dipping)", baseAmount: 100, unit: "g" },
  ];

  // Nutrition per 4 servings (approximate)
  const nutrition = {
    calories: "560",
    protein: "2g",
    carbs: "60g",
    fat: "35g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is cassava and why use it for fries?",
      answer:
        "Cassava, also known as yuca or manioc, is a starchy root vegetable widely used in tropical regions. It has a firm texture and mild flavor, making it an excellent alternative to potatoes for fries. Cassava fries are crisp on the outside and tender inside, offering a unique taste and texture.",
    },
    {
      question: "How do I prepare cassava before frying?",
      answer:
        "Cassava must be peeled thoroughly to remove the thick brown skin and the white inner rind. Then, cut into fry-sized sticks and boiled briefly until just tender but not falling apart. This step ensures the fries cook evenly and achieve a crispy exterior when fried.",
    },
    {
      question: "Can I bake cassava fries instead of frying?",
      answer:
        "Yes, baking is a healthier alternative. After boiling and drying the cassava sticks, toss them with oil and seasoning, then bake in a preheated oven at 220°C (425°F) for about 25-30 minutes, turning halfway through until golden and crisp.",
    },
    {
      question: "What dipping sauces pair well with cassava fries?",
      answer:
        "Cassava fries pair wonderfully with a variety of dips such as garlic aioli, spicy ketchup, chimichurri, or even simple lemon wedges to brighten the flavor. You can customize the dipping sauce to your taste preferences.",
    },
    {
      question: "Are cassava fries gluten-free and suitable for special diets?",
      answer:
        "Yes, cassava is naturally gluten-free, making these fries suitable for gluten-sensitive individuals. They are also vegan and can fit into paleo and grain-free diets, depending on the oil and seasoning used.",
    },
    {
      question: "How to store and reheat leftover cassava fries?",
      answer:
        "Store leftover fries in an airtight container in the refrigerator for up to 2 days. To reheat, bake them in a preheated oven at 200°C (400°F) for 5-10 minutes to restore crispiness. Avoid microwaving as it can make them soggy.",
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
    recipeCategory: "Snack",
    recipeCuisine: "Brazilian",
    keywords: "cassava fries, mandioca frita, brazilian snack, yuca fries, gluten-free, appetizer",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Peel cassava and cut into sticks.",
      "Boil in water for 10-15 minutes until just tender.",
      "Drain and pat dry thoroughly.",
      "Season with salt, garlic powder, and paprika.",
      "Deep fry at 180°C (350°F) for 3-5 minutes until golden brown."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Cassava Fries"
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
            Cassava fries are a delicious and hearty alternative to traditional potato fries. Made from the starchy root vegetable cassava, these fries offer a unique texture that is crispy on the outside and tender on the inside. They are perfect as a snack or side dish and can be enjoyed with a variety of dipping sauces or simply salted to taste.
          </p>
          <p>
            Originating from tropical regions of South America and Africa, cassava has been a staple food for centuries. Its versatility and nutritional profile have made it popular worldwide. Cassava fries have gained popularity in many cuisines as a gluten-free and flavorful option, celebrated for their satisfying crunch and subtle sweetness.
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
              Peel the cassava roots carefully to remove the thick brown skin and the white inner layer. Cut the peeled cassava into fry-sized sticks, about 1 cm thick.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Boil the Cassava</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the cassava sticks in a pot of boiling water and cook for 10-15 minutes until just tender but not falling apart. Drain and pat dry thoroughly with a clean towel.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Season the Fries</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Toss the boiled cassava fries with salt, garlic powder, paprika, black pepper, and optional chili powder for a spicy kick.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Fry the Cassava</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil in a deep fryer or heavy-bottomed pot to 180°C (350°F). Fry the cassava sticks in batches until golden brown and crispy, about 3-5 minutes. Remove with a slotted spoon and drain on paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Garnish and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Sprinkle chopped fresh parsley over the fries and serve immediately with lemon wedges and your favorite dipping sauces.
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
            Ensure cassava is peeled properly to avoid any bitterness or toxins; the skin and inner rind should be completely removed.
          </li>
          <li>
            Dry the cassava fries thoroughly after boiling to prevent oil splatter and achieve maximum crispiness.
          </li>
          <li>
            Fry in small batches to maintain oil temperature and avoid soggy fries.
          </li>
          <li>
            For a healthier option, try baking the fries with a light coating of oil at high heat until crispy.
          </li>
          <li>
            Experiment with seasoning blends like smoked paprika, cumin, or curry powder for unique flavor profiles.
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
              Britannica: Cassava Plant
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/cassava-fries-recipe-3029336"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Cassava Fries Recipe
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